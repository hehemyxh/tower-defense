const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const lines = html.split('\n');

const s = lines.findIndex(l => l.includes('const TALI = ['));
const e = lines.findIndex((l,i) => i > s && l.trim() === '];');
console.log(`TALI: ${s+1} ~ ${e+1}`);

const newTali = [
`const TALI = [`,
`  // ── 基础符咒（全局加成）──`,
`  {id:'spd',  name:'疾风符', desc:'己方全部塔攻速+20%',   fx:'spd', v:0.2,  rarity:'common'},`,
`  {id:'dmg',  name:'烈火符', desc:'己方全部塔攻击力+15%', fx:'dmg', v:0.15, rarity:'common'},`,
`  {id:'rng',  name:'远望符', desc:'己方全部塔射程+20%',   fx:'rng', v:0.2,  rarity:'common'},`,
`  // ── 羁绊专属符咒 ──`,
`  {id:'syn_arcane',  name:'🔮奥术之咒', desc:'【奥术法师】弹射概率从18%→45%，弹射链从1→3，魔法风暴伤害+80%',`,
`   fx:'syn', synTarget:'arcane',  rarity:'epic',`,
`   bonuses:{bounceChance:0.45, bounceChain:3, ultimateMult:1.8}},`,
`  {id:'syn_ranger',  name:'🏹游侠之咒', desc:'【游侠射手】穿透箭伤害+60%，每5次攻击必发3连射，暴击伤害+50%',`,
`   fx:'syn', synTarget:'ranger',  rarity:'rare',`,
`   bonuses:{pierceMult:1.6, burstGuaranteed:true, critMult:1.5}},`,
`  {id:'syn_warrior', name:'⚔️战魂之咒', desc:'【战士先锋】破甲层数上限从2→5，冲锋伤害+80%，追加概率20%→40%',`,
`   fx:'syn', synTarget:'warrior', rarity:'rare',`,
`   bonuses:{armorShredMax:5, armorShredPct:0.10, dblHitChance:0.40}},`,
`];`,
];

lines.splice(s, e - s + 1, ...newTali);
fs.writeFileSync(path.join(__dirname,'index.html'), lines.join('\n'));
console.log('✅ TALI 已更新为 6 条（3基础 + 3专属）');
