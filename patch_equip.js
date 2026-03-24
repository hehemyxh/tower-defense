const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const lines = html.split('\n');

// 找 EQUIP_DATA 起止行
const s = lines.findIndex(l => l.includes('const EQUIP_DATA = {') || l.includes('const EQUIP_DATA={'));
// 找配套的结束 };
let depth=0, e=-1;
for(let i=s;i<lines.length;i++){
  for(const ch of lines[i]){ if(ch==='{') depth++; else if(ch==='}') depth--; }
  if(i>s && depth===0){ e=i; break; }
}
console.log(`EQUIP_DATA: ${s+1} ~ ${e+1}`);

// 找 EQUIP_SETS 起止行
const ss = lines.findIndex(l => l.includes('const EQUIP_SETS = {') || l.includes('const EQUIP_SETS={'));
let depth2=0, se=-1;
for(let i=ss;i<lines.length;i++){
  for(const ch of lines[i]){ if(ch==='{') depth2++; else if(ch==='}') depth2--; }
  if(i>ss && depth2===0){ se=i; break; }
}
console.log(`EQUIP_SETS: ${ss+1} ~ ${se+1}`);

// 新的 EQUIP_DATA：dragon套4件 + eagle_eye + war_drum
const newEquipData = [
`const EQUIP_DATA = {`,
`  // ══ 龙魂套装（4件）══`,
`  dragon_sword:  {name:'龙牙剑',  icon:'🗡️', quality:'rare',      set:'dragon', stat:{dmg:0.12},          price:80,  desc:'攻击+12%'},`,
`  dragon_scale:  {name:'龙鳞甲',  icon:'🦎', quality:'epic',      set:'dragon', stat:{dmg:0.15,rng:0.08},  price:120, desc:'攻击+15% 射程+8%'},`,
`  dragon_wings:  {name:'龙翼弓',  icon:'🏹', quality:'epic',      set:'dragon', stat:{rng:0.15,spd:0.08},  price:130, desc:'射程+15% 攻速+8%'},`,
`  dragon_crown:  {name:'龙魂冠',  icon:'👑', quality:'legendary', set:'dragon', stat:{dmg:0.20,rng:0.12},  price:180, desc:'攻击+20% 射程+12%'},`,
`  // ══ 散件（无套装）══`,
`  eagle_eye:     {name:'鹰眼单镜',icon:'🦅', quality:'rare',      set:null,     stat:{rng:0.20},           price:95,  desc:'射程+20%'},`,
`  war_drum:      {name:'战鼓',    icon:'🥁', quality:'rare',      set:null,     stat:{spd:0.18},           price:90,  desc:'攻速+18%'},`,
`};`,
];

// 新的 EQUIP_SETS：只保留 dragon
const newEquipSets = [
`const EQUIP_SETS = {`,
`  dragon:{`,
`    name:'龙魂', icon:'🐉', color:'#ff7043',`,
`    bonuses:[`,
`      {need:2, bonus:{dmg:0.20},          desc:'2件：全局攻击+20%'},`,
`      {need:4, bonus:{dmg:0.50,rng:0.15}, desc:'4件：全局攻击+50% 射程+15%'},`,
`    ]`,
`  },`,
`};`,
];

// 替换 EQUIP_SETS（先替后续，避免行号偏移）
lines.splice(ss, se - ss + 1, ...newEquipSets);
// 替换 EQUIP_DATA
lines.splice(s,  e  - s  + 1, ...newEquipData);

fs.writeFileSync(path.join(__dirname,'index.html'), lines.join('\n'));
console.log('✅ EQUIP_DATA 已更新为 6 件（dragon×4 + 散件×2）');
console.log('✅ EQUIP_SETS 已更新为 1 套（dragon 2/4件套）');
