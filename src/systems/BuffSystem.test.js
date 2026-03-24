/**
 * BuffSystem.test.js
 * 运行: node src/systems/BuffSystem.test.js
 */
'use strict';
const { BuffManager, validateBuffDef } = require('./BuffSystem');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch(e) { console.error(`  ✗ ${name}\n    ${e.message}`); failed++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }
function assertClose(a, b, msg) { if (Math.abs(a - b) > 0.0001) throw new Error(msg || `期望 ${b}，实际 ${a}`); }

console.log('\n🧪 BuffSystem 单元测试\n');

// ── validateBuffDef ──
console.log('── validateBuffDef ──');
test('合法 def 通过验证', () => {
  const r = validateBuffDef({ id: 'test', stat: 'dmg', op: 'multiply', value: 1.2 });
  assert(r.valid, r.error);
});
test('缺少 stat 返回错误', () => {
  const r = validateBuffDef({ id: 'test', op: 'multiply', value: 1.2 });
  assert(!r.valid && r.error.includes('stat'));
});
test('无效 op 返回错误', () => {
  const r = validateBuffDef({ id: 'test', stat: 'dmg', op: 'magic', value: 1.2 });
  assert(!r.valid);
});

// ── apply / remove ──
console.log('\n── apply / remove ──');
test('apply 永久 Buff', () => {
  const e = {};
  BuffManager.apply(e, { id: 'b1', stat: 'dmg', op: 'multiply', value: 1.2, duration: -1 });
  assert(e.buffs.length === 1);
  assert(e.buffs[0].remaining === -1, '永久 Buff remaining 应为 -1');
});
test('apply replace：同 id 只保留最新', () => {
  const e = {};
  BuffManager.apply(e, { id: 'b1', stat: 'dmg', op: 'multiply', value: 1.2, stackRule: 'replace' });
  BuffManager.apply(e, { id: 'b1', stat: 'dmg', op: 'multiply', value: 1.5, stackRule: 'replace' });
  assert(e.buffs.length === 1, '应只有1个');
  assert(e.buffs[0].value === 1.5, '应为最新值 1.5');
});
test('apply stack：允许同 id 多层', () => {
  const e = {};
  BuffManager.apply(e, { id: 'bs', stat: 'dmg', op: 'additive', value: 10, stackRule: 'stack' });
  BuffManager.apply(e, { id: 'bs', stat: 'dmg', op: 'additive', value: 10, stackRule: 'stack' });
  assert(e.buffs.length === 2, '应叠加为 2 层');
});
test('remove 移除指定 id', () => {
  const e = {};
  BuffManager.apply(e, { id: 'b_rm', stat: 'dmg', op: 'multiply', value: 1.2 });
  BuffManager.remove(e, 'b_rm');
  assert(e.buffs.length === 0);
});

// ── tick ──
console.log('\n── tick ──');
test('有限期 Buff tick 倒计时并到期移除', () => {
  const e = {};
  BuffManager.apply(e, { id: 'bt', stat: 'dmg', op: 'additive', value: 5, duration: 3 });
  assert(e.buffs[0].remaining === 3);
  BuffManager.tick(e); assert(e.buffs[0].remaining === 2);
  BuffManager.tick(e); assert(e.buffs[0].remaining === 1);
  const removed = BuffManager.tick(e);
  assert(e.buffs.length === 0, 'Buff 应已到期移除');
  assert(removed.includes('bt'), '应返回移除的 id');
});
test('永久 Buff 不受 tick 影响', () => {
  const e = {};
  BuffManager.apply(e, { id: 'bp', stat: 'dmg', op: 'multiply', value: 1.2, duration: -1 });
  for (let i = 0; i < 100; i++) BuffManager.tick(e);
  assert(e.buffs.length === 1, '永久 Buff 应保持');
});

// ── calcEffectiveStat ──
console.log('\n── calcEffectiveStat ──');
test('无 Buff：返回基础值', () => {
  const e = { dmg: 100 };
  assertClose(BuffManager.calcEffectiveStat(e, 'dmg'), 100);
});
test('additive +10 +5 = base + 15', () => {
  const e = { dmg: 100 };
  BuffManager.apply(e, { id: 'a1', stat: 'dmg', op: 'additive', value: 10, stackRule: 'stack' });
  BuffManager.apply(e, { id: 'a2', stat: 'dmg', op: 'additive', value: 5, stackRule: 'stack' });
  assertClose(BuffManager.calcEffectiveStat(e, 'dmg'), 115, 'additive 应为 115');
});
test('multiply ×1.20 = base × 1.20', () => {
  const e = { dmg: 100 };
  BuffManager.apply(e, { id: 'm1', stat: 'dmg', op: 'multiply', value: 1.20 });
  assertClose(BuffManager.calcEffectiveStat(e, 'dmg'), 120, 'multiply 应为 120');
});
test('additive +10 先于 multiply ×1.20: (100+10)×1.20 = 132', () => {
  const e = { dmg: 100 };
  BuffManager.apply(e, { id: 'a_', stat: 'dmg', op: 'additive', value: 10, stackRule: 'stack' });
  BuffManager.apply(e, { id: 'm_', stat: 'dmg', op: 'multiply', value: 1.20 });
  assertClose(BuffManager.calcEffectiveStat(e, 'dmg'), 132, '应为 132');
});
test('override 直接覆盖', () => {
  const e = { dmg: 100 };
  BuffManager.apply(e, { id: 'ov', stat: 'dmg', op: 'override', value: 999 });
  assertClose(BuffManager.calcEffectiveStat(e, 'dmg'), 999, 'override 应为 999');
});
test('奥术羁绊 2 件套: dmg ×1.20', () => {
  const tower = { dmg: 50, buffs: [] };
  const arcane2Buff = { id: 'arcane_dmg_2', source: 'synergy', stat: 'dmg', op: 'multiply', value: 1.20, duration: -1, stackRule: 'replace' };
  BuffManager.apply(tower, arcane2Buff);
  assertClose(BuffManager.calcEffectiveStat(tower, 'dmg'), 60, '奥术 2 件套 dmg 应为 60');
});

// ── 结果 ──
console.log(`\n${'─'.repeat(40)}`);
console.log(`结果: ${passed} 通过 / ${failed} 失败`);
if (failed > 0) { console.error('❌ 测试未通过！'); process.exit(1); }
else console.log('✅ 所有测试通过！');
