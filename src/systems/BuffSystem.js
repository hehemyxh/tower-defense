/**
 * BuffSystem.js
 * 数据驱动的 Buff/Debuff 系统
 * 参考: 微信文章 Buff 系统架构 + GitHub Buff-In-TopDownShooter
 *
 * BuffDefinition 结构:
 * {
 *   id: string,           // 唯一标识，如 "arcane_dmg_2"
 *   source: string,       // 来源类型: "synergy" | "talisman" | "skill"
 *   stat: string,         // 影响的属性: "dmg" | "range" | "rate" | "goldBonus" | "slow"
 *   op: string,           // 运算类型: "additive" | "multiply" | "override"
 *   value: number,        // 数值 (multiply: 1.20 表示 +20%; additive: 直接加)
 *   duration: number,     // -1 = 永久; > 0 = tick 数
 *   stackRule: string,    // "replace" | "stack" | "cap"
 * }
 */

'use strict';

// ── BuffDefinition 验证 ────────────────────────────────────
const VALID_OPS = new Set(['additive', 'multiply', 'override']);
const VALID_STACK_RULES = new Set(['replace', 'stack', 'cap']);

/**
 * 验证一个 BuffDefinition 对象是否合法
 * @param {object} def
 * @returns {{ valid: boolean, error?: string }}
 */
function validateBuffDef(def) {
  if (!def || typeof def !== 'object') return { valid: false, error: 'BuffDef 必须是对象' };
  if (!def.id) return { valid: false, error: 'BuffDef 缺少 id' };
  if (!def.stat) return { valid: false, error: `BuffDef "${def.id}" 缺少 stat` };
  if (!VALID_OPS.has(def.op)) return { valid: false, error: `BuffDef "${def.id}" op 无效: ${def.op}` };
  if (typeof def.value !== 'number') return { valid: false, error: `BuffDef "${def.id}" value 必须是数字` };
  const stackRule = def.stackRule || 'replace';
  if (!VALID_STACK_RULES.has(stackRule)) return { valid: false, error: `BuffDef "${def.id}" stackRule 无效: ${stackRule}` };
  return { valid: true };
}

// ── BuffInstance: 运行时 Buff 实例 ────────────────────────
/**
 * 创建一个 Buff 运行时实例（拷贝 def 并加入运行时字段）
 */
function createBuffInstance(def) {
  return {
    id: def.id,
    source: def.source || 'unknown',
    stat: def.stat,
    op: def.op,
    value: def.value,
    duration: def.duration !== undefined ? def.duration : -1,  // -1 = 永久
    remaining: def.duration !== undefined ? def.duration : -1, // 剩余 tick
    stackRule: def.stackRule || 'replace',
  };
}

// ── BuffManager ────────────────────────────────────────────
const BuffManager = {

  /**
   * 确保实体拥有 buffs 数组
   */
  _ensureBufArray(entity) {
    if (!Array.isArray(entity.buffs)) entity.buffs = [];
  },

  /**
   * 应用一个 Buff 到实体
   * @param {object} entity   - 拥有 buffs[] 的实体（塔、玩家等）
   * @param {object} buffDef  - BuffDefinition
   */
  apply(entity, buffDef) {
    const check = validateBuffDef(buffDef);
    if (!check.valid) {
      console.error('[BuffSystem] 非法 BuffDef:', check.error);
      return;
    }
    this._ensureBufArray(entity);
    const stackRule = buffDef.stackRule || 'replace';
    const existing = entity.buffs.find(b => b.id === buffDef.id);

    if (stackRule === 'replace') {
      // 替换：移除旧的，加入新的
      if (existing) {
        const idx = entity.buffs.indexOf(existing);
        entity.buffs.splice(idx, 1);
      }
      entity.buffs.push(createBuffInstance(buffDef));

    } else if (stackRule === 'stack') {
      // 叠加：直接追加新实例（允许同 id 多层）
      entity.buffs.push(createBuffInstance(buffDef));

    } else if (stackRule === 'cap') {
      // 上限叠加：同 id 只允许最多 buffDef.capCount（默认3）层
      const capCount = buffDef.capCount || 3;
      const sameId = entity.buffs.filter(b => b.id === buffDef.id);
      if (sameId.length < capCount) {
        entity.buffs.push(createBuffInstance(buffDef));
      } else {
        // 替换最旧的一层
        const oldest = sameId[0];
        const idx = entity.buffs.indexOf(oldest);
        entity.buffs.splice(idx, 1, createBuffInstance(buffDef));
      }
    }
  },

  /**
   * 从实体移除指定 id 的所有 Buff（同 id 可能多层时全部移除）
   * @param {object} entity
   * @param {string} buffId
   */
  remove(entity, buffId) {
    this._ensureBufArray(entity);
    entity.buffs = entity.buffs.filter(b => b.id !== buffId);
  },

  /**
   * 移除来自指定 source 的所有 Buff（如移除某个羁绊的所有效果）
   * @param {object} entity
   * @param {string} source
   */
  removeBySource(entity, source) {
    this._ensureBufArray(entity);
    entity.buffs = entity.buffs.filter(b => b.source !== source);
  },

  /**
   * 每 tick 调用，减少有限期 Buff 的剩余时间，到期自动移除
   * @param {object} entity
   * @returns {string[]} 本次移除的 buffId 列表
   */
  tick(entity) {
    this._ensureBufArray(entity);
    const removed = [];
    entity.buffs = entity.buffs.filter(b => {
      if (b.remaining === -1) return true;  // 永久 Buff 不处理
      b.remaining--;
      if (b.remaining <= 0) { removed.push(b.id); return false; }
      return true;
    });
    return removed;
  },

  /**
   * 计算实体某属性的最终有效值
   * 计算顺序: baseStat + additive 累加 → multiply 连乘 → override 覆盖
   * @param {object} entity     - 实体，需有 base[Stat] 或直接的属性字段
   * @param {string} stat       - 属性名，如 "dmg"、"range"、"rate"
   * @param {number} [base]     - 基础值（如不传则自动读取 entity["base_"+stat] 或 entity[stat]）
   * @returns {number}
   */
  calcEffectiveStat(entity, stat, base) {
    this._ensureBufArray(entity);
    // 获取基础值
    let baseVal = base !== undefined ? base
      : (entity['base_' + stat] !== undefined ? entity['base_' + stat] : entity[stat] || 0);

    // 过滤当前属性的所有活跃 Buff
    const relevant = entity.buffs.filter(b => b.stat === stat);

    // 1. override（直接覆盖，取最后一个）
    const overrides = relevant.filter(b => b.op === 'override');
    if (overrides.length > 0) {
      return overrides[overrides.length - 1].value;
    }

    // 2. additive 累加
    let addSum = 0;
    relevant.filter(b => b.op === 'additive').forEach(b => { addSum += b.value; });

    // 3. multiply 连乘
    let mulProduct = 1;
    relevant.filter(b => b.op === 'multiply').forEach(b => { mulProduct *= b.value; });

    return (baseVal + addSum) * mulProduct;
  },

  /**
   * 检查实体是否拥有某个 id 的 Buff
   */
  has(entity, buffId) {
    this._ensureBufArray(entity);
    return entity.buffs.some(b => b.id === buffId);
  },

  /**
   * 获取实体所有活跃 Buff 的摘要（调试用）
   */
  summary(entity) {
    this._ensureBufArray(entity);
    return entity.buffs.map(b =>
      `[${b.id}] ${b.stat} ${b.op}(${b.value}) rem:${b.remaining}`
    ).join(', ') || '(无 Buff)';
  }
};

// ── 导出（兼容 Node.js require 和 浏览器全局）────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BuffManager, validateBuffDef, createBuffInstance };
} else {
  // 浏览器全局
  window.BuffManager = BuffManager;
  window.validateBuffDef = validateBuffDef;
}
