/**
 * game-worker.js — 权威游戏逻辑 Worker
 *
 * 消息协议（来自主线程）：
 *   { type: 'INIT',       config, mapId }
 *   { type: 'INPUT',      playerId, action, data }
 *   { type: 'START_WAVE' }
 *   { type: 'PAUSE' }
 *   { type: 'RESUME' }
 *
 * 消息协议（发往主线程）：
 *   { type: 'STATE_SNAPSHOT', snapshot }
 *   { type: 'GAME_EVENT',     event }
 *   { type: 'READY' }
 */

// ─── 常量 ───────────────────────────────────────────────
const TICK_MS      = 50;   // 20 TPS
const TICK_DT      = TICK_MS / 1000;

// ─── 游戏状态 ───────────────────────────────────────────
let state = null;
let config = null;
let tickTimer = null;

// ─── 消息入口 ────────────────────────────────────────────
self.onmessage = ({ data: msg }) => {
  if (!msg || !msg.type) return;
  switch (msg.type) {
    case 'INIT':   handleInit(msg);   break;
    case 'INPUT':  handleInput(msg);  break;
    case 'START_WAVE': handleStartWave(); break;
    case 'PAUSE':  handlePause();     break;
    case 'RESUME': handleResume();    break;
    default: console.warn('[Worker] 未知消息:', msg.type);
  }
};

// ─── INIT ─────────────────────────────────────────────────
function handleInit(msg) {
  config = msg.config;
  const mapCfg = config.maps[msg.mapId];
  if (!mapCfg) {
    self.postMessage({ type: 'GAME_EVENT', event: { kind: 'error', msg: '地图配置缺失' } });
    return;
  }

  const waveData = config.waves[msg.mapId];

  state = {
    phase: 'prep',        // prep | running | paused | gameover | win
    tick: 0,
    wave: 0,
    totalWaves: waveData ? waveData.waves.length : 0,
    gold: mapCfg.startGold,
    lives: mapCfg.startLives,
    map: {
      id: msg.mapId,
      grid: mapCfg.grid,
      path: mapCfg.path,
    },
    towers: [],           // { id, towerType, col, row, level, cooldown, target }
    enemies: [],          // { id, enemyType, hp, maxHp, x, y, pathIndex, effects, shieldHp }
    projectiles: [],      // { id, x, y, tx, ty, speed, damage, effects, ownerId }
    effects: [],          // 浮动特效（飘字等，仅渲染用）
    waveQueue: [],        // 待生成怪物队列
    waveTimer: 0,
    allWavesSpawned: false,
    bossAlive: false,
  };

  // 启动 Tick 循环
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tick, TICK_MS);

  self.postMessage({ type: 'READY' });
}

// ─── INPUT ────────────────────────────────────────────────
function handleInput({ playerId, action, data }) {
  if (!state) return;
  switch (action) {
    case 'BUILD_TOWER':   doBuildTower(data);   break;
    case 'SELL_TOWER':    doSellTower(data);     break;
    case 'UPGRADE_TOWER': doUpgradeTower(data);  break;
    default: console.warn('[Worker] 未知 action:', action);
  }
}

function handleStartWave() {
  if (!state || state.phase !== 'prep') return;
  state.wave++;
  if (state.wave > state.totalWaves) return;
  state.phase = 'running';
  state.allWavesSpawned = false;
  buildWaveQueue(state.wave);
  emitEvent({ kind: 'WAVE_START', wave: state.wave });
}

function handlePause() {
  if (state && state.phase === 'running') {
    state.phase = 'paused';
    clearInterval(tickTimer);
  }
}

function handleResume() {
  if (state && state.phase === 'paused') {
    state.phase = 'running';
    tickTimer = setInterval(tick, TICK_MS);
  }
}

// ─── TICK ─────────────────────────────────────────────────
let lastTickTime = 0;

function tick() {
  if (!state || state.phase === 'paused' || state.phase === 'gameover' || state.phase === 'win') return;

  const now = Date.now();
  if (lastTickTime && now - lastTickTime > TICK_MS * 3) {
    console.warn('[Worker] Tick 超时，落后 ms:', now - lastTickTime - TICK_MS);
  }
  lastTickTime = now;

  state.tick++;

  if (state.phase === 'running') {
    tickSpawn();
    tickEnemies();
    tickTowers();
    tickProjectiles();
    tickEffects();
    checkWaveComplete();
    checkGameOver();
  }

  // 每 tick 广播快照
  broadcastSnapshot();
}

// ─── SPAWN ────────────────────────────────────────────────
let _eid = 0;
function buildWaveQueue(waveNum) {
  const waveData = config.waves[state.map.id];
  if (!waveData) return;
  const waveCfg = waveData.waves.find(w => w.wave === waveNum);
  if (!waveCfg) return;

  state.waveQueue = [];
  for (const grp of waveCfg.groups) {
    for (let i = 0; i < grp.count; i++) {
      state.waveQueue.push({
        enemyId: grp.enemyId,
        spawnAt: grp.delay + i * grp.interval,
      });
    }
  }
  state.waveQueue.sort((a, b) => a.spawnAt - b.spawnAt);
  state.waveTimer = 0;
  state.bossAlive = !!waveCfg.isBossWave;
}

function tickSpawn() {
  state.waveTimer += TICK_DT;
  while (state.waveQueue.length && state.waveQueue[0].spawnAt <= state.waveTimer) {
    const entry = state.waveQueue.shift();
    spawnEnemy(entry.enemyId);
  }
  if (!state.waveQueue.length) state.allWavesSpawned = true;
}

function spawnEnemy(enemyId) {
  const cfg = config.enemies.get ? config.enemies.get(enemyId) : config.enemies[enemyId];
  if (!cfg) return;

  const [startCol, startRow] = state.map.path[0];
  const ts = state.map.grid.tileSize;

  state.enemies.push({
    id: ++_eid,
    enemyType: enemyId,
    hp: cfg.stats.hp,
    maxHp: cfg.stats.hp,
    shieldHp: 0,
    x: startCol * ts + ts / 2,
    y: startRow * ts + ts / 2,
    pathIndex: 0,
    speed: cfg.stats.speed,
    armor: cfg.stats.armor,
    reward: cfg.stats.reward,
    size: cfg.stats.size,
    immunities: cfg.immunities || [],
    effects: [],
    onDeath: cfg.onDeath || null,
  });
}

// ─── ENEMIES ──────────────────────────────────────────────
function tickEnemies() {
  const ts = state.map.grid.tileSize;
  const path = state.map.path;

  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];

    // 处理 debuff（减速）
    let speedMult = 1;
    let isStunned = false;
    for (const eff of e.effects) {
      eff.remaining -= TICK_DT;
      if (eff.type === 'stun') isStunned = true;
      if (eff.type === 'debuff' && eff.params.speedMult) speedMult = Math.min(speedMult, eff.params.speedMult);
      if (eff.type === 'dot') {
        e.hp -= eff.params.damagePerSec * TICK_DT;
      }
    }
    // 清理过期效果
    e.effects = e.effects.filter(eff => eff.remaining > 0);

    // 血量检测
    if (e.hp <= 0) {
      killEnemy(i, e);
      continue;
    }

    if (isStunned) continue;

    // 沿路径移动
    const effectiveSpeed = e.speed * speedMult;
    let dist = effectiveSpeed * TICK_DT;

    while (dist > 0 && e.pathIndex < path.length - 1) {
      const [tc, tr] = path[e.pathIndex + 1];
      const tx = tc * ts + ts / 2;
      const ty = tr * ts + ts / 2;
      const dx = tx - e.x;
      const dy = ty - e.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (dist >= d) {
        e.x = tx; e.y = ty;
        e.pathIndex++;
        dist -= d;
      } else {
        e.x += (dx / d) * dist;
        e.y += (dy / d) * dist;
        dist = 0;
      }
    }

    // 到达终点
    if (e.pathIndex >= path.length - 1) {
      state.lives = Math.max(0, state.lives - 1);
      emitEvent({ kind: 'LIFE_LOST', lives: state.lives, enemyType: e.enemyType });
      state.enemies.splice(i, 1);
    }
  }
}

function killEnemy(idx, enemy) {
  state.gold += enemy.reward;
  emitEvent({ kind: 'ENEMY_KILLED', enemyType: enemy.enemyType, reward: enemy.reward });

  // 分裂机制
  if (enemy.onDeath && enemy.onDeath.type === 'split') {
    for (let k = 0; k < enemy.onDeath.count; k++) {
      spawnEnemyAt(enemy.onDeath.childId, enemy.x + (k - 0.5) * 10, enemy.y, enemy.pathIndex);
    }
  }

  state.enemies.splice(idx, 1);
}

function spawnEnemyAt(enemyId, x, y, pathIndex) {
  const cfg = config.enemies.get ? config.enemies.get(enemyId) : config.enemies[enemyId];
  if (!cfg) return;
  state.enemies.push({
    id: ++_eid,
    enemyType: enemyId,
    hp: cfg.stats.hp, maxHp: cfg.stats.hp, shieldHp: 0,
    x, y, pathIndex,
    speed: cfg.stats.speed,
    armor: cfg.stats.armor,
    reward: cfg.stats.reward,
    size: cfg.stats.size,
    immunities: cfg.immunities || [],
    effects: [],
    onDeath: cfg.onDeath || null,
  });
}

// ─── TOWERS ───────────────────────────────────────────────
let _tid = 0;

function doBuildTower({ col, row, towerType }) {
  const tCfg = config.towers.get ? config.towers.get(towerType) : config.towers[towerType];
  if (!tCfg) return;
  if (state.gold < tCfg.cost) {
    emitEvent({ kind: 'INSUFFICIENT_GOLD' });
    return;
  }
  // 检查是否已有塔
  if (state.towers.find(t => t.col === col && t.row === row)) return;
  // 检查是否在路径上
  if (isOnPath(col, row)) return;

  state.gold -= tCfg.cost;
  const ts = state.map.grid.tileSize;
  state.towers.push({
    id: ++_tid,
    towerType,
    col, row,
    x: col * ts + ts / 2,
    y: row * ts + ts / 2,
    level: 1,
    cooldown: 0,
    target: null,
    onHitEffects: tCfg.onHitEffects || [],
    stats: { ...tCfg.stats },
  });
  emitEvent({ kind: 'TOWER_BUILT', col, row, towerType });
}

function doSellTower({ towerId }) {
  const idx = state.towers.findIndex(t => t.id === towerId);
  if (idx < 0) return;
  const t = state.towers[idx];
  const tCfg = config.towers.get ? config.towers.get(t.towerType) : config.towers[t.towerType];
  const refund = Math.floor((tCfg?.cost || 0) * 0.6);
  state.gold += refund;
  state.towers.splice(idx, 1);
  emitEvent({ kind: 'TOWER_SOLD', towerId, refund });
}

function doUpgradeTower({ towerId }) {
  const tower = state.towers.find(t => t.id === towerId);
  if (!tower) return;
  const tCfg = config.towers.get ? config.towers.get(tower.towerType) : config.towers[tower.towerType];
  if (!tCfg || !tCfg.upgrades || !tCfg.upgrades.length) return;
  const nextTypeId = tCfg.upgrades[0];
  const nextCfg = config.towers.get ? config.towers.get(nextTypeId) : config.towers[nextTypeId];
  if (!nextCfg) return;
  if (state.gold < nextCfg.cost) { emitEvent({ kind: 'INSUFFICIENT_GOLD' }); return; }
  state.gold -= nextCfg.cost;
  tower.towerType = nextTypeId;
  tower.level++;
  tower.stats = { ...nextCfg.stats };
  tower.onHitEffects = nextCfg.onHitEffects || [];
  tower.cooldown = 0;
  emitEvent({ kind: 'TOWER_UPGRADED', towerId, newType: nextTypeId });
}

function tickTowers() {
  for (const tower of state.towers) {
    if (tower.cooldown > 0) { tower.cooldown -= TICK_DT; continue; }

    // 目标选取
    const target = findTarget(tower);
    if (!target) continue;

    // 攻击
    fireProjectile(tower, target);
    tower.cooldown = 1 / tower.stats.attackSpeed;
  }
}

function findTarget(tower) {
  let best = null;
  let bestProg = -1;
  const range = tower.stats.range;

  for (const e of state.enemies) {
    const dx = e.x - tower.x;
    const dy = e.y - tower.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > range) continue;

    const prog = e.pathIndex + (e.pathIndex < state.map.path.length - 1 ? 0 : 0);
    if (tower.stats.targetPriority !== 'cluster') {
      if (prog > bestProg) { bestProg = prog; best = e; }
    } else {
      // cluster: 找周边怪最多的
      best = best || e;
    }
  }
  return best;
}

let _pid = 0;
function fireProjectile(tower, target) {
  if (tower.stats.projectileSpeed >= 900) {
    // 即时命中（闪电）
    dealDamage(tower, target);
    handleChain(tower, target);
    return;
  }

  state.projectiles.push({
    id: ++_pid,
    x: tower.x, y: tower.y,
    targetId: target.id,
    speed: tower.stats.projectileSpeed,
    damage: tower.stats.damage,
    armorPierce: tower.stats.armorPierce || 0,
    onHitEffects: tower.onHitEffects,
    aoeRadius: tower.stats.aoeRadius || 0,
    towerId: tower.id,
  });
}

// ─── PROJECTILES ──────────────────────────────────────────
function tickProjectiles() {
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const p = state.projectiles[i];
    const target = state.enemies.find(e => e.id === p.targetId);

    if (!target) { state.projectiles.splice(i, 1); continue; }

    const dx = target.x - p.x;
    const dy = target.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = p.speed * TICK_DT;

    if (step >= dist) {
      // 命中
      const tower = state.towers.find(t => t.id === p.towerId);
      if (p.aoeRadius > 0) {
        // AOE
        for (const e of state.enemies) {
          const ex = e.x - target.x;
          const ey = e.y - target.y;
          if (Math.sqrt(ex * ex + ey * ey) <= p.aoeRadius) {
            dealDamageRaw(p.damage, p.armorPierce, p.onHitEffects, e);
          }
        }
      } else {
        dealDamageRaw(p.damage, p.armorPierce, p.onHitEffects, target);
        if (tower) handleChain(tower, target);
      }
      state.projectiles.splice(i, 1);
    } else {
      p.x += (dx / dist) * step;
      p.y += (dy / dist) * step;
    }
  }
}

function dealDamage(tower, enemy) {
  dealDamageRaw(tower.stats.damage, tower.stats.armorPierce || 0, tower.onHitEffects, enemy);
}

function dealDamageRaw(damage, armorPierce, onHitEffects, enemy) {
  if (!enemy) return;
  // 护盾先扣
  if (enemy.shieldHp > 0) {
    enemy.shieldHp = Math.max(0, enemy.shieldHp - damage);
    return;
  }
  const effectiveArmor = Math.max(0, (enemy.armor || 0) - (armorPierce || 0));
  const finalDmg = Math.max(1, damage - effectiveArmor);

  // 易伤 debuff 检查
  const ampEff = enemy.effects.find(e => e.effectId === 'amplify');
  const mult = ampEff ? ampEff.params.damageTakenMult : 1;

  enemy.hp -= finalDmg * mult;

  // 施加 on-hit 效果
  if (onHitEffects) {
    for (const effectId of onHitEffects) {
      applyEffect(enemy, effectId);
    }
  }
}

function applyEffect(enemy, effectId) {
  if (!config.effects) return;
  const effCfg = config.effects.get ? config.effects.get(effectId) : config.effects[effectId];
  if (!effCfg) return;

  // 免疫检查
  if (enemy.immunities && enemy.immunities.includes(effectId)) return;

  // 非叠加效果：刷新持续时间
  if (!effCfg.params?.stackable) {
    const existing = enemy.effects.find(e => e.effectId === effectId);
    if (existing) { existing.remaining = effCfg.duration; return; }
  }

  enemy.effects.push({
    effectId,
    type: effCfg.type,
    params: effCfg.params || {},
    remaining: effCfg.duration,
  });
}

function handleChain(tower, origin) {
  if (!tower.onHitEffects.includes('chain_lightning')) return;
  const effCfg = config.effects.get ? config.effects.get('chain_lightning') : config.effects['chain_lightning'];
  if (!effCfg) return;
  const { bounces, bounceDmg, bounceRange } = effCfg.params;
  let current = origin;
  let dmg = tower.stats.damage * bounceDmg;
  const hit = new Set([origin.id]);

  for (let b = 0; b < bounces; b++) {
    const next = state.enemies.find(e => {
      if (hit.has(e.id)) return false;
      const dx = e.x - current.x;
      const dy = e.y - current.y;
      return Math.sqrt(dx * dx + dy * dy) <= bounceRange;
    });
    if (!next) break;
    hit.add(next.id);
    dealDamageRaw(dmg, 0, [], next);
    dmg *= bounceDmg;
    current = next;
  }
}

// ─── EFFECTS（清理过期）────────────────────────────────────
function tickEffects() {
  // 已在 tickEnemies 中处理，此处预留扩展（塔 buff 等）
}

// ─── HELPERS ──────────────────────────────────────────────
function isOnPath(col, row) {
  return state.map.path.some(([c, r]) => c === col && r === row);
}

function checkWaveComplete() {
  if (!state.allWavesSpawned) return;
  if (state.enemies.length > 0) return;

  if (state.wave >= state.totalWaves) {
    state.phase = 'win';
    emitEvent({ kind: 'GAME_WIN', wave: state.wave });
    clearInterval(tickTimer);
  } else {
    state.phase = 'prep';
    emitEvent({ kind: 'WAVE_COMPLETE', wave: state.wave });
    // 波次奖励金币
    state.gold += 50 + state.wave * 10;
    emitEvent({ kind: 'WAVE_REWARD', gold: state.gold });
  }
}

function checkGameOver() {
  if (state.lives <= 0) {
    state.phase = 'gameover';
    emitEvent({ kind: 'GAME_OVER' });
    clearInterval(tickTimer);
  }
}

// ─── 快照 & 事件 ──────────────────────────────────────────
function broadcastSnapshot() {
  // 序列化（移除不可序列化字段）
  const snapshot = {
    tick: state.tick,
    phase: state.phase,
    wave: state.wave,
    totalWaves: state.totalWaves,
    gold: state.gold,
    lives: state.lives,
    towers: state.towers.map(t => ({
      id: t.id, towerType: t.towerType, col: t.col, row: t.row,
      x: t.x, y: t.y, level: t.level, cooldown: t.cooldown,
    })),
    enemies: state.enemies.map(e => ({
      id: e.id, enemyType: e.enemyType,
      hp: e.hp, maxHp: e.maxHp, shieldHp: e.shieldHp,
      x: e.x, y: e.y, size: e.size,
      effects: e.effects.map(ef => ef.effectId),
    })),
    projectiles: state.projectiles.map(p => ({
      id: p.id, x: p.x, y: p.y,
    })),
  };

  self.postMessage({ type: 'STATE_SNAPSHOT', snapshot });
}

function emitEvent(event) {
  self.postMessage({ type: 'GAME_EVENT', event });
}
