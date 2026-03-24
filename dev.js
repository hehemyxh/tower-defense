#!/usr/bin/env node
/**
 * dev.js — 开发模式服务器
 * 提供 HTTP 服务，支持直接读取 src/ 和 data/ 目录（无需构建）
 * 运行: node dev.js  或  npm run dev
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);

  // 安全检查：不允许访问 ROOT 外部
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404); res.end(`Not Found: ${urlPath}`); return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n🎮 开发服务器启动！`);
  console.log(`   地址: ${url}`);
  console.log(`   模式: 开发模式（直接读取 src/ 和 data/，修改 JSON 后刷新浏览器即生效）`);
  console.log(`   停止: Ctrl+C\n`);

  // 自动打开浏览器
  const cmd = process.platform === 'win32' ? `start ${url}`
    : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  exec(cmd, (err) => { if (err) console.log(`   手动打开: ${url}`); });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用，请关闭其他服务后重试`);
  } else {
    console.error('❌ 服务器错误:', e.message);
  }
  process.exit(1);
});
