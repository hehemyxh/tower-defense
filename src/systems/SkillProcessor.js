/**
 * SkillProcessor.js — 数据驱动的通用技能处理器
 * 
 * 所有技能效果由 skills.json 配置驱动，代码中无任何角色ID硬编码。
 * 通过 effect.type 分发到对应的通用处理函数。
 * 
 * 依赖（由 Worker 上下文提供）：
 *   - enemiesInRange(x,y,r)  返回范围内敌人数组
 *   - dealDmg(enemy, dmg, owner, tower)
 *   - pushFx(type, x, y, opts)
 *   - S (全局状态: S.uid++, S.enemies, S.bullets)
 *   - dist(x1,y1,x2,y2)
 */

'use strict';

const SkillProcessor = {

  /** @type {object} skills.json 的完整数据 */
  _config: null,
  /** @type {object} Worker 上下文依赖注入 */
  _ctx: null,

  /**
   * 初始化，接收 skills.json 数据和 Worker 上下文
   */
  init(skillsConfig) {
    this._config = skillsConfig;
  },

  /**
   * 设置运行时上下文（每次 tick 或在 tick 内调用前设置）
   */
  setContext(ctx) {
    this._ctx = ctx; // { enemiesInRange, dealDmg, pushFx, S, dist }
  },

  /**
   * 检查触发条件
   */
  _checkTrigger(trigger, tower, skillReady) {
    if (!trigger) return true;
    if (trigger.always) return true;
    if (trigger.chance && Math.random() < trigger.chance) return true;
    if (trigger.everyN && tower.hitCount % trigger.everyN === 0) return true;
    return false;
  },

  /**
   * 处理一个塔的所有技能（系族 + 角色独有）
   * 在系族战斗逻辑之后调用
   * @param {object} tower    - 塔对象
   * @param {object} target   - 当前攻击目标（best）
   * @param {number} baseDmgMult - 基础伤害倍率
   * @param {object} owner    - 拥有者
   * @param {boolean} skillReady - 蓝条是否满
   */
  processCharSkill(tower, target, baseDmgMult, owner, skillReady) {
    if (!this._config || !this._config.charSkills) return;
    const sk = this._config.charSkills[tower.id];
    if (!sk) return;

    // onSkillReady 类型只在蓝满时触发
    if (sk.type === 'onSkillReady' && !skillReady) return;
    // onHit 类型检查触发条件
    if (sk.type === 'onHit' && !this._checkTrigger(sk.trigger, tower, skillReady)) return;

    this._executeEffect(sk.effect, tower, target, baseDmgMult, owner);
  },

  /**
   * 执行效果（由 effect.type 分发）
   */
  _executeEffect(eff, tower, target, baseDmgMult, owner) {
    const ctx = this._ctx;
    const { enemiesInRange, dealDmg, pushFx, S, dist: distFn } = ctx;
    const t = tower;
    const best = target;

    switch (eff.type) {

      // ── 额外投射物：对另一个敌人造成伤害 ──
      case 'extraProjectile': {
        const mTarget = (eff.targetMode === 'other')
          ? (enemiesInRange(t.x, t.y, t.range).find(e => !e.dead && e.uid !== best.uid) || best)
          : best;
        dealDmg(mTarget, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
        if (eff.fx) pushFx(eff.fx, mTarget.x, mTarget.y, { color: eff.fxColor || t.color });
        S.bullets.push({ uid: S.uid++, x: t.x, y: t.y, tx: mTarget.x, ty: mTarget.y,
          color: eff.bulletColor || t.color, life: 100, btype: 'normal', size: eff.bulletSize || 3 });
        break;
      }

      // ── AOE 范围伤害 ──
      case 'aoe': {
        const cx = eff.center === 'self' ? t.x : best.x;
        const cy = eff.center === 'self' ? t.y : best.y;
        if (eff.fx) pushFx(eff.fx, cx, cy, { color: eff.fxColor || t.color, radius: eff.radius });
        for (const e of enemiesInRange(cx, cy, eff.radius)) {
          if (e.dead) continue;
          dealDmg(e, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
          pushFx('hit', e.x, e.y, { color: eff.fxColor || t.color });
        }
        break;
      }

      // ── 冰冻：主目标完全冻结 + 周围减速 ──
      case 'freeze': {
        best.slow = eff.mainSlow;
        best.slowTick = Math.max(best.slowTick || 0, eff.mainSlowTick);
        if (eff.fx) pushFx(eff.fx, best.x, best.y, { color: eff.fxColor || '#74b9ff' });
        if (eff.splashRadius) {
          for (const e of enemiesInRange(best.x, best.y, eff.splashRadius)) {
            if (e.dead || e.uid === best.uid) continue;
            e.slow = Math.min(eff.splashSlowMin, (e.slow || 1) * eff.splashSlow);
            e.slowTick = Math.max(e.slowTick || 0, eff.splashSlowTick);
          }
        }
        break;
      }

      // ── 闪电链：从目标跳跃到附近敌人 ──
      case 'chain': {
        let src = best;
        const visited = new Set([best.uid]);
        for (let i = 0; i < eff.chainCount; i++) {
          const next = enemiesInRange(src.x, src.y, eff.chainRange).find(e => !e.dead && !visited.has(e.uid));
          if (!next) break;
          visited.add(next.uid);
          dealDmg(next, t.dmg * baseDmgMult * eff.chainDmgMult, owner, t);
          if (eff.fx) pushFx(eff.fx, next.x, next.y, { color: eff.fxColor || t.color });
          S.bullets.push({ uid: S.uid++, x: src.x, y: src.y, tx: next.x, ty: next.y,
            color: eff.bulletColor || t.color, life: 80,
            btype: eff.bulletBtype || 'chain_lightning', size: eff.bulletSize || 3 });
          src = next;
        }
        break;
      }

      // ── 友方光环：给周围友方塔施加临时伤害加成 ──
      case 'allyAura': {
        const bK = eff.buffKey || '_allyBuff';
        const owner_p = S.players[t.owner];
        if (owner_p) {
          for (const ally of owner_p.towers) {
            if (ally.uid === t.uid) continue; // 不给自己
            if (distFn(t.x, t.y, ally.x, ally.y) > (eff.auraRange || 120)) continue;
            ally[bK] = eff.buffDmgMult || 0.10;
            ally[bK + '_tick'] = eff.buffDuration || 60;
          }
        }
        if (eff.fx) pushFx(eff.fx, t.x, t.y, { color: eff.fxColor || t.color, radius: eff.auraRange || 120 });
        break;
      }

      // ── AOE DOT：范围内敌人施加持续伤害 ──
      case 'aoeDot': {
        const cx = eff.center === 'self' ? t.x : best.x;
        const cy = eff.center === 'self' ? t.y : best.y;
        if (eff.fx) pushFx(eff.fx, cx, cy, { color: eff.fxColor || t.color, radius: eff.radius });
        for (const e of enemiesInRange(cx, cy, eff.radius)) {
          if (e.dead) continue;
          if (!e.dot) e.dot = { dmg: 0, tick: 0, owner: t.owner };
          e.dot.dmg = Math.max(e.dot.dmg, Math.floor(t.dmg * eff.dotDmgRatio));
          e.dot.tick = Math.max(e.dot.tick, eff.dotTick);
          e.dot.owner = t.owner;
        }
        break;
      }

      // ── 多重射击：对范围内多个目标各发一发 ──
      case 'multiShot': {
        const targets = enemiesInRange(t.x, t.y, t.range).filter(e => !e.dead).slice(0, eff.shotCount);
        for (const e of targets) {
          dealDmg(e, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
          if (eff.fx) pushFx(eff.fx, e.x, e.y, { color: eff.fxColor || t.color });
          S.bullets.push({ uid: S.uid++, x: t.x, y: t.y, tx: e.x, ty: e.y,
            color: eff.bulletColor || t.color, life: 90, btype: 'normal', size: eff.bulletSize || 3 });
        }
        break;
      }

      // ── 穿透：对目标后方的敌人造成伤害 ──
      case 'pierce': {
        const dx = best.x - t.x, dy = best.y - t.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / len, ny = dy / len;
        const behind = enemiesInRange(t.x, t.y, t.range + (eff.pierceExtend || 30))
          .find(e => !e.dead && e.uid !== best.uid &&
            ((e.x - t.x) * nx + (e.y - t.y) * ny) > ((best.x - t.x) * nx + (best.y - t.y) * ny) &&
            Math.abs((e.x - t.x) * ny - (e.y - t.y) * nx) <= e.r + (eff.pierceWidth || 20));
        if (behind) {
          dealDmg(behind, t.dmg * baseDmgMult * eff.pierceDmgMult, owner, t);
          if (eff.fx) pushFx(eff.fx, behind.x, behind.y, { color: eff.fxColor || t.color });
          S.bullets.push({ uid: S.uid++, x: best.x, y: best.y, tx: behind.x, ty: behind.y,
            color: eff.bulletColor || t.color, life: 90, btype: 'normal', size: eff.bulletSize || 3 });
        }
        break;
      }

      // ── Debuff 标记：给目标标记增伤 ──
      case 'debuffMark': {
        best[eff.markKey] = eff.markValue;
        best[eff.markKey + 'Tick'] = eff.markDuration;
        break;
      }

      // ── 减速 ──
      case 'slow': {
        best.slow = Math.min(eff.slowMin, (best.slow || 1) * eff.slowMult);
        best.slowTick = Math.max(best.slowTick || 0, eff.slowTick);
        if (eff.fx) pushFx(eff.fx, best.x, best.y, { color: eff.fxColor || t.color });
        break;
      }

      // ── 额外伤害（概率触发时的纯加伤）──
      case 'bonusDmg': {
        dealDmg(best, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
        if (eff.fx) pushFx(eff.fx, best.x, best.y, { color: eff.fxColor || t.color, radius: eff.fxRadius || 20 });
        if (eff.fx2) pushFx(eff.fx2, best.x, best.y, { color: eff.fxColor || t.color });
        break;
      }

      // ── 最远目标加伤 ──
      case 'farthestBonus': {
        let maxDist = 0;
        for (const e of S.enemies) {
          if (!e.dead) { const dd = distFn(t.x, t.y, e.x, e.y); if (dd <= t.range && dd > maxDist) maxDist = dd; }
        }
        const dBest = distFn(t.x, t.y, best.x, best.y);
        if (maxDist > 0 && dBest >= maxDist * (eff.thresholdRatio || 0.9)) {
          dealDmg(best, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
          if (eff.fx) pushFx(eff.fx, best.x, best.y, { color: eff.fxColor || t.color, radius: eff.fxRadius || 15 });
        }
        break;
      }

      // ── 连击叠加：连续攻击同一目标每次加伤 ──
      case 'comboStack': {
        const stK = eff.stackKey || '_comboStack';
        const tgK = eff.targetKey || '_lastTarget';
        if (!t[stK]) t[stK] = 0;
        if (t[tgK] === best.uid) {
          t[stK] = Math.min(eff.maxStacks, t[stK] + 1);
        } else {
          t[stK] = 1; t[tgK] = best.uid;
        }
        if (t[stK] > 1) {
          dealDmg(best, t.dmg * baseDmgMult * eff.dmgPerStack * (t[stK] - 1), owner, t);
        }
        break;
      }

      // ── Debuff 叠层：给敌人叠减甲/减速等层数 ──
      case 'debuffStack': {
        const sK = eff.stackKey;
        const tK = eff.tickKey;
        if (!best[sK]) best[sK] = 0;
        best[sK] = Math.min(eff.maxStacks, best[sK] + 1);
        best[tK] = eff.tickDuration;
        dealDmg(best, t.dmg * baseDmgMult * eff.dmgPerStack * best[sK], owner, t);
        break;
      }

      // ── 自身 Buff 叠层：攻速/伤害自增 ──
      case 'selfBuff': {
        const sK = eff.stackKey || '_rageStack';
        if (!t[sK]) t[sK] = 0;
        t[sK] = Math.min(eff.maxStacks, t[sK] + 1);
        if (t[sK] > 0) {
          dealDmg(best, t.dmg * baseDmgMult * eff.dmgPerStack * t[sK], owner, t);
          if (eff.cdReductionPerStack) {
            t.cd = Math.max(1, Math.round(t.cd * (1 - t[sK] * eff.cdReductionPerStack)));
          }
        }
        break;
      }

      // ── 额外攻击：对附近另一个敌人发动攻击 ──
      case 'extraAttack': {
        const adj = enemiesInRange(best.x, best.y, eff.searchRange).find(e => !e.dead && e.uid !== best.uid);
        if (adj) {
          dealDmg(adj, t.dmg * baseDmgMult * eff.dmgMult, owner, t);
          if (eff.fx) pushFx(eff.fx, adj.x, adj.y, { color: eff.fxColor || t.color });
          S.bullets.push({ uid: S.uid++, x: best.x, y: best.y, tx: adj.x, ty: adj.y,
            color: eff.bulletColor || t.color, life: 80,
            btype: eff.bulletBtype || 'normal', size: eff.bulletSize || 3 });
        }
        break;
      }

      // ── 近距触发叠层Buff ──
      case 'proximityBuff': {
        const sK = eff.stackKey || '_counterStack';
        if (!t[sK]) t[sK] = 0;
        const nearEnemy = S.enemies.find(e => !e.dead && distFn(t.x, t.y, e.x, e.y) < (eff.triggerRange || 40));
        if (nearEnemy && t[sK] < eff.maxStacks) t[sK]++;
        if (t[sK] > 0) {
          dealDmg(best, t.dmg * baseDmgMult * eff.dmgPerStack * t[sK], owner, t);
          t[sK] = Math.max(0, t[sK] - (eff.consumeOnHit || 1));
        }
        break;
      }

      default:
        // 未知 effect.type，跳过
        break;
    }
  },

  /**
   * 处理自身护盾的 tick（奥术师等）
   */
  processShieldTick(tower, target, baseDmgMult, owner) {
    const ctx = this._ctx;
    if (!ctx) return;
    const { dealDmg } = ctx;
    if (tower._shield && tower._shield > 0) {
      dealDmg(target, tower.dmg * baseDmgMult * 0.05, owner, tower);
      tower._shield = Math.max(0, tower._shield - 10);
    }
  },

  /**
   * 处理 debuffMark 的 tick 衰减
   */
  processDebuffTick(target) {
    if (target._hunted && target._huntedTick > 0) {
      target._huntedTick--;
      if (target._huntedTick <= 0) target._hunted = 0;
    }
    if (target._axeShredTick > 0) {
      target._axeShredTick--;
      if (target._axeShredTick <= 0) target._axeShred = 0;
    }
  }
};

// ── 导出 ──
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SkillProcessor };
}
