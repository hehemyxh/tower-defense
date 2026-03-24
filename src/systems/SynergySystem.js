/**
 * SynergySystem.js
 * 羁绊激活判断 + BuffManager 注入
 * 在 Worker 内运行，每次 placeTower / removeTower 后调用 recalc(player)
 */
'use strict';

// SynergySystem 依赖 BuffManager（在 Worker 里已内联）
const SynergySystem = {
  /** 羁绊配置，由 init 消息注入：synergies.json 的内容 */
  _defs: [],

  /** 初始化：传入 synergies.json 数据 */
  init(synergiesDef) {
    this._defs = synergiesDef || [];
  },

  /**
   * 重新计算某玩家的羁绊状态，自动应用/撤销对应 Buff
   * @param {object} player - Worker 内的 player 对象 (有 towers[])
   */
  recalc(player) {
    if (!this._defs.length) return;

    // 统计场上各羁绊 ID 的激活数量
    const counts = {};  // synId → count
    for (const tower of player.towers) {
      const charDef = _CHAR_MAP[tower.charId];
      if (!charDef) continue;
      for (const synId of (charDef.syns || [])) {
        counts[synId] = (counts[synId] || 0) + 1;
      }
    }

    // 对每个羁绊定义：判断当前激活的 tier，并应用/撤销 Buff
    for (const synDef of this._defs) {
      const count = counts[synDef.id] || 0;
      // 找到当前激活的最高 tier
      let activeTier = null;
      for (const tier of (synDef.tiers || [])) {
        if (count >= tier.need) activeTier = tier;
      }

      // 对场上所有属于该羁绊的塔，处理 Buff
      for (const tower of player.towers) {
        const charDef = _CHAR_MAP[tower.charId];
        if (!charDef || !(charDef.syns || []).includes(synDef.id)) continue;

        // 先移除该羁绊的所有旧 Buff
        const synSource = 'synergy_' + synDef.id;
        BuffManager.removeBySource(tower, synSource);

        // 若有激活 tier，注入新 Buff
        if (activeTier && activeTier.buffDefs) {
          for (const buffDef of activeTier.buffDefs) {
            const def = Object.assign({}, buffDef, { source: synSource });
            BuffManager.apply(tower, def);
          }
        }
      }
    }

    // 同步更新 player.activeSynergies（用于快照/UI 展示）
    player.activeSynergies = [];
    for (const synDef of this._defs) {
      const count = counts[synDef.id] || 0;
      let activeTier = null;
      for (const tier of (synDef.tiers || [])) {
        if (count >= tier.need) activeTier = tier;
      }
      if (activeTier) {
        player.activeSynergies.push({
          id: synDef.id,
          name: synDef.name,
          count,
          tier: activeTier.need
        });
      }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SynergySystem };
} else {
  // Worker / Browser 全局
  if (typeof self !== 'undefined') self.SynergySystem = SynergySystem;
  else if (typeof window !== 'undefined') window.SynergySystem = SynergySystem;
}
