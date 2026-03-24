/**
 * DataLoader.js
 * 统一加载 data/*.json，支持 inline（构建产物）和 fetch（开发模式）两种模式
 * 加载完成后所有数据通过 GameData 全局对象访问
 */
'use strict';

// ── 全局数据容器 ────────────────────────────────────────────
const GameData = {
  chars: [],
  enemies: [],
  waves: [],
  synergies: [],
  items: {},
  talismans: [],
  gachaTiers: [],
  // 快速查找 Map（loadAll 完成后自动构建）
  CHAR_MAP: {},
  ENEMY_MAP: {},
};

// ── DataLoader ──────────────────────────────────────────────
const DataLoader = {
  /**
   * 加载所有配置数据
   * - inline 模式（dist/index.html）：从 <script type="application/json"> 读取
   * - fetch 模式（开发模式）：从 data/*.json 请求
   * @returns {Promise<GameData>}
   */
  async loadAll() {
    const files = [
      { key: 'chars',      id: 'data-chars',       path: 'data/chars.json' },
      { key: 'enemies',    id: 'data-enemies',      path: 'data/enemies.json' },
      { key: 'waves',      id: 'data-waves',        path: 'data/waves.json' },
      { key: 'synergies',  id: 'data-synergies',    path: 'data/synergies.json' },
      { key: 'items',      id: 'data-items',        path: 'data/items.json' },
      { key: 'talismans',  id: 'data-talismans',    path: 'data/talismans.json' },
      { key: 'gachaTiers', id: 'data-gacha-tiers',  path: 'data/gacha_tiers.json' },
    ];

    const results = await Promise.all(files.map(f => this._load(f)));

    // 注入 GameData
    for (const { key, data } of results) {
      GameData[key] = data;
    }

    // 构建查找 Map
    this._buildMaps();

    return GameData;
  },

  /** 从 inline script 标签或 fetch 加载单个数据文件 */
  async _load({ key, id, path }) {
    // 优先尝试 inline 模式
    const inlineEl = document.getElementById(id);
    if (inlineEl && inlineEl.type === 'application/json') {
      try {
        const data = JSON.parse(inlineEl.textContent);
        return { key, data };
      } catch (e) {
        throw new Error(`[DataLoader] 解析 #${id} 失败: ${e.message}`);
      }
    }

    // fallback: fetch
    let resp;
    try {
      resp = await fetch(path);
    } catch (e) {
      throw new Error(`[DataLoader] fetch ${path} 失败: ${e.message}。请用 HTTP 服务器或构建产物。`);
    }
    if (!resp.ok) throw new Error(`[DataLoader] ${path} 返回 ${resp.status}`);
    const data = await resp.json();
    return { key, data };
  },

  /** 构建 CHAR_MAP 和 ENEMY_MAP 快速查找索引 */
  _buildMaps() {
    GameData.CHAR_MAP = {};
    for (const c of GameData.chars) {
      GameData.CHAR_MAP[c.id] = c;
    }
    GameData.ENEMY_MAP = {};
    for (const e of GameData.enemies) {
      GameData.ENEMY_MAP[e.id] = e;
    }
  },
};

// ── 导出 ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataLoader, GameData };
} else {
  window.DataLoader = DataLoader;
  window.GameData = GameData;
}
