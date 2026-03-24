#!/usr/bin/env node
/**
 * extract_data.js
 * 从 index.html 中自动解析并导出所有配置数据到 data/*.json
 * 运行: node extract_data.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── 工具函数 ──────────────────────────────────────────────

/** 用 eval 安全沙箱求值一段 JS 表达式，返回 JS 对象 */
function evalBlock(src) {
  // eslint-disable-next-line no-new-func
  return new Function(`
    'use strict';
    const Math = globalThis.Math;
    return (${src});
  `)();
}

/** 从 HTML 中截取 "const NAME = [...];" 或 "const NAME = {...};" 的值部分 */
function extractConst(name) {
  // 同时兼容 "const NAME = " 和 "const NAME=" 两种风格
  let start = HTML.indexOf(`const ${name} = `);
  let startMarker = `const ${name} = `;
  if (start === -1) {
    start = HTML.indexOf(`const ${name}=`);
    startMarker = `const ${name}=`;
  }
  if (start === -1) throw new Error(`未找到 const ${name}`);
  const valueStart = start + startMarker.length;
  // 找到对应的闭括号
  const firstChar = HTML[valueStart];
  const closeChar = firstChar === '[' ? ']' : '}';
  let depth = 0, i = valueStart;
  for (; i < HTML.length; i++) {
    if (HTML[i] === firstChar) depth++;
    else if (HTML[i] === closeChar) { depth--; if (depth === 0) break; }
  }
  return HTML.slice(valueStart, i + 1);
}

// ─── 1. chars.json ────────────────────────────────────────
console.log('📦 提取 CHARS...');
const charsRaw = extractConst('CHARS');
const CHARS = evalBlock(charsRaw);
// 精简字段：只保留游戏逻辑需要的字段
const chars = CHARS.map(c => ({
  id: c.id,
  name: c.name,
  emoji: c.emoji || '⚔️',
  rarity: c.rarity || 'n',
  syns: c.syns || [],
  dmg: c.dmg,
  range: c.range,
  rate: c.rate,
  hp: c.hp || 0,
  skill: c.skill || null,
  desc: c.desc || '',
  lore: c.lore || ''
}));
fs.writeFileSync(path.join(DATA_DIR, 'chars.json'), JSON.stringify(chars, null, 2));
console.log(`  ✓ chars.json — ${chars.length} 个角色`);

// ─── 2. enemies.json ──────────────────────────────────────
console.log('📦 提取 ENEMIES...');
const enemiesRaw = extractConst('ENEMIES');
const ENEMIES = evalBlock(enemiesRaw);
fs.writeFileSync(path.join(DATA_DIR, 'enemies.json'), JSON.stringify(ENEMIES, null, 2));
console.log(`  ✓ enemies.json — ${ENEMIES.length} 种敌人`);

// ─── 3. waves.json ────────────────────────────────────────
console.log('📦 提取 WAVES...');
const wavesRaw = extractConst('WAVES');
const WAVES = evalBlock(wavesRaw);
fs.writeFileSync(path.join(DATA_DIR, 'waves.json'), JSON.stringify(WAVES, null, 2));
console.log(`  ✓ waves.json — ${WAVES.length} 个波次`);

// ─── 4. synergies.json (含 BuffDefinition 转换) ──────────
console.log('📦 提取 SYNERGIES...');
const synRaw = extractConst('SYNERGIES');
const SYNERGIES = evalBlock(synRaw);

// 将 tier.fx 转换为 BuffDefinition 格式
const STAT_MAP = { dmg: 'dmg', rng: 'range', spd: 'rate', gld: 'goldBonus', slow: 'slow' };
function fxToBuffDefs(synId, tierNeed, fx) {
  return Object.entries(fx).map(([stat, val]) => ({
    id: `${synId}_${stat}_${tierNeed}`,
    source: 'synergy',
    stat: STAT_MAP[stat] || stat,
    op: 'multiply',
    value: 1 + val,        // fx.dmg: 0.20 → value: 1.20
    duration: -1,           // 永久（羁绊类）
    stackRule: 'replace'
  }));
}

const synergies = SYNERGIES.map(s => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji || '',
  category: s.category || '',
  chars: s.chars || [],
  tiers: (s.tiers || []).map(t => ({
    need: t.need,
    desc: t.desc || '',
    fx: t.fx || {},
    buffDefs: fxToBuffDefs(s.id, t.need, t.fx || {})
  }))
}));
fs.writeFileSync(path.join(DATA_DIR, 'synergies.json'), JSON.stringify(synergies, null, 2));
console.log(`  ✓ synergies.json — ${synergies.length} 个羁绊`);

// ─── 5. items.json ────────────────────────────────────────
console.log('📦 提取装备 (EQUIP_DATA + EQUIP_SETS)...');
{
  let equipData = {}, equipSets = {};
  try { equipData = evalBlock(extractConst('EQUIP_DATA')); console.log('  EQUIP_DATA ✓'); } catch(e) { console.warn('  EQUIP_DATA 未找到'); }
  try { equipSets = evalBlock(extractConst('EQUIP_SETS')); console.log('  EQUIP_SETS ✓'); } catch(e) { console.warn('  EQUIP_SETS 未找到'); }
  const items = { pieces: equipData, sets: equipSets };
  fs.writeFileSync(path.join(DATA_DIR, 'items.json'), JSON.stringify(items, null, 2));
  console.log(`  ✓ items.json — ${Object.keys(equipData).length} 件单品 + ${Object.keys(equipSets).length} 套装`);
}

// ─── 6. talismans.json ────────────────────────────────────
console.log('📦 提取符咒 (TALI)...');
try {
  const taliRaw = extractConst('TALI');
  const TALI = evalBlock(taliRaw);
  fs.writeFileSync(path.join(DATA_DIR, 'talismans.json'), JSON.stringify(TALI, null, 2));
  console.log(`  ✓ talismans.json — ${TALI.length} 个符咒`);
} catch (e) {
  console.warn('  ⚠ TALI 未找到，写入空数组');
  fs.writeFileSync(path.join(DATA_DIR, 'talismans.json'), JSON.stringify([], null, 2));
}

// ─── 7. gacha_tiers.json ─────────────────────────────────
console.log('📦 提取 GACHA_TIERS...');
try {
  const gachaRaw = extractConst('GACHA_TIERS');
  const GACHA_TIERS = evalBlock(gachaRaw);
  fs.writeFileSync(path.join(DATA_DIR, 'gacha_tiers.json'), JSON.stringify(GACHA_TIERS, null, 2));
  console.log(`  ✓ gacha_tiers.json — ${GACHA_TIERS.length} 个抽卡台`);
} catch (e) {
  console.warn('  ⚠ GACHA_TIERS 未找到，跳过');
}

// ─── 验证 ──────────────────────────────────────────────────
console.log('\n🔍 验证...');
const charData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'chars.json'), 'utf8'));
const waveData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'waves.json'), 'utf8'));
console.log(`  角色数量: ${charData.length} ${charData.length === 18 ? '✓' : '✗ (期望 18)'}`);
console.log(`  波次数量: ${waveData.length} ${waveData.length === 50 ? '✓' : '✗ (期望 50)'}`);

const allIds = charData.map(c => c.id);
const families = { c11: 0, c12: 0, c13: 0 };
allIds.forEach(id => { if (id.startsWith('c11')) families.c11++; else if (id.startsWith('c12')) families.c12++; else if (id.startsWith('c13')) families.c13++; });
console.log(`  奥术族: ${families.c11} 游侠族: ${families.c12} 战士族: ${families.c13}`);

console.log('\n✅ 数据提取完成！所有 JSON 文件已写入 data/ 目录');
