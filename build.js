#!/usr/bin/env node
/**
 * build.js
 * 将模块化游戏打包为单一可分发的 dist/index.html
 *
 * 策略:
 * 1. 读取原始 index.html 的 HTML/CSS 结构（保留 <head> + <body>）
 * 2. 将 data/*.json 以 <script type="application/json"> 标签内联
 * 3. 将 src/systems/*.js、src/data/DataLoader.js 按顺序拼接为主线程脚本
 * 4. 将 src/worker.js（若存在）内容内联为 Worker Blob 字符串
 * 5. 输出 dist/index.html
 *
 * 运行: node build.js
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const DATA_DIR= path.join(ROOT, 'data');
const DIST_DIR= path.join(ROOT, 'dist');
const ORIG_HTML = path.join(ROOT, 'index.html');

// 确保 dist 目录存在
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

console.log('🔨 开始构建 dist/index.html...\n');

// ── Step 1: 读取原始 HTML ──────────────────────────────────
if (!fs.existsSync(ORIG_HTML)) {
  console.error('❌ 未找到 index.html，请先确保原始文件存在');
  process.exit(1);
}
let html = fs.readFileSync(ORIG_HTML, 'utf8');
console.log(`  ✓ 读取 index.html (${(html.length / 1024).toFixed(1)} KB)`);

// ── Step 2: 内联所有 JSON 数据文件 ────────────────────────
const JSON_FILES = [
  { file: 'chars.json',        id: 'data-chars' },
  { file: 'enemies.json',      id: 'data-enemies' },
  { file: 'waves.json',        id: 'data-waves' },
  { file: 'synergies.json',    id: 'data-synergies' },
  { file: 'items.json',        id: 'data-items' },
  { file: 'talismans.json',    id: 'data-talismans' },
  { file: 'gacha_tiers.json',  id: 'data-gacha-tiers' },
  { file: 'skills.json',       id: 'data-skills' },
  { file: 'map.json',          id: 'data-map' },
];

let inlineDataTags = '\n  <!-- ═══ 内联 JSON 配置数据（由 build.js 生成）═══ -->\n';
for (const { file, id } of JSON_FILES) {
  const jsonPath = path.join(DATA_DIR, file);
  if (!fs.existsSync(jsonPath)) {
    console.warn(`  ⚠ 跳过 ${file}（文件不存在）`);
    continue;
  }
  const content = fs.readFileSync(jsonPath, 'utf8');
  // 压缩 JSON（移除多余空白，减小体积）
  const minified = JSON.stringify(JSON.parse(content));
  inlineDataTags += `  <script type="application/json" id="${id}">${minified}</script>\n`;
  console.log(`  ✓ 内联 ${file} → #${id} (${(minified.length / 1024).toFixed(1)} KB)`);
}

// ── Step 3: 拼接模块 JS 代码 ──────────────────────────────
// 加载顺序：BuffSystem → SynergySystem → DataLoader → WorkerBridge → 其他系统
const MODULE_ORDER = [
  'src/systems/BuffSystem.js',
  'src/systems/SynergySystem.js',
  'src/data/DataLoader.js',
  'src/systems/WorkerBridge.js',
  // 其他系统模块（排除 .test.js）
];

// 自动发现 src/systems/ 下其他未列出的 .js 文件（排除测试文件）
if (fs.existsSync(path.join(SRC_DIR, 'systems'))) {
  const sysFiles = fs.readdirSync(path.join(SRC_DIR, 'systems'))
    .filter(f => f.endsWith('.js') && !f.endsWith('.test.js'))
    .map(f => `src/systems/${f}`)
    .filter(f => !MODULE_ORDER.includes(f));
  MODULE_ORDER.push(...sysFiles);
}

// 若存在 src/main.js，最后加入
if (fs.existsSync(path.join(SRC_DIR, 'main.js'))) {
  MODULE_ORDER.push('src/main.js');
}

let modulesCode = '\n// ════ 模块化系统代码（由 build.js 注入）════\n';
for (const relPath of MODULE_ORDER) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;
  const code = fs.readFileSync(fullPath, 'utf8');
  modulesCode += `\n// ── ${relPath} ──\n`;
  // 移除 CommonJS 导出语句（浏览器不需要）
  const browserCode = code
    .replace(/if\s*\(typeof module[\s\S]*?module\.exports[\s\S]*?\}\s*(\n|$)/g, '')
    .replace(/^'use strict';\n?/m, '');
  modulesCode += browserCode + '\n';
  console.log(`  ✓ 合并模块 ${relPath} (${(code.length / 1024).toFixed(1)} KB)`);
}

// ── Step 4: 注入模块代码到 Worker (WK 字符串) ──────────────
// 将 SkillProcessor 注入到 Worker 的 WK 模板字符串开头
const SKILL_PROC_SRC = path.join(SRC_DIR, 'systems/SkillProcessor.js');
if (fs.existsSync(SKILL_PROC_SRC)) {
  const spCode = fs.readFileSync(SKILL_PROC_SRC, 'utf8')
    .replace(/if\s*\(typeof module[\s\S]*?\}\s*(\n|$)/g, '')
    .replace(/^'use strict';\n?/m, '');
  const wkIdx = html.indexOf('const WK = `');
  if (wkIdx !== -1) {
    // 检查 Worker 中是否已包含 SkillProcessor（避免重复注入）
    const wkEnd = html.indexOf('`;', wkIdx + 10);
    const wkBody = wkEnd !== -1 ? html.slice(wkIdx, wkEnd) : '';
    if (wkBody.includes('SkillProcessor')) {
      console.log(`  ✓ Worker WK 已包含 SkillProcessor，跳过注入`);
    } else {
      const insertPos = wkIdx + 'const WK = `'.length;
      const injected = `\n// ── SkillProcessor.js (Worker 内联 by build.js) ──\n${spCode.replace(/`/g, '\\`')}\n`;
      html = html.slice(0, insertPos) + injected + html.slice(insertPos);
      console.log(`  ✓ 注入 SkillProcessor.js 到 Worker WK (${(spCode.length / 1024).toFixed(1)} KB)`);
    }
  }
}

const WORKER_SRC = path.join(SRC_DIR, 'worker.js');
if (fs.existsSync(WORKER_SRC)) {
  const workerCode = fs.readFileSync(WORKER_SRC, 'utf8');
  // 将 worker.js 内联到现有 WK 模板字符串替换处
  // 如果 html 中已有 const WK = `...`，用新内容替换
  const wkStart = html.indexOf('const WK = `');
  const wkEnd = html.indexOf('`;', wkStart + 10);
  if (wkStart !== -1 && wkEnd !== -1) {
    // 注入 BuffSystem + SynergySystem 代码到 Worker
    const buffCode = fs.readFileSync(path.join(SRC_DIR, 'systems/BuffSystem.js'), 'utf8')
      .replace(/if\s*\(typeof module[\s\S]*?\}\s*(\n|$)/g, '')
      .replace(/^'use strict';\n?/m, '');
    const synCode = fs.readFileSync(path.join(SRC_DIR, 'systems/SynergySystem.js'), 'utf8')
      .replace(/if\s*\(typeof module[\s\S]*?\}\s*(\n|$)/g, '')
      .replace(/^'use strict';\n?/m, '');
    const newWorkerContent = `\n// ── src/systems/BuffSystem.js (Worker 内联) ──\n${buffCode}\n// ── src/systems/SynergySystem.js (Worker 内联) ──\n${synCode}\n// ── src/worker.js ──\n${workerCode}\n`;
    html = html.slice(0, wkStart) + 'const WK = `' + newWorkerContent.replace(/`/g, '\\`') + '`' + html.slice(wkEnd + 2);
    console.log(`  ✓ 内联 src/worker.js 到 WK Blob`);
  } else {
    console.warn('  ⚠ 未找到 WK 模板字符串，worker.js 未内联');
  }
}

// ── Step 5: 注入模块代码 + JSON 数据标签 ──────────────────
// 在 </body> 前插入内联数据标签和模块代码
const bodyClose = html.lastIndexOf('</body>');
if (bodyClose === -1) {
  console.error('❌ HTML 中未找到 </body>，无法注入代码');
  process.exit(1);
}

// 注入内联 JSON 数据标签（在所有 <script> 之前，放到 <head> 末尾）
const headClose = html.indexOf('</head>');
if (headClose !== -1) {
  html = html.slice(0, headClose) + inlineDataTags + html.slice(headClose);
}

// 注入模块代码（在 </body> 前）
const newBodyClose = html.lastIndexOf('</body>');
html = html.slice(0, newBodyClose)
  + `\n<script>\n${modulesCode}\n</script>\n`
  + html.slice(newBodyClose);

// ── Step 6: 写出 dist/index.html ──────────────────────────
const DIST_FILE = path.join(DIST_DIR, 'index.html');
fs.writeFileSync(DIST_FILE, html, 'utf8');

const sizeMB = (html.length / 1024 / 1024).toFixed(2);
const sizeKB = (html.length / 1024).toFixed(1);
console.log(`\n✅ 构建完成！`);
console.log(`   输出: dist/index.html`);
console.log(`   大小: ${sizeKB} KB (${sizeMB} MB)`);

if (html.length > 500 * 1024) {
  console.warn(`   ⚠ 文件超过 500KB，建议检查是否有冗余代码`);
} else {
  console.log(`   ✓ 大小合理（< 500KB）`);
}

console.log('\n💡 提示:');
console.log('   - 直接在浏览器双击 dist/index.html 即可运行');
console.log('   - 运行 node dev.js 启动开发服务器（支持实时 JSON 修改）');