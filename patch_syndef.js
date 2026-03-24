const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const lines = html.split('\n');

// 找 Worker 内的 SYN_DEF
const s = lines.findIndex(l => l.includes('const SYN_DEF=[') || l.includes('const SYN_DEF = ['));
let depth=0, e=-1;
for(let i=s;i<lines.length;i++){
  for(const ch of lines[i]){ if(ch==='[') depth++; else if(ch===']') depth--; }
  if(i>s && depth===0){ e=i; break; }
}
console.log(`SYN_DEF: ${s+1} ~ ${e+1}，共 ${e-s+1} 行`);

const newSynDef = [
`const SYN_DEF=[`,
`  // ══ 奥术法师 ══`,
`  {id:'arcane',  name:'奥术法师', emoji:'🔮', category:'功能系',`,
`   chars:['c11001','c11002','c11003','c11004','c11005','c11006'],`,
`   tiers:[`,
`     {need:2, desc:'2件套：法术伤害+20%，攻击有15%概率弹射1个目标（50%伤害）', fx:{dmg:0.20}},`,
`     {need:4, desc:'4件套：法术伤害+45%，弹射概率+30%，弹射可跳2目标',          fx:{dmg:0.45}},`,
`     {need:6, desc:'6件套：法术伤害+80%，每15次攻击触发魔法风暴（范围100%伤害/秒持续5秒）', fx:{dmg:0.80}},`,
`   ]},`,
`  // ══ 游侠射手 ══`,
`  {id:'ranger',  name:'游侠射手', emoji:'🏹', category:'功能系',`,
`   chars:['c12001','c12002','c12003','c12004','c12005','c12006'],`,
`   tiers:[`,
`     {need:2, desc:'2件套：射程+15%，攻击穿透第一个目标对后方目标造成50%伤害',  fx:{rng:0.15}},`,
`     {need:4, desc:'4件套：射程+30%，每5次攻击发射3连射（各60%伤害）',           fx:{rng:0.30}},`,
`     {need:6, desc:'6件套：射程+50%，暴击率+35%，每18次攻击穿透全部目标400%伤害', fx:{rng:0.50}},`,
`   ]},`,
`  // ══ 战士先锋 ══`,
`  {id:'warrior', name:'战士先锋', emoji:'⚔️', category:'功能系',`,
`   chars:['c13001','c13002','c13003','c13004','c13005','c13006'],`,
`   tiers:[`,
`     {need:2, desc:'2件套：攻击力+20%，每次攻击15%概率冲锋（伤害+50%）',         fx:{dmg:0.20}},`,
`     {need:4, desc:'4件套：攻击力+40%，冲锋概率+25%，破甲效果(-50护甲)可叠加3层', fx:{dmg:0.40}},`,
`     {need:6, desc:'6件套：攻击力+70%，每15次攻击必定暴击，近战范围+30%',         fx:{dmg:0.70}},`,
`   ]},`,
`];`,
];

lines.splice(s, e - s + 1, ...newSynDef);
fs.writeFileSync(path.join(__dirname,'index.html'), lines.join('\n'));
console.log('✅ Worker 内 SYN_DEF 已同步更新为 arcane/ranger/warrior');
