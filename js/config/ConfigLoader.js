/**
 * ConfigLoader — 从内嵌数据加载所有游戏配置
 * 不依赖 fetch/HTTP，支持直接双击 index.html（file:// 协议）运行
 */

import {
  RAW_EFFECTS,
  RAW_SKILLS,
  RAW_TOWERS,
  RAW_ENEMIES,
  RAW_MAPS,
  RAW_WAVES,
} from './GameData.js';

/** 将数组配置转为 id→object 的 Map，方便 O(1) 查询 */
function buildIndex(arr) {
  const map = new Map();
  for (const item of arr) map.set(item.id, item);
  return map;
}

/**
 * 加载所有配置（同步数据，异步接口保持兼容）
 * @param {function(number):void} [onProgress]  进度回调 0~1
 * @returns {Promise<object>} GameConfig
 */
export async function loadAllConfigs(onProgress) {
  // 模拟加载进度，让 UI 有反馈
  const steps = [
    { label: '加载效果配置…',  pct: 0.2 },
    { label: '加载技能配置…',  pct: 0.4 },
    { label: '加载单位配置…',  pct: 0.6 },
    { label: '加载地图配置…',  pct: 0.8 },
    { label: '建立索引…',      pct: 1.0 },
  ];

  for (const step of steps) {
    onProgress && onProgress(step.pct);
    // 让出主线程，使进度条能渲染
    await new Promise(r => setTimeout(r, 30));
  }

  const raw = {
    effects: RAW_EFFECTS,
    skills:  RAW_SKILLS,
    towers:  RAW_TOWERS,
    enemies: RAW_ENEMIES,
    maps:    RAW_MAPS,
    waves:   RAW_WAVES,  // 已是 mapId → waveData 结构
  };

  const GameConfig = {
    effects: buildIndex(raw.effects),
    skills:  buildIndex(raw.skills),
    towers:  buildIndex(raw.towers),
    enemies: buildIndex(raw.enemies),
    maps:    buildIndex(raw.maps),
    waves:   raw.waves,
    raw,
  };

  return GameConfig;
}
