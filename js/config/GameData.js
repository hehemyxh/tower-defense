/**
 * GameData.js — 所有游戏配置内嵌数据
 * 不依赖 fetch，支持直接双击 index.html 运行（file:// 协议）
 */

export const RAW_EFFECTS = [
  { "id": "slow", "type": "debuff", "name": "减速", "desc": "降低目标移动速度", "params": { "speedMult": 0.5 }, "duration": 2.0, "icon": "🐢" },
  { "id": "burn", "type": "dot", "name": "灼烧", "desc": "每秒造成火焰伤害", "params": { "damagePerSec": 10 }, "duration": 3.0, "icon": "🔥" },
  { "id": "freeze", "type": "stun", "name": "冰封", "desc": "使目标完全停止移动", "params": {}, "duration": 1.5, "icon": "❄️" },
  { "id": "poison", "type": "dot", "name": "中毒", "desc": "每秒造成毒素伤害，可叠加", "params": { "damagePerSec": 6, "stackable": true }, "duration": 4.0, "icon": "☠️" },
  { "id": "weaken", "type": "debuff", "name": "虚弱", "desc": "降低目标护甲", "params": { "armorReduce": 5 }, "duration": 3.0, "icon": "💢" },
  { "id": "stun", "type": "stun", "name": "眩晕", "desc": "使目标短暂无法行动", "params": {}, "duration": 0.8, "icon": "⭐" },
  { "id": "amplify", "type": "debuff", "name": "易伤", "desc": "使目标受到更多伤害", "params": { "damageTakenMult": 1.3 }, "duration": 3.0, "icon": "🎯" },
  { "id": "chain_lightning", "type": "trigger", "name": "连锁闪电", "desc": "触发后向相邻敌人弹射", "params": { "bounces": 3, "bounceDmg": 0.5, "bounceRange": 150 }, "duration": 0, "icon": "⚡" },
  { "id": "spore", "type": "aoe_on_death", "name": "孢子爆发", "desc": "目标死亡时爆发毒雾", "params": { "radius": 80, "dotId": "poison" }, "duration": 0, "icon": "🍄" },
  { "id": "curse", "type": "debuff", "name": "咒标", "desc": "被咒标目标死亡时减少相邻敌人冷却", "params": {}, "duration": 10.0, "icon": "🔮" }
];

export const RAW_SKILLS = [
  { "id": "skill_slow_field", "name": "寒气阵", "desc": "持续对范围内敌人施加减速", "type": "aura", "effectId": "slow", "params": { "radius": 120 }, "cost": 80, "icon": "🌀" },
  { "id": "skill_fire_arrow", "name": "火矢诀", "desc": "攻击附带灼烧效果", "type": "on_hit", "effectId": "burn", "params": { "chance": 0.4 }, "cost": 60, "icon": "🏹" },
  { "id": "skill_poison_cloud", "name": "毒雾阵", "desc": "定期释放毒雾区域", "type": "periodic_aoe", "effectId": "poison", "params": { "radius": 100, "interval": 3.0 }, "cost": 100, "icon": "💨" },
  { "id": "skill_thunder_chain", "name": "雷霆连锁", "desc": "攻击时触发连锁闪电", "type": "on_hit", "effectId": "chain_lightning", "params": { "chance": 0.3 }, "cost": 120, "icon": "⚡" },
  { "id": "skill_freeze_field", "name": "冰封阵", "desc": "对范围内敌人施加冰封", "type": "periodic_aoe", "effectId": "freeze", "params": { "radius": 90, "interval": 5.0 }, "cost": 150, "icon": "❄️" },
  { "id": "skill_amplify_mark", "name": "易伤符", "desc": "攻击附带易伤标记", "type": "on_hit", "effectId": "amplify", "params": { "chance": 0.5 }, "cost": 90, "icon": "📍" },
  { "id": "skill_rapid_shot", "name": "速射诀", "desc": "大幅提升攻击速度", "type": "self_buff", "effectId": null, "params": { "attackSpeedMult": 1.5 }, "cost": 110, "icon": "💨" },
  { "id": "skill_piercing", "name": "穿心决", "desc": "攻击可以穿透多个敌人", "type": "projectile_mod", "effectId": null, "params": { "pierceCount": 3 }, "cost": 130, "icon": "🗡️" }
];

export const RAW_TOWERS = [
  { "id": "tower_archer", "name": "弓手", "desc": "普通远程单体攻击，价格低廉", "type": "single", "color": "#5c8a3c", "icon": "🏹", "cost": 50, "stats": { "damage": 20, "range": 160, "attackSpeed": 1.2, "projectileSpeed": 300, "armor": 0 }, "targetPriority": "first", "upgrades": ["tower_archer_2"] },
  { "id": "tower_archer_2", "name": "精锐弓手", "desc": "伤害和射程提升", "type": "single", "color": "#4a7a2e", "icon": "🎯", "cost": 80, "stats": { "damage": 36, "range": 190, "attackSpeed": 1.4, "projectileSpeed": 360, "armor": 0 }, "targetPriority": "first", "upgrades": ["tower_archer_3"] },
  { "id": "tower_archer_3", "name": "神射手", "desc": "高伤害，极远射程", "type": "single", "color": "#2e5c1e", "icon": "⭐", "cost": 140, "stats": { "damage": 65, "range": 240, "attackSpeed": 1.6, "projectileSpeed": 450, "armor": 0 }, "targetPriority": "first", "upgrades": [] },
  { "id": "tower_mage", "name": "法师塔", "desc": "攻击穿甲，可附带减速", "type": "single", "color": "#4a3c8a", "icon": "🔮", "cost": 100, "stats": { "damage": 35, "range": 140, "attackSpeed": 0.8, "projectileSpeed": 250, "armor": 0, "armorPierce": 5 }, "onHitEffects": ["slow"], "targetPriority": "first", "upgrades": ["tower_mage_2"] },
  { "id": "tower_mage_2", "name": "大法师塔", "desc": "高穿甲，攻击释放冰封", "type": "single", "color": "#2e1e6a", "icon": "✨", "cost": 160, "stats": { "damage": 60, "range": 170, "attackSpeed": 0.9, "projectileSpeed": 300, "armor": 0, "armorPierce": 12 }, "onHitEffects": ["freeze"], "targetPriority": "first", "upgrades": [] },
  { "id": "tower_cannon", "name": "炮台", "desc": "范围爆炸伤害，对群体有效", "type": "aoe", "color": "#8a5c3c", "icon": "💣", "cost": 130, "stats": { "damage": 50, "range": 130, "attackSpeed": 0.5, "projectileSpeed": 200, "armor": 0, "aoeRadius": 80 }, "targetPriority": "cluster", "upgrades": ["tower_cannon_2"] },
  { "id": "tower_cannon_2", "name": "重炮台", "desc": "强力爆炸，燃烧附加效果", "type": "aoe", "color": "#6a3c1e", "icon": "🔥", "cost": 200, "stats": { "damage": 90, "range": 150, "attackSpeed": 0.55, "projectileSpeed": 220, "armor": 0, "aoeRadius": 100 }, "onHitEffects": ["burn"], "targetPriority": "cluster", "upgrades": [] },
  { "id": "tower_poison", "name": "毒液塔", "desc": "持续毒化，低造价高效益", "type": "single", "color": "#3c6a2e", "icon": "☠️", "cost": 75, "stats": { "damage": 5, "range": 145, "attackSpeed": 1.5, "projectileSpeed": 220, "armor": 0 }, "onHitEffects": ["poison"], "targetPriority": "first", "upgrades": ["tower_poison_2"] },
  { "id": "tower_poison_2", "name": "剧毒塔", "desc": "极强毒化效果，死亡时爆发孢子", "type": "single", "color": "#1e4a1a", "icon": "🍄", "cost": 120, "stats": { "damage": 8, "range": 165, "attackSpeed": 1.6, "projectileSpeed": 250, "armor": 0 }, "onHitEffects": ["poison", "spore"], "targetPriority": "first", "upgrades": [] },
  { "id": "tower_thunder", "name": "雷电塔", "desc": "连锁闪电攻击多个敌人", "type": "chain", "color": "#8a7a1e", "icon": "⚡", "cost": 180, "stats": { "damage": 40, "range": 150, "attackSpeed": 0.7, "projectileSpeed": 999, "armor": 0 }, "onHitEffects": ["chain_lightning"], "targetPriority": "first", "upgrades": [] }
];

export const RAW_ENEMIES = [
  { "id": "enemy_grunt", "name": "小鬼", "desc": "最基础的敌人", "color": "#c0392b", "icon": "👺", "stats": { "hp": 80, "speed": 80, "armor": 0, "reward": 10, "size": 14 }, "immunities": [] },
  { "id": "enemy_soldier", "name": "妖兵", "desc": "普通移速，有一定护甲", "color": "#922b21", "icon": "⚔️", "stats": { "hp": 200, "speed": 65, "armor": 3, "reward": 20, "size": 16 }, "immunities": [] },
  { "id": "enemy_speeder", "name": "疾风鬼", "desc": "移速极快，血量较少", "color": "#f39c12", "icon": "💨", "stats": { "hp": 120, "speed": 160, "armor": 0, "reward": 15, "size": 12 }, "immunities": ["slow"] },
  { "id": "enemy_tank", "name": "铁甲妖", "desc": "高血量高护甲，移速缓慢", "color": "#5d6d7e", "icon": "🛡️", "stats": { "hp": 600, "speed": 40, "armor": 10, "reward": 50, "size": 22 }, "immunities": [] },
  { "id": "enemy_ghost", "name": "幽魂", "desc": "无实体，免疫物理和中毒伤害", "color": "#d7bde2", "icon": "👻", "stats": { "hp": 180, "speed": 90, "armor": 0, "reward": 30, "size": 14 }, "immunities": ["poison", "physical"] },
  { "id": "enemy_shaman", "name": "妖祭司", "desc": "会为附近敌人施加护盾", "color": "#8e44ad", "icon": "🧙", "stats": { "hp": 300, "speed": 55, "armor": 2, "reward": 40, "size": 17 }, "immunities": [], "abilities": [{ "type": "aura_shield", "radius": 100, "shieldHp": 50 }] },
  { "id": "enemy_elite", "name": "精英妖将", "desc": "高血量，各属性均衡", "color": "#c0392b", "icon": "👹", "stats": { "hp": 1200, "speed": 55, "armor": 8, "reward": 100, "size": 24 }, "immunities": [] },
  { "id": "enemy_boss_ox", "name": "牛魔王", "desc": "第一关BOSS，冲击波AOE", "color": "#922b21", "icon": "🐂", "stats": { "hp": 5000, "speed": 35, "armor": 15, "reward": 300, "size": 36 }, "immunities": ["freeze"], "abilities": [{ "type": "shockwave", "radius": 120, "interval": 5.0 }] },
  { "id": "enemy_split", "name": "分裂虫", "desc": "死亡后分裂为两只小分裂虫", "color": "#27ae60", "icon": "🐛", "stats": { "hp": 240, "speed": 70, "armor": 0, "reward": 25, "size": 18 }, "immunities": [], "onDeath": { "type": "split", "childId": "enemy_split_small", "count": 2 } },
  { "id": "enemy_split_small", "name": "小分裂虫", "desc": "分裂虫死亡后产生", "color": "#1e8449", "icon": "🪲", "stats": { "hp": 80, "speed": 90, "armor": 0, "reward": 5, "size": 10 }, "immunities": [] }
];

export const RAW_MAPS = [
  {
    "id": "map_001",
    "name": "火焰山道",
    "desc": "单路经典地图，10波敌人，终点在右侧",
    "thumbnail": "🌋",
    "wavesFile": "waves_map001",
    "startGold": 200,
    "startLives": 20,
    "grid": { "cols": 30, "rows": 18, "tileSize": 40 },
    "path": [
      [0,9],[1,9],[2,9],[3,9],[4,9],
      [4,8],[4,7],[4,6],
      [5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
      [10,7],[10,8],[10,9],[10,10],[10,11],
      [11,11],[12,11],[13,11],[14,11],[15,11],
      [15,10],[15,9],[15,8],[15,7],
      [16,7],[17,7],[18,7],[19,7],[20,7],
      [20,8],[20,9],[20,10],[20,11],[20,12],
      [21,12],[22,12],[23,12],[24,12],[25,12],
      [25,11],[25,10],[25,9],
      [26,9],[27,9],[28,9],[29,9]
    ],
    "spawnPoint": [0,9],
    "endPoint": [29,9]
  }
];

export const RAW_WAVES = {
  "map_001": {
    "mapId": "map_001",
    "waves": [
      { "wave": 1, "groups": [{ "enemyId": "enemy_grunt", "count": 8, "interval": 1.2, "delay": 0 }] },
      { "wave": 2, "groups": [{ "enemyId": "enemy_grunt", "count": 6, "interval": 1.0, "delay": 0 }, { "enemyId": "enemy_soldier", "count": 2, "interval": 2.0, "delay": 4.0 }] },
      { "wave": 3, "groups": [{ "enemyId": "enemy_speeder", "count": 5, "interval": 0.6, "delay": 0 }, { "enemyId": "enemy_grunt", "count": 5, "interval": 1.0, "delay": 2.0 }] },
      { "wave": 4, "groups": [{ "enemyId": "enemy_soldier", "count": 6, "interval": 1.5, "delay": 0 }, { "enemyId": "enemy_speeder", "count": 4, "interval": 0.8, "delay": 5.0 }] },
      { "wave": 5, "groups": [{ "enemyId": "enemy_tank", "count": 2, "interval": 4.0, "delay": 0 }, { "enemyId": "enemy_grunt", "count": 10, "interval": 0.8, "delay": 1.0 }] },
      { "wave": 6, "groups": [{ "enemyId": "enemy_ghost", "count": 6, "interval": 1.2, "delay": 0 }, { "enemyId": "enemy_soldier", "count": 4, "interval": 1.5, "delay": 3.0 }] },
      { "wave": 7, "groups": [{ "enemyId": "enemy_shaman", "count": 2, "interval": 5.0, "delay": 0 }, { "enemyId": "enemy_soldier", "count": 8, "interval": 1.0, "delay": 2.0 }] },
      { "wave": 8, "groups": [{ "enemyId": "enemy_split", "count": 4, "interval": 2.5, "delay": 0 }, { "enemyId": "enemy_speeder", "count": 6, "interval": 0.7, "delay": 5.0 }] },
      { "wave": 9, "groups": [{ "enemyId": "enemy_elite", "count": 2, "interval": 5.0, "delay": 0 }, { "enemyId": "enemy_tank", "count": 2, "interval": 4.0, "delay": 3.0 }, { "enemyId": "enemy_ghost", "count": 4, "interval": 1.5, "delay": 6.0 }] },
      { "wave": 10, "isBossWave": true, "groups": [{ "enemyId": "enemy_boss_ox", "count": 1, "interval": 0, "delay": 0 }, { "enemyId": "enemy_soldier", "count": 12, "interval": 0.8, "delay": 3.0 }] }
    ]
  }
};
