
'use strict';
// ════════════════════════════════════════════════════════
// 一、游戏数据
// ════════════════════════════════════════════════════════
const CHARS = [
  // ══ 疾风剑豪 ══  N/N/N R/R/R SR/SR/SR SSR/SSR/SSR
  {id:'c1001',rarity:'n', name:'疾风刺客',emoji:'🗡️',color:'#74b9ff',dmg:30,range:100,rate:1.5,syns:['swift','shadow'],desc:'攻速流刺客',skill:{name:'疾风斩',icon:'🗡️',type:'被动',desc:'每5次攻击连斩相邻目标，造成80%伤害'}},
  {id:'c1002',rarity:'n', name:'旋风舞者',emoji:'🌪️',color:'#81ecec',dmg:28,range:90,rate:1.6,syns:['swift','warrior'],desc:'范围攻速型',skill:{name:'旋风斩',icon:'🌪️',type:'被动',desc:'攻击时对周围180px内敌人造成40%溅射'}},
  {id:'c1003',rarity:'n', name:'气流导师',emoji:'💨',color:'#a29bfe',dmg:32,range:110,rate:1.4,syns:['swift','arcane'],desc:'技能强化型',skill:{name:'气流加速',icon:'💨',type:'被动',desc:'攻速每提升10%，伤害额外+5%，最多叠加10层'}},
  {id:'c1004',rarity:'r', name:'断空射手',emoji:'🏹',color:'#fd79a8',dmg:48,range:145,rate:1.3,syns:['swift','ranger'],desc:'远程高速型',skill:{name:'空斩箭',icon:'🏹',type:'被动',desc:'攻击有15%概率发射穿透箭，穿透2个目标'}},
  {id:'c1005',rarity:'r', name:'绝命剑圣',emoji:'⚔️',color:'#e17055',dmg:60,range:95,rate:1.2,syns:['swift','crit'],desc:'暴击专精型',skill:{name:'剑圣裂斩',icon:'⚔️',type:'主动',desc:'每12次攻击，暴击率临时+50%持续3秒'}},
  {id:'c1006',rarity:'r', name:'风语者',emoji:'🌬️',color:'#00cec9',dmg:55,range:120,rate:1.5,syns:['swift','nature'],desc:'自然亲和型',skill:{name:'风语加速',icon:'🌬️',type:'被动',desc:'攻击时10%概率使周围60px内所有友方塔攻速+15%持续3秒'}},
  {id:'c1007',rarity:'sr',name:'闪电剑客',emoji:'⚡',color:'#fdcb6e',dmg:75,range:118,rate:1.5,syns:['swift','element'],desc:'元素附魔型',skill:{name:'雷电剑',icon:'⚡',type:'被动',desc:'攻击附带雷电，额外造成20点伤害并麻痹0.3秒'}},
  {id:'c1008',rarity:'sr',name:'暴风武者',emoji:'🌀',color:'#6c5ce7',dmg:68,range:108,rate:1.7,syns:['swift','warrior'],desc:'近战强化型',skill:{name:'暴风连击',icon:'🌀',type:'被动',desc:'近战范围攻速额外+20%，伤害+15%'}},
  {id:'c1009',rarity:'sr',name:'疾风剑仙',emoji:'🌟',color:'#ffeaa7',dmg:90,range:125,rate:1.8,syns:['swift','dragon'],desc:'传说攻速型',skill:{name:'仙剑破空',icon:'🌟',type:'主动',desc:'每20次攻击，对直线所有敌人造成300%伤害'}},
  {id:'c1010',rarity:'ssr',name:'瞬影刀客',emoji:'🌑',color:'#7fe7ff',dmg:105,range:130,rate:2.0,syns:['swift','shadow'],desc:'隐身突袭·SSR',skill:{name:'瞬影',icon:'🌑',type:'被动',desc:'每次攻击后20%概率隐身0.5秒，期间伤害+30%'}},
  {id:'c1011',rarity:'ssr',name:'狂风战士',emoji:'💫',color:'#c084fc',dmg:115,range:125,rate:1.9,syns:['swift','warrior'],desc:'持续输出·SSR',skill:{name:'狂风连斩',icon:'💫',type:'被动',desc:'连续攻击同一目标时每次伤害+8%，最多5层'}},
  {id:'c1012',rarity:'ssr',name:'风神之刃',emoji:'⚡',color:'#00b894',dmg:130,range:145,rate:2.2,syns:['swift','element'],desc:'三羁绊传说·SSR',skill:{name:'神风斩',icon:'⚡',type:'主动',desc:'每15次攻击，召唤风刃风暴5秒，全体攻速+50%'}},
  // ══ 重炮火力 ══
  {id:'c2001',name:'火炮兵',emoji:'💣',color:'#e17055',dmg:80,range:160,rate:0.5,syns:['cannon','warrior'],desc:'基础炮击型',skill:{name:'炮击',icon:'💣',type:'被动',desc:'攻击范围80px爆炸，溅射目标50%伤害'}},
  {id:'c2002',name:'榴弹兵',emoji:'💥',color:'#d63031',dmg:100,range:170,rate:0.45,syns:['cannon','tank'],desc:'防线炮击型',skill:{name:'榴弹轰炸',icon:'💥',type:'主动',desc:'每8次攻击，投掷榴弹造成范围300%伤害'}},
  {id:'c2003',name:'炮台师',emoji:'🏴',color:'#e84393',dmg:90,range:165,rate:0.5,syns:['cannon','mech'],desc:'机械炮击型',skill:{name:'炮台部署',icon:'🏴',type:'主动',desc:'每30秒部署一门炮台（80%属性），持续20秒'}},
  {id:'c2004',name:'狙击炮手',emoji:'🔭',color:'#636e72',dmg:120,range:200,rate:0.35,syns:['cannon','ranger'],desc:'超远程炮击型',skill:{name:'精准炮击',icon:'🔭',type:'被动',desc:'攻击最远目标时伤害+50%，穿透2目标'}},
  {id:'c2005',name:'爆破专家',emoji:'💨',color:'#fdcb6e',dmg:95,range:155,rate:0.55,syns:['cannon','element'],desc:'元素炮击型',skill:{name:'爆破',icon:'💨',type:'主动',desc:'每10次攻击，范围120px造成400%火焰伤害'}},
  {id:'c2006',name:'弹幕师',emoji:'🌀',color:'#a29bfe',dmg:70,range:155,rate:0.65,syns:['cannon','arcane'],desc:'法术炮击型',skill:{name:'魔法弹幕',icon:'🌀',type:'被动',desc:'每次攻击额外生成2发散射弹（各30%伤害）'}},
  {id:'c2007',name:'轰炸机',emoji:'✈️',color:'#74b9ff',dmg:140,range:175,rate:0.4,syns:['cannon','dragon'],desc:'龙族炮击型',skill:{name:'地毯轰炸',icon:'✈️',type:'主动',desc:'每20次攻击，横线轰炸造成500%伤害'}},
  {id:'c2008',name:'炮兵将军',emoji:'🎖️',color:'#ffd700',dmg:160,range:180,rate:0.4,syns:['cannon','warrior'],desc:'指挥炮击型',skill:{name:'炮兵齐射',icon:'🎖️',type:'主动',desc:'每25次攻击，全体炮击单位同时攻击一次'}},
  {id:'c2009',name:'核爆者',emoji:'☢️',color:'#e17055',dmg:200,range:170,rate:0.35,syns:['cannon'],desc:'核爆传说型',skill:{name:'核爆',icon:'☢️',type:'主动',desc:'每40秒，范围200px造成1000%伤害，眩晕3秒'}},
  {id:'c2010',name:'炮兵学员',emoji:'💣',color:'#b2bec3',dmg:55,range:145,rate:0.6,syns:['cannon'],desc:'基础炮兵型',skill:{name:'基础炮击',icon:'💣',type:'被动',desc:'攻击范围60px爆炸，溅射目标30%伤害'}},
  {id:'c2011',name:'重炮兵',emoji:'🔩',color:'#636e72',dmg:110,range:162,rate:0.45,syns:['cannon','tank'],desc:'重甲炮击型',skill:{name:'重炮轰击',icon:'🔩',type:'被动',desc:'攻击使目标减速20%，持续2秒'}},
  {id:'c2012',name:'炮神',emoji:'👑',color:'#e17055',dmg:250,range:185,rate:0.4,syns:['cannon'],desc:'炮击终极传说',skill:{name:'神炮降临',icon:'👑',type:'主动',desc:'每30秒，召唤神炮15秒，每秒对随机区域造成500%伤害'}},
  // ══ 暴击猎手 ══
  {id:'c3001',name:'猎手',emoji:'🎯',color:'#fd79a8',dmg:50,range:135,rate:1.1,syns:['crit','ranger'],desc:'基础暴击型',skill:{name:'精准射击',icon:'🎯',type:'被动',desc:'暴击率+10%，暴击时目标减速20%持续1秒'}},
  {id:'c3002',name:'猎杀者',emoji:'🦊',color:'#f39c12',dmg:65,range:140,rate:1.0,syns:['crit','shadow'],desc:'暗影暴击型',skill:{name:'致命一击',icon:'🦊',type:'被动',desc:'每8次攻击，下次攻击必定暴击（300%伤害）'}},
  {id:'c3003',name:'剑术家',emoji:'🗡️',color:'#74b9ff',dmg:60,range:100,rate:1.2,syns:['crit','warrior'],desc:'近战暴击型',skill:{name:'剑术',icon:'🗡️',type:'被动',desc:'连续暴击时，下次暴击伤害+20%，最多5层'}},
  {id:'c3004',name:'暴走者',emoji:'😡',color:'#d63031',dmg:75,range:105,rate:1.0,syns:['crit','warrior'],desc:'狂暴暴击型',skill:{name:'狂暴冲击',icon:'😡',type:'被动',desc:'生命低于30%时，暴击率+30%，暴击伤害+100%'}},
  {id:'c3005',name:'精灵弓手',emoji:'🏹',color:'#55efc4',dmg:55,range:155,rate:1.1,syns:['crit','ranger'],desc:'远程暴击型',skill:{name:'精灵箭',icon:'🏹',type:'被动',desc:'暴击时额外发射精灵箭（100%伤害）至随机目标'}},
  {id:'c3006',name:'幸运剑客',emoji:'⭐',color:'#ffd700',dmg:70,range:118,rate:1.0,syns:['crit','swift'],desc:'速度暴击型',skill:{name:'幸运一击',icon:'⭐',type:'被动',desc:'攻速每提升10%，暴击率额外+2%'}},
  {id:'c3007',name:'雷霆枪骑士',emoji:'⚡',color:'#fdcb6e',dmg:85,range:130,rate:0.9,syns:['crit','element'],desc:'元素暴击型',skill:{name:'雷霆暴击',icon:'⚡',type:'被动',desc:'暴击时触发雷霆，跳转至3个目标各造成50%伤害'}},
  {id:'c3008',name:'鹰眼猎手',emoji:'🦅',color:'#e17055',dmg:100,range:165,rate:0.85,syns:['crit','ranger'],desc:'远程狙击型',skill:{name:'鹰眼',icon:'🦅',type:'被动',desc:'射程每增加10px，暴击伤害+5%'}},
  {id:'c3009',name:'暴击之神',emoji:'🌟',color:'#ffd700',dmg:130,range:145,rate:0.9,syns:['crit'],desc:'暴击传说型',skill:{name:'神临暴击',icon:'🌟',type:'主动',desc:'每20次攻击，5秒内所有攻击变为超级暴击（500%伤害）'}},
  {id:'c3010',name:'初级猎手',emoji:'🎯',color:'#b2bec3',dmg:38,range:125,rate:1.2,syns:['crit'],desc:'基础初级型',skill:{name:'瞄准',icon:'🎯',type:'被动',desc:'静止3秒后下次攻击必定暴击'}},
  {id:'c3011',name:'命中大师',emoji:'🎪',color:'#a29bfe',dmg:55,range:138,rate:1.0,syns:['crit','arcane'],desc:'法术暴击型',skill:{name:'命中增幅',icon:'🎪',type:'被动',desc:'暴击时，下次技能威力+30%'}},
  {id:'c3012',name:'猎神',emoji:'👑',color:'#ff6b6b',dmg:150,range:155,rate:0.95,syns:['crit'],desc:'暴击终极传说',skill:{name:'猎神降临',icon:'👑',type:'主动',desc:'每15秒，所有暴击猎手单位暴击率变为100%持续5秒'}},
  // ══ 元素使者 ══
  {id:'c4001',name:'火元素使',emoji:'🔥',color:'#e17055',dmg:60,range:130,rate:0.8,syns:['element','arcane'],desc:'火焰元素型',skill:{name:'火焰爆发',icon:'🔥',type:'被动',desc:'攻击附带燃烧，每秒15点持续3秒，可叠加3层'}},
  {id:'c4002',name:'冰元素使',emoji:'❄️',color:'#74b9ff',dmg:55,range:135,rate:0.85,syns:['element','arcane'],desc:'冰霜元素型',skill:{name:'冰霜光环',icon:'❄️',type:'被动',desc:'攻击附带冰冻，减速目标40%持续1.5秒'}},
  {id:'c4003',name:'雷元素使',emoji:'⚡',color:'#fdcb6e',dmg:65,range:140,rate:0.75,syns:['element','arcane'],desc:'雷电元素型',skill:{name:'雷电链',icon:'⚡',type:'被动',desc:'攻击时触发闪电链，跳跃2个目标各造成60%伤害'}},
  {id:'c4004',name:'土元素使',emoji:'🌍',color:'#8B4513',dmg:70,range:115,rate:0.7,syns:['element','tank'],desc:'大地元素型',skill:{name:'大地震颤',icon:'🌍',type:'主动',desc:'每12次攻击，范围震颤眩晕所有目标1秒'}},
  {id:'c4005',name:'风元素使',emoji:'🌬️',color:'#81ecec',dmg:50,range:148,rate:1.0,syns:['element','swift'],desc:'风系元素型',skill:{name:'风暴加速',icon:'🌬️',type:'被动',desc:'元素攻击后，攻速+5%，最多叠加8层'}},
  {id:'c4006',name:'水元素使',emoji:'🌊',color:'#3498db',dmg:58,range:138,rate:0.9,syns:['element','nature'],desc:'水系元素型',skill:{name:'水流冲击',icon:'🌊',type:'主动',desc:'每10次攻击，水流击退所有前方目标并减速50%持续2秒'}},
  {id:'c4007',name:'光元素使',emoji:'✨',color:'#ffd700',dmg:72,range:150,rate:0.8,syns:['element','holy'],desc:'光系元素型',skill:{name:'圣光爆炸',icon:'✨',type:'主动',desc:'每15次攻击，对范围100px造成300%神圣伤害'}},
  {id:'c4008',name:'暗元素使',emoji:'🌑',color:'#6c5ce7',dmg:80,range:142,rate:0.75,syns:['element','shadow'],desc:'暗系元素型',skill:{name:'暗能爆发',icon:'🌑',type:'被动',desc:'目标带有负面状态时，伤害+30%'}},
  {id:'c4009',name:'元素法神',emoji:'🌈',color:'#a29bfe',dmg:120,range:158,rate:0.75,syns:['element'],desc:'元素传说型',skill:{name:'元素大爆发',icon:'🌈',type:'主动',desc:'每20次攻击，随机六种元素同时爆发，范围内大量伤害'}},
  {id:'c4010',name:'元素学徒',emoji:'📖',color:'#dfe6e9',dmg:38,range:122,rate:1.0,syns:['element'],desc:'基础元素型',skill:{name:'元素弹',icon:'📖',type:'被动',desc:'攻击时随机附带一种元素效果（火/冰/雷轮流）'}},
  {id:'c4011',name:'元素骑士',emoji:'⚔️',color:'#e17055',dmg:65,range:108,rate:0.9,syns:['element','warrior'],desc:'近战元素型',skill:{name:'元素斩击',icon:'⚔️',type:'被动',desc:'近战攻击附带元素，每次随机不同元素效果'}},
  {id:'c4012',name:'元素之神',emoji:'👑',color:'#ffd700',dmg:160,range:165,rate:0.8,syns:['element'],desc:'元素终极传说',skill:{name:'元素神降',icon:'👑',type:'主动',desc:'每25秒，同时释放所有元素技能，每种元素对全场造成200%伤害'}},
  // ══ 暗影刺客 ══
  {id:'c5001',name:'暗影忍者',emoji:'🌑',color:'#2d3436',dmg:55,range:110,rate:1.5,syns:['shadow','swift'],desc:'忍者突袭型',skill:{name:'暗影手里剑',icon:'🌑',type:'被动',desc:'攻击时30%概率追加50%伤害'}},
  {id:'c5002',name:'黑暗刺客',emoji:'☠️',color:'#6c5ce7',dmg:65,range:115,rate:1.2,syns:['shadow','crit'],desc:'暗杀暴击型',skill:{name:'致命暗杀',icon:'☠️',type:'被动',desc:'隐身后首次攻击必定暴击（300%）'}},
  {id:'c5003',name:'影子武者',emoji:'👥',color:'#636e72',dmg:60,range:105,rate:1.4,syns:['shadow','swift'],desc:'影分身型',skill:{name:'影分身',icon:'👥',type:'主动',desc:'每15次攻击召唤影分身8秒（50%属性）'}},
  {id:'c5004',name:'夜行者',emoji:'🌙',color:'#2d3436',dmg:70,range:120,rate:1.1,syns:['shadow','undead'],desc:'暗夜亡灵型',skill:{name:'暗夜侵蚀',icon:'🌙',type:'被动',desc:'攻击附带诅咒，每秒10点伤害持续3秒'}},
  {id:'c5005',name:'暗影大师',emoji:'🕶️',color:'#e84393',dmg:80,range:118,rate:1.3,syns:['shadow','swift'],desc:'攻速暗杀型',skill:{name:'暗影突刺',icon:'🕶️',type:'主动',desc:'每10次攻击，传送至目标身后造成400%伤害'}},
  {id:'c5006',name:'死亡使者',emoji:'💀',color:'#b2bec3',dmg:90,range:125,rate:1.0,syns:['shadow','undead'],desc:'亡灵刺客型',skill:{name:'死亡审判',icon:'💀',type:'被动',desc:'目标血量低于20%时直接击杀（Boss无效）'}},
  {id:'c5007',name:'影刃',emoji:'⚔️',color:'#a29bfe',dmg:100,range:120,rate:1.2,syns:['shadow','swift'],desc:'速度暗影传说',skill:{name:'影刃斩',icon:'⚔️',type:'被动',desc:'攻击时25%概率发动双重攻击（各100%伤害）'}},
  {id:'c5008',name:'暗杀之王',emoji:'👑',color:'#ff6b6b',dmg:115,range:130,rate:1.1,syns:['shadow','crit'],desc:'暴击暗杀传说',skill:{name:'王者暗杀',icon:'👑',type:'主动',desc:'每20次攻击，对HP最低目标造成600%暴击伤害'}},
  {id:'c5009',name:'虚空刺客',emoji:'🌀',color:'#6c5ce7',dmg:125,range:135,rate:1.0,syns:['shadow','dragon'],desc:'龙族暗影型',skill:{name:'虚空穿刺',icon:'🌀',type:'主动',desc:'每18次攻击，穿刺所有目标造成300%伤害无视防御'}},
  {id:'c5010',name:'潜行者',emoji:'👤',color:'#dfe6e9',dmg:45,range:108,rate:1.4,syns:['shadow'],desc:'基础潜行型',skill:{name:'潜行',icon:'👤',type:'被动',desc:'初始隐身，首次攻击伤害+100%'}},
  {id:'c5011',name:'影舞者',emoji:'💃',color:'#fd79a8',dmg:55,range:112,rate:1.6,syns:['shadow','swift'],desc:'舞者突袭型',skill:{name:'影舞',icon:'💃',type:'被动',desc:'连续暴击时攻速+10%，最多5层'}},
  {id:'c5012',name:'暗影之神',emoji:'🌑',color:'#8e44ad',dmg:160,range:140,rate:1.2,syns:['shadow'],desc:'暗影终极传说',skill:{name:'暗神降临',icon:'🌑',type:'主动',desc:'每12秒，全场敌人被黑暗笼罩2秒，受到+100%伤害'}},
  // ══ 钢铁壁垒 ══
  {id:'c6001',name:'铁盾卫兵',emoji:'🛡️',color:'#b2bec3',dmg:30,range:90,rate:1.0,syns:['tank','warrior'],desc:'基础坦克型',skill:{name:'铁壁',icon:'🛡️',type:'被动',desc:'受到伤害时10%概率格挡，减免50%伤害'}},
  {id:'c6002',name:'重装骑士',emoji:'⚔️',color:'#636e72',dmg:40,range:95,rate:0.9,syns:['tank','warrior'],desc:'近战坦克型',skill:{name:'冲锋',icon:'⚔️',type:'主动',desc:'每15次攻击冲锋，眩晕目标1.5秒'}},
  {id:'c6003',name:'钢铁守卫',emoji:'🤖',color:'#74b9ff',dmg:35,range:100,rate:0.85,syns:['tank','mech'],desc:'机械坦克型',skill:{name:'钢铁护甲',icon:'🤖',type:'被动',desc:'护甲提升，受到的物理伤害-15%'}},
  {id:'c6004',name:'壁垒战士',emoji:'🏰',color:'#dfe6e9',dmg:45,range:92,rate:0.95,syns:['tank','warrior'],desc:'壁垒防御型',skill:{name:'壁垒冲锋',icon:'🏰',type:'被动',desc:'每受到100点伤害，下次攻击伤害+10%，最多5层'}},
  {id:'c6005',name:'圣骑士',emoji:'✝️',color:'#ffd700',dmg:50,range:105,rate:0.8,syns:['tank','holy'],desc:'圣光坦克型',skill:{name:'圣光护盾',icon:'✝️',type:'被动',desc:'受到致命伤害时触发护盾，吸收200点伤害，30秒冷却'}},
  {id:'c6006',name:'龙鳞骑士',emoji:'🐉',color:'#e17055',dmg:60,range:110,rate:0.85,syns:['tank','dragon'],desc:'龙族坦克型',skill:{name:'龙鳞护甲',icon:'🐉',type:'被动',desc:'龙族护甲，受到的所有伤害-20%'}},
  {id:'c6007',name:'泰坦巨人',emoji:'👊',color:'#2d3436',dmg:80,range:95,rate:0.7,syns:['tank','nature'],desc:'自然坦克传说',skill:{name:'大地守护',icon:'👊',type:'被动',desc:'死亡时场上所有单位护甲+100持续10秒'}},
  {id:'c6008',name:'不朽者',emoji:'💀',color:'#6c5ce7',dmg:70,range:100,rate:0.75,syns:['tank','undead'],desc:'亡灵坦克传说',skill:{name:'不朽意志',icon:'💀',type:'被动',desc:'每10次攻击触发不朽意志，下一次攻击造成400%伤害，并使目标硬直（减速至10%）持续2秒'}},
  {id:'c6009',name:'钢铁之神',emoji:'⚙️',color:'#fdcb6e',dmg:90,range:105,rate:0.8,syns:['tank','mech'],desc:'机械坦克传说',skill:{name:'钢铁神体',icon:'⚙️',type:'主动',desc:'每20秒激活，10秒内护甲+300，反伤50%'}},
  {id:'c6010',name:'盾战士',emoji:'🛡️',color:'#81ecec',dmg:28,range:88,rate:1.1,syns:['tank','warrior'],desc:'基础盾牌型',skill:{name:'盾击',icon:'🛡️',type:'被动',desc:'攻击时20%概率盾击，眩晕0.5秒'}},
  {id:'c6011',name:'重甲兵',emoji:'🔩',color:'#b2bec3',dmg:32,range:90,rate:1.0,syns:['tank'],desc:'基础重甲型',skill:{name:'重甲',icon:'🔩',type:'被动',desc:'受到近战伤害时反伤10%'}},
  {id:'c6012',name:'壁垒之王',emoji:'👑',color:'#dfe6e9',dmg:100,range:110,rate:0.85,syns:['tank'],desc:'坦克终极传说',skill:{name:'铜墙铁壁',icon:'👑',type:'被动',desc:'护甲+500，受到的所有伤害上限为最大生命值的5%'}},
  // ══ 圣光守护 ══
  {id:'c7001',name:'见习牧师',emoji:'✝️',color:'#ffd700',dmg:25,range:120,rate:1.1,syns:['holy','arcane'],desc:'基础圣光型',skill:{name:'圣光弱化',icon:'✝️',type:'被动',desc:'攻击附带圣光标记，使目标受到的伤害+8%持续4秒'}},
  {id:'c7002',name:'神圣牧师',emoji:'💫',color:'#ffeaa7',dmg:30,range:130,rate:1.0,syns:['holy','arcane'],desc:'圣光辅助型',skill:{name:'圣光压制',icon:'💫',type:'被动',desc:'每5次攻击，范围内所有敌人减速25%持续3秒'}},
  {id:'c7003',name:'光明祭司',emoji:'🌟',color:'#fdcb6e',dmg:35,range:135,rate:0.9,syns:['holy','element'],desc:'圣光控制型',skill:{name:'圣光爆发',icon:'🌟',type:'被动',desc:'攻击时25%概率触发圣光爆发，对目标周围50px内造成80%溅射伤害'}},
  {id:'c7004',name:'圣疗师',emoji:'💖',color:'#ff6b9d',dmg:40,range:125,rate:0.85,syns:['holy','nature'],desc:'圣光加速型',skill:{name:'圣光祝福',icon:'💖',type:'主动',desc:'每12次攻击，使周围120px内所有友方塔攻速+20%持续5秒'}},
  {id:'c7005',name:'大祭司',emoji:'⛪',color:'#f39c12',dmg:45,range:140,rate:0.8,syns:['holy','arcane'],desc:'强力治疗型',skill:{name:'神圣祈祷',icon:'⛪',type:'主动',desc:'每20秒，全体队友恢复15%最大生命值'}},
  {id:'c7006',name:'天使使者',emoji:'👼',color:'#ffd700',dmg:50,range:145,rate:0.85,syns:['holy','holy'],desc:'圣光传说型',skill:{name:'天使庇护',icon:'👼',type:'主动',desc:'蓝满时召唤圣光结界，30秒内范围120px内所有怪物持续减速30%且无法触发技能'}},
  {id:'c7007',name:'神圣骑士',emoji:'🛡️',color:'#f1c40f',dmg:55,range:115,rate:0.8,syns:['holy','tank'],desc:'坦克治疗型',skill:{name:'神圣冲锋',icon:'🛡️',type:'主动',desc:'每12次攻击，为最低血量队友提供300点护盾'}},
  {id:'c7008',name:'光之女神',emoji:'☀️',color:'#ffd700',dmg:70,range:155,rate:0.75,syns:['holy','holy'],desc:'女神传说型',skill:{name:'女神祝福',icon:'☀️',type:'主动',desc:'每25秒，全体无敌3秒并恢复30%生命值'}},
  {id:'c7009',name:'复活者',emoji:'✨',color:'#a29bfe',dmg:60,range:140,rate:0.7,syns:['holy','undead'],desc:'圣光亡灵型',skill:{name:'圣光审判',icon:'✨',type:'被动',desc:'攻击时附带圣光诅咒，使目标受到的暴击伤害提升30%持续6秒'}},
  {id:'c7010',name:'治疗学徒',emoji:'💊',color:'#55efc4',dmg:20,range:110,rate:1.2,syns:['holy'],desc:'基础圣光型',skill:{name:'圣光强化',icon:'💊',type:'被动',desc:'每10秒使附近80px内所有友方塔伤害+10%持续5秒'}},
  {id:'c7011',name:'光明使者',emoji:'🌟',color:'#fdcb6e',dmg:35,range:130,rate:0.95,syns:['holy','element'],desc:'元素圣光型',skill:{name:'圣光弹',icon:'🌟',type:'被动',desc:'攻击附带圣光，对亡灵敌人额外+50%伤害'}},
  {id:'c7012',name:'圣光之神',emoji:'👑',color:'#ffd700',dmg:90,range:160,rate:0.8,syns:['holy'],desc:'圣光终极传说',skill:{name:'圣光审判',icon:'👑',type:'主动',desc:'每15秒，清除所有负面状态并为全体恢复40%生命值'}},
  // ══ 自然之佑 ══
  {id:'c8001',name:'森林守护者',emoji:'🌲',color:'#27ae60',dmg:40,range:125,rate:0.8,syns:['nature','element'],desc:'自然防御型',skill:{name:'荆棘',icon:'🌲',type:'被动',desc:'受到攻击时对攻击者反伤15%'}},
  {id:'c8002',name:'德鲁伊',emoji:'🌿',color:'#2ecc71',dmg:35,range:130,rate:0.9,syns:['nature','element'],desc:'自然法术型',skill:{name:'自然呼唤',icon:'🌿',type:'被动',desc:'每5次攻击，使周围100px内所有敌人移动速度-15%并持续叠加，最多叠加5次'}},
  {id:'c8003',name:'树精',emoji:'🌳',color:'#16a085',dmg:50,range:110,rate:0.75,syns:['nature','mech'],desc:'自然召唤型',skill:{name:'召唤树人',icon:'🌳',type:'主动',desc:'每25秒召唤树人（60%属性）持续20秒'}},
  {id:'c8004',name:'花仙子',emoji:'🌸',color:'#ff6b9d',dmg:30,range:120,rate:1.1,syns:['nature','holy'],desc:'范围攻击型',skill:{name:'花粉爆散',icon:'🌸',type:'被动',desc:'每次攻击后10%概率对周围80px内所有敌人额外造成50%溅射伤害'}},
  {id:'c8005',name:'自然之灵',emoji:'🌺',color:'#00b894',dmg:55,range:135,rate:0.85,syns:['nature','element'],desc:'元素自然型',skill:{name:'自然元素爆发',icon:'🌺',type:'主动',desc:'每15次攻击，范围造成200%伤害'}},
  {id:'c8006',name:'古树守卫',emoji:'🌴',color:'#55efc4',dmg:65,range:115,rate:0.7,syns:['nature','tank'],desc:'自然坦克型',skill:{name:'古树护甲',icon:'🌴',type:'被动',desc:'每5秒恢复1%最大生命值，提供50点护甲'}},
  {id:'c8007',name:'森林之王',emoji:'👑',color:'#27ae60',dmg:80,range:140,rate:0.8,syns:['nature','nature'],desc:'自然传说型',skill:{name:'森林掌控',icon:'👑',type:'主动',desc:'每20秒，减速所有敌人50%持续3秒'}},
  {id:'c8008',name:'生命女神',emoji:'🌻',color:'#ffd700',dmg:70,range:150,rate:0.75,syns:['nature','holy'],desc:'治愈女神传说',skill:{name:'生命祝福',icon:'🌻',type:'被动',desc:'己方角色生命值始终维持在最大值80%以上'}},
  {id:'c8009',name:'大地之母',emoji:'🌍',color:'#8B4513',dmg:90,range:145,rate:0.7,syns:['nature','element'],desc:'大地传说型',skill:{name:'大地复苏',icon:'🌍',type:'主动',desc:'每30秒，全体恢复全部生命值，获得10秒30%伤害减免'}},
  {id:'c8010',name:'草药师',emoji:'🌿',color:'#55efc4',dmg:20,range:110,rate:1.2,syns:['nature'],desc:'基础自然型',skill:{name:'草药毒素',icon:'🌿',type:'被动',desc:'攻击附带草药毒素，每秒造成5%攻击力的毒伤持续5秒，可叠加3层'}},
  {id:'c8011',name:'藤蔓使者',emoji:'🌱',color:'#27ae60',dmg:28,range:118,rate:1.0,syns:['nature'],desc:'基础缠绕型',skill:{name:'藤蔓缠绕',icon:'🌱',type:'被动',desc:'攻击使目标减速15%并被藤蔓缠绕0.5秒'}},
  {id:'c8012',name:'自然之神',emoji:'🌈',color:'#00b894',dmg:110,range:155,rate:0.8,syns:['nature'],desc:'自然终极传说',skill:{name:'自然审判',icon:'🌈',type:'主动',desc:'每15秒，治愈全体并对所有敌人附加中毒（每秒5%生命值持续5秒）'}},
  // ══ 魔法护盾 ══
  {id:'c9001',name:'魔法学徒',emoji:'📖',color:'#a29bfe',dmg:30,range:120,rate:1.0,syns:['shield','arcane'],desc:'基础法盾型',skill:{name:'魔法护罩',icon:'📖',type:'被动',desc:'每15秒自动获得吸收50点魔法伤害的护盾'}},
  {id:'c9002',name:'护盾法师',emoji:'🔵',color:'#74b9ff',dmg:35,range:130,rate:0.9,syns:['shield','arcane'],desc:'护盾专精型',skill:{name:'法术护盾',icon:'🔵',type:'被动',desc:'受到魔法伤害时激活护盾，吸收100点伤害'}},
  {id:'c9003',name:'秘术师',emoji:'🔮',color:'#6c5ce7',dmg:40,range:128,rate:0.95,syns:['shield','arcane'],desc:'奥术防御型',skill:{name:'秘术屏障',icon:'🔮',type:'被动',desc:'己方所有角色魔法抗性+10'}},
  {id:'c9004',name:'魔导师',emoji:'⚗️',color:'#a29bfe',dmg:45,range:135,rate:0.85,syns:['shield','arcane'],desc:'法师防御型',skill:{name:'魔导屏障',icon:'⚗️',type:'主动',desc:'每20秒激活全场护盾，每人吸收200点伤害持续5秒'}},
  {id:'c9005',name:'结界师',emoji:'🌀',color:'#81ecec',dmg:50,range:125,rate:0.8,syns:['shield','mech'],desc:'结界召唤型',skill:{name:'结界展开',icon:'🌀',type:'主动',desc:'每25秒展开结界，10秒内令所有敌人攻速-30%'}},
  {id:'c9006',name:'法术守护者',emoji:'🛡️',color:'#a29bfe',dmg:55,range:138,rate:0.8,syns:['shield','arcane'],desc:'法术坦克型',skill:{name:'法术反弹',icon:'🛡️',type:'被动',desc:'受到魔法伤害时30%概率反弹50%伤害'}},
  {id:'c9007',name:'魔法骑士',emoji:'⚔️',color:'#74b9ff',dmg:60,range:115,rate:0.85,syns:['shield','tank'],desc:'骑士法盾型',skill:{name:'圣魔护盾',icon:'⚔️',type:'被动',desc:'每10次攻击，获得吸收300点伤害的魔法护盾'}},
  {id:'c9008',name:'魔导士',emoji:'📚',color:'#6c5ce7',dmg:75,range:150,rate:0.75,syns:['shield','arcane'],desc:'高级法盾型',skill:{name:'大魔法护盾',icon:'📚',type:'主动',desc:'每20秒，全体获得吸收500点伤害的护盾持续8秒'}},
  {id:'c9009',name:'魔法之神',emoji:'✨',color:'#a29bfe',dmg:100,range:160,rate:0.8,syns:['shield','arcane'],desc:'法盾传说型',skill:{name:'魔神之盾',icon:'✨',type:'主动',desc:'每15秒激活，10秒内所有魔法伤害对己方无效'}},
  {id:'c9010',name:'符文师',emoji:'🔣',color:'#dfe6e9',dmg:25,range:118,rate:1.1,syns:['shield'],desc:'基础符文型',skill:{name:'符文保护',icon:'🔣',type:'被动',desc:'己方角色免疫第一次受到的控制效果'}},
  {id:'c9011',name:'结界守护者',emoji:'🌀',color:'#74b9ff',dmg:40,range:125,rate:0.9,syns:['shield','tank'],desc:'防御结界型',skill:{name:'坚固结界',icon:'🌀',type:'被动',desc:'我方单位进入结界范围，护甲+50'}},
  {id:'c9012',name:'护盾之王',emoji:'👑',color:'#a29bfe',dmg:110,range:155,rate:0.8,syns:['shield'],desc:'护盾终极传说',skill:{name:'终极护盾',icon:'👑',type:'主动',desc:'每12秒，己方全体获得等同最大生命值20%的护盾'}},
  // ══ 机械工匠 ══
  {id:'c10001',name:'机械师',emoji:'🔧',color:'#b2bec3',dmg:30,range:115,rate:1.0,syns:['mech','arcane'],desc:'基础机械型',skill:{name:'微型炮台',icon:'🔧',type:'主动',desc:'每30秒部署微型炮台，持续15秒独立攻击（30%属性）'}},
  {id:'c10002',name:'工程师',emoji:'⚙️',color:'#636e72',dmg:40,range:120,rate:0.9,syns:['mech','cannon'],desc:'工程召唤型',skill:{name:'自动炮台',icon:'⚙️',type:'主动',desc:'每25秒部署自动炮台，持续20秒（50%属性）'}},
  {id:'c10003',name:'机器人操控师',emoji:'🤖',color:'#74b9ff',dmg:35,range:118,rate:0.95,syns:['mech','arcane'],desc:'机器人型',skill:{name:'机器人部队',icon:'🤖',type:'主动',desc:'每35秒召唤机器人（70%属性）持续25秒'}},
  {id:'c10004',name:'召唤师',emoji:'🔮',color:'#a29bfe',dmg:45,range:125,rate:0.85,syns:['mech','arcane'],desc:'召唤专精型',skill:{name:'召唤强化',icon:'🔮',type:'被动',desc:'己方召唤物攻击力+20%，生命值+30%'}},
  {id:'c10005',name:'机械指挥官',emoji:'🎖️',color:'#fdcb6e',dmg:55,range:130,rate:0.8,syns:['mech','cannon'],desc:'指挥召唤型',skill:{name:'全体指令',icon:'🎖️',type:'被动',desc:'场上所有召唤物攻击频率+25%'}},
  {id:'c10006',name:'机甲驾驶员',emoji:'🚀',color:'#6c5ce7',dmg:65,range:120,rate:0.85,syns:['mech','tank'],desc:'机甲坦克型',skill:{name:'机甲强化',icon:'🚀',type:'主动',desc:'每20秒激活机甲护盾，吸收500点伤害持续10秒'}},
  {id:'c10007',name:'机械领主',emoji:'🏭',color:'#e84393',dmg:80,range:138,rate:0.8,syns:['mech','cannon'],desc:'机械传说型',skill:{name:'机械军团',icon:'🏭',type:'主动',desc:'每40秒召唤机械军团（3个单位各80%属性）持续30秒'}},
  {id:'c10008',name:'机械之神',emoji:'⚙️',color:'#ffd700',dmg:100,range:145,rate:0.8,syns:['mech','tank'],desc:'机械坦克传说',skill:{name:'机神觉醒',icon:'⚙️',type:'主动',desc:'每30秒，所有召唤物属性×2持续15秒'}},
  {id:'c10009',name:'造物主',emoji:'🌟',color:'#a29bfe',dmg:120,range:155,rate:0.75,syns:['mech','arcane'],desc:'造物传说型',skill:{name:'创造奇迹',icon:'🌟',type:'主动',desc:'每45秒，将场上所有召唤物升级（属性+100%）持续20秒'}},
  {id:'c10010',name:'修理工',emoji:'🔨',color:'#dfe6e9',dmg:22,range:105,rate:1.2,syns:['mech'],desc:'基础维修型',skill:{name:'修理',icon:'🔨',type:'被动',desc:'每10秒修复最近召唤物20%生命值'}},
  {id:'c10011',name:'炮台工程师',emoji:'💣',color:'#b2bec3',dmg:38,range:118,rate:0.95,syns:['mech','cannon'],desc:'炮台专精型',skill:{name:'强化炮台',icon:'💣',type:'主动',desc:'每20秒部署强化炮台，持续25秒（80%属性，带范围攻击）'}},
  {id:'c10012',name:'机械大师',emoji:'👑',color:'#fdcb6e',dmg:130,range:150,rate:0.85,syns:['mech'],desc:'机械终极传说',skill:{name:'终极机械',icon:'👑',type:'主动',desc:'每30秒，部署终极机械兵器（150%属性），最多同时存在2个'}},
  // ══ 奥术法师 ══
  {id:'c11001',name:'学徒法师',emoji:'📖',color:'#a29bfe',dmg:35,range:125,rate:0.9,syns:['arcane','element'],desc:'基础法师型',skill:{name:'魔法飞弹',icon:'📖',type:'被动',desc:'攻击时10%概率额外发射魔法飞弹（80%伤害）'}},
  {id:'c11002',name:'火法师',emoji:'🔥',color:'#e17055',dmg:55,range:135,rate:0.75,syns:['arcane','element'],desc:'火系法师型',skill:{name:'火球爆',icon:'🔥',type:'主动',desc:'每10次攻击，范围60px造成200%伤害'}},
  {id:'c11003',name:'冰法师',emoji:'❄️',color:'#74b9ff',dmg:50,range:130,rate:0.8,syns:['arcane','element'],desc:'冰系法师型',skill:{name:'冰封',icon:'❄️',type:'主动',desc:'每12次攻击，冰封目标1.5秒使其无法移动'}},
  {id:'c11004',name:'雷法师',emoji:'⚡',color:'#fdcb6e',dmg:60,range:140,rate:0.7,syns:['arcane','element'],desc:'雷系法师型',skill:{name:'雷霆',icon:'⚡',type:'被动',desc:'攻击时20%概率闪电链，最多跳跃3个目标'}},
  {id:'c11005',name:'奥术师',emoji:'🔮',color:'#6c5ce7',dmg:65,range:138,rate:0.75,syns:['arcane','shield'],desc:'奥术法盾型',skill:{name:'奥术护盾',icon:'🔮',type:'被动',desc:'每次施法后获得吸收100点伤害的奥术护盾'}},
  {id:'c11006',name:'大法师',emoji:'🌟',color:'#a29bfe',dmg:80,range:150,rate:0.7,syns:['arcane','element'],desc:'大法师型',skill:{name:'魔法风暴',icon:'🌟',type:'主动',desc:'每15次攻击，范围造成100%伤害/秒持续5秒'}},
  {id:'c11007',name:'时空法师',emoji:'⏰',color:'#fd79a8',dmg:90,range:155,rate:0.65,syns:['arcane','dragon'],desc:'时空传说型',skill:{name:'时空扭曲',icon:'⏰',type:'主动',desc:'每20秒，使场上所有敌人时间倒流2秒'}},
  {id:'c11008',name:'法神',emoji:'✨',color:'#ffd700',dmg:110,range:160,rate:0.7,syns:['arcane','element'],desc:'法神传说型',skill:{name:'法神降临',icon:'✨',type:'主动',desc:'每30秒，全场所有敌人受到500%魔法伤害并沉默2秒'}},
  {id:'c11009',name:'奥术之神',emoji:'🔮',color:'#6c5ce7',dmg:130,range:165,rate:0.65,syns:['arcane','shield'],desc:'奥术传说型',skill:{name:'奥神之力',icon:'🔮',type:'主动',desc:'每20秒，下次技能冷却清零，技能伤害×3'}},
  {id:'c11010',name:'魔法学者',emoji:'📚',color:'#dfe6e9',dmg:28,range:118,rate:1.05,syns:['arcane'],desc:'基础学者型',skill:{name:'魔法研究',icon:'📚',type:'被动',desc:'己方所有技能伤害+5%'}},
  {id:'c11011',name:'咒术师',emoji:'🗿',color:'#636e72',dmg:38,range:122,rate:0.95,syns:['arcane'],desc:'基础咒术型',skill:{name:'诅咒',icon:'🗿',type:'被动',desc:'攻击时使目标受到的所有伤害+5%，持续3秒，可叠加3层'}},
  {id:'c11012',name:'技能之王',emoji:'👑',color:'#a29bfe',dmg:150,range:170,rate:0.75,syns:['arcane'],desc:'技能终极传说',skill:{name:'王者技能',icon:'👑',type:'主动',desc:'每10秒，随机触发场上所有单位的技能（无视CD立即发动）'}},
  // ══ 游侠射手 ══
  {id:'c12001',name:'弓箭手',emoji:'🏹',color:'#fd79a8',dmg:40,range:140,rate:1.1,syns:['ranger','crit'],desc:'基础弓箭型',skill:{name:'快射',icon:'🏹',type:'被动',desc:'每5次攻击发射3连射，各造成60%伤害'}},
  {id:'c12002',name:'弩手',emoji:'🎯',color:'#b2bec3',dmg:50,range:135,rate:0.9,syns:['ranger','mech'],desc:'机械远程型',skill:{name:'穿透弩矢',icon:'🎯',type:'被动',desc:'攻击穿透第一个目标，对后方目标造成70%伤害'}},
  {id:'c12003',name:'猎人',emoji:'🦊',color:'#f39c12',dmg:45,range:145,rate:1.0,syns:['ranger','nature'],desc:'自然猎人型',skill:{name:'追踪',icon:'🦊',type:'被动',desc:'攻击目标被追踪，受到伤害+15%持续5秒'}},
  {id:'c12004',name:'游侠',emoji:'🌲',color:'#27ae60',dmg:48,range:148,rate:0.95,syns:['ranger','nature'],desc:'自然游侠型',skill:{name:'自然之箭',icon:'🌲',type:'被动',desc:'攻击时20%概率发射自然之箭，减速目标30%持续2秒'}},
  {id:'c12005',name:'神射手',emoji:'⭐',color:'#ffd700',dmg:60,range:158,rate:0.9,syns:['ranger','crit'],desc:'神射暴击型',skill:{name:'神射',icon:'⭐',type:'被动',desc:'攻击时35%概率暴击（200%伤害），射程+10%'}},
  {id:'c12006',name:'鹰眼',emoji:'🦅',color:'#e17055',dmg:65,range:165,rate:0.85,syns:['ranger','crit'],desc:'远程暴击型',skill:{name:'鹰眼狙击',icon:'🦅',type:'被动',desc:'射程最大化，攻击最远目标时伤害+30%'}},
  {id:'c12007',name:'箭圣',emoji:'🌟',color:'#a29bfe',dmg:80,range:175,rate:0.8,syns:['ranger','crit'],desc:'射程传说型',skill:{name:'圣箭',icon:'🌟',type:'主动',desc:'每18次攻击，穿透所有目标造成400%伤害'}},
  {id:'c12008',name:'远程大师',emoji:'🏹',color:'#ff6b6b',dmg:95,range:180,rate:0.75,syns:['ranger','cannon'],desc:'远程炮击型',skill:{name:'远程炮击',icon:'🏹',type:'主动',desc:'每15次攻击，向最密集处射出爆炸箭矢（范围200%伤害）'}},
  {id:'c12009',name:'射神',emoji:'👑',color:'#ffd700',dmg:120,range:190,rate:0.8,syns:['ranger','crit'],desc:'射程传说王者',skill:{name:'神射降临',icon:'👑',type:'主动',desc:'每20次攻击，5秒内所有攻击必定暴击并穿透所有目标'}},
  {id:'c12010',name:'投掷手',emoji:'💨',color:'#81ecec',dmg:32,range:130,rate:1.2,syns:['ranger'],desc:'基础投掷型',skill:{name:'多重投掷',icon:'💨',type:'被动',desc:'每次攻击同时投掷2枚飞刀（各50%伤害）'}},
  {id:'c12011',name:'狙击手',emoji:'🔭',color:'#636e72',dmg:70,range:185,rate:0.6,syns:['ranger','crit'],desc:'超远狙击型',skill:{name:'精准狙击',icon:'🔭',type:'被动',desc:'射程内最远目标受到+60%伤害'}},
  {id:'c12012',name:'远程之神',emoji:'🌟',color:'#74b9ff',dmg:140,range:200,rate:0.85,syns:['ranger'],desc:'远程终极传说',skill:{name:'神域射击',icon:'🌟',type:'主动',desc:'每12秒，对全场所有敌人各射出一箭（200%伤害）'}},
  // ══ 战士先锋 ══
  {id:'c13001',name:'步兵',emoji:'⚔️',color:'#b2bec3',dmg:35,range:85,rate:1.1,syns:['warrior','tank'],desc:'基础步兵型',skill:{name:'冲锋',icon:'⚔️',type:'被动',desc:'攻击时15%概率发动冲锋，伤害+50%'}},
  {id:'c13002',name:'剑士',emoji:'🗡️',color:'#74b9ff',dmg:40,range:88,rate:1.2,syns:['warrior','swift'],desc:'速剑型',skill:{name:'连斩',icon:'🗡️',type:'被动',desc:'连续攻击同一目标，每次伤害+10%，最多3层'}},
  {id:'c13003',name:'斧战士',emoji:'🪓',color:'#e17055',dmg:50,range:90,rate:0.9,syns:['warrior','tank'],desc:'斧头型',skill:{name:'破甲斧',icon:'🪓',type:'被动',desc:'攻击使目标护甲-50，持续3秒，可叠加2次'}},
  {id:'c13004',name:'狂战士',emoji:'😡',color:'#d63031',dmg:60,range:88,rate:1.0,syns:['warrior','crit'],desc:'狂暴型',skill:{name:'狂暴',icon:'😡',type:'被动',desc:'生命值低于50%时攻速+50%，伤害+30%'}},
  {id:'c13005',name:'剑术大师',emoji:'⚔️',color:'#ffd700',dmg:65,range:92,rate:1.1,syns:['warrior','swift'],desc:'剑术型',skill:{name:'剑意',icon:'⚔️',type:'被动',desc:'攻击后20%概率发动剑意，额外攻击相邻目标'}},
  {id:'c13006',name:'战斗大师',emoji:'🥊',color:'#2d3436',dmg:70,range:90,rate:1.0,syns:['warrior','tank'],desc:'搏斗型',skill:{name:'格斗术',icon:'🥊',type:'被动',desc:'受到攻击后下次攻击伤害+20%，最多叠加3次'}},
  {id:'c13007',name:'战神',emoji:'⚡',color:'#a29bfe',dmg:85,range:95,rate:1.05,syns:['warrior','crit'],desc:'暴击近战型',skill:{name:'战神降临',icon:'⚡',type:'主动',desc:'每15次攻击，8秒内所有攻击必定暴击'}},
  {id:'c13008',name:'武器大师',emoji:'🗡️',color:'#6c5ce7',dmg:90,range:92,rate:1.1,syns:['warrior','swift'],desc:'武器传说型',skill:{name:'武器掌控',icon:'🗡️',type:'被动',desc:'每5次攻击后切换模式，攻速/伤害交替+30%'}},
  {id:'c13009',name:'战斗之神',emoji:'🌟',color:'#ffd700',dmg:110,range:98,rate:1.1,syns:['warrior','crit'],desc:'近战传说王者',skill:{name:'战神之怒',icon:'🌟',type:'主动',desc:'每20次攻击，所有近战单位暴击率+50%持续8秒'}},
  {id:'c13010',name:'格斗家',emoji:'🥋',color:'#ff6b9d',dmg:38,range:85,rate:1.3,syns:['warrior'],desc:'基础格斗型',skill:{name:'连击',icon:'🥋',type:'被动',desc:'攻击时30%概率追加一次攻击（50%伤害）'}},
  {id:'c13011',name:'双刀战士',emoji:'⚔️',color:'#e84393',dmg:50,range:88,rate:1.4,syns:['warrior','swift'],desc:'双刀速攻型',skill:{name:'双刀斩',icon:'⚔️',type:'被动',desc:'每次攻击同时挥出双刀，各造成80%伤害'}},
  {id:'c13012',name:'近战之神',emoji:'👑',color:'#ff6b6b',dmg:130,range:100,rate:1.2,syns:['warrior'],desc:'近战终极传说',skill:{name:'近战王者',icon:'👑',type:'主动',desc:'每15秒，5秒内近战范围扩大3倍，攻速+100%，伤害+100%'}},
  // ══ 龙族血脉 ══
  {id:'c14001',name:'龙血战士',emoji:'🐉',color:'#e17055',dmg:55,range:100,rate:1.0,syns:['dragon','warrior'],desc:'龙族近战型',skill:{name:'龙血冲锋',icon:'🐉',type:'被动',desc:'攻击附带龙息，额外造成15点火焰伤害'}},
  {id:'c14002',name:'龙骑士',emoji:'🐲',color:'#d63031',dmg:65,range:108,rate:0.9,syns:['dragon','tank'],desc:'龙骑坦克型',skill:{name:'龙骑冲锋',icon:'🐲',type:'主动',desc:'每12次攻击，骑龙冲锋造成300%伤害并击退目标'}},
  {id:'c14003',name:'龙法师',emoji:'🔥',color:'#a29bfe',dmg:80,range:150,rate:0.7,syns:['dragon','arcane'],desc:'龙族法师型',skill:{name:'龙息火球',icon:'🔥',type:'主动',desc:'每10次攻击，发射龙息火球，范围100px造成250%伤害'}},
  {id:'c14004',name:'龙射手',emoji:'🏹',color:'#74b9ff',dmg:75,range:165,rate:0.75,syns:['dragon','ranger'],desc:'龙族远程型',skill:{name:'龙牙箭',icon:'🏹',type:'被动',desc:'攻击穿透所有目标，携带龙炎持续燃烧'}},
  {id:'c14005',name:'红龙',emoji:'🔴',color:'#e17055',dmg:100,range:145,rate:0.65,syns:['dragon','element'],desc:'红龙火焰型',skill:{name:'烈焰吐息',icon:'🔴',type:'主动',desc:'每15次攻击，范围120px造成350%火焰伤害并引燃'}},
  {id:'c14006',name:'蓝龙',emoji:'🔵',color:'#74b9ff',dmg:95,range:155,rate:0.7,syns:['dragon','element'],desc:'蓝龙冰霜型',skill:{name:'冰霜吐息',icon:'🔵',type:'主动',desc:'每15次攻击，冰冻路径所有目标2秒，造成300%冰霜伤害'}},
  {id:'c14007',name:'黑龙',emoji:'⚫',color:'#2d3436',dmg:120,range:140,rate:0.65,syns:['dragon','shadow'],desc:'黑龙暗影型',skill:{name:'暗黑吐息',icon:'⚫',type:'主动',desc:'每18次攻击，区域内敌人受到+50%伤害持续10秒'}},
  {id:'c14008',name:'金龙',emoji:'🟡',color:'#ffd700',dmg:110,range:148,rate:0.7,syns:['dragon','holy'],desc:'金龙圣光型',skill:{name:'圣龙吐息',icon:'🟡',type:'主动',desc:'每20次攻击，为全体提供200点护盾并造成300%圣光伤害'}},
  {id:'c14009',name:'龙王',emoji:'👑',color:'#ff6b6b',dmg:140,range:160,rate:0.7,syns:['dragon'],desc:'龙王传说型',skill:{name:'龙王之威',icon:'👑',type:'主动',desc:'每25秒，所有龙族单位属性×1.5持续15秒'}},
  {id:'c14010',name:'龙人',emoji:'🐉',color:'#e17055',dmg:45,range:100,rate:1.0,syns:['dragon','warrior'],desc:'龙人混合型',skill:{name:'龙人之力',icon:'🐉',type:'被动',desc:'攻击附带龙属性，对龙族免疫敌人效果减半'}},
  {id:'c14011',name:'龙裔',emoji:'🐲',color:'#d63031',dmg:55,range:110,rate:0.9,syns:['dragon'],desc:'基础龙族型',skill:{name:'龙裔血脉',icon:'🐲',type:'被动',desc:'每受到100点伤害，攻速+5%，最多叠加10层'}},
  {id:'c14012',name:'龙神',emoji:'🌟',color:'#ffd700',dmg:180,range:175,rate:0.75,syns:['dragon'],desc:'龙族终极传说',skill:{name:'龙神降临',icon:'🌟',type:'主动',desc:'每30秒，全场所有敌人受到600%全属性伤害持续3秒'}},
  // ══ 亡灵天灾 ══
  {id:'c15001',name:'骷髅兵',emoji:'💀',color:'#b2bec3',dmg:28,range:85,rate:1.1,syns:['undead','warrior'],desc:'基础亡灵型',skill:{name:'骷髅大军',icon:'💀',type:'被动',desc:'每次击杀敌人，在其位置留下骨刺陷阱，持续3秒对经过的敌人造成伤害'}},
  {id:'c15002',name:'骷髅法师',emoji:'🔮',color:'#a29bfe',dmg:40,range:130,rate:0.9,syns:['undead','arcane'],desc:'亡灵法师型',skill:{name:'亡灵魔法',icon:'🔮',type:'被动',desc:'攻击时诅咒目标，使其受到的所有伤害+8%持续5秒'}},
  {id:'c15003',name:'僵尸',emoji:'🧟',color:'#2d3436',dmg:35,range:80,rate:1.0,syns:['undead','tank'],desc:'亡灵坦克型',skill:{name:'感染',icon:'🧟',type:'被动',desc:'攻击附带感染诅咒，目标每秒损失最大血量1%，持续8秒，最多叠加3层'}},
  {id:'c15004',name:'幽灵',emoji:'👻',color:'#dfe6e9',dmg:50,range:120,rate:1.0,syns:['undead','shadow'],desc:'幽灵暗影型',skill:{name:'穿透幽灵',icon:'👻',type:'被动',desc:'攻击无视目标护甲，但伤害降低20%'}},
  {id:'c15005',name:'巫妖',emoji:'🧙',color:'#6c5ce7',dmg:65,range:145,rate:0.75,syns:['undead','arcane'],desc:'亡灵法术型',skill:{name:'冰霜新星',icon:'🧙',type:'主动',desc:'每15次攻击，冰冻范围100px内所有敌人2秒'}},
  {id:'c15006',name:'死亡骑士',emoji:'⚔️',color:'#2d3436',dmg:75,range:100,rate:0.85,syns:['undead','tank'],desc:'亡灵骑士型',skill:{name:'死亡盾击',icon:'⚔️',type:'主动',desc:'每10次攻击，猛力盾击目标造成300%伤害并强力减速（速度降至20%）持续2秒'}},
  {id:'c15007',name:'骨龙',emoji:'🦴',color:'#b2bec3',dmg:90,range:150,rate:0.7,syns:['undead','dragon'],desc:'亡灵龙族型',skill:{name:'死亡吐息',icon:'🦴',type:'主动',desc:'每15次攻击，亡灵吐息腐蚀敌人护甲-100持续5秒'}},
  {id:'c15008',name:'亡灵领主',emoji:'👑',color:'#6c5ce7',dmg:100,range:130,rate:0.8,syns:['undead','shadow'],desc:'亡灵暗影型',skill:{name:'亡灵统御',icon:'👑',type:'被动',desc:'攻击给目标施加亡灵印记，印记层数×5%提升己方所有攻击对该目标的伤害（最多8层）'}},
  {id:'c15009',name:'死神',emoji:'⚰️',color:'#2d3436',dmg:130,range:140,rate:0.8,syns:['undead','shadow'],desc:'死神传说型',skill:{name:'死神镰刀',icon:'⚰️',type:'被动',desc:'攻击时15%概率触发镰刀斩，对目标及其周围60px内所有敌人造成150%伤害'}},
  {id:'c15010',name:'怨灵',emoji:'👻',color:'#dfe6e9',dmg:30,range:115,rate:1.1,syns:['undead'],desc:'基础怨灵型',skill:{name:'怨念爆发',icon:'👻',type:'被动',desc:'每次攻击积累怨气，满10层后爆发，对目标造成500%伤害并清空积累'}},
  {id:'c15011',name:'吸血鬼',emoji:'🧛',color:'#a29bfe',dmg:55,range:118,rate:1.0,syns:['undead','crit'],desc:'吸血暴击型',skill:{name:'吸血',icon:'🧛',type:'被动',desc:'攻击造成暴击时，额外对目标造成其当前血量5%的真实伤害'}},
  {id:'c15012',name:'亡灵之神',emoji:'💀',color:'#6c5ce7',dmg:160,range:155,rate:0.85,syns:['undead'],desc:'亡灵终极传说',skill:{name:'亡灵天灾',icon:'💀',type:'主动',desc:'每30秒，召唤亡灵大军（10个骷髅兵）冲击路径上所有敌人'}},
];
// 自动为没有 rarity 字段的角色赋值（每系列12人，按位置 0-2:n 3-5:r 6-8:sr 9-11:ssr）
(()=>{
  const RARITY_SEQ=['n','n','n','r','r','r','sr','sr','sr','ssr','ssr','ssr'];
  // 按系列分组
  const groups={};
  for(const c of CHARS){
    // 提取系列号：c1001 → '1', c10001 → '10'
    const m=c.id.match(/^c(\d+?)0+(\d)$/);
    if(!m) continue;
    const gid=m[1];
    if(!groups[gid]) groups[gid]=[];
    groups[gid].push(c);
  }
  for(const arr of Object.values(groups)){
    arr.sort((a,b)=>a.id.localeCompare(b.id));
    arr.forEach((c,i)=>{
      if(!c.rarity) c.rarity=RARITY_SEQ[i]||'n';
    });
  }
})();
const CHAR_MAP = Object.fromEntries(CHARS.map(c=>[c.id,c]));

// 稀有度配置
const RARITY_CFG={
  n:  {label:'普通', color:'#b2bec3', bg:'rgba(178,190,195,.15)', abbr:'N'},
  r:  {label:'稀有', color:'#74b9ff', bg:'rgba(116,185,255,.15)', abbr:'R'},
  sr: {label:'史诗', color:'#c084fc', bg:'rgba(192,132,252,.15)', abbr:'SR'},
  ssr:{label:'传说', color:'#7fe7ff', bg:'rgba(127,231,255,.15)', abbr:'SSR'},
};

// ══ 升级/升星系统常量 ═══════════════════════════════
// 各品质：初始最大等级 + 每升一星开放的额外等级数
const STAR_CFG={
  n:  {initLv:10, perStar:5},   // 满5星=30级
  r:  {initLv:13, perStar:6},   // 满5星=37级
  sr: {initLv:16, perStar:7},   // 满5星=44级
  ssr:{initLv:20, perStar:8},   // 满5星=52级
};
// 升级所需经验（按等级段递增）
function calcExpReq(lv){
  if(lv<=10)  return 50;
  if(lv<=20)  return 80;
  if(lv<=30)  return 125;
  if(lv<=40)  return 190;
  return 270;
}
// 计算角色当前允许的最大等级
function calcMaxLv(charId, stars){
  const c=CHAR_MAP[charId];
  const cfg=STAR_CFG[c&&c.rarity||'n'];
  return cfg.initLv + (stars||0)*cfg.perStar;
}
// 计算该角色满星（5星）时的绝对最大等级
function calcAbsMaxLv(charId){
  return calcMaxLv(charId, 5);
}
// 技能解锁节点：按「满星最大等级」等比划分 5 个节点
// 节点比例：0%、20%、40%、68%、100% → Sk1~Sk5
// 所有品质满星后都能达到100%节点 → 都能解锁Sk5
const SKILL_UNLOCK_RATIOS=[0, 0.20, 0.40, 0.68, 1.00];
function getSkillUnlockLvs(charId){
  const absMax=calcAbsMaxLv(charId);
  return SKILL_UNLOCK_RATIOS.map((r,i)=>i===0?1:Math.round(absMax*r));
}
// 获取技能等级（1~5），根据当前等级和角色满星上限
function calcSkillLv(charLv, charId){
  const lvsArr=getSkillUnlockLvs(charId);
  let slv=1;
  for(let i=0;i<lvsArr.length;i++){
    if(charLv>=lvsArr[i]) slv=i+1; else break;
  }
  return slv;
}
// 技能等级对应数值加成倍数（Sk1×1.0 → Sk5×2.2）
function skillMult(slv){ return 1.0 + (slv-1)*0.3; }
// 升星需要3张同角色同星级
const STARS_TO_UPGRADE=3;
// 各品质抽卡费用
const GACHA_TIERS=[
  {id:'n',   name:'普通召唤', ico:'🎴', cost1:40,  cost5:180,  rates:{n:0.70,r:0.20,sr:0.08,ssr:0.02}, desc:'基础召唤，偶有稀有'},
  {id:'r',   name:'精英召唤', ico:'🔮', cost1:80,  cost5:350,  rates:{n:0.30,r:0.45,sr:0.20,ssr:0.05}, desc:'稳定出稀有，偶有史诗'},
  {id:'sr',  name:'史诗召唤', ico:'💎', cost1:160, cost5:700,  rates:{n:0.05,r:0.25,sr:0.50,ssr:0.20}, desc:'高概率史诗，20%传说'},
  {id:'ssr', name:'传说召唤', ico:'🌟', cost1:320, cost5:1400, rates:{n:0.00,r:0.10,sr:0.40,ssr:0.50}, desc:'50%传说概率！稀有起步'},
];
const G1=80, G5=350; // 保持兼容旧逻辑（右侧按钮用）

// ══════════════════════════════════════════════════════════
// 怪物数据表（含品质、技能、Debuff 系统）
// 品质：normal < elite < epic < boss
// skill: {id, triggerHp(0~1触发阈值), triggerInterval(帧间隔), desc, type}
//   type: 'speedBurst'=暴走加速 | 'shield'=护盾 | 'regen'=回血 | 'dmgReflect'=反伤
//         'towDebuff'=对塔施加减速 | 'aura'=光环(减速免疫) | 'berserk'=狂暴(受击加速)
//         'summon'=召唤小怪 | 'armorUp'=加防御 | 'lifesteal'=吸血
// ══════════════════════════════════════════════════════════
const ENEMIES = [
  // ── Normal 普通怪物（1~15波主力）────────────────────────────
  {id:'goblin',   grade:'normal', name:'哥布林',   ico:'👺', hp:60,   speed:90,  reward:45,  expReward:55,  color:'#27ae60', r:10},
  {id:'skeleton', grade:'normal', name:'骷髅兵',   ico:'💀', hp:85,   speed:75,  reward:55,  expReward:65,  color:'#bdc3c7', r:10},
  {id:'zombie',   grade:'normal', name:'僵尸',     ico:'🧟', hp:120,  speed:55,  reward:65,  expReward:75,  color:'#6ab04c', r:11},
  {id:'wolf',     grade:'normal', name:'恶狼',     ico:'🐺', hp:95,   speed:135, reward:70,  expReward:85,  color:'#7f8c8d', r:10,
    skill:{id:'berserk', triggerInterval:180, desc:'被攻击时有20%概率暴走，移速+40%持续2s', type:'berserk', chance:0.20, v:0.40, dur:40}},
  {id:'ghost',    grade:'normal', name:'幽灵',     ico:'👻', hp:140,  speed:95,  reward:80,  expReward:95,  color:'#a29bfe', r:11,
    skill:{id:'aura',    triggerInterval:300, desc:'减速免疫光环，自身无法被慢效果影响',      type:'aura'}},
  {id:'harpy',    grade:'normal', name:'鸟身女妖', ico:'🦅', hp:110,  speed:145, reward:90,  expReward:108, color:'#81ecec', r:11,
    skill:{id:'speedBurst', triggerInterval:240, desc:'每4s急速冲刺，移速+60%持续1.5s',      type:'speedBurst', v:0.60, dur:30}},

  // ── Elite 精英怪物（10~30波增援）────────────────────────────
  {id:'ogre',    grade:'elite',  name:'食人魔',   ico:'👹', hp:280,  speed:50,  reward:150, expReward:180, color:'#e67e22', r:14,
    skill:{id:'armorUp', triggerHp:0.5, triggerInterval:999, desc:'血量低于50%时激活护甲，物理减伤+40%', type:'armorUp', v:0.40}},
  {id:'spider',  grade:'elite',  name:'巨型蜘蛛', ico:'🕷️', hp:180,  speed:105, reward:130, expReward:155, color:'#2d3436', r:12,
    skill:{id:'towDebuff', triggerInterval:200, desc:'吐丝缠绕最近的塔，使其攻速-30%持续3s',  type:'towDebuff', range:120, v:0.30, dur:60}},
  {id:'vampire', grade:'elite',  name:'吸血鬼',   ico:'🧛', hp:220,  speed:88,  reward:160, expReward:190, color:'#8e44ad', r:12,
    skill:{id:'lifesteal', triggerInterval:120, desc:'每2s恢复自身2%最大血量',                type:'lifesteal', v:0.02}},
  {id:'demon',   grade:'elite',  name:'恶魔兵',   ico:'😈', hp:300,  speed:72,  reward:200, expReward:240, color:'#d63031', r:13,
    skill:{id:'speedBurst', triggerHp:0.6, triggerInterval:999, desc:'血量低于60%时狂怒，永久移速+50%', type:'speedBurst', v:0.50, dur:9999}},
  {id:'golem',   grade:'elite',  name:'石像魔',   ico:'🗿', hp:420,  speed:45,  reward:180, expReward:215, color:'#636e72', r:14,
    skill:{id:'armorUp',  triggerInterval:360, desc:'每6s强化石甲，护甲层叠+15%（最多3层）',  type:'armorUp', v:0.15, stack:3}},
  {id:'orc',     grade:'elite',  name:'兽人先锋', ico:'🐗', hp:450,  speed:58,  reward:220, expReward:265, color:'#795548', r:15,
    skill:{id:'shield',   triggerInterval:400, desc:'每7s召唤战气护盾，吸收300点伤害',        type:'shield',   v:300}},

  // ── Epic 强化怪物（25~45波）────────────────────────────────
  {id:'dark_knight', grade:'epic', name:'黑暗骑士', ico:'🦹', hp:800,  speed:65,  reward:360, expReward:430, color:'#2c3e50', r:16,
    skill:{id:'dmgReflect', triggerInterval:1, desc:'被攻击时有30%概率反弹15%伤害给攻击者',    type:'dmgReflect', chance:0.30, v:0.15}},
  {id:'witch',       grade:'epic', name:'黑巫师',   ico:'🧝', hp:650,  speed:80,  reward:320, expReward:385, color:'#8e44ad', r:15,
    skill:{id:'towDebuff', triggerInterval:180, desc:'每3s对范围内所有塔施加诅咒，攻速-25%持续4s', type:'towDebuff', range:180, v:0.25, dur:80, aoe:true}},
  {id:'wyvern',      grade:'epic', name:'飞翼魔龙', ico:'🐉', hp:900,  speed:100, reward:380, expReward:455, color:'#e17055', r:16,
    skill:{id:'speedBurst', triggerHp:0.7, triggerInterval:999, desc:'血量低于70%后永久飞行加速，移速+80%', type:'speedBurst', v:0.80, dur:9999}},
  {id:'lich',        grade:'epic', name:'亡灵法师', ico:'🧟', hp:700,  speed:70,  reward:340, expReward:410, color:'#6c5ce7', r:15,
    skill:{id:'regen', triggerInterval:60, desc:'每秒恢复自身3%最大血量',                     type:'lifesteal', v:0.03}},
  {id:'iron_golem',  grade:'epic', name:'铁甲魔像', ico:'🤖', hp:1200, speed:40,  reward:420, expReward:505, color:'#95a5a6', r:17,
    skill:{id:'armorUp', triggerInterval:1, desc:'永久物理减伤30%，受攻击时再+5%（最多50%）', type:'armorUp', v:0.05, maxV:0.50, base:0.30, stack:4}},
  {id:'void_stalker',grade:'epic', name:'虚空猎手', ico:'👾', hp:750,  speed:115, reward:360, expReward:430, color:'#00cec9', r:16,
    skill:{id:'aura', triggerInterval:1, desc:'虚空光环：免疫所有减速，移速永远不被降低',      type:'aura'}},

  // ── Boss 精英首领（10波倍数出现）──────────────────────────
  {id:'boss_lich',    grade:'boss', name:'亡灵巫妖',  ico:'🧙', hp:3500,  speed:40, reward:1200, expReward:1500, color:'#6c5ce7', r:26, boss:true,
    tip:'掌控死亡之力，会持续恢复血量。',
    skill:{id:'lifesteal', triggerInterval:40, desc:'每0.7s恢复1.5%最大血量，并对最近塔施加诅咒', type:'lifesteal', v:0.015}},
  {id:'boss_dragon',  grade:'boss', name:'深渊龙王',  ico:'🐲', hp:6000,  speed:38, reward:1800, expReward:2200, color:'#e17055', r:28, boss:true,
    tip:'龙鳞护甲极厚，血量低于40%时狂暴加速。',
    skill:{id:'berserk', triggerHp:0.40, triggerInterval:999, desc:'血量低于40%龙暴，移速+70%且反伤20%', type:'berserk', v:0.70, dur:9999, reflect:0.20}},
  {id:'boss_demon',   grade:'boss', name:'混沌恶魔',  ico:'👿', hp:5000,  speed:44, reward:1600, expReward:2000, color:'#d63031', r:27, boss:true,
    tip:'随机变向，对范围内所有塔施加混沌减速。',
    skill:{id:'towDebuff', triggerInterval:120, desc:'每2s向周围塔发射混沌咒语，攻速-40%持续5s', type:'towDebuff', range:200, v:0.40, dur:100, aoe:true}},
  {id:'boss_colossus',grade:'boss', name:'远古巨人',  ico:'🗿', hp:8500,  speed:30, reward:2400, expReward:3000, color:'#2d3436', r:30, boss:true,
    tip:'护甲极厚，受击后护甲叠加，建议快速爆发击杀。',
    skill:{id:'armorUp', triggerInterval:60, desc:'每1s叠加5%减伤（最多60%），死亡前短暂无敌', type:'armorUp', v:0.05, maxV:0.60, stack:12}},
  {id:'boss_phoenix',  grade:'boss', name:'不死凤凰', ico:'🦅', hp:7000,  speed:90, reward:2200, expReward:2700, color:'#f39c12', r:29, boss:true,
    tip:'死亡后复活一次（仅50%血量）！消灭它需要两次击杀。',
    skill:{id:'regen', triggerHp:0.001, triggerInterval:999, desc:'死亡时以50%血量复活一次', type:'revive', v:0.50}},
  {id:'boss_void',     grade:'boss', name:'虚空领主', ico:'🌑', hp:9000,  speed:55, reward:2800, expReward:3500, color:'#0f0c29', r:32, boss:true,
    tip:'免疫所有减速，进入狂暴后对周围塔造成持续震慑。',
    skill:{id:'aura', triggerInterval:1, desc:'虚空领域：免疫减速+每3s对所有塔-30%攻速持续6s', type:'aura', towDebuff:{v:0.30,dur:120,range:9999}}},
  {id:'boss_titan',    grade:'boss', name:'泰坦神卫', ico:'⚔️', hp:12000, speed:35, reward:3500, expReward:4500, color:'#d4af37', r:34, boss:true,
    tip:'最强BOSS。护甲、回血、反伤三重加持，50波守门人。',
    skill:{id:'composite', triggerInterval:80, desc:'三合一：每1.5s回血2%+20%反伤+受击叠甲(上限55%)', type:'composite',
      lifesteal:0.02, reflect:0.20, armorUp:{v:0.03,maxV:0.55}}},
];
const ENEM_MAP = Object.fromEntries(ENEMIES.map(e=>[e.id,e]));

// 怪物品质颜色配置
const GRADE_CFG={
  normal:{label:'普通', color:'#b2bec3', scale:1.0},
  elite: {label:'精英', color:'#74b9ff', scale:1.0},
  epic:  {label:'史诗', color:'#c084fc', scale:1.0},
  boss:  {label:'首领', color:'#ffd36b', scale:1.0},
};

const MAP = {
  cols:30, rows:20, ts:70,
  // 主干道：所有 lane 汇入后走向终点城堡（右下角）
  trunk:[
    {x:14,y:12},{x:14,y:16},{x:20,y:16},{x:20,y:12},{x:26,y:12},{x:26,y:17},{x:29,y:17}
  ],
  // 地形装饰区（供渲染器着色，不影响逻辑）
  deco:{
    // 水域格子 (col,row 对)
    water:[
      {x:22,y:1},{x:23,y:1},{x:24,y:1},{x:25,y:1},
      {x:22,y:2},{x:23,y:2},{x:24,y:2},{x:25,y:2},
      {x:22,y:3},{x:23,y:3},{x:24,y:3},{x:25,y:3},
      {x:5,y:14},{x:6,y:14},{x:7,y:14},
      {x:5,y:15},{x:6,y:15},{x:7,y:15},
    ],
    // 树林格子
    forest:[
      {x:1,y:0},{x:2,y:0},{x:3,y:0},
      {x:0,y:8},{x:1,y:8},{x:0,y:9},{x:1,y:9},
      {x:27,y:0},{x:28,y:0},{x:29,y:0},{x:27,y:1},{x:28,y:1},
      {x:10,y:17},{x:11,y:17},{x:10,y:18},{x:11,y:18},
      {x:16,y:18},{x:17,y:18},{x:16,y:19},{x:17,y:19},
    ],
    // 石板广场
    stone:[
      {x:13,y:11},{x:14,y:11},{x:15,y:11},
      {x:13,y:12},{x:15,y:12},
      {x:13,y:13},{x:14,y:13},{x:15,y:13},
    ],
  },
  // 各玩家专属路径（折返更复杂，最后节点必须等于 trunk[0]）
  lanes:[
    // 玩家1：左上 → S形迂回 → 汇入
    [
      {x:0,y:1},  {x:4,y:1},
      {x:4,y:5},  {x:1,y:5},
      {x:1,y:9},  {x:6,y:9},
      {x:6,y:6},  {x:10,y:6},
      {x:10,y:12},{x:14,y:12}
    ],
    // 玩家2：左下 → 折返向上 → 汇入
    [
      {x:0,y:18}, {x:5,y:18},
      {x:5,y:13}, {x:9,y:13},
      {x:9,y:17}, {x:13,y:17},
      {x:13,y:12},{x:14,y:12}
    ],
    // 玩家3：右上 → 蛇形下行 → 汇入
    [
      {x:29,y:2}, {x:26,y:2},
      {x:26,y:6}, {x:21,y:6},
      {x:21,y:2}, {x:18,y:2},
      {x:18,y:8}, {x:14,y:8},
      {x:14,y:12}
    ],
    // 玩家4：上方中央 → 绕道 → 汇入
    [
      {x:14,y:0}, {x:14,y:4},
      {x:8,y:4},  {x:8,y:8},
      {x:11,y:8}, {x:11,y:12},
      {x:14,y:12}
    ],
  ]
};
// 完整路径 = lane + trunk（去掉重复的汇入点）
function buildFullPath(laneIdx){
  const lane=MAP.lanes[laneIdx];
  return [...lane, ...MAP.trunk.slice(1)];
}

// ── 并行子路径：每条 lane 生成3条子路描述符 ──
// 子路共享同一份路径节点，只记录像素级偏移量（pxOff）供渲染时偏移出生/移动位置
// subIdx: 0=左/上, 1=中, 2=右/下
const SUB_PX_OFFSETS = [-18, 0, 18]; // 三条子路的像素横向间距
function getLanePaths(laneIdx){
  const base = buildFullPath(laneIdx);
  // 返回3个描述符：path是路径节点（格坐标），pxOff是像素偏移
  return SUB_PX_OFFSETS.map((pxOff, si) => ({
    path: base,       // 路径节点共享，不做坐标偏移
    pxOff,            // 怪物出生/移动时的像素侧向偏移
    laneIdx,          // 原始 lane 序号
    subIdx: si        // 子路序号 0/1/2
  }));
}

// 根据折线段枚举所有路径格子（Set<"x,y">）
function pathToTiles(path){
  const s=new Set();
  for(let i=0;i<path.length-1;i++){
    const a=path[i], b=path[i+1];
    if(a.x===b.x){
      const mn=Math.min(a.y,b.y), mx=Math.max(a.y,b.y);
      for(let y=mn;y<=mx;y++) s.add(a.x+','+y);
    } else {
      const mn=Math.min(a.x,b.x), mx=Math.max(a.x,b.x);
      for(let x=mn;x<=mx;x++) s.add(x+','+a.y);
    }
  }
  return s;
}

// 所有路径格子集合（直接用 buildFullPath，3条子路共享同一路径节点所以只需算一次）
function buildAllPathTiles(){
  const s=new Set();
  for(let li=0;li<MAP.lanes.length;li++){
    for(const t of pathToTiles(buildFullPath(li))) s.add(t);
  }
  for(const t of pathToTiles([...MAP.trunk])) s.add(t);
  return s;
}

// ══════════════════════════════════════════════════════════
// 完整50波预设
// 阶段划分：
//  1~9   启程之境（新手，纯普通怪）
//  10    BOSS关卡一：亡灵巫妖
//  11~19 黑暗边境（精英+普通混合）
//  20    BOSS关卡二：深渊龙王
//  21~29 熔岩深渊（大量精英）
//  30    BOSS关卡三：混沌恶魔
//  31~39 虚空裂隙（Epic怪物登场）
//  40    BOSS关卡四：远古巨人+不死凤凰
//  41~49 地狱炼狱（Epic+Elite密集）
//  50    终章决战：泰坦神卫+虚空领主
// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
// 出怪时机设计：每波出怪时间约 30-38 秒（单 Lane 最长队列）
// 计算公式：(n-1)*iv + 500ms 初始延迟 ≈ 30000~38000ms
// ══════════════════════════════════════════════════════════
const WAVES = [
  // ══════════════════════════════════════════════════════════
  // 阶段一：启程之境 1~9（纯普通怪，每波 ≥150 只）
  // ══════════════════════════════════════════════════════════
  // W1：地精+僵尸 合计 155 只
  {w:1,  eg:[{id:'goblin',   n:90, iv:600}, {id:'zombie',   n:65, iv:700}]},
  // W2：地精+骷髅+蜘蛛 合计 160 只
  {w:2,  eg:[{id:'goblin',   n:80, iv:550}, {id:'skeleton', n:55, iv:620}, {id:'spider',   n:25, iv:900}]},
  // W3：狼+骷髅+僵尸 合计 165 只
  {w:3,  eg:[{id:'wolf',     n:70, iv:520}, {id:'skeleton', n:60, iv:580}, {id:'zombie',   n:35, iv:700}]},
  // W4：鬼魂+狼+蜘蛛 合计 158 只
  {w:4,  eg:[{id:'ghost',    n:65, iv:540}, {id:'wolf',     n:65, iv:520}, {id:'spider',   n:28, iv:850}]},
  // W5：哈比+僵尸+鬼魂 合计 170 只
  {w:5,  eg:[{id:'harpy',    n:70, iv:500}, {id:'zombie',   n:70, iv:510}, {id:'ghost',    n:30, iv:720}]},
  // W6：地精+哈比+蜘蛛 合计 175 只
  {w:6,  eg:[{id:'goblin',   n:85, iv:470}, {id:'harpy',    n:60, iv:510}, {id:'spider',   n:30, iv:800}]},
  // W7：骷髅+哈比+蜘蛛 合计 180 只
  {w:7,  eg:[{id:'skeleton', n:80, iv:460}, {id:'harpy',    n:70, iv:490}, {id:'spider',   n:30, iv:780}]},
  // W8：僵尸+狼+鬼魂 合计 185 只
  {w:8,  eg:[{id:'zombie',   n:80, iv:450}, {id:'wolf',     n:75, iv:460}, {id:'ghost',    n:30, iv:700}]},
  // W9：五种普通怪大混战 合计 195 只（Boss前压力测试）
  {w:9,  eg:[{id:'zombie',   n:55, iv:430}, {id:'harpy',    n:45, iv:440}, {id:'goblin',   n:40, iv:440},
             {id:'wolf',     n:35, iv:460}, {id:'spider',   n:20, iv:750}]},

  // ══════════════════════════════════════════════════════════
  // BOSS 10：亡灵巫妖 — Boss×1 + 护卫小怪 ≥50
  // ══════════════════════════════════════════════════════════
  {w:10, eg:[{id:'boss_lich',  n:1,  iv:9999},
             {id:'skeleton',   n:35, iv:500}, {id:'zombie',   n:30, iv:520}, {id:'spider',   n:20, iv:700}]},
  // 护卫合计 85 只 ✓

  // ══════════════════════════════════════════════════════════
  // 阶段二：黑暗边境 11~19（普通怪≥150 + 少量精英）
  // ══════════════════════════════════════════════════════════
  // W11：食人魔×10(精英) + 狼+蜘蛛 合计普通155、精英10
  {w:11, eg:[{id:'ogre',     n:10, iv:2200}, {id:'wolf',     n:90, iv:440}, {id:'spider',   n:65, iv:680}]},
  // W12：蜘蛛+哈比+鬼魂 合计普通160、精英0
  {w:12, eg:[{id:'spider',   n:70, iv:430}, {id:'harpy',    n:60, iv:440}, {id:'ghost',    n:30, iv:680}]},
  // W13：吸血鬼×15(精英) + 鬼魂+蜘蛛 合计普通150、精英15
  {w:13, eg:[{id:'vampire',  n:15, iv:1800}, {id:'ghost',   n:90, iv:430}, {id:'spider',   n:60, iv:680}]},
  // W14：恶魔×12(精英) + 食人魔×8 + 蜘蛛 合计普通150、精英20
  {w:14, eg:[{id:'demon',    n:12, iv:2000}, {id:'ogre',    n:8,  iv:2500}, {id:'spider',  n:100, iv:420}, {id:'wolf', n:50, iv:440}]},
  // W15：石像鬼×10(精英) + 蜘蛛+狼 合计普通155、精英10
  {w:15, eg:[{id:'golem',    n:10, iv:2800}, {id:'spider',  n:90, iv:420}, {id:'wolf',     n:65, iv:440}]},
  // W16：兽人×18(精英) + 吸血鬼×10 + 蜘蛛 合计普通150、精英28
  {w:16, eg:[{id:'orc',      n:18, iv:1800}, {id:'vampire', n:10, iv:1900}, {id:'spider',  n:90, iv:410}, {id:'ghost', n:60, iv:450}]},
  // W17：恶魔×18 + 石像鬼×8 + 蜘蛛 合计普通150、精英26
  {w:17, eg:[{id:'demon',    n:18, iv:1700}, {id:'golem',   n:8,  iv:2800}, {id:'spider',  n:90, iv:400}, {id:'harpy', n:60, iv:430}]},
  // W18：兽人×20 + 蜘蛛+吸血鬼+食人魔 合计普通150、精英38
  {w:18, eg:[{id:'orc',      n:20, iv:1600}, {id:'spider',  n:80, iv:400}, {id:'ogre',    n:10, iv:2400}, {id:'vampire', n:8, iv:1900}, {id:'zombie', n:70, iv:410}]},
  // W19：四精英混战+普通怪海 合计普通152、精英47（Boss前预热）
  {w:19, eg:[{id:'vampire',  n:16, iv:1700}, {id:'demon',   n:15, iv:1800}, {id:'orc',     n:8,  iv:2000}, {id:'ogre', n:8, iv:2500},
             {id:'spider',   n:80, iv:390}, {id:'ghost',   n:72, iv:400}]},

  // ══════════════════════════════════════════════════════════
  // BOSS 20：深渊龙王 — Boss×1 + 护卫精英 ≥50
  // ══════════════════════════════════════════════════════════
  {w:20, eg:[{id:'boss_dragon', n:1,  iv:9999},
             {id:'orc',     n:25, iv:500}, {id:'demon',   n:20, iv:530}, {id:'spider',   n:20, iv:650}]},
  // 护卫合计 65 只 ✓

  // ══════════════════════════════════════════════════════════
  // 阶段三：熔岩深渊 21~29（普通≥150 + 精英≥50）
  // ══════════════════════════════════════════════════════════
  // W21：石像鬼×20 + 兽人×30 + 蜘蛛+普通怪 合计普通155、精英50
  {w:21, eg:[{id:'golem',    n:20, iv:2200}, {id:'orc',     n:30, iv:1600}, {id:'spider',  n:90, iv:390}, {id:'wolf',  n:65, iv:400}]},
  // W22：恶魔×25 + 吸血鬼×25 + 蜘蛛+鬼魂 合计普通155、精英50
  {w:22, eg:[{id:'demon',    n:25, iv:1600}, {id:'vampire', n:25, iv:1700}, {id:'spider',  n:90, iv:380}, {id:'ghost', n:65, iv:400}]},
  // W23：蜘蛛大军+石像鬼+兽人 合计普通160、精英55
  {w:23, eg:[{id:'spider',   n:95, iv:370}, {id:'golem',   n:20, iv:2200}, {id:'orc',     n:35, iv:1500}, {id:'zombie', n:65, iv:380}]},
  // W24：witch×10(精英) + 兽人+恶魔+普通怪 合计普通155、精英55（含witch）
  {w:24, eg:[{id:'witch',    n:10, iv:2500}, {id:'orc',     n:25, iv:1600}, {id:'demon',   n:20, iv:1700},
             {id:'spider',  n:90, iv:370}, {id:'harpy',  n:65, iv:390}]},
  // W25：三精英大潮+蜘蛛 合计普通155、精英60
  {w:25, eg:[{id:'orc',      n:25, iv:1500}, {id:'golem',   n:15, iv:2200}, {id:'vampire', n:20, iv:1700},
             {id:'spider',  n:90, iv:360}, {id:'wolf',   n:65, iv:380}]},
  // W26：吸血鬼+witch+蜘蛛海 合计普通160、精英65
  {w:26, eg:[{id:'vampire',  n:25, iv:1600}, {id:'witch',   n:15, iv:2400}, {id:'orc',     n:25, iv:1500},
             {id:'spider',  n:90, iv:350}, {id:'ghost',  n:70, iv:370}]},
  // W27：四精英混战+普通怪海 合计普通155、精英70
  {w:27, eg:[{id:'golem',    n:18, iv:2100}, {id:'demon',   n:22, iv:1600}, {id:'orc',     n:20, iv:1500}, {id:'witch', n:10, iv:2400},
             {id:'spider',  n:90, iv:340}, {id:'zombie', n:65, iv:360}]},
  // W28：精英+witch大潮+普通怪 合计普通155、精英75（Boss援军波）
  {w:28, eg:[{id:'boss_demon', n:1, iv:9999},
             {id:'witch',   n:15, iv:2200}, {id:'orc',     n:30, iv:1400}, {id:'golem',   n:15, iv:2200},
             {id:'spider',  n:85, iv:340}, {id:'harpy',  n:70, iv:360}]},
  // W29：精英狂潮+蜘蛛+witch 合计普通155、精英80（临Boss前最高压力）
  {w:29, eg:[{id:'demon',    n:30, iv:1400}, {id:'vampire', n:25, iv:1500}, {id:'witch',   n:12, iv:2200}, {id:'orc',  n:13, iv:1500},
             {id:'spider',  n:85, iv:330}, {id:'ghost',  n:70, iv:350}]},

  // ══════════════════════════════════════════════════════════
  // BOSS 30：混沌恶魔+亡灵巫妖 双Boss + 护卫 ≥50
  // ══════════════════════════════════════════════════════════
  {w:30, eg:[{id:'boss_demon', n:1, iv:9999}, {id:'boss_lich', n:1, iv:12000},
             {id:'witch',   n:15, iv:700}, {id:'orc',     n:20, iv:650}, {id:'spider',   n:20, iv:720}]},
  // 护卫合计 55 只 ✓

  // ══════════════════════════════════════════════════════════
  // 阶段四：虚空裂隙 31~39（普通≥150 + 精英≥50 + Epic登场）
  // ══════════════════════════════════════════════════════════
  // W31：黑骑×15(Epic) + 兽人×35 + witch×10 + 普通怪 合计普通155、精英60
  {w:31, eg:[{id:'dark_knight', n:15, iv:2000}, {id:'orc',    n:35, iv:1300}, {id:'witch',  n:10, iv:2200},
             {id:'spider',  n:90, iv:320}, {id:'wolf',   n:65, iv:340}]},
  // W32：witch×15 + 恶魔×30 + 蜘蛛海 合计普通155、精英55（含Epic witch）
  {w:32, eg:[{id:'witch',    n:15, iv:2100}, {id:'demon',   n:30, iv:1400}, {id:'dark_knight', n:10, iv:2200},
             {id:'spider',  n:90, iv:310}, {id:'ghost',  n:65, iv:340}]},
  // W33：飞龙×12(Epic) + 黑骑×15 + witch×10 + 普通怪 合计普通150、精英55
  {w:33, eg:[{id:'wyvern',   n:12, iv:2500}, {id:'dark_knight', n:15, iv:2000}, {id:'witch', n:10, iv:2100},
             {id:'spider',  n:85, iv:310}, {id:'harpy',  n:65, iv:330}]},
  // W34：巫妖×15(Epic) + witch×12 + 石像鬼×15 + 普通怪 合计普通150、精英60
  {w:34, eg:[{id:'lich',     n:15, iv:2200}, {id:'witch',   n:12, iv:2000}, {id:'golem',   n:15, iv:2200},
             {id:'spider',  n:85, iv:300}, {id:'wolf',   n:65, iv:330}]},
  // W35：铁石像鬼×10(Epic) + 黑骑×20 + void×8 + 普通怪 合计普通150、精英58
  {w:35, eg:[{id:'iron_golem', n:10, iv:2800}, {id:'dark_knight', n:20, iv:1900}, {id:'void_stalker', n:8, iv:2600},
             {id:'spider',  n:85, iv:300}, {id:'zombie', n:65, iv:320}]},
  // W36：虚空×20 + 飞龙×15 + witch×15 + 普通怪 合计普通150、精英65
  {w:36, eg:[{id:'void_stalker', n:20, iv:1900}, {id:'wyvern', n:15, iv:2200}, {id:'witch', n:15, iv:2000},
             {id:'spider',  n:85, iv:290}, {id:'ghost',  n:65, iv:320}]},
  // W37：黑骑×25 + 巫妖×15 + 铁石×8 + void×10 + 普通怪 合计普通150、精英70（含Epic）
  {w:37, eg:[{id:'dark_knight', n:25, iv:1800}, {id:'lich', n:15, iv:2100}, {id:'iron_golem', n:8, iv:2800}, {id:'void_stalker', n:10, iv:2300},
             {id:'spider',  n:80, iv:285}, {id:'harpy', n:70, iv:310}]},
  // W38：Boss护卫波+虚空+witch+黑骑 合计普通150、精英75（含Boss）
  {w:38, eg:[{id:'boss_colossus', n:1, iv:9999},
             {id:'void_stalker', n:20, iv:1800}, {id:'witch', n:15, iv:2000}, {id:'dark_knight', n:20, iv:1900},
             {id:'spider',  n:80, iv:280}, {id:'zombie', n:70, iv:300}]},
  // W39：四Epic狂潮+witch+普通怪 合计普通150、精英80（临Boss最高压力）
  {w:39, eg:[{id:'wyvern',   n:18, iv:1900}, {id:'lich',   n:15, iv:2100}, {id:'iron_golem', n:10, iv:2700}, {id:'witch', n:12, iv:2000}, {id:'void_stalker', n:15, iv:1900},
             {id:'spider',  n:75, iv:275}, {id:'ghost',  n:75, iv:295}]},

  // ══════════════════════════════════════════════════════════
  // BOSS 40：远古巨人+不死凤凰 双Boss + 护卫 ≥50
  // ══════════════════════════════════════════════════════════
  {w:40, eg:[{id:'boss_colossus', n:1, iv:9999}, {id:'boss_phoenix', n:1, iv:10000},
             {id:'void_stalker', n:20, iv:680}, {id:'witch', n:15, iv:720}, {id:'dark_knight', n:20, iv:680}]},
  // 护卫合计 55 只 ✓

  // ══════════════════════════════════════════════════════════
  // 阶段五：地狱炼狱 41~49（普通≥150 + 精英≥50 + 全Epic混战）
  // ══════════════════════════════════════════════════════════
  // W41：虚空×25 + 黑骑×25 + witch×15 + 普通怪 合计普通155、精英80
  {w:41, eg:[{id:'void_stalker', n:25, iv:1700}, {id:'dark_knight', n:25, iv:1800}, {id:'witch', n:15, iv:1900},
             {id:'spider',  n:90, iv:270}, {id:'wolf',   n:65, iv:290}]},
  // W42：铁石×12 + witch×18 + 飞龙×20 + 虚空×15 + 普通怪 合计普通155、精英80
  {w:42, eg:[{id:'iron_golem', n:12, iv:2600}, {id:'witch', n:18, iv:1800}, {id:'wyvern', n:20, iv:1900}, {id:'void_stalker', n:15, iv:1900},
             {id:'spider',  n:90, iv:260}, {id:'harpy',  n:65, iv:285}]},
  // W43：巫妖×18 + 虚空×22 + 黑骑×20 + witch×10 + 普通怪 合计普通155、精英85（含Epic）
  {w:43, eg:[{id:'lich', n:18, iv:1900}, {id:'void_stalker', n:22, iv:1700}, {id:'dark_knight', n:20, iv:1800}, {id:'witch', n:10, iv:2000},
             {id:'spider',  n:90, iv:255}, {id:'zombie', n:65, iv:280}]},
  // W44：Boss援军+五Epic+普通怪 合计普通155、精英85
  {w:44, eg:[{id:'boss_void', n:1, iv:9999},
             {id:'wyvern', n:15, iv:2000}, {id:'iron_golem', n:10, iv:2600}, {id:'witch', n:18, iv:1800}, {id:'void_stalker', n:12, iv:1800}, {id:'dark_knight', n:15, iv:1900},
             {id:'spider',  n:90, iv:250}, {id:'ghost',  n:65, iv:275}]},
  // W45：五Epic全混+普通怪 合计普通155、精英90
  {w:45, eg:[{id:'dark_knight', n:22, iv:1700}, {id:'lich', n:18, iv:1800}, {id:'void_stalker', n:22, iv:1700}, {id:'witch', n:15, iv:1900}, {id:'wyvern', n:13, iv:2000},
             {id:'spider',  n:85, iv:245}, {id:'wolf',   n:70, iv:265}]},
  // W46：铁石+飞龙+Boss+witch+普通怪 合计普通155、精英95
  {w:46, eg:[{id:'iron_golem', n:15, iv:2400}, {id:'wyvern', n:20, iv:1800}, {id:'boss_dragon', n:1, iv:9999}, {id:'witch', n:20, iv:1700},
             {id:'spider',  n:85, iv:240}, {id:'harpy',  n:70, iv:260}]},
  // W47：虚空×28 + 黑骑×25 + 巫妖×18 + witch×18 + 普通怪 合计普通155、精英100（Epic百怪关卡）
  {w:47, eg:[{id:'void_stalker', n:28, iv:1600}, {id:'dark_knight', n:25, iv:1700}, {id:'lich', n:18, iv:1900}, {id:'witch', n:18, iv:1800},
             {id:'spider',  n:85, iv:235}, {id:'zombie', n:70, iv:255}]},
  // W48：双Boss+六Epic狂潮+普通怪 合计普通155、精英105
  {w:48, eg:[{id:'boss_phoenix', n:1, iv:9999}, {id:'boss_demon', n:1, iv:9000},
             {id:'iron_golem', n:15, iv:2300}, {id:'witch', n:20, iv:1700}, {id:'void_stalker', n:22, iv:1600}, {id:'dark_knight', n:18, iv:1700}, {id:'wyvern', n:15, iv:1900}, {id:'lich', n:15, iv:1900},
             {id:'spider',  n:80, iv:230}, {id:'ghost',  n:75, iv:250}]},
  // W49：六Epic史诗密度+普通怪海 合计普通155、精英120（临终章最高压力）
  {w:49, eg:[{id:'dark_knight', n:25, iv:1600}, {id:'void_stalker', n:25, iv:1600},
             {id:'iron_golem', n:15, iv:2200}, {id:'lich', n:18, iv:1800}, {id:'wyvern', n:20, iv:1700}, {id:'witch', n:20, iv:1700},
             {id:'spider',  n:80, iv:225}, {id:'wolf',   n:75, iv:245}]},

  // ══════════════════════════════════════════════════════════
  // 终章 50：泰坦决战 — 三Boss + 护卫≥50 + 六Epic精英≥120
  // ══════════════════════════════════════════════════════════
  {w:50, eg:[
    {id:'boss_titan',    n:1,  iv:9999},
    {id:'boss_void',     n:1,  iv:7000},
    {id:'boss_colossus', n:1,  iv:6000},
    {id:'void_stalker',  n:30, iv:600},
    {id:'dark_knight',   n:30, iv:600},
    {id:'iron_golem',    n:20, iv:750},
    {id:'witch',         n:25, iv:650},
    {id:'wyvern',        n:20, iv:700},
    {id:'lich',          n:20, iv:700},
    {id:'spider',        n:30, iv:500},
  ]},
];
// ── iv 已按新出怪逻辑（SPAWN_IV=200ms固定节奏）重新设计，无需再缩放 ──
// Boss 的超大 iv（>=5000ms）由 Worker 出怪逻辑特判处理

// ── 波次模式定义 ───────────────────────────────────────
const WAVE_MODES = [
  { id:'w10',  ico:'🌱', lbl:'10波',  sub:'新手体验',   desc:'轻松10波，适合初次游玩',           total:10,   endless:false },
  { id:'w20',  ico:'⚔️',  lbl:'20波',  sub:'标准对战',   desc:'经典20波，攻守兼备的标准局',       total:20,   endless:false },
  { id:'w30',  ico:'🔥', lbl:'30波',  sub:'深度挑战',   desc:'30波超长战役，考验配队深度',       total:30,   endless:false },
  { id:'w50',  ico:'💀', lbl:'50波',  sub:'地狱模式',   desc:'50波炼狱挑战，越打越难',           total:50,   endless:false },
  { id:'end',  ico:'♾️',  lbl:'无尽',  sub:'挑战极限',   desc:'无限波次，强度持续上升，直到城破', total:9999, endless:true  },
  { id:'blitz',ico:'⚡', lbl:'急速',  sub:'快节奏',     desc:'15波，每波间隔缩短，金币加成',     total:15,   endless:false, blitz:true },
];
let selectedWaveMode = WAVE_MODES[1]; // 默认20波

const TALI = [
  // ── 基础符咒（全局加成）──
  {id:'spd',   name:'疾风符',   desc:'己方全部塔攻速+20%',   fx:'spd', v:0.2,  rarity:'common'},
  {id:'dmg',   name:'烈火符',   desc:'己方全部塔攻击力+15%', fx:'dmg', v:0.15, rarity:'common'},
  {id:'rng',   name:'远望符',   desc:'己方全部塔射程+20%',   fx:'rng', v:0.2,  rarity:'common'},
  {id:'gld',   name:'招财符',   desc:'己方击杀金币+50%',     fx:'gld', v:0.5,  rarity:'common'},
  {id:'rep',   name:'修复符',   desc:'立即恢复3点基地血量',  fx:'rep', v:3,    rarity:'common'},

  // ── 羁绊专属符咒（强化特定羁绊系的技能）──
  {id:'syn_swift',  name:'⚡风刃之咒', desc:'【疾风剑豪】连斩范围+50%，双击概率从20%→50%，蓝条充能+30%',
   fx:'syn', synTarget:'swift',  rarity:'rare',
   bonuses:{skillRange:1.5, dblHitChance:0.50, manaGain:1.30}},

  {id:'syn_cannon', name:'💥核爆之咒', desc:'【重炮火力】AOE爆炸半径+50%，核爆伤害从200%→350%，蓝条加速',
   fx:'syn', synTarget:'cannon', rarity:'rare',
   bonuses:{aoeRadius:1.5, ultimateMult:3.5, manaGain:1.25}},

  {id:'syn_crit',   name:'🎯猎杀之咒', desc:'【暴击猎手】暴击率额外+20%，普通暴击从200%→280%，致命一击从500%→700%',
   fx:'syn', synTarget:'crit',   rarity:'rare',
   bonuses:{critChance:0.20, critMult:1.4, ultimateMult:1.4}},

  {id:'syn_element',name:'🌀元素之咒', desc:'【元素使者】DOT伤害+60%，冰冻减速从60%→80%，元素风暴波及全体+额外DOT',
   fx:'syn', synTarget:'element',rarity:'rare',
   bonuses:{dotMult:1.6, iceSlowExtra:0.20, ultimateDot:1.5}},

  {id:'syn_shadow', name:'🌑暗杀之咒', desc:'【暗影刺客】暗杀阈值从30%→50%，DOT伤害+80%，双击率从15%→35%',
   fx:'syn', synTarget:'shadow', rarity:'rare',
   bonuses:{assassinHp:0.50, dotMult:1.8, dblHitChance:0.35}},

  {id:'syn_dragon', name:'🐉龙魂之咒', desc:'【龙族血脉】龙息DOT+100%，龙焰周期从6次→3次，龙息终极波及范围×2',
   fx:'syn', synTarget:'dragon', rarity:'epic',
   bonuses:{dotMult:2.0, breathInterval:3, ultimateRadius:2.0}},

  {id:'syn_undead', name:'💀死亡之咒', desc:'【亡灵天灾】诅咒DOT持续+60%，死亡爆发范围×1.5，波及力×1.5',
   fx:'syn', synTarget:'undead', rarity:'epic',
   bonuses:{dotDuration:1.6, ultimateRadius:1.5, ultimateMult:1.5}},

  {id:'syn_arcane', name:'🔮奥术之咒', desc:'【奥术法师】弹射概率从18%→45%，弹射链长度从1→3，魔法风暴伤害+80%',
   fx:'syn', synTarget:'arcane', rarity:'epic',
   bonuses:{bounceChance:0.45, bounceChain:3, ultimateMult:1.8}},

  {id:'syn_holy',   name:'☀️圣光之咒', desc:'【圣光守护】净化伤害+80%，减速效果增强，圣光减速从38%→60%',
   fx:'syn', synTarget:'holy',   rarity:'rare',
   bonuses:{ultimateMult:1.8, slowExtra:0.22, basicSlowExtra:0.22}},

  {id:'syn_nature', name:'🌿自然之咒', desc:'【自然之佑】毒DOT+80%，藤蔓减速从30%→55%，荆棘爆发范围×1.8',
   fx:'syn', synTarget:'nature', rarity:'rare',
   bonuses:{dotMult:1.8, slowExtra:0.25, ultimateRadius:1.8}},

  {id:'syn_warrior',name:'⚔️战魂之咒', desc:'【战士先锋】破甲层数上限从4→7，冲锋伤害+80%，每层破甲加成从6%→12%',
   fx:'syn', synTarget:'warrior',rarity:'rare',
   bonuses:{armorShredMax:7, armorShredPct:0.12, ultimateMult:1.8}},

  // ── 终极符咒（全局强力加成）──
  {id:'ultimate_storm',name:'⚡风暴觉醒', desc:'【觉醒·全局】所有塔攻速+35%，攻击力+20%',
   fx:'multi', bonuses:{spd:0.35,dmg:0.20}, rarity:'legendary'},
  {id:'ultimate_blaze',name:'🔥烈焰觉醒', desc:'【觉醒·全局】所有塔攻击力+40%，射程+15%',
   fx:'multi', bonuses:{dmg:0.40,rng:0.15}, rarity:'legendary'},
];

// ════════════════════════════════════════════
// 羁绊系统定义
// 每个羁绊需要同时上场特定角色组合，满足人数阈值后生效
// ════════════════════════════════════════════
const SYNERGIES = [
  // ══ 输出系 ══
  {id:'swift',   name:'疾风剑豪', emoji:'💨', category:'输出系',
   chars:['c1001','c1002','c1003','c1004','c1005','c1006','c1007','c1008','c1009','c1010','c1011','c1012'],
   tiers:[
     {need:3,desc:'3件套：所有疾风剑豪单位攻速+30%',fx:{spd:0.30}},
     {need:6,desc:'6件套：攻速+60%，20%概率双重打击',fx:{spd:0.60}},
     {need:9,desc:'9件套：攻速+100%，50%概率双重打击，攻击无视20%护甲',fx:{spd:1.00}},
   ]},
  {id:'cannon',  name:'重炮火力', emoji:'💥', category:'输出系',
   chars:['c2001','c2002','c2003','c2004','c2005','c2006','c2007','c2008','c2009','c2010','c2011','c2012'],
   tiers:[
     {need:3,desc:'3件套：所有重炮单位伤害+50%',fx:{dmg:0.50}},
     {need:6,desc:'6件套：攻击附带AOE爆炸，眩晕1秒',fx:{dmg:0.80}},
     {need:9,desc:'9件套：每10秒发动核爆，200%伤害持续5秒',fx:{dmg:1.20}},
   ]},
  {id:'crit',    name:'暴击猎手', emoji:'🎯', category:'输出系',
   chars:['c3001','c3002','c3003','c3004','c3005','c3006','c3007','c3008','c3009','c3010','c3011','c3012'],
   tiers:[
     {need:3,desc:'3件套：暴击率+25%，暴击伤害+50%',fx:{dmg:0.25}},
     {need:6,desc:'6件套：暴击时触发连锁闪电，伤害50%',fx:{dmg:0.50}},
     {need:9,desc:'9件套：暴击率+50%，暴击后刷新技能冷却',fx:{dmg:0.80}},
   ]},
  {id:'element', name:'元素使者', emoji:'✨', category:'输出系',
   chars:['c4001','c4002','c4003','c4004','c4005','c4006','c4007','c4008','c4009','c4010','c4011','c4012'],
   tiers:[
     {need:3,desc:'3件套：元素伤害+30%，元素抗性+20',fx:{dmg:0.30}},
     {need:6,desc:'6件套：元素伤害+60%，攻击附带元素效果',fx:{dmg:0.60}},
     {need:9,desc:'9件套：元素伤害+100%，元素效果可叠加3层',fx:{dmg:1.00,slow:0.20}},
   ]},
  {id:'shadow',  name:'暗影刺客', emoji:'🌑', category:'输出系',
   chars:['c5001','c5002','c5003','c5004','c5005','c5006','c5007','c5008','c5009','c5010','c5011','c5012'],
   tiers:[
     {need:3,desc:'3件套：暴击率+15%，攻击有10%概率隐身1秒',fx:{dmg:0.15}},
     {need:6,desc:'6件套：暴击率+30%，隐身时伤害+50%',fx:{dmg:0.40}},
     {need:9,desc:'9件套：暴击率+50%，首次攻击必定暴击300%',fx:{dmg:0.70}},
   ]},
  // ══ 防御系 ══
  {id:'tank',    name:'钢铁壁垒', emoji:'🛡️', category:'防御系',
   chars:['c6001','c6002','c6003','c6004','c6005','c6006','c6007','c6008','c6009','c6010','c6011','c6012'],
   tiers:[
     {need:3,desc:'3件套：护甲+100，反伤10%',fx:{rng:0.05}},
     {need:6,desc:'6件套：护甲+200，反伤30%',fx:{rng:0.10}},
     {need:9,desc:'9件套：护甲+300，反伤50%，攻速+15%',fx:{rng:0.15}},
    ]},
   {id:'holy',    name:'圣光守护', emoji:'☀️', category:'防御系',
    chars:['c7001','c7002','c7003','c7004','c7005','c7006','c7007','c7008','c7009','c7010','c7011','c7012'],
    tiers:[
      {need:3,desc:'3件套：攻击附带圣光标记，使目标受伤+8%',fx:{gld:0.05}},
      {need:6,desc:'6件套：圣光标记强化，使目标受伤+16%，攻速+10%',fx:{gld:0.10}},
      {need:9,desc:'9件套：圣光爆发，范围内怪物减速+30%，攻速+10%',fx:{gld:0.20,spd:0.10}},
    ]},
   {id:'nature',  name:'自然之佑', emoji:'🌿', category:'防御系',
    chars:['c8001','c8002','c8003','c8004','c8005','c8006','c8007','c8008','c8009','c8010','c8011','c8012'],
    tiers:[
      {need:3,desc:'3件套：普攻附带毒DOT，每秒造成攻击力8%毒伤',fx:{slow:0.10}},
      {need:6,desc:'6件套：毒DOT强化，每秒造成攻击力15%毒伤，减速+20%',fx:{slow:0.20,spd:0.10}},
      {need:9,desc:'9件套：毒DOT爆发，击杀中毒目标触发毒爆伤害范围溅射，攻速+20%',fx:{slow:0.30,spd:0.20}},
   ]},
  {id:'shield',  name:'魔法护盾', emoji:'🔵', category:'防御系',
   chars:['c9001','c9002','c9003','c9004','c9005','c9006','c9007','c9008','c9009','c9010','c9011','c9012'],
   tiers:[
     {need:3,desc:'3件套：魔法抗性+30，技能冷却-10%',fx:{rng:0.10}},
     {need:6,desc:'6件套：魔法抗性+60，技能冷却-20%，免疫控制1秒',fx:{rng:0.20}},
     {need:9,desc:'9件套：魔法抗性+100，技能冷却-30%，50%魔法伤害反弹',fx:{rng:0.30,dmg:0.10}},
   ]},
  // ══ 功能系 ══
  {id:'mech',    name:'机械工匠', emoji:'⚙️', category:'功能系',
   chars:['c10001','c10002','c10003','c10004','c10005','c10006','c10007','c10008','c10009','c10010','c10011','c10012'],
   tiers:[
     {need:3,desc:'3件套：召唤物数量+1，召唤物生命+20%',fx:{dmg:0.10}},
     {need:6,desc:'6件套：召唤物数量+2，召唤物生命+50%，攻击+30%',fx:{dmg:0.25}},
     {need:9,desc:'9件套：召唤物永久存在，数量上限+5，属性+100%',fx:{dmg:0.50,spd:0.20}},
   ]},
  {id:'arcane',  name:'奥术法师', emoji:'🔮', category:'功能系',
   chars:['c11001','c11002','c11003','c11004','c11005','c11006','c11007','c11008','c11009','c11010','c11011','c11012'],
   tiers:[
     {need:3,desc:'3件套：技能冷却-15%，技能伤害+20%',fx:{dmg:0.20}},
     {need:6,desc:'6件套：技能冷却-30%，技能伤害+40%，10%概率不消耗冷却',fx:{dmg:0.40}},
     {need:9,desc:'9件套：技能冷却-50%，技能伤害+80%，30%概率不消耗冷却',fx:{dmg:0.80,spd:0.15}},
   ]},
  {id:'ranger',  name:'游侠射手', emoji:'🏹', category:'功能系',
   chars:['c12001','c12002','c12003','c12004','c12005','c12006','c12007','c12008','c12009','c12010','c12011','c12012'],
   tiers:[
     {need:3,desc:'3件套：射程+15%，远程伤害+20%',fx:{rng:0.15,dmg:0.20}},
     {need:6,desc:'6件套：射程+30%，远程伤害+40%，攻击穿透1目标',fx:{rng:0.30,dmg:0.40}},
     {need:9,desc:'9件套：射程+50%，远程伤害+80%，攻击穿透3目标',fx:{rng:0.50,dmg:0.80}},
   ]},
  {id:'warrior', name:'战士先锋', emoji:'⚔️', category:'功能系',
   chars:['c13001','c13002','c13003','c13004','c13005','c13006','c13007','c13008','c13009','c13010','c13011','c13012'],
   tiers:[
     {need:3,desc:'3件套：近战伤害+20%，生命+15%',fx:{dmg:0.20}},
     {need:6,desc:'6件套：近战伤害+40%，生命+30%，攻击附带吸血10%',fx:{dmg:0.40,spd:0.10}},
     {need:9,desc:'9件套：近战伤害+80%，生命+50%，吸血20%',fx:{dmg:0.80,spd:0.20}},
   ]},
  {id:'dragon',  name:'龙族血脉', emoji:'🐉', category:'功能系',
   chars:['c14001','c14002','c14003','c14004','c14005','c14006','c14007','c14008','c14009','c14010','c14011','c14012'],
   tiers:[
     {need:2,desc:'2件套：全属性+10%，龙族单位生命+20%',fx:{spd:0.10,dmg:0.10,rng:0.10}},
     {need:4,desc:'4件套：全属性+20%，龙族单位生命+50%，攻击附带龙息',fx:{spd:0.20,dmg:0.20,rng:0.20}},
     {need:6,desc:'6件套：全属性+40%，龙族单位生命+100%，10秒无敌一次',fx:{spd:0.40,dmg:0.40,rng:0.40,gld:0.15}},
   ]},
  {id:'undead',  name:'亡灵天灾', emoji:'💀', category:'功能系',
   chars:['c15001','c15002','c15003','c15004','c15005','c15006','c15007','c15008','c15009','c15010','c15011','c15012'],
   tiers:[
     {need:3,desc:'3件套：攻击附带亡灵诅咒，目标受到的所有伤害+15%',fx:{dmg:0.15}},
     {need:6,desc:'6件套：诅咒强化，受伤+30%，减速+15%，攻击附带毒DOT',fx:{dmg:0.30,slow:0.15}},
     {need:9,desc:'9件套：亡灵单位永久复活(冷却30秒)，生命+50%，攻击附带死亡凋零',fx:{dmg:0.50,slow:0.30}},
   ]},
];

// ── 自动从 CHARS.syns 重建 SYNERGIES.chars，保证两者严格同步 ──
// 无论角色数据如何增删改，羁绊成员列表永远准确
(function _rebuildSynChars(){
  // 先清空所有 chars
  for(const syn of SYNERGIES) syn.chars=[];
  // 遍历所有角色，把自己加进对应羁绊
  for(const c of CHARS){
    for(const synId of (c.syns||[])){
      const syn=SYNERGIES.find(s=>s.id===synId);
      if(syn && !syn.chars.includes(c.id)) syn.chars.push(c.id);
    }
  }
})();

// 根据场上角色 id 列表，计算激活的羁绊及 buff 总倍率
// 返回 { activeSynergies:[{id,name,emoji,tier}], buffs:{spd,dmg,rng,gld,slow} }
// charIds: 角色 id 数组（如场上所有塔的 id）
// 注意：此函数仅主线程用（图鉴/羁绊tab），计算依赖 SYNERGIES.chars 已由 _rebuildSynChars 同步
function calcSynergy(charIds){
  // 统计每个 synId 的角色数
  const synCnt={};
  const seen=new Set();
  for(const cid of charIds){
    if(seen.has(cid)) continue;
    seen.add(cid);
    const c=CHAR_MAP[cid];
    if(!c) continue;
    for(const sid of (c.syns||[])) synCnt[sid]=(synCnt[sid]||0)+1;
  }
  const activeSynergies=[];
  const buffs={spd:0,dmg:0,rng:0,gld:0,slow:0};
  for(const syn of SYNERGIES){
    const cnt=synCnt[syn.id]||0;
    let bestTier=null;
    for(const tier of syn.tiers){
      if(cnt>=tier.need) bestTier=tier;
    }
    if(bestTier){
      activeSynergies.push({id:syn.id,name:syn.name,emoji:syn.emoji,
        cnt,need:bestTier.need,desc:bestTier.desc});
      for(const [k,v] of Object.entries(bestTier.fx)) buffs[k]=(buffs[k]||0)+v;
    }
  }
  return {activeSynergies, buffs};
}

// ════════════════════════════════════════════════════════
// 二、Worker 代码（Blob 方式，绕过 file:// 限制）
// ════════════════════════════════════════════════════════
const WK = `
'use strict';
// ══════════════════════════════════════════
// Worker — 权威游戏服务端
// 所有状态变更只在此处发生，主线程只读不写
// ══════════════════════════════════════════
const TPS=50;
let S=null,iv=null;

function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by);}

// ── 羁绊计算（Worker 内内联，无法引用主线程 SYNERGIES）──
const SYN_DEF=[
  // ══ 输出系 ══
  {id:'swift',   name:'疾风剑豪', emoji:'💨', category:'输出系',
   chars:['c1001','c1002','c1003','c1004','c1005','c1006','c1007','c1008','c1009','c1010','c1011','c1012'],
   tiers:[
     {need:3,desc:'3件套：所有疾风剑豪单位攻速+30%',fx:{spd:0.30}},
     {need:6,desc:'6件套：攻速+60%，20%概率双重打击',fx:{spd:0.60}},
     {need:9,desc:'9件套：攻速+100%，50%概率双重打击，攻击无视20%护甲',fx:{spd:1.00}},
   ]},
  {id:'cannon',  name:'重炮火力', emoji:'💥', category:'输出系',
   chars:['c2001','c2002','c2003','c2004','c2005','c2006','c2007','c2008','c2009','c2010','c2011','c2012'],
   tiers:[
     {need:3,desc:'3件套：所有重炮单位伤害+50%',fx:{dmg:0.50}},
     {need:6,desc:'6件套：攻击附带AOE爆炸，眩晕1秒',fx:{dmg:0.80}},
     {need:9,desc:'9件套：每10秒发动核爆，200%伤害持续5秒',fx:{dmg:1.20}},
   ]},
  {id:'crit',    name:'暴击猎手', emoji:'🎯', category:'输出系',
   chars:['c3001','c3002','c3003','c3004','c3005','c3006','c3007','c3008','c3009','c3010','c3011','c3012'],
   tiers:[
     {need:3,desc:'3件套：暴击率+25%，暴击伤害+50%',fx:{dmg:0.25}},
     {need:6,desc:'6件套：暴击时触发连锁闪电，伤害50%',fx:{dmg:0.50}},
     {need:9,desc:'9件套：暴击率+50%，暴击后刷新技能冷却',fx:{dmg:0.80}},
   ]},
  {id:'element', name:'元素使者', emoji:'✨', category:'输出系',
   chars:['c4001','c4002','c4003','c4004','c4005','c4006','c4007','c4008','c4009','c4010','c4011','c4012'],
   tiers:[
     {need:3,desc:'3件套：元素伤害+30%，元素抗性+20',fx:{dmg:0.30}},
     {need:6,desc:'6件套：元素伤害+60%，攻击附带元素效果',fx:{dmg:0.60}},
     {need:9,desc:'9件套：元素伤害+100%，元素效果可叠加3层',fx:{dmg:1.00,slow:0.20}},
   ]},
  {id:'shadow',  name:'暗影刺客', emoji:'🌑', category:'输出系',
   chars:['c5001','c5002','c5003','c5004','c5005','c5006','c5007','c5008','c5009','c5010','c5011','c5012'],
   tiers:[
     {need:3,desc:'3件套：暴击率+15%，攻击有10%概率隐身1秒',fx:{dmg:0.15}},
     {need:6,desc:'6件套：暴击率+30%，隐身时伤害+50%',fx:{dmg:0.40}},
     {need:9,desc:'9件套：暴击率+50%，首次攻击必定暴击300%',fx:{dmg:0.70}},
   ]},
  // ══ 防御系 ══
  {id:'tank',    name:'钢铁壁垒', emoji:'🛡️', category:'防御系',
   chars:['c6001','c6002','c6003','c6004','c6005','c6006','c6007','c6008','c6009','c6010','c6011','c6012'],
   tiers:[
     {need:3,desc:'3件套：护甲+100，反伤10%',fx:{rng:0.05}},
     {need:6,desc:'6件套：护甲+200，反伤30%',fx:{rng:0.10}},
     {need:9,desc:'9件套：护甲+300，反伤50%，死亡后3秒复活',fx:{rng:0.15}},
   ]},
  {id:'holy',    name:'圣光守护', emoji:'☀️', category:'防御系',
   chars:['c7001','c7002','c7003','c7004','c7005','c7006','c7007','c7008','c7009','c7010','c7011','c7012'],
   tiers:[
     {need:3,desc:'3件套：获得10%最大生命值护盾',fx:{gld:0.05}},
     {need:6,desc:'6件套：获得20%最大生命值护盾，攻击附带击退',fx:{gld:0.10}},
     {need:9,desc:'9件套：死亡时50%概率复活，治疗量+50%',fx:{gld:0.20,spd:0.10}},
   ]},
  {id:'nature',  name:'自然之佑', emoji:'🌿', category:'防御系',
   chars:['c8001','c8002','c8003','c8004','c8005','c8006','c8007','c8008','c8009','c8010','c8011','c8012'],
   tiers:[
     {need:3,desc:'3件套：每秒回复1%生命值，生命回复+20%',fx:{slow:0.10}},
     {need:6,desc:'6件套：每秒回复2%生命值，生命回复+50%',fx:{slow:0.20,spd:0.10}},
     {need:9,desc:'9件套：每秒回复3%生命值，死亡后变树3秒后复活',fx:{slow:0.30,spd:0.20}},
   ]},
  {id:'shield',  name:'魔法护盾', emoji:'🔵', category:'防御系',
   chars:['c9001','c9002','c9003','c9004','c9005','c9006','c9007','c9008','c9009','c9010','c9011','c9012'],
   tiers:[
     {need:3,desc:'3件套：魔法抗性+30，技能冷却-10%',fx:{rng:0.10}},
     {need:6,desc:'6件套：魔法抗性+60，技能冷却-20%，免疫控制1秒',fx:{rng:0.20}},
     {need:9,desc:'9件套：魔法抗性+100，技能冷却-30%，50%魔法伤害反弹',fx:{rng:0.30,dmg:0.10}},
   ]},
  // ══ 功能系 ══
  {id:'mech',    name:'机械工匠', emoji:'⚙️', category:'功能系',
   chars:['c10001','c10002','c10003','c10004','c10005','c10006','c10007','c10008','c10009','c10010','c10011','c10012'],
   tiers:[
     {need:3,desc:'3件套：召唤物数量+1，召唤物生命+20%',fx:{dmg:0.10}},
     {need:6,desc:'6件套：召唤物数量+2，召唤物生命+50%，攻击+30%',fx:{dmg:0.25}},
     {need:9,desc:'9件套：召唤物永久存在，数量上限+5，属性+100%',fx:{dmg:0.50,spd:0.20}},
   ]},
  {id:'arcane',  name:'奥术法师', emoji:'🔮', category:'功能系',
   chars:['c11001','c11002','c11003','c11004','c11005','c11006','c11007','c11008','c11009','c11010','c11011','c11012'],
   tiers:[
     {need:3,desc:'3件套：技能冷却-15%，技能伤害+20%',fx:{dmg:0.20}},
     {need:6,desc:'6件套：技能冷却-30%，技能伤害+40%，10%概率不消耗冷却',fx:{dmg:0.40}},
     {need:9,desc:'9件套：技能冷却-50%，技能伤害+80%，30%概率不消耗冷却',fx:{dmg:0.80,spd:0.15}},
   ]},
  {id:'ranger',  name:'游侠射手', emoji:'🏹', category:'功能系',
   chars:['c12001','c12002','c12003','c12004','c12005','c12006','c12007','c12008','c12009','c12010','c12011','c12012'],
   tiers:[
     {need:3,desc:'3件套：射程+15%，远程伤害+20%',fx:{rng:0.15,dmg:0.20}},
     {need:6,desc:'6件套：射程+30%，远程伤害+40%，攻击穿透1目标',fx:{rng:0.30,dmg:0.40}},
     {need:9,desc:'9件套：射程+50%，远程伤害+80%，攻击穿透3目标',fx:{rng:0.50,dmg:0.80}},
   ]},
  {id:'warrior', name:'战士先锋', emoji:'⚔️', category:'功能系',
   chars:['c13001','c13002','c13003','c13004','c13005','c13006','c13007','c13008','c13009','c13010','c13011','c13012'],
   tiers:[
     {need:3,desc:'3件套：近战伤害+20%，生命+15%',fx:{dmg:0.20}},
     {need:6,desc:'6件套：近战伤害+40%，生命+30%，攻击附带吸血10%',fx:{dmg:0.40,spd:0.10}},
     {need:9,desc:'9件套：近战伤害+80%，生命+50%，吸血20%',fx:{dmg:0.80,spd:0.20}},
   ]},
  {id:'dragon',  name:'龙族血脉', emoji:'🐉', category:'功能系',
   chars:['c14001','c14002','c14003','c14004','c14005','c14006','c14007','c14008','c14009','c14010','c14011','c14012'],
   tiers:[
     {need:2,desc:'2件套：全属性+10%，龙族单位生命+20%',fx:{spd:0.10,dmg:0.10,rng:0.10}},
     {need:4,desc:'4件套：全属性+20%，龙族单位生命+50%，攻击附带龙息',fx:{spd:0.20,dmg:0.20,rng:0.20}},
     {need:6,desc:'6件套：全属性+40%，龙族单位生命+100%，10秒无敌一次',fx:{spd:0.40,dmg:0.40,rng:0.40,gld:0.15}},
   ]},
  {id:'undead',  name:'亡灵天灾', emoji:'💀', category:'功能系',
   chars:['c15001','c15002','c15003','c15004','c15005','c15006','c15007','c15008','c15009','c15010','c15011','c15012'],
   tiers:[
     {need:3,desc:'3件套：攻击附带亡灵诅咒，目标受到的所有伤害+15%',fx:{dmg:0.15}},
     {need:6,desc:'6件套：诅咒强化，受伤+30%，减速+15%，攻击附带毒DOT',fx:{dmg:0.30,slow:0.15}},
     {need:9,desc:'9件套：亡灵单位永久复活(冷却30秒)，生命+50%，攻击附带死亡凋零',fx:{dmg:0.50,slow:0.30}},
   ]},
];
function calcBufs(towers){
  // 直接从 towers 的 syns 字段统计每个 synId 的角色数（去重 charId）
  const synCnt={};
  const seen=new Set();
  for(const t of towers){
    if(seen.has(t.id)) continue;
    seen.add(t.id);
    for(const sid of (t.syns||[])) synCnt[sid]=(synCnt[sid]||0)+1;
  }
  const b={spd:0,dmg:0,rng:0,gld:0,slow:0};
  const active=[];
  for(const syn of SYN_DEF){
    const cnt=synCnt[syn.id]||0;
    let best=null;
    for(const t of syn.tiers){if(cnt>=t.need)best=t;}
    if(best){
      active.push({id:syn.id,name:syn.name,emoji:syn.emoji,cnt,need:best.need,desc:best.desc});
      for(const[k,v] of Object.entries(best.fx)) b[k]=(b[k]||0)+v;
    }
  }
  return{b,active};
}

// 重算某玩家所有塔的有效属性（基础值 * 符咒倍率 * 羁绊倍率）
function recomputeTowers(p){
  const prevActive=new Set((p.activeSynergies||[]).map(s=>s.id+'_'+s.need));
  const{b,active}=calcBufs(p.towers);
  p.synergyBufs=b;
  p.activeSynergies=active;
  // 检测新激活的羁绊（推送特效通知）
  for(const s of active){
    const key=s.id+'_'+s.need;
    if(!prevActive.has(key)){
      self.postMessage({type:'synergyActivated',pid:p.id,synId:s.id,
        name:s.name,emoji:s.emoji,tier:s.need,desc:s.desc});
    }
  }
  for(const t of p.towers){
    const base=p.towerBases[t.uid];
    if(!base)continue;
    const eb=(p.equipBonuses&&p.equipBonuses[t.uid])||{};
    // 符咒 × 羁绊 × 装备，三重加成叠乘
    t.range = base.range * (1+p.taliRng) * (1+b.rng) * (1+(eb.rng||0));
    t.rate  = base.rate  * (1+p.taliSpd) * (1+b.spd) * (1+(eb.spd||0));
    // dmg 也写入塔对象，供攻击时 baseDmgMult 继续叠乘 tali+syn 部分
    t.dmg   = Math.round(base.dmg * (1+(eb.dmg||0)));
  }
}

// 快照
function mkSnap(){
  if(!S)return null;
  const ps={};
  for(const[pid,p] of Object.entries(S.players)){
    ps[pid]={
      gold:p.gold, hp:p.hp, score:p.score,
      slotLimit:p.slotLimit||4,
      wave:p.confirmedWave,
      towers:p.towers.map(t=>({
        uid:t.uid,id:t.id,x:t.x,y:t.y,
        color:t.color,name:t.name,
        range:t.range,rate:t.rate,owner:t.owner,
        _debuffTick:t._debuffTick||0,
        mana:t.mana||0, maxMana:t.maxMana||0,
        syns:t.syns||[],
        stars:t.stars||0,
        charLv:t.charLv||1,
        // 临时buff状态（渲染端显示光环/图标）
        _natureBuff:t._natureBuff||0,
        _natureBuff_tick:t._natureBuff_tick||0,
        _tankShield:t._tankShield||0,
        _tankShield_tick:t._tankShield_tick||0,
        _magicShield:t._magicShield||0,
        _magicShield_tick:t._magicShield_tick||0,
        _holyBlessing:t._holyBlessing||0,
        _holyBlessing_tick:t._holyBlessing_tick||0,
        // 机械炮台数量
        _turretCount:(t._mechTurrets||[]).length,
      })),
      activeSynergies:p.activeSynergies||[],
      synergyBufs:p.synergyBufs||{},
      // 符咒加成数据也传入快照
      taliSpd:p.taliSpd||0,
      taliDmg:p.taliDmg||0,
      taliRng:p.taliRng||0,
      taliGld:p.taliGld||0,
      synTali:p.synTali||{},
    };
  }
  return{
    tick:S.tick,wave:S.wave,
    enemies:S.enemies.map(e=>({
      uid:e.uid,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,
      color:e.color,r:e.r,boss:e.boss,laneIdx:e.laneIdx,
      spd:e.speed||1, eid:e.eid||'', name:e.name||'',
      grade:e.grade||'normal',
      shield:e.shield||0,
      skillDef:e.skillDef||null,
      skillState:e.skillState||null
    })),
    bullets:S.bullets.map(b=>({uid:b.uid,x:b.x,y:b.y,tx:b.tx,ty:b.ty,color:b.color,
    btype:b.btype||'normal',size:b.size||3.5,
    cid:b.cid||'',rarity:b.rarity||'n',stars:b.stars||0,syns:b.syns||[]})),
  fx:S.fx||[],
    waveRunning:S.waveRunning,waveComplete:S.waveComplete,
    gameOver:S.gameOver,victory:S.victory,
    players:ps
  };
}

function allTowers(){
  const a=[];
  for(const p of Object.values(S.players))a.push(...p.towers);
  return a;
}

function tick(){
  if(!S||S.gameOver||S.victory)return;
  S.tick++;

  // 敌人移动
  for(const e of S.enemies){
    if(e.dead)continue;
    // S.paths[e.laneIdx] 是描述符 {path, pxOff}
    const desc=S.paths[e.laneIdx];
    const path=desc.path||desc;
    const pxOff=e.pxOff||0;
    if(e.pi>=path.length){
      e.dead=true;
      self.postMessage({type:'sfx',sfx:'enemyReach'});
      for(const p of Object.values(S.players))p.hp=Math.max(0,p.hp-1);
      if(Object.values(S.players).every(p=>p.hp<=0))S.gameOver=true;
      continue;
    }
    const tg=path[e.pi];
    // 根据当前路段走向决定偏移方向
    const tgNext=path[e.pi+1];
    const segHoriz=tgNext?(tgNext.y===tg.y):(path[e.pi-1]?(path[e.pi-1].y===tg.y):true);
    const tox=segHoriz?0:pxOff, toy=segHoriz?pxOff:0;
    const tx=tg.x*S.ts+S.ts/2+tox, ty=tg.y*S.ts+S.ts/2+toy;
    const dd=dist(e.x,e.y,tx,ty);
    // 减速：aura 怪免疫慢效果
    const slowMult=(e.skillState&&e.skillState.auraActive)?1:(e.slow||1);
    const spd=e.speed*slowMult*(TPS/1000);
    if(dd<spd){e.x=tx;e.y=ty;e.pi++;}
    else{e.x+=((tx-e.x)/dd)*spd;e.y+=((ty-e.y)/dd)*spd;}
    // 减速 tick 倒计时
    if(e.slowTick>0){e.slowTick--;if(e.slowTick<=0)e.slow=1;}
  }

  // 初始化当帧特效列表
  S.fx=[];

  // 辅助：推送特效事件
  function pushFx(type,x,y,opts){
    S.fx.push({type,x,y,...opts});
  }
  // 辅助：技能质变特效（向主线程广播华丽全屏特效）
  // tx/ty = 目标坐标，extra = 额外信息（如穿透方向）
  function pushSkillUlt(tower, label, tx, ty, extra){
    self.postMessage({type:'skillUlt',
      towerName:tower.name||'?', color:tower.color||'#fff',
      label:label||'技能质变', x:tower.x, y:tower.y,
      pid:tower.owner,
      cid:tower.id||'', rarity:tower.rarity||'n',
      stars:tower.stars||0, syns:tower.syns||[],
      tx: tx!=null?tx:tower.x,   // 目标x
      ty: ty!=null?ty:tower.y,   // 目标y
      extra: extra||{}
    });
  }

  // 辅助：范围内所有活着的敌人
  function enemiesInRange(cx,cy,r){
    return S.enemies.filter(e=>!e.dead&&dist(cx,cy,e.x,e.y)<=r);
  }

  // 辅助：施加伤害（带 kill 回调 + 护盾/护甲/反伤/复活）
  // ── 战斗日志缓冲区（每帧最多记录10条，主线程定期拉取）──
  const _gameLog=[];
  function gameLog(level,msg,data){
    if(_gameLog.length>200) return; // 防止爆内存
    _gameLog.push({t:Date.now(),level,msg,data:data||null});
  }

  function dealDmg(e,rawDmg,owner,killerTower){
    let dmg=rawDmg;
    // 异常伤害检测
    if(rawDmg>0&&e.maxHp>0&&rawDmg/e.maxHp>3){
      gameLog('warn','超高伤害',{dmg:Math.round(rawDmg),eHp:e.maxHp,
        eName:e.name||e.eid,tower:killerTower?killerTower.id:'?',
        syns:killerTower?killerTower.syns:[]});
    }
    // 护盾先吸收
    if((e.shield||0)>0){
      const absorbed=Math.min(e.shield,dmg);
      e.shield-=absorbed; dmg-=absorbed;
    }
    // 护甲减伤
    const armorReduce=(e.skillState&&e.skillState.armorReduce)||0;
    dmg=dmg*(1-armorReduce);
    // 反伤特效
    const reflectRatio=(e.skillState&&e.skillState.reflectRatio)||0;
    if(reflectRatio>0&&killerTower&&dmg>0) pushFx('hit',killerTower.x,killerTower.y,{color:'#e84393'});
    // berserk 受击触发
    if(e.skillDef&&e.skillDef.type==='berserk'&&!e.dead&&dmg>0){
      const ss=e.skillState;
      if(!(ss.berserkCd>0)&&Math.random()<(e.skillDef.chance||0.20)){
        ss.berserkCd=e.skillDef.dur||40;
        e.speed=e._baseSpeed*(1+(e.skillDef.v||0.40));
        pushFx('burst',e.x,e.y,{color:'#ff6b35',radius:25});
      }
    }
    e.hp-=dmg;
    // ── 伤害飘字（只在有效伤害时发送，伤害 >= 1 才显示）──
    if(dmg>=1){
      const roundDmg=Math.round(dmg);
      // 根据伤害大小决定颜色和大小
      const isBig=roundDmg>=100;
      self.postMessage({type:'floatDmg',
        x:e.x+(Math.random()*16-8),
        y:e.y-(e.r||12),
        text:roundDmg,
        big:isBig,
        crit:(roundDmg>=200)
      });
    }
    if(e.hp<=0&&!e.dead){
      // 复活检测（boss_phoenix）
      if(e.skillDef&&e.skillDef.type==='revive'&&!(e.skillState&&e.skillState.revived)){
        e.skillState.revived=true;
        e.hp=Math.round(e.maxHp*(e.skillDef.v||0.50));
        pushFx('burst',e.x,e.y,{color:'#f39c12',radius:60});
        self.postMessage({type:'enemySkill',eid:e.uid,name:e.name,skill:'revive',
          x:e.x,y:e.y,grade:e.grade||'boss',
          desc:e.name+' 凤凰涅槃，以50%血量复活！'});
        return;
      }
      e.dead=true;
      self.postMessage({type:'sfx',sfx:'enemyDie',grade:e.grade||'normal'});
      const gldMult=(1+(owner.taliGld||0))*(1+(owner.synergyBufs&&owner.synergyBufs.gld||0));
      owner.gold+=Math.round(e.reward*gldMult);
      owner.score+=e.reward;
      const expReward=e.expReward||Math.round(e.reward*1.2);
      if(killerTower){
        if(!owner.pendingExp) owner.pendingExp=[];
        owner.pendingExp.push({id:killerTower.id, exp:expReward});
      }
    }
  }

  // 辅助：对塔施加攻速减速 debuff
  function applyTowDebuff(e,sk){
    const dbRange=sk.range||150, dbV=sk.v||0.25, dbDur=sk.dur||60, isAoe=sk.aoe||false;
    for(const p of Object.values(S.players)){
      let targets=p.towers.filter(t=>dist(t.x,t.y,e.x,e.y)<=dbRange);
      if(!isAoe) targets=targets.slice(0,1);
      for(const t of targets){
        if(!t._baseRate) t._baseRate=t.rate;
        t.rate=t._baseRate*(1-dbV);
        t._debuffTick=dbDur;
      }
    }
  }

  // ── 怪物技能 tick ────────────────────────────────────────
  for(const e of S.enemies){
    if(e.dead||!e.skillDef) continue;
    // 圣光封禁：非BOSS怪被holy封禁时无法触发技能
    if(e._holySealTick>0){ e._holySealTick--; continue; }
    const sk=e.skillDef, ss=e.skillState;
    ss.cd=(ss.cd||0)-1;
    const hpRatio=e.hp/e.maxHp;
    const hpTrigger=sk.triggerHp===undefined||hpRatio<=sk.triggerHp;
    if(ss.cd>0||!hpTrigger) continue;
    ss.cd=sk.triggerInterval;

    if(sk.type==='speedBurst'){
      if(sk.dur===9999&&!ss.burst){
        ss.burst=true; ss.fired_once=true;
        e.speed=e._baseSpeed*(1+sk.v);
        pushFx('burst',e.x,e.y,{color:'#ff6b35',radius:30});
        self.postMessage({type:'enemySkill',eid:e.uid,name:e.name,skill:sk.id,x:e.x,y:e.y,grade:e.grade||'normal',desc:sk.desc});
      } else if(sk.dur!==9999){
        ss.burstTick=sk.dur; e.speed=e._baseSpeed*(1+sk.v);
        pushFx('burst',e.x,e.y,{color:'#ff6b35',radius:25});
      }
    }
    if(sk.type==='aura'){
      ss.auraActive=true; e.slow=1; e.slowTick=0;
      if(sk.towDebuff){applyTowDebuff(e,sk.towDebuff);pushFx('curse',e.x,e.y,{color:'#1a1a2e'});}
    }
    if(sk.type==='shield'){
      e.shield=(e.shield||0)+sk.v;
      pushFx('burst',e.x,e.y,{color:'#74b9ff',radius:20});
      self.postMessage({type:'enemySkill',eid:e.uid,name:e.name,skill:sk.id,x:e.x,y:e.y,grade:e.grade||'normal',desc:sk.desc});
    }
    if(sk.type==='armorUp'){
      const maxV=sk.maxV||0.80;
      if(!ss.armorStacks) ss.armorStacks=0;
      if(ss.armorStacks<(sk.stack||99)){
        ss.armorStacks++;
        ss.armorReduce=Math.min(maxV,(sk.base||0)+ss.armorStacks*sk.v);
        if(ss.armorStacks<=1||ss.armorStacks%3===0)
          self.postMessage({type:'enemySkill',eid:e.uid,name:e.name,skill:sk.id,
            x:e.x,y:e.y,grade:e.grade||'normal',
            desc:e.name+' 护甲↑ 减伤'+Math.round(ss.armorReduce*100)+'%'});
      }
      if(sk.triggerHp!==undefined) ss.fired_once=true;
    }
    if(sk.type==='lifesteal'){
      e.hp=Math.min(e.maxHp,e.hp+Math.round(e.maxHp*sk.v));
      pushFx('hit',e.x,e.y,{color:'#55efc4'});
    }
    if(sk.type==='towDebuff'){
      applyTowDebuff(e,sk);
      pushFx('curse',e.x,e.y,{color:'#6c5ce7'});
      self.postMessage({type:'enemySkill',eid:e.uid,name:e.name,skill:sk.id,x:e.x,y:e.y,grade:e.grade||'normal',desc:sk.desc});
    }
    if(sk.type==='composite'){
      if(sk.lifesteal) e.hp=Math.min(e.maxHp,e.hp+Math.round(e.maxHp*sk.lifesteal));
      if(sk.reflect) ss.reflectRatio=sk.reflect;
      if(sk.armorUp&&(ss.armorReduce||0)<(sk.armorUp.maxV||0.55)){
        if(!ss.armorStacks) ss.armorStacks=0;
        ss.armorStacks++;
        ss.armorReduce=Math.min(sk.armorUp.maxV||0.55,ss.armorStacks*(sk.armorUp.v||0.03));
      }
      pushFx('burst',e.x,e.y,{color:'#d4af37',radius:35});
    }
    if(sk.type==='dmgReflect') ss.reflectRatio=sk.v||0.15;
  }

  // 技能持续效果倒计时
  for(const e of S.enemies){
    if(e.dead||!e.skillState) continue;
    if((e.skillState.burstTick||0)>0){
      e.skillState.burstTick--;
      if(e.skillState.burstTick<=0&&e._baseSpeed) e.speed=e._baseSpeed;
    }
    if(e.skillState.auraActive){e.slow=1;e.slowTick=0;}
    if((e.skillState.berserkCd||0)>0){
      e.skillState.berserkCd--;
      if(e.skillState.berserkCd<=0&&e._baseSpeed) e.speed=e._baseSpeed;
    }
  }
  // 塔 debuff 归位
  for(const t of allTowers()){
    if((t._debuffTick||0)>0){
      t._debuffTick--;
      if(t._debuffTick<=0&&t._baseRate){t.rate=t._baseRate;t._baseRate=null;}
    }
  }

  // 塔攻击
  for(const t of allTowers()){
    t.cd=(t.cd||0)-TPS;
    if(t.cd>0)continue;
    let best=null,bd=Infinity;
    for(const e of S.enemies){
      if(e.dead)continue;
      const dd=dist(t.x,t.y,e.x,e.y);
      if(dd<=t.range&&dd<bd){best=e;bd=dd;}
    }
    if(!best)continue;
    // 攻速：基础rate + 自然之息临时buff
    const effectiveRate=t.rate*(1+(t._natureBuff||0));
    t.cd=Math.round(1000/effectiveRate);
    const owner=S.players[t.owner];
    if(!owner)continue;
    const baseDmgMult=(1+(owner.taliDmg||0))*(1+(owner.synergyBufs&&owner.synergyBufs.dmg||0))
      *(1+((owner._shieldUltActive||0)>0?0.20:0)); // 🔵 法术解除：破防增伤+20%

    // ── 技能触发计数 ──
    t.hitCount=(t.hitCount||0)+1;

    // ── 读取此塔所属羁绊系的咒加成 ──
    const mainSyn=(t.syns||[])[0]||'';
    const sBonus=(owner.synTali&&owner.synTali[mainSyn])||{};

    // ── 根据角色id执行技能逻辑 ──
    const cid=t.id;

    // ── 蓝条充能（普攻+18蓝，高星级+额外蓝）──
    if(t.maxMana==null) t.maxMana=80;
    if(t.mana==null) t.mana=0;
    const manaGain=(t._manaGain||18)+(t.star>=4?6:t.star>=2?3:0);
    t.mana=Math.min(t.maxMana, t.mana+manaGain);
    const skillReady=(t.mana>=t.maxMana); // 蓝满即可释放主动
    if(skillReady) t.mana=0;             // 释放后清空蓝条

    // 施法特效（每次攻击都发，携带角色完整信息供渲染器专属处理）
    const tRarity=t.rarity||'n';
    const tStar=t.stars||0;
    const hasTali=!!(owner.synTali&&Object.keys(owner.synTali).length>0);
    pushFx('cast',t.x,t.y,{color:t.color,cid,rarity:tRarity,stars:tStar,
      syns:t.syns||[], hasTali, skillReady,
      tx:best.x, ty:best.y  // 目标坐标（供指向性特效）
    });
    // 打击音效（低频抽样，避免音效轰炸）
    const hitHeavy=(tRarity==='ssr'&&tStar>=3)||tStar>=4;
    if(Math.random()<(tRarity==='ssr'?0.12:0.08)) self.postMessage({type:'sfx',sfx:'hit',heavy:hitHeavy});

    let skillFired=false;

    // ══ 每系技能系统：普攻被动（每次）+ 主动技能（蓝满触发）══
    const syns = t.syns || [];

    // ── 通用辅助函数：给某玩家的所有塔施加临时 buff ──
    // buffKey: 塔上存储的临时buff字段名, value: 叠加值, duration(tick数)
    function applyTowerBuff(pid, buffKey, value, duration){
      const rp=S.players[pid]; if(!rp)return;
      for(const tt of rp.towers){
        tt[buffKey]=(tt[buffKey]||0)+value;
        tt[buffKey+'_tick']=Math.max(tt[buffKey+'_tick']||0, duration);
      }
    }

    // 🌪️ 疾风剑豪 ── 普攻减速20% | 蓝满：连斩相邻2敌
    if(syns.includes('swift')){
      skillFired=true;
      best.slow=Math.min(0.45,(best.slow||1)*0.80);
      best.slowTick=Math.max(best.slowTick||0,20);
      dealDmg(best,t.dmg*baseDmgMult,owner,t);
      // 咒：双击概率增强
      const swiftDblChance=sBonus.dblHitChance||0.20;
      if(Math.random()<swiftDblChance){ dealDmg(best,t.dmg*baseDmgMult*0.8,owner,t); pushFx('slash',best.x,best.y,{color:t.color}); }
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:80,btype:'slash',size:3.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        // 咒：连斩范围增强
        const slashR=sBonus.skillRange?65*sBonus.skillRange:65;
        const nearby=enemiesInRange(best.x,best.y,slashR).filter(e=>e.uid!==best.uid).slice(0,3);
        pushFx('slash',best.x,best.y,{color:t.color});
        pushFx('burst',t.x,t.y,{color:t.color,radius:20+slashR*0.2});
        for(const ne of nearby){ dealDmg(ne,t.dmg*baseDmgMult*1.2,owner,t); pushFx('hit',ne.x,ne.y,{color:t.color}); }
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'技能质变',best.x,best.y);
      }
    }
    // 💣 重炮火力 ── 每次小范围爆炸 | 蓝满：超级大爆炸
    else if(syns.includes('cannon')){
      skillFired=true;
      // 咒：AOE半径 + 核爆倍率
      const aoeScale=sBonus.aoeRadius||1.0;
      const ultMult=sBonus.ultimateMult||3.5;
      const boomR=skillReady?Math.round(120*aoeScale):Math.round(65*aoeScale);
      const boomMult=skillReady?ultMult:0.5*aoeScale;
      pushFx('explode',best.x,best.y,{color:t.color,radius:boomR});
      for(const e of enemiesInRange(best.x,best.y,boomR)){
        dealDmg(e,e.uid===best.uid?t.dmg*baseDmgMult:t.dmg*baseDmgMult*boomMult,owner,t);
        if(e.uid!==best.uid) pushFx('hit',e.x,e.y,{color:t.color});
      }
      if(skillReady){ pushFx('burst',best.x,best.y,{color:'#f39c12',radius:Math.round(50*aoeScale)}); self.postMessage({type:'sfx',sfx:'hit',heavy:true}); }
    }
    // 🎯 暴击猎手 ── 暴击概率 | 蓝满：致命一击
    else if(syns.includes('crit')){
      skillFired=true;
      // 咒：暴击率 + 倍率加成
      const critChance=0.35+(sBonus.critChance||0);
      const critMultiplier=2.0*(sBonus.critMult||1.0);
      const ultMultiplier=5.0*(sBonus.ultimateMult||1.0);
      if(skillReady){
        dealDmg(best,t.dmg*baseDmgMult*ultMultiplier,owner,t);
        pushFx('burst',best.x,best.y,{color:'#ffd700',radius:55});
        pushFx('slash',best.x,best.y,{color:'#ffd700'});
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#ffd700',life:130,btype:'normal',size:7,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'技能质变',best.x,best.y);
        // 咒：致命一击附带连锁闪电
        if(sBonus.critChance>0){
          for(const ce of enemiesInRange(best.x,best.y,100).filter(e=>e.uid!==best.uid).slice(0,3)){
            dealDmg(ce,t.dmg*baseDmgMult*critMultiplier*0.5,owner,t);
            pushFx('hit',ce.x,ce.y,{color:'#ffd700'});
            S.bullets.push({uid:S.uid++,x:best.x,y:best.y,tx:ce.x,ty:ce.y,color:'#ffd700',life:90,btype:'normal',size:3});
          }
        }
      } else if(Math.random()<critChance){
        dealDmg(best,t.dmg*baseDmgMult*critMultiplier,owner,t);
        pushFx('burst',best.x,best.y,{color:'#ffd700',radius:25});
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#ffd700',life:120,btype:'normal',size:5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      } else {
        dealDmg(best,t.dmg*baseDmgMult,owner,t);
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:110,btype:'normal',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      }
    }
    // ✨ 元素使者 ── 轮流火/冰/雷三元素 | 蓝满：全元素风暴
    else if(syns.includes('element')){
      skillFired=true;
      // 咒：DOT增强 + 冰冻加强
      const elemDotMult=sBonus.dotMult||1.0;
      const iceExtra=sBonus.iceSlowExtra||0;
      const elem=t.hitCount%3;
      dealDmg(best,t.dmg*baseDmgMult*1.1,owner,t);
      if(elem===0){
        if(!best.dot) best.dot={dmg:0,tick:0,owner:t.owner};
        best.dot.dmg=Math.max(best.dot.dmg||0,Math.floor(t.dmg*0.12*elemDotMult));
        best.dot.tick=Math.max(best.dot.tick||0,50); best.dot.owner=t.owner;
        pushFx('hit',best.x,best.y,{color:'#e17055'});
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#e17055',life:130,btype:'fire',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      } else if(elem===1){
        const iceSlowBase=0.60-iceExtra;
        best.slow=Math.min(0.35-iceExtra,(best.slow||1)*iceSlowBase); best.slowTick=Math.max(best.slowTick||0,35);
        pushFx('freeze',best.x,best.y,{color:'#74b9ff'});
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#74b9ff',life:140,btype:'ice',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      } else {
        // ⚡ 雷电链：从主目标出发，真正地逐段跳跃（每段发射独立子弹）
        const chainRange=90*(sBonus.dotMult?1.3:1.0);
        // 主目标先受击
        pushFx('hit',best.x,best.y,{color:'#fdcb6e'});
        S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,
          color:'#fdcb6e',life:110,btype:'chain_lightning',size:4,
          cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
        // 从主目标依次跳跃，每跳一段发一颗"从上一个目标到下一个目标"的子弹
        let src=best; let jumped=0;
        const maxChain=sBonus.chainMax||3;
        const visited=new Set([best.uid]);
        while(jumped<maxChain){
          const next=enemiesInRange(src.x,src.y,chainRange)
            .find(e=>!e.dead&&!visited.has(e.uid));
          if(!next) break;
          visited.add(next.uid);
          dealDmg(next,t.dmg*baseDmgMult*0.55,owner,t);
          pushFx('hit',next.x,next.y,{color:'#fdcb6e'});
          // 从 src 发射到 next 的闪电子弹
          S.bullets.push({uid:S.uid++,x:src.x,y:src.y,tx:next.x,ty:next.y,
            color:'#fdcb6e',life:80,btype:'chain_lightning',size:3});
          src=next; jumped++;
        }
      }
      if(skillReady){
        // 元素风暴：三元素依次爆发，各元素效果不同，范围受品质限制
        const elemUltR={n:70,r:85,sr:100,ssr:120}[t.rarity||'n'];
        pushFx('burst',t.x,t.y,{color:'#a29bfe',radius:elemUltR});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'元素风暴',best.x,best.y);
        const ultDotMult=(sBonus.ultimateDot||1.0)*elemDotMult;
        for(const e of enemiesInRange(t.x,t.y,elemUltR)){
          if(e.dead) continue;
          // 风暴效果：适度直伤 + 弱DOT + 减速（不是高爆发伤害）
          dealDmg(e,t.dmg*baseDmgMult*0.6,owner,t);
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.max(e.dot.dmg||0,Math.floor(t.dmg*0.10*ultDotMult));
          e.dot.tick=Math.max(e.dot.tick||0,60); e.dot.owner=t.owner;
          e.slow=Math.min(0.4,(e.slow||1)*0.65); e.slowTick=Math.max(e.slowTick||0,40);
        }
      }
    }
    // 🌑 暗影刺客 ── 暗夜侵蚀DOT | 蓝满：锁定最近3个低血量敌人暗杀（限定数量+限范围）
    else if(syns.includes('shadow')){
      skillFired=true;
      const shadowDotMult=sBonus.dotMult||1.0;
      const shadowDblChance=sBonus.dblHitChance||0.15;
      // 普攻：诅咒DOT（"暗夜侵蚀"：每秒10点伤害持续3秒 → 约0.15*dmg/tick，持续60tick）
      if(!best.dot) best.dot={dmg:0,tick:0,owner:t.owner};
      best.dot.dmg=Math.max(best.dot.dmg||0,Math.floor(t.dmg*0.14*shadowDotMult));
      best.dot.tick=Math.max(best.dot.tick||0,60); best.dot.owner=t.owner;
      dealDmg(best,t.dmg*baseDmgMult*0.9,owner,t); // 普攻略低，强在DOT
      pushFx('curse',best.x,best.y,{color:'#6c5ce7'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#6c5ce7',life:140,btype:'shadow',size:3.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(Math.random()<shadowDblChance){ dealDmg(best,t.dmg*baseDmgMult*0.7,owner,t); pushFx('slash',best.x,best.y,{color:'#2d3436'}); }
      if(skillReady){
        // 蓝满：暗影突袭——锁定塔射程内最多3个血量最低的怪，造成高倍爆发伤（不是全场AOE）
        // 品质决定暗杀倍率：n=2.5x, r=3x, sr=4x, ssr=5x
        const assassinMult={n:2.5,r:3.0,sr:4.0,ssr:5.0}[t.rarity||'n'];
        const assassinRange=t.range; // 限定在塔的射程内，不是全图
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'暗影突袭',best.x,best.y);
        // 取范围内血量百分比最低的3个目标
        const targets=enemiesInRange(t.x,t.y,assassinRange)
          .filter(e=>!e.dead&&!e.boss)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))
          .slice(0,3);
        for(const e of targets){
          // 对已有DOT的目标额外爆发（体现"刺客趁虚而入"）
          const hasDot=(e.dot&&e.dot.tick>0)?1.3:1.0;
          dealDmg(e,t.dmg*baseDmgMult*assassinMult*hasDot,owner,t);
          pushFx('burst',e.x,e.y,{color:'#8e44ad',radius:25});
          pushFx('curse',e.x,e.y,{color:'#8e44ad'});
          // 重置DOT（刺客走后留下更深的诅咒）
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.floor(t.dmg*0.18*shadowDotMult); e.dot.tick=80; e.dot.owner=t.owner;
        }
      }
    }
    // 🏹 游侠射手 ── 追踪标记叠加 | 蓝满：穿透箭贯穿所有敌人
    else if(syns.includes('ranger')){
      skillFired=true;
      if(!best._marked) best._marked=0;
      best._marked=Math.min(3,best._marked+1);
      dealDmg(best,t.dmg*baseDmgMult*(1+best._marked*0.08),owner,t);
      pushFx('hit',best.x,best.y,{color:t.color});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:160,btype:'normal',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        const dx=best.x-t.x,dy=best.y-t.y,len=Math.sqrt(dx*dx+dy*dy)||1;
        const nx=dx/len,ny=dy/len;
        // 穿透箭：沿射线方向，只击中射程内的敌人（不是全图）
        const pierceRange=t.range+60; // 穿透延伸略超出射程
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'穿透箭',best.x,best.y);
        for(const e of enemiesInRange(t.x,t.y,pierceRange)){
          if(e.dead) continue;
          const px=e.x-t.x,py=e.y-t.y,proj=px*nx+py*ny;
          if(proj<0) continue; // 必须在射线前方
          if(Math.abs(px*ny-py*nx)<=e.r+18){ dealDmg(e,t.dmg*baseDmgMult*1.5,owner,t); pushFx('hit',e.x,e.y,{color:t.color}); }
        }
        pushFx('spark',t.x,t.y,{tx:t.x+nx*pierceRange,ty:t.y+ny*pierceRange,color:t.color});
      }
    }
    // ⚔️ 战士先锋 ── 【近战输出型】破甲叠加 | 蓝满：战吼冲锋溅射
    // 定位：近战高爆发，破甲层叠加逐渐提升对单体伤害，蓝满发动冲锋溅射周围敌人
    else if(syns.includes('warrior')){
      skillFired=true;
      const shredMax=sBonus.armorShredMax||4;
      const shredPct=sBonus.armorShredPct||0.06;
      const warUltMult=sBonus.ultimateMult||1.8;
      if(!best._armorShred) best._armorShred=0;
      best._armorShred=Math.min(shredMax,best._armorShred+1);
      best._armorShredTick=40;
      const warDmgDealt=t.dmg*baseDmgMult*(1+best._armorShred*shredPct);
      dealDmg(best,warDmgDealt,owner,t);
      pushFx('slash',best.x,best.y,{color:t.color});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:100,btype:'slash',size:4.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'战吼冲锋',best.x,best.y);
        pushFx('burst',t.x,t.y,{color:t.color,radius:80});
        for(const ne of enemiesInRange(t.x,t.y,80)){
          dealDmg(ne,t.dmg*baseDmgMult*warUltMult,owner,t);
          pushFx('slash',ne.x,ne.y,{color:t.color});
        }
      } else {
        for(const ne of enemiesInRange(best.x,best.y,60).filter(e=>e.uid!==best.uid).slice(0,2)){
          dealDmg(ne,t.dmg*baseDmgMult*0.65,owner,t); pushFx('hit',ne.x,ne.y,{color:t.color});
        }
      }
    }
    // 🐉 龙族血脉 ── 普攻附龙焰DOT | 蓝满：超级龙息
    else if(syns.includes('dragon')){
      skillFired=true;
      // 咒：DOT增强 + 龙焰频率 + 终极范围
      const dragonDotMult=sBonus.dotMult||1.0;
      const breathInt=sBonus.breathInterval||6;
      const ultRadius=sBonus.ultimateRadius||1.0;
      if(!best.dot) best.dot={dmg:0,tick:0,owner:t.owner};
      best.dot.dmg=Math.max(best.dot.dmg||0,Math.floor(t.dmg*0.1*dragonDotMult));
      best.dot.tick=Math.max(best.dot.tick||0,40); best.dot.owner=t.owner;
      dealDmg(best,t.dmg*baseDmgMult*1.1,owner,t);
      pushFx('hit',best.x,best.y,{color:'#e17055'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#e17055',life:120,btype:'fire',size:4.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        const ultR=Math.round(130*ultRadius);
        pushFx('explode',t.x,t.y,{color:'#e17055',radius:ultR});
        self.postMessage({type:'sfx',sfx:'hit',heavy:true});
        for(const e of enemiesInRange(t.x,t.y,ultR)){
          if(e.dead) continue;
          dealDmg(e,t.dmg*baseDmgMult*2.5,owner,t);
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.floor(t.dmg*0.18*dragonDotMult); e.dot.tick=80; e.dot.owner=t.owner;
        }
      } else if(t.hitCount%breathInt===0){
        const breathR=Math.round(95*ultRadius);
        pushFx('explode',best.x,best.y,{color:'#e17055',radius:breathR});
        for(const e of enemiesInRange(best.x,best.y,breathR)){
          dealDmg(e,t.dmg*baseDmgMult*(e.uid===best.uid?1.8:0.8),owner,t);
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.floor(t.dmg*0.12*dragonDotMult); e.dot.tick=50; e.dot.owner=t.owner;
        }
      }
    }
    // 💀 亡灵天灾 ── 诅咒DOT+轻减速 | 蓝满：死亡爆发
    else if(syns.includes('undead')){
      skillFired=true;
      // 咒：DOT持续 + 范围 + 终极倍率
      const undeadDotMult=1.0;
      const undeadDotDur=(sBonus.dotDuration||1.0);
      const undeadUltR=sBonus.ultimateRadius||1.0;
      const undeadUltMult=sBonus.ultimateMult||1.0;
      if(!best.dot) best.dot={dmg:0,tick:0,owner:t.owner};
      best.dot.dmg=Math.max(best.dot.dmg||0,Math.floor(t.dmg*0.22));
      best.dot.tick=Math.max(best.dot.tick||0,Math.round(80*undeadDotDur)); best.dot.owner=t.owner;
      best.slow=Math.min(0.6,(best.slow||1)*0.92); best.slowTick=Math.max(best.slowTick||0,15);
      dealDmg(best,t.dmg*baseDmgMult,owner,t);
      pushFx('curse',best.x,best.y,{color:'#b2bec3'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#b2bec3',life:150,btype:'shadow',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        // 死亡爆发：范围+倍率由品质决定，不再是固定100范围2.0倍
        const undeadRarityR={n:70,r:85,sr:100,ssr:120};
        const undeadRarityMult={n:1.2,r:1.5,sr:1.8,ssr:2.2};
        const ultR=Math.round(undeadRarityR[t.rarity||'n']*undeadUltR);
        const ultMult=undeadRarityMult[t.rarity||'n']*undeadUltMult;
        pushFx('burst',t.x,t.y,{color:'#6c5ce7',radius:ultR});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'死亡爆发',best.x,best.y);
        for(const e of enemiesInRange(t.x,t.y,ultR)){
          if(e.dead) continue;
          dealDmg(e,t.dmg*baseDmgMult*ultMult,owner,t);
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.floor(t.dmg*0.18); e.dot.tick=Math.round(90*undeadDotDur); e.dot.owner=t.owner;
          pushFx('curse',e.x,e.y,{color:'#6c5ce7'});
        }
      }
    }
    // 🔮 奥术法师 ── 弹射 | 蓝满：魔法风暴
    else if(syns.includes('arcane')){
      skillFired=true;
      // 咒：弹射概率 + 链长 + 终极倍率
      const arcBounceChance=sBonus.bounceChance||0.18;
      const arcBounceChain=Math.round(sBonus.bounceChain||1);
      const arcUltMult=sBonus.ultimateMult||1.0;
      dealDmg(best,t.dmg*baseDmgMult*1.05,owner,t);
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:160,btype:'normal',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(Math.random()<arcBounceChance){
        let src=best;
        for(let bi=0;bi<arcBounceChain;bi++){
          const bounce=enemiesInRange(src.x,src.y,80).find(e=>e.uid!==src.uid&&!e.dead);
          if(!bounce) break;
          dealDmg(bounce,t.dmg*baseDmgMult*0.45,owner,t);
          pushFx('hit',bounce.x,bounce.y,{color:t.color});
          S.bullets.push({uid:S.uid++,x:src.x,y:src.y,tx:bounce.x,ty:bounce.y,color:t.color,life:80,btype:'normal',size:3});
          src=bounce;
        }
      }
      if(skillReady){
        pushFx('burst',t.x,t.y,{color:t.color,radius:110});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'技能质变',best.x,best.y);
        for(const e of enemiesInRange(t.x,t.y,110)){
          if(e.dead) continue;
          dealDmg(e,t.dmg*baseDmgMult*1.2*arcUltMult,owner,t); pushFx('hit',e.x,e.y,{color:t.color});
        }
      }
    }
    // 🔧 机械工匠 ── 【召唤型】精准射击减速 | 蓝满：部署自动炮台（短期内额外攻击）
    // 定位：召唤/工程师，部署炮台自动输出，而不是直接AOE高伤
    else if(syns.includes('mech')){
      skillFired=true;
      // 普攻：精准机械弹，减速（齿轮卡住敌人）
      best.slow=Math.min(0.50,(best.slow||1)*0.80);
      best.slowTick=Math.max(best.slowTick||0,45);
      dealDmg(best,t.dmg*baseDmgMult,owner,t);
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:150,btype:'normal',size:4.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      // 被动：已部署的炮台自动攻击（每tick检查）
      if(!t._mechTurrets) t._mechTurrets=[];
      // 炮台自动射击：对最近敌人造成伤害
      t._mechTurrets=t._mechTurrets.filter(tr=>{
        tr.life--;
        if(tr.life<=0) return false;
        tr.cd=(tr.cd||0)-1;
        if(tr.cd<=0){
          const te=enemiesInRange(tr.x,tr.y,tr.range)[0];
          if(te&&!te.dead){
            dealDmg(te,tr.dmg,owner,t);
            pushFx('hit',te.x,te.y,{color:'#636e72'});
            S.bullets.push({uid:S.uid++,x:tr.x,y:tr.y,tx:te.x,ty:te.y,color:'#636e72',life:80,btype:'normal',size:3});
          }
          tr.cd=Math.round(1000/tr.rate);
        }
        return true;
      });
      if(skillReady){
        // 蓝满：部署一个临时自动炮台在塔的位置
        pushFx('explode',t.x,t.y,{color:'#636e72',radius:40});
        self.postMessage({type:'sfx',sfx:'hit',heavy:true});
        pushSkillUlt(t,'部署炮台',t.x,t.y);
        const mechTurretDmg=t.dmg*baseDmgMult*(sBonus.turretDmg||0.6);
        t._mechTurrets.push({
          x:t.x,y:t.y,
          dmg:mechTurretDmg,
          range:100*(sBonus.turretRange||1.0),
          rate:t.rate*(sBonus.turretRate||1.2),
          life:300, // 约6秒
          cd:0
        });
        self.postMessage({type:'sfx',sfx:'levelUp'});
        // 同时对当前目标附近做一次小爆炸（炮台开机轰击）
        for(const e of enemiesInRange(best.x,best.y,60)){
          if(e.dead) continue;
          dealDmg(e,t.dmg*baseDmgMult*0.8,owner,t);
          e.slow=Math.min(0.40,(e.slow||1)*0.65); e.slowTick=Math.max(e.slowTick||0,50);
        }
      }
    }
    // ✝️ 圣光守护 ── 【治疗辅助型】圣光减速 | 蓝满：圣光祝福（给友方塔加蓝+短暂无敌）
    // 定位：治疗辅助，减速净化怪物，给队友加速蓝量积累
    else if(syns.includes('holy')){
      skillFired=true;
      const holySlow=Math.min(0.60,0.38+(sBonus.basicSlowExtra||0));
      const holyUltMult=sBonus.ultimateMult||1.0;
      // 普攻：圣光弹，减速（体现净化/压制），中等伤害
      best.slow=Math.min(1-holySlow,(best.slow||1)*(1-holySlow+0.40));
      best.slowTick=Math.max(best.slowTick||0,30);
      dealDmg(best,t.dmg*baseDmgMult*1.0,owner,t);
      pushFx('hit',best.x,best.y,{color:'#ffd700'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#ffd700',life:150,btype:'thunder',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        // 圣光封禁阵：以塔为圆心，范围由品质决定
        // 效果：强减速 + 封禁怪技能（不造成直接大伤害）
        const holyRarityR={n:60,r:80,sr:100,ssr:140};
        const holyR=holyRarityR[t.rarity||'n'];
        const holyDur={n:100,r:150,sr:200,ssr:300}[t.rarity||'n'];
        pushFx('burst',t.x,t.y,{color:'#ffd700',radius:holyR});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'圣光封禁阵',t.x,t.y);
        for(const e of enemiesInRange(t.x,t.y,holyR)){
          if(e.dead) continue;
          e.slow=Math.min(0.20,(e.slow||1)*0.35);
          e.slowTick=Math.max(e.slowTick||0,holyDur);
          // 封禁技能（BOSS免疫封禁，但仍受减速）
          if(!e.boss){ e._holySealed=true; e._holySealTick=holyDur; }
          // 净化性伤害（仅对已被封禁的小怪造成轻微伤害，表示"圣光灼烧"）
          dealDmg(e,t.dmg*baseDmgMult*0.3*holyUltMult,owner,t);
          pushFx('hit',e.x,e.y,{color:'#ffd700'});
        }
      }
    }
    // 🛡️ 钢铁壁垒 ── 【控场型】重击减速 | 蓝满：震地硬直（大范围强减速+攻速降低）
    // 定位：控场坦克，减缓怪物推进节奏，蓝满震地让全场怪物短暂"冰封"
    else if(syns.includes('tank')){
      skillFired=true;
      // 普攻：重击，减速（体现"嘲讽/硬打"）
      best.slow=Math.min(0.20,(best.slow||1)*0.65);
      best.slowTick=Math.max(best.slowTick||0,18);
      dealDmg(best,t.dmg*baseDmgMult*1.3,owner,t);
      pushFx('hit',best.x,best.y,{color:'#636e72'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#636e72',life:120,btype:'slash',size:5.5,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        // 蓝满：震地冲击波——全场怪物强减速（不是高伤AOE，是控场）
        // 范围由品质决定：n=80, r=100, sr=120, ssr=全场
        const rarityRanges={n:80,r:100,sr:120,ssr:99999};
        const tankUltR=rarityRanges[t.rarity||'n'];
        pushFx('explode',t.x,t.y,{color:'#b2bec3',radius:Math.min(tankUltR,160)});
        self.postMessage({type:'sfx',sfx:'hit',heavy:true});
        pushSkillUlt(t,'震地硬直',t.x,t.y);
        for(const e of enemiesInRange(t.x,t.y,tankUltR)){
          if(e.dead) continue;
          // 强减速（速度降到原来30%）+ 持续时间长
          e.slow=Math.min(0.10,(e.slow||1)*0.30);
          e.slowTick=Math.max(e.slowTick||0,60);
          dealDmg(e,t.dmg*baseDmgMult*0.5,owner,t); // 控场为主，低伤
          pushFx('hit',e.x,e.y,{color:'#b2bec3'});
        }
        self.postMessage({type:'sfx',sfx:'levelUp'});
      }
    }
    // 🌲 自然之佑 ── 【辅助型】藤蔓减速+毒 | 蓝满：全场回春（给友方塔加速buff）
    // 定位：辅助，减速怪物 + 给队友提供攻速增益
    else if(syns.includes('nature')){
      skillFired=true;
      const natureDotMult=sBonus.dotMult||1.0;
      const natureSlow=0.82-(sBonus.slowExtra||0);
      const natureUltR=sBonus.ultimateRadius||1.0;
      // 普攻：藤蔓缠绕，减速+毒DOT（功能在减速，不在爆发伤害）
      best.slow=Math.min(0.30,(best.slow||1)*natureSlow);
      best.slowTick=Math.max(best.slowTick||0,35);
      if(!best.dot) best.dot={dmg:0,tick:0,owner:t.owner};
      best.dot.dmg=Math.max(best.dot.dmg||0,Math.floor(t.dmg*0.12*natureDotMult));
      best.dot.tick=Math.max(best.dot.tick||0,50); best.dot.owner=t.owner;
      dealDmg(best,t.dmg*baseDmgMult*0.9,owner,t); // 普攻伤害略低，换取控制
      pushFx('freeze',best.x,best.y,{color:'#27ae60'});
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#27ae60',life:150,btype:'poison',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        const ultR=Math.round(110*natureUltR);
        pushFx('burst',t.x,t.y,{color:'#27ae60',radius:ultR});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'回春之息',best.x,best.y);
        // 荆棘爆发：范围内敌人强减速+毒DOT（仍以控制为主，伤害次要）
        for(const e of enemiesInRange(t.x,t.y,ultR)){
          if(e.dead) continue;
          e.slow=Math.min(0.20,(e.slow||1)*0.40);
          e.slowTick=Math.max(e.slowTick||0,80);
          if(!e.dot) e.dot={dmg:0,tick:0,owner:t.owner};
          e.dot.dmg=Math.floor(t.dmg*0.20*natureDotMult); e.dot.tick=100; e.dot.owner=t.owner;
          dealDmg(e,t.dmg*baseDmgMult*0.5,owner,t); // 低直接伤害
        }
        // 🌿 核心辅助效果：给己方所有塔施加"自然之息"攻速buff（+25%攻速，持续200tick≈4秒）
        const natureSpdBonus=sBonus.auraSpd||0.25;
        applyTowerBuff(t.owner,'_natureBuff',natureSpdBonus,200);
        self.postMessage({type:'sfx',sfx:'levelUp'});
      }
    }
    // 🔵 魔法护盾 ── 【破防辅助型】法术减速 | 蓝满：法术解除（全场怪物护甲清零+全场塔伤害提升X秒）
    // 定位：破防辅助，让怪物变脆，全场塔打出更高伤害
    else if(syns.includes('shield')){
      skillFired=true;
      // 普攻：法术弹，附带小幅护甲削减
      best.slow=Math.min(0.50,(best.slow||1)*0.85);
      best.slowTick=Math.max(best.slowTick||0,25);
      // 普攻被动：每次命中给目标施加"法术标记"，叠加护甲削减
      best._magicMark=(best._magicMark||0)+1;
      best._magicMarkTick=60; // 标记持续60tick
      const markDmgBonus=1+(best._magicMark||0)*0.05; // 每层+5%伤害
      dealDmg(best,t.dmg*baseDmgMult*markDmgBonus,owner,t);
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:'#74b9ff',life:150,btype:'ice',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
      if(skillReady){
        // 蓝满：法术解除——范围由品质决定，对范围内所有怪施加"法术解除"
        // 效果：护甲层数清零 + 持续减速，同时激活全场"破防增伤"状态
        const shieldRarityR={n:70,r:90,sr:110,ssr:99999};
        const shieldUltR=shieldRarityR[t.rarity||'n'];
        pushFx('burst',t.x,t.y,{color:'#74b9ff',radius:Math.min(shieldUltR,140)});
        self.postMessage({type:'sfx',sfx:'levelUp'}); pushSkillUlt(t,'法术解除',t.x,t.y);
        let dispelCount=0;
        for(const e of enemiesInRange(t.x,t.y,shieldUltR)){
          if(e.dead) continue;
          // 法术解除：清除护甲/护盾buff，施加"裸露"状态
          e._armorShred=0; e._armorShredTick=0; // 重置破甲（让破甲系从头累积，更快触发）
          e._magicMark=Math.max(e._magicMark||0,3); // 直接叠到3层标记
          e._magicMarkTick=120;
          e.slow=Math.min(0.30,(e.slow||1)*0.55);
          e.slowTick=Math.max(e.slowTick||0,80);
          if(e.shield&&e.shield>0){ e.shield=0; } // 清除怪物护盾
          dealDmg(e,t.dmg*baseDmgMult*0.7,owner,t);
          dispelCount++;
        }
        // 💥 核心效果：激活全场"破防增伤"——所有塔对已标记敌人伤害+20%，持续5秒(250tick)
        const rp3=S.players[t.owner]; if(rp3) rp3._shieldUltActive=250;
        self.postMessage({type:'sfx',sfx:'levelUp'});
      }
    }
    // 默认兜底
    if(!skillFired){
      dealDmg(best,t.dmg*baseDmgMult,owner,t);
      S.bullets.push({uid:S.uid++,x:t.x,y:t.y,tx:best.x,ty:best.y,color:t.color,life:130,btype:'normal',size:4,cid:t.id,rarity:t.rarity||'n',stars:t.stars||0,syns:t.syns||[]});
    }

    // ── 破甲 tick 归位 ───────────────────────────────
    for(const e of S.enemies){
      if(e.dead) continue;
      if((e._armorShredTick||0)>0){ e._armorShredTick--; if(e._armorShredTick<=0) e._armorShred=0; }
      if((e._markedTick||0)>0){ e._markedTick--; if(e._markedTick<=0) e._marked=0; }
      else if((e._marked||0)>0){ e._markedTick=90; }
    }
  } // end for towers

  // ── 玩家级Buff衰减（_shieldUltActive 破防增伤）──
  for(const p of Object.values(S.players)){
    if((p._shieldUltActive||0)>0) p._shieldUltActive--;
  }

  // ── 塔临时Buff衰减 tick ──
  // _natureBuff(攻速加成) / _holyBlessing已废弃
  for(const p of Object.values(S.players)){
    for(const tt of p.towers){
      const buffKeys=['_natureBuff'];
      for(const bk of buffKeys){
        const tk=bk+'_tick';
        if((tt[tk]||0)>0){
          tt[tk]--;
          if(tt[tk]<=0){ tt[bk]=0; tt[tk]=0; }
        }
      }
    }
  }

  // ── DOT / Slow / Debuff tick（独立于攻击循环）──
  for(const e of S.enemies){
    if(e.dead)continue;
    if(e.dot&&e.dot.tick>0){
      e.dot.tick--;
      if(e.dot.tick%3===0){
        const dotOwner=S.players[e.dot.owner];
        if(dotOwner) dealDmg(e,e.dot.dmg,dotOwner);
        if(!e.dead) pushFx('dot',e.x,e.y,{color:'#ffb3d9'});
      }
    }
    if(e.slowTick>0){
      e.slowTick--;
      if(e.slowTick<=0) e.slow=1;
    } else { e.slow=1; }
    if(e.debuff&&e.debuff.tick>0) e.debuff.tick--;
  }

  // 子弹
  S.bullets=S.bullets.filter(b=>{
    b.life-=TPS;
    const dd=dist(b.x,b.y,b.tx,b.ty);
    if(dd<4)return false;
    const sp=280*(TPS/1000);
    b.x+=((b.tx-b.x)/dd)*Math.min(sp,dd);
    b.y+=((b.ty-b.y)/dd)*Math.min(sp,dd);
    return b.life>0;
  });

  S.enemies=S.enemies.filter(e=>!e.dead);

  // 刷怪
  for(let li=0;li<S.laneQueues.length;li++){
    const sq=S.laneQueues[li];
    if(!sq.length)continue;
    sq[0].t-=TPS;
    if(sq[0].t<=0){
      const dd=sq.shift().d;
      // S.paths[li] 现在是描述符 {path, pxOff, laneIdx, subIdx}
      const desc=S.paths[li];
      const pathArr=desc.path||desc; // 兼容旧格式
      const pxOff=desc.pxOff||0;
      const p0=pathArr[0];
      // 根据路段走向决定侧向偏移方向（水平路段偏y，垂直路段偏x）
      const p1=pathArr[1]||p0;
      const isHoriz=(p1.y===p0.y);
      const ox=isHoriz?0:pxOff, oy=isHoriz?pxOff:0;
      S.enemies.push({
        uid:S.uid++,
        x:p0.x*S.ts+S.ts/2+ox,
        y:p0.y*S.ts+S.ts/2+oy,
        hp:dd.hp,maxHp:dd.hp,speed:dd.speed,reward:dd.reward,
        color:dd.color,r:dd.r,boss:dd.boss||false,
        eid:dd.id||'',name:dd.name||'',
        grade:dd.grade||'normal',
        expReward:dd.expReward||Math.round((dd.reward||0)*1.2),
        skillDef:dd.skill||null,
        skillState:{cd:0},
        _baseSpeed:dd.speed,
        pi:1,slow:1,dead:false,
        laneIdx:li,
        pxOff,   // 保存侧向偏移，移动时一直附加
        isHorizStart:isHoriz
      });
    }
  }

  // 波次结束
  const allEmpty=S.laneQueues.every(q=>q.length===0);
  if(S.waveRunning&&allEmpty&&S.enemies.length===0){
    S.waveRunning=false; S.waveComplete=true;
    for(const p of Object.values(S.players)){
      p.gold+=30;
      p.pendingTali=true; // 标记可选符咒
    }
  }

  if(!S.waveRunning&&S.enemies.length===0&&S.wave>S.totalWaves)S.victory=true;

  // 发送经验增量
  for(const p of Object.values(S.players)){
    if(p.pendingExp&&p.pendingExp.length>0){
      self.postMessage({type:'expGain',pid:p.id,gains:p.pendingExp});
      p.pendingExp=[];
    }
  }

  // 每10帧发送一次日志（如果有）
  if(_gameLog.length>0&&S._tickCount%10===0){
    self.postMessage({type:'gameLog',logs:_gameLog.splice(0)});
  }
  S._tickCount=(S._tickCount||0)+1;
  self.postMessage({type:'snap',d:mkSnap()});
}

self.onmessage=function(ev){
  const{type,d}=ev.data;

  // ── init ──────────────────────────────────────────────
  if(type==='init'){
    // ── 用主线程传来的 charSynMap 重建 SYN_DEF.chars，保证数据一致性 ──
    if(d.charSynMap){
      for(const syn of SYN_DEF) syn.chars=[];
      for(const [cid, syns] of Object.entries(d.charSynMap)){
        for(const synId of syns){
          const syn=SYN_DEF.find(s=>s.id===synId);
          if(syn && !syn.chars.includes(cid)) syn.chars.push(cid);
        }
      }
    }
    const rd=d.resumeData; // 存档恢复数据（可为 null）
    const players={};
    for(const p of d.players){
      const rp=rd&&rd.players&&rd.players[p.id];
      players[p.id]={
        id:p.id, laneIdx:p.laneIdx,
        gold: rp?rp.gold:300,
        hp:   rp?rp.hp:20,
        score:rp?rp.score:0,
        slotLimit: rp?rp.slotLimit:4,
        towers:[], towerBases:{},
        taliSpd:0,taliDmg:0,taliRng:0,taliGld:0,
        synergyBufs:{spd:0,dmg:0,rng:0,gld:0,slow:0},
        activeSynergies:[],
        confirmedWave:rd?rd.wave:1,
        pendingTali:false,
        tali: rp?rp.tali:[]
      };
      // 恢复已部署的塔（uid 在后面统一修正，这里暂存原始 uid）
      if(rp&&rp.towers&&rp.towers.length>0){
        for(const st of rp.towers){
          const tw={...st};  // 保留原始 uid（后面统一修正）
          players[p.id].towers.push(tw);
          players[p.id].towerBases[tw.uid||0]={dmg:tw.dmg,range:tw.range,rate:tw.rate};
        }
      }
    }
    const startWave=rd?rd.wave:1;
    S={tick:0,wave:startWave,players,
      paths:d.paths,ts:d.ts,totalWaves:d.totalWaves,
      endless:!!d.endless, blitz:!!d.blitz,
      enemies:[],bullets:[],
      laneQueues:d.paths.map(()=>[]),
      waveRunning:false,waveComplete:false,gameOver:false,victory:false,
      uid: rd?99999:1};  // 存档恢复时 uid 从高值开始避免冲突
    // 修正各塔 uid
    if(rd){
      let maxUid=99999;
      for(const pid of Object.keys(players)){
        for(const t of players[pid].towers){
          if(!t.uid){ t.uid=maxUid++; }
          players[pid].towerBases[t.uid]={dmg:t.dmg,range:t.range,rate:t.rate};
        }
      }
      S.uid=maxUid;
    }
    if(iv)clearInterval(iv);
    iv=setInterval(tick,TPS);
    self.postMessage({type:'ready'});
  }

  // ── 放塔（权威校验）────────────────────────────────────
  if(type==='tower'&&S){
    const p=S.players[d.pid];
    if(!p){
      self.postMessage({type:'towerDeny',pid:d.pid,reqId:d.reqId,
        reason:'玩家不存在',_returnCard:d._returnCard});
      return;
    }
    const tw=d.tower;
    const col=Math.floor(tw.x/S.ts), row=Math.floor(tw.y/S.ts);
    let occupied=false;
    for(const pp of Object.values(S.players)){
      if(pp.towers.some(t=>Math.floor(t.x/S.ts)===col&&Math.floor(t.y/S.ts)===row)){
        occupied=true; break;
      }
    }
    if(occupied){
      self.postMessage({type:'towerDeny',pid:d.pid,reqId:d.reqId,
        reason:'该格已被占用',_returnCard:d._returnCard});
      return;
    }
    // 人口上限检查
    const slotLimit = p.slotLimit || 4;
    if(p.towers.length >= slotLimit){
      self.postMessage({type:'towerDeny',pid:d.pid,reqId:d.reqId,
        reason:'人口已满（'+p.towers.length+'/'+slotLimit+'），请购买更多人口格！',_returnCard:d._returnCard});
      return;
    }
    // 记录基础属性（用于羁绊/符咒重算）
    const uid=S.uid++;
    // 蓝条初始化：maxMana 由羁绊系决定，普攻获 manaGain 点蓝
    const synTag=(tw.syns||[])[0]||'';
    // 每系蓝条容量：爆发系高（100），快攻系低（60）
    const MANA_CFG={
      swift:60, cannon:80, crit:70, element:90, shadow:75,
      ranger:65, warrior:55, dragon:85, undead:80, arcane:100,
      mech:95, holy:80, tank:50, nature:85, shield:90
    };
    const maxMana=MANA_CFG[synTag]||80;
    const newTower={...tw, uid, cd:0, owner:d.pid, mana:0, maxMana, _manaGain:18,
      stars:tw.charStars||tw.stars||0};
    p.towers.push(newTower);
    p.towerBases[uid]={range:tw.range, rate:tw.rate, dmg:tw.dmg};
    // 重算羁绊 buff（每次有新塔入场都重算）
    recomputeTowers(p);
    self.postMessage({type:'towerOk',pid:d.pid,reqId:d.reqId});
  }

  // ── 收回场上的塔（退还一张卡到背包）────────────────────────
  if(type==='removeTower'&&S){
    const p=S.players[d.pid];
    if(p){
      const uidNum=Number(d.uid);
      const idx=p.towers.findIndex(t=>t.uid===uidNum);
      if(idx!==-1){
        const removed=p.towers.splice(idx,1)[0];
        delete p.towerBases[removed.uid];
        recomputeTowers(p);
        // 同时把 uid 也回传，方便客户端精确匹配
        self.postMessage({type:'towerRemoved',pid:d.pid,charId:removed.id,uid:removed.uid});
      }
    }
  }

  // ── 静默移除塔（升星消耗，不退卡）────────────────────────
  if(type==='removeTowerSilent'&&S){
    const p=S.players[d.pid];
    if(p){
      const idx=p.towers.findIndex(t=>t.uid==d.uid);
      if(idx!==-1){
        const removed=p.towers.splice(idx,1)[0];
        delete p.towerBases[removed.uid];
        recomputeTowers(p);
        // 不发 towerRemoved，只通知渲染更新
        self.postMessage({type:'towerRemovedSilent',pid:d.pid,uid:removed.uid});
      }
    }
  }

  // ── 发动波次（权威）──────────────────────────────────────
  if(type==='wave'&&S&&!S.waveRunning){
    const laneCount=S.paths.length; // playerCount*3 条路
    const SUBS=3;
    const playerLanes=Math.max(1,Math.floor(laneCount/SUBS));
    const normalEg=d.wg.filter(g=>!(d.em[g.id]&&d.em[g.id].boss));
    const bossEg  =d.wg.filter(g=>d.em[g.id]&&d.em[g.id].boss);

    // ── 单一全局出怪队列（每个玩家各一条）──
    // 不分多个子队列，只用一个计时器：每隔 SPAWN_IV ms 出一只
    // 出完为止，3条子路只决定怪物视觉排列（laneIdx 轮转）
    const SPAWN_IV = 200; // 每只怪间隔 200ms，每秒 5 只
    S.laneQueues = S.paths.map(()=>[]); // 保留结构，只用 sub=0 的队列

    for(let pl=0;pl<playerLanes;pl++){
      // 把所有普通怪展开成一个扁平列表
      const flatMonsters=[];
      for(const g of normalEg){
        const def=d.em[g.id]; if(!def) continue;
        for(let i=0;i<g.n;i++) flatMonsters.push({def,isBoss:false});
      }
      for(const g of bossEg){
        const def=d.em[g.id]; if(!def) continue;
        for(let i=0;i<g.n;i++) flatMonsters.push({def,isBoss:true});
      }

      // 按固定间隔依次入队，round-robin 分配到3条子路（仅视觉分流）
      let delay=200; // 第一只等 200ms 出
      for(let mi=0;mi<flatMonsters.length;mi++){
        const m=flatMonsters[mi];
        const subLi=pl*SUBS+(mi%SUBS);
        if(subLi>=laneCount) continue;
        // Boss 用较大间隔
        const iv=m.isBoss?2000:SPAWN_IV;
        S.laneQueues[subLi].push({t:delay, d:m.def});
        delay+=iv;
      }
    }

    // 每条子队列各自排序（round-robin 分配后已基本有序，sort 保险）
    for(const q of S.laneQueues) q.sort((a,b)=>a.t-b.t);

    // 转换为相对延迟（t 从绝对时间 → 距上一只的等待ms）
    // 这样 tick 里 sq[0].t -= TPS 才能正确倒计时
    for(const q of S.laneQueues){
      for(let i=q.length-1;i>0;i--) q[i].t=q[i].t-q[i-1].t;
    }

    // 计算本波总出怪时长（各队列延迟之和最大值）
    let maxT=0;
    for(const q of S.laneQueues){
      let sum=0; for(const e of q) sum+=e.t;
      maxT=Math.max(maxT,sum);
    }

    S.waveRunning=true; S.waveComplete=false;
    for(const p of Object.values(S.players)) p.confirmedWave=S.wave;
    S.wave++;
    self.postMessage({type:'waveStarted',wave:S.wave-1,spawnDuration:maxT});
  }

  // ── 抽卡（权威扣金币，返回结果）─────────────────────────
  if(type==='gacha'&&S){
    const p=S.players[d.pid];
    if(!p){self.postMessage({type:'gachaResult',pid:d.pid,ok:false,reason:'玩家不存在'});return;}

    // 品质分级费用
    const TIER_COSTS={n:{c1:40,c5:180},r:{c1:80,c5:350},sr:{c1:160,c5:700},ssr:{c1:320,c5:1400}};
    const tierId=d.tierId||'r'; // 默认精英
    const tc=TIER_COSTS[tierId]||TIER_COSTS.r;
    const cost=d.n===1?tc.c1:tc.c5;

    if(p.gold<cost){
      self.postMessage({type:'gachaResult',pid:d.pid,ok:false,reason:'金币不足！需要'+cost+'金'});
      return;
    }
    p.gold-=cost;

    // 按品质分组的角色池（每组前3个是N，4-6是R，7-9是SR，10-12是SSR）
    const POOLS={
      n: ['c1001','c1002','c1003','c2001','c2002','c2003','c3001','c3002','c3003','c4001','c4002','c4003','c5001','c5002','c5003','c6001','c6002','c6003','c7001','c7002','c7003','c8001','c8002','c8003','c9001','c9002','c9003','c10001','c10002','c10003','c11001','c11002','c11003','c12001','c12002','c12003','c13001','c13002','c13003','c14001','c14002','c14003','c15001','c15002','c15003'],
      r: ['c1004','c1005','c1006','c2004','c2005','c2006','c3004','c3005','c3006','c4004','c4005','c4006','c5004','c5005','c5006','c6004','c6005','c6006','c7004','c7005','c7006','c8004','c8005','c8006','c9004','c9005','c9006','c10004','c10005','c10006','c11004','c11005','c11006','c12004','c12005','c12006','c13004','c13005','c13006','c14004','c14005','c14006','c15004','c15005','c15006'],
      sr:['c1007','c1008','c1009','c2007','c2008','c2009','c3007','c3008','c3009','c4007','c4008','c4009','c5007','c5008','c5009','c6007','c6008','c6009','c7007','c7008','c7009','c8007','c8008','c8009','c9007','c9008','c9009','c10007','c10008','c10009','c11007','c11008','c11009','c12007','c12008','c12009','c13007','c13008','c13009','c14007','c14008','c14009','c15007','c15008','c15009'],
      ssr:['c1010','c1011','c1012','c2010','c2011','c2012','c3010','c3011','c3012','c4010','c4011','c4012','c5010','c5011','c5012','c6010','c6011','c6012','c7010','c7011','c7012','c8010','c8011','c8012','c9010','c9011','c9012','c10010','c10011','c10012','c11010','c11011','c11012','c12010','c12011','c12012','c13010','c13011','c13012','c14010','c14011','c14012','c15010','c15011','c15012'],
    };
    // 品质概率（根据 tierId）
    const TIER_RATES={
      n:  {n:0.70,r:0.20,sr:0.08,ssr:0.02},
      r:  {n:0.30,r:0.45,sr:0.20,ssr:0.05},
      sr: {n:0.05,r:0.25,sr:0.50,ssr:0.20},
      ssr:{n:0.00,r:0.10,sr:0.40,ssr:0.50},
    };
    const rates=TIER_RATES[tierId]||TIER_RATES.r;

    function pickRarity(){
      const r=Math.random();
      if(r<rates.ssr) return 'ssr';
      if(r<rates.ssr+rates.sr) return 'sr';
      if(r<rates.ssr+rates.sr+rates.r) return 'r';
      return 'n';
    }
    function pickFromPool(rar){
      const pool=POOLS[rar];
      return pool[Math.floor(Math.random()*pool.length)];
    }
    const got=[];
    for(let i=0;i<d.n;i++){
      const rar=pickRarity();
      got.push(pickFromPool(rar));
    }
    self.postMessage({type:'gachaResult',pid:d.pid,ok:true,got,gold:p.gold});
  }

  // ── 购买人口格 ───────────────────────────────────────────
  // ── 出售塔：增加金币 ─────────────────────────────────
  if(type==='addGold'&&S&&d){
    const p=S.players[d.pid];
    if(p) p.gold+=d.amount||0;
    return;
  }

  if(type==='buySlot'&&S&&d){
    const p=S.players[d.pid];
    if(!p) return;
    const cur = p.slotLimit || 4;
    const MAX_SLOT = 10;
    if(cur >= MAX_SLOT){
      self.postMessage({type:'buySlotResult',pid:d.pid,ok:false,reason:'人口已达上限 '+MAX_SLOT+' 格'});
      return;
    }
    // 递增购价：5→500, 6→900, 7→1500, 8→2300, 9→3300, 10→4500
    const SLOT_COSTS=[0,0,0,0,0, 500,900,1500,2300,3300,4500];
    const cost = SLOT_COSTS[cur+1] || 4500;
    if(p.gold < cost){
      self.postMessage({type:'buySlotResult',pid:d.pid,ok:false,reason:'金币不足！需要 '+cost+' 金（当前 '+Math.floor(p.gold)+'）'});
      return;
    }
    p.gold -= cost;
    p.slotLimit = cur + 1;
    self.postMessage({type:'buySlotResult',pid:d.pid,ok:true,slotLimit:p.slotLimit,gold:p.gold,cost});
  }

  // ── 装备购买扣金（type:'spendGold', d:{pid,amount}）──────
  if(type==='spendGold'&&S&&d){
    const p=S.players[d.pid];
    if(p&&(d.amount||0)>0&&p.gold>=(d.amount)){
      p.gold-=d.amount;
    }
  }

  // ── 装备加成同步（type:'updateEquipBonuses', d:{pid, bonuses:{[towerUid]:{dmg,rng,spd,gld}}}）──
  if(type==='updateEquipBonuses'&&S&&d){
    const p=S.players[d.pid];
    if(!p) return;
    // 保存装备加成映射，供 recomputeTowers 使用
    p.equipBonuses = d.bonuses||{};
    // 将装备加成融合进每个塔的 base，然后重算
    for(const t of p.towers){
      const base=p.towerBases[t.uid];
      if(!base) continue;
      const eb=p.equipBonuses[t.uid]||{};
      // 重算 range / rate（含装备加成）
      t.range = base.range * (1+p.taliRng) * (1+(p.synergyBufs&&p.synergyBufs.rng||0)) * (1+(eb.rng||0));
      t.rate  = base.rate  * (1+p.taliSpd) * (1+(p.synergyBufs&&p.synergyBufs.spd||0)) * (1+(eb.spd||0));
      // dmg 装备加成存入塔对象（攻击时 baseDmgMult 只含 tali+syn，此处直接更新 t.dmg）
      t.dmg   = Math.round(base.dmg * (1+(eb.dmg||0)));
    }
  }

  // ── 符咒（权威校验：必须是波次刚结束状态）────────────────
  if(type==='tali'&&S&&d){
    const p=S.players[d.pid];
    if(!p)return;
    if(!p.pendingTali)return; // 防止重复选或乱发
    p.pendingTali=false;
    const t=d.tali;
    if(t.fx==='spd'){p.taliSpd=(p.taliSpd||0)+t.v; recomputeTowers(p);}
    if(t.fx==='dmg') p.taliDmg=(p.taliDmg||0)+t.v;
    if(t.fx==='gld') p.taliGld=(p.taliGld||0)+t.v;
    if(t.fx==='rep') p.hp=Math.min(p.hp+t.v,20);
    if(t.fx==='rng'){p.taliRng=(p.taliRng||0)+t.v; recomputeTowers(p);}
    // ── 羁绊专属符咒（syn）──
    if(t.fx==='syn'&&t.synTarget&&t.bonuses){
      if(!p.synTali) p.synTali={};
      if(!p.synTali[t.synTarget]) p.synTali[t.synTarget]={};
      const cur=p.synTali[t.synTarget];
      const bn=t.bonuses;
      // 叠加各项 bonus（累加）
      for(const[k,v] of Object.entries(bn)){
        if(k==='manaGain') cur[k]=(cur[k]||1)*v;       // 乘法（充能倍率）
        else if(typeof v==='number') cur[k]=(cur[k]||0)+v; // 加法
        else cur[k]=v;
      }
      // manaGain 类咒立刻更新塔的充能速率
      if(bn.manaGain){
        for(const tt of p.towers){
          if((tt.syns||[]).includes(t.synTarget)) tt._manaGain=Math.round(18*(cur.manaGain||1));
        }
      }
      self.postMessage({type:'synTaliApplied',pid:d.pid,synTarget:t.synTarget,bonuses:cur});
    }
    // ── 觉醒多重符咒（multi）──
    if(t.fx==='multi'&&t.bonuses){
      if(t.bonuses.spd){p.taliSpd=(p.taliSpd||0)+t.bonuses.spd; recomputeTowers(p);}
      if(t.bonuses.dmg) p.taliDmg=(p.taliDmg||0)+t.bonuses.dmg;
      if(t.bonuses.rng){p.taliRng=(p.taliRng||0)+t.bonuses.rng; recomputeTowers(p);}
    }
    self.postMessage({type:'taliApplied',pid:d.pid,taliId:t.id,taliName:t.name});
  }

  // ── 角色升级/升星后同步场上塔属性 ────────────────────────
  if(type==='upgradeChar'&&S&&d){
    const p=S.players[d.pid];
    if(p){
      p.towers.forEach(t=>{
        if(t.id===d.charId){
          t.dmg=d.newDmg;
          t.charLv=d.charLv;
          t.charStars=d.charStars;
          t.stars=d.charStars;   // 统一字段，mkSnap 读 t.stars
          t.skillLv=d.skillLv;
          if(p.towerBases[t.uid]) p.towerBases[t.uid].dmg=d.newDmg;
        }
      });
    }
  }

  if(type==='stop'){if(iv){clearInterval(iv);iv=null;}}
};
`;

// ════════════════════════════════════════════════════════
// 三、Canvas 渲染器
// ════════════════════════════════════════════════════════
class Renderer {
  constructor(canvas){
    this.c=canvas; this.ctx=canvas.getContext('2d');
    this.prev=null; this.cur=null; this.alpha=1;
    this.selTile=null; this.pathSets=[]; this.map=null; this.myPid=null;
    // 相机状态
    this.cam={x:0, y:0, scale:1};
    this._drag={on:false, sx:0, sy:0, cx:0, cy:0};
    this._bindCamera();
    // canvas 响应容器大小
    this._ro=new ResizeObserver(()=>this._resize());
    this._ro.observe(canvas.parentElement||document.body);
    // ── 粒子特效池 ──
    this.particles=[];  // 每个粒子: {type,x,y,life,maxLife,...属性}
    this.beams=[];      // 持续光束: {x1,y1,x2,y2,color,life,maxLife}
    this.rings=[];      // 扩散圆环: {x,y,r,maxR,color,life,maxLife}
    this.lasers=[];     // 激光线: {x1,y1,x2,y2,color,life,maxLife,w}
    this.labels=[];     // 伤害数字: {x,y,text,color,life,maxLife,vy}
  }
  _resize(){
    const c=this.c;
    const dpr=window.devicePixelRatio||1;
    // 第一步：清除内联尺寸，让 flex 决定 canvas 的实际 CSS 尺寸
    c.style.width='';
    c.style.height='';
    // 第二步：读取 flex 分配的实际 CSS 尺寸
    const w=c.offsetWidth||800;
    const h=c.offsetHeight||600;
    // 第三步：设置物理像素分辨率，并用内联 style 锁住 CSS 尺寸，防止 canvas 被物理尺寸撑大
    c.width =Math.round(w*dpr);
    c.height=Math.round(h*dpr);
    c.style.width =w+'px';
    c.style.height=h+'px';
    this._cssW=w;
    this._cssH=h;
    this._dpr=dpr;
    this._hudH=42;
  }
  _bindCamera(){
    const c=this.c;
    // ── 键盘平移（WASD / 方向键），在 draw() 里每帧更新 ──
    this._keys={};
    this._keyHandler=(e)=>{
      // 只在 canvas 或 body 有焦点时响应，且不干扰输入框
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
      this._keys[e.code]=e.type==='keydown';
      // 方向键阻止页面滚动
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    };
    window.addEventListener('keydown', this._keyHandler);
    window.addEventListener('keyup',   this._keyHandler);

    // ── 滚轮缩放（保留）──
    c.addEventListener('wheel',e=>{
      e.preventDefault();
      const rect=c.getBoundingClientRect();
      const _z=typeof getZoom==='function'?getZoom():1;
      const mx=e.clientX/_z-rect.left, my=e.clientY/_z-rect.top;
      const factor=e.deltaY<0?1.1:1/1.1;
      const ns=Math.max(0.3,Math.min(3, this.cam.scale*factor));
      this.cam.x=mx-(mx-this.cam.x)*(ns/this.cam.scale);
      this.cam.y=my-(my-this.cam.y)*(ns/this.cam.scale);
      this.cam.scale=ns;
    },{passive:false});

    // ── 右键：取消手牌选中 ──
    c.addEventListener('contextmenu',e=>{
      e.preventDefault();
      if(this.onRightClick) this.onRightClick();
    });
  }

  // 每帧调用：根据按键状态平移镜头
  _tickCamera(dt){
    const spd=300/this.cam.scale; // 世界速度，缩放越小移越快
    const ms=dt/1000*spd;
    const k=this._keys||{};
    if(k['ArrowLeft'] ||k['KeyA']) this.cam.x+=ms;
    if(k['ArrowRight']||k['KeyD']) this.cam.x-=ms;
    if(k['ArrowUp']   ||k['KeyW']) this.cam.y+=ms;
    if(k['ArrowDown'] ||k['KeyS']) this.cam.y-=ms;
  }

  // 销毁时移除键盘监听
  destroyCamera(){
    if(this._keyHandler){
      window.removeEventListener('keydown',this._keyHandler);
      window.removeEventListener('keyup',  this._keyHandler);
    }
  }

  // 屏幕 CSS 坐标 → 世界坐标
  screenToWorld(sx,sy){
    return {
      x:(sx-this.cam.x)/this.cam.scale,
      y:(sy-this.cam.y)/this.cam.scale
    };
  }

  setMap(m, laneCount){
    this.map=m;
    this.laneCount=laneCount;
    // 用 buildFullPath 生成完整路径后再转 tiles，保证汇入点不遗漏
    this.pathSets=[];
    for(let li=0;li<laneCount;li++){
      this.pathSets.push(pathToTiles(buildFullPath(li)));
    }
    // trunk 单独一条（用于着色区分）
    this.trunkTiles=pathToTiles(m.trunk);
    // 合并全部路径格子供放塔碰撞检测
    this.allPathTiles=new Set();
    for(const ps of this.pathSets) for(const k of ps) this.allPathTiles.add(k);
    // 也把 trunk 加入（其实已在各 lane 完整路径里了，但保险起见）
    for(const k of this.trunkTiles) this.allPathTiles.add(k);
    this._resize();
    this._fitMap();
  }
  // 让地图完整显示在视口中
  _fitMap(){
    if(!this.map)return;
    const {cols,rows,ts}=this.map;
    const W=cols*ts, H=rows*ts;
    // 用 _resize 时保存的真实 CSS 尺寸（_resize 已清除内联style再读offsetWidth）
    const vw=this._cssW||this.c.offsetWidth||800;
    const vh=this._cssH||this.c.offsetHeight||600;
    const hudH=this._hudH||42;
    const avH=vh-hudH;
    // 初始视野：显示整张地图的 50%，让玩家自己拖动探索
    const sFit=Math.min(vw/W, avH/H);
    const s=sFit*0.50;
    this.cam.scale=s;
    // 默认从左上区域开始（玩家1出生位置附近）
    this.cam.x=40;
    this.cam.y=hudH+40;
  }
  push(snap){
    this.prev=this.cur;this.cur=snap;this.alpha=0;
    if(snap.fx&&snap.fx.length) this.processFx(snap.fx);
  }
  draw(dt){
    if(!this.cur||!this.map)return;
    this._tickCamera(dt);   // 键盘平移
    this.alpha=Math.min(1,(this.alpha||0)+dt/TPS_MS);
    const a=this.alpha,ctx=this.ctx,{cols,rows,ts}=this.map;
    const W=cols*ts, H=rows*ts;
    const dpr=this._dpr||1;
    const cw=this.c.width, ch=this.c.height;

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);

    // ══════════════════════════════════════════════════
    // 1. 天空背景（黎明感渐变）
    // ══════════════════════════════════════════════════
    const T=Date.now()/1000;
    const bgGrad=ctx.createLinearGradient(0,0,0,ch);
    bgGrad.addColorStop(0,'#1a1a3e');
    bgGrad.addColorStop(0.35,'#2d1b5e');
    bgGrad.addColorStop(0.65,'#5c3068');
    bgGrad.addColorStop(1,'#8b4060');
    ctx.fillStyle=bgGrad; ctx.fillRect(0,0,cw,ch);

    // ── 星星 ──
    if(!this._stars){
      this._stars=[];
      for(let i=0;i<120;i++){
        this._stars.push({
          x:Math.random()*cw, y:Math.random()*ch*0.6,
          r:Math.random()*1.5+0.3,
          speed:Math.random()*3+1,
          phase:Math.random()*Math.PI*2
        });
      }
    }
    for(const s of this._stars){
      const alpha=0.4+0.5*Math.sin(T*s.speed+s.phase);
      ctx.fillStyle=`rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }

    // ── 月亮 ──
    {
      const mx=cw*0.82, my=ch*0.12;
      const moonGrad=ctx.createRadialGradient(mx-4,my-4,2,mx,my,22);
      moonGrad.addColorStop(0,'#fffde0');
      moonGrad.addColorStop(0.6,'#f5e6a0');
      moonGrad.addColorStop(1,'rgba(245,230,160,0)');
      // 月晕
      ctx.fillStyle='rgba(255,240,180,0.08)';
      ctx.beginPath(); ctx.arc(mx,my,38,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=moonGrad;
      ctx.beginPath(); ctx.arc(mx,my,22,0,Math.PI*2); ctx.fill();
      // 月牙阴影
      ctx.fillStyle='rgba(40,20,80,0.55)';
      ctx.beginPath(); ctx.arc(mx+8,my-5,18,0,Math.PI*2); ctx.fill();
    }

    // ── 远山剪影 ──
    {
      ctx.fillStyle='rgba(30,15,60,0.7)';
      ctx.beginPath(); ctx.moveTo(0,ch*0.55);
      const mPts=[0,0.55,0.08,0.38,0.16,0.48,0.24,0.32,0.32,0.44,0.4,0.29,0.5,0.42,0.58,0.27,0.66,0.4,0.74,0.31,0.82,0.43,0.9,0.35,1,0.5,1,1,0,1];
      for(let i=0;i<mPts.length;i+=2) ctx.lineTo(mPts[i]*cw,mPts[i+1]*ch);
      ctx.closePath(); ctx.fill();
      // 第二层山（近景）
      ctx.fillStyle='rgba(45,20,70,0.8)';
      ctx.beginPath(); ctx.moveTo(0,ch*0.65);
      const m2=[0,0.65,0.1,0.52,0.2,0.62,0.3,0.47,0.42,0.6,0.54,0.44,0.64,0.56,0.76,0.46,0.87,0.58,1,0.5,1,1,0,1];
      for(let i=0;i<m2.length;i+=2) ctx.lineTo(m2[i]*cw,m2[i+1]*ch);
      ctx.closePath(); ctx.fill();
    }

    // ── 云朵 ──
    if(!this._clouds){
      this._clouds=[
        {x:cw*0.1, y:ch*0.18, s:1.0, sp:6},
        {x:cw*0.45,y:ch*0.12, s:0.75,sp:9},
        {x:cw*0.72,y:ch*0.22, s:1.2, sp:7},
        {x:cw*0.9, y:ch*0.08, s:0.6, sp:11},
      ];
    }
    const drawCloud=(cx2,cy2,s)=>{
      ctx.fillStyle='rgba(255,255,255,0.07)';
      [[0,0,22],[18,4,16],[-18,4,16],[8,-10,14],[-8,-10,12]].forEach(([dx,dy,r])=>{
        ctx.beginPath(); ctx.arc(cx2+dx*s,cy2+dy*s,r*s,0,Math.PI*2); ctx.fill();
      });
    };
    for(const cl of this._clouds){
      cl.x+=dt*(1000/cl.sp)*0.001;
      if(cl.x>cw+80) cl.x=-80;
      drawCloud(cl.x,cl.y,cl.s);
    }

    // 应用相机变换（dpr 补偿 + cam offset + cam scale）
    ctx.setTransform(
      this.cam.scale*dpr, 0,
      0, this.cam.scale*dpr,
      this.cam.x*dpr, this.cam.y*dpr
    );

    // ── 预计算地形 Set（仅在 map 变化时重建）──
    if(!this._decoCache||this._decoCache.map!==this.map){
      const d=this.map.deco||{};
      this._decoCache={
        map:this.map,
        water: new Set((d.water||[]).map(p=>p.x+','+p.y)),
        forest:new Set((d.forest||[]).map(p=>p.x+','+p.y)),
        stone: new Set((d.stone||[]).map(p=>p.x+','+p.y)),
      };
    }
    const DC=this._decoCache;

    // ══════════════════════════════════════════════════
    // 2. 地图格子绘制（奇幻森林风）
    // ══════════════════════════════════════════════════
    const lanePlayerColors=['#f9a825','#7c4dff','#00bcd4','#e91e63'];
    const laneRoadColors  =['#5d4037','#4a148c','#006064','#880e4f'];

    // 圆角矩形辅助（兼容旧版 Canvas）
    const roundRect=(x,y,w,h,r2)=>{
      ctx.beginPath();
      ctx.moveTo(x+r2,y);
      ctx.lineTo(x+w-r2,y); ctx.arcTo(x+w,y,x+w,y+r2,r2);
      ctx.lineTo(x+w,y+h-r2); ctx.arcTo(x+w,y+h,x+w-r2,y+h,r2);
      ctx.lineTo(x+r2,y+h); ctx.arcTo(x,y+h,x,y+h-r2,r2);
      ctx.lineTo(x,y+r2); ctx.arcTo(x,y,x+r2,y,r2);
      ctx.closePath();
    };

    // 随机种子装饰缓存（每次 map 变化重建）
    if(!this._mapDeco||this._mapDeco.map!==this.map){
      const seed=(c,r,salt)=>((c*73856093^r*19349663^salt*83492791)>>>0)/0xffffffff;
      const dArr=[];
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const k=c+','+r;
          const isW=DC.water.has(k), isF=DC.forest.has(k), isS=DC.stone.has(k);
          const isBase=!isW&&!isF&&!isS;
          let decoType=null;
          if(isF){
            // 森林：树/蘑菇/灌木
            const t=seed(c,r,1);
            decoType=t<0.5?'tree':t<0.75?'bush':t<0.88?'mushroom':'flower';
          } else if(isS){
            const t=seed(c,r,2);
            decoType=t<0.4?'rock1':t<0.7?'rock2':'crack';
          } else if(isBase){
            const t=seed(c,r,3);
            if(t<0.06) decoType='grass_tall';
            else if(t<0.11) decoType='flower_s';
            else if(t<0.14) decoType='pebble';
          }
          dArr.push({c,r,decoType,
            ox:(seed(c,r,4)-0.5)*ts*0.3,
            oy:(seed(c,r,5)-0.5)*ts*0.3,
            sc:0.7+seed(c,r,6)*0.6,
            rot:(seed(c,r,7)*Math.PI*2)
          });
        }
      }
      this._mapDeco={map:this.map, arr:dArr};
    }
    const decoArr=this._mapDeco.arr;

    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const k=c+','+r;
        const cx=c*ts, cy=r*ts;

        // ── 地形底色 ──
        if(DC.water.has(k)){
          // 水面：深蓝紫渐变
          const wg=ctx.createLinearGradient(cx,cy,cx+ts,cy+ts);
          wg.addColorStop(0,'#1a1060');
          wg.addColorStop(0.5,'#1e1878');
          wg.addColorStop(1,'#130d50');
          ctx.fillStyle=wg; ctx.fillRect(cx,cy,ts,ts);
          // 波光动画
          ctx.save();
          ctx.globalAlpha=0.22;
          ctx.strokeStyle='#88aaff';
          ctx.lineWidth=1;
          for(let wi=0;wi<3;wi++){
            const wy=cy+5+wi*10+((T*18+c*3.7)%10);
            ctx.beginPath();
            ctx.moveTo(cx+2,wy);
            ctx.bezierCurveTo(cx+ts*0.25,wy-3,cx+ts*0.6,wy+3,cx+ts-2,wy);
            ctx.stroke();
          }
          // 水面反光粒子
          if((c*13+r*7)%4===0){
            const sparkX=cx+ts*0.3+Math.sin(T*2.1+c)*ts*0.2;
            const sparkY=cy+ts*0.4+Math.cos(T*1.7+r)*ts*0.15;
            ctx.fillStyle='rgba(180,210,255,0.5)';
            ctx.beginPath(); ctx.arc(sparkX,sparkY,1.5,0,Math.PI*2); ctx.fill();
          }
          ctx.restore();
        } else if(DC.forest.has(k)){
          // 森林：多层绿色
          const v=((c+r)%2===0)?0:12;
          ctx.fillStyle=`rgb(${22+v},${52+v},${18+v})`; ctx.fillRect(cx,cy,ts,ts);
          // 树冠阴影纹
          ctx.fillStyle='rgba(0,30,0,0.18)';
          ctx.beginPath(); ctx.arc(cx+ts*0.5,cy+ts*0.55,ts*0.38,0,Math.PI*2); ctx.fill();
        } else if(DC.stone.has(k)){
          // 石板：灰褐色纹
          const v=((c+r)%2===0)?0:8;
          ctx.fillStyle=`rgb(${55+v},${48+v},${42+v})`; ctx.fillRect(cx,cy,ts,ts);
          // 石板缝
          ctx.strokeStyle='rgba(20,15,10,0.35)'; ctx.lineWidth=0.7;
          ctx.beginPath();
          ctx.moveTo(cx,cy+ts*0.5); ctx.lineTo(cx+ts,cy+ts*0.5);
          ctx.moveTo(cx+ts*0.5,cy); ctx.lineTo(cx+ts*0.5,cy+ts);
          ctx.stroke();
        } else {
          // 草地：绿色渐变
          const v=((c+r)%2===0)?0:10;
          ctx.fillStyle=`rgb(${34+v},${68+v},${28+v})`; ctx.fillRect(cx,cy,ts,ts);
        }

        // ── 路径覆盖 ──
        let isPath=false;
        if(this.trunkTiles&&this.trunkTiles.has(k)){
          // 主干道：鹅卵石路
          const rg=ctx.createLinearGradient(cx,cy,cx+ts,cy+ts);
          rg.addColorStop(0,'#8d7b68'); rg.addColorStop(1,'#6d5d4e');
          ctx.fillStyle=rg; ctx.fillRect(cx,cy,ts,ts);
          // 路面卵石纹
          ctx.save();
          ctx.globalAlpha=0.35;
          for(let pi=0;pi<4;pi++){
            const px2=cx+5+((c*17+r*11+pi*23)%((ts-10)|1));
            const py2=cy+5+((c*11+r*19+pi*31)%((ts-10)|1));
            ctx.fillStyle=(pi%2===0)?'#b8a898':'#5a4a3a';
            ctx.beginPath(); ctx.ellipse(px2,py2,4,3,(pi*0.8),0,Math.PI*2); ctx.fill();
          }
          ctx.restore();
          // 路边缘暗纹
          ctx.strokeStyle='rgba(40,25,15,0.4)'; ctx.lineWidth=1.5;
          roundRect(cx+1,cy+1,ts-2,ts-2,3); ctx.stroke();
          isPath=true;
        } else {
          for(let li=0;li<this.pathSets.length;li++){
            if(this.pathSets[li]&&this.pathSets[li].has(k)){
              const pc=lanePlayerColors[li%lanePlayerColors.length];
              const rc=laneRoadColors[li%laneRoadColors.length];
              // 路面底色（土路风格）
              const rg2=ctx.createLinearGradient(cx,cy,cx+ts,cy+ts);
              rg2.addColorStop(0,rc+'ee'); rg2.addColorStop(1,rc+'aa');
              ctx.fillStyle=rg2; ctx.fillRect(cx,cy,ts,ts);
              // 土路纹理
              ctx.save(); ctx.globalAlpha=0.2;
              for(let pi=0;pi<3;pi++){
                const px2=cx+4+((c*19+r*13+pi*37)%((ts-8)|1));
                const py2=cy+4+((c*13+r*23+pi*41)%((ts-8)|1));
                ctx.fillStyle='rgba(0,0,0,0.5)';
                ctx.beginPath(); ctx.ellipse(px2,py2,3,2,(pi*1.1),0,Math.PI*2); ctx.fill();
              }
              ctx.restore();
              // 玩家色边框
              ctx.strokeStyle=pc+'88'; ctx.lineWidth=1.5;
              roundRect(cx+1,cy+1,ts-2,ts-2,3); ctx.stroke();
              // 玩家色侧光条
              ctx.fillStyle=pc+'33';
              ctx.fillRect(cx+1,cy+1,3,ts-2);
              isPath=true; break;
            }
          }
        }

        // ── 格子装饰物（预计算，emoji + canvas 图形混合）──
        const di=r*cols+c;
        const deco=decoArr[di];
        if(deco&&deco.decoType&&!isPath){
          ctx.save();
          ctx.textAlign='center'; ctx.textBaseline='middle';
          const dx=cx+ts/2+deco.ox, dy=cy+ts/2+deco.oy;
          ctx.translate(dx,dy);
          switch(deco.decoType){
            case 'tree':{
              // 手绘树：树干+树冠
              const fs=ts*0.3*deco.sc;
              // 树干
              ctx.fillStyle='#5d3a1a';
              ctx.fillRect(-fs*0.18,-fs*0.1,fs*0.35,fs*0.55);
              // 树冠（三层圆）
              [[0,-fs*0.55,fs*0.62,'#2d6a2d'],[0,-fs*0.75,fs*0.48,'#3a8a3a'],[0,-fs*0.9,fs*0.32,'#4db04d']].forEach(([tx,ty,tr,col])=>{
                ctx.fillStyle=col;
                ctx.beginPath(); ctx.arc(tx,ty,tr,0,Math.PI*2); ctx.fill();
              });
              // 高光
              ctx.fillStyle='rgba(180,255,120,0.2)';
              ctx.beginPath(); ctx.arc(-fs*0.15,-fs*0.85,fs*0.15,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'bush':{
              const fs=ts*0.22*deco.sc;
              [[-fs*0.4,0,fs*0.55,'#2e6b20'],[fs*0.35,-fs*0.1,fs*0.48,'#357a26'],[0,-fs*0.2,fs*0.6,'#3d8c2a']].forEach(([tx,ty,tr,col])=>{
                ctx.fillStyle=col; ctx.beginPath(); ctx.arc(tx,ty,tr,0,Math.PI*2); ctx.fill();
              });
              break;
            }
            case 'mushroom':{
              const fs=ts*0.22*deco.sc;
              // 蘑菇柄
              ctx.fillStyle='#e8d5c4';
              ctx.fillRect(-fs*0.2,0,fs*0.4,fs*0.5);
              // 蘑菇帽
              ctx.fillStyle='#c0392b';
              ctx.beginPath();
              ctx.arc(0,-fs*0.1,fs*0.55,Math.PI,2*Math.PI); ctx.fill();
              // 白点
              ctx.fillStyle='rgba(255,255,255,0.75)';
              [[-fs*0.2,-fs*0.3,fs*0.1],[fs*0.15,-fs*0.25,fs*0.08],[0,-fs*0.45,fs*0.06]].forEach(([tx,ty,tr])=>{
                ctx.beginPath(); ctx.arc(tx,ty,tr,0,Math.PI*2); ctx.fill();
              });
              break;
            }
            case 'flower':{
              const fs=ts*0.15*deco.sc;
              const colors=['#f7ca18','#e74c3c','#9b59b6','#3498db','#e67e22'];
              const col=colors[(deco.c*7+deco.r*3)%colors.length];
              // 花瓣
              for(let pi=0;pi<5;pi++){
                const pa=pi*(Math.PI*2/5)+deco.rot;
                ctx.fillStyle=col+'cc';
                ctx.beginPath(); ctx.ellipse(Math.cos(pa)*fs*0.7,Math.sin(pa)*fs*0.7,fs*0.55,fs*0.35,pa,0,Math.PI*2); ctx.fill();
              }
              ctx.fillStyle='#f9e800';
              ctx.beginPath(); ctx.arc(0,0,fs*0.32,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'grass_tall':{
              const fs=ts*0.18*deco.sc;
              ctx.strokeStyle='#5a9e35'; ctx.lineWidth=1.2;
              for(let gi=0;gi<4;gi++){
                const gx=(gi-1.5)*fs*0.4;
                const sway=Math.sin(T*1.5+deco.c+gi)*fs*0.3;
                ctx.beginPath();
                ctx.moveTo(gx,fs*0.4);
                ctx.quadraticCurveTo(gx+sway,-fs*0.2,gx+sway*1.3,-fs*0.6);
                ctx.stroke();
              }
              break;
            }
            case 'flower_s':{
              const fs=ts*0.1*deco.sc;
              ctx.fillStyle=['#ff6b9d','#ffd93d','#a8e6cf'][(deco.c*5+deco.r)%3];
              ctx.beginPath(); ctx.arc(0,0,fs,0,Math.PI*2); ctx.fill();
              ctx.fillStyle='rgba(255,255,200,0.8)';
              ctx.beginPath(); ctx.arc(0,0,fs*0.4,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'pebble':{
              const fs=ts*0.1*deco.sc;
              ctx.fillStyle='#9e9e9e';
              ctx.beginPath(); ctx.ellipse(0,0,fs*1.3,fs*0.85,deco.rot,0,Math.PI*2); ctx.fill();
              ctx.fillStyle='rgba(255,255,255,0.25)';
              ctx.beginPath(); ctx.ellipse(-fs*0.3,-fs*0.3,fs*0.5,fs*0.3,deco.rot,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'rock1':{
              const fs=ts*0.28*deco.sc;
              ctx.fillStyle='#616161';
              ctx.beginPath(); ctx.arc(0,0,fs,0,Math.PI*2); ctx.fill();
              ctx.fillStyle='#424242';
              ctx.beginPath(); ctx.arc(fs*0.2,fs*0.15,fs*0.6,0,Math.PI*2); ctx.fill();
              ctx.fillStyle='rgba(255,255,255,0.15)';
              ctx.beginPath(); ctx.arc(-fs*0.3,-fs*0.3,fs*0.35,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'rock2':{
              const fs=ts*0.2*deco.sc;
              ctx.fillStyle='#546e7a';
              ctx.beginPath();
              ctx.moveTo(-fs,-fs*0.3); ctx.lineTo(0,-fs); ctx.lineTo(fs,-fs*0.2);
              ctx.lineTo(fs*0.8,fs*0.3); ctx.lineTo(-fs*0.7,fs*0.4);
              ctx.closePath(); ctx.fill();
              ctx.fillStyle='rgba(255,255,255,0.12)';
              ctx.beginPath(); ctx.arc(-fs*0.2,-fs*0.4,fs*0.3,0,Math.PI*2); ctx.fill();
              break;
            }
            case 'crack':{
              const fs=ts*0.3*deco.sc;
              ctx.strokeStyle='rgba(30,20,15,0.5)'; ctx.lineWidth=0.8;
              ctx.beginPath();
              ctx.moveTo(-fs,-fs*0.3); ctx.lineTo(-fs*0.2,0); ctx.lineTo(fs*0.1,fs*0.4); ctx.lineTo(fs,fs*0.2);
              ctx.stroke();
              break;
            }
          }
          ctx.restore();
        }
      }
    }

    // ── 淡网格线（草地感）──
    ctx.strokeStyle='rgba(0,0,0,0.06)';
    ctx.lineWidth=0.5;
    for(let c=0;c<=cols;c++){
      ctx.beginPath(); ctx.moveTo(c*ts,0); ctx.lineTo(c*ts,rows*ts); ctx.stroke();
    }
    for(let r=0;r<=rows;r++){
      ctx.beginPath(); ctx.moveTo(0,r*ts); ctx.lineTo(cols*ts,r*ts); ctx.stroke();
    }

    // ══════════════════════════════════════════════════
    // 3. 路径方向箭头（引导感）
    // ══════════════════════════════════════════════════
    if(this.map.lanes){
      for(let li=0;li<this.laneCount;li++){
        const lane=this.map.lanes[li];
        if(!lane||lane.length<2) continue;
        const pc=lanePlayerColors[li%lanePlayerColors.length];
        ctx.save();
        ctx.globalAlpha=0.28;
        ctx.fillStyle=pc;
        for(let i=1;i<lane.length-1;i+=3){
          const prev=lane[i-1], cur=lane[i];
          const dx=cur.x-prev.x, dy=cur.y-prev.y;
          const len=Math.sqrt(dx*dx+dy*dy)||1;
          const ax=cur.x*ts+ts/2, ay=cur.y*ts+ts/2;
          const ang=Math.atan2(dy,dx);
          ctx.save();
          ctx.translate(ax,ay); ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(ts*0.25,0); ctx.lineTo(-ts*0.15,-ts*0.15); ctx.lineTo(-ts*0.15,ts*0.15);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
    }

    // ══════════════════════════════════════════════════
    // 4. 入口 & 终点
    // ══════════════════════════════════════════════════
    if(this.map.lanes){
      for(let li=0;li<this.laneCount;li++){
        const lane=this.map.lanes[li];
        if(!lane)continue;
        const p0=lane[0];
        const px=p0.x*ts+ts/2, py=p0.y*ts+ts/2;
        const pc=lanePlayerColors[li%lanePlayerColors.length];
        // 旗杆
        ctx.save();
        ctx.strokeStyle='#8d6e63'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(px,py+14); ctx.lineTo(px,py-16); ctx.stroke();
        // 旗面（飘动）
        const wavFlag=Math.sin(T*3+li)*5;
        ctx.fillStyle=pc+'ee';
        ctx.beginPath();
        ctx.moveTo(px,py-16);
        ctx.quadraticCurveTo(px+14+wavFlag,py-10,px,py-4);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=0.8; ctx.stroke();
        // 玩家标号
        ctx.fillStyle='#fff';
        ctx.font=`bold ${ts*0.3}px sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('P'+(li+1),px+7,py-10);
        ctx.restore();
      }

      // 终点城堡（精美版）
      const trunk=this.map.trunk;
      const tp=trunk[trunk.length-1];
      const ex=tp.x*ts+ts/2, ey=tp.y*ts+ts/2;
      ctx.save();
      // 城堡光晕
      const pulse=0.7+0.3*Math.sin(T*2.5);
      const cGrad=ctx.createRadialGradient(ex,ey,0,ex,ey,28);
      cGrad.addColorStop(0,`rgba(255,200,50,${0.3*pulse})`);
      cGrad.addColorStop(1,'rgba(255,150,0,0)');
      ctx.fillStyle=cGrad;
      ctx.beginPath(); ctx.arc(ex,ey,28,0,Math.PI*2); ctx.fill();
      // 城堡底座
      ctx.fillStyle='#7b4f2e';
      roundRect(ex-14,ey-10,28,20,4); ctx.fill();
      // 城堡塔楼
      [[0,-10,9,20],[-14,-8,8,18],[14,-8,8,18]].forEach(([ox2,oy2,w2,h2])=>{
        ctx.fillStyle='#8b5e3c';
        ctx.fillRect(ex+ox2-w2/2,ey+oy2,w2,h2);
        // 雉堞
        for(let ti=0;ti<3;ti++){
          ctx.fillStyle=ti%2===0?'#7b4f2e':'#a0745a';
          ctx.fillRect(ex+ox2-w2/2+ti*(w2/3),ey+oy2-5,w2/3-1,5);
        }
      });
      // 城堡 emoji 覆盖（作为顶层装饰）
      ctx.font=`${ts*0.62}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.globalAlpha=0.95;
      ctx.fillText('🏰',ex,ey);
      // 城堡发光描边
      ctx.strokeStyle=`rgba(255,215,0,${0.5*pulse})`;
      ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(ex,ey,20,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // ══════════════════════════════════════════════════
    // 5. 萤火虫粒子特效
    // ══════════════════════════════════════════════════
    if(!this._fireflies){
      const mapW=cols*ts, mapH=rows*ts;
      this._fireflies=[];
      for(let i=0;i<28;i++){
        this._fireflies.push({
          x:Math.random()*mapW, y:Math.random()*mapH,
          vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
          phase:Math.random()*Math.PI*2,
          color:['#aaffaa','#ffffaa','#aaaaff','#ffaaff'][Math.floor(Math.random()*4)]
        });
      }
    }
    const mapW2=cols*ts, mapH2=rows*ts;
    for(const ff of this._fireflies){
      ff.x+=ff.vx+(Math.sin(T*0.7+ff.phase)*0.3);
      ff.y+=ff.vy+(Math.cos(T*0.5+ff.phase)*0.3);
      if(ff.x<0) ff.x=mapW2; if(ff.x>mapW2) ff.x=0;
      if(ff.y<0) ff.y=mapH2; if(ff.y>mapH2) ff.y=0;
      const alpha=0.15+0.65*((Math.sin(T*2.5+ff.phase)+1)/2);
      ctx.save();
      ctx.globalAlpha=alpha;
      const ffGrad=ctx.createRadialGradient(ff.x,ff.y,0,ff.x,ff.y,4);
      ffGrad.addColorStop(0,ff.color);
      ffGrad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ffGrad;
      ctx.beginPath(); ctx.arc(ff.x,ff.y,4,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── 选中高亮 ──
    if(this.selTile){
      const{col,row}=this.selTile;
      ctx.strokeStyle='#f0c040'; ctx.lineWidth=2/this.cam.scale;
      ctx.strokeRect(col*ts+2,row*ts+2,ts-4,ts-4);
    }

    // ── 塔 ──
    const allTowers=[];
    if(this.cur.players){
      for(const ps of Object.values(this.cur.players)) allTowers.push(...ps.towers);
    }
    // 辅助：画六边形路径
    const hexPath=(x,y,r)=>{
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a=Math.PI/180*(60*i-30);
        i===0?ctx.moveTo(x+r*Math.cos(a),y+r*Math.sin(a))
             :ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));
      }
      ctx.closePath();
    };
    for(const t of allTowers){
      const isOwn=this.myPid&&this.cur.players&&
        this.cur.players[this.myPid]&&
        this.cur.players[this.myPid].towers.some(x=>x.uid===t.uid);
      const isSel=this.selTower&&this.selTower===t.uid;

      // ── 射程圈（可爱虚线圈）──
      ctx.beginPath(); ctx.arc(t.x,t.y,t.range,0,Math.PI*2);
      if(isSel){
        ctx.fillStyle='rgba(255,110,180,.08)'; ctx.fill();
        ctx.strokeStyle='rgba(255,110,180,.9)';
        ctx.lineWidth=2/this.cam.scale;
        ctx.setLineDash([6/this.cam.scale,4/this.cam.scale]);
        ctx.stroke(); ctx.setLineDash([]);
      } else {
        ctx.fillStyle=isOwn?'rgba(95,140,255,.06)':'rgba(200,200,220,.04)'; ctx.fill();
        ctx.strokeStyle=isOwn?'rgba(95,140,255,.25)':'rgba(200,200,220,.12)';
        ctx.lineWidth=1/this.cam.scale; ctx.stroke();
      }

      // ── 塔底座（暗色阴影）──
      ctx.fillStyle='rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(t.x+1,t.y+24,16,5,0,0,Math.PI*2); ctx.fill();

      // ── 升星特效：高星角色的地面光晕 ──
      const tStars=t.stars||0;
      const R=22; // 角色圆圈半径
      const tc=isOwn?t.color:'#667788';
      const T_now=Date.now()/1000;

      // ── 临时Buff光环（nature/tank/shield/holy）──
      if(isOwn){
        const sc2=this.cam.scale||1;
        // 🌿 自然之息：绿色攻速光环（旋转绿叶圆）
        if((t._natureBuff||0)>0){
          ctx.save();
          ctx.globalAlpha=0.35+0.15*Math.sin(T_now*3);
          ctx.strokeStyle='#27ae60'; ctx.lineWidth=2.5/sc2;
          ctx.shadowColor='#27ae60'; ctx.shadowBlur=10;
          ctx.beginPath(); ctx.arc(t.x,t.y,R+8+2*Math.sin(T_now*4),0,Math.PI*2); ctx.stroke();
          // 旋转虚线（叶脉感）
          for(let ni=0;ni<4;ni++){
            const na=T_now*2+ni*Math.PI/2;
            ctx.globalAlpha=0.5; ctx.beginPath();
            ctx.moveTo(t.x+Math.cos(na)*(R+4),t.y+Math.sin(na)*(R+4));
            ctx.lineTo(t.x+Math.cos(na)*(R+12),t.y+Math.sin(na)*(R+12));
            ctx.stroke();
          }
          ctx.shadowBlur=0; ctx.restore();
        }
        // 🛡️ 护甲震地：灰金色护甲光环（六边形闪烁）
        if((t._tankShield||0)>0){
          ctx.save();
          ctx.globalAlpha=0.4+0.2*Math.sin(T_now*2);
          ctx.strokeStyle='#b2bec3'; ctx.lineWidth=2/sc2;
          ctx.shadowColor='#dfe6e9'; ctx.shadowBlur=8;
          hexPath(t.x,t.y,R+10);
          ctx.stroke();
          ctx.shadowBlur=0; ctx.restore();
        }
        // 🔵 魔法护盾：蓝色六边形护盾膜
        if((t._magicShield||0)>0){
          ctx.save();
          const shAlpha=Math.min(1,(t._magicShield||0)*0.3+0.3);
          ctx.globalAlpha=shAlpha*(0.5+0.2*Math.sin(T_now*5));
          ctx.strokeStyle='#74b9ff'; ctx.lineWidth=3/sc2;
          ctx.shadowColor='#74b9ff'; ctx.shadowBlur=14;
          hexPath(t.x,t.y,R+9);
          ctx.stroke();
          ctx.fillStyle='rgba(116,185,255,0.05)';
          hexPath(t.x,t.y,R+9); ctx.fill();
          ctx.shadowBlur=0; ctx.restore();
        }
        // ✨ 圣光祝福：金色神圣十字光
        if((t._holyBlessing||0)>0){
          ctx.save();
          ctx.globalAlpha=0.55+0.25*Math.sin(T_now*4);
          ctx.strokeStyle='#ffeaa7'; ctx.lineWidth=1.5/sc2;
          ctx.shadowColor='#fdcb6e'; ctx.shadowBlur=12;
          for(let hi=0;hi<4;hi++){
            const ha=hi*Math.PI/2;
            ctx.beginPath();
            ctx.moveTo(t.x+Math.cos(ha)*(R+3),t.y+Math.sin(ha)*(R+3));
            ctx.lineTo(t.x+Math.cos(ha)*(R+15),t.y+Math.sin(ha)*(R+15));
            ctx.stroke();
          }
          ctx.shadowBlur=0; ctx.restore();
        }
        // ⚙️ 机械炮台：显示炮台数量小图标（橙色齿轮）
        if((t._turretCount||0)>0){
          ctx.save();
          ctx.fillStyle='#f39c12'; ctx.font=`bold ${Math.round(9/sc2)}px Arial`;
          ctx.textAlign='right'; ctx.textBaseline='top';
          ctx.globalAlpha=0.9;
          ctx.fillText('⚙️×'+(t._turretCount),t.x+R+2,t.y-R-14);
          ctx.restore();
        }
      }

      if(isOwn && tStars>=2){
        // 升星地面光圈（旋转渐变）
        const gGrad=ctx.createRadialGradient(t.x,t.y,R*0.5,t.x,t.y,R*(1.5+tStars*0.3));
        const starAlpha=tStars>=4?0.55:tStars>=3?0.4:0.25;
        const starRingColor=tStars>=5?'#ffd700':tStars>=4?'#f59e0b':tStars>=3?'#c084fc':'#60a5fa';
        gGrad.addColorStop(0,starRingColor+'00');
        gGrad.addColorStop(0.6,starRingColor+Math.floor(starAlpha*255).toString(16).padStart(2,'0'));
        gGrad.addColorStop(1,starRingColor+'00');
        ctx.fillStyle=gGrad;
        ctx.beginPath(); ctx.arc(t.x,t.y,R*(2+tStars*0.25),0,Math.PI*2); ctx.fill();
        // 旋转扫描线（3星以上）
        if(tStars>=3){
          const rot=T_now*(0.6+tStars*0.15);
          for(let ri=0;ri<(tStars>=5?3:2);ri++){
            const a=rot+ri*Math.PI*2/(tStars>=5?3:2);
            ctx.save();
            ctx.strokeStyle=starRingColor;
            ctx.globalAlpha=0.35+0.15*Math.sin(T_now*3+ri);
            ctx.lineWidth=1.2/this.cam.scale;
            ctx.shadowColor=starRingColor; ctx.shadowBlur=8;
            ctx.beginPath();
            ctx.arc(t.x,t.y,R+5+tStars*2,a,a+Math.PI*0.7);
            ctx.stroke();
            ctx.shadowBlur=0; ctx.restore();
          }
        }
      }

      // ── 塔主体（深色科技圆，半径22）──
      ctx.fillStyle='#1a1e28';
      ctx.beginPath(); ctx.arc(t.x,t.y,R,0,Math.PI*2); ctx.fill();
      // 颜色内光（高星更亮更深）
      const innerIntensity=isOwn?(0.2+tStars*0.08):0.15;
      const baseGrad=ctx.createRadialGradient(t.x-R*0.3,t.y-R*0.3,0,t.x,t.y,R);
      baseGrad.addColorStop(0,tc+(Math.floor(Math.min(0.8,innerIntensity*3)*255)).toString(16).padStart(2,'0'));
      baseGrad.addColorStop(0.5,tc+(Math.floor(innerIntensity*255)).toString(16).padStart(2,'0'));
      baseGrad.addColorStop(1,tc+'11');
      ctx.fillStyle=baseGrad;
      ctx.beginPath(); ctx.arc(t.x,t.y,R,0,Math.PI*2); ctx.fill();

      // 5星：外层宝石切割面（六边形多边形光芒）
      if(isOwn && tStars>=5){
        const gemRot=T_now*0.4;
        ctx.save();
        ctx.globalAlpha=0.3+0.15*Math.sin(T_now*2);
        ctx.strokeStyle='#ffd700'; ctx.lineWidth=1/this.cam.scale;
        ctx.shadowColor='#ffd700'; ctx.shadowBlur=12;
        hexPath(t.x,t.y,R+7);
        ctx.stroke();
        ctx.shadowBlur=0; ctx.restore();
        // 四射光芒（圣光十字）
        for(let gi=0;gi<4;gi++){
          const ga=gemRot+gi*Math.PI/2;
          const gLen=(12+4*Math.sin(T_now*2+gi))/this.cam.scale;
          ctx.save();
          ctx.globalAlpha=0.45+0.2*Math.sin(T_now*3+gi*1.5);
          ctx.strokeStyle='#fffde7'; ctx.lineWidth=1.5/this.cam.scale;
          ctx.shadowColor='#ffd700'; ctx.shadowBlur=10;
          ctx.beginPath();
          ctx.moveTo(t.x+Math.cos(ga)*(R+2),t.y+Math.sin(ga)*(R+2));
          ctx.lineTo(t.x+Math.cos(ga)*(R+gLen),t.y+Math.sin(ga)*(R+gLen));
          ctx.stroke();
          ctx.shadowBlur=0; ctx.restore();
        }
      }

      // 4星：顶部散射粒子（偶发生成→由星粒子池管理）
      if(isOwn && tStars>=4 && Math.random()<0.04){
        const starRingColor='#f59e0b';
        for(let si=0;si<2;si++){
          const sa=Math.random()*Math.PI*2, sspd=0.5+Math.random()*1;
          this.particles.push({
            x:t.x+Math.cos(sa)*(R+2)*this.cam.scale,
            y:t.y+Math.sin(sa)*(R+2)*this.cam.scale,
            vx:Math.cos(sa)*sspd, vy:Math.sin(sa)*sspd-0.8,
            color:tStars>=5?'#ffd700':starRingColor,
            r:1.2+Math.random(),life:45,maxLife:45,type:'spark'
          });
        }
      }

      // ── 顶部高光线（科技感）──
      ctx.strokeStyle='rgba(255,255,255,0.15)';
      ctx.lineWidth=1/this.cam.scale;
      ctx.beginPath(); ctx.arc(t.x,t.y-4,14,Math.PI,Math.PI*2); ctx.stroke();

      // ── 塔边框（高星变金边）──
      const borderColor=isOwn&&tStars>=5?'#ffd700':isOwn&&tStars>=4?'#f59e0b':isOwn&&tStars>=3?'#c084fc':isSel?'#7aa0ff':'rgba(255,255,255,0.6)';
      if(isOwn && tStars>=3){
        ctx.shadowColor=borderColor; ctx.shadowBlur=tStars>=5?14:8;
      }
      ctx.strokeStyle=borderColor;
      ctx.lineWidth=(isSel?3:isOwn&&tStars>=3?2.5:2)/this.cam.scale;
      ctx.beginPath(); ctx.arc(t.x,t.y,R,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0;
      if(isSel){
        // 选中光晕
        ctx.strokeStyle='rgba(95,140,255,0.3)';
        ctx.lineWidth=6/this.cam.scale;
        ctx.beginPath(); ctx.arc(t.x,t.y,R+3,0,Math.PI*2); ctx.stroke();
      }

      // ── 羁绊激活光环（主羁绊系颜色的流光圆）──
      if(isOwn && this.cur){
        const ps=this.cur.players&&this.cur.players[t.owner];
        const syns=ps&&ps.activeSynergies;
        const mainSyn=(t.syns||[])[0];
        if(mainSyn&&syns&&syns.find(s=>s.id===mainSyn)){
          // 该塔羁绊激活中
          const SYN_COLORS={
            swift:'#00cec9',cannon:'#e17055',crit:'#ffd700',element:'#a29bfe',shadow:'#6c5ce7',
            tank:'#b2bec3',holy:'#ffeaa7',nature:'#55efc4',shield:'#74b9ff',
            mech:'#636e72',arcane:'#fd79a8',ranger:'#00b894',warrior:'#d63031',
            dragon:'#e17055',undead:'#6c5ce7'
          };
          const synColor=SYN_COLORS[mainSyn]||'#fff';
          const t0=Date.now()/1000;
          const pulse=0.45+0.35*Math.sin(t0*2.5+t.uid*0.5);
          const rot=(t0*0.8+t.uid*0.3)%(Math.PI*2);
          // 外圈旋转弧
          ctx.save();
          ctx.strokeStyle=synColor;
          ctx.globalAlpha=pulse;
          ctx.lineWidth=1.5/this.cam.scale;
          ctx.shadowColor=synColor; ctx.shadowBlur=6;
          ctx.beginPath();
          ctx.arc(t.x,t.y,R+4,rot,rot+Math.PI*1.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(t.x,t.y,R+4,rot+Math.PI,rot+Math.PI*2.2);
          ctx.stroke();
          ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.restore();
          // 顶部羁绊 emoji 小标（9件套额外发光）
          const tier=syns.find(s=>s.id===mainSyn).need;
          const tierEmoji=tier>=9?'⭐':tier>=6?'🌟':'✦';
          ctx.save();
          ctx.font=`${8/this.cam.scale}px serif`;
          ctx.textAlign='center';ctx.textBaseline='bottom';
          ctx.globalAlpha=0.85;
          if(tier>=9){ctx.shadowColor='#f59e0b';ctx.shadowBlur=8;}
          else if(tier>=6){ctx.shadowColor=synColor;ctx.shadowBlur=5;}
          ctx.fillText(tierEmoji,t.x,t.y-R-4);
          ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.restore();
        }
      }

      // ── 蓝条（塔下方显示）──
      if((t.maxMana||0)>0){
        const mPct=Math.min(1,(t.mana||0)/(t.maxMana||1));
        const bw=42, bh=4, bx=t.x-bw/2, by=t.y+R+3;
        // 背景
        ctx.fillStyle='rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,bw,bh,2):ctx.fillRect(bx,by,bw,bh); ctx.fill();
        // 蓝量（满时金色闪烁）
        const mFull=(mPct>=1);
        const mPulse=mFull?(0.7+0.3*Math.sin(Date.now()/120)):1;
        ctx.fillStyle=mFull?`rgba(255,215,0,${mPulse})`:'#5b9cf6';
        const mw=bw*mPct;
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,mw,bh,2):ctx.fillRect(bx,by,mw,bh); ctx.fill();
        // 满蓝光晕
        if(mFull){
          ctx.shadowColor='#5b9cf6'; ctx.shadowBlur=5*mPulse;
          ctx.fill(); ctx.shadowBlur=0;
        }
      }

      // ── Debuff 状态（被怪物诅咒时显示紫边+图标）──
      if((t._debuffTick||0)>0){
        // 脉冲紫色光晕
        const debuffPulse=0.5+0.5*Math.sin(Date.now()/150);
        ctx.shadowColor='#c084fc'; ctx.shadowBlur=10*debuffPulse;
        ctx.strokeStyle=`rgba(192,132,252,${0.6+0.4*debuffPulse})`;
        ctx.lineWidth=2.5/this.cam.scale;
        ctx.beginPath(); ctx.arc(t.x,t.y,R+2,0,Math.PI*2); ctx.stroke();
        ctx.shadowBlur=0;
        // 诅咒图标
        ctx.font=`${11/this.cam.scale}px serif`;
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        ctx.fillText('💀',t.x+R-2,t.y-R+2);
      }

      // ── 角色首字（大圆圈，字体更大）──
      ctx.save();
      ctx.textAlign='center'; ctx.textBaseline='middle';
      // 高星首字加发光
      if(isOwn && tStars>=3){
        const charTextColor=tStars>=5?'#fff8e0':tStars>=4?'#fff3c0':'#f0e6ff';
        ctx.shadowColor=borderColor; ctx.shadowBlur=tStars>=5?12:6;
        ctx.fillStyle=charTextColor;
      } else {
        ctx.fillStyle=isOwn?'#fff':'rgba(220,230,255,0.85)';
      }
      ctx.font=`bold ${Math.round((tStars>=4?17:16)/this.cam.scale)}px Arial,sans-serif`;
      ctx.fillText(t.name[0]||'?',t.x,t.y-4);
      ctx.shadowBlur=0;
      ctx.restore();

      // ── 等级标签（左上角小徽章）──
      if(isOwn){
        const tLv = t.charLv||1;
        const lvStr='Lv'+tLv;
        ctx.save();
        ctx.font=`bold ${Math.round(8/this.cam.scale)}px Arial,sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        // 小背景圆角矩形
        const lvMetrics=ctx.measureText(lvStr);
        const lvW=lvMetrics.width+4, lvH=10/this.cam.scale;
        const lvX=t.x-R+2, lvY=t.y-R+2;
        ctx.fillStyle='rgba(0,0,0,0.65)';
        ctx.fillRect(lvX-lvW/2, lvY-lvH/2, lvW, lvH);
        ctx.fillStyle='#7dd3fc';
        ctx.fillText(lvStr, lvX, lvY);
        ctx.restore();
      }

      // ── 星级（圆圈底部，黄色小星）──
      if(isOwn){
        if(tStars>0){
          const starStr = '★'.repeat(Math.min(tStars,5));
          ctx.save();
          const starFontSize=tStars>=5?10:tStars>=4?9:8;
          ctx.font = `bold ${Math.round(starFontSize/this.cam.scale)}px Arial,sans-serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          const sColor=tStars>=5?'#ffd700':tStars>=4?'#f59e0b':tStars>=3?'#c084fc':'#f9ca24';
          ctx.fillStyle=sColor;
          if(tStars>=3){ ctx.shadowColor=sColor; ctx.shadowBlur=tStars>=5?8:5; }
          ctx.fillText(starStr, t.x, t.y+R-6);
          ctx.shadowBlur=0;
          // 5星：额外小皇冠角标
          if(tStars>=5){
            ctx.font=`${Math.round(9/this.cam.scale)}px serif`;
            ctx.fillText('👑',t.x+R-2,t.y-R+1);
          }
          ctx.restore();
        }
      }

      // ── 装备小图标（塔头像四周显示，最多4件）──
      if(isOwn && typeof charEquips!=='undefined'){
        const eqUids=charEquips[t.uid]||[];
        if(eqUids.length>0){
          const iconPositions=[
            {dx:-18,dy:-18},{dx:18,dy:-18},{dx:-18,dy:18},{dx:18,dy:18}
          ];
          ctx.save();
          ctx.font=`${8/this.cam.scale}px serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          for(let ei=0;ei<Math.min(eqUids.length,4);ei++){
            const inst=typeof equipBag!=='undefined'?equipBag.find(e=>e.uid===eqUids[ei]):null;
            if(!inst) continue;
            const eDef=typeof EQUIP_DATA!=='undefined'?EQUIP_DATA[inst.id]:null;
            if(!eDef) continue;
            const pos=iconPositions[ei];
            const ex2=t.x+pos.dx/this.cam.scale;
            const ey2=t.y+pos.dy/this.cam.scale;
            // 装备图标背景小圆
            ctx.globalAlpha=0.85;
            ctx.fillStyle='rgba(15,18,26,0.82)';
            ctx.beginPath(); ctx.arc(ex2,ey2,5/this.cam.scale,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle=EQUIP_QUALITY_COLOR&&EQUIP_QUALITY_COLOR[eDef.quality]||'rgba(255,255,255,.3)';
            ctx.lineWidth=0.8/this.cam.scale;
            ctx.stroke();
            ctx.globalAlpha=0.95;
            ctx.fillText(eDef.icon,ex2,ey2);
          }
          ctx.globalAlpha=1;
          ctx.restore();
        }
      }

      // ── 选中指示（箭头+选框）──
      if(isSel){
        ctx.font='11px serif';
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        ctx.fillText('▼',t.x,t.y-15);
      }
    }

    // ── 子弹（按技能/类型区分外观）──
    for(const b of this.cur.bullets){
      const bT=Date.now()/1000;
      const bType=b.btype||b.skillType||b.type||'normal';
      ctx.save();
      if(bType==='fire'||bType==='burn'){
        // 火矢：橙红色燃烧粒子头
        const fg=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,7);
        fg.addColorStop(0,'#fff7e6'); fg.addColorStop(0.4,'#ff6b00'); fg.addColorStop(1,'rgba(255,60,0,0)');
        ctx.fillStyle=fg;
        ctx.beginPath(); ctx.arc(b.x,b.y,7,0,Math.PI*2); ctx.fill();
        // 火焰尾迹
        if(Math.random()<0.6) this.particles.push({
          x:b.x*this.cam.scale,y:b.y*this.cam.scale,
          vx:(Math.random()-.5)*0.8,vy:(Math.random()-.5)*0.8-0.5,
          color:Math.random()<0.5?'#ff6b00':'#ffd43b',r:1.5+Math.random(),life:20,maxLife:20,type:'spark'
        });
      } else if(bType==='ice'||bType==='freeze'||bType==='slow'){
        // 冰/减速：冰蓝色六角光晶
        ctx.strokeStyle='#7ee8fa'; ctx.lineWidth=1;
        ctx.shadowColor='#7ee8fa'; ctx.shadowBlur=8;
        hexPath(b.x,b.y,5);
        ctx.fillStyle='rgba(120,220,255,0.3)'; ctx.fill();
        ctx.stroke(); ctx.shadowBlur=0;
        // 旋转内核
        ctx.fillStyle='#e0f7fa';
        ctx.beginPath(); ctx.arc(b.x,b.y,2.2,0,Math.PI*2); ctx.fill();
      } else if(bType==='chain_lightning'){
        // ⚡ 闪电链：从 (b.x,b.y) 到 (b.tx,b.ty) 画锯齿闪电线
        const clDx=b.tx-b.x, clDy=b.ty-b.y, clLen=Math.sqrt(clDx*clDx+clDy*clDy)||1;
        const clNx=clDx/clLen, clNy=clDy/clLen;
        const clPx=-clNy, clPy=clNx; // 垂直方向
        const segments=Math.max(4,Math.floor(clLen/18));
        ctx.strokeStyle='#ffe066'; ctx.lineWidth=1.5;
        ctx.shadowColor='#ffe066'; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.moveTo(b.x,b.y);
        for(let si=1;si<segments;si++){
          const t2=si/segments;
          const mx=b.x+clDx*t2, my=b.y+clDy*t2;
          const jitter=(Math.random()-0.5)*Math.min(clLen*0.25,20);
          ctx.lineTo(mx+clPx*jitter, my+clPy*jitter);
        }
        ctx.lineTo(b.tx,b.ty);
        ctx.stroke();
        // 白色内芯闪电
        ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=0.6; ctx.shadowBlur=0;
        ctx.beginPath(); ctx.moveTo(b.x,b.y);
        ctx.lineTo(b.tx,b.ty);
        ctx.stroke();
        // 两端闪光
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(b.tx,b.ty,3,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      } else if(bType==='thunder'||bType==='electric'){
        // 雷霆：黄白色闪电球
        ctx.shadowColor='#ffe066'; ctx.shadowBlur=12;
        const tg=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,6);
        tg.addColorStop(0,'#ffffff'); tg.addColorStop(0.5,'#ffe066'); tg.addColorStop(1,'rgba(255,200,0,0)');
        ctx.fillStyle=tg;
        ctx.beginPath(); ctx.arc(b.x,b.y,6,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        // 随机闪电尖刺
        if(Math.random()<0.5){
          for(let zi=0;zi<3;zi++){
            const za=Math.random()*Math.PI*2, zl=4+Math.random()*5;
            ctx.strokeStyle='rgba(255,240,100,0.7)'; ctx.lineWidth=0.8;
            ctx.beginPath(); ctx.moveTo(b.x,b.y);
            ctx.lineTo(b.x+Math.cos(za)*zl,b.y+Math.sin(za)*zl);
            ctx.stroke();
          }
        }
      } else if(bType==='poison'||bType==='nature'){
        // 毒：绿色腐蚀液滴
        ctx.shadowColor='#55efc4'; ctx.shadowBlur=6;
        ctx.fillStyle='#00b894';
        ctx.beginPath(); ctx.arc(b.x,b.y,4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(0,255,180,0.25)';
        ctx.beginPath(); ctx.arc(b.x,b.y,8,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      } else if(bType==='shadow'||bType==='curse'||bType==='dark'){
        // 暗影：紫黑色灵魂弹
        ctx.shadowColor='#6c5ce7'; ctx.shadowBlur=10;
        const dg=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,7);
        dg.addColorStop(0,'#a29bfe'); dg.addColorStop(0.5,'#6c5ce7'); dg.addColorStop(1,'rgba(80,50,200,0)');
        ctx.fillStyle=dg;
        ctx.beginPath(); ctx.arc(b.x,b.y,7,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      } else if(bType==='piercing'||bType==='穿心'){
        // 穿心：银色锥形穿透矢
        const angle=b.angle||0;
        ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(angle);
        ctx.fillStyle='#e2e8f0'; ctx.shadowColor='#fff'; ctx.shadowBlur=6;
        ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(-4,3); ctx.lineTo(-4,-3); ctx.closePath(); ctx.fill();
        ctx.shadowBlur=0; ctx.restore();
        // 穿透尾迹
        if(Math.random()<0.5) this.particles.push({
          x:b.x*this.cam.scale,y:b.y*this.cam.scale,
          vx:-Math.cos(angle)*1.5+(Math.random()-.5)*0.5,vy:-Math.sin(angle)*1.5+(Math.random()-.5)*0.5,
          color:'#cbd5e1',r:1,life:15,maxLife:15,type:'spark'
        });
      } else if(bType==='aoe'||bType==='cannon'){
        // 炮台：橙褐色重型炮弹
        ctx.shadowColor='#e17055'; ctx.shadowBlur=8;
        ctx.fillStyle='#d35400';
        ctx.beginPath(); ctx.arc(b.x,b.y,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,120,50,0.3)';
        ctx.beginPath(); ctx.arc(b.x,b.y,9,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      } else {
        // 普通：白色能量弹（原始风格但加发光）
        ctx.shadowColor=b.color||'#fff'; ctx.shadowBlur=5;
        ctx.fillStyle=b.color||'#ffd43b';
        ctx.beginPath(); ctx.arc(b.x,b.y,3.5,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      }
      ctx.restore();
    }

    // ── 敌人（插值）──
    const pm=this.prev?new Map(this.prev.enemies.map(e=>[e.uid,e])):new Map();
    for(const e of this.cur.enemies){
      const pe=pm.get(e.uid);
      const ex=pe?pe.x+(e.x-pe.x)*a:e.x;
      const ey=pe?pe.y+(e.y-pe.y)*a:e.y;
      const r=e.r;

      // 地面阴影
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(ex,ey+r*.75,r*.9,r*.28,0,0,Math.PI*2); ctx.fill();

      // 品质边框颜色映射
      const gradeRingColor={normal:null,elite:'#74b9ff',epic:'#c084fc',boss:'#ffd36b'}[e.grade||'normal'];

      if(e.boss){
        // ── Boss：深色科技风光晕 ──
        const bossGlow=ctx.createRadialGradient(ex,ey,r*.3,ex,ey,r*1.8);
        bossGlow.addColorStop(0,e.color+'50');
        bossGlow.addColorStop(0.5,e.color+'20');
        bossGlow.addColorStop(1,e.color+'00');
        ctx.fillStyle=bossGlow;
        ctx.beginPath(); ctx.arc(ex,ey,r*1.8,0,Math.PI*2); ctx.fill();
        // 主体
        ctx.fillStyle='#1a1a2e';
        ctx.beginPath(); ctx.arc(ex,ey,r,0,Math.PI*2); ctx.fill();
        // 发光边框
        ctx.shadowColor=e.color; ctx.shadowBlur=16;
        ctx.strokeStyle=e.color; ctx.lineWidth=2.5/this.cam.scale;
        ctx.beginPath(); ctx.arc(ex,ey,r,0,Math.PI*2); ctx.stroke();
        ctx.shadowBlur=0;
        // 内部颜色叠加
        const bg=ctx.createRadialGradient(ex,ey,0,ex,ey,r*.8);
        bg.addColorStop(0,e.color+'40'); bg.addColorStop(1,e.color+'00');
        ctx.fillStyle=bg;
        ctx.beginPath(); ctx.arc(ex,ey,r*.8,0,Math.PI*2); ctx.fill();
        // Boss皇冠
        ctx.font=`${r*0.9}px serif`;
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        ctx.fillText('👑',ex,ey-r+2);
      } else {
        // ── 普通/精英/史诗敌人 ──
        ctx.fillStyle='#1e2030';
        ctx.beginPath(); ctx.arc(ex,ey,r,0,Math.PI*2); ctx.fill();
        const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,r);
        eg.addColorStop(0,e.color+'88'); eg.addColorStop(1,e.color+'22');
        ctx.fillStyle=eg;
        ctx.beginPath(); ctx.arc(ex,ey,r,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle=e.color+'aa'; ctx.lineWidth=1.5/this.cam.scale;
        ctx.beginPath(); ctx.arc(ex,ey,r,0,Math.PI*2); ctx.stroke();
      }

      // ── 品质外圈（elite/epic 加一圈品质色环）──
      if(gradeRingColor&&!e.boss){
        const pulse=0.7+0.3*Math.sin(Date.now()/400+(e.uid||0)*0.7);
        ctx.strokeStyle=gradeRingColor+Math.round(pulse*200).toString(16).padStart(2,'0');
        ctx.lineWidth=2/this.cam.scale;
        ctx.beginPath(); ctx.arc(ex,ey,r+3,0,Math.PI*2); ctx.stroke();
      }

      // ── 怪物 emoji 图标（非Boss）──
      if(!e.boss){
        const emDef=ENEM_MAP[e.eid];
        if(emDef&&emDef.ico){
          ctx.font=`${r*0.9}px serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.globalAlpha=0.9; ctx.fillText(emDef.ico,ex,ey); ctx.globalAlpha=1;
        }
      }

      // ── 血条（HP < maxHP 时显示）──
      if(e.hp<e.maxHp){
        const bw=r*2+8, bh=5, bx=ex-bw/2, by=ey-r-12;
        const pct=Math.max(0,e.hp/e.maxHp);
        // 背景
        ctx.fillStyle='rgba(0,0,0,0.55)';
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,bw,bh,2):ctx.fillRect(bx,by,bw,bh); ctx.fill();
        // 血量
        const hpCol=pct>.6?'#7dffb1':pct>.3?'#ffd36b':'#ff6b6b';
        ctx.fillStyle=hpCol;
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,bw*pct,bh,2):ctx.fillRect(bx,by,bw*pct,bh); ctx.fill();
        ctx.shadowColor=hpCol; ctx.shadowBlur=4; ctx.fill(); ctx.shadowBlur=0;
      }

      // ── 护盾条（有护盾时显示在血条下方）──
      if((e.shield||0)>0&&e.skillDef){
        const shMax=e.skillDef.v||300;
        const bw=e.r*2+8, bx2=ex-bw/2, by2=ey-e.r-6;
        const sPct=Math.min(1,e.shield/shMax);
        ctx.fillStyle='rgba(0,0,0,0.4)';
        ctx.fillRect(bx2,by2,bw,3);
        ctx.fillStyle='#74b9ff';
        ctx.fillRect(bx2,by2,bw*sPct,3);
      }

      // ── 状态图标（护甲/技能激活标记）──
      {
        let iconX=ex+r+2, iconY=ey-r;
        const iconSize=Math.max(8,r*0.65);
        // 护甲激活
        if(e.skillState&&(e.skillState.armorReduce||0)>0){
          ctx.font=`${iconSize}px serif`;
          ctx.textAlign='left'; ctx.textBaseline='top';
          ctx.fillText('🛡️',iconX,iconY); iconY+=iconSize+2;
        }
        // 狂暴激活
        if(e.skillState&&(e.skillState.berserkCd||0)>0){
          ctx.font=`${iconSize}px serif`;
          ctx.textAlign='left'; ctx.textBaseline='top';
          ctx.fillText('⚡',iconX,iconY); iconY+=iconSize+2;
        }
        // 加速激活（burst）
        if(e.skillState&&e.skillState.burst){
          ctx.font=`${iconSize}px serif`;
          ctx.textAlign='left'; ctx.textBaseline='top';
          ctx.fillText('🔥',iconX,iconY); iconY+=iconSize+2;
        }
        // 光环（减速免疫）
        if(e.skillState&&e.skillState.auraActive){
          ctx.font=`${iconSize}px serif`;
          ctx.textAlign='left'; ctx.textBaseline='top';
          ctx.fillText('✨',iconX,iconY);
        }
      }
    }

    // ── 特效层（随相机）──
    this.drawFx(ctx, this.cam.scale);

    // ── 浮动文字（技能激活提示）──
    if(this.floatTexts&&this.floatTexts.length){
      ctx.save();
      this.floatTexts=this.floatTexts.filter(ft=>{
        const p=ft.life/ft.maxLife;
        ctx.globalAlpha=Math.min(1,p*3);
        const fsz=Math.round((ft.fontSize||11)/this.cam.scale);
        ctx.font=`bold ${fsz}px Arial,sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        // 描边（让飘字在各种背景下都清晰）
        ctx.strokeStyle='rgba(0,0,0,0.85)'; ctx.lineWidth=Math.max(1.5,3/this.cam.scale);
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle=ft.color||'#fff';
        ctx.fillText(ft.text, ft.x, ft.y);
        ft.y+=(ft.vy||-.8); ft.life--;
        return ft.life>0;
      });
      ctx.globalAlpha=1; ctx.restore();
    }

    // ── 技能质变特效（世界坐标系，跟随相机，定向版）─────────────────
    if(this.skillUlts&&this.skillUlts.length){
      for(let sui=this.skillUlts.length-1;sui>=0;sui--){
        const su=this.skillUlts[sui];
        try{
        const sp=su.life/su.maxLife;   // 剩余比例 1→0（淡出）
        const sw=1-sp;                  // 进度 0→1（扩散）
        const sc=this.cam.scale||1;
        const syns=su.syns||[];
        const rarity=su.rarity||'n';
        const stars=su.stars||0;

        // 方向向量（塔→目标）
        const dx=su.tx-su.x, dy=su.ty-su.y;
        const dlen=Math.sqrt(dx*dx+dy*dy)||1;
        const nx=dx/dlen, ny=dy/dlen; // 单位方向向量

        // 品质粒子密度
        const qDens={n:3,r:5,sr:7,ssr:12}[rarity]||3;

        ctx.save();
        ctx.shadowColor=su.color; ctx.shadowBlur=12/sc;

        // ══════════════════════════════════════════════════════════════
        //  按技能实际行为绘制特效，位置和方向与技能一一对应
        // ══════════════════════════════════════════════════════════════

        // 🌪️ swift 连斩：以目标为中心的旋转刀光风暴
        if(syns.includes('swift')){
          const cx=su.tx, cy=su.ty; // 特效中心 = 目标位置
          const bladeCount=stars>=3?6:4;
          const baseR=sw*70;
          for(let bi=0;bi<bladeCount;bi++){
            const ba=(bi/bladeCount)*Math.PI*2 + sw*Math.PI*4; // 快速旋转
            ctx.strokeStyle='#74b9ff'; ctx.lineWidth=2.5/sc; ctx.globalAlpha=sp*0.9;
            ctx.beginPath();
            ctx.moveTo(cx+Math.cos(ba)*baseR*0.2, cy+Math.sin(ba)*baseR*0.2);
            ctx.lineTo(cx+Math.cos(ba)*baseR, cy+Math.sin(ba)*baseR);
            ctx.stroke();
          }
          // 核心收缩圆（暗示命中）
          ctx.strokeStyle='#dfe6e9'; ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.5;
          ctx.beginPath(); ctx.arc(cx,cy,Math.max(1,(1-sw)*40),0,Math.PI*2); ctx.stroke();
          // 从塔到目标的刀光轨迹
          if(sw<0.5){
            ctx.strokeStyle=su.color; ctx.lineWidth=1/sc; ctx.globalAlpha=sp*0.35;
            ctx.beginPath(); ctx.moveTo(su.x,su.y); ctx.lineTo(cx,cy); ctx.stroke();
          }
        }

        // 💣 cannon 炮击：目标位置爆炸冲击波
        else if(syns.includes('cannon')){
          const cx=su.tx, cy=su.ty;
          // 主爆炸圆圈
          const explodeR=sw*90;
          ctx.strokeStyle='#e17055'; ctx.lineWidth=Math.max(0.5,(4-sw*3)/sc); ctx.globalAlpha=sp*0.85;
          ctx.beginPath(); ctx.arc(cx,cy,explodeR,0,Math.PI*2); ctx.stroke();
          // 内爆光圈
          ctx.strokeStyle='#f39c12'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.6;
          ctx.beginPath(); ctx.arc(cx,cy,explodeR*0.55,0,Math.PI*2); ctx.stroke();
          // 爆炸射线（以目标为中心向外辐射）
          const rayN=8+(stars>=3?4:0);
          for(let ri=0;ri<rayN;ri++){
            const ra=(ri/rayN)*Math.PI*2;
            const rLen=(20+Math.random()*50)*sw;
            ctx.strokeStyle='#fdcb6e'; ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.65;
            ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(ra)*rLen,cy+Math.sin(ra)*rLen); ctx.stroke();
          }
        }

        // 🎯 crit 暴击：目标位置金色爆裂 + X型斩痕
        else if(syns.includes('crit')){
          const cx=su.tx, cy=su.ty;
          // X型大斩痕
          const slashR=sw*60;
          for(let xi=0;xi<4;xi++){
            const xa=(xi/4)*Math.PI*2+Math.PI/8;
            ctx.strokeStyle='#ffd700'; ctx.lineWidth=Math.max(0.5,(3-sw*2)/sc); ctx.globalAlpha=sp*0.9;
            ctx.beginPath(); ctx.moveTo(cx-Math.cos(xa)*slashR,cy-Math.sin(xa)*slashR);
            ctx.lineTo(cx+Math.cos(xa)*slashR,cy+Math.sin(xa)*slashR); ctx.stroke();
          }
          // 金色冲击圆
          ctx.strokeStyle='#fff9c4'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.5;
          ctx.beginPath(); ctx.arc(cx,cy,sw*45,0,Math.PI*2); ctx.stroke();
        }

        // ✨ element 元素风暴：以塔为中心的三色旋涡，射向目标
        else if(syns.includes('element')){
          const cx=su.x, cy=su.y;
          const eColors=['#e17055','#74b9ff','#fdcb6e'];
          for(let ei=0;ei<3;ei++){
            const ang=(ei/3)*Math.PI*2 + sw*Math.PI*6;
            const er=sw*80;
            ctx.strokeStyle=eColors[ei]; ctx.lineWidth=3/sc; ctx.globalAlpha=sp*0.8;
            ctx.beginPath(); ctx.arc(cx,cy,er, ang, ang+Math.PI*0.8); ctx.stroke();
          }
          // 元素能量从塔射向目标
          ctx.strokeStyle='#a29bfe'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.5;
          const beamLen=Math.min(dlen,sw*120);
          ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+nx*beamLen,cy+ny*beamLen); ctx.stroke();
        }

        // 🌑 shadow 暗杀：目标位置闪现+死亡印记
        else if(syns.includes('shadow')){
          const cx=su.tx, cy=su.ty;
          // 死亡漩涡（目标位置）
          const arcN=3+(stars>=3?2:0);
          for(let ai=0;ai<arcN;ai++){
            const aStart=sw*Math.PI*5+(ai/arcN)*Math.PI*2;
            ctx.strokeStyle='#6c5ce7'; ctx.lineWidth=2.5/sc; ctx.globalAlpha=sp*0.85;
            ctx.beginPath(); ctx.arc(cx,cy,sw*60+ai*8, aStart, aStart+Math.PI*0.75); ctx.stroke();
          }
          // 暗影残影（从塔到目标的虚线轨迹）
          if(sw<0.6){
            const dashCount=5;
            for(let di=0;di<dashCount;di++){
              const t2=di/dashCount;
              const px=su.x+nx*dlen*t2, py=su.y+ny*dlen*t2;
              ctx.fillStyle='#8e44ad'; ctx.globalAlpha=sp*(1-t2)*0.5;
              ctx.beginPath(); ctx.arc(px,py,4/sc,0,Math.PI*2); ctx.fill();
            }
          }
        }

        // 🏹 ranger 穿透箭：从塔出发，穿过目标，延伸出去的光箭
        else if(syns.includes('ranger')){
          const arrowLen=Math.max(dlen,120)*sw*1.8;
          // 主箭光（从塔起点沿方向射出）
          ctx.strokeStyle='#fdcb6e'; ctx.lineWidth=4/sc; ctx.globalAlpha=sp*0.85;
          ctx.beginPath();
          ctx.moveTo(su.x - nx*20, su.y - ny*20); // 略往后一点
          ctx.lineTo(su.x + nx*arrowLen, su.y + ny*arrowLen);
          ctx.stroke();
          // 侧翼辅助线
          const perp_x=-ny, perp_y=nx; // 垂直方向
          ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.4;
          ctx.beginPath();
          ctx.moveTo(su.x - nx*20 + perp_x*8, su.y - ny*20 + perp_y*8);
          ctx.lineTo(su.x + nx*arrowLen + perp_x*8, su.y + ny*arrowLen + perp_y*8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(su.x - nx*20 - perp_x*8, su.y - ny*20 - perp_y*8);
          ctx.lineTo(su.x + nx*arrowLen - perp_x*8, su.y + ny*arrowLen - perp_y*8);
          ctx.stroke();
          // 箭头
          const tipX=su.x+nx*arrowLen, tipY=su.y+ny*arrowLen;
          ctx.fillStyle='#ffd700'; ctx.globalAlpha=sp*0.8;
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(tipX-nx*18+perp_x*10, tipY-ny*18+perp_y*10);
          ctx.lineTo(tipX-nx*18-perp_x*10, tipY-ny*18-perp_y*10);
          ctx.closePath(); ctx.fill();
        }

        // ⚔️ warrior 冲锋斩：从塔直线冲向目标
        else if(syns.includes('warrior')){
          const cx=su.tx, cy=su.ty;
          // 冲锋轨迹（塔→目标的能量轨迹）
          const chargeAlpha=sp*(1-sw*0.5);
          ctx.strokeStyle='#e84393'; ctx.lineWidth=(5-sw*3)/sc; ctx.globalAlpha=chargeAlpha*0.7;
          ctx.beginPath(); ctx.moveTo(su.x,su.y); ctx.lineTo(cx,cy); ctx.stroke();
          // 目标位置的冲击波
          const impactR=sw*70;
          ctx.strokeStyle='#ff7675'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.8;
          ctx.beginPath(); ctx.arc(cx,cy,impactR,0,Math.PI*2); ctx.stroke();
          // X型斩击（目标位置）
          for(let xi=0;xi<2;xi++){
            const xr=sw*50, xa=xi===0?Math.PI/4:-Math.PI/4;
            ctx.strokeStyle='#fdcb6e'; ctx.lineWidth=2.5/sc; ctx.globalAlpha=sp*0.75;
            ctx.beginPath(); ctx.moveTo(cx-Math.cos(xa)*xr,cy-Math.sin(xa)*xr);
            ctx.lineTo(cx+Math.cos(xa)*xr,cy+Math.sin(xa)*xr); ctx.stroke();
          }
        }

        // 🐉 dragon 龙息：从塔发出扇形火焰锥
        else if(syns.includes('dragon')){
          // 扇形龙焰锥（以塔为顶点，朝目标方向）
          const coneR=sw*130;
          const spread=Math.PI*0.35; // 扇形角度
          const baseAngle=Math.atan2(dy,dx);
          const grad=ctx.createRadialGradient(su.x,su.y,5,su.x,su.y,coneR);
          grad.addColorStop(0,'rgba(253,121,168,0.7)');
          grad.addColorStop(0.5,'rgba(225,112,85,0.5)');
          grad.addColorStop(1,'rgba(243,156,18,0)');
          ctx.fillStyle=grad; ctx.globalAlpha=sp*0.65;
          ctx.beginPath();
          ctx.moveTo(su.x,su.y);
          ctx.arc(su.x,su.y,coneR, baseAngle-spread, baseAngle+spread);
          ctx.closePath(); ctx.fill();
          // 龙焰核心线
          ctx.strokeStyle='#e17055'; ctx.lineWidth=4/sc; ctx.globalAlpha=sp*0.8;
          ctx.beginPath(); ctx.moveTo(su.x,su.y); ctx.lineTo(su.x+nx*coneR*0.9,su.y+ny*coneR*0.9); ctx.stroke();
        }

        // 💀 undead 死亡爆发：目标附近的死亡旋涡
        else if(syns.includes('undead')){
          const cx=su.tx, cy=su.ty;
          const uColors=['#00b894','#6c5ce7','#b2bec3'];
          for(let ui=0;ui<3;ui++){
            const uAngle=sw*Math.PI*6+(ui/3)*Math.PI*2;
            ctx.strokeStyle=uColors[ui]; ctx.lineWidth=2.5/sc; ctx.globalAlpha=sp*0.75;
            ctx.beginPath(); ctx.arc(cx,cy,(30+ui*22)*sw,uAngle,uAngle+Math.PI*1.1); ctx.stroke();
          }
          // 死亡扩散脉冲
          ctx.strokeStyle='#00b894'; ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.4;
          ctx.beginPath(); ctx.arc(cx,cy,sw*80,0,Math.PI*2); ctx.stroke();
        }

        // 🔮 arcane 魔法风暴：以塔为中心螺旋弹射
        else if(syns.includes('arcane')){
          const cx=su.x, cy=su.y;
          const arcN=6+(stars>=3?3:0);
          for(let ai=0;ai<arcN;ai++){
            const ang=(ai/arcN)*Math.PI*2 + sw*Math.PI*3;
            const ar=sw*85;
            ctx.strokeStyle=su.color; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.75;
            ctx.beginPath(); ctx.arc(cx,cy,ar, ang, ang+Math.PI*0.5); ctx.stroke();
            // 弹射体（沿方向飞出）
            const bx=cx+Math.cos(ang)*ar, by=cy+Math.sin(ang)*ar;
            const bvx=Math.cos(ang)*2/sc, bvy=Math.sin(ang)*2/sc;
            if(su.life%6===0) this.particles.push({x:bx,y:by,vx:bvx,vy:bvy,color:su.color,r:3/sc,life:30,maxLife:30,type:'orb'});
          }
        }

        // 🔧 mech 炮台：目标位置大爆炸+齿轮碎片
        else if(syns.includes('mech')){
          const cx=su.tx, cy=su.ty;
          const gearR=sw*60;
          // 旋转齿轮（目标位置）
          ctx.strokeStyle='#b2bec3'; ctx.lineWidth=2.5/sc; ctx.globalAlpha=sp*0.75;
          for(let mi=0;mi<8;mi++){
            const ma=(mi/8)*Math.PI*2+sw*Math.PI*3;
            ctx.beginPath();
            ctx.moveTo(cx+Math.cos(ma)*gearR*0.6,cy+Math.sin(ma)*gearR*0.6);
            ctx.lineTo(cx+Math.cos(ma)*gearR,cy+Math.sin(ma)*gearR);
            ctx.stroke();
          }
          if(gearR>1){ ctx.beginPath(); ctx.arc(cx,cy,gearR*0.6,0,Math.PI*2); ctx.stroke(); }
          // 从塔到目标的炮弹轨迹
          if(sw<0.4){
            ctx.strokeStyle='#fdcb6e'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.5;
            ctx.beginPath(); ctx.moveTo(su.x,su.y); ctx.lineTo(cx,cy); ctx.stroke();
          }
        }

        // ✝️ holy 圣光净化：目标附近十字圣光
        else if(syns.includes('holy')){
          const cx=su.tx, cy=su.ty;
          const crossLen=sw*100;
          for(let ci=0;ci<2;ci++){
            const cx2=ci===0?crossLen:0, cy2=ci===0?0:crossLen;
            ctx.strokeStyle='#ffd700'; ctx.lineWidth=Math.max(0.5,(4-sw*2.5)/sc); ctx.globalAlpha=sp*0.85;
            ctx.beginPath(); ctx.moveTo(cx-cx2,cy-cy2); ctx.lineTo(cx+cx2,cy+cy2); ctx.stroke();
          }
          ctx.strokeStyle='#fff9c4'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.5;
          ctx.beginPath(); ctx.arc(cx,cy,sw*80,0,Math.PI*2); ctx.stroke();
        }

        // 🛡️ tank 震地冲击波：从塔发出的地面冲击环
        else if(syns.includes('tank')){
          const cx=su.x, cy=su.y; // 以塔为中心震地
          ctx.strokeStyle='#b2bec3'; ctx.lineWidth=Math.max(0.5,(4-sw*3)/sc); ctx.globalAlpha=sp*0.8;
          ctx.beginPath(); ctx.arc(cx,cy,sw*120,0,Math.PI*2); ctx.stroke();
          ctx.strokeStyle='#636e72'; ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.5;
          ctx.beginPath(); ctx.arc(cx,cy,sw*75,0,Math.PI*2); ctx.stroke();
          // 放射裂缝线
          const crackN=8;
          for(let ki=0;ki<crackN;ki++){
            const ka=(ki/crackN)*Math.PI*2+(Math.random()*0.3);
            const klen=sw*(60+Math.random()*50);
            ctx.strokeStyle='#636e72'; ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.4;
            ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(ka)*klen,cy+Math.sin(ka)*klen); ctx.stroke();
          }
        }

        // 🌲 nature 荆棘爆发：以目标为中心的藤蔓爆裂
        else if(syns.includes('nature')){
          const cx=su.tx, cy=su.ty;
          const vineN=stars>=3?6:4;
          for(let vi=0;vi<vineN;vi++){
            const va=(vi/vineN)*Math.PI*2, vr=sw*90;
            ctx.strokeStyle='#27ae60'; ctx.lineWidth=3/sc; ctx.globalAlpha=sp*0.8;
            ctx.beginPath(); ctx.arc(cx,cy,vr,va,va+Math.PI*0.55); ctx.stroke();
            // 荆棘刺尖
            const tipX=cx+Math.cos(va+0.25)*vr, tipY=cy+Math.sin(va+0.25)*vr;
            ctx.lineWidth=2/sc; ctx.globalAlpha=sp*0.55;
            ctx.beginPath(); ctx.moveTo(tipX,tipY);
            ctx.lineTo(tipX+Math.cos(va)*10,tipY+Math.sin(va)*10); ctx.stroke();
          }
        }

        // 🔵 shield 护盾爆炸：目标区域冰蓝六边形护盾膨胀
        else if(syns.includes('shield')){
          const cx=su.tx, cy=su.ty;
          const shR=sw*90;
          ctx.strokeStyle='#74b9ff'; ctx.lineWidth=Math.max(0.5,(4-sw*2.5)/sc); ctx.globalAlpha=sp*0.8;
          ctx.beginPath();
          for(let shi=0;shi<6;shi++){
            const sha=(shi/6)*Math.PI*2-Math.PI/6;
            shi===0?ctx.moveTo(cx+Math.cos(sha)*shR,cy+Math.sin(sha)*shR):ctx.lineTo(cx+Math.cos(sha)*shR,cy+Math.sin(sha)*shR);
          }
          ctx.closePath(); ctx.stroke();
          // 冰晶外圈
          ctx.strokeStyle='#dfe6e9'; ctx.lineWidth=1.5/sc; ctx.globalAlpha=sp*0.4;
          ctx.beginPath(); ctx.arc(cx,cy,sw*110,0,Math.PI*2); ctx.stroke();
        }

        // ── 通用扩散粒子（从塔到目标方向喷射）──
        ctx.globalAlpha=1; ctx.restore();
        if(su.life%2===0){
          const spread=syns.includes('ranger')||syns.includes('dragon')?0.3:Math.PI*2;
          const baseAngle2=Math.atan2(ny,nx);
          for(let spi=0;spi<qDens;spi++){
            const sa=baseAngle2+(Math.random()-0.5)*spread;
            const spd=(2+Math.random()*4)/sc;
            // 粒子从塔或目标发出（按技能类型）
            const useTarget=syns.includes('cannon')||syns.includes('crit')||syns.includes('shadow')||
                            syns.includes('undead')||syns.includes('holy')||syns.includes('nature')||syns.includes('shield');
            const px=useTarget?su.tx:su.x, py=useTarget?su.ty:su.y;
            this.particles.push({x:px,y:py,vx:Math.cos(sa)*spd,vy:Math.sin(sa)*spd,
              color:spi%2===0?su.color:'#ffffff',
              r:(1.2+Math.random()*2)/sc, life:35+Math.random()*25, maxLife:60, type:'spark'});
          }
        }
        // SSR额外金色粒子
        if(rarity==='ssr'&&su.life%3===0){
          const px=su.tx,py=su.ty;
          const ssa=Math.random()*Math.PI*2;
          this.particles.push({x:px,y:py,vx:Math.cos(ssa)*(3+Math.random()*4)/sc,vy:Math.sin(ssa)*(3+Math.random()*4)/sc-2/sc,
            color:'#ffd700',r:(2+Math.random()*2)/sc,life:50,maxLife:50,type:'spark'});
        }

        }catch(err){ su.life=0; }
        su.life--;
        if(su.life<=0) this.skillUlts.splice(sui,1);
      }
    }

    ctx.restore();

    // ── 相机 UI（不随相机变换）──
    ctx.save();
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle='rgba(24,26,31,0.82)';
    ctx.strokeStyle='rgba(95,140,255,0.25)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.roundRect?ctx.roundRect(8,ch/dpr-28,170,20,5):ctx.fillRect(8,ch/dpr-28,170,20);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(95,140,255,0.85)'; ctx.font='11px Arial,sans-serif';
    ctx.textBaseline='middle';
    ctx.fillText('⊕ '+(this.cam.scale*100|0)+'%  WASD移动 / 滚轮缩放',14,ch/dpr-18);
    ctx.restore();

    // ── 升星爆炸特效（升星瞬间触发）──────────────────────────────────
    if(this.starBursts&&this.starBursts.length){
      const W2=cw/dpr, H2=ch/dpr;
      ctx.save();
      ctx.setTransform(dpr,0,0,dpr,0,0);
      this.starBursts=this.starBursts.filter(sb=>{
        const p=sb.life/sb.maxLife; // 1→0
        const fadeIn=Math.min(1,p*10); const fadeOut=Math.min(1,(1-p)*3);
        const alpha=Math.min(fadeIn,fadeOut);
        const T_sb=Date.now()/1000;

        // 阶段1：前30帧 — 爆炸冲击波
        if(sb.life>sb.maxLife*0.8){
          const wave=(1-(sb.life-sb.maxLife*0.8)/(sb.maxLife*0.2));
          ctx.globalAlpha=(1-wave)*0.7;
          ctx.strokeStyle=sb.color; ctx.lineWidth=4;
          ctx.shadowColor=sb.color; ctx.shadowBlur=20;
          ctx.beginPath(); ctx.arc(W2/2,H2/2,wave*200,0,Math.PI*2); ctx.stroke();
          ctx.shadowBlur=0;
          ctx.globalAlpha=1;
        }

        // 放射星芒（按星级数量）
        const numRays=sb.stars*2+4;
        for(let ri=0;ri<numRays;ri++){
          const ra=(ri/numRays)*Math.PI*2+(1-p)*Math.PI*3;
          const rayLen=(1-p)*120*(0.6+0.4*Math.sin(ri*1.7));
          ctx.save();
          ctx.globalAlpha=alpha*(0.5+0.3*Math.sin(T_sb*8+ri));
          ctx.strokeStyle=ri%2===0?sb.color:'#ffffff';
          ctx.lineWidth=ri%3===0?2:1;
          ctx.shadowColor=sb.color; ctx.shadowBlur=12;
          ctx.beginPath();
          ctx.moveTo(W2/2+Math.cos(ra)*20,H2/2+Math.sin(ra)*20);
          ctx.lineTo(W2/2+Math.cos(ra)*(20+rayLen),H2/2+Math.sin(ra)*(20+rayLen));
          ctx.stroke();
          ctx.shadowBlur=0; ctx.restore();
        }

        // 中心文字（星号）
        if(p<0.7){
          ctx.globalAlpha=alpha*0.95;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          const starTxt='★'.repeat(sb.stars);
          ctx.font=`bold ${24+sb.stars*6}px serif`;
          ctx.fillStyle=sb.color;
          ctx.shadowColor=sb.color; ctx.shadowBlur=20;
          ctx.fillText(starTxt, W2/2, H2/2-20);
          ctx.shadowBlur=0;
          ctx.font=`bold 18px "Microsoft YaHei",sans-serif`;
          ctx.fillStyle='#ffffff';
          ctx.fillText(sb.name+' 升星！', W2/2, H2/2+16);
          ctx.globalAlpha=1;
        }

        // 粒子生成
        if(sb.life%4===0){
          for(let pi=0;pi<6;pi++){
            const pa=Math.random()*Math.PI*2, ps=2+Math.random()*4;
            this.particles.push({
              x:W2/2*dpr,y:H2/2*dpr,
              vx:Math.cos(pa)*ps,vy:Math.sin(pa)*ps,
              color:pi%2===0?sb.color:'#ffffff',
              r:1.5+Math.random()*2,life:70,maxLife:70,type:'spark'
            });
          }
        }
        sb.life--;
        return sb.life>0;
      });
      ctx.globalAlpha=1; ctx.restore();
    }

    // ── 羁绊激活中央弹幕动画（全面强化版）──────────────────────────────
    if(this.synActivations&&this.synActivations.length){
      const W=cw/dpr, H=ch/dpr;
      ctx.save();
      ctx.setTransform(dpr,0,0,dpr,0,0);
      this.synActivations=this.synActivations.filter(sa=>{
        const p=sa.life/sa.maxLife; // 1→0
        const fadeIn=Math.min(1,p*8); const fadeOut=Math.min(1,(1-p)*4);
        const alpha=Math.min(fadeIn,fadeOut);
        const scale=1.2-p*0.3;
        const T_sa=Date.now()/1000;

        // ── 全屏幕背景染色（超高级羁绊：究极9件套）──
        if(sa.tier>=9){
          ctx.globalAlpha=alpha*0.12;
          ctx.fillStyle=sa.color;
          ctx.fillRect(0,0,W,H);
          ctx.globalAlpha=1;
        }

        // ── 放射光柱（从中心向四角）──
        if(sa.tier>=6){
          const numRays=sa.tier>=9?12:6;
          for(let ri=0;ri<numRays;ri++){
            const ra=(ri/numRays)*Math.PI*2+T_sa*0.3;
            const rayAlpha=alpha*(0.2+0.1*Math.sin(T_sa*4+ri));
            const g=ctx.createLinearGradient(W/2,H/2,W/2+Math.cos(ra)*W,H/2+Math.sin(ra)*H);
            g.addColorStop(0,sa.color+Math.floor(rayAlpha*220).toString(16).padStart(2,'0'));
            g.addColorStop(0.4,sa.color+Math.floor(rayAlpha*40).toString(16).padStart(2,'0'));
            g.addColorStop(1,sa.color+'00');
            ctx.fillStyle=g;
            ctx.save(); ctx.translate(W/2,H/2); ctx.rotate(ra);
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-15,-800); ctx.lineTo(15,-800); ctx.closePath();
            ctx.fill(); ctx.restore();
          }
        }

        // ── 同心波纹扩散圆（2圈）──
        for(let wi=0;wi<2;wi++){
          const wp=(1-p+wi*0.4)%1;
          ctx.globalAlpha=alpha*(1-wp)*0.5;
          ctx.strokeStyle=sa.color;
          ctx.lineWidth=3-wi;
          ctx.shadowColor=sa.color; ctx.shadowBlur=20;
          ctx.beginPath(); ctx.arc(W/2,H/2,wp*(sa.tier>=9?360:260)+10,0,Math.PI*2); ctx.stroke();
          ctx.shadowBlur=0;
        }
        ctx.globalAlpha=1;

        const scale2=scale*(sa.tier>=9?1.1:1);
        // 弹幕背景圆角框
        const bw=sa.tier>=9?380:320, bh=sa.tier>=9?96:80;
        const bx=(W-bw)/2, by=sa.y-bh/2;
        ctx.globalAlpha=alpha*0.92;
        // 背景渐变
        const bgGr=ctx.createLinearGradient(bx,by,bx+bw,by+bh);
        bgGr.addColorStop(0,'rgba(8,8,24,0.92)');
        bgGr.addColorStop(0.5,sa.color+'22');
        bgGr.addColorStop(1,'rgba(8,8,24,0.92)');
        ctx.fillStyle=bgGr;
        ctx.strokeStyle=sa.color;
        ctx.lineWidth=sa.tier>=9?3:2;
        ctx.save(); ctx.translate(W/2,sa.y); ctx.scale(scale2,scale2); ctx.translate(-W/2,-sa.y);
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(bx,by,bw,bh,16);
        else ctx.rect(bx,by,bw,bh);
        ctx.fill();
        // 多层发光描边
        ctx.shadowColor=sa.color; ctx.shadowBlur=sa.tier>=9?30:18;
        ctx.stroke();
        ctx.shadowColor=sa.color; ctx.shadowBlur=sa.tier>=9?12:6;
        ctx.stroke();
        ctx.shadowBlur=0;

        // 顶部细线高光
        ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(bx+4,by+3,bw-8,4,3);
        ctx.stroke();

        // Emoji（大号，左侧，居中竖向）
        ctx.textAlign='center'; ctx.textBaseline='middle';
        const emojiSize=sa.tier>=9?42:34;
        ctx.font=`bold ${emojiSize}px serif`;
        ctx.globalAlpha=alpha;
        ctx.shadowColor=sa.color; ctx.shadowBlur=16;
        ctx.fillText(sa.emoji, W/2-(sa.tier>=9?128:106), sa.y);
        ctx.shadowBlur=0;

        // 羁绊名称（高档感大字）
        ctx.font=`bold ${sa.tier>=9?26:22}px "Microsoft YaHei",sans-serif`;
        ctx.fillStyle=sa.color;
        ctx.shadowColor=sa.color; ctx.shadowBlur=10;
        ctx.fillText(sa.name, W/2+24, sa.y-16);
        ctx.shadowBlur=0;

        // 件套标签（带背景徽章）
        const tierLbl=sa.tier>=9?'⚡ 究极羁绊':sa.tier>=6?'✨ 强效羁绊':'🔥 羁绊激活';
        ctx.font=`${sa.tier>=9?16:13}px "Microsoft YaHei",sans-serif`;
        ctx.fillStyle=sa.tier>=9?'#ffd700':sa.tier>=6?'#c084fc':'#34d399';
        ctx.fillText(`${tierLbl}  [${sa.tier}件套]`, W/2+24, sa.y+14);

        ctx.restore();

        // ── 持续粒子喷射（高级羁绊更多更炫）──
        const spawnRate=sa.tier>=9?3:sa.tier>=6?5:8;
        if(sa.life%spawnRate===0){
          const count=sa.tier>=9?10:sa.tier>=6?6:4;
          for(let i=0;i<count;i++){
            const a=Math.random()*Math.PI*2,spd=1.5+Math.random()*3.5;
            // 究极羁绊：双色混合粒子
            const pColor=sa.tier>=9&&i%2===0?'#ffd700':sa.color;
            this.particles.push({
              x:(W/2-180+Math.random()*360)*dpr,
              y:(sa.y-40+Math.random()*80)*dpr,
              vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-1.2,
              color:pColor,r:sa.tier>=9?(2+Math.random()*3):(1.5+Math.random()*2),
              life:60,maxLife:60,type:'spark'
            });
          }
          // 上升小星星
          for(let si=0;si<3;si++){
            this.particles.push({
              x:(W/2-120+Math.random()*240)*dpr,
              y:(sa.y+30+Math.random()*20)*dpr,
              vx:(Math.random()-.5)*1.5,vy:-2-Math.random()*2,
              color:sa.color,r:1+Math.random()*1.5,life:80,maxLife:80,type:'orb'
            });
          }
        }
        sa.life--;
        return sa.life>0;
      });
      ctx.globalAlpha=1;ctx.restore();
    }



  }
  // ── 解析服务端特效事件，生成客户端粒子 ──
  processFx(fxList){
    if(!fxList||!fxList.length)return;
    const now=performance.now();
    for(const f of fxList){
      const {type,x,y,color}=f;
      switch(type){
        case 'cast':{
          // ── 角色专属施法特效系统 ──
          const cid=f.cid||'';
          const rarity=f.rarity||'n';
          const stars=f.stars||0;
          const hasTali=f.hasTali||false;
          const isSkillReady=f.skillReady||false;
          const fSyns=f.syns||[];
          // 品质基础粒子数量
          const qCount={n:2,r:3,sr:5,ssr:8}[rarity]||2;
          // 品质圆环最大半径
          const qRingR={n:16,r:22,sr:30,ssr:42}[rarity]||16;
          // 符咒强化系数
          const taliMult=hasTali?1.6:1.0;
          // 方向向量（朝目标）
          const ddx=(f.tx||x)-x, ddy=(f.ty||y)-y;
          const dlen=Math.sqrt(ddx*ddx+ddy*ddy)||1;
          const dx=ddx/dlen, dy=ddy/dlen;

          // ── 按角色 ID 专属处理 ──
          // 疾风刺客 c1001: 高速蓝色短线刀影
          if(cid==='c1001'){
            for(let i=0;i<qCount+1;i++){
              const a=Math.atan2(dy,dx)+(Math.random()-.5)*0.6;
              this.particles.push({x,y,vx:Math.cos(a)*(3+Math.random()*2),vy:Math.sin(a)*(3+Math.random()*2),
                color:'#74b9ff',r:1.5,life:180,maxLife:180,type:'slash_arc'});
            }
            if(stars>=3) this.rings.push({x,y,r:3,maxR:14,color:'#74b9ff',life:180,maxLife:180});
          }
          // 旋风舞者 c1002: 旋风圆弧粒子
          else if(cid==='c1002'){
            for(let i=0;i<6;i++){
              const a=(i/6)*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,
                color:'#81ecec',r:2,life:220,maxLife:220,type:'spark'});
            }
            this.rings.push({x,y,r:5,maxR:qRingR,color:'#81ecec',life:280,maxLife:280});
          }
          // 气流导师 c1003: 淡紫气流波纹
          else if(cid==='c1003'){
            this.rings.push({x,y,r:2,maxR:qRingR*0.8,color:'#a29bfe',life:300,maxLife:300});
            for(let i=0;i<qCount;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5-0.5,
                color:'#a29bfe',r:2,life:280,maxLife:280,type:'orb'});
            }
          }
          // 断空射手 c1004: 粉色穿透箭线
          else if(cid==='c1004'){
            this.lasers.push({x1:x,y1:y,x2:x+dx*60,y2:y+dy*60,
              color:'#fd79a8',life:180,maxLife:180,w:2});
            for(let i=0;i<3;i++)
              this.particles.push({x:x+dx*i*15,y:y+dy*i*15,vx:dx*2,vy:dy*2,
                color:'#fd79a8',r:1.5,life:120,maxLife:120,type:'spark'});
          }
          // 绝命剑圣 c1005: 橙红爆裂斩击
          else if(cid==='c1005'){
            this.particles.push({x,y,vx:0,vy:0,color:'#e17055',r:20,life:200,maxLife:200,type:'slash_arc'});
            if(stars>=2){
              this.rings.push({x,y,r:4,maxR:18,color:'#e17055',life:180,maxLife:180});
            }
          }
          // 风语者 c1006: 青绿旋转气泡
          else if(cid==='c1006'){
            for(let i=0;i<qCount;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.2,vy:Math.sin(a)*1.2-1,
                color:'#00cec9',r:2.5,life:300,maxLife:300,type:'orb'});
            }
            if(stars>=3) this.rings.push({x,y,r:3,maxR:24,color:'#00cec9',life:300,maxLife:300});
          }
          // 闪电剑客 c1007 SR: 金黄闪电弧
          else if(cid==='c1007'){
            for(let li=0;li<qCount;li++){
              const za=Math.random()*Math.PI*2, zl=8+Math.random()*16;
              this.particles.push({x,y,vx:Math.cos(za)*3,vy:Math.sin(za)*3,
                color:'#fdcb6e',r:2,life:200,maxLife:200,type:'spark'});
            }
            this.rings.push({x,y,r:4,maxR:qRingR,color:'#fdcb6e',life:200,maxLife:200});
            if(hasTali) this.rings.push({x,y,r:2,maxR:qRingR*0.6,color:'#ffffff',life:150,maxLife:150});
          }
          // 暴风武者 c1008 SR: 紫色旋风+斩击叠加
          else if(cid==='c1008'){
            this.particles.push({x,y,vx:0,vy:0,color:'#6c5ce7',r:22,life:220,maxLife:220,type:'slash_arc'});
            for(let i=0;i<qCount;i++){
              const a=(i/qCount)*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,
                color:'#6c5ce7',r:2,life:250,maxLife:250,type:'spark'});
            }
            if(hasTali) this.rings.push({x,y,r:5,maxR:qRingR,color:'#6c5ce7',life:280,maxLife:280});
          }
          // 疾风剑仙 c1009 SR: 金光斩空激光
          else if(cid==='c1009'){
            this.lasers.push({x1:x,y1:y,x2:x+dx*80,y2:y+dy*80,
              color:'#ffeaa7',life:250,maxLife:250,w:hasTali?5:3});
            this.rings.push({x,y,r:3,maxR:qRingR,color:'#ffeaa7',life:250,maxLife:250});
            for(let i=0;i<qCount;i++){
              const a=Math.atan2(dy,dx)+(Math.random()-.5)*0.4;
              this.particles.push({x,y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,
                color:'#ffeaa7',r:2,life:200,maxLife:200,type:'spark'});
            }
          }
          // 瞬影刀客 c1010 SSR: 冰蓝幽灵刀影
          else if(cid==='c1010'){
            // 主刀影：高速短线
            this.lasers.push({x1:x-dx*5,y1:y-dy*5,x2:x+dx*55,y2:y+dy*55,
              color:'#7fe7ff',life:160,maxLife:160,w:hasTali?5:3});
            this.lasers.push({x1:x-dx*5,y1:y-dy*5,x2:x+dx*55,y2:y+dy*55,
              color:'#ffffff88',life:100,maxLife:100,w:1});
            for(let i=0;i<qCount;i++){
              const a=Math.atan2(dy,dx)+(Math.random()-.5)*0.3;
              this.particles.push({x,y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,
                color:'#7fe7ff',r:1.5,life:180,maxLife:180,type:'spark'});
            }
            this.rings.push({x,y,r:2,maxR:qRingR,color:'#7fe7ff',life:200,maxLife:200});
            if(stars>=4) this.rings.push({x,y,r:2,maxR:qRingR*0.5,color:'#b3f5ff',life:150,maxLife:150});
          }
          // 狂风战士 c1011 SSR: 紫色旋风斩+多重残影
          else if(cid==='c1011'){
            for(let si=0;si<3;si++){
              this.particles.push({x:x+si*3,y:y+si*3,vx:0,vy:0,
                color:'#c084fc',r:20+si*4,life:220-si*30,maxLife:220-si*30,type:'slash_arc'});
            }
            this.rings.push({x,y,r:5,maxR:qRingR,color:'#c084fc',life:300,maxLife:300});
            for(let i=0;i<qCount;i++){
              const a=(i/qCount)*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,
                color:'#c084fc',r:2.5,life:280,maxLife:280,type:'spark'});
            }
            if(hasTali){
              this.rings.push({x,y,r:3,maxR:qRingR*1.3,color:'#e9d5ff',life:280,maxLife:280});
            }
          }
          // 风神之刃 c1012 SSR: 祖母绿风刃暴风
          else if(cid==='c1012'){
            // 风刃激光
            this.lasers.push({x1:x,y1:y,x2:x+dx*90,y2:y+dy*90,
              color:'#00b894',life:220,maxLife:220,w:hasTali?7:5});
            this.lasers.push({x1:x,y1:y,x2:x+dx*90,y2:y+dy*90,
              color:'#ffffff',life:150,maxLife:150,w:2});
            this.rings.push({x,y,r:4,maxR:qRingR,color:'#00b894',life:280,maxLife:280});
            this.rings.push({x,y,r:2,maxR:qRingR*0.6,color:'#55efc4',life:200,maxLife:200});
            for(let i=0;i<qCount;i++){
              const a=Math.atan2(dy,dx)+(Math.random()-.5)*0.5;
              this.particles.push({x,y,vx:Math.cos(a)*4.5,vy:Math.sin(a)*4.5,
                color:'#00b894',r:2.5,life:250,maxLife:250,type:'spark'});
            }
            if(isSkillReady||hasTali){
              // 技能质变：风暴爆炸
              this.rings.push({x,y,r:6,maxR:60,color:'#00b894',life:400,maxLife:400});
              for(let i=0;i<12;i++){
                const a=(i/12)*Math.PI*2;
                this.particles.push({x,y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,
                  color:i%2===0?'#00b894':'#55efc4',r:3,life:350,maxLife:350,type:'orb'});
              }
            }
          }
          // 炮台系 c2xxx: 爆炸橙色冲击波
          else if(cid.startsWith('c2')){
            const isLegend=cid==='c2009'||cid==='c2012';
            const pColor=cid==='c2009'?'#ff4500':cid==='c2012'?'#ffd700':color;
            const explosionR=isLegend?qRingR*1.5:qRingR;
            this.rings.push({x,y,r:6,maxR:explosionR,color:pColor,life:350,maxLife:350});
            for(let i=0;i<(isLegend?16:qCount+2);i++){
              const a=Math.random()*Math.PI*2,spd=2+Math.random()*(isLegend?5:3);
              this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
                color:i%3===0?'#ffffff':pColor,r:isLegend?3:2,life:300,maxLife:300,type:'orb'});
            }
            if(hasTali) this.rings.push({x,y,r:4,maxR:explosionR*0.6,color:'#ffd700',life:250,maxLife:250});
          }
          // 暴击系 c3xxx: 金色破碎爆裂
          else if(cid.startsWith('c3')){
            const isLegend=cid==='c3009'||cid==='c3012';
            const pColor=isLegend?'#ffd700':color;
            const critCount=isLegend?qCount*2:qCount;
            this.particles.push({x,y,vx:0,vy:0,color:pColor,r:isLegend?28:18,life:200,maxLife:200,type:'slash_arc'});
            for(let i=0;i<critCount;i++){
              const a=Math.random()*Math.PI*2,spd=1.5+Math.random()*3;
              this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-0.5,
                color:i%2===0?pColor:'#ffffff',r:1.5+Math.random(),life:250,maxLife:250,type:'spark'});
            }
            if(isLegend||hasTali) this.rings.push({x,y,r:3,maxR:qRingR,color:pColor,life:250,maxLife:250});
          }
          // 元素系 c4xxx: 三色轮换元素球
          else if(cid.startsWith('c4')){
            const elemPhase=(f.hitCount||0)%3;
            const elemColor=[color,'#74b9ff','#fdcb6e'][elemPhase];
            const elemType=['fire','ice','thunder'][elemPhase];
            const isLegend=cid==='c4009'||cid==='c4012';
            if(elemPhase===0){ // 火
              this.rings.push({x,y,r:3,maxR:qRingR,color:'#e17055',life:280,maxLife:280});
              for(let i=0;i<qCount+1;i++){
                const a=Math.random()*Math.PI*2;
                this.particles.push({x,y,vx:Math.cos(a)*2,vy:Math.sin(a)*2-1,
                  color:i%2===0?'#ff6b00':'#ffd43b',r:2.5,life:250,maxLife:250,type:'spark'});
              }
            } else if(elemPhase===1){ // 冰
              for(let i=0;i<8;i++){
                const a=(i/8)*Math.PI*2;
                this.particles.push({x:x+Math.cos(a)*6,y:y+Math.sin(a)*6,
                  vx:Math.cos(a)*0.8,vy:Math.sin(a)*0.8-0.5,
                  color:'#74b9ff',r:2.5,life:350,maxLife:350,type:'crystal'});
              }
              this.rings.push({x,y,r:3,maxR:qRingR,color:'#74b9ff',life:280,maxLife:280});
            } else { // 雷
              for(let zi=0;zi<qCount+2;zi++){
                const za=Math.random()*Math.PI*2,zl=8+Math.random()*16;
                this.particles.push({x,y,vx:Math.cos(za)*3.5,vy:Math.sin(za)*3.5,
                  color:'#fdcb6e',r:2,life:200,maxLife:200,type:'spark'});
              }
              this.rings.push({x,y,r:2,maxR:qRingR,color:'#fdcb6e',life:200,maxLife:200});
            }
            if(isLegend){
              this.rings.push({x,y,r:4,maxR:qRingR*1.5,color:'#a29bfe',life:350,maxLife:350});
              for(let i=0;i<3;i++){
                const a=(i/3)*Math.PI*2;
                this.particles.push({x,y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,
                  color:['#e17055','#74b9ff','#fdcb6e'][i],r:3,life:300,maxLife:300,type:'orb'});
              }
            }
          }
          // 暗影系 c5xxx: 紫黑闪现残影
          else if(cid.startsWith('c5')){
            const isLegend=cid==='c5008'||cid==='c5009'||cid==='c5012';
            const sColor=isLegend?'#8e44ad':color;
            for(let i=0;i<qCount;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*2,vy:Math.sin(a)*2-0.5,
                color:sColor,r:2+Math.random(),life:300,maxLife:300,type:'orb'});
            }
            this.particles.push({x,y,vx:0,vy:0,color:sColor,r:isLegend?26:18,life:200,maxLife:200,type:'curse_ring'});
            if(isLegend||hasTali){
              this.rings.push({x,y,r:3,maxR:qRingR,color:sColor,life:300,maxLife:300});
            }
          }
          // 坦克系 c6xxx: 灰银冲击波
          else if(cid.startsWith('c6')){
            const isLegend=cid==='c6008'||cid==='c6009'||cid==='c6012';
            const tColor=isLegend?'#fdcb6e':color;
            this.rings.push({x,y,r:5,maxR:isLegend?qRingR*1.4:qRingR,color:tColor,life:300,maxLife:300});
            for(let i=0;i<qCount;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*2,vy:Math.sin(a)*2,
                color:tColor,r:2.5,life:280,maxLife:280,type:'spark'});
            }
            if(isLegend) this.rings.push({x,y,r:2,maxR:qRingR*0.7,color:'#ffffff',life:200,maxLife:200});
          }
          // 圣光系 c7xxx: 金白圣光弧
          else if(cid.startsWith('c7')){
            const isLegend=cid==='c7008'||cid==='c7012';
            const hColor=isLegend?'#ffd700':color;
            for(let i=0;i<qCount+1;i++){
              const a=(i/(qCount+1))*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.8,vy:Math.sin(a)*1.8,
                color:hColor,r:2.5,life:320,maxLife:320,type:'orb'});
            }
            this.rings.push({x,y,r:3,maxR:qRingR,color:hColor,life:320,maxLife:320});
            if(isLegend||hasTali) this.rings.push({x,y,r:2,maxR:qRingR*0.5,color:'#fffde7',life:250,maxLife:250});
          }
          // 自然系 c8xxx: 绿色孢子+藤蔓
          else if(cid.startsWith('c8')){
            const isLegend=cid==='c8007'||cid==='c8009'||cid==='c8012';
            const nColor=isLegend?'#00b894':color;
            for(let i=0;i<qCount;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5-0.8,
                color:nColor,r:2.5+Math.random(),life:350,maxLife:350,type:'orb'});
            }
            this.rings.push({x,y,r:3,maxR:qRingR,color:nColor,life:320,maxLife:320});
            if(isLegend) for(let i=0;i<6;i++){
              const a=(i/6)*Math.PI*2;
              this.particles.push({x:x+Math.cos(a)*10,y:y+Math.sin(a)*10,
                vx:Math.cos(a)*0.5,vy:-1,color:'#55efc4',r:1.5,life:400,maxLife:400,type:'crystal'});
            }
          }
          // 护盾系 c9xxx: 蓝白魔法屏障涟漪
          else if(cid.startsWith('c9')){
            const isLegend=cid==='c9009'||cid==='c9012';
            const shColor=isLegend?'#a29bfe':color;
            this.rings.push({x,y,r:4,maxR:qRingR,color:shColor,life:320,maxLife:320});
            if(rarity==='ssr'||isLegend) this.rings.push({x,y,r:2,maxR:qRingR*0.5,color:'#ffffff88',life:240,maxLife:240});
            for(let i=0;i<qCount;i++){
              const a=(i/qCount)*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,
                color:shColor,r:2,life:300,maxLife:300,type:'orb'});
            }
            if(hasTali) for(let i=0;i<4;i++){
              const a=(i/4)*Math.PI*2;
              this.particles.push({x:x+Math.cos(a)*15,y:y+Math.sin(a)*15,
                vx:Math.cos(a)*0.3,vy:Math.sin(a)*0.3,color:'#a29bfe',r:3,life:400,maxLife:400,type:'crystal'});
            }
          }
          // 默认兜底
          else {
            this.rings.push({x,y,r:4,maxR:20,color,life:300,maxLife:300});
            for(let i=0;i<3;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*1.2,vy:Math.sin(a)*1.2-1,
                color,r:2,life:250,maxLife:250,type:'spark'});
            }
          }

          // ── SSR / SR 品质通用加成 ──
          if(rarity==='ssr'){
            // SSR: 额外白色核心光晕
            this.rings.push({x,y,r:2,maxR:10,color:'#ffffff',life:180,maxLife:180});
            if(stars>=4){
              // 4星以上 SSR: 金色粒子光环
              for(let i=0;i<4;i++){
                const a=(i/4)*Math.PI*2;
                this.particles.push({x:x+Math.cos(a)*12,y:y+Math.sin(a)*12,
                  vx:Math.cos(a)*0.8,vy:Math.sin(a)*0.8,color:'#ffd700',r:2,life:300,maxLife:300,type:'orb'});
              }
            }
          } else if(rarity==='sr'){
            // SR: 淡银额外圆环
            if(stars>=3) this.rings.push({x,y,r:2,maxR:8,color:'rgba(200,200,255,0.6)',life:200,maxLife:200});
          }

          // ── 符咒强化: 额外金色粒子轨迹 ──
          if(hasTali){
            for(let i=0;i<3;i++){
              const a=Math.random()*Math.PI*2;
              this.particles.push({x,y,vx:Math.cos(a)*(1.5*taliMult),vy:Math.sin(a)*(1.5*taliMult)-1,
                color:'#ffd700',r:1.5,life:220,maxLife:220,type:'spark'});
            }
          }
          break;
        }
        case 'hit':
          // 命中爆溅
          for(let i=0;i<6;i++){
            const a=Math.random()*Math.PI*2,spd=1.5+Math.random()*2;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color,r:1.5+Math.random()*1.5,life:220,maxLife:220,type:'spark'});
          }
          this.rings.push({x,y,r:2,maxR:12,color,life:180,maxLife:180});
          break;
        case 'hit_spark': // Spark激光命中
          for(let i=0;i<10;i++){
            const a=Math.random()*Math.PI*2,spd=2+Math.random()*3;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color:'#ffe066',r:2+Math.random()*2,life:350,maxLife:350,type:'spark'});
          }
          this.rings.push({x,y,r:3,maxR:22,color:'#ffe066',life:250,maxLife:250});
          break;
        case 'spark': // Master Spark激光
          this.lasers.push({x1:x,y1:y,x2:f.tx,y2:f.ty,color:'#ffe066',
            life:500,maxLife:500,w:14});
          // 光束中心加亮线
          this.lasers.push({x1:x,y1:y,x2:f.tx,y2:f.ty,color:'#ffffff',
            life:300,maxLife:300,w:4});
          // 起点爆发
          this.rings.push({x,y,r:5,maxR:35,color:'#ffe066',life:400,maxLife:400});
          break;
        case 'burst': // 结界弹幕
          this.rings.push({x,y,r:10,maxR:f.radius||80,color,life:500,maxLife:500});
          this.rings.push({x,y,r:5,maxR:f.radius*0.6||50,color:'#ffffff',life:350,maxLife:350});
          for(let i=0;i<12;i++){
            const a=(i/12)*Math.PI*2,spd=3;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color,r:3,life:500,maxLife:500,type:'spark'});
          }
          break;
        case 'explode': // 七曜爆炸
          for(let i=0;i<14;i++){
            const a=Math.random()*Math.PI*2,spd=2+Math.random()*4;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color,r:2+Math.random()*3,life:400,maxLife:400,type:'orb'});
          }
          this.rings.push({x,y,r:5,maxR:f.radius||60,color,life:350,maxLife:350});
          this.rings.push({x,y,r:2,maxR:f.radius*1.3||80,color:'#ffffff44',life:500,maxLife:500});
          break;
        case 'destroy': // 非想天则消灭
          for(let i=0;i<20;i++){
            const a=Math.random()*Math.PI*2,spd=3+Math.random()*5;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color:'#ff6600',r:3+Math.random()*3,life:600,maxLife:600,type:'orb'});
          }
          for(let i=0;i<3;i++)
            this.rings.push({x,y,r:i*8,maxR:50+i*15,color:'#ff6600',life:500-i*50,maxLife:500-i*50});
          this.labels.push({x,y:y-20,text:'DESTROY!',color:'#ff6600',
            life:800,maxLife:800,vy:-0.8,size:13});
          break;
        case 'slash': // 斩击
          // 斩击弧线
          this.particles.push({x,y,vx:0,vy:0,color,r:18,life:200,maxLife:200,type:'slash_arc'});
          for(let i=0;i<5;i++){
            const a=-Math.PI/4+Math.random()*Math.PI/2,spd=2+Math.random()*2;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-1,
              color:'#ffffff',r:1.5,life:200,maxLife:200,type:'spark'});
          }
          break;
        case 'timestop': // 时间停止
          this.rings.push({x,y,r:8,maxR:50,color:'#c0c0c0',life:600,maxLife:600});
          this.rings.push({x,y,r:3,maxR:30,color:'#ffffff',life:400,maxLife:400});
          this.labels.push({x,y:y-25,text:'TIME STOP',color:'#e0e0ff',
            life:800,maxLife:800,vy:-0.5,size:11});
          for(let i=0;i<8;i++){
            const a=(i/8)*Math.PI*2;
            this.particles.push({x:x+Math.cos(a)*25,y:y+Math.sin(a)*25,
              vx:Math.cos(a)*0.3,vy:Math.sin(a)*0.3,color:'#a0a0ff',
              r:3,life:600,maxLife:600,type:'orb'});
          }
          break;
        case 'freeze': // 冰冻
          for(let i=0;i<8;i++){
            const a=(i/8)*Math.PI*2;
            this.particles.push({x:x+Math.cos(a)*8,y:y+Math.sin(a)*8,
              vx:Math.cos(a)*0.5,vy:Math.sin(a)*0.5-0.5,
              color,r:2.5,life:450,maxLife:450,type:'crystal'});
          }
          this.rings.push({x,y,r:3,maxR:18,color,life:300,maxLife:300});
          break;
        case 'curse': // 诅咒/减速debuff
          for(let i=0;i<6;i++){
            const a=(i/6)*Math.PI*2;
            this.particles.push({x,y,vx:Math.cos(a)*0.5,vy:Math.sin(a)*0.5-0.8,
              color,r:3,life:500,maxLife:500,type:'orb'});
          }
          // 诅咒圆纹（逆时针）
          this.particles.push({x,y,vx:0,vy:0,color,r:14,life:600,maxLife:600,type:'curse_ring'});
          break;
        case 'dot': // DOT跳伤
          this.particles.push({x:x+(Math.random()-0.5)*10,y:y-8,
            vx:(Math.random()-0.5)*0.5,vy:-0.8,
            color:'#ffb3d9',r:2,life:300,maxLife:300,type:'spark'});
          break;
        case 'portal': // 八云紫传送门
          this.rings.push({x,y,r:6,maxR:28,color:'#8e44ad',life:400,maxLife:400});
          this.rings.push({x:f.tx,y:f.ty,r:6,maxR:28,color:'#8e44ad',life:400,maxLife:400});
          for(let i=0;i<6;i++){
            const a=(i/6)*Math.PI*2;
            this.particles.push({x,y:y,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,
              color:'#c084fc',r:2.5,life:400,maxLife:400,type:'orb'});
          }
          break;
        case 'kitsune': // 狐火
          for(let i=0;i<5;i++){
            const a=Math.random()*Math.PI*2,spd=1+Math.random()*2;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-1,
              color:'#f39c12',r:3,life:400,maxLife:400,type:'orb'});
          }
          this.rings.push({x,y,r:2,maxR:14,color:'#f39c12',life:250,maxLife:250});
          break;
        case 'eye': // 古明地觉读心
          this.particles.push({x,y,vx:0,vy:0,color:'#e056fd',r:12,
            life:350,maxLife:350,type:'eye_fx'});
          this.rings.push({x,y,r:2,maxR:20,color:'#e056fd',life:300,maxLife:300});
          break;
        case 'unconscious': // 古明地恋无意识
          for(let i=0;i<8;i++){
            const a=Math.random()*Math.PI*2,spd=1+Math.random()*3;
            this.particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
              color:'#6ab04c',r:2,life:350,maxLife:350,type:'spark'});
          }
          this.labels.push({x,y:y-20,text:'PHANTOM',color:'#6ab04c',
            life:600,maxLife:600,vy:-0.6,size:10});
          break;
        case 'pillar': // 神柱轰击
          this.lasers.push({x1:x,y1:y-100,x2:x,y2:y,color:'#4a5568',
            life:400,maxLife:400,w:20});
          this.lasers.push({x1:x,y1:y-100,x2:x,y2:y,color:'#e2e8f0',
            life:250,maxLife:250,w:4});
          this.rings.push({x,y,r:5,maxR:f.radius||80,color:'#718096',life:400,maxLife:400});
          break;
        case 'snake': // 白蛇神话
          if(f.targets&&f.targets.length>1){
            for(let i=0;i<f.targets.length-1;i++){
              this.beams.push({x1:f.targets[i].x,y1:f.targets[i].y,
                x2:f.targets[i+1].x,y2:f.targets[i+1].y,
                color:'#27ae60',life:400,maxLife:400});
            }
            // 起点到第一目标
            this.beams.push({x1:x,y1:y,x2:f.targets[0].x,y2:f.targets[0].y,
              color:'#27ae60',life:400,maxLife:400});
          }
          break;
      }
    }
  }

  // ── 绘制所有客户端特效 ──
  drawFx(ctx, scale){
    const now=performance.now();

    // ── 光束（snake链） ──
    for(const b of this.beams){
      const t=1-b.life/b.maxLife;
      ctx.globalAlpha=Math.max(0,(1-t)*0.85);
      ctx.strokeStyle=b.color;
      ctx.lineWidth=3/scale;
      ctx.shadowColor=b.color; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.moveTo(b.x1,b.y1); ctx.lineTo(b.x2,b.y2); ctx.stroke();
      ctx.shadowBlur=0;
      b.life-=16;
    }
    this.beams=this.beams.filter(b=>b.life>0);

    // ── 激光 ──
    for(const l of this.lasers){
      const t=l.life/l.maxLife;
      ctx.globalAlpha=t*0.9;
      ctx.strokeStyle=l.color;
      ctx.lineWidth=(l.w/scale)*t;
      ctx.shadowColor=l.color; ctx.shadowBlur=20;
      ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(l.x1,l.y1); ctx.lineTo(l.x2,l.y2); ctx.stroke();
      ctx.shadowBlur=0; ctx.lineCap='butt';
      l.life-=16;
    }
    this.lasers=this.lasers.filter(l=>l.life>0);

    // ── 扩散圆环 ──
    for(const rg of this.rings){
      const t=1-rg.life/rg.maxLife; // 0→1
      const r=rg.r+(rg.maxR-rg.r)*t;
      ctx.globalAlpha=Math.max(0,(1-t)*0.75);
      ctx.strokeStyle=rg.color;
      ctx.lineWidth=Math.max(0.5,(2-t*1.5)/scale);
      ctx.shadowColor=rg.color; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(rg.x,rg.y,r,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0;
      rg.life-=16;
    }
    this.rings=this.rings.filter(r=>r.life>0);

    // ── 粒子 ──
    for(const p of this.particles){
      const t=p.life/p.maxLife; // 1→0
      ctx.globalAlpha=t*0.9;
      switch(p.type){
        case 'spark':
          ctx.shadowColor=p.color; ctx.shadowBlur=6;
          ctx.fillStyle=p.color;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*t,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
          break;
        case 'orb':
          // 发光球
          const og=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*1.5);
          og.addColorStop(0,'#ffffff88');
          og.addColorStop(0.4,p.color+'cc');
          og.addColorStop(1,p.color+'00');
          ctx.fillStyle=og;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*1.5,0,Math.PI*2); ctx.fill();
          break;
        case 'crystal':
          // 冰晶：小钻石形
          ctx.fillStyle=p.color;
          ctx.shadowColor=p.color; ctx.shadowBlur=8;
          ctx.save();
          ctx.translate(p.x,p.y);
          ctx.rotate(now/300+p.r);
          ctx.beginPath();
          ctx.moveTo(0,-p.r*1.5);ctx.lineTo(p.r,0);
          ctx.lineTo(0,p.r*1.5);ctx.lineTo(-p.r,0);
          ctx.closePath(); ctx.fill();
          ctx.restore();
          ctx.shadowBlur=0;
          break;
        case 'slash_arc':
          // 斩击弧
          ctx.strokeStyle=p.color;
          ctx.lineWidth=(3/scale)*t;
          ctx.shadowColor=p.color; ctx.shadowBlur=12;
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r*(2-t),Math.PI*0.1,Math.PI*0.9);
          ctx.stroke();
          ctx.shadowBlur=0;
          break;
        case 'curse_ring':
          // 诅咒旋转环
          ctx.strokeStyle=p.color;
          ctx.lineWidth=(2/scale)*t;
          ctx.shadowColor=p.color; ctx.shadowBlur=10;
          ctx.save();
          ctx.translate(p.x,p.y);
          ctx.rotate(-(now/500));
          ctx.beginPath();
          for(let i=0;i<6;i++){
            const a=(i/6)*Math.PI*2,r=p.r;
            i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)
                 :ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
          }
          ctx.closePath(); ctx.stroke();
          ctx.restore();
          ctx.shadowBlur=0;
          break;
        case 'eye_fx':
          // 读心眼
          ctx.fillStyle=p.color+'44';
          ctx.strokeStyle=p.color;
          ctx.lineWidth=1.5/scale;
          ctx.shadowColor=p.color; ctx.shadowBlur=12;
          // 眼睛形状
          ctx.save();
          ctx.translate(p.x,p.y);
          const eyeR=p.r*t;
          ctx.beginPath();
          ctx.arc(0,0,eyeR,0,Math.PI*2);
          ctx.fill(); ctx.stroke();
          // 瞳孔
          ctx.fillStyle=p.color;
          ctx.beginPath(); ctx.arc(0,0,eyeR*0.4,0,Math.PI*2); ctx.fill();
          ctx.restore();
          ctx.shadowBlur=0;
          break;
      }
      p.x+=p.vx; p.y+=p.vy;
      p.vx*=0.92; p.vy*=0.92;
      p.life-=16;
    }
    this.particles=this.particles.filter(p=>p.life>0);

    // ── 浮动数字/文字 ──
    for(const lb of this.labels){
      const t=lb.life/lb.maxLife;
      ctx.globalAlpha=t;
      ctx.fillStyle=lb.color;
      ctx.font=`bold ${(lb.size||12)/scale}px Arial,sans-serif`;
      ctx.shadowColor=lb.color; ctx.shadowBlur=8;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(lb.text,lb.x,lb.y);
      ctx.shadowBlur=0;
      lb.y+=lb.vy||0;
      lb.life-=16;
    }
    this.labels=this.labels.filter(lb=>lb.life>0);

    ctx.globalAlpha=1;
  }

  destroy(){
    if(this._ro) this._ro.disconnect();
    this.destroyCamera();
  }
}
const TPS_MS=50;

// ════════════════════════════════════════════════════════
// 四、网络层（PeerJS 封装）
// ════════════════════════════════════════════════════════
class NetHost {
  constructor(){this.peer=null;this.conns=[];this.onData=null;}
  open(){
    return new Promise((ok,fail)=>{
      if(!window.Peer){fail(new Error('PeerJS 未加载，请检查网络连接'));return;}
      this.peer=new Peer(undefined,{debug:0});
      this.peer.on('open',id=>{this.id=id;ok(id);});
      this.peer.on('error',fail);
      this.peer.on('connection',conn=>{
        conn.on('open',()=>{
          this.conns.push(conn);
          conn.on('data',d=>{if(this.onData)this.onData(conn,d);});
          conn.on('close',()=>{this.conns=this.conns.filter(c=>c!==conn);});
        });
      });
    });
  }
  broadcast(d){this.conns.forEach(c=>{try{c.send(d);}catch(_){}});}
  send(conn,d){try{conn.send(d);}catch(_){}}
  destroy(){if(this.peer){this.peer.destroy();this.peer=null;}}
}
class NetClient {
  constructor(){this.peer=null;this.conn=null;this.onData=null;}
  connect(hostId){
    return new Promise((ok,fail)=>{
      if(!window.Peer){fail(new Error('PeerJS 未加载，请检查网络连接'));return;}
      if(!hostId){fail(new Error('请输入房间码'));return;}
      this.peer=new Peer(undefined,{debug:0});
      this.peer.on('open',()=>{
        this.conn=this.peer.connect(hostId.trim(),{reliable:true,serialization:'json'});
        this.conn.on('open',ok);
        this.conn.on('data',d=>{if(this.onData)this.onData(d);});
        this.conn.on('error',fail);
      });
      this.peer.on('error',fail);
    });
  }
  send(d){if(this.conn&&this.conn.open)this.conn.send(d);}
  destroy(){if(this.peer){this.peer.destroy();this.peer=null;}}
}

// ════════════════════════════════════════════════════════
// 五、主应用
// ════════════════════════════════════════════════════════
(function(){
const $=id=>document.getElementById(id);
// zoom 补偿：html{zoom} 下 clientX/Y 是物理坐标，需除以 zoom 才能与 getBoundingClientRect 对齐
function getZoom(){
  return parseFloat(document.documentElement.style.zoom||
    getComputedStyle(document.documentElement).zoom)||1;
}
// 将 clientX/Y 转为 zoom 补偿后的逻辑坐标（相对于某个 rect）
function clientToLocal(clientX, clientY, rect){
  const z=getZoom();
  return {x:(clientX/z)-rect.left, y:(clientY/z)-rect.top};
}
// DOM
const lb=$('lb'),ltip=$('ltip');
const cmenu=$('cmenu'),croom=$('croom');
const lst=$('lst'),rst=$('rst');
const rcode=$('rcode'),plist=$('plist');
const bsolo=$('bsolo'),bcreate=$('bcreate'),bjoin=$('bjoin');
const wavegrid=$('wavegrid'), wavedesc=$('wavedesc'), cwavepick=$('cwavepick');

// ── 波次选择面板渲染 ─────────────────────────────────
function renderWavePick(isReadonly){
  wavegrid.innerHTML='';
  WAVE_MODES.forEach(m=>{
    const btn=document.createElement('button');
    btn.className='wbtn'+(m.id===selectedWaveMode.id?' sel':'');
    btn.innerHTML=`<span class="wico">${m.ico}</span><span class="wlbl">${m.lbl}</span><span class="wsub">${m.sub}</span>`;
    if(!isReadonly){
      btn.addEventListener('click',()=>{
        selectedWaveMode=m;
        renderWavePick(false);
        // 若已在房间，广播选择变更
        if(netHost&&!isSolo) netHost.broadcast({type:'waveMode',modeId:m.id});
      });
    }
    wavegrid.appendChild(btn);
  });
  wavedesc.textContent=selectedWaveMode.desc;
  if(isReadonly) cwavepick.classList.add('readonly');
  else cwavepick.classList.remove('readonly');
}
const icode=$('icode'),bcopy=$('bcopy'),bstart=$('bstart'),bleave=$('bleave');
const gc=$('gc');
const hw=$('hw'),hh=$('hh'),hg=$('hg'),hs=$('hs');
const bnw=$('bnw'),bpause=$('bpause');
const tchars=$('tchars'),ttali=$('ttali');
const harea=$('harea'),gst=$('gst');
const bg1=$('bg1'),bg5=$('bg5');
const wb=$('wb'),gmsg=$('gmsg');
const ovp=$('ovp'),ovr=$('ovr');
const bresume=$('bresume'),bquit=$('bquit'),brquit=$('brquit'),bsavequit=$('bsavequit');
const ovpHint=$('ovp-hint');
const rtitle=$('rtitle'),rdesc=$('rdesc');

// 状态
let isHost=false, isSolo=false;
let netHost=null, netClient=null;
let worker=null, renderer=null;
let lastSnap=null, rafId=null, lastT=0;
let paused=false, gameOver=false;
let selCard=null;
let hand=[];            // [{id, count}]  -- 当前手牌（可直接放置）
let bag=[];             // [{id, stars, lv, exp}]  -- 背包（仓库）
let charProgress={};   // {charId: {stars:0, lv:1, exp:0}}  -- 每种角色的进度
let activeTali=[];
let equipBag=[];        // [{id, uid}] -- 装备库（uid 唯一标识每个装备实例）
let charEquips={};      // {charUid: [equipInstUid, ...]} -- 场上角色已装备的实例uid列表(最多4)
let _eqUidCounter=1;   // 装备实例uid生成器
// 本地玩家资源（从 snap 中更新）
let myGold=100, myHp=20, myWave=1, myScore=0;
let myPid='';           // 我的玩家ID
let myLaneIdx=0;        // 我的通道索引
let waveRunning=false;
let roomPlayers=[];     // [{name,host,conn?,pid,laneIdx}]

// ─── 持久化玩家ID & 存档系统 ───────────────────────────
// 每个浏览器唯一，用于多人存档身份识别
if(!localStorage.getItem('td_persistent_id')){
  localStorage.setItem('td_persistent_id','pid_'+Math.random().toString(36).substr(2,10));
}
const MY_PERSISTENT_ID = localStorage.getItem('td_persistent_id');

// 当前局的 sessionId（房主生成，用于多人存档的唯一标识）
let currentSessionId = '';
// 存档中各客户端已回报的数据 {pid: {bag, charProgress}}
let _saveClientData = {};
// 存档等待回报的 pid 集合
let _savePendingPids = new Set();

// ─── 波次倒计时系统 ─────────────────────────────────
const WAVE_INTERVAL = 90;   // 波次间隔（秒）
let waveCountdownSec = 0;   // 当前剩余秒数
let waveCountdownTimer = null; // setInterval handle
// DOM 元素引用（在 startGame 里初始化）
let _wtimerWrap=null, _wtimerArc=null, _wtimerTxt=null;
const ARC_FULL = 2*Math.PI*16; // 100.53

// ─── 出怪进度条系统 ──────────────────────────────────
let _spawnTimerWrap=null, _spawnTimerBar=null, _spawnTimerTxt=null;
let _spawnTimerTotal=0;   // 本波总出怪时长(ms)
let _spawnTimerElapsed=0; // 已过去时间(ms)
let _spawnTimerRaf=null;  // rAF handle
let _spawnTimerStart=0;   // performance.now() 起始
let _bskip=null;          // 快进按钮

function _startSpawnTimer(durationMs){
  _stopSpawnTimer();
  if(!_spawnTimerWrap) return;
  _spawnTimerTotal = durationMs;
  _spawnTimerElapsed = 0;
  _spawnTimerStart = performance.now();
  _spawnTimerWrap.classList.remove('hidden');
  if(_bskip) _bskip.classList.add('hidden'); // 出怪中隐藏快进
  _updateSpawnTimerUI(0);
  function tick(){
    if(paused){ _spawnTimerRaf=requestAnimationFrame(tick); return; }
    const elapsed = performance.now() - _spawnTimerStart;
    const remaining = Math.max(0, _spawnTimerTotal - elapsed);
    _updateSpawnTimerUI(elapsed);
    if(remaining > 0){
      _spawnTimerRaf=requestAnimationFrame(tick);
    } else {
      // 出怪完毕：显示快进按钮
      _spawnTimerWrap.classList.add('hidden');
      if(_bskip && isHost && !gameOver) _bskip.classList.remove('hidden');
    }
  }
  _spawnTimerRaf=requestAnimationFrame(tick);
}

function _stopSpawnTimer(){
  if(_spawnTimerRaf){ cancelAnimationFrame(_spawnTimerRaf); _spawnTimerRaf=null; }
  if(_spawnTimerWrap) _spawnTimerWrap.classList.add('hidden');
  if(_bskip) _bskip.classList.add('hidden');
}

function _updateSpawnTimerUI(elapsedMs){
  if(!_spawnTimerBar||!_spawnTimerTxt) return;
  const pct = _spawnTimerTotal>0
    ? Math.max(0, 1 - elapsedMs/_spawnTimerTotal)
    : 0;
  _spawnTimerBar.style.width = (pct*100).toFixed(1)+'%';
  const remSec = Math.ceil(Math.max(0, (_spawnTimerTotal - elapsedMs)/1000));
  _spawnTimerTxt.textContent = remSec;
}

function _startWaveCountdown(sec){
  _stopWaveCountdown();
  waveCountdownSec = sec;
  _updateWaveTimerUI();
  if(_wtimerWrap) _wtimerWrap.classList.remove('hidden');
  waveCountdownTimer = setInterval(()=>{
    if(paused) return;                     // 暂停时冻结
    waveCountdownSec--;
    _updateWaveTimerUI();
    if(waveCountdownSec<=0){
      _stopWaveCountdown();
      // 自动发波（仅 host）
      if(isHost && !waveRunning && !gameOver){
        if(!selectedWaveMode.endless && myWave>selectedWaveMode.total){
          showResult(true);
        } else {
          doStartWave();
        }
      }
    }
  }, 1000);
}

function _stopWaveCountdown(){
  if(waveCountdownTimer){ clearInterval(waveCountdownTimer); waveCountdownTimer=null; }
  if(_wtimerWrap) _wtimerWrap.classList.add('hidden');
}

function _updateWaveTimerUI(){
  if(!_wtimerArc||!_wtimerTxt) return;
  const total = WAVE_INTERVAL;
  const pct = Math.max(0, waveCountdownSec) / total;
  // 进度条宽度
  _wtimerArc.style.width = (pct*100).toFixed(1)+'%';
  // 秒数文字
  _wtimerTxt.textContent = Math.max(0,waveCountdownSec);
  // 颜色：<15s 变红提示
  const urgent = waveCountdownSec<=15;
  _wtimerArc.style.background = urgent ? '#f87171' : '#5b9cf6';
  if(_wtimerTxt) _wtimerTxt.style.color = urgent ? '#f87171' : '#fff';
}

// ─── 工具 ───────────────────────────────────────────
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));}
function setSt(el,txt,cls){el.textContent=txt;el.className='st'+(cls?' '+cls:'');}
function showMsg(txt,isErr){
  gmsg.textContent=txt; gmsg.className=isErr?'err':'ok';
  clearTimeout(gmsg._t); gmsg._t=setTimeout(()=>{gmsg.className='';},2200);
}
// ══════════════════════════════════════════════════════════════
// 音效系统（Web Audio API 程序化合成，无需外部音频文件）
// ══════════════════════════════════════════════════════════════
const SFX = (() => {
  let ctx = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let bgmNodes = [];      // 当前 BGM 节点
  let bgmMode = null;     // 'normal' | 'boss'
  let bgmScheduled = false;

  // 音量设置（可被设置面板控制）
  let volMaster = 0.7, volBgm = 0.35, volSfx = 0.8;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain(); masterGain.gain.value = volMaster;
    bgmGain = ctx.createGain();    bgmGain.gain.value = volBgm;
    sfxGain = ctx.createGain();    sfxGain.gain.value = volSfx;
    masterGain.connect(ctx.destination);
    bgmGain.connect(masterGain);
    sfxGain.connect(masterGain);
  }

  function setVol(master, bgm, sfx) {
    volMaster = master; volBgm = bgm; volSfx = sfx;
    if (!ctx) return;
    masterGain.gain.setTargetAtTime(master, ctx.currentTime, 0.1);
    bgmGain.gain.setTargetAtTime(bgm, ctx.currentTime, 0.1);
    sfxGain.gain.setTargetAtTime(sfx, ctx.currentTime, 0.1);
  }

  // ── 工具函数 ──────────────────────────────────────────────
  function osc(type, freq, start, end, dur, gainVal, dest, detune) {
    if (!ctx) return null;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (end !== null) o.frequency.exponentialRampToValueAtTime(end, start + dur);
    if (detune) o.detune.value = detune;
    g.gain.setValueAtTime(gainVal, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(start); o.stop(start + dur + 0.05);
    return { o, g };
  }

  function noise(dur, gainVal, filterFreq, dest) {
    if (!ctx) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq || 800;
    filter.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gainVal, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(filter); filter.connect(g); g.connect(dest || sfxGain);
    src.start(); src.stop(ctx.currentTime + dur + 0.05);
  }

  function reverb(dest) {
    if (!ctx) return dest;
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * 1.5;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
    conv.buffer = buf;
    conv.connect(dest);
    return conv;
  }

  // ── SFX 音效集 ────────────────────────────────────────────

  // 普通攻击（弓弦/剑气）
  function hit(heavy) {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (heavy) {
      // 重击：低频冲击 + 噪声
      osc('sawtooth', 180, t, 40, 0.18, 0.5);
      noise(0.12, 0.3, 300);
    } else {
      // 普通：短促剑击
      osc('square', 600, t, 200, 0.08, 0.25);
      noise(0.05, 0.15, 1200);
    }
  }

  // 范围技能爆发
  function explosion(big) {
    if (!ctx) return;
    const t = ctx.currentTime;
    osc('sawtooth', big ? 120 : 200, t, big ? 30 : 60, big ? 0.5 : 0.3, big ? 0.9 : 0.6);
    noise(big ? 0.6 : 0.35, big ? 0.7 : 0.4, big ? 150 : 400);
    if (big) {
      // 大爆炸加高频余震
      setTimeout(() => {
        if (!ctx) return;
        const t2 = ctx.currentTime;
        osc('sine', 80, t2, 20, 0.4, 0.4);
        noise(0.3, 0.3, 200);
      }, 120);
    }
  }

  // 怪物死亡
  function enemyDie(boss) {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (boss) {
      // Boss 死亡：下沉轰鸣 + 余震
      osc('sawtooth', 200, t, 25, 0.8, 1.0);
      noise(0.8, 0.9, 100);
      osc('sine', 60, t + 0.1, 15, 0.6, 0.7);
      setTimeout(() => { if (ctx) { noise(0.4, 0.5, 180); } }, 300);
    } else {
      osc('triangle', 300, t, 80, 0.2, 0.4);
      noise(0.15, 0.25, 600);
    }
  }

  // 怪物到达终点（扣血）
  function enemyReach() {
    if (!ctx) return;
    const t = ctx.currentTime;
    osc('sawtooth', 120, t, 60, 0.25, 0.6);
    noise(0.2, 0.4, 200);
    osc('sine', 220, t + 0.05, 80, 0.2, 0.5);
  }

  // 角色升星/升级
  function levelUp() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => osc('sine', f, t + i * 0.09, f * 1.02, 0.22, 0.5));
    osc('triangle', 1047, t + 0.36, 2094, 0.35, 0.6);
  }

  // 抽卡获得
  function gacha(rarity) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const freq = { n: 440, r: 554, sr: 659, ssr: 880 }[rarity] || 440;
    osc('sine', freq, t, freq * 2, 0.3, 0.5);
    osc('triangle', freq * 1.5, t + 0.05, freq * 3, 0.25, 0.4);
    if (rarity === 'ssr') {
      osc('sine', 1200, t + 0.15, 2400, 0.4, 0.6);
      osc('sine', 800, t + 0.25, 1600, 0.35, 0.5);
    }
  }

  // 放塔成功
  function placeTower() {
    if (!ctx) return;
    const t = ctx.currentTime;
    osc('sine', 440, t, 660, 0.12, 0.3);
    osc('sine', 880, t + 0.08, 1100, 0.1, 0.25);
  }

  // 怪物激活技能（诅咒/光环等）
  function enemySkill(type) {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (type === 'towDebuff') {
      osc('sawtooth', 180, t, 90, 0.3, 0.5);
      osc('square', 220, t + 0.05, 110, 0.3, 0.4);
    } else if (type === 'revive') {
      osc('sine', 440, t, 880, 0.2, 0.6);
      osc('triangle', 660, t + 0.1, 1320, 0.3, 0.5);
      osc('sine', 880, t + 0.2, 1760, 0.25, 0.5);
    } else if (type === 'speedBurst' || type === 'berserk') {
      osc('square', 300, t, 600, 0.15, 0.4);
      noise(0.1, 0.2, 800);
    } else {
      osc('triangle', 250, t, 125, 0.2, 0.35);
    }
  }

  // 波次开始
  function waveStart(waveNum) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const isBossWave = waveNum % 10 === 0;
    if (isBossWave) {
      // ── Boss 波：三段低沉战鼓 + 号角 ──
      // 战鼓×3
      [0, 0.22, 0.44].forEach(dt => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, t + dt);
        g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.18);
        g.connect(ctx.destination);
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(g);
        src.start(t + dt);
      });
      // 低沉号角
      osc('sawtooth', 55,  t + 0.65, 40, 0.55, 1.2);
      osc('sawtooth', 110, t + 0.70, 80, 0.45, 1.0);
      osc('square',   165, t + 0.75, 120, 0.35, 0.8);
      osc('sawtooth', 82,  t + 1.00, 60, 0.40, 0.9);
    } else {
      // ── 普通波：三音上升号角（清脆警示）──
      const notes = [330, 440, 550];
      notes.forEach((freq, i) => {
        osc('square',   freq,        t + i * 0.12, freq * 1.01, 0.22, 0.35);
        osc('triangle', freq * 1.5,  t + i * 0.12, freq,        0.10, 0.3);
      });
      // 收尾高音确认
      osc('sine', 880, t + 0.42, 1760, 0.18, 0.3);
    }
  }

  // 游戏胜利
  function victory() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const melody = [523, 659, 784, 659, 784, 1047];
    melody.forEach((f, i) => osc('sine', f, t + i * 0.13, f * 1.01, 0.28, 0.6));
    osc('triangle', 1047, t + 0.8, 2094, 0.5, 0.8);
    osc('sine', 784, t + 0.9, 1568, 0.4, 0.7);
  }

  // 游戏失败
  function defeat() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const melody = [440, 392, 349, 330];
    melody.forEach((f, i) => osc('sine', f, t + i * 0.18, f * 0.5, 0.4, 0.6));
    osc('sawtooth', 200, t + 0.6, 80, 0.5, 0.5);
  }

  // ── BGM 系统（程序化环境音乐）────────────────────────────

  // 停止 BGM
  function stopBgm(fadeTime) {
    if (!ctx) return;
    const ft = fadeTime || 1.0;
    bgmGain.gain.setTargetAtTime(0.0001, ctx.currentTime, ft / 4);
    setTimeout(() => {
      bgmNodes.forEach(n => { try { n.stop(); } catch(e) {} });
      bgmNodes = [];
      bgmMode = null;
      bgmScheduled = false;
      bgmGain.gain.setValueAtTime(volBgm, ctx.currentTime);
    }, ft * 1000 + 200);
  }

  // 普通背景音（平缓环境音）
  function startNormalBgm() {
    if (!ctx || bgmMode === 'normal') return;
    if (bgmMode) stopBgm(1.5);
    bgmMode = 'normal';
    bgmScheduled = true;

    const rv = reverb(bgmGain);

    function scheduleAmbient() {
      if (!bgmScheduled || bgmMode !== 'normal') return;
      const t = ctx.currentTime;

      // 低频 pad（持续和弦）
      const padFreqs = [130.81, 164.81, 196.00, 261.63]; // C3 E3 G3 C4
      padFreqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        o.detune.value = (i % 2 === 0 ? 3 : -3); // 轻微失调，增加温暖感
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.06, t + 2.5);
        g.gain.setValueAtTime(0.06, t + 5.5);
        g.gain.linearRampToValueAtTime(0.0001, t + 8.5);
        o.connect(g); g.connect(rv);
        o.start(t); o.stop(t + 9);
        bgmNodes.push(o);
      });

      // 高频水晶颗粒感
      const crystalNotes = [523.25, 659.25, 783.99, 1046.5, 880, 1046.5];
      crystalNotes.forEach((f, i) => {
        const delay = i * 0.9 + Math.random() * 0.3;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + delay);
        g.gain.linearRampToValueAtTime(0.04, t + delay + 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.2);
        o.connect(g); g.connect(rv);
        o.start(t + delay); o.stop(t + delay + 1.3);
        bgmNodes.push(o);
      });

      // 低频心跳式鼓点（轻柔）
      [0, 2.2, 4.4, 6.6].forEach(offset => {
        const startT = t + offset;
        const bufLen = Math.floor(ctx.sampleRate * 0.18);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.12));
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass'; flt.frequency.value = 180;
        const g = ctx.createGain();
        g.gain.value = 0.25;
        src.connect(flt); flt.connect(g); g.connect(bgmGain);
        src.start(startT); src.stop(startT + 0.2);
        bgmNodes.push(src);
      });

      setTimeout(scheduleAmbient, 7500);
    }

    scheduleAmbient();
  }

  // Boss 战 BGM（恢弘紧张）
  function startBossBgm() {
    if (!ctx || bgmMode === 'boss') return;
    if (bgmMode) stopBgm(0.8);
    bgmMode = 'boss';
    bgmScheduled = true;

    const rv = reverb(bgmGain);

    // 节奏型号角和弦序列
    const progression = [
      [110, 138.59, 164.81],  // Am
      [98,  123.47, 146.83],  // Gm
      [116.54, 146.83, 174.61], // Bbm
      [110, 138.59, 164.81],  // Am
    ];

    let progIdx = 0;

    function scheduleBossChord() {
      if (!bgmScheduled || bgmMode !== 'boss') return;
      const t = ctx.currentTime;
      const chord = progression[progIdx % progression.length];
      progIdx++;

      // 厚重和弦（锯齿波）
      chord.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = i * 5;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.15);
        g.gain.setValueAtTime(0.09, t + 1.6);
        g.gain.linearRampToValueAtTime(0.0001, t + 2.1);
        o.connect(g); g.connect(rv);
        o.start(t); o.stop(t + 2.2);
        bgmNodes.push(o);

        // 八度叠加
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'square';
        o2.frequency.value = f * 2;
        g2.gain.setValueAtTime(0.0001, t + 0.05);
        g2.gain.linearRampToValueAtTime(0.04, t + 0.2);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
        o2.connect(g2); g2.connect(rv);
        o2.start(t + 0.05); o2.stop(t + 2.1);
        bgmNodes.push(o2);
      });

      // 战鼓节拍
      const beats = [0, 0.5, 1.0, 1.5, 1.75];
      beats.forEach(offset => {
        const startT = t + offset;
        const isBig = offset === 0 || offset === 1.0;
        const bufLen = Math.floor(ctx.sampleRate * (isBig ? 0.25 : 0.12));
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        const decay = isBig ? 0.18 : 0.08;
        for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * decay));
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.value = isBig ? 120 : 250;
        const g = ctx.createGain();
        g.gain.value = isBig ? 0.55 : 0.3;
        src.connect(flt); flt.connect(g); g.connect(bgmGain);
        src.start(startT); src.stop(startT + (isBig ? 0.3 : 0.15));
        bgmNodes.push(src);
      });

      // 高频战鸣（锣/镲）
      const crashT = t + 0.0;
      const crashBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      const cd = crashBuf.getChannelData(0);
      for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (cd.length * 0.3));
      const crashSrc = ctx.createBufferSource();
      crashSrc.buffer = crashBuf;
      const crashFlt = ctx.createBiquadFilter();
      crashFlt.type = 'highpass'; crashFlt.frequency.value = 4000;
      const cg = ctx.createGain(); cg.gain.value = 0.18;
      crashSrc.connect(crashFlt); crashFlt.connect(cg); cg.connect(bgmGain);
      crashSrc.start(crashT); crashSrc.stop(crashT + 0.55);
      bgmNodes.push(crashSrc);

      setTimeout(scheduleBossChord, 2000);
    }

    scheduleBossChord();
  }

  // ── 公开 API ─────────────────────────────────────────────
  return {
    init,
    setVol,
    play: {
      hit,
      explosion,
      // grade 可为字符串('boss','elite','epic','normal') 或 bool
      enemyDie: (grade) => enemyDie(grade === 'boss' || grade === true),
      enemyReach,
      // starUp=true 时播放升星华彩版（3连音+晶鸣）
      levelUp: (starUp) => {
        if (!ctx) return;
        const t = ctx.currentTime;
        if (starUp) {
          // 升星：华彩上行琶音
          const arp = [523, 659, 784, 1047, 1319, 1568];
          arp.forEach((f, i) => osc('sine', f, t + i * 0.07, f * 1.5, 0.18, 0.55));
          osc('triangle', 1568, t + 0.45, 3136, 0.3, 0.65);
          noise(0.25, 0.15, 2000);
        } else {
          // 升级：短促四音上行
          const notes = [523, 659, 784, 1047];
          notes.forEach((f, i) => osc('sine', f, t + i * 0.09, f * 1.02, 0.22, 0.5));
          osc('triangle', 1047, t + 0.36, 2094, 0.35, 0.6);
        }
      },
      // 抽卡分稀有度入口
      gacha,
      gachaNormal: () => gacha('n'),
      gachaSR:     () => gacha('sr'),
      gachaSSR:    () => {
        gacha('ssr');
        // SSR 额外华彩：高频晶鸣
        if (!ctx) return;
        const t = ctx.currentTime + 0.1;
        [1047, 1319, 1568, 2093, 1568, 1319, 1047].forEach((f, i) =>
          osc('sine', f, t + i * 0.075, f * 1.01, 0.12, 0.4));
        noise(0.4, 0.12, 3500);
      },
      placeTower,
      enemySkill,
      waveStart,
      victory,
      defeat,
    },
    bgm: {
      startNormal: startNormalBgm,
      startBoss: startBossBgm,
      stop: stopBgm,
    },
    get mode() { return bgmMode; },
    get ctx() { return ctx; }
  };
})();

// 首次用户交互时初始化音频上下文（浏览器策略限制）
(function() {
  let inited = false;
  const startAudio = () => {
    if (inited) return;
    inited = true;
    SFX.init();
    SFX.bgm.startNormal();
    document.removeEventListener('click', startAudio);
    document.removeEventListener('keydown', startAudio);
  };
  document.addEventListener('click', startAudio);
  document.addEventListener('keydown', startAudio);
})();

// ── 战斗日志面板逻辑 ──────────────────────────────────
let _gameLogLines=0;
const _gameLogColors={warn:'#fdcb6e',error:'#ff7675',info:'#74b9ff'};
function _pushGameLog(text, level='info'){
  const el=document.getElementById('gameLogEntries');
  if(!el) return;
  _gameLogLines++;
  if(_gameLogLines>300){
    el.innerHTML='';_gameLogLines=1;
  }
  const div=document.createElement('div');
  div.style.cssText=`color:${_gameLogColors[level]||'#c8d0e0'};padding:1px 0;border-bottom:1px solid #ffffff08;word-break:break-all;`;
  div.textContent=text;
  el.appendChild(div);
  el.scrollTop=el.scrollHeight;
  const cnt=document.getElementById('gameLogCount');
  if(cnt) cnt.textContent=_gameLogLines+' 条';
  // 有 warn/error 时让按钮闪烁提示
  if(level==='warn'||level==='error'){
    const btn=document.getElementById('gameLogBtn');
    if(btn){ btn.style.borderColor='#fdcb6e'; setTimeout(()=>{ btn.style.borderColor='#5f8cff55'; },800); }
  }
}
function showGameLogPanel(){
  const btn=document.getElementById('gameLogBtn');
  if(btn) btn.style.display='block';
}

function showBanner(txt, dur=2300, color=null){
  wb.textContent=txt; wb.classList.add('show');
  if(color) wb.style.background=color; else wb.style.background='';
  clearTimeout(wb._t); wb._t=setTimeout(()=>{wb.classList.remove('show');wb.style.background='';},dur);
}

// 技能简称（用于浮动文字）
function skillShortName(sk){
  return {speedBurst:'⚡急速',aura:'✨光环',shield:'🛡护盾',armorUp:'🛡甲强化',
    lifesteal:'💚回血',towDebuff:'💀诅咒',berserk:'🔥狂暴',revive:'🔄复活',composite:'⚔️复合技能'}[sk]||sk;
}
// 技能颜色
function skillColor(sk){
  return {speedBurst:'#ff6b35',aura:'#fdcb6e',shield:'#74b9ff',armorUp:'#b2bec3',
    lifesteal:'#55efc4',towDebuff:'#c084fc',berserk:'#ff4757',revive:'#f39c12',composite:'#d4af37'}[sk]||'#fff';
}

// ─── 加载动画 ────────────────────────────────────────
(function doLoad(){
  const steps=[[25,'校验游戏数据...'],[55,'准备渲染引擎...'],[80,'构建 Worker...'],[100,'加载完成！']];
  let i=0;
  const iv=setInterval(()=>{
    if(i>=steps.length){clearInterval(iv);return;}
    const[p,t]=steps[i++];
    lb.style.width=p+'%'; ltip.textContent=t;
    if(p>=100){clearInterval(iv);setTimeout(()=>{
      showScreen('slob');
      // 加载完成后：渲染存档按钮 + 检测链接自动加入
      renderSaveButtons();
      checkAutoJoinFromUrl();
    },400);}
  },300);
})();

// ─── 大厅逻辑 ────────────────────────────────────────
bsolo.addEventListener('click',()=>{
  isHost=true; isSolo=true;
  myPid='p0'; myLaneIdx=0;
  currentSessionId='sess_'+Math.random().toString(36).substr(2,10);
  roomPlayers=[{name:'单人',host:true,pid:'p0',laneIdx:0,persistentId:MY_PERSISTENT_ID}];
  // 单人也弹出波次选择
  cmenu.classList.add('hidden');
  croom.classList.remove('hidden');
  rcode.textContent='单人模式';
  document.querySelector('.row:has(#rcode)').style.display='none';
  renderPlist();
  renderWavePick(false);
  bstart.disabled=false;
  setSt(rst,'选好波次后点击「开始游戏」');
});

bcreate.addEventListener('click',async()=>{
  if(netHost){netHost.destroy();netHost=null;}
  setSt(lst,'正在创建房间...');
  bcreate.disabled=true;
  netHost=new NetHost();
  try{
    const code=await netHost.open();
    rcode.textContent=code;
    isHost=true; isSolo=false;
    myPid='p0'; myLaneIdx=0;
    currentSessionId='sess_'+Math.random().toString(36).substr(2,10);
    roomPlayers=[{name:'你（房主）',host:true,conn:null,pid:'p0',laneIdx:0,persistentId:MY_PERSISTENT_ID}];
    renderPlist();
    cmenu.classList.add('hidden');
    croom.classList.remove('hidden');
    bstart.disabled=false;
    renderWavePick(false); // 房主可选
    setSt(rst,'等待玩家加入…');
    netHost.onData=buildHostOnData();
  }catch(err){
    setSt(lst,'创建失败：'+err.message,'err');
    bcreate.disabled=false; netHost=null;
  }
});

// ── Host onData 处理函数工厂（创建房间 / 恢复存档 共用）──
function buildHostOnData(){
  return (conn,msg)=>{
      if(msg.type==='join'){
        const pname=msg.name||('玩家'+(roomPlayers.length));
        const pidx=roomPlayers.length;
        const pid='p'+pidx;
        const laneIdx=Math.min(pidx, MAP.lanes.length-1);
        // 生成或沿用持久化ID（恢复存档时从存档中取）
        const clientPersistentId = msg.persistentId||('pid_'+Math.random().toString(36).substr(2,10));
        // 检查是否有存档数据可以恢复
        let restoreData = null;
        if(currentSessionId){
          const save=loadSave(false);
          if(save&&save.sessionId===currentSessionId){
            // 用 persistentId 匹配玩家
            for(const [spid,pdata] of Object.entries(save.players||{})){
              if(pdata.persistentId===clientPersistentId){
                restoreData={pid:spid, data:pdata};
                break;
              }
            }
          }
        }
        const finalPid = restoreData?restoreData.pid:pid;
        const finalLaneIdx = restoreData?
          (roomPlayers.find(r=>r.pid===restoreData.pid)||{laneIdx}).laneIdx : laneIdx;
        roomPlayers.push({name:pname,host:false,conn,pid:finalPid,laneIdx:finalLaneIdx,
                          persistentId:clientPersistentId});
        renderPlist();
        setSt(rst,pname+' 已加入 (P'+(pidx+1)+')');
        // 存储该玩家的 persistentId 到房主本地（供下次存档匹配）
        _savePersistentIdMap(finalPid, clientPersistentId);
        // 告知该客户端它的 pid、laneIdx 和当前波次模式，同时下发其 persistentId
        conn.send({type:'assigned',pid:finalPid,laneIdx:finalLaneIdx,
                   playerCount:roomPlayers.length,modeId:selectedWaveMode.id,
                   persistentId:clientPersistentId,
                   sessionId:currentSessionId,
                   restoreData:restoreData?restoreData.data:null});
        // 若已在游戏中，同步当前状态
        if(lastSnap) conn.send({type:'sync',snap:lastSnap,wave:myWave});
        // 多人存档恢复：刷新等待面板
        if(window._onResumePlayerJoined) window._onResumePlayerJoined();
        renderPlist();
      }
      if(msg.type==='placeTower'&&isHost&&worker){
        worker.postMessage({type:'tower',d:{pid:msg.pid,tower:msg.tower,_returnCard:msg._returnCard}});
      }
      // 客户端收回塔（两种类型均支持）
      if((msg.type==='removeTower'||msg.type==='reqRemoveTower')&&isHost&&worker){
        worker.postMessage({type:'removeTower',d:{pid:msg.pid,uid:msg.uid}});
      }
      // 客户端升星消耗塔（静默）
      if(msg.type==='removeTowerSilent'&&isHost&&worker){
        worker.postMessage({type:'removeTowerSilent',d:{pid:msg.pid,uid:msg.uid}});
      }
      // 客户端 upgradeChar（升星/升级后更新场上塔属性）
      if(msg.type==='upgradeChar'&&isHost&&worker){
        worker.postMessage({type:'upgradeChar',d:msg.d});
      }
      if(msg.type==='gacha'&&isHost&&worker){
        // 全部交由 Worker 权威处理（Worker 内部扣金、随机、回报结果）
        worker.postMessage({type:'gacha',d:{pid:msg.pid,n:msg.n,tierId:msg.tierId||'r'}});
        // Worker 的 gachaResult 会广播到所有人（在 snap 处理逻辑里转发给对应客户端）
      }
      if(msg.type==='tali'&&isHost&&worker){
        worker.postMessage({type:'tali',d:{pid:msg.pid,tali:msg.tali}});
      }
      if(msg.type==='buySlot'&&isHost&&worker){
        worker.postMessage({type:'buySlot',d:msg.d});
      }
      // 客户端购买装备扣金
      if(msg.type==='spendGold'&&isHost&&worker){
        worker.postMessage({type:'spendGold',d:msg.d});
      }
      // 客户端出售背包卡请求金币（联机模式）
      if(msg.type==='reqAddGold'&&isHost&&worker){
        worker.postMessage({type:'addGold',d:{pid:msg.pid,amount:msg.amount}});
      }
      if(msg.type==='reqWave'&&isHost&&worker){
        doStartWave();
      }
      // 客户端上报存档数据
      if(msg.type==='saveReport'&&isHost){
        _saveClientData[msg.pid]={bag:msg.bag,charProgress:msg.charProgress,equipState:msg.equipState||null};
        _savePendingPids.delete(msg.pid);
        if(_savePendingPids.size===0){
          // 所有客户端都已回报，执行最终存档
          _doFinalSave();
        }
      }
  }; // end return
} // end buildHostOnData

bjoin.addEventListener('click',async()=>{
  const code=icode.value.trim();
  if(!code){setSt(lst,'请输入房间码','err');return;}
  setSt(lst,'连接中…');
  bjoin.disabled=true;
  if(netClient){netClient.destroy();netClient=null;}
  netClient=new NetClient();
  try{
    await netClient.connect(code);
    isHost=false; isSolo=false;
    const myName='玩家'+(Math.random()*90+10|0);
    netClient.send({type:'join',name:myName,persistentId:MY_PERSISTENT_ID});
    rcode.textContent=code;
    roomPlayers=[{name:myName,host:false}];
    renderPlist();
    cmenu.classList.add('hidden');
    croom.classList.remove('hidden');
    bstart.disabled=true;
    setSt(rst,'已加入，等待房主开始…');
    setSt(lst,'');
    netClient.onData=onNetMsg;
  }catch(err){
    setSt(lst,'连接失败：'+err.message,'err');
    bjoin.disabled=false; netClient=null;
  }
});

bcopy.addEventListener('click',()=>{
  navigator.clipboard.writeText(rcode.textContent).then(()=>{
    bcopy.textContent='已复制！';
    setTimeout(()=>bcopy.textContent='复制',2000);
  }).catch(()=>alert('房间码：'+rcode.textContent));
});

bstart.addEventListener('click',()=>{
  if(!isHost)return;
  // 检查是否是多人存档恢复且有玩家缺席
  const missing=window._expectedPlayers
    ?window._expectedPlayers.filter(e=>!roomPlayers.some(r=>r.pid===e.pid))
    :[];
  if(missing.length>0){
    // 有玩家未到，弹出警告
    const missingNames=missing.map(e=>e.name||e.pid).join('、');
    showSellConfirm(
      `⚠️ 以下玩家尚未加入：\n【${missingNames}】\n\n直接开始后：\n• 该玩家守卫的通道将消失\n• 该玩家本局存档数据将丢失\n\n确认不等直接恢复？`,
      ()=>{
        window._expectedPlayers=window._expectedPlayers.filter(e=>roomPlayers.some(r=>r.pid===e.pid));
        _doStartGame();
      },
      '直接恢复'
    );
  } else {
    _doStartGame();
  }
});

function _doStartGame(){
  // 清理恢复等待 UI
  window._onResumePlayerJoined=null;
  window._expectedPlayers=null;
  const old=document.getElementById('resume-wait-panel');
  if(old) old.remove();
  // 重置 bstart 文字
  bstart.textContent='开始游戏';
  // 恢复 cwavepick 可见性（供下次正常创建房间使用）
  cwavepick.style.display='';
  // 还原单人模式隐藏的行
  const rcodeRow=document.querySelector('.row:has(#rcode)');
  if(rcodeRow) rcodeRow.style.display='';
  // 广播 start 消息
  const assignment=roomPlayers.map(p=>({pid:p.pid,laneIdx:p.laneIdx,name:p.name}));
  if(!isSolo) netHost&&netHost.broadcast({type:'start',assignment,modeId:selectedWaveMode.id});
  startGame();
}

bleave.addEventListener('click',()=>{
  netHost&&netHost.destroy(); netHost=null;
  netClient&&netClient.destroy(); netClient=null;
  isHost=false; isSolo=false;
  // 重置装备状态
  resetEquipState();
  // 清理恢复状态
  window._resumeSave=null; window._resumeWave=null;
  window._expectedPlayers=null; window._onResumePlayerJoined=null;
  const rwp=document.getElementById('resume-wait-panel');
  if(rwp) rwp.remove();
  cwavepick.style.display='';
  bstart.textContent='开始游戏';
  bstart.disabled=true;
  croom.classList.add('hidden');
  cmenu.classList.remove('hidden');
  bcreate.disabled=false; bjoin.disabled=false;
  setSt(lst,''); setSt(rst,'');
  renderSaveButtons();
});

function renderPlist(){
  plist.innerHTML=roomPlayers.map(p=>
    `<li><div class="ava">${(p.name||'?')[0]}</div><span>${p.name||'?'}</span>
     ${p.laneIdx!=null?'<span style="font-size:10px;color:var(--muted);margin-left:4px">P'+(p.laneIdx+1)+'通道</span>':''}
     ${p.host?'<span class="bhost">主机</span>':''}</li>`
  ).join('');
}

// 检测 URL 中是否有房间码
(function(){
  try{const c=new URLSearchParams(location.search).get('room');if(c){icode.value=c;setSt(lst,'检测到房间码，点击"加入"即可连接');}}catch(_){}
})();

// ─── 游戏启动 ─────────────────────────────────────────
function startGame(){
  showScreen('sg');
  // ── 存档恢复模式 ──
  const resume=window._resumeSave;
  if(resume){
    // 不重置背包和进度（已在 resumeSoloSave/resumeMultiSave 中恢复）
    myGold=100; myHp=20; myScore=0;  // Worker 会用存档值覆盖
    myWave=resume.wave||1;
  } else {
    myGold=100; myHp=20; myWave=1; myScore=0;
    bag=[]; charProgress={};
    resetEquipState();
  }
  waveRunning=false; paused=false; gameOver=false;
  activeTali=[]; selectedTower=null; hand=[];
  updateHud(); buildPanel(); renderBag(); renderHand();

  // 绑定倒计时 DOM
  _wtimerWrap = document.getElementById('wave-timer-wrap');
  _wtimerArc  = document.getElementById('wave-timer-arc');
  _wtimerTxt  = document.getElementById('wave-timer-txt');
  // 绑定出怪进度条 DOM
  _spawnTimerWrap = document.getElementById('spawn-timer-wrap');
  _spawnTimerBar  = document.getElementById('spawn-timer-bar');
  _spawnTimerTxt  = document.getElementById('spawn-timer-txt');
  // 绑定快进按钮
  _bskip = document.getElementById('bskip');
  if(_bskip){
    _bskip.onclick = ()=>{
      if(!isHost||gameOver) return;
      // 直接发下一波（跳过剩余等待时间）
      _stopSpawnTimer();
      _stopWaveCountdown();
      if(!waveRunning){
        const hasNext = selectedWaveMode.endless || myWave<=selectedWaveMode.total;
        if(hasNext) doStartWave();
        else showResult(true);
      }
      _bskip.classList.add('hidden');
    };
  }
  // 游戏开始 → 立即启动第一波 90s 倒计时
  if(isHost) _startWaveCountdown(WAVE_INTERVAL);

  const laneCount=isSolo?1:Math.min(roomPlayers.length, MAP.lanes.length);
  renderer=new Renderer(gc);
  renderer.setMap(MAP, laneCount);
  renderer.myPid=myPid;
  // 右键取消手牌选中
  renderer.onRightClick=()=>{
    if(selCard){selCard=null;renderer.selTile=null;renderHand();showMsg('已取消选中');}
    else if(selectedTower) clearTowerDetail();
  };

  if(isHost){
    // 构建路径数组
    // 每个 lane 生成3条并行路径，分别分配给3个独立的 laneQueue slot
    const paths=[];
    for(let i=0;i<laneCount;i++){
      // getLanePaths 返回3个描述符 {path, pxOff, laneIdx, subIdx}
      const threePaths=getLanePaths(i);
      for(const p of threePaths) paths.push(p);
    }
    // 构建玩家信息
    const playersDef=roomPlayers.slice(0,laneCount).map((p,i)=>({id:p.pid,laneIdx:i}));

    const blob=new Blob([WK],{type:'text/javascript'});
    worker=new Worker(URL.createObjectURL(blob));
    worker.onmessage=ev=>{
      const msg=ev.data;
      // 调试消息
      if(msg.type==='_dbg'){console.log('[Worker]',msg.msg);return;}
      // ── 战斗日志（从 Worker 收到）──
      if(msg.type==='gameLog'){
        showGameLogPanel();
        msg.logs.forEach(entry=>{
          const t=new Date(entry.t);
          const ts=[t.getHours(),t.getMinutes(),t.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
          const d=entry.data;
          let text=`[${ts}][${entry.level.toUpperCase()}] ${entry.msg}`;
          if(d) text+=` | dmg:${d.dmg} eHP:${d.eHp} 怪:${d.eName||''} 塔:${d.tower} [${(d.syns||[]).join(',')}]`;
          _pushGameLog(text, entry.level);
        });
        return;
      }
      // ── 快照：广播给所有客户端，自己也更新 ──
      if(msg.type==='snap'){
        onWorkerSnap(msg.d);
        return;
      }
      // ── 以下消息按 pid 路由：pid===myPid 自己处理，否则转发 ──
      const targetPid=msg.pid;
      if(targetPid&&targetPid!==myPid){
        // 转发给对应客户端
        const rp=roomPlayers.find(p=>p.pid===targetPid);
        if(rp&&rp.conn) netHost&&netHost.send(rp.conn, msg);
        return;
      }
      // 自己是消息目标，本地处理
      if(msg.type==='gachaResult'){
        if(!msg.ok){showMsg(msg.reason||'抽卡失败',true);setSt(gst,'');return;}
        msg.got.forEach(id=>addCardToBag(id));
        renderHand(); renderBag();
        checkAllStarUp();
        // 显示抽卡结果弹窗
        window._handleGachaResultExtra&&window._handleGachaResultExtra(msg);
        const names=msg.got.map(id=>(CHAR_MAP[id]||{name:id}).name).join('、');
        setSt(gst,'✨ 抽到：'+names,'ok');
        clearTimeout(gst._t); gst._t=setTimeout(()=>setSt(gst,''),3000);
      }
      if(msg.type==='towerDeny'){
        showMsg('⚠ 放置失败：'+msg.reason, true);
        if(msg._returnCard){
          addCardToBag(msg._returnCard);
          renderHand(); renderBag();
        }
      }
      // 经验更新
      if(msg.type==='expGain'){
        applyExpGain(msg.gains); // [{id,exp}]
      }
      // ── 战斗日志接收 ──
      if(msg.type==='gameLog'){
        msg.logs.forEach(entry=>{
          const t=new Date(entry.t);
          const ts=t.getHours().toString().padStart(2,'0')+':'+t.getMinutes().toString().padStart(2,'0')+':'+t.getSeconds().toString().padStart(2,'0');
          const d=entry.data;
          let text=`[${ts}][${entry.level.toUpperCase()}] ${entry.msg}`;
          if(d) text+=` | 伤害:${d.dmg||''} 怪物HP:${d.eHp||''} 怪:${d.eName||''} 塔:${d.tower||''} 羁绊:[${(d.syns||[]).join(',')}]`;
          _pushGameLog(text, entry.level);
        });
      }
      if(msg.type==='waveStarted'){
        waveRunning=true; bnw.disabled=true;
        showBanner('第 '+msg.wave+' 波！');
        // 启动出怪进度条
        if(msg.spawnDuration) _startSpawnTimer(msg.spawnDuration);
        // 音效：波次号角 + BGM 切换
        SFX.play.waveStart(msg.wave);
        const isBossWave = msg.wave % 10 === 0;
        if(isBossWave) SFX.bgm.startBoss();
        else if(SFX.mode === 'boss') SFX.bgm.startNormal();
        // 也广播给所有客户端
        netHost&&netHost.broadcast(msg);
        // ── 触发存档 ──
        triggerSave();
        // ── 装备铺：每波自动刷新（免费） ──
        _equipShopAutoRefreshed = false;
        autoRefreshEquipShopOnWave();
      }
      if(msg.type==='taliApplied'){
        bnw.disabled=false;
        // 符咒获取提示
        if(msg.taliName){
          showBanner('🎴 '+msg.taliName+' 已激活！', 2000, '#fbbf24');
        }
      }
      // ── 羁绊激活华丽特效 ─────────────────────────────────
      if(msg.type==='synergyActivated'&&msg.pid===myPid){
        const tierLabel=msg.tier>=9?'⚡究极':msg.tier>=6?'✨强效':'🔥激活';
        const tierColor=msg.tier>=9?'#f59e0b':msg.tier>=6?'#a78bfa':'#34d399';
        // 顶部大横幅
        showBanner(`${msg.emoji} ${msg.name} ${tierLabel}！[${msg.tier}件套]`, 3000, tierColor);
        // 渲染器粒子爆发
        if(renderer){
          renderer.synActivations=renderer.synActivations||[];
          renderer.synActivations.push({
            emoji:msg.emoji, name:msg.name, tier:msg.tier,
            color:tierColor, life:180, maxLife:180,
            x:window.innerWidth/2, y:window.innerHeight*0.35
          });
        }
        SFX.play&&SFX.play.levelUp&&SFX.play.levelUp();
      }
      // ── 羁绊专属符咒激活通知 ────────────────────────────────
      if(msg.type==='synTaliApplied'&&msg.pid===myPid){
        const synDef=SYNERGIES.find(s=>s.id===msg.synTarget);
        const synName=synDef?synDef.name:msg.synTarget;
        const synEmoji=synDef?synDef.emoji:'✨';
        showBanner(`${synEmoji} 【${synName}之咒】已深度强化！`, 2500, '#c084fc');
      }
      // 升星静默移除塔（不退卡，只刷新界面）
      if(msg.type==='towerRemovedSilent'){
        renderHand(); renderBag();
      }
      // 塔被成功收回 → 把卡加回背包；若是出售操作则跳过退卡
      if(msg.type==='towerRemoved'){
        const charId=msg.charId;
        const retUid=msg.uid;
        // 检查是否是出售操作（用 uid Set 精确识别）
        if(window._sellUids&&window._sellUids.has(retUid)){
          // 出售路径：已在 doSellTower 里发金币，这里只刷新 UI
          window._sellUids.delete(retUid);
          renderHand(); renderBag();
        } else {
          // 普通收回路径：退卡到背包
          addCardToBag(charId);
          if(window._pendingMoveToHand&&(window._pendingMoveToHand[charId]||0)>0){
            window._pendingMoveToHand[charId]--;
            const c=CHAR_MAP[charId];
            if(c){
              selCard=c; selCard._fromBag=true;
              showMsg((c.name||charId)+' 已收回，点击地图格子重新放置 ▶');
            }
          } else {
            showMsg('已收回 '+(CHAR_MAP[charId]?CHAR_MAP[charId].name:charId));
          }
          renderHand(); renderBag();
        }
      }
      // 怪物技能激活提示（Boss/史诗特效文字）
      if(msg.type==='towerOk'){
        SFX.play.placeTower();
      }
      if(msg.type==='enemySkill'){
        SFX.play.enemySkill(msg.skill);
        const grade=msg.grade||'boss';
        const isImportant=msg.skill==='revive'||msg.skill==='composite'||grade==='boss';
        if(isImportant){
          showBanner('⚠️ '+msg.name+' 激活技能！',2000,'#c084fc');
        }
        // 注入浮动文字到渲染器
        if(renderer&&msg.x!=null&&msg.y!=null){
          renderer.floatTexts=renderer.floatTexts||[];
          renderer.floatTexts.push({
            x:msg.x, y:msg.y,
            text:msg.name+' '+skillShortName(msg.skill),
            color:skillColor(msg.skill),
            life:90, maxLife:90, vy:-0.8
          });
        }
      }
      // ── 伤害飘字 ──────────────────────────────────────
      if(msg.type==='floatDmg'&&renderer){
        renderer.floatTexts=renderer.floatTexts||[];
        // 限制同帧飘字数量，避免几十个同时出现造成卡顿
        if(renderer.floatTexts.length<80){
          renderer.floatTexts.push({
            x:msg.x, y:msg.y,
            text:String(msg.text),
            color:msg.crit?'#ffd700':msg.big?'#ff6b6b':'#ffffff',
            life:55, maxLife:55, vy:-1.1,
            fontSize: msg.crit?14:msg.big?12:10
          });
        }
      }
      // ── 购买人口结果 ───────────────────────────────────
      if(msg.type==='buySlotResult'){
        if(!msg.ok){ showMsg('❌ '+msg.reason, true); return; }
        showMsg('✅ 人口扩展！现可上阵 '+msg.slotLimit+' 名角色', false);
        SFX.play.placeTower();
        updateHud();
      }

      // ── 技能质变全屏特效 ─────────────────────────────────────────
      if(msg.type==='skillUlt'&&msg.pid===myPid){
        // 地图上的质变爆炸粒子环
        if(renderer&&msg.x!=null){
          renderer.skillUlts=renderer.skillUlts||[];
          renderer.skillUlts.push({
            x:msg.x, y:msg.y, color:msg.color,
            name:msg.towerName, label:msg.label,
            cid:msg.cid||'', rarity:msg.rarity||'n',
            stars:msg.stars||0, syns:msg.syns||[],
            tx:msg.tx!=null?msg.tx:msg.x,  // 目标x
            ty:msg.ty!=null?msg.ty:msg.y,  // 目标y
            extra:msg.extra||{},
            life:120, maxLife:120
          });
        }
      }

      // ── 直接音效事件（来自 Worker 的 sfx 消息）──
      if(msg.type==='sfx'){
        switch(msg.sfx){
          case 'hit':         SFX.play.hit(msg.heavy); break;
          case 'enemyDie':    SFX.play.enemyDie(msg.grade); break;
          case 'enemyReach':  SFX.play.enemyReach(); break;
          default: break;
        }
      }
    };
    // 构建存档恢复数据
    const resumeData=window._resumeSave?{
      wave: window._resumeSave.wave||1,
      players: Object.fromEntries(
        Object.entries(window._resumeSave.players||{}).map(([pid,pd])=>[pid,{
          gold:pd.gold||100, hp:pd.hp||20, score:pd.score||0,
          towers:pd.towers||[], tali:pd.tali||[], slotLimit:pd.slotLimit||4
        }])
      )
    }:null;
    // 把主线程已重建好的 syns 映射传给 Worker，用于重建 SYN_DEF.chars
    const charSynMap={};
    for(const c of CHARS) charSynMap[c.id]=c.syns||[];

    worker.postMessage({type:'init',d:{
      players:playersDef, paths, ts:MAP.ts,
      totalWaves:selectedWaveMode.total,
      endless:selectedWaveMode.endless,
      blitz:selectedWaveMode.blitz||false,
      resumeData,
      charSynMap
    }});
    // 清除恢复标记
    window._resumeSave=null;
    window._resumeWave=null;
  }

  gc.addEventListener('click',onCanvasClick);
  // 检测第1波是否含 Boss
  checkNextWaveBoss(1);
  lastT=performance.now();
  (function loop(t){
    const dt=t-lastT; lastT=t;
    if(!paused&&renderer&&lastSnap) renderer.draw(dt);
    rafId=requestAnimationFrame(loop);
  })(lastT);
}

// Worker 快照回调（Host 专用）—— 纯转发，不做任何状态判断
function onWorkerSnap(snap){
  lastSnap=snap;
  renderer&&renderer.push(snap);
  applySnap(snap);  // 统一处理
  if(!isSolo&&netHost){
    netHost.broadcast({type:'snap',snap});
  }
}

// 统一处理快照（Host/Client 共用）
function applySnap(snap){
  const ps=snap.players&&snap.players[myPid];
  if(ps){
    myGold=ps.gold; myHp=ps.hp; myScore=ps.score;
    renderSynergy(ps.activeSynergies||[], ps.synergyBufs||{});
  }
  myWave=snap.wave;
  updateHud();
  // 更新 Boss 血条
  updateBossBar(snap);
  if(snap.waveComplete&&waveRunning){
    waveRunning=false;
    bnw.disabled=false;
    // 波次结束：停止出怪计时器（队列已空）
    _stopSpawnTimer();
    // 波次结束：Boss 波结束后切回普通 BGM
    if(SFX.mode === 'boss') SFX.bgm.startNormal();
    // 波次结束：检测下一波是否有 Boss
    checkNextWaveBoss(myWave);
    offerTali();
    // 波次结束：装备掉落（每4波一次）
    rollEquipDrop(myWave);
    // 波次结束：启动下一波 90s 倒计时（host 才计时自动发波）
    if(isHost && !gameOver){
      // 检查是否还有下一波
      const hasNext = selectedWaveMode.endless || myWave<=selectedWaveMode.total;
      if(hasNext) _startWaveCountdown(WAVE_INTERVAL);
    }
  }
  if(snap.gameOver&&!gameOver){
    gameOver=true;
    SFX.play.defeat(); SFX.bgm.stop(2.0);
    showResult(false);
  }
  if(snap.victory&&!gameOver){
    gameOver=true;
    SFX.play.victory(); SFX.bgm.stop(2.0);
    showResult(true);
  }
}

// 客户端收到 host 消息 —— 纯表现层，不做权威判断
function onNetMsg(msg){
  if(msg.type==='assigned'){
    myPid=msg.pid; myLaneIdx=msg.laneIdx;
    setSt(rst,'已分配 P'+(msg.laneIdx+1)+' 通道，等待开始…');
    // 保存房主分配的 persistentId（覆盖本地，以房主为准）
    if(msg.persistentId){
      localStorage.setItem('td_persistent_id', msg.persistentId);
    }
    // 保存 sessionId 供后续存档使用
    if(msg.sessionId) currentSessionId = msg.sessionId;
    // 恢复存档数据（若有）
    if(msg.restoreData){
      const rd=msg.restoreData;
      if(rd.bag) bag=rd.bag;
      if(rd.charProgress) charProgress=rd.charProgress;
      renderHand(); renderBag();
      showMsg('📂 存档已恢复，欢迎回来！');
    }
    // 客户端也渲染只读波次面板（同步房主当前选择）
    if(msg.modeId){
      const m=WAVE_MODES.find(x=>x.id===msg.modeId);
      if(m) selectedWaveMode=m;
    }
    renderWavePick(true);
    return;
  }
  if(msg.type==='waveMode'){
    // 房主实时变更波次模式时同步给客户端（只读显示）
    const m=WAVE_MODES.find(x=>x.id===msg.modeId);
    if(m){ selectedWaveMode=m; renderWavePick(true); }
    return;
  }
  if(msg.type==='start'){
    if(msg.assignment){
      // 用 Host 发来的完整玩家列表重建 roomPlayers，确保 laneCount 正确
      roomPlayers=msg.assignment.map(a=>({
        name:a.name||a.pid, pid:a.pid, laneIdx:a.laneIdx, host:a.pid==='p0'
      }));
      const me=msg.assignment.find(a=>a.pid===myPid);
      if(me) myLaneIdx=me.laneIdx;
    }
    // 同步波次模式
    if(msg.modeId){
      const m=WAVE_MODES.find(x=>x.id===msg.modeId);
      if(m) selectedWaveMode=m;
    }
    startGame(); return;
  }
  if(msg.type==='snap'||msg.type==='sync'){
    const snap=msg.snap;
    if(!snap)return;
    lastSnap=snap;
    renderer&&renderer.push(snap);
    applySnap(snap);   // 统一处理，和 Host 完全一致
  }
  // Host Worker 的 waveStarted 广播给客户端
  if(msg.type==='reqSaveData'){
    // 房主请求上报存档数据
    netClient&&netClient.send({type:'saveReport',pid:myPid,
      bag:JSON.parse(JSON.stringify(bag)),
      charProgress:JSON.parse(JSON.stringify(charProgress)),
      equipState:serializeEquipState()});
    return;
  }
  if(msg.type==='hostSavedAndQuit'){
    // 房主已保存并退出，提示客户端可以安全退出
    showBanner(`💾 房主已保存第${msg.wave}波进度，你可以暂停后退出`, 4000, '#34d399');
    // 客户端暂停面板：解锁「直接退出」并更新提示
    if(ovpHint) ovpHint.textContent='✅ 存档已由房主保存，可以直接退出';
    return;
  }
  if(msg.type==='hostQuit'){
    // 房主直接退出（未保存），通知客户端
    showBanner('⚠️ 房主已退出，本局存档未保存', 3000, '#f87171');
    // 强制退出到主菜单（连接已断）
    setTimeout(()=>_executeQuit(false), 2000);
    return;
  }
  if(msg.type==='waveStarted'){
    waveRunning=true; bnw.disabled=true;
    const wTotal=selectedWaveMode&&selectedWaveMode.endless?'∞':(selectedWaveMode?selectedWaveMode.total:WAVES.length);
    showBanner('第 '+msg.wave+' 波  / '+wTotal+'！');
    // 启动出怪进度条
    if(msg.spawnDuration) _startSpawnTimer(msg.spawnDuration);
    // ── 装备铺：每波自动刷新（免费） ──
    _equipShopAutoRefreshed = false;
    autoRefreshEquipShopOnWave();
  }
  // 抽卡结果（来自 Host Worker 经由 NetHost 转发）
  if(msg.type==='gachaResult'){
    if(!msg.ok){showMsg(msg.reason||'抽卡失败',true);setSt(gst,'');return;}
    msg.got.forEach(id=>addCardToBag(id));
    renderHand(); renderBag();
    checkAllStarUp();
    window._handleGachaResultExtra&&window._handleGachaResultExtra(msg);
    const names=msg.got.map(id=>(CHAR_MAP[id]||{name:id}).name).join('、');
    setSt(gst,'✨ 抽到：'+names,'ok');
    clearTimeout(gst._t); gst._t=setTimeout(()=>setSt(gst,''),3000);
  }
  if(msg.type==='towerRemoved'){
    const charId=msg.charId;
    const retUid=Number(msg.uid);
    // 出售操作：跳过退卡（金币已在 doSellTower 里发放）
    if(window._sellUids&&window._sellUids.has(retUid)){
      window._sellUids.delete(retUid);
      renderHand(); renderBag();
    } else {
      addCardToBag(charId);
      if(window._pendingMoveToHand&&(window._pendingMoveToHand[charId]||0)>0){
        window._pendingMoveToHand[charId]--;
        const c=CHAR_MAP[charId];
        if(c){ selCard=c; selCard._fromBag=true;
          showMsg((c.name||charId)+' 已收回，点击地图格子重新放置 ▶'); }
      } else { showMsg('已收回 '+(CHAR_MAP[charId]?CHAR_MAP[charId].name:charId)); }
      renderHand(); renderBag();
    }
  }
  if(msg.type==='towerRemovedSilent'){
    renderHand(); renderBag();
  }
  if(msg.type==='towerDeny'){
    showMsg('⚠ 放置失败：'+msg.reason,true);
    if(msg._returnCard){
      addCardToBag(msg._returnCard);
      renderHand(); renderBag();
    }
  }
  if(msg.type==='expGain'){
    applyExpGain(msg.gains);
  }
  if(msg.type==='taliApplied'){
    // 服务端确认符咒已应用，无需本地做任何事（snap 会同步数据）
    bnw.disabled=false;
  }
  if(msg.type==='buySlotResult'){
    if(!msg.ok){ showMsg('❌ '+msg.reason, true); return; }
    showMsg('✅ 人口扩展！现可上阵 '+msg.slotLimit+' 名角色', false);
    SFX.play.placeTower();
    updateHud();
  }
  // ── 装备同步（客户端→Host：转发给所有人）──
  if(msg.type==='equipSync'){
    // 客户端广播自己的装备，host 只用作记录（各人只能操作自己的装备）
    // host 转发 equipSyncAll（含发送者数据）给其他客户端
    if(isHost && netHost){
      netHost.broadcast({type:'equipSyncAll', fromPid:msg.fromPid||myPid,
        charEquips:msg.charEquips, equipBag:msg.equipBag});
    }
  }
  // ── 装备同步（Host→客户端：收到更新）──
  if(msg.type==='equipSyncAll'){
    // 仅影响自己的装备（其他玩家装备加成由 Worker snap 负责）
    // 此处可根据 fromPid 更新全局可见的装备状态（如显示其他玩家装备图标）
  }
}

// ─── HUD ─────────────────────────────────────────────
function updateHud(){
  const wTotal=selectedWaveMode&&selectedWaveMode.endless?'∞':
               (selectedWaveMode?selectedWaveMode.total:WAVES.length);
  hw.textContent=myWave+'/'+wTotal;
  hh.textContent=myHp;
  hg.textContent=myGold;
  hs.textContent=myScore;
  // 人口显示
  const hpop=$('hpop');
  if(hpop&&lastSnap&&lastSnap.players&&lastSnap.players[myPid]){
    const pd=lastSnap.players[myPid];
    const limit=pd.slotLimit||4;
    const used=(pd.towers||[]).length;
    hpop.textContent=used+'/'+limit;
    hpop.style.color=(used>=limit)?'#f87171':'';
  }
}

// ─── Boss 系统 ────────────────────────────────────────
const bossbar    = $('bossbar');
const bossbico   = $('bossbico');
const bossbname  = $('bossbname');
const bossbfill  = $('bossbfill');
const bossbhp    = $('bossbhp');
const bossalert  = $('bossalert');
const bossalertbtn  = $('bossalertbtn');
const bossalertico  = $('bossalertico');
const bossalerttxt  = $('bossalerttxt');
const bossalertsub  = $('bossalertsub');
const bossmodal     = $('bossmodal');
const bossmodalclose= $('bossmodalclose');
const bossmodalok   = $('bossmodalok');
const bossmdico     = $('bossmdico');
const bossmdname    = $('bossmdname');
const bossmdstats   = $('bossmdstats');
const bossmdtip     = $('bossmdtip');

let _pendingBossData = null; // 下一波的Boss数据

// 检测下一波是否含 Boss，并显示预告按钮
function checkNextWaveBoss(nextWave){
  const eg = generateWaveData(nextWave);
  const bossEntry = eg.find(g => ENEM_MAP[g.id] && ENEM_MAP[g.id].boss);
  if(!bossEntry){ hideBossAlert(); return; }
  const bd = ENEM_MAP[bossEntry.id];
  _pendingBossData = bd;
  // 定位浮动按钮：放在 canvas 左上角偏下
  const rect = gc.getBoundingClientRect();
  const sgRect = sg.getBoundingClientRect();
  bossalert.style.left  = (rect.left - sgRect.left + 14) + 'px';
  bossalert.style.top   = (rect.top  - sgRect.top  + 60) + 'px';
  bossalert.style.display = 'block';
  bossalertico.textContent = bd.ico || '💀';
  bossalerttxt.textContent = '⚠ 下一波：' + bd.name;
  bossalertsub.textContent = '第 ' + nextWave + ' 波 · 点击查看详情';
}

function hideBossAlert(){
  _pendingBossData = null;
  bossalert.style.display = 'none';
}

// 打开 Boss 详情弹窗
function openBossModal(bd){
  if(!bd) return;
  bossmdico.textContent  = bd.ico || '💀';
  bossmdname.textContent = bd.name;
  bossmdstats.innerHTML  = `
    <div class="bossstat"><div class="blbl">💖 生命值</div><div class="bval">${bd.hp}<span class="bunit"> HP</span></div></div>
    <div class="bossstat"><div class="blbl">⚡ 移动速度</div><div class="bval">${bd.speed}<span class="bunit"> px/s</span></div></div>
    <div class="bossstat"><div class="blbl">💰 击杀奖励</div><div class="bval">${bd.reward}<span class="bunit"> 金</span></div></div>
    <div class="bossstat"><div class="blbl">📏 体型</div><div class="bval">${bd.r*2}<span class="bunit"> px</span></div></div>
  `;
  bossmdtip.textContent = bd.tip || '强大的BOSS，请做好准备！';
  bossmodal.classList.remove('hidden');
}

// 关闭 Boss 弹窗
function closeBossModal(){ bossmodal.classList.add('hidden'); }
bossmodalclose.addEventListener('click', closeBossModal);
bossmodalok.addEventListener('click', closeBossModal);
bossmodal.addEventListener('click', e=>{ if(e.target===bossmodal) closeBossModal(); });

// 详情侧边抽屉关闭按钮
$('drawer-close').addEventListener('click', ()=>closeDrawer());

// 预告按钮点击 → 打开弹窗
bossalertbtn.addEventListener('click', ()=> openBossModal(_pendingBossData));

// 更新 Boss 血条（每帧从 snap 中找 boss 实体）
function updateBossBar(snap){
  if(!snap || !snap.enemies){ bossbar.classList.add('hidden'); return; }
  const boss = snap.enemies.find(e => e.boss);
  if(!boss){ bossbar.classList.add('hidden'); return; }
  const bd = ENEM_MAP[boss.eid] || {};
  bossbar.classList.remove('hidden');
  bossbico.textContent  = bd.ico || '💀';
  bossbname.textContent = boss.name || bd.name || 'BOSS';
  const pct = Math.max(0, boss.hp / boss.maxHp);
  bossbfill.style.width = (pct * 100) + '%';
  // 血条颜色随血量变化
  if(pct > 0.6)       bossbfill.style.background = 'linear-gradient(90deg,#7c3aed,#c084fc,#e879f9)';
  else if(pct > 0.3)  bossbfill.style.background = 'linear-gradient(90deg,#ea580c,#f97316,#fbbf24)';
  else                bossbfill.style.background = 'linear-gradient(90deg,#dc2626,#ef4444,#f87171)';
  bossbhp.textContent = Math.ceil(boss.hp) + ' / ' + boss.maxHp;
}

// ─── 动态波次生成（支持无尽/超范围）─────────────────────
function generateWaveData(waveNum){
  // 优先取预设
  if(waveNum<=WAVES.length) return WAVES[waveNum-1].eg;
  // ── 动态无尽模式（51波+）────────────────────────────
  const tier=Math.floor((waveNum-51)/10); // 0=51-60, 1=61-70...
  const scale=2+tier*0.6; // 高密度起步
  const iv_base=Math.max(200,550-tier*40);

  // 精英池（四线混合）
  const elites =['dark_knight','void_stalker','iron_golem','lich','wyvern'];
  // debuff池（保证每波至少含一种）
  const debuffers=['witch','spider','void_stalker'];
  // Boss池
  const bosses=['boss_lich','boss_dragon','boss_demon','boss_colossus','boss_phoenix','boss_void','boss_titan'];

  const eg=[];
  const isBossWave=waveNum%10===0;

  // 主力精英（2~3种轮换）
  const e1=elites[waveNum%elites.length];
  const e2=elites[(waveNum+2)%elites.length];
  const e3=elites[(waveNum+4)%elites.length];
  eg.push({id:e1, n:Math.round(10*scale), iv:Math.max(200,iv_base)});
  eg.push({id:e2, n:Math.round(8*scale),  iv:Math.max(250,iv_base+50)});
  if(tier>=2) eg.push({id:e3, n:Math.round(6*scale), iv:Math.max(300,iv_base+100)});

  // ✅ 保证含 debuff 怪（每波必有 witch 或 spider 或 void_stalker）
  const debuffer=debuffers[waveNum%debuffers.length];
  const alreadyHas=eg.some(e=>e.id===debuffer);
  if(!alreadyHas){
    eg.push({id:debuffer, n:Math.round(5*scale), iv:Math.max(350,iv_base+150)});
  } else {
    // 已有，再加另一种
    const extra=debuffers[(waveNum+1)%debuffers.length];
    if(extra!==debuffer) eg.push({id:extra, n:Math.round(4*scale), iv:Math.max(400,iv_base+200)});
  }

  // Boss波：额外加一个Boss
  if(isBossWave){
    const boss=bosses[Math.floor((waveNum-51)/10)%bosses.length];
    eg.push({id:boss, n:1, iv:5000});
  }
  // 80波后加双Boss
  if(waveNum>=80 && isBossWave){
    const boss2=bosses[(Math.floor((waveNum-51)/10)+2)%bosses.length];
    eg.push({id:boss2, n:1, iv:4000});
  }
  return eg;
}

// ─── 波次 ─────────────────────────────────────────────
bnw.addEventListener('click',()=>{
  if(gameOver||waveRunning)return;
  if(!isHost){
    // 客户端请求 host 提前发波
    netClient&&netClient.send({type:'reqWave'});
    return;
  }
  // 非无尽模式：超出总波数则胜利
  if(!selectedWaveMode.endless && myWave>selectedWaveMode.total){
    showResult(true); return;
  }
  // 手动提前出怪：停止倒计时
  _stopWaveCountdown();
  doStartWave();
});

function doStartWave(){
  const eg=generateWaveData(myWave);
  worker&&worker.postMessage({type:'wave',d:{wg:eg,em:ENEM_MAP}});
  worker&&worker.postMessage({type:'nextWave'});
  waveRunning=true; bnw.disabled=true;
  // 波次进行中：停止并隐藏倒计时
  _stopWaveCountdown();
  // 波次开始时隐藏预告按钮（Boss 即将出场）
  hideBossAlert();
  const suffix=selectedWaveMode.endless?'':'  / '+selectedWaveMode.total;
  showBanner('第 '+myWave+' 波'+suffix+'！');
  if(!isSolo&&netHost) netHost.broadcast({type:'wave',waveNum:myWave});
  myWave++; updateHud();
}

// ─── 暂停 ─────────────────────────────────────────────
bpause.addEventListener('click',()=>{
  paused=!paused;
  ovp.classList.toggle('hidden',!paused);
  if(!paused) return;
  // 刷新暂停面板按钮状态和提示
  _updatePausePanel();
});
bresume.addEventListener('click',()=>{paused=false;ovp.classList.add('hidden');});
bquit.addEventListener('click',()=>doQuitGame(false));
brquit.addEventListener('click',()=>doQuitGame(false));
bsavequit.addEventListener('click',()=>doQuitGame(true));

// 更新暂停面板（根据当前身份调整按钮状态和提示）
function _updatePausePanel(){
  if(isSolo||(isHost&&!isSolo)){
    // 单人 或 多人房主：两个按钮都可用
    bsavequit.disabled=false;
    bsavequit.style.opacity='1';
    ovpHint.textContent='';
  } else {
    // 多人客户端：保存退出不可用，提示需要房主操作
    bsavequit.disabled=true;
    bsavequit.style.opacity='.4';
    ovpHint.textContent='⚠️ 多人模式下请告知房主先「保存退出」，再退出游戏';
  }
}

// 执行退出（saveAndExit=true 保留存档，false 清档）
function doQuitGame(saveAndExit){
  if(saveAndExit){
    // 保存退出
    if(isHost||isSolo){
      // 立即执行一次存档，完成后再退出
      bsavequit.disabled=true;
      bsavequit.textContent='💾 存档中…';
      _doFinalSave();
      // 多人：广播通知客户端房主已存档并即将退出
      if(!isSolo&&netHost){
        netHost.broadcast({type:'hostSavedAndQuit', wave:myWave});
      }
      setTimeout(()=>_executeQuit(true), 300);
    }
  } else {
    // 直接退出：用自定义 confirm 弹窗确认
    const modeStr=(isSolo?'单人':(isHost?'多人（房主）':'多人'));
    const warnStr=(!isSolo&&isHost)?'\n⚠️ 退出后队友也将断开连接！':'';
    showSellConfirm(
      `🚪 确认退出${modeStr}游戏？\n本局存档将被清除，无法继续。${warnStr}`,
      ()=>{
        deleteSave(isSolo);
        if(!isSolo&&isHost&&netHost){
          netHost.broadcast({type:'hostQuit'});
        }
        _executeQuit(false);
      },
      '确认退出'
    );
  }
}

// 内部：执行实际退出动作
function _executeQuit(keepSave){
  _stopWaveCountdown();
  if(worker){worker.postMessage({type:'stop'});worker=null;}
  if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  if(renderer){renderer.destroy();renderer=null;}
  gc.removeEventListener('click',onCanvasClick);
  ovp.classList.add('hidden'); ovr.classList.add('hidden');
  bossbar.classList.add('hidden');
  hideBossAlert();
  closeBossModal();
  if(!isSolo){
    netHost&&netHost.destroy(); netHost=null;
    netClient&&netClient.destroy(); netClient=null;
  }
  const wasSolo=isSolo;
  isHost=false; isSolo=false; gameOver=false;
  bcreate.disabled=false; bjoin.disabled=false;
  bstart.disabled=true;
  // 重置保存退出按钮文字
  bsavequit.disabled=false;
  bsavequit.textContent='💾 保存退出';
  // 清理恢复状态
  window._resumeSave=null; window._resumeWave=null;
  window._expectedPlayers=null; window._onResumePlayerJoined=null;
  const rwp=document.getElementById('resume-wait-panel');
  if(rwp) rwp.remove();
  const rsb=document.getElementById('resume-share-box');
  if(rsb) rsb.remove();
  // 恢复波次选择可见性
  cwavepick.style.display='';
  bstart.textContent='开始游戏';
  croom.classList.add('hidden'); cmenu.classList.remove('hidden');
  setSt(lst,''); setSt(rst,'');
  showScreen('slob');
  // 刷新主菜单存档按钮
  renderSaveButtons();
  if(keepSave){
    showMsg('💾 存档已保存，下次可继续游戏');
  }
}

// 兼容旧调用（结算界面返回：游戏已结束，清档即可）
function quitGame(){
  deleteSave(isSolo); // 游戏结束后清档（胜利/失败均无需保留）
  _executeQuit(false);
}

function showResult(win){
  rtitle.textContent=win?'✨ 胜 利 ✨':'💀 失 败 💀';
  rtitle.className='rtitle '+(win?'win':'lose');
  rdesc.textContent=(win?'幻想乡得救了！':'基地已沦陷…')+'最终得分：'+myScore;
  ovr.classList.remove('hidden');
}

// ─── 侧边栏 / 商店 ────────────────────────────────────
// ── 羁绊配置（图鉴分组用）──────────────────────────────
const SYN_META={
  swift:  {name:'疾风剑豪',icon:'🌪️',color:'#74b9ff'},
  cannon: {name:'重炮火力',icon:'💣',color:'#e17055'},
  crit:   {name:'暴击猎手',icon:'🎯',color:'#ffd700'},
  element:{name:'元素使者',icon:'✨',color:'#a29bfe'},
  shadow: {name:'暗影刺客',icon:'🌑',color:'#6c5ce7'},
  tank:   {name:'钢铁壁垒',icon:'🛡️',color:'#b2bec3'},   // 坦克系
  holy:   {name:'圣光守护',icon:'✝️',color:'#ffeaa7'},
  nature: {name:'自然之佑',icon:'🌿',color:'#27ae60'},
  shield: {name:'魔法护盾',icon:'🔵',color:'#81ecec'},
  mech:   {name:'机械工匠',icon:'⚙️',color:'#636e72'},
  arcane: {name:'奥术法师',icon:'🔮',color:'#c084fc'},
  ranger: {name:'游侠射手',icon:'🏹',color:'#fd79a8'},
  warrior:{name:'战士先锋',icon:'⚔️',color:'#ff6b6b'},
  dragon: {name:'龙族血脉',icon:'🐉',color:'#d63031'},
  undead: {name:'亡灵天灾',icon:'💀',color:'#636e72'},
};

function buildPanel(){
  // ── 角色图鉴（按羁绊分组 + 折叠）──
  tchars.innerHTML='';

  // 按主羁绊（syns[0]）分组
  const groups={};        // synTag -> [charObj,...]
  const groupOrder=[];    // 保持羁绊出现顺序
  CHARS.forEach(c=>{
    const syn=(c.syns&&c.syns[0])||'other';
    if(!groups[syn]){ groups[syn]=[]; groupOrder.push(syn); }
    groups[syn].push(c);
  });

  const rarMap={n:'',r:'rare',sr:'epic',ssr:'legendary'};

  groupOrder.forEach((syn,gi)=>{
    const chars=groups[syn];
    const meta=SYN_META[syn]||{name:syn,icon:'⚔️',color:'#74b9ff'};

    // 统计稀有度分布
    const rarCount={n:0,r:0,sr:0,ssr:0};
    chars.forEach(c=>{ rarCount[c.rarity||'n']++; });
    const rarHint=[
      rarCount.ssr?`<span style="color:#7fe7ff">${rarCount.ssr}传</span>`:'',
      rarCount.sr ?`<span style="color:#c084fc">${rarCount.sr}史</span>`:'',
      rarCount.r  ?`<span style="color:#74b9ff">${rarCount.r}精</span>`:'',
      rarCount.n  ?`<span style="color:#9e9e9e">${rarCount.n}普</span>`:'',
    ].filter(Boolean).join(' ');

    // 创建折叠组
    const group=document.createElement('div');
    group.className='syn-group';

    const header=document.createElement('div');
    header.className='syn-group-header'+(gi===0?' open':''); // 第一组默认展开
    header.innerHTML=`
      <span class="syn-group-icon">${meta.icon}</span>
      <span class="syn-group-name" style="color:${meta.color}">${meta.name}</span>
      <span class="syn-group-meta">${chars.length}名角色 · ${rarHint}</span>
      <span class="syn-group-arrow">▶</span>`;
    header.addEventListener('click',()=>{
      header.classList.toggle('open');
    });

    const body=document.createElement('div');
    body.className='syn-group-body';

    chars.forEach(c=>{
      const el=document.createElement('div');
      el.className='ccard';
      const dr=rarMap[c.rarity||'n'];
      if(dr) el.dataset.r=dr;
      const rc=RARITY_CFG[c.rarity||'n'];
      const sk=c.skill;
      const skHtml=sk?`<div class="cskill-preview">
        <span class="cskill-icon">${sk.icon}</span>
        <span class="cskill-name">${sk.name}</span>
        <span class="cskill-type" style="color:${sk.type==='主动'?'#ff6b6b':'#74b9ff'}">${sk.type}</span>
      </div>`:'';
      // 副羁绊标签
      const subSyns=(c.syns||[]).slice(1).map(s=>{
        const sm=SYN_META[s]||{name:s,icon:'·',color:'#888'};
        return `<span style="font-size:9px;padding:1px 4px;border-radius:3px;background:${sm.color}22;color:${sm.color};margin-left:2px">${sm.icon}${sm.name}</span>`;
      }).join('');
      el.innerHTML=`
        <div class="cico">${c.emoji||'⚔️'}</div>
        <div class="cinfo">
          <div class="cname-row">
            <span class="cname" style="color:${c.color}">${c.name}</span>
            <span class="crarity ${c.rarity||'n'}">${rc.abbr}</span>
            ${subSyns}
          </div>
          <div class="cdesc">${c.desc}</div>
          ${skHtml}
        </div>`;
      el.addEventListener('click',()=>showCharDetail(c.id));
      body.appendChild(el);
    });

    group.appendChild(header);
    group.appendChild(body);
    tchars.appendChild(group);
  });
  // 羁绊面板（初始占位，由 renderSynergy 动态填充）
  const tsyn=$('tsyn');
  tsyn.innerHTML='<p class="syn-title">⚗ 激活羁绊</p><p style="color:var(--muted);font-size:11px;padding:4px">上阵角色满足组合后自动激活</p>';
  // 符咒面板
  ttali.innerHTML='<p class="tali-panel-hint" style="color:var(--muted);font-size:11px;padding:4px 4px 8px">🎴 波次完成后可选符咒，已获得：</p>';
  renderOwnedTali();
  // 装备面板初始化
  renderEquipPanel();
  // 羁绊点击：事件委托（绑定一次，不受 innerHTML 重建影响）
  initSynEvents();
  // Tab 切换
  document.querySelectorAll('.stab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.stab').forEach(b=>b.classList.remove('on'));
      document.querySelectorAll('.spane').forEach(p=>p.classList.remove('on'));
      btn.classList.add('on');
      $('t'+btn.dataset.t).classList.add('on');
    });
  });
  renderHand();
}

// 符咒图标映射
const TALI_ICO={
  spd:'💨',dmg:'🔥',rng:'🔭',gld:'💰',rep:'🛡️',
  // 羁绊专属咒
  syn_swift:'⚡',syn_cannon:'💥',syn_crit:'🎯',syn_element:'🌀',syn_shadow:'🌑',
  syn_dragon:'🐉',syn_undead:'💀',syn_arcane:'🔮',syn_holy:'☀️',syn_nature:'🌿',
  syn_warrior:'⚔️',
  // 觉醒咒
  ultimate_storm:'⚡',ultimate_blaze:'🔥',
};
const TALI_RARITY_COLOR={
  common:'#94a3b8', rare:'#60a5fa', epic:'#c084fc', legendary:'#f59e0b'
};
const TALI_RARITY_LABEL={
  common:'普通', rare:'精良', epic:'史诗', legendary:'传说'
};

function renderOwnedTali(){
  // 移除旧列表，保留顶部提示
  ttali.querySelectorAll('.own-tali-item').forEach(e=>e.remove());
  if(!activeTali.length){
    // 没有任何符咒时显示空状态
    const em=ttali.querySelector('.tali-empty');
    if(!em){
      const empty=document.createElement('div');
      empty.className='tali-empty';
      empty.style.cssText='text-align:center;padding:24px 0;color:var(--muted);font-size:11px';
      empty.innerHTML='<div style="font-size:28px;margin-bottom:8px;opacity:.4">🎴</div>还没有符咒';
      ttali.appendChild(empty);
    }
    return;
  }
  // 清除空状态
  ttali.querySelectorAll('.tali-empty').forEach(e=>e.remove());
  activeTali.forEach(id=>{
    const t=TALI.find(x=>x.id===id);if(!t)return;
    const el=document.createElement('div');
    el.className='own-tali-item';
    el.innerHTML=`
      <div class="own-tali-ico">${TALI_ICO[t.id]||'📜'}</div>
      <div class="own-tali-info">
        <div class="name">${t.name}</div>
        <div class="desc">${t.desc}</div>
      </div>`;
    ttali.appendChild(el);
  });
}

// ─── 羁绊面板渲染 ─────────────────────────────────────
// activeSyns: [{id,name,emoji,cnt,need,desc}]
// bufs: {spd,dmg,rng,gld,slow}
// 脏检查 key：上次渲染时的状态签名
let _lastSynKey='';

function renderSynergy(activeSyns, bufs){
  const el=$('tsyn');
  if(!el) return;

  // ── 脏检查：状态没变就跳过重建，避免频繁 tick 导致 DOM 闪烁 ──
  const onFieldIds=new Set();
  if(lastSnap&&lastSnap.players&&lastSnap.players[myPid]){
    for(const t of lastSnap.players[myPid].towers) onFieldIds.add(t.id);
  }
  const synKey=JSON.stringify(activeSyns||[])+JSON.stringify(bufs||{})+[...onFieldIds].sort().join(',');
  if(synKey===_lastSynKey) return;   // 没变化，直接跳过
  _lastSynKey=synKey;

  // 把激活的羁绊 id 收进 Set
  const activeSet=new Set((activeSyns||[]).map(s=>s.id));

  let html='<p class="syn-title">⚗ 激活羁绊</p>';

  // 已激活的羁绊
  const actArr=activeSyns||[];
  if(actArr.length){
    for(const s of actArr){
      const synDef=SYNERGIES.find(x=>x.id===s.id)||{chars:[]};
      const charsHtml=synDef.chars.map(cid=>{
        const ch=CHAR_MAP[cid]||{name:cid};
        const has=onFieldIds.has(cid);
        return `<span class="syn-char${has?' has':''}">${ch.name}</span>`;
      }).join('');
      // 检查是否有专属符咒加持
      const pSnap=lastSnap&&lastSnap.players&&lastSnap.players[myPid];
      const synTali=(pSnap&&pSnap.synTali&&pSnap.synTali[s.id])||null;
      let synTaliTag='';
      if(synTali){
        const bonusKeys=Object.keys(synTali).filter(k=>k!=='manaGain');
        const bonusSummary=bonusKeys.slice(0,2).map(k=>{
          const v=synTali[k];
          if(typeof v==='number'&&v>0.1) return `+${Math.round(v*100)}%${k}`;
          return null;
        }).filter(Boolean).join(' ');
        synTaliTag=`<div style="margin-top:5px;padding:4px 8px;border-radius:6px;background:rgba(192,132,252,.15);border:1px solid #c084fc55;font-size:10px;color:#c084fc;display:flex;align-items:center;gap:4px">
          <span>🎴</span><span style="font-weight:700">专属咒已激活</span>${bonusSummary?`<span style="color:#e9d5ff;margin-left:2px">${bonusSummary}</span>`:''}
        </div>`;
      }
      // 件套阶位标识
      const tierColor=s.need>=9?'#f59e0b':s.need>=6?'#a78bfa':'#34d399';
      html+=`<div class="syn-card active" data-syn-id="${s.id}" style="border-left:3px solid ${tierColor}">
        <div class="syn-head">
          <span class="syn-emoji">${s.emoji||'✨'}</span>
          <span class="syn-name">${s.name}</span>
          <span class="syn-badge on" style="background:${tierColor}33;color:${tierColor};border:1px solid ${tierColor}66">${s.cnt}/${s.need} ✓</span>
        </div>
        <div class="syn-chars">${charsHtml}</div>
        <div class="syn-desc">${s.desc}</div>
        ${synTaliTag}
      </div>`;
    }
    // 激活羁绊的 buff 汇总
    const bLines=[];
    if(bufs.spd>0) bLines.push(`⚡ 攻速 +${(bufs.spd*100).toFixed(0)}%`);
    if(bufs.dmg>0) bLines.push(`⚔ 伤害 +${(bufs.dmg*100).toFixed(0)}%`);
    if(bufs.rng>0) bLines.push(`🎯 射程 +${(bufs.rng*100).toFixed(0)}%`);
    if(bufs.gld>0) bLines.push(`💰 金币 +${(bufs.gld*100).toFixed(0)}%`);
    if(bufs.slow>0)bLines.push(`❄ 冰冻 +${(bufs.slow*100).toFixed(0)}%`);
    if(bLines.length){
      html+=`<div class="syn-bufs" style="background:rgba(95,140,255,.08);border-radius:8px;padding:8px;margin:4px 0">${bLines.map(b=>`<span class="syn-buf">${b}</span>`).join('')}</div>`;
    }
  }

  // 未激活的羁绊（暗显提示）
  const inactiveList=SYNERGIES.filter(s=>!activeSet.has(s.id));
  if(inactiveList.length){
    html+='<p class="syn-title" style="margin-top:8px">— 未激活 —</p>';
    for(const syn of inactiveList){
      const cnt=syn.chars.filter(c=>onFieldIds.has(c)).length;
      const nextTier=syn.tiers.find(t=>cnt<t.need);
      const need=nextTier?nextTier.need:syn.tiers[syn.tiers.length-1].need;
      const charsHtml=syn.chars.map(cid=>{
        const ch=CHAR_MAP[cid]||{name:cid};
        const has=onFieldIds.has(cid);
        return `<span class="syn-char${has?' has':''}">${ch.name}</span>`;
      }).join('');
      html+=`<div class="syn-card inactive" data-syn-id="${syn.id}">
        <div class="syn-head">
          <span class="syn-emoji">${syn.emoji||'?'}</span>
          <span class="syn-name">${syn.name}</span>
          <span class="syn-badge off">${cnt}/${need}</span>
        </div>
        <div class="syn-chars">${charsHtml}</div>
        <div class="syn-desc off">${nextTier?nextTier.desc:syn.tiers[syn.tiers.length-1].desc}</div>
      </div>`;
    }
  }

  el.innerHTML=html;
  // 注意：点击事件由初始化时绑定在容器上的事件委托处理，无需在此重绑
}

// ─── 羁绊面板事件委托（初始化时绑定一次，不受 innerHTML 重建影响）───
function initSynEvents(){
  const el=$('tsyn');
  if(!el) return;
  el.addEventListener('click', e=>{
    const card=e.target.closest('.syn-card');
    if(!card) return;
    const synId=card.dataset.synId;
    if(synId) showSynDetail(synId);
  });
}

// ─── 统一详情侧边抽屉 ────────────────────────────────
function openDrawer(){
  $('detail-drawer').classList.add('open');
}
function closeDrawer(){
  $('detail-drawer').classList.remove('open');
}

// ─── 羁绊详情（抽屉版） ───────────────────────────────
function showSynDetail(synId){
  const syn=SYNERGIES.find(s=>s.id===synId);
  if(!syn) return;

  // 获取当前场上角色
  const onFieldIds=new Set();
  if(lastSnap&&lastSnap.players&&lastSnap.players[myPid])
    for(const t of lastSnap.players[myPid].towers) onFieldIds.add(t.id);
  const cnt=syn.chars.filter(c=>onFieldIds.has(c)).length;

  // 当前最高激活阶位
  let activeTierIdx=-1;
  for(let i=syn.tiers.length-1;i>=0;i--)
    if(cnt>=syn.tiers[i].need){activeTierIdx=i;break;}
  const isActive=activeTierIdx>=0;

  // 进度：下一阶位还需几个
  const nextTier=syn.tiers.find(t=>t.need>cnt);
  const maxNeed=syn.tiers[syn.tiers.length-1].need;
  const progressPct=Math.min(100,Math.round((cnt/maxNeed)*100));

  // Header 颜色：已激活=绿，未激活=默认
  const headerColor=isActive?'var(--ok)':'var(--muted)';
  const headerBg=isActive?'rgba(78,205,196,.08)':'';

  $('drawer-ico').textContent=syn.emoji||'✨';
  $('drawer-ico').style.color=isActive?'var(--ok)':'var(--muted)';
  $('drawer-header').style.background=headerBg;
  $('drawer-name').textContent=syn.name;
  $('drawer-name').style.color=isActive?'var(--ok)':'var(--text)';
  $('drawer-sub').innerHTML=isActive
    ? `<span style="color:var(--ok);font-weight:700">✅ 已激活 &nbsp;${cnt} / ${syn.tiers[activeTierIdx].need} 成员</span>`
    : `<span style="color:var(--muted)">未激活 · ${nextTier?`再需 <b style="color:var(--text)">${nextTier.need-cnt}</b> 名成员`:'—'}</span>`;

  // ── buff 数值可视化辅助 ──
  const BUFF_LABELS={spd:'⚡ 攻速',dmg:'🔥 伤害',rng:'🔭 射程',gld:'💰 金币',slow:'❄️ 冰冻减速'};
  const BUFF_COLORS={spd:'#74b9ff',dmg:'#ff7675',rng:'#a29bfe',gld:'#ffd36b',slow:'#81ecec'};

  function renderBufTags(fx){
    if(!fx) return '';
    return Object.entries(fx).map(([k,v])=>
      `<span style="display:inline-block;padding:2px 7px;border-radius:12px;
        background:${BUFF_COLORS[k]||'#fff'}22;color:${BUFF_COLORS[k]||'#fff'};
        font-size:10px;font-weight:800;border:1px solid ${BUFF_COLORS[k]||'#fff'}44;margin:2px 2px 0 0">
        ${BUFF_LABELS[k]||k} +${Math.round(v*100)}%
      </span>`
    ).join('');
  }

  // ── 成员列表 ──
  let bodyHtml=`
  <div class="drawer-section-title">👥 成员阵容 &nbsp;<span style="color:var(--text);font-weight:800">${cnt}/${maxNeed}</span></div>
  <div style="height:5px;background:var(--border2);border-radius:3px;margin-bottom:8px;overflow:hidden">
    <div style="height:100%;width:${progressPct}%;background:${isActive?'var(--ok)':'var(--pri)'};
      border-radius:3px;transition:width .4s"></div>
  </div>
  <div class="drawer-members">`;
  for(const cid of syn.chars){
    const ch=CHAR_MAP[cid]||{name:cid,emoji:'👤'};
    const has=onFieldIds.has(cid);
    bodyHtml+=`<div class="drawer-member${has?' on-field':''}">
      <span style="font-size:14px">${ch.emoji||'👤'}</span>
      <span style="font-size:11px">${ch.name}</span>
      ${has?`<span style="font-size:9px;color:var(--ok);font-weight:800;margin-left:auto">✓ 在场</span>`
           :`<span style="font-size:9px;color:var(--muted);margin-left:auto">未上场</span>`}
    </div>`;
  }
  bodyHtml+=`</div>`;

  // ── 阶位列表 ──
  bodyHtml+=`<div class="drawer-section-title" style="margin-top:2px">⚗ 全部激活阶位</div>
  <div class="drawer-tiers">`;
  syn.tiers.forEach((tier,i)=>{
    const reached=cnt>=tier.need;
    const isCurrent=i===activeTierIdx;
    const isNext=!isCurrent&&i===syn.tiers.findIndex(t=>t.need>cnt);
    const cls=isCurrent?'current':reached?'reached':'';
    const needCls=isCurrent?'current':reached?'reached':'';
    const label=isCurrent?'⚡ 当前':reached?'✓ 已达成':isNext?`还需 ${tier.need-cnt} 名`:'';
    const labelColor=isCurrent?'var(--pri2)':reached?'var(--ok)':isNext?'var(--text)':'var(--muted)';
    bodyHtml+=`<div class="drawer-tier ${cls}">
      <div class="drawer-tier-head">
        <span class="drawer-tier-need ${needCls}">${tier.need} 件套</span>
        <span style="font-size:9px;color:${labelColor};font-weight:${isCurrent||isNext?800:500};margin-left:auto">${label}</span>
      </div>
      <div style="margin-bottom:5px">${renderBufTags(tier.fx)}</div>
      <div class="drawer-tier-desc${isCurrent?' current':reached?' reached':''}">${tier.desc}</div>
    </div>`;
  });
  bodyHtml+='</div>';

  // ── 出售区块（场上有该角色的塔 → 出售场上；背包有 → 出售背包）──
  const ps2=lastSnap&&lastSnap.players&&lastSnap.players[myPid];
  const onFieldTower=ps2&&ps2.towers&&ps2.towers.find(tw=>tw.id===charId);
  const bagEntry0=bag.find(b=>b.id===charId);
  if(onFieldTower){
    const stars=getProgress(charId).stars||0;
    const price=calcSellPrice(charId,stars);
    const tier=_charTier(charId);
    const tierName={n:'普通',r:'精英',sr:'史诗',ssr:'传说'}[tier]||'精英';
    const tierColor={n:'#9e9e9e',r:'#4caf50',sr:'#2196f3',ssr:'#ff9800'}[tier]||'#4caf50';
    const countVal=_starCount(stars);
    bodyHtml+=`
    <div class="td-sell-block">
      <div class="td-sell-info">
        <span class="td-sell-tier" style="color:${tierColor}">【${tierName}】</span>
        <span class="td-sell-calc">${countVal}张一星 × ${Math.floor(_tierBaseCost(tier)*0.75)}金</span>
        <span class="td-sell-price">💰 ${price} 金币</span>
      </div>
      <button class="td-sell-btn" id="drawer-sell-btn" data-uid="${onFieldTower.uid}" data-id="${charId}" data-mode="tower">
        出售场上此角色
      </button>
    </div>`;
  }
  if(bagEntry0){
    const stars0=getProgress(charId).stars||0;
    const price0=calcSellPrice(charId,stars0);
    const tier0=_charTier(charId);
    const tierName0={n:'普通',r:'精英',sr:'史诗',ssr:'传说'}[tier0]||'精英';
    const tierColor0={n:'#9e9e9e',r:'#4caf50',sr:'#2196f3',ssr:'#ff9800'}[tier0]||'#4caf50';
    const countVal0=_starCount(stars0);
    if(!onFieldTower){
      // 场上没有时才显示背包出售的详细信息块（避免重复）
      bodyHtml+=`
      <div class="td-sell-block">
        <div class="td-sell-info">
          <span class="td-sell-tier" style="color:${tierColor0}">【${tierName0}】</span>
          <span class="td-sell-calc">${countVal0}张一星 × ${Math.floor(_tierBaseCost(tier0)*0.75)}金</span>
          <span class="td-sell-price">💰 ${price0} 金币</span>
        </div>
        <button class="td-sell-btn" id="drawer-sell-btn" data-id="${charId}" data-mode="bag">
          出售背包中一张
        </button>
      </div>`;
    }
  }

  $('drawer-body').innerHTML=bodyHtml;
  // 绑定出售按钮（用 addEventListener，避免 file:// 协议下 onclick 字符串失效）
  const drawerSellBtn=$('drawer-body').querySelector('#drawer-sell-btn');
  if(drawerSellBtn){
    drawerSellBtn.addEventListener('click', e=>{
      e.stopPropagation();
      if(drawerSellBtn.dataset.mode==='tower'){
        doSellTower(drawerSellBtn.dataset.uid, drawerSellBtn.dataset.id);
      } else {
        doSellFromBag(drawerSellBtn.dataset.id);
      }
    });
  }
  openDrawer();
}

// ─── 角色详情弹窗 ─────────────────────────────────────
// 根据 rarity 字段获取稀有度配置
function getCharRarity(c){
  const r=RARITY_CFG[c.rarity||'n'];
  return {label:r.label, color:r.color, bg:r.bg};
}

// ─── 角色详情（抽屉版） ───────────────────────────────
function showCharDetail(charId){
  const c=CHAR_MAP[charId];
  if(!c) return;

  // 读取当前场上加成（如有）
  const ps=lastSnap&&lastSnap.players&&lastSnap.players[myPid];
  const taliDmg=(ps&&ps.taliDmg)||0;
  const taliRng=(ps&&ps.taliRng)||0;
  const taliSpd=(ps&&ps.taliSpd)||0;
  const syBufs=(ps&&ps.synergyBufs)||{};
  const totalDmgPct=Math.round((taliDmg+(syBufs.dmg||0))*100);
  const totalRngPct=Math.round((taliRng+(syBufs.rng||0))*100);
  const totalSpdPct=Math.round((taliSpd+(syBufs.spd||0))*100);

  const skill=c.skill;

  // 获取当前进度
  const prog=typeof getProgress==='function'?getProgress(charId):{stars:0,lv:1,exp:0};
  const charStars=prog.stars||0;
  const charLv=prog.lv||1;
  const maxLv=calcMaxLv(charId,charStars);
  const slv=calcSkillLv(charLv, charId);
  const smult=skillMult(slv);
  const expPct=Math.min(100,Math.round((prog.exp/calcExpReq(charLv))*100));

  // 计算加成后有效值（含技能加成倍率）
  const effDmg=Math.round(c.dmg*smult*(1+taliDmg+(syBufs.dmg||0)));
  const effRng=Math.round(c.range*(1+taliRng+(syBufs.rng||0)));
  const effRate=+(c.rate*(1+taliSpd+(syBufs.spd||0))).toFixed(2);

  function buffTag(pct){
    return pct>0?`<span style="font-size:9px;color:#7dffb1;margin-left:2px;font-weight:800">+${pct}%</span>`:'';
  }

  // 填充抽屉 header
  $('drawer-ico').textContent=c.emoji||'⚔️';
  $('drawer-ico').style.color=c.color;
  $('drawer-header').style.background=`linear-gradient(135deg,${c.color}12 0%,transparent 60%)`;
  $('drawer-name').textContent=c.name;
  $('drawer-name').style.color=c.color;
  const rarity=getCharRarity(c);
  const rc=RARITY_CFG[c.rarity||'n'];
  const rarStars={n:'★',r:'★★',sr:'★★★',ssr:'✦✦✦✦'}[c.rarity||'n']||'★';
  const charStarStr='★'.repeat(charStars)+'☆'.repeat(5-charStars);
  $('drawer-sub').innerHTML=`<span style="background:${rarity.bg};color:${rarity.color};
    border:1px solid ${rarity.color}55;padding:2px 8px;border-radius:5px;font-size:9px;
    font-weight:900;display:inline-flex;align-items:center;gap:4px;margin-right:6px;vertical-align:middle">
    <span>${rc.abbr}</span><span style="letter-spacing:1px;font-size:8px;opacity:.85">${rarStars}</span>
  </span><span style="font-size:11px;opacity:.8">${c.desc||''}</span>`;

  // 等级 & 升星信息条
  const lvBarHtml=`
  <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px;margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <span style="font-size:11px;font-weight:900;color:#ffd36b">Lv ${charLv} <span style="font-size:9px;color:var(--muted)">/ ${maxLv}</span></span>
      <span style="font-size:12px;color:#f9ca24;letter-spacing:1px" title="${charStars}星">${charStarStr}</span>
      <span style="font-size:9px;color:var(--muted)">${charStars<5?`${3-((bag.find(b=>b.id===charId&&b.stars===charStars)||{count:0}).count||0)}张升星`:'满星'}</span>
    </div>
    <div style="width:100%;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
      <div style="width:${expPct}%;height:100%;background:linear-gradient(90deg,#ffd36b,#f9ca24);border-radius:2px;transition:width .3s"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:3px;font-size:9px;color:var(--muted)">
      <span>EXP ${prog.exp||0}/${calcExpReq(charLv)}</span>
      <span>技能 Lv${slv}/5 <span style="color:#7dffb1">×${smult.toFixed(1)}</span></span>
    </div>
    <div style="margin-top:4px;font-size:9px;color:var(--muted)">
      升星节点：${[0,1,2,3,4,5].map(s=>`<span style="color:${s<=charStars?'#f9ca24':'rgba(255,255,255,.2)'}">${s===0?'0':STAR_CFG[c.rarity||'n'].initLv+s*STAR_CFG[c.rarity||'n'].perStar}Lv</span>`).join(' → ')}
    </div>
  </div>`;

  // 技能等级解锁进度（基于该角色满星上限动态计算节点）
  const skillLvArr=getSkillUnlockLvs(charId);
  const skillUnlockHtml=`
  <div style="display:flex;gap:3px;margin-bottom:6px">
    ${skillLvArr.map((lv,i)=>{
      const unlocked=charLv>=lv;
      const active=calcSkillLv(charLv, charId)===i+1;
      return `<div style="flex:1;text-align:center;font-size:8px;padding:3px 2px;border-radius:4px;
        background:${active?c.color+'33':unlocked?'rgba(255,255,255,.05)':'rgba(0,0,0,.2)'};
        border:1px solid ${active?c.color:unlocked?'rgba(255,255,255,.1)':'transparent'};
        color:${unlocked?'var(--text)':'rgba(255,255,255,.25)'}">
        <div style="font-weight:900">Sk${i+1}</div>
        <div>Lv${lv}</div>
      </div>`;
    }).join('')}
  </div>`;

  // 填充抽屉 body
  let bodyHtml=lvBarHtml+skillUnlockHtml+`
    <div class="drawer-stats">
      <div class="drawer-stat">
        <div class="ds-lbl">⚔ 攻击</div>
        <div class="ds-val" style="color:${c.color}">${effDmg}${buffTag(totalDmgPct)}</div>
        <div class="ds-unit">伤/次</div>
      </div>
      <div class="drawer-stat">
        <div class="ds-lbl">⚡ 攻速</div>
        <div class="ds-val" style="color:${c.color}">${effRate}${buffTag(totalSpdPct)}</div>
        <div class="ds-unit">次/s</div>
      </div>
      <div class="drawer-stat">
        <div class="ds-lbl">🎯 射程</div>
        <div class="ds-val" style="color:${c.color}">${effRng}${buffTag(totalRngPct)}</div>
        <div class="ds-unit">px</div>
      </div>
    </div>`;

  if(skill){
    const typeColor=skill.type==='主动'?'#ff6b6b':'#74b9ff';
    const typeBg=skill.type==='主动'?'rgba(255,107,107,.15)':'rgba(116,185,255,.15)';
    bodyHtml+=`
    <div class="drawer-skill">
      <div class="drawer-skill-head">
        <span class="drawer-skill-ico">${skill.icon}</span>
        <span class="drawer-skill-name">${skill.name} <span style="font-size:9px;color:#7dffb1;font-weight:900">Lv${slv}</span></span>
        <span class="drawer-skill-type" style="background:${typeBg};color:${typeColor}">${skill.type}</span>
      </div>
      <div class="drawer-skill-desc">${skill.desc}</div>
      ${smult>1?`<div style="font-size:9px;color:#7dffb1;margin-top:3px">🔥 技能强化 ×${smult.toFixed(1)} (Lv${slv})</div>`:''}
    </div>`;
  }

  if(totalDmgPct>0||totalRngPct>0||totalSpdPct>0){
    const bLines=[];
    if(taliDmg>0) bLines.push(`<span style="color:#ffd36b">符咒 攻击+${Math.round(taliDmg*100)}%</span>`);
    if(syBufs.dmg>0) bLines.push(`<span style="color:#c084fc">羁绊 攻击+${Math.round(syBufs.dmg*100)}%</span>`);
    if(taliRng>0) bLines.push(`<span style="color:#ffd36b">符咒 射程+${Math.round(taliRng*100)}%</span>`);
    if(syBufs.rng>0) bLines.push(`<span style="color:#c084fc">羁绊 射程+${Math.round(syBufs.rng*100)}%</span>`);
    if(taliSpd>0) bLines.push(`<span style="color:#ffd36b">符咒 攻速+${Math.round(taliSpd*100)}%</span>`);
    if(syBufs.spd>0) bLines.push(`<span style="color:#c084fc">羁绊 攻速+${Math.round(syBufs.spd*100)}%</span>`);
    bodyHtml+=`<div class="drawer-bufbox">
      <span style="color:var(--muted);font-weight:700;font-size:9px">✦ 当前加成：</span>
      ${bLines.map(b=>`<span style="font-size:10px">${b}</span>`).join('')}
    </div>`;
  }

  // ── 出售区块（场上 / 背包）──
  const psForSell=lastSnap&&lastSnap.players&&lastSnap.players[myPid];
  const onField=psForSell&&psForSell.towers&&psForSell.towers.find(tw=>tw.id===charId);
  const inBag=bag.find(b=>b.id===charId);
  if(onField||inBag){
    const sellStars=getProgress(charId).stars||0;
    const sellPrice=calcSellPrice(charId,sellStars);
    const sellTier=_charTier(charId);
    const sellTierColor={n:'#9e9e9e',r:'#4caf50',sr:'#2196f3',ssr:'#ff9800'}[sellTier]||'#4caf50';
    const sellTierName={n:'普通',r:'精英',sr:'史诗',ssr:'传说'}[sellTier]||'精英';
    const sellCount=_starCount(sellStars);
    const sellMode=onField?'tower':'bag';
    const sellLabel=onField?'出售场上此角色':'出售背包中一张';
    const sellUid=onField?onField.uid:'';
    bodyHtml+=`
    <div class="td-sell-block" style="margin-top:10px">
      <div class="td-sell-info">
        <span class="td-sell-tier" style="color:${sellTierColor}">【${sellTierName}】</span>
        <span class="td-sell-calc">${sellCount}张一星 × ${Math.floor(_tierBaseCost(sellTier)*0.75)}金</span>
        <span class="td-sell-price">💰 ${sellPrice} 金币</span>
      </div>
      <button class="td-sell-btn" id="char-sell-btn"
        data-uid="${sellUid}" data-id="${charId}" data-mode="${sellMode}">
        ${sellLabel}
      </button>
    </div>`;
  }

  // ── 羁绊展示块（与塔详情逻辑一致）──
  // 直接读 snap 里每个塔的 t.syns 统计，避免 chars 列表不一致
  const fieldSynCountD = {};
  const _fcSetD = new Set();
  for(const tt of (ps&&ps.towers||[])){
    if(_fcSetD.has(tt.id)) continue;
    _fcSetD.add(tt.id);
    for(const sid of (tt.syns||[])) fieldSynCountD[sid]=(fieldSynCountD[sid]||0)+1;
  }
  const charSynsD = c.syns||[];
  if(charSynsD.length>0){
    const synRowsD = charSynsD.map(synId=>{
      const synDef = SYNERGIES.find(s=>s.id===synId);
      if(!synDef) return '';
      const cnt = fieldSynCountD[synId]||0;
      let activeTier=null, nextTier=null;
      for(const tier of synDef.tiers){
        if(cnt>=tier.need) activeTier=tier;
        else if(!nextTier) nextTier=tier;
      }
      const isActive=activeTier!==null;
      const showTier=isActive?activeTier:nextTier;
      const barColor=isActive?'#a78bfa':'#475569';
      const textColor=isActive?'#c4b5fd':'#94a3b8';
      const badge=isActive
        ?`<span style="font-size:8px;background:#7c3aed33;color:#a78bfa;padding:1px 4px;border-radius:3px;margin-left:4px">已激活</span>`
        :`<span style="font-size:8px;background:#1e293b;color:#64748b;padding:1px 4px;border-radius:3px;margin-left:4px">未激活</span>`;
      const tierDots=synDef.tiers.map(tier=>{
        const done=cnt>=tier.need;
        return `<span style="font-size:9px;color:${done?'#a78bfa':'#334155'};margin-right:2px">${done?'●':'○'}${tier.need}</span>`;
      }).join('');
      return `
        <div style="background:#0f172a;border:1px solid ${barColor}44;border-radius:6px;padding:5px 7px;margin-bottom:4px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:12px">${synDef.emoji}</span>
              <span style="font-size:11px;font-weight:700;color:${textColor}">${synDef.name}</span>
              ${badge}
            </div>
            <span style="font-size:10px;color:${isActive?'#a78bfa':'#64748b'};font-weight:700">${cnt}/${synDef.tiers[synDef.tiers.length-1].need}</span>
          </div>
          <div style="font-size:9px;color:#64748b;margin-bottom:3px">${tierDots}</div>
          ${showTier?`<div style="font-size:9px;color:${isActive?'#c4b5fd':'#64748b'};line-height:1.4;padding:3px 5px;background:${isActive?'#4c1d9522':'#1e293b'};border-radius:4px">${showTier.desc}</div>`:''}
        </div>`;
    }).join('');
    bodyHtml+=`
      <div style="margin-top:6px">
        <div style="font-size:10px;color:#64748b;font-weight:600;margin-bottom:4px;letter-spacing:.5px">⬡ 羁绊</div>
        ${synRowsD}
      </div>`;
  }

  // ── 装备槽区块 ──
  const onFieldUid=onField?onField.uid:null;
  bodyHtml+=buildEquipSlotHtml(onFieldUid, charId);

  $('drawer-body').innerHTML=bodyHtml;
  // 记录当前展开的 charId，方便装备操作后刷新
  $('drawer-name')._charId=charId;

  // 绑定出售按钮
  const charSellBtn=$('drawer-body').querySelector('#char-sell-btn');
  if(charSellBtn){
    charSellBtn.addEventListener('click', e=>{
      e.stopPropagation();
      if(charSellBtn.dataset.mode==='tower'){
        doSellTower(charSellBtn.dataset.uid, charSellBtn.dataset.id);
      } else {
        doSellFromBagDirect(charSellBtn.dataset.id); // 背包出售无二次确认
      }
    });
  }

  // 绑定装备槽卸下事件
  bindDrawerEquipSlots($('drawer-body'));

  openDrawer();
}

// ─── 抽卡系统（bg1/bg5 在底部重绑为开商店，这里不再直接绑定）──────────

function doGacha(n){
  // ── 完全不在本地修改金币，全部交给 Worker 权威处理 ──
  const cost=n===1?G1:G5;
  if(myGold<cost){showMsg('💰 金币不足！需要'+cost+'金',true);return;}
  setSt(gst,'祈愿中…');
  if(isHost||isSolo){
    // Host：直接发给 Worker，Worker 回 gachaResult
    worker&&worker.postMessage({type:'gacha',d:{pid:myPid,n}});
  } else {
    netClient&&netClient.send({type:'gacha',pid:myPid,n});
  }
}

function renderHand(){
  harea.innerHTML='';
  hand.forEach(h=>{
    const c=CHAR_MAP[h.id];
    const el=document.createElement('div');
    el.className='hcard'+(selCard&&selCard.id===h.id?' on':'');
    const rarMap={n:'',r:'rare',sr:'epic',ssr:'legendary'};
    const dr=rarMap[c.rarity||'n'];
    if(dr) el.dataset.r=dr;
    const hRc=RARITY_CFG[c.rarity||'n'];
    const hRarAbbr=hRc?hRc.abbr:'N';
    // 获取角色进度
    const prog=charProgress[h.id]||{stars:0,lv:1,exp:0};
    const hStars=prog.stars||0;
    const hLv=prog.lv||1;
    const starStr='★'.repeat(hStars)+'☆'.repeat(5-hStars);
    el.innerHTML=`
      <span class="hrarity ${c.rarity||'n'}">${hRarAbbr}</span>
      <span class="ico">${c.emoji}</span>
      <span class="nm">${c.name.slice(0,2)}</span>
      <span class="hlv">Lv${hLv}</span>
      <span class="hstar">${starStr}</span>`;
    if(h.count>1){
      const cnt=document.createElement('span');
      cnt.className='cnt'; cnt.textContent=h.count;
      el.appendChild(cnt);
    }
    // ℹ 详情按钮
    const infoBtn=document.createElement('span');
    infoBtn.className='hinfo-btn';
    infoBtn.textContent='ℹ';
    infoBtn.title='查看角色详情';
    infoBtn.addEventListener('click',e=>{
      e.stopPropagation(); // 不触发放塔逻辑
      showCharDetail(c.id);
    });
    el.appendChild(infoBtn);
    el.addEventListener('click',()=>{
      if(selCard&&selCard.id===h.id){selCard=null;renderer&&(renderer.selTile=null);}
      else selCard=c;
      renderHand();
    });
    harea.appendChild(el);
  });
  if(hand.length===0){
    harea.innerHTML='<span style="color:var(--muted);font-size:11px;padding:4px">还没有角色，先抽卡吧</span>';
  }
}

// ══════════════════════════════════════════════════════════
// 背包 / 升级 / 升星 系统
// ══════════════════════════════════════════════════════════

// 获取或创建角色进度
function getProgress(charId){
  if(!charProgress[charId]) charProgress[charId]={stars:0,lv:1,exp:0};
  return charProgress[charId];
}

// 抽卡后将角色加入背包（同时维护 charProgress）
function addCardToBag(charId){
  const prog=getProgress(charId);
  // 背包中以 {id, stars} 为单元记录数量
  const slot=bag.find(b=>b.id===charId&&b.stars===prog.stars);
  if(slot) slot.count=(slot.count||1)+1;
  else bag.push({id:charId,stars:prog.stars,count:1});
  // 注意：不操作 hand，背包和手牌是独立的
}

// 经验处理：gains = [{id,exp}]
// 注意：达到当前等级上限后，溢出经验全部保留，升星解锁上限后再补算
function applyExpGain(gains){
  let changed=false;
  gains.forEach(g=>{
    const prog=getProgress(g.id);
    prog.exp+=g.exp;  // 先无条件累加，不丢弃
    changed|=tryLevelUp(g.id, false);
  });
  if(changed){ renderHand(); renderBag(); }
}

// 尝试升级（消耗 exp 升级直到上限或 exp 不足）
// returnChanged: 是否返回是否发生变化
function tryLevelUp(charId, silent){
  const prog=getProgress(charId);
  const maxLv=calcMaxLv(charId, prog.stars);
  let changed=false;
  while(prog.lv<maxLv){
    const needed=calcExpReq(prog.lv);
    if(prog.exp>=needed){
      prog.exp-=needed;
      prog.lv++;
      changed=true;
      if(!silent){
        const c=CHAR_MAP[charId];
        const newSlv=calcSkillLv(prog.lv, charId);
        setTimeout(()=>showMsg(`✨ ${c?c.name:charId} 升至 Lv${prog.lv} 技能Lv${newSlv}`),50);
        SFX.play.levelUp(false);
        updateTowerStats(charId);
      }
    } else break;
  }
  // 已达当前上限，剩余 exp 保留（等升星后继续）
  return changed;
}

// 将等级/技能加成同步到场上的塔（通过 Worker 或本地 snap 补丁）
function updateTowerStats(charId){
  // 仅本地视觉提示，实际伤害由 Worker 维护（或在 placeTower 时带入等级信息）
  // 未来可发 levelUpdate 消息给 Worker
}

// ─────────────────────────────────────────────────────────
// 升星检测：统计背包+场上同名同星级总数 >= 3 则触发升星
// 规则：
//   - 场上有同角色 → 最早上阵的那个塔原地升星，其余场上同角色消失退背包再扣；
//   - 场上没有     → 背包里保留1张升星，删掉另外2张；
//   - 经验全部合并到升星那个角色的 charProgress（不浪费）；
// ─────────────────────────────────────────────────────────
function checkAllStarUp(){
  let anyStarUp=false;
  // 收集所有 charId
  const allIds=[...new Set(bag.map(b=>b.id))];
  for(const charId of allIds){
    const prog=getProgress(charId);
    if(prog.stars>=5) continue; // 已满星
    const curStar=prog.stars;

    // 背包中同星级数量
    const bagSlot=bag.find(b=>b.id===charId&&b.stars===curStar);
    const bagCount=(bagSlot&&bagSlot.count)||0;

    // 场上同角色同星级（通过 lastSnap 读取）
    const fieldTowers=(lastSnap&&lastSnap.players&&lastSnap.players[myPid])
      ? lastSnap.players[myPid].towers.filter(t=>t.id===charId)
      : [];
    // 场上塔也算作一张同星级卡（因为都是从同星级上阵的）
    const fieldCount=fieldTowers.length;

    const total=bagCount+fieldCount;
    if(total<3) continue;

    // ── 触发升星 ──
    anyStarUp=true;
    const c=CHAR_MAP[charId];

    // 合并所有同角色的经验（包括场上）
    // 场上塔的经验已记录在 charProgress[charId].exp，直接共享
    // （charProgress 对同一 charId 是统一的，已含累积经验）
    // 不需要额外操作，prog.exp 已经是全部的

    if(fieldCount>0){
      // ── 场上有该角色：最早上阵的原地升星，其余清除 ──
      // fieldTowers 按 uid 升序（uid 越小越早上阵）
      const sorted=[...fieldTowers].sort((a,b)=>a.uid-b.uid);
      const keepTower=sorted[0]; // 保留最早的
      const removeTowers=sorted.slice(1); // 其余场上的移除

      // 需要从场上+背包共消耗 3 张（保留那个不算消耗）
      // 已有 keepTower 会升星，还需消耗 2 张（从 removeTowers + bagSlot 凑）
      let need=2;
      // 先消耗其他场上塔
      const toRemoveUids=[];
      for(const rt of removeTowers){
        if(need<=0) break;
        toRemoveUids.push(rt.uid);
        need--;
      }
      // 再消耗背包
      if(need>0&&bagSlot){
        const consume=Math.min(need,bagSlot.count||1);
        bagSlot.count=(bagSlot.count||1)-consume;
        if(bagSlot.count<=0) bag=bag.filter(b=>b!==bagSlot);
        need-=consume;
      }

      // 发消息移除多余的场上塔（不退卡，已消耗）
      for(const uid of toRemoveUids){
        if(isHost||isSolo){
          worker&&worker.postMessage({type:'removeTowerSilent',d:{pid:myPid,uid}});
        } else {
          netClient&&netClient.send({type:'removeTowerSilent',pid:myPid,uid});
        }
      }

      // 升星 charProgress
      prog.stars++;
      // 通知 Worker 更新最早那个塔的数据
      tryReplaceOnFieldTower(charId, prog.stars);

    } else {
      // ── 场上没有：背包里保留1张升星，消耗另2张 ──
      if(bagSlot&&(bagSlot.count||1)>=3){
        bagSlot.count=(bagSlot.count||1)-3;
        if(bagSlot.count<=0) bag=bag.filter(b=>b!==bagSlot);
        // 加回1张已升星的
        const newStar=curStar+1;
        prog.stars=newStar;
        const existNew=bag.find(b=>b.id===charId&&b.stars===newStar);
        if(existNew) existNew.count=(existNew.count||1)+1;
        else bag.push({id:charId,stars:newStar,count:1});
      } else if(bagSlot){
        // 凑够3的逻辑（理论上走到这里 bagCount>=3）
        bagSlot.count=(bagSlot.count||1)-3;
        if(bagSlot.count<=0) bag=bag.filter(b=>b!==bagSlot);
        prog.stars++;
        const newStar=prog.stars;
        const existNew=bag.find(b=>b.id===charId&&b.stars===newStar);
        if(existNew) existNew.count=(existNew.count||1)+1;
        else bag.push({id:charId,stars:newStar,count:1});
      }
    }

    // 升星后用积累经验补算升级
    tryLevelUp(charId, false);
    const newMaxLv=calcMaxLv(charId, prog.stars);
    const cname=c?c.name:charId;
    showMsg('⭐ '+cname+' 升至 '+prog.stars+'★！等级上限→'+newMaxLv);
    SFX.play.levelUp(true);   // 升星 = 高级 levelUp 音效
    // ── 升星视觉爆炸特效 ──
    if(renderer){
      const newStar=prog.stars;
      const starColors=['','#60a5fa','#60a5fa','#c084fc','#f59e0b','#ffd700'];
      const starColor=starColors[Math.min(newStar,5)]||'#ffd700';
      const cW=renderer.canvas?renderer.canvas.getBoundingClientRect().left+renderer.canvas.width/2:window.innerWidth/2;
      const cH=renderer.canvas?renderer.canvas.getBoundingClientRect().top+renderer.canvas.height/2:window.innerHeight/2;
      // 推送升星爆炸动画
      renderer.starBursts=renderer.starBursts||[];
      renderer.starBursts.push({
        x:cW, y:cH, color:starColor, stars:newStar,
        life:150, maxLife:150, name:cname
      });
    }
    // 顶部横幅强化展示
    const starLabel=['','一','二','三','四','五'][prog.stars]||prog.stars;
    const starBannerColor=prog.stars>=5?'#ffd700':prog.stars>=4?'#f59e0b':prog.stars>=3?'#c084fc':'#60a5fa';
    showBanner(`${'★'.repeat(prog.stars)} ${cname} 升至${starLabel}星！`, 3000, starBannerColor);
    renderHand(); renderBag();
  }
  // 递归检查是否还能继续升星
  if(anyStarUp) checkAllStarUp();
}

// 升星后尝试替换场上的塔（更新 dmg）
function tryReplaceOnFieldTower(charId, newStars){
  const prog=getProgress(charId);
  const c=CHAR_MAP[charId];
  if(!c) return;
  const newSlv=calcSkillLv(prog.lv, charId);
  const newSmult=skillMult(newSlv);
  const newDmg=Math.round(c.dmg*newSmult);
  const upgradeData={pid:myPid, charId, newDmg, charLv:prog.lv, charStars:newStars, skillLv:newSlv};
  if(isHost||isSolo){
    worker&&worker.postMessage({type:'upgradeChar',d:upgradeData});
  } else {
    netClient&&netClient.send({type:'upgradeChar',d:upgradeData});
  }
}

// 渲染背包面板
function renderBag(){
  const tbag=$('tbag');
  if(!tbag) return;
  // 过滤掉数量为0的槽位，并按 id 合并（同角色不同星级 slot 合并为一条，取 count 总和）
  const rawBag=bag.filter(b=>(b.count||1)>0);
  // 按 charId 合并：count = 该角色所有 slot 数量之和，星级以 prog.stars 为准
  const mergedMap=new Map();
  rawBag.forEach(b=>{
    if(!mergedMap.has(b.id)) mergedMap.set(b.id, {id:b.id, count:0});
    mergedMap.get(b.id).count += (b.count||1);
  });
  const activeBag=[...mergedMap.values()];

  if(activeBag.length===0){
    tbag.innerHTML='<div class="bag-empty"><div style="font-size:28px;margin-bottom:8px;opacity:.4">🎒</div>背包空空如也<br><small>抽卡后角色会在此存放</small></div>';
    return;
  }
  tbag.innerHTML='';
  // 分组统计提示
  const summary=document.createElement('div');
  summary.style.cssText='font-size:10px;color:var(--muted);padding:4px 2px;display:flex;justify-content:space-between';
  summary.innerHTML=`<span>共 ${activeBag.reduce((s,b)=>s+(b.count||1),0)} 张</span><span>点击查看详情</span>`;
  tbag.appendChild(summary);

  // ── 获取场上所有角色的 syns 标签集合（直接读 snap 里 t.syns，不走 CHAR_MAP）──
  const fieldSyns = new Set();
  if(lastSnap&&lastSnap.players&&lastSnap.players[myPid]){
    for(const t of lastSnap.players[myPid].towers||[]){
      (t.syns||[]).forEach(s=>fieldSyns.add(s));
    }
  }

  // ── 排序：同羁绊优先，然后按 prog.stars 降序 ──
  const sortedBag=[...activeBag].sort((a,b)=>{
    const ca=CHAR_MAP[a.id]||{}, cb=CHAR_MAP[b.id]||{};
    const synA=(ca.syns||[]).some(s=>fieldSyns.has(s))?1:0;
    const synB=(cb.syns||[]).some(s=>fieldSyns.has(s))?1:0;
    if(synB!==synA) return synB-synA;
    const starA=getProgress(a.id).stars||0;
    const starB=getProgress(b.id).stars||0;
    return starB-starA;
  });

  const grid=document.createElement('div');
  grid.className='bag-grid';
  sortedBag.forEach(slot=>{
    const c=CHAR_MAP[slot.id];
    if(!c) return;
    const prog=getProgress(slot.id);
    const rc=RARITY_CFG[c.rarity||'n'];
    const rarMap={n:'',r:'rare',sr:'epic',ssr:'legendary'};
    const dr=rarMap[c.rarity||'n'];
    // ★ 使用 prog.stars（角色当前实际星级），而非 slot.stars（卡片自身星级）
    const stars=prog.stars||0;
    const starStr=stars>0?'★'.repeat(stars):'☆';
    const starColor=stars>=4?'#ffd700':stars>=2?'#f9ca24':'#c0a030';
    const maxLv=calcMaxLv(slot.id,prog.stars);
    const expPct=Math.min(100,Math.round((prog.exp/calcExpReq(prog.lv))*100));
    const count=(slot.count||1);
    // 是否与场上羁绊共鸣
    const hasSynMatch=(c.syns||[]).some(s=>fieldSyns.has(s));

    const el=document.createElement('div');
    el.className='bag-card';
    if(dr) el.dataset.r=dr;
    // 羁绊高亮：加发光边框
    if(hasSynMatch){
      el.style.boxShadow='0 0 0 2px #a78bfa, 0 0 8px 2px #7c3aed55';
      el.style.outline='none';
    }
    el.innerHTML=`
      <span class="brar ${c.rarity||'n'}">${rc.abbr}</span>
      ${hasSynMatch?`<span style="position:absolute;top:2px;left:2px;font-size:7px;color:#a78bfa;line-height:1">羁绊</span>`:''}
      <span class="bico">${c.emoji||'⚔️'}</span>
      <span class="bnm">${c.name.slice(0,3)}</span>
      <span class="blv">Lv${prog.lv}/${maxLv}</span>
      <span class="bstar" title="${stars}星" style="color:${starColor}">${starStr}</span>
      <div class="exp-bar-wrap"><div class="exp-bar-fill" style="width:${expPct}%"></div></div>
      ${count>1?`<span style="position:absolute;top:-4px;right:-4px;font-size:7px;font-weight:900;background:var(--pri);color:#fff;padding:1px 4px;border-radius:3px">×${count}</span>`:''}
      <button class="bag-to-hand" title="移入手牌">上阵</button>`;
    el.querySelector('.bag-to-hand').addEventListener('click',e=>{
      e.stopPropagation();
      moveToHand(slot.id);
    });
    el.addEventListener('click', e=>{
      // 若刚拖拽完则不触发详情
      if(el._justDragged){ el._justDragged=false; return; }
      showCharDetail(c.id);
    });
    // 绑定拖拽
    _bindBagCardDrag(el, c, slot);
    grid.appendChild(el);
  });
  tbag.appendChild(grid);

  // 显示升星进度提示
  const starUpCandidates=bag.filter(b=>(b.count||1)>=2);
  if(starUpCandidates.length>0){
    const hint=document.createElement('div');
    hint.style.cssText='font-size:9px;color:#ffd36b;padding:4px 2px;text-align:center';
    const names=starUpCandidates.map(b=>{
      const c=CHAR_MAP[b.id];
      return `${c?c.name:b.id}(${b.count||1}/3)`;
    }).join(' · ');
    hint.innerHTML=`⭐ 升星进度：${names}`;
    tbag.appendChild(hint);
  }
}

// 从背包选中准备上阵（不再需要手牌中转，直接选中后点地图放置）
function moveToHand(charId){
  const slot=bag.find(b=>b.id===charId);
  if(!slot||(slot.count||1)<=0){ showMsg('背包中没有该角色',true); return; }
  const c=CHAR_MAP[charId];
  if(!c){ showMsg('找不到角色数据',true); return; }

  // 检查场上是否已有同名塔，有则先收回再上阵
  const onFieldTower = lastSnap&&lastSnap.players&&lastSnap.players[myPid]
    ? lastSnap.players[myPid].towers.find(t=>t.id===charId)
    : null;

  if(onFieldTower){
    // 联机客户端通过 netClient 发给 Host，Host 再转发 Worker
    if(isHost||isSolo){
      worker&&worker.postMessage({type:'removeTower',d:{pid:myPid,uid:onFieldTower.uid}});
    } else {
      netClient&&netClient.send({type:'removeTower',pid:myPid,uid:onFieldTower.uid});
    }
    window._pendingMoveToHand=window._pendingMoveToHand||{};
    window._pendingMoveToHand[charId]=(window._pendingMoveToHand[charId]||0)+1;
    return;
  }

  // 设置 selCard，从背包选中该角色，提示用户点击地图放置
  selCard=c;
  // 标记来源是背包（放置成功后从背包扣卡，而不是手牌）
  selCard._fromBag=true;
  renderHand(); renderBag();
  showMsg((c.name||charId)+' 已选中，点击地图格子放置 ▶');
}

// ─── Canvas 点击：放塔 or 选中塔 ────────────────────────
let selectedTower=null; // 当前选中查看详情的塔
const ttdet=$('ttdet'), ttdetbtn=$('ttdetbtn');

function showTowerDetail(t, ownerPid){
  // 切换到"塔详情" tab
  ttdetbtn.style.display='';
  document.querySelectorAll('.stab').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.spane').forEach(p=>p.classList.remove('on'));
  ttdetbtn.classList.add('on');
  ttdet.classList.add('on');

  const base=CHAR_MAP[t.id]||{};
  const isOwn=ownerPid===myPid;
  const ownerLabel=isOwn?'🟡 我的塔':'🔵 其他玩家';
  const ownerColor=isOwn?'#ffd36b':'#74b9ff';
  const maxRange=220;

  // ── 读取 snap 中玩家的加成数据 ──
  const ps=lastSnap&&lastSnap.players&&lastSnap.players[ownerPid];
  const syBufs=(ps&&ps.synergyBufs)||{};
  const taliDmg=(ps&&ps.taliDmg)||0;
  const taliRng=(ps&&ps.taliRng)||0;
  const taliSpd=(ps&&ps.taliSpd)||0;
  const taliGld=(ps&&ps.taliGld)||0;

  // ── 计算各项综合 buff ──
  const baseRng=base.range||0;
  const curRng=Math.round(t.range||0);
  const baseRate=base.rate||0;
  const curRate=+(t.rate||baseRate).toFixed(2);
  const baseDmg=base.dmg||0;

  // 综合百分比加成（符咒 + 羁绊）
  // 装备加成
  const eqBonus=calcEquipBonus(t.uid, t.id);
  const totalDmgPct=Math.round((taliDmg+(syBufs.dmg||0)+(eqBonus.dmg||0))*100);
  const totalRngPct=Math.round((taliRng+(syBufs.rng||0)+(eqBonus.rng||0))*100);
  const totalSpdPct=Math.round((taliSpd+(syBufs.spd||0)+(eqBonus.spd||0))*100);
  const totalGldPct=Math.round((taliGld+(syBufs.gld||0)+(eqBonus.gld||0))*100);

  // 有效值（含装备加成）
  const effDmg=baseDmg>0?Math.round(baseDmg*(1+taliDmg+(syBufs.dmg||0)+(eqBonus.dmg||0))):baseDmg;

  // ── 生成 buff 标签：区分符咒(金色)和羁绊(紫色) ──
  function bufBreakdown(taliPct, synPct){
    if(taliPct<=0 && synPct<=0) return '';
    let parts=[];
    if(taliPct>0) parts.push(`<span style="color:#ffd36b">+${Math.round(taliPct*100)}%符咒</span>`);
    if(synPct>0)  parts.push(`<span style="color:#c084fc">+${Math.round(synPct*100)}%羁绊</span>`);
    return `<div style="font-size:9px;margin-top:2px;opacity:.85">${parts.join(' ')}</div>`;
  }
  function totalTag(pct){
    if(pct<=0) return '';
    return `<span style="font-size:10px;color:#7dffb1;margin-left:3px;font-weight:800">+${pct}%</span>`;
  }

  // ── 技能块 ──
  const skill=base.skill;
  const typeColor=skill&&skill.type==='主动'?'#ff6b6b':'#74b9ff';
  const skillHtml=skill?`
    <div class="td-skill">
      <div class="td-skill-head">
        <span class="td-skill-ico">${skill.icon}</span>
        <span class="td-skill-name">${skill.name}</span>
        <span class="td-skill-type" style="background:${typeColor}22;color:${typeColor}">${skill.type}</span>
      </div>
      <div class="td-skill-desc">${skill.desc}</div>
    </div>`:'';

  // ── 羁绊展示块 ──
  // 统计场上各羁绊的角色数量：直接读每个塔的 t.syns，避免 chars 列表不一致
  const fieldSynCount = {};
  const _fcSet = new Set();
  for(const tt of (ps&&ps.towers||[])){
    if(_fcSet.has(tt.id)) continue;
    _fcSet.add(tt.id);
    for(const sid of (tt.syns||[])) fieldSynCount[sid]=(fieldSynCount[sid]||0)+1;
  }
  const charSyns = base.syns||[];
  let synHtml = '';
  if(charSyns.length>0){
    const synRows = charSyns.map(synId=>{
      const synDef = SYNERGIES.find(s=>s.id===synId);
      if(!synDef) return '';
      const cnt = fieldSynCount[synId]||0;
      // 找到当前激活的 tier（cnt >= need 的最高 tier）
      let activeTier = null;
      let nextTier = null;
      for(const tier of synDef.tiers){
        if(cnt>=tier.need) activeTier=tier;
        else if(!nextTier) nextTier=tier; // 最近未激活 tier
      }
      const isActive = activeTier!==null;
      const showTier = isActive ? activeTier : nextTier;
      const barColor = isActive ? '#a78bfa' : '#475569';
      const textColor = isActive ? '#c4b5fd' : '#94a3b8';
      const activeBadge = isActive
        ? `<span style="font-size:8px;background:#7c3aed33;color:#a78bfa;padding:1px 4px;border-radius:3px;margin-left:4px">已激活</span>`
        : `<span style="font-size:8px;background:#1e293b;color:#64748b;padding:1px 4px;border-radius:3px;margin-left:4px">未激活</span>`;
      // tier 列表（点状指示）
      const tierDots = synDef.tiers.map(tier=>{
        const done = cnt>=tier.need;
        return `<span style="font-size:9px;color:${done?'#a78bfa':'#334155'};margin-right:2px" title="${tier.need}件套">${done?'●':'○'}${tier.need}</span>`;
      }).join('');
      return `
        <div style="background:#0f172a;border:1px solid ${barColor}44;border-radius:6px;padding:5px 7px;margin-bottom:4px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:12px">${synDef.emoji}</span>
              <span style="font-size:11px;font-weight:700;color:${textColor}">${synDef.name}</span>
              ${activeBadge}
            </div>
            <span style="font-size:10px;color:${isActive?'#a78bfa':'#64748b'};font-weight:700">${cnt}/${synDef.tiers[synDef.tiers.length-1].need}</span>
          </div>
          <div style="font-size:9px;color:#64748b;margin-bottom:3px">${tierDots}</div>
          ${showTier?`<div style="font-size:9px;color:${isActive?'#c4b5fd':'#64748b'};line-height:1.4;padding:3px 5px;background:${isActive?'#4c1d9522':'#1e293b'};border-radius:4px">${showTier.desc}</div>`:''}
        </div>`;
    }).join('');
    synHtml = `
      <div style="margin-top:6px">
        <div style="font-size:10px;color:#64748b;font-weight:600;margin-bottom:4px;letter-spacing:.5px">⬡ 羁绊</div>
        ${synRows}
      </div>`;
  }

  // ── 符咒加成摘要（有加成才显示）──
  const hasTali=taliDmg>0||taliRng>0||taliSpd>0||taliGld>0;
  const hasSyn=Object.keys(syBufs).some(k=>syBufs[k]>0);
  let buffSummary='';
  if(hasTali||hasSyn){
    const rows=[];
    if(totalDmgPct>0) rows.push(`<div class="td-bufrow"><span>⚔ 攻击力</span><span>${bufBreakdown(taliDmg,syBufs.dmg||0).replace(/<div[^>]*>/,'').replace('</div>','')}${eqBonus.dmg>0?`<span style="color:#7dffb1">+${Math.round(eqBonus.dmg*100)}%装备</span>`:''}</span></div>`);
    if(totalRngPct>0) rows.push(`<div class="td-bufrow"><span>🎯 射程</span><span>${bufBreakdown(taliRng,syBufs.rng||0).replace(/<div[^>]*>/,'').replace('</div>','')}${eqBonus.rng>0?`<span style="color:#7dffb1">+${Math.round(eqBonus.rng*100)}%装备</span>`:''}</span></div>`);
    if(totalSpdPct>0) rows.push(`<div class="td-bufrow"><span>⚡ 攻速</span><span>${bufBreakdown(taliSpd,syBufs.spd||0).replace(/<div[^>]*>/,'').replace('</div>','')}${eqBonus.spd>0?`<span style="color:#7dffb1">+${Math.round(eqBonus.spd*100)}%装备</span>`:''}</span></div>`);
    if(totalGldPct>0) rows.push(`<div class="td-bufrow"><span>💰 金币</span><span>${bufBreakdown(taliGld,syBufs.gld||0).replace(/<div[^>]*>/,'').replace('</div>','')}${eqBonus.gld>0?`<span style="color:#7dffb1">+${Math.round(eqBonus.gld*100)}%装备</span>`:''}</span></div>`);
    if(rows.length>0){
      buffSummary=`
        <div class="td-bufs">
          <div class="td-bufs-title">✦ 当前加成</div>
          ${rows.join('')}
        </div>`;
    }
  }

  // ── 读取塔的真实星级（优先 snap 传来的 stars，备用 charProgress）──
  const detStars = (t.stars||0) || (charProgress[t.id]&&charProgress[t.id].stars)||0;
  const detStarStr = detStars>0 ? '★'.repeat(detStars) : '—';
  const detStarColor = detStars>=4?'#ffd700':detStars>=2?'#f9ca24':'#c0a030';

  ttdet.innerHTML=`
    <div class="td-header">
      <div class="td-ico" style="background:${t.color}20;border:1px solid ${t.color}66">
        ${base.emoji||'⚔️'}
      </div>
      <div>
        <div class="td-name" style="color:${t.color}">${t.name}
          <span style="font-size:11px;color:${detStarColor};margin-left:4px;letter-spacing:1px" title="${detStars}星">${detStarStr}</span>
        </div>
        <div class="td-sub">${base.desc||''}</div>
        <span class="td-owner" style="background:${ownerColor}18;color:${ownerColor};border:1px solid ${ownerColor}44">${ownerLabel}</span>
      </div>
    </div>
    <div class="td-stats">
      <div class="td-stat">
        <div class="lbl">⚔ 攻击力</div>
        <div class="val">${effDmg||baseDmg||'?'}${totalTag(totalDmgPct)}<span class="unit">伤/次</span></div>
        ${bufBreakdown(taliDmg,syBufs.dmg||0)}
      </div>
      <div class="td-stat">
        <div class="lbl">⚡ 攻速</div>
        <div class="val">${curRate}${totalTag(totalSpdPct)}<span class="unit">次/s</span></div>
        ${bufBreakdown(taliSpd,syBufs.spd||0)}
      </div>
      <div class="td-stat">
        <div class="lbl">🎯 射程</div>
        <div class="val">${curRng}${totalTag(totalRngPct)}<span class="unit">px</span></div>
        ${bufBreakdown(taliRng,syBufs.rng||0)}
      </div>
      <div class="td-stat">
        <div class="lbl">💰 金币加成</div>
        <div class="val">${totalGldPct>0?'+'+totalGldPct+'%':'—'}</div>
        ${bufBreakdown(taliGld,syBufs.gld||0)}
      </div>
    </div>
    <div class="td-rang">
      <div class="lbl">📡 射程对比（基础 ${baseRng}px → 当前 ${curRng}px）</div>
      <div class="td-rang-bar" style="margin-bottom:3px">
        <div class="td-rang-fill" style="width:${Math.min(100,baseRng/maxRange*100).toFixed(1)}%;opacity:.35"></div>
      </div>
      <div class="td-rang-bar">
        <div class="td-rang-fill" style="width:${Math.min(100,curRng/maxRange*100).toFixed(1)}%"></div>
      </div>
    </div>
    ${skillHtml}
    ${synHtml}
    ${isOwn ? _buildSellBlock(t) : ''}
    ${isOwn ? buildEquipSlotHtml(t.uid, t.id) : ''}
    <p class="td-tip">ESC 或点击空白处取消选中</p>`;
  // 绑定出售按钮事件（避免 file:// 下 onclick 字符串失效）
  if(isOwn){
    const sellBtn=ttdet.querySelector('#sell-tower-btn');
    if(sellBtn){
      sellBtn.addEventListener('click', e=>{
        e.stopPropagation();
        doSellTower(sellBtn.dataset.uid, sellBtn.dataset.id);
      });
    }
    // 绑定装备槽卸下事件，卸下后刷新本塔详情
    bindDrawerEquipSlots(ttdet);
    // 记录当前塔信息，供卸下后重新渲染
    ttdet._towerRef = t;
    ttdet._ownerRef = ownerPid;
    // 渲染并绑定背包装备列表（双击/单击穿装备）
    _renderTdEquipBag(ttdet, t);
  }
  // 在地图上高亮该塔
  if(renderer) renderer.selTower=t.uid;
}

// ─── 塔详情面板的「背包装备列表」渲染 ──────────────
function _renderTdEquipBag(container, tower){
  // 如果背包为空，不渲染
  if(!equipBag||!equipBag.length) return;

  const alreadyOn = new Set(charEquips[tower.uid]||[]);
  const slotsFull = alreadyOn.size >= 4;

  const statLabel = def => {
    const p=[];
    if(def.stat.dmg) p.push(`⚔️+${Math.round(def.stat.dmg*100)}%`);
    if(def.stat.rng) p.push(`🎯+${Math.round(def.stat.rng*100)}%`);
    if(def.stat.spd) p.push(`⚡+${Math.round(def.stat.spd*100)}%`);
    if(def.stat.gld) p.push(`💰+${Math.round(def.stat.gld*100)}%`);
    return p.join(' ');
  };

  const bagDiv = document.createElement('div');
  bagDiv.className = 'td-equip-bag';

  const title = document.createElement('div');
  title.className = 'td-equip-bag-title';
  title.innerHTML = `🎒 背包装备 <span style="color:var(--muted);font-weight:600">${equipBag.length}件</span>`
    + (slotsFull?` <span style="color:var(--danger);font-size:8px">（槽位已满）</span>`:'')
    + ` <span style="color:var(--muted);font-size:8px;font-weight:400">· 双击穿上</span>`;
  bagDiv.appendChild(title);

  if(!equipBag.length){
    const empty = document.createElement('div');
    empty.className = 'td-equip-bag-empty';
    empty.textContent = '背包暂无装备';
    bagDiv.appendChild(empty);
  } else {
    const grid = document.createElement('div');
    grid.className = 'td-equip-bag-grid';

    for(const inst of equipBag){
      const def = EQUIP_DATA[inst.id];
      if(!def) continue;
      const on = alreadyOn.has(inst.uid);
      const item = document.createElement('div');
      item.className = 'td-equip-bag-item' + (on?' already-on':'');
      item.dataset.q = def.quality||'common';
      item.dataset.instUid = inst.uid;
      item.title = on ? '已装备此角色' : (slotsFull&&!on ? '槽位已满' : `双击装备 ${def.name}`);
      item.innerHTML = `
        <span class="tei-ico">${def.icon}</span>
        <div class="tei-info">
          <div class="tei-name" style="color:${(typeof EQUIP_QUALITY_COLOR!=='undefined'?EQUIP_QUALITY_COLOR[def.quality]:'')||'#fff'}">${def.name}</div>
          <div class="tei-stat">${statLabel(def)||'—'}</div>
        </div>`;

      if(!on){
        // 穿上按钮
        const wearBtn = document.createElement('button');
        wearBtn.className = 'tei-wear-btn';
        wearBtn.textContent = slotsFull ? '已满' : '穿上';
        wearBtn.disabled = slotsFull;
        wearBtn.addEventListener('click', e=>{
          e.stopPropagation();
          if((charEquips[tower.uid]||[]).length>=4){ showMsg('该角色已满4件装备',true); return; }
          if(equipItem(tower.uid, inst.uid)){
            _refreshTowerDetailIfOpen(tower.uid);
          }
        });
        item.appendChild(wearBtn);
      } else {
        // 已穿戴标记
        const tag = document.createElement('span');
        tag.className = 'tei-on-tag';
        tag.textContent = '✅';
        item.appendChild(tag);
      }
      grid.appendChild(item);
    }
    bagDiv.appendChild(grid);
  }

  container.appendChild(bagDiv);
}

// ── 游戏内自定义出售确认弹窗（替代 confirm()，在 file:// 下也能用）──
function showSellConfirm(msg, onConfirm, confirmLabel){
  // 如果已有弹窗则移除
  const old=document.getElementById('sell-confirm-overlay');
  if(old) old.remove();

  // 容器透明，不阻挡背后点击；只有 box 本身接受事件
  const overlay=document.createElement('div');
  overlay.id='sell-confirm-overlay';
  overlay.style.cssText=`
    position:fixed;inset:0;background:transparent;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    pointer-events:none;`;

  const box=document.createElement('div');
  box.style.cssText=`
    background:#1a1d24;border:1.5px solid rgba(255,100,80,.5);border-radius:14px;
    padding:24px 28px;min-width:260px;max-width:340px;text-align:center;
    box-shadow:0 8px 40px rgba(0,0,0,.8);pointer-events:all;`;

  // 支持多行文字展示（用 \n 分割）
  const lines=msg.split('\n').filter(Boolean);
  const title=lines[0]||'';
  const bodyLines=lines.slice(1);
  const okLabel=confirmLabel||'确认';
  box.innerHTML=`
    <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">${title}</div>
    ${bodyLines.length?`<div style="font-size:12px;color:var(--muted);margin-bottom:16px;text-align:left;line-height:1.7">
      ${bodyLines.map(l=>`<div>${l}</div>`).join('')}
    </div>`:'<div style="height:10px"></div>'}
    <div style="display:flex;gap:10px;justify-content:center">
      <button id="sell-confirm-ok" style="flex:1;padding:9px 0;background:linear-gradient(135deg,#e53935,#c62828);
        color:#fff;font-size:13px;font-weight:700;border:none;border-radius:8px;cursor:pointer">
        ${okLabel}
      </button>
      <button id="sell-confirm-cancel" style="flex:1;padding:9px 0;background:rgba(255,255,255,.08);
        color:#aaa;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.15);border-radius:8px;cursor:pointer">
        取消
      </button>
    </div>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const close=()=>overlay.remove();
  box.querySelector('#sell-confirm-ok').addEventListener('click',e=>{
    e.stopPropagation(); close(); onConfirm();
  });
  box.querySelector('#sell-confirm-cancel').addEventListener('click',e=>{
    e.stopPropagation(); close();
  });
  overlay.addEventListener('click',e=>{ if(e.target===overlay) close(); });
}

// ── 计算角色品质等级和出售价格 ──────────────────────────
function _charTier(charId){
  // ID 格式：c{synIdx}{charNum} 其中 charNum 是 001-012 三位数字
  // c1001→n=1(N), c1004→n=4(R), c10010→n=10(SSR)
  // 取末尾3位作为 charNum
  const s=charId.replace(/^c/,'');   // 去掉前缀 c
  const num=parseInt(s.slice(-3));   // 取最后3位，如 "001"→1, "010"→10
  if(isNaN(num)) return 'r';
  if(num<=3) return 'n';
  if(num<=6) return 'r';
  if(num<=9) return 'sr';
  return 'ssr';
}
function _tierBaseCost(tier){
  return {n:40,r:80,sr:160,ssr:320}[tier]||80;
}
// 1星=1张，2星=3张，3星=9张，4星=27张
function _starCount(stars){ return Math.pow(3, stars); }

function calcSellPrice(charId, stars){
  const tier=_charTier(charId);
  const base=_tierBaseCost(tier);
  const count=_starCount(stars||0);
  return Math.floor(base * count * 0.75);
}

function _buildSellBlock(t){
  const stars=getProgress(t.id).stars||0;
  const price=calcSellPrice(t.id,stars);
  const tier=_charTier(t.id);
  const tierName={n:'普通',r:'精英',sr:'史诗',ssr:'传说'}[tier]||'精英';
  const tierColor={n:'#9e9e9e',r:'#4caf50',sr:'#2196f3',ssr:'#ff9800'}[tier]||'#4caf50';
  const countVal=_starCount(stars);
  // 用 data 属性 + addEventListener 绑定，避开 file:// 下 confirm 失效
  return `
    <div class="td-sell-block">
      <div class="td-sell-info">
        <span class="td-sell-tier" style="color:${tierColor}">【${tierName}】</span>
        <span class="td-sell-calc">${countVal}张一星 × ${Math.floor(_tierBaseCost(_charTier(t.id))*0.75)}金</span>
        <span class="td-sell-price">💰 ${price} 金币</span>
      </div>
      <button class="td-sell-btn" id="sell-tower-btn" data-uid="${t.uid}" data-id="${t.id}">
        出售此塔
      </button>
    </div>`;
}

// ── 执行出售场上塔 ──────────────────────────────────────
// ══════════════════════════════════════════════════════════
// 存档系统
// ══════════════════════════════════════════════════════════

const SAVE_KEY_SOLO  = 'td_save_solo';
const SAVE_KEY_MULTI = 'td_save_multi';

// 保存 pid → persistentId 映射（房主本地）
function _savePersistentIdMap(pid, persistentId){
  try{
    const map=JSON.parse(localStorage.getItem('td_pid_map')||'{}');
    map[pid]=persistentId;
    localStorage.setItem('td_pid_map', JSON.stringify(map));
  }catch(e){}
}

// 触发存档（在波次开始时由 Host 调用）
function triggerSave(){
  if(!isHost&&!isSolo) return;
  _saveClientData={};
  if(isSolo){
    // 单人：直接存档
    _doFinalSave();
  } else {
    // 多人：收集所有在线客户端的数据
    _savePendingPids=new Set();
    const clients=roomPlayers.filter(r=>!r.host&&r.conn);
    clients.forEach(r=>{
      _savePendingPids.add(r.pid);
      try{ r.conn.send({type:'reqSaveData'}); }catch(e){}
    });
    if(_savePendingPids.size===0){
      // 没有在线客户端，直接存
      _doFinalSave();
    } else {
      // 5秒超时保护：超时后以已收到的数据为准强制存档
      setTimeout(()=>{
        if(_savePendingPids.size>0){
          _savePendingPids.clear();
          _doFinalSave();
        }
      },5000);
    }
  }
}

// 执行实际存档（房主调用）
function _doFinalSave(){
  if(!lastSnap) return;
  const snap=lastSnap;
  // 汇总玩家存档数据
  const playersData={};
  const pidMap=JSON.parse(localStorage.getItem('td_pid_map')||'{}');
  roomPlayers.forEach(r=>{
    const pid=r.pid;
    const ps=snap.players&&snap.players[pid];
    const clientD=_saveClientData[pid]||{};
    const isMe=(pid===myPid);
    playersData[pid]={
      persistentId: r.persistentId||(pidMap[pid]||pid),
      gold:  ps?ps.gold:0,
      hp:    ps?ps.hp:0,
      score: ps?ps.score:0,
      towers:(ps?ps.towers||[]:[]).map(t=>({
        id:t.id, uid:t.uid, x:t.x, y:t.y, stars:t.stars||0,
        lv:t.lv||1, syns:t.syns||[], dmg:t.dmg, range:t.range, rate:t.rate
      })),
      tali:   ps?ps.tali||[]:[],
      slotLimit: ps?ps.slotLimit||4:4,
      bag:    isMe ? JSON.parse(JSON.stringify(bag)) : (clientD.bag||[]),
      charProgress: isMe ? JSON.parse(JSON.stringify(charProgress)) : (clientD.charProgress||{}),
      equipState: isMe ? serializeEquipState() : (clientD.equipState||null)
    };
  });
  const saveObj={
    version:1,
    sessionId: currentSessionId,
    wave: myWave,
    isSolo: isSolo,
    waveMode: selectedWaveMode?selectedWaveMode.id:'normal',
    savedAt: Date.now(),
    players: playersData,
    hostPersistentId: MY_PERSISTENT_ID
  };
  const key=isSolo?SAVE_KEY_SOLO:SAVE_KEY_MULTI;
  try{
    localStorage.setItem(key, JSON.stringify(saveObj));
  }catch(e){ console.warn('存档失败',e); }
}

// 读取存档
function loadSave(solo){
  try{
    const raw=localStorage.getItem(solo?SAVE_KEY_SOLO:SAVE_KEY_MULTI);
    return raw?JSON.parse(raw):null;
  }catch(e){ return null; }
}

// 删除存档
function deleteSave(solo){
  localStorage.removeItem(solo?SAVE_KEY_SOLO:SAVE_KEY_MULTI);
}

// 恢复单人存档
function resumeSoloSave(){
  const save=loadSave(true);
  if(!save){ showMsg('❌ 无单人存档',true); return; }
  isHost=true; isSolo=true;
  myPid='p0'; myLaneIdx=0;
  currentSessionId=save.sessionId||('sess_'+Math.random().toString(36).substr(2,10));
  const pd=save.players&&save.players['p0'];
  if(pd){
    bag=pd.bag||[];
    charProgress=pd.charProgress||{};
    myGold=pd.gold||100;
    myHp=pd.hp||20;
    myScore=pd.score||0;
    // 恢复装备状态
    if(pd.equipState) restoreEquipState(pd.equipState);
    else resetEquipState();
  }
  // 恢复存档时的波次模式
  if(save.waveMode){
    const m=WAVE_MODES.find(x=>x.id===save.waveMode);
    if(m) selectedWaveMode=m;
  }
  roomPlayers=[{name:'单人',host:true,pid:'p0',laneIdx:0,persistentId:MY_PERSISTENT_ID}];
  // 存储恢复数据
  window._resumeWave=save.wave;
  window._resumeSave=save;
  // 单人存档：直接跳入游戏，不经过房间界面
  cmenu.classList.add('hidden');
  startGame();
}

// 恢复多人存档（仅房主）
async function resumeMultiSave(){
  const save=loadSave(false);
  if(!save){ showMsg('❌ 无多人存档',true); return; }
  // 重新创建房间
  if(netHost){netHost.destroy();netHost=null;}
  setSt(lst,'正在重建房间...');
  netHost=new NetHost();
  try{
    const code=await netHost.open();
    rcode.textContent=code;
    isHost=true; isSolo=false;
    myPid='p0'; myLaneIdx=0;
    currentSessionId=save.sessionId;
    // 恢复波次模式
    if(save.waveMode){
      const m=WAVE_MODES.find(x=>x.id===save.waveMode);
      if(m) selectedWaveMode=m;
    }
    const pd=save.players&&save.players['p0'];
    if(pd){
      bag=pd.bag||[];
      charProgress=pd.charProgress||{};
      myGold=pd.gold||100;
      myHp=pd.hp||20;
      myScore=pd.score||0;
      if(pd.equipState) restoreEquipState(pd.equipState);
      else resetEquipState();
    }
    roomPlayers=[{name:'你（房主）',host:true,conn:null,pid:'p0',laneIdx:0,persistentId:MY_PERSISTENT_ID}];
    // 恢复 pid→persistentId 映射
    const pidMap={};
    Object.entries(save.players||{}).forEach(([pid,pdata])=>{
      if(pdata.persistentId) pidMap[pid]=pdata.persistentId;
    });
    localStorage.setItem('td_pid_map', JSON.stringify(pidMap));
    // 存档中期望回归的玩家（除房主外）
    window._expectedPlayers=Object.entries(save.players||{})
      .filter(([pid])=>pid!=='p0')
      .map(([pid,pd])=>({pid, name:pd.name||pid, persistentId:pd.persistentId}));

    cmenu.classList.add('hidden');
    croom.classList.remove('hidden');
    // 隐藏波次选择（存档已有固定模式）
    cwavepick.style.display='none';
    window._resumeWave=save.wave;
    window._resumeSave=save;
    renderPlist();
    _renderResumeWaitPanel(save);
    // bstart 交给 _renderResumeWaitPanel 管理
    netHost.onData=buildHostOnData();
    // 每次有玩家加入时刷新等待面板
    window._onResumePlayerJoined=()=>_renderResumeWaitPanel(save);
  }catch(err){
    setSt(lst,'重建失败：'+err.message,'err');
    netHost=null;
  }
}

// 多人存档恢复：等待玩家加入面板
function _renderResumeWaitPanel(save){
  const old=document.getElementById('resume-wait-panel');
  if(old) old.remove();
  const expected=window._expectedPlayers||[];
  const totalNeed=expected.length;
  // 统计哪些已经回来了（已在 roomPlayers 中匹配到）
  const joinedPids=new Set(roomPlayers.filter(r=>!r.host).map(r=>r.pid));
  const arrived=expected.filter(e=>joinedPids.has(e.pid));
  const missing=expected.filter(e=>!joinedPids.has(e.pid));
  const allArrived=(missing.length===0);

  // 生成分享链接
  const shareUrl=location.href.split('?')[0]+'?session='+save.sessionId+
    '&code='+encodeURIComponent(rcode.textContent||'');

  const panel=document.createElement('div');
  panel.id='resume-wait-panel';
  panel.style.cssText='margin-top:8px';

  // 玩家状态列表
  const playerRows=expected.map(e=>{
    const isIn=joinedPids.has(e.pid);
    return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;
      border-bottom:1px solid rgba(255,255,255,.06)">
      <span style="font-size:14px">${isIn?'✅':'⏳'}</span>
      <span style="font-size:11px;flex:1;color:${isIn?'#34d399':'var(--muted)'}">${e.name||e.pid}</span>
      <span style="font-size:10px;color:${isIn?'#34d399':'#f87171'}">${isIn?'已加入':'等待中'}</span>
    </div>`;
  }).join('');

  panel.innerHTML=`
    <div style="background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.25);
      border-radius:10px;padding:10px;margin-bottom:8px">
      <div style="font-size:11px;font-weight:900;color:#a5b4fc;margin-bottom:8px">
        📋 存档玩家回归状态（${arrived.length}/${totalNeed} 已加入）
      </div>
      ${playerRows}
    </div>
    <div style="background:rgba(0,0,0,.2);border-radius:8px;padding:8px;margin-bottom:8px">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">📎 发送链接给队友</div>
      <div style="word-break:break-all;font-size:9px;color:var(--text);user-select:all;
        background:rgba(0,0,0,.3);padding:5px;border-radius:5px;margin-bottom:5px">${shareUrl}</div>
      <button id="resume-copy-btn" style="width:100%;padding:5px 0;border:none;border-radius:6px;
        background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;cursor:pointer;font-size:10px;font-weight:700">
        📋 复制链接
      </button>
    </div>`;

  const croom=document.getElementById('croom');
  if(croom) croom.insertBefore(panel, document.getElementById('rst'));

  // 复制链接按钮
  const copyBtn=panel.querySelector('#resume-copy-btn');
  if(copyBtn){
    copyBtn.addEventListener('click',()=>{
      navigator.clipboard.writeText(shareUrl)
        .then(()=>{copyBtn.textContent='✅ 已复制！';setTimeout(()=>copyBtn.textContent='📋 复制链接',2000);})
        .catch(()=>{ prompt('请手动复制链接：',shareUrl); });
    });
  }

  // 更新状态文字和开始按钮
  if(allArrived){
    setSt(rst,'🎉 所有队友已就位！可以开始游戏。');
    bstart.disabled=false;
    bstart.textContent='▶ 恢复游戏';
  } else {
    setSt(rst,`📂 第${save.wave}波存档，等待 ${missing.length} 名队友加入…`);
    bstart.disabled=false;  // 房主可以不等，但会有弹窗
    bstart.textContent=`⚡ 直接恢复（${missing.length} 人未到）`;
  }
}

// 显示多人存档分享链接UI
function _showResumeShareLink(url, code, save){
  const old=document.getElementById('resume-share-box');
  if(old) old.remove();
  const playerCount=Object.keys(save.players||{}).length-1; // 除房主外
  const box=document.createElement('div');
  box.id='resume-share-box';
  box.style.cssText=`margin-top:10px;padding:10px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);
    border-radius:10px;font-size:11px`;
  box.innerHTML=`
    <div style="color:#a5b4fc;font-weight:900;margin-bottom:6px">📎 发送以下链接给队友（需${playerCount}人加入）</div>
    <div style="word-break:break-all;color:var(--text);background:rgba(0,0,0,.3);padding:6px;border-radius:6px;
      font-size:10px;margin-bottom:6px;user-select:all" id="resume-link-text">${url}</div>
    <button onclick="navigator.clipboard.writeText('${url.replace(/'/g,"\\'")}').then(()=>{
      this.textContent='✅ 已复制！';setTimeout(()=>this.textContent='📋 复制链接',2000);
    }).catch(()=>alert('链接：${url.replace(/'/g,"\\'")}'))"
      style="width:100%;padding:6px 0;border:none;border-radius:6px;
      background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;cursor:pointer;font-size:11px;font-weight:700">
      📋 复制链接
    </button>`;
  const croom=document.getElementById('croom');
  if(croom) croom.appendChild(box);
}

// 检查 URL 参数自动加入（玩家点击房主发的链接）
function checkAutoJoinFromUrl(){
  const params=new URLSearchParams(location.search);
  const session=params.get('session');
  const code=params.get('code');
  if(!session||!code) return false;
  // 自动填入房间码并标记 session
  const icode=document.getElementById('icode');
  if(icode) icode.value=decodeURIComponent(code);
  // 存储 session 到临时变量，join 时携带
  window._pendingSessionId=session;
  showMsg('🔗 检测到存档链接，正在自动加入…');
  // 延迟自动点击加入按钮
  setTimeout(()=>{
    const bjoin=document.getElementById('bjoin');
    if(bjoin) bjoin.click();
  }, 800);
  return true;
}

// ── 主菜单存档按钮渲染 ──
function renderSaveButtons(){
  const old=document.getElementById('save-resume-area');
  if(old) old.remove();
  const soloSave=loadSave(true);
  const multiSave=loadSave(false);
  if(!soloSave&&!multiSave) return;
  const cmenu=document.getElementById('cmenu');
  if(!cmenu) return;
  const area=document.createElement('div');
  area.id='save-resume-area';
  area.style.cssText='margin-top:10px;display:flex;flex-direction:column;gap:6px';
  if(soloSave){
    const d=new Date(soloSave.savedAt);
    const timeStr=`${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    const btn=document.createElement('button');
    btn.className='btn bp';
    btn.style.cssText='font-size:11px;padding:8px 12px;background:linear-gradient(135deg,#065f46,#047857)';
    btn.innerHTML=`📂 继续单人游戏 <span style="font-size:9px;opacity:.7;margin-left:4px">第${soloSave.wave}波 · ${timeStr}</span>`;
    btn.addEventListener('click',()=>resumeSoloSave());
    area.appendChild(btn);
  }
  if(multiSave){
    const d=new Date(multiSave.savedAt);
    const timeStr=`${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    const playerCount=Object.keys(multiSave.players||{}).length;
    const btn=document.createElement('button');
    btn.className='btn bs';
    btn.style.cssText='font-size:11px;padding:8px 12px;background:linear-gradient(135deg,#1e3a5f,#1e40af)';
    btn.innerHTML=`📂 继续多人游戏 <span style="font-size:9px;opacity:.7;margin-left:4px">第${multiSave.wave}波 · ${playerCount}人 · ${timeStr}</span>`;
    btn.addEventListener('click',()=>resumeMultiSave());
    area.appendChild(btn);
  }
  cmenu.appendChild(area);
}

function doSellTower(uid, charId){
  const stars=getProgress(charId).stars||0;
  const price=calcSellPrice(charId,stars);
  const charName=CHAR_MAP[charId]?.name||charId;
  const starLabel=['1','2','3','4','5'][stars]||'1';
  showSellConfirm(`出售 ${charName}（${starLabel}星）\n获得 ${price} 金币`, ()=>{
    _doSellTowerConfirmed(uid, charId, price);
  });
}
function _doSellTowerConfirmed(uid, charId, price){

  const numUid=Number(uid);

  // 1. 立即发放金币（不等回调）
  if(isHost||isSolo){
    worker&&worker.postMessage({type:'addGold',d:{pid:myPid,amount:price}});
  } else {
    netClient&&netClient.send({type:'reqAddGold',pid:myPid,amount:price});
  }
  myGold+=price;
  updateHud();

  // 2. 标记这次 removeTower 是出售（towerRemoved 回调里跳过退卡）
  if(!window._sellUids) window._sellUids=new Set();
  window._sellUids.add(numUid);

  // 3. 移除场上塔
  if(isHost||isSolo){
    worker&&worker.postMessage({type:'removeTower',d:{pid:myPid,uid:numUid}});
  } else {
    netClient&&netClient.send({type:'reqRemoveTower',pid:myPid,uid:numUid});
  }

  clearTowerDetail();
  const cn=CHAR_MAP[charId]?.name||charId;
  showMsg(`💰 出售 ${cn} 成功！+${price} 金币`);
}

// ── 执行出售背包中的卡（无需 Worker removeTower）──────────
// 背包出售（无二次确认，直接执行）
function doSellFromBagDirect(charId){
  const stars=getProgress(charId).stars||0;
  const price=calcSellPrice(charId,stars);
  const charName=CHAR_MAP[charId]?.name||charId;
  const idx=bag.findIndex(b=>b.id===charId);
  if(idx===-1){showMsg('背包中已无此角色',true);return;}
  const entry=bag[idx];
  entry.count=(entry.count||1)-1;
  if(entry.count<=0) bag.splice(idx,1);
  if(isHost||isSolo){
    worker&&worker.postMessage({type:'addGold',d:{pid:myPid,amount:price}});
  } else {
    netClient&&netClient.send({type:'reqAddGold',pid:myPid,amount:price});
  }
  myGold+=price;
  updateHud(); renderBag(); renderHand();
  closeDrawer&&closeDrawer();
  showMsg(`💰 出售 ${charName} 成功！+${price} 金币`);
}

function doSellFromBag(charId){
  const stars=getProgress(charId).stars||0;
  const price=calcSellPrice(charId,stars);
  const charName=CHAR_MAP[charId]?.name||charId;
  const starLabel=['1','2','3','4','5'][stars]||'1';
  showSellConfirm(`出售背包中 ${charName}（${starLabel}星）\n获得 ${price} 金币`, ()=>{
    // 从背包移除一张
    const idx=bag.findIndex(b=>b.id===charId);
    if(idx===-1){showMsg('背包中已无此角色',true);return;}
    const entry=bag[idx];
    entry.count=(entry.count||1)-1;
    if(entry.count<=0) bag.splice(idx,1);
    if(isHost||isSolo){
      worker&&worker.postMessage({type:'addGold',d:{pid:myPid,amount:price}});
    } else {
      netClient&&netClient.send({type:'reqAddGold',pid:myPid,amount:price});
    }
    myGold+=price;
    updateHud(); renderBag(); renderHand();
    closeDrawer&&closeDrawer();
    showMsg(`💰 出售 ${charName} 成功！+${price} 金币`);
  });
}

function clearTowerDetail(){
  selectedTower=null;
  if(renderer) renderer.selTower=null;
  ttdetbtn.style.display='none';
  // 切回角色图鉴 tab
  document.querySelectorAll('.stab').forEach(b=>b.classList.toggle('on',b.dataset.t==='chars'));
  document.querySelectorAll('.spane').forEach(p=>p.classList.toggle('on',p.id==='tchars'));
}

// ESC 键：取消一切选中
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(selCard){selCard=null;if(renderer)renderer.selTile=null;renderHand();}
    if(selectedTower) clearTowerDetail();
  }
});

// ── 商店位置（地图格子坐标）──
const SHOP_TILE={col:15,row:7};

function onCanvasClick(e){
  const rect=gc.getBoundingClientRect();
  const lp=clientToLocal(e.clientX,e.clientY,rect);
  const w=renderer.screenToWorld(lp.x, lp.y);
  const col=Math.floor(w.x/MAP.ts), row=Math.floor(w.y/MAP.ts);
  const key=col+','+row;

  // ── 优先检测：点击地图商店 ──
  if(col===SHOP_TILE.col&&row===SHOP_TILE.row){
    openShopModal(); return;
  }

  // ── 优先检测：点击地图装备铺 ──
  if(typeof EQUIP_SHOP_TILE!=='undefined'&&col===EQUIP_SHOP_TILE.col&&row===EQUIP_SHOP_TILE.row){
    openEquipShopModal(); return;
  }

  // ── 优先检测是否点到了某个塔（无论是否持有手牌）──
  let hitTower=null, hitOwner=null;
  if(lastSnap&&lastSnap.players){
    for(const [pid,ps] of Object.entries(lastSnap.players)){
      for(const t of ps.towers||[]){
        if(Math.floor(t.x/MAP.ts)===col&&Math.floor(t.y/MAP.ts)===row){
          hitTower=t; hitOwner=pid; break;
        }
      }
      if(hitTower) break;
    }
  }
  if(hitTower){
    // 点到塔：取消手牌选中，改为查看塔详情
    selCard=null; renderHand();
    selectedTower=hitTower;
    showTowerDetail(hitTower, hitOwner);
    return;
  }

  // ── 点到空地 ──
  // 如果有 selCard，下面继续走放塔逻辑
  // 如果无 selCard，取消所有选中
  if(!selCard){
    if(selectedTower) clearTowerDetail();
    return;
  }

  if(gameOver)return;
  // 判断卡来源：背包还是手牌
  const fromBag=selCard._fromBag===true;
  const bagSlotSel=fromBag?bag.find(b=>b.id===selCard.id):null;
  const hnd=fromBag?null:hand.find(h=>h.id===selCard.id);
  if(fromBag){
    if(!bagSlotSel||(bagSlotSel.count||1)<=0){showMsg('背包中没有该角色',true);selCard=null;renderHand();renderBag();return;}
  } else {
    if(!hnd||hnd.count<=0){showMsg('手牌中没有该角色',true);selCard=null;renderHand();return;}
  }

  // 商店格子也不能放塔
  if(col===SHOP_TILE.col&&row===SHOP_TILE.row){showMsg('💼 这里是商店，不能放置',true);return;}
  if(typeof EQUIP_SHOP_TILE!=='undefined'&&col===EQUIP_SHOP_TILE.col&&row===EQUIP_SHOP_TILE.row){showMsg('⚒️ 这里是装备铺，不能放置',true);return;}
  if(renderer.allPathTiles&&renderer.allPathTiles.has(key)){showMsg('不能放在路径上',true);return;}
  // 客户端本地预判（仍然依赖 Worker 服务端最终校验）
  if(lastSnap&&lastSnap.players){
    const allT=Object.values(lastSnap.players).flatMap(p=>p.towers||[]);
    if(allT.some(t=>Math.floor(t.x/MAP.ts)===col&&Math.floor(t.y/MAP.ts)===row)){
      showMsg('该格已被占用',true);return;
    }
  }

  // 乐观消耗卡牌（服务端拒绝时退还）
  const returnCardId=selCard.id;
  if(fromBag){
    bagSlotSel.count=(bagSlotSel.count||1)-1;
    if(bagSlotSel.count<=0) bag=bag.filter(b=>b!==bagSlotSel);
  } else {
    hnd.count--;
    if(hnd.count<=0) hand=hand.filter(h=>h.id!==selCard.id);
  }

  const tx=col*MAP.ts+MAP.ts/2, ty=row*MAP.ts+MAP.ts/2;
  // 读取角色当前等级进度，将技能倍率应用到 dmg
  const tProg=getProgress(selCard.id);
  const tSlv=calcSkillLv(tProg.lv||1, selCard.id);
  const tSmult=skillMult(tSlv);
  const tStars=tProg.stars||0;
  const tower={id:selCard.id,name:selCard.name,color:selCard.color,
    dmg:Math.round(selCard.dmg*tSmult),
    range:selCard.range,rate:selCard.rate,
    syns:selCard.syns||[],x:tx,y:ty,
    charLv:tProg.lv||1,charStars:tStars,skillLv:tSlv};
  const reqId=Date.now()+'_'+Math.random().toString(36).slice(2,6);

  if(isHost||isSolo){
    // Worker 会返回 towerDeny 时带回 _returnCard
    // 我们在消息里夹带 _returnCard 供 deny 时退还
    worker&&worker.postMessage({type:'tower',d:{pid:myPid,tower,reqId,_returnCard:returnCardId}});
  } else {
    netClient&&netClient.send({type:'placeTower',pid:myPid,tower,reqId});
    // 客户端放弃本地预判，依赖 snap 更新显示
  }
  renderer.selTile={col,row};
  const charName=selCard.name;
  // 判断是否还有剩余卡可放
  if(fromBag){
    const remaining=bag.find(b=>b.id===returnCardId);
    if(!remaining||(remaining.count||0)<=0) selCard=null;
    renderBag();
  } else {
    if(!hnd||(hnd.count||0)<=0) selCard=null;
    renderHand();
  }
  showMsg(charName+' 待确认中…');
}

// ─── 符咒系统 ─────────────────────────────────────────
// 符咒详细描述生成
function taliValueLabel(t){
  const pct=v=>Math.round(v*100)+'%';
  if(t.fx==='spd') return '攻速 +'+pct(t.v);
  if(t.fx==='dmg') return '攻击 +'+pct(t.v);
  if(t.fx==='rng') return '射程 +'+pct(t.v);
  if(t.fx==='gld') return '金币 +'+pct(t.v);
  if(t.fx==='rep') return '基地 +'+t.v+' HP';
  return '';
}

function offerTali(){
  // ── 符咒权重设计：基础咒为主体，专属咒/觉醒咒为稀有彩蛋 ──
  const myActiveSyns=(lastSnap&&lastSnap.players&&lastSnap.players[myPid]&&
    lastSnap.players[myPid].activeSynergies)||[];
  const activeSynIds=new Set(myActiveSyns.map(s=>s.id));

  // 构建权重池
  const weighted=[];
  for(const t of TALI){
    let w=0;
    if(t.fx==='spd'||t.fx==='dmg'||t.fx==='rng'||t.fx==='gld'||t.fx==='rep'){
      // 基础5种：权重最高，每次大概率出现
      w = activeTali.includes(t.id) ? 4 : 12;
    } else if(t.fx==='syn'){
      // 专属咒：已有激活对应羁绊权重3，否则1
      w = activeSynIds.has(t.synTarget) ? 3 : 1;
    } else if(t.fx==='multi'){
      // 觉醒咒：极稀有
      w = 1;
    }
    for(let i=0;i<w;i++) weighted.push(t);
  }

  // 随机抽3张不重复
  const chosen=new Set();
  const choices=[];
  let attempt=0;
  while(choices.length<3&&attempt<300){
    attempt++;
    const t=weighted[Math.random()*weighted.length|0];
    if(!chosen.has(t.id)){ chosen.add(t.id); choices.push(t); }
  }
  if(!choices.length){bnw.disabled=false;return;}

  // 填充模态框内容
  const grid=$('talimodal-grid');
  const sub=$('talimodal-sub');
  grid.innerHTML='';
  sub.textContent='波次完成！选择一张符咒强化你的防线';

  choices.forEach(t=>{
    const card=document.createElement('div');
    card.className='tali-choice';
    // 稀有度颜色边框
    const rColor=TALI_RARITY_COLOR[t.rarity||'common'];
    const rLabel=TALI_RARITY_LABEL[t.rarity||'common'];
    card.style.cssText+=`;border:1.5px solid ${rColor}40;`;
    // 羁绊专属标签
    let synTag='';
    if(t.fx==='syn'&&t.synTarget){
      const sdef=SYNERGIES.find(s=>s.id===t.synTarget);
      synTag=`<span style="display:inline-block;margin-top:4px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${rColor}33;color:${rColor}">🔗 ${sdef?sdef.name:t.synTarget} 专属</span>`;
    } else if(t.fx==='multi'){
      synTag=`<span style="display:inline-block;margin-top:4px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#f59e0b33;color:#f59e0b">⚡ 觉醒符咒</span>`;
    }
    card.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <span class="tali-choice-ico">${TALI_ICO[t.id]||'📜'}</span>
        <span style="font-size:10px;font-weight:700;color:${rColor};background:${rColor}22;padding:2px 6px;border-radius:4px">${rLabel}</span>
      </div>
      <div class="tali-choice-name">${t.name}</div>
      <div class="tali-choice-desc">${t.desc}</div>
      ${synTag}
      <span class="tali-choice-badge">${taliValueLabel(t)}</span>`;
    card.addEventListener('click',()=>{
      // 关闭模态框（带淡出动画）
      const modal=$('talimodal');
      modal.style.animation='fadeOut .2s ease forwards';
      setTimeout(()=>{
        modal.classList.add('hidden');
        modal.style.animation='';
      },200);

      // 应用符咒
      activeTali.push(t.id);
      if(isHost||isSolo){
        worker&&worker.postMessage({type:'tali',d:{pid:myPid,tali:t}});
      } else {
        netClient&&netClient.send({type:'tali',pid:myPid,tali:t});
      }

      // 更新右侧符咒面板
      renderOwnedTali();
      bnw.disabled=false;
    },{once:true});
    grid.appendChild(card);
  });

  // 弹出模态框
  const modal=$('talimodal');
  modal.classList.remove('hidden');
  modal.style.animation='fadeIn .3s ease';
}

// ════════════════════════════════════════════
// 装备系统
// ════════════════════════════════════════════

// ─── 装备数据定义 ──────────────────────────
const EQUIP_DATA = {
  // ══ 龙魂套装 ══ (攻击型，4件套)
  dragon_sword:   {name:'龙牙剑',    icon:'🗡️', quality:'rare',    set:'dragon', stat:{dmg:0.12},         price:80,  desc:'攻击+12%'},
  dragon_armor:   {name:'龙鳞甲',    icon:'🛡️', quality:'rare',    set:'dragon', stat:{dmg:0.08,rng:0.05},price:90,  desc:'攻击+8% 射程+5%'},
  dragon_ring:    {name:'龙魂戒',    icon:'💍', quality:'epic',    set:'dragon', stat:{dmg:0.15},         price:120, desc:'攻击+15%'},
  dragon_crown:   {name:'龙焰冠',    icon:'👑', quality:'legendary',set:'dragon', stat:{dmg:0.20},         price:180, desc:'攻击+20%'},

  // ══ 星辰套装 ══ (射程型，3件套)
  star_lens:      {name:'星辰望远镜',icon:'🔭', quality:'rare',    set:'star',   stat:{rng:0.15},         price:85,  desc:'射程+15%'},
  star_boots:     {name:'星辉战靴',  icon:'👢', quality:'rare',    set:'star',   stat:{rng:0.10,spd:0.05},price:75,  desc:'射程+10% 攻速+5%'},
  star_cloak:     {name:'星尘斗篷',  icon:'🧥', quality:'epic',    set:'star',   stat:{rng:0.18,dmg:0.05},price:130, desc:'射程+18% 攻击+5%'},

  // ══ 疾风套装 ══ (攻速型，3件套)
  wind_glove:     {name:'疾风手套',  icon:'🧤', quality:'rare',    set:'wind',   stat:{spd:0.15},         price:80,  desc:'攻速+15%'},
  wind_feather:   {name:'风羽饰品',  icon:'🪶', quality:'rare',    set:'wind',   stat:{spd:0.12},         price:70,  desc:'攻速+12%'},
  wind_bow:       {name:'疾风弓',    icon:'🏹', quality:'epic',    set:'wind',   stat:{spd:0.20,dmg:0.08},price:140, desc:'攻速+20% 攻击+8%'},

  // ══ 守护套装 ══ (经济型，2/4件套，全局收益)
  gold_coin:      {name:'金财硬币',  icon:'🪙', quality:'common',  set:'gold',   stat:{gld:0.05},         price:50,  desc:'金币获取+5%'},
  gold_horn:      {name:'财运号角',  icon:'📯', quality:'rare',    set:'gold',   stat:{gld:0.08},         price:70,  desc:'金币获取+8%'},
  gold_bag:       {name:'聚宝袋',    icon:'💰', quality:'epic',    set:'gold',   stat:{gld:0.12},         price:110, desc:'金币获取+12%'},
  gold_crown:     {name:'守财冕',    icon:'🎖️', quality:'legendary',set:'gold',  stat:{gld:0.15,dmg:0.10},price:160, desc:'金币+15% 攻击+10%'},

  // ══ 烈火套装 ══ (全系强化，2/3件套)
  flame_pendant:  {name:'烈焰坠饰',  icon:'🔥', quality:'rare',    set:'flame',  stat:{dmg:0.10,spd:0.08},price:100, desc:'攻击+10% 攻速+8%'},
  flame_shield:   {name:'炎护盾',    icon:'🔴', quality:'epic',    set:'flame',  stat:{dmg:0.12,rng:0.10},price:130, desc:'攻击+12% 射程+10%'},
  flame_core:     {name:'炎晶核心',  icon:'💎', quality:'legendary',set:'flame', stat:{dmg:0.18,spd:0.12,rng:0.08},price:200,desc:'攻击+18% 攻速+12% 射程+8%'},

  // ══ 冰霜套装 ══ (减速辅助，2/3件套)  
  frost_gem:      {name:'寒冰宝石',  icon:'💠', quality:'rare',    set:'frost',  stat:{rng:0.12,spd:0.08},price:90,  desc:'射程+12% 攻速+8%'},
  frost_staff:    {name:'霜寒权杖',  icon:'🪄', quality:'epic',    set:'frost',  stat:{dmg:0.15,rng:0.12},price:145, desc:'攻击+15% 射程+12%'},
  frost_crystal:  {name:'冰魂晶体',  icon:'🔮', quality:'legendary',set:'frost', stat:{dmg:0.20,rng:0.15,spd:0.10},price:195,desc:'攻击+20% 射程+15% 攻速+10%'},

  // ══ 独立装备（无套装）══
  eagle_eye:      {name:'鹰眼单镜',  icon:'🦅', quality:'rare',    set:null,     stat:{rng:0.20},         price:95,  desc:'射程+20%'},
  war_drum:       {name:'战鼓',      icon:'🥁', quality:'rare',    set:null,     stat:{spd:0.18},         price:90,  desc:'攻速+18%'},
  power_stone:    {name:'力量宝石',  icon:'🟠', quality:'epic',    set:null,     stat:{dmg:0.22},         price:150, desc:'攻击+22%'},
  lucky_charm:    {name:'幸运符石',  icon:'🍀', quality:'common',  set:null,     stat:{gld:0.10},         price:60,  desc:'金币+10%'},
  berserker_axe:  {name:'狂战斧',    icon:'🪓', quality:'epic',    set:null,     stat:{dmg:0.18,spd:0.10},price:155, desc:'攻击+18% 攻速+10%'},
  guardian_tome:  {name:'守护典籍',  icon:'📖', quality:'epic',    set:null,     stat:{dmg:0.10,rng:0.10,spd:0.05},price:140,desc:'攻击+10% 射程+10% 攻速+5%'},
  void_crystal:   {name:'虚空晶石',  icon:'🌑', quality:'legendary',set:null,    stat:{dmg:0.25,rng:0.15},price:220, desc:'攻击+25% 射程+15%'},

  // ══ 专属套装：太阳神套（3件，需与专属角色搭配威力翻倍）══
  // 专属绑定角色：'sunwarrior'（太阳战士）
  solar_blade:    {name:'太阳圣剑',  icon:'☀️', quality:'legendary',set:'solar',  stat:{dmg:0.22},         price:200, desc:'攻击+22%', exclusive:'sunwarrior'},
  solar_wings:    {name:'日曜羽翼',  icon:'🌟', quality:'legendary',set:'solar',  stat:{dmg:0.15,spd:0.15},price:190, desc:'攻击+15% 攻速+15%', exclusive:'sunwarrior'},
  solar_crown:    {name:'炎阳神冠',  icon:'🌞', quality:'legendary',set:'solar',  stat:{dmg:0.18,rng:0.18},price:210, desc:'攻击+18% 射程+18%', exclusive:'sunwarrior'},

  // ══ 专属套装：幽灵套（2件，暗影系专属）══
  ghost_dagger:   {name:'幽冥匕首',  icon:'🌙', quality:'epic',    set:'ghost',  stat:{dmg:0.16,spd:0.12},price:150, desc:'攻击+16% 攻速+12%', exclusive:'shadowblade'},
  ghost_mantle:   {name:'暗影斗篷',  icon:'🌫️', quality:'epic',    set:'ghost',  stat:{dmg:0.12,rng:0.14},price:140, desc:'攻击+12% 射程+14%', exclusive:'shadowblade'},
};

// ─── 套装定义 ──────────────────────────────
// bonuses: [{need:件数, bonus:{dmg?,rng?,spd?,gld?}, desc:说明}]
// exclusiveBonus: 角色ID匹配时额外倍率
const EQUIP_SETS = {
  dragon:{
    name:'龙魂',icon:'🐉',color:'#ff7043',
    bonuses:[
      {need:2,bonus:{dmg:0.20},desc:'2件：全局攻击+20%'},
      {need:4,bonus:{dmg:0.50,rng:0.15},desc:'4件：全局攻击+50% 射程+15%'},
    ]
  },
  star:{
    name:'星辰',icon:'⭐',color:'#74b9ff',
    bonuses:[
      {need:2,bonus:{rng:0.15},desc:'2件：射程+15%'},
      {need:3,bonus:{rng:0.40,dmg:0.12},desc:'3件：射程+40% 攻击+12%'},
    ]
  },
  wind:{
    name:'疾风',icon:'💨',color:'#7dffb1',
    bonuses:[
      {need:2,bonus:{spd:0.20},desc:'2件：攻速+20%'},
      {need:3,bonus:{spd:0.45,dmg:0.10},desc:'3件：攻速+45% 攻击+10%'},
    ]
  },
  gold:{
    name:'守护',icon:'💛',color:'#ffd36b',
    bonuses:[
      {need:2,bonus:{gld:0.05},desc:'2件：金币+5%'},
      {need:4,bonus:{gld:0.15,dmg:0.15},desc:'4件：金币+15% 攻击+15%'},
    ]
  },
  flame:{
    name:'烈火',icon:'🔥',color:'#ff6b35',
    bonuses:[
      {need:2,bonus:{dmg:0.15,spd:0.10},desc:'2件：攻击+15% 攻速+10%'},
      {need:3,bonus:{dmg:0.28,spd:0.22,rng:0.12},desc:'3件：攻击+28% 攻速+22% 射程+12%'},
    ]
  },
  frost:{
    name:'冰霜',icon:'❄️',color:'#a3d8ff',
    bonuses:[
      {need:2,bonus:{rng:0.18,spd:0.10},desc:'2件：射程+18% 攻速+10%'},
      {need:3,bonus:{dmg:0.20,rng:0.28,spd:0.18},desc:'3件：攻击+20% 射程+28% 攻速+18%'},
    ]
  },
  solar:{
    name:'太阳神',icon:'🌞',color:'#ffd700',
    exclusiveChar:'sunwarrior', // 专属角色ID
    exclusiveMultiplier:2.0,    // 专属角色所有加成翻倍
    bonuses:[
      {need:2,bonus:{dmg:0.30},desc:'2件：攻击+30%'},
      {need:3,bonus:{dmg:0.60,rng:0.30,spd:0.20},desc:'3件：攻击+60% 射程+30% 攻速+20% (专属角色效果翻倍)'},
    ]
  },
  ghost:{
    name:'幽灵',icon:'👻',color:'#c084fc',
    exclusiveChar:'shadowblade',
    exclusiveMultiplier:1.8,
    bonuses:[
      {need:2,bonus:{dmg:0.35,spd:0.25,rng:0.20},desc:'2件：攻击+35% 攻速+25% 射程+20% (暗影专属效果×1.8)'},
    ]
  },
};

const EQUIP_QUALITY_LABEL={common:'普通',rare:'精英',epic:'史诗',legendary:'传说'};
const EQUIP_QUALITY_COLOR={common:'#b2bec3',rare:'#74b9ff',epic:'#c084fc',legendary:'#ffd700'};

// ─── 生成新装备实例UID ──────────────────────
function _newEquipUid(){ return 'eq_'+(++_eqUidCounter)+'_'+Date.now(); }

// ─── 获得一件装备（加入装备库）──────────────
function gainEquip(equipId){
  const def=EQUIP_DATA[equipId];
  if(!def){ console.warn('未知装备ID:',equipId); return; }
  const inst={id:equipId, uid:_newEquipUid()};
  equipBag.push(inst);
  renderEquipPanel();
  showMsg(`✨ 获得装备：${def.icon}${def.name}`,false);
}

// ─── 计算某个场上角色的装备加成（含套装加成）─────
// charUid: 塔的uid；charId: 角色模板ID
function calcEquipBonus(charUid, charId){
  const bonus={dmg:0,rng:0,spd:0,gld:0};
  const equippedUids=charEquips[charUid]||[];
  if(!equippedUids.length) return bonus;

  // 收集已装备的装备实例
  const items=equippedUids.map(uid=>equipBag.find(e=>e.uid===uid)).filter(Boolean);
  const itemDefs=items.map(inst=>EQUIP_DATA[inst.id]).filter(Boolean);

  // 基础属性加成
  for(const def of itemDefs){
    bonus.dmg+=(def.stat.dmg||0);
    bonus.rng+=(def.stat.rng||0);
    bonus.spd+=(def.stat.spd||0);
    bonus.gld+=(def.stat.gld||0);
  }

  // 套装加成计算
  const setCount={};
  for(const def of itemDefs){
    if(def.set) setCount[def.set]=(setCount[def.set]||0)+1;
  }

  for(const [setId, cnt] of Object.entries(setCount)){
    const setDef=EQUIP_SETS[setId];
    if(!setDef) continue;

    // 判断是否为专属角色
    const isExclusive=setDef.exclusiveChar && charId===setDef.exclusiveChar;
    const exclMult=isExclusive?(setDef.exclusiveMultiplier||1):1;

    for(const tier of setDef.bonuses){
      if(cnt>=tier.need){
        bonus.dmg+=(tier.bonus.dmg||0)*exclMult;
        bonus.rng+=(tier.bonus.rng||0)*exclMult;
        bonus.spd+=(tier.bonus.spd||0)*exclMult;
        bonus.gld+=(tier.bonus.gld||0)*exclMult;
      }
    }
  }
  return bonus;
}

// ─── 给角色装上装备 ──────────────────────────
// charUid: 塔uid，equipInstUid: 装备实例uid
function equipItem(charUid, equipInstUid){
  const inst=equipBag.find(e=>e.uid===equipInstUid);
  if(!inst){ showMsg('装备不存在',true); return false; }
  if(!charEquips[charUid]) charEquips[charUid]=[];
  if(charEquips[charUid].length>=4){ showMsg('该角色最多携带4件装备',true); return false; }
  if(charEquips[charUid].includes(equipInstUid)) return false;
  charEquips[charUid].push(equipInstUid);
  const def=EQUIP_DATA[inst.id];
  showMsg(`🛡️ 已装备：${def.icon}${def.name}`,false);
  renderEquipPanel();
  _syncEquipBonusesToWorker();
  // 联机同步
  if(isHost) _broadcastEquipSync();
  else if(netClient) netClient.send({type:'equipSync',charEquips,equipBag});
  return true;
}

// ─── 卸下装备 ────────────────────────────────
function unequipItem(charUid, equipInstUid){
  if(!charEquips[charUid]) return;
  charEquips[charUid]=charEquips[charUid].filter(u=>u!==equipInstUid);
  if(!charEquips[charUid].length) delete charEquips[charUid];
  renderEquipPanel();
  _syncEquipBonusesToWorker();
  if(isHost) _broadcastEquipSync();
  else if(netClient) netClient.send({type:'equipSync',charEquips,equipBag});
}

// ─── 将装备加成发给 Worker（每次装备变化时调用）──
function _syncEquipBonusesToWorker(){
  const bonuses=getMyEquipBonusForSnap();
  const msg={type:'updateEquipBonuses',d:{pid:myPid,bonuses}};
  if(worker) worker.postMessage(msg);
  else if(!isHost&&netClient) netClient.send(msg);
}

// ─── 联机广播装备同步 ─────────────────────────
function _broadcastEquipSync(){
  if(!netHost) return;
  const msg={type:'equipSyncAll', players:{}};
  // host 自己
  msg.players[myPid]={charEquips,equipBag};
  // 广播给所有客户端
  netHost.broadcast(msg);
}

// ─── 渲染装备面板 ────────────────────────────
function renderEquipPanel(){
  const panel=$('tequip');
  if(!panel) return;
  if(equipBag.length===0){
    panel.innerHTML=`
      <div class="equip-hint">🛡️ 装备系统<br>
        波次奖励或商店购买装备后，<b>按住拖拽</b>装备到场上角色身上。
      </div>
      <div class="equip-empty">🎒 装备库为空<br><span style="font-size:9px">完成波次或前往商店获取装备</span></div>`;
    return;
  }
  // 按套装分组
  const groups={};
  for(const inst of equipBag){
    const def=EQUIP_DATA[inst.id];
    if(!def) continue;
    const grp=def.set||'__none__';
    if(!groups[grp]) groups[grp]=[];
    groups[grp].push(inst);
  }
  let html=`<div class="equip-hint">🛡️ <b>按住拖拽</b>到场上角色装备 | 点击查看详情</div>`;
  // 先输出有套装的分组
  const setKeys=Object.keys(groups).filter(k=>k!=='__none__').sort();
  const noSetItems=groups['__none__']||[];
  for(const setId of setKeys){
    const sd=EQUIP_SETS[setId];
    html+=`<div class="equip-section-hdr">${sd?sd.icon+' '+sd.name+'套装':'套装'}</div>`;
    html+=`<div class="equip-bag-grid">`;
    for(const inst of groups[setId]) html+=_buildEquipCardHtml(inst);
    html+=`</div>`;
  }
  if(noSetItems.length){
    html+=`<div class="equip-section-hdr">⚙️ 独立装备</div>`;
    html+=`<div class="equip-bag-grid">`;
    for(const inst of noSetItems) html+=_buildEquipCardHtml(inst);
    html+=`</div>`;
  }
  panel.innerHTML=html;
  // 绑定拖拽和 tooltip 事件
  panel.querySelectorAll('.equip-card').forEach(el=>{
    _bindEquipCardDrag(el);
    _bindEquipCardTooltip(el);
  });
}

function _buildEquipCardHtml(inst){
  const def=EQUIP_DATA[inst.id];
  if(!def) return '';
  const qLabel=EQUIP_QUALITY_LABEL[def.quality]||'普通';
  const isEquipped=Object.values(charEquips).some(arr=>arr.includes(inst.uid));
  const equippedStyle=isEquipped?'opacity:.55;outline:2px solid #7dffb1;':'';
  return `<div class="equip-card" data-q="${def.quality}" data-uid="${inst.uid}" data-id="${inst.id}"
    style="${equippedStyle}" title="${def.name}">
    <span class="eq-qbadge ${def.quality}">${qLabel}</span>
    <span class="eq-ico">${def.icon}</span>
    <span class="eq-nm">${def.name}</span>
    ${isEquipped?'<span style="position:absolute;bottom:1px;right:2px;font-size:7px;color:#7dffb1;font-weight:900">装</span>':''}
  </div>`;
}

// ─── 装备卡片 Tooltip ────────────────────────
function _bindEquipCardTooltip(el){
  const tt=$('equip-tooltip');
  el.addEventListener('mouseenter', e=>{
    const id=el.dataset.id;
    const uid=el.dataset.uid;
    const def=EQUIP_DATA[id];
    if(!def) return;
    $('eq-tt-name').innerHTML=`${def.icon} ${def.name} <span style="color:${EQUIP_QUALITY_COLOR[def.quality]};font-size:10px">[${EQUIP_QUALITY_LABEL[def.quality]}]</span>`;
    const statParts=[];
    if(def.stat.dmg) statParts.push(`⚔ 攻击+${Math.round(def.stat.dmg*100)}%`);
    if(def.stat.rng) statParts.push(`🎯 射程+${Math.round(def.stat.rng*100)}%`);
    if(def.stat.spd) statParts.push(`⚡ 攻速+${Math.round(def.stat.spd*100)}%`);
    if(def.stat.gld) statParts.push(`💰 金币+${Math.round(def.stat.gld*100)}%`);
    $('eq-tt-stat').textContent=statParts.join('  ');
    if(def.set){
      const sd=EQUIP_SETS[def.set];
      $('eq-tt-set').textContent=`${sd?sd.icon+' '+sd.name:''}套装`;
    } else { $('eq-tt-set').textContent=''; }
    if(def.exclusive){
      $('eq-tt-excl').textContent=`⚡ 专属角色效果大幅增强`;
    } else { $('eq-tt-excl').textContent=''; }
    // 是否已装备
    const isEq=Object.values(charEquips).some(arr=>arr.includes(uid));
    tt.querySelector('.eq-tt-name').style.color=isEq?'#7dffb1':'';
    if(isEq){
      const ttextra=document.createElement('div');
      ttextra.style.cssText='font-size:9px;color:#7dffb1;margin-top:3px';
      ttextra.textContent='✓ 已装备中';
      // avoid duplicate
      tt.querySelectorAll('.eq-equipped-hint').forEach(x=>x.remove());
      ttextra.className='eq-equipped-hint';
      tt.appendChild(ttextra);
    } else { tt.querySelectorAll('.eq-equipped-hint').forEach(x=>x.remove()); }
    tt.style.display='block';
    _posTooltip(e,tt);
  });
  el.addEventListener('mousemove', e=>_posTooltip(e,tt));
  el.addEventListener('mouseleave',()=>{ tt.style.display='none'; });
}
function _posTooltip(e,tt){
  const z=getZoom();
  // tooltip 是 position:fixed，其 left/top 在缩放坐标系下，clientX/Y 是物理坐标需先转换
  let x=e.clientX/z+14, y=e.clientY/z+8;
  const vw=window.innerWidth/z, vh=window.innerHeight/z;
  if(x+210>vw) x=e.clientX/z-220;
  if(y+140>vh) y=e.clientY/z-150;
  tt.style.left=x+'px'; tt.style.top=y+'px';
}

// ══════════════════════════════════════════════════
//  🎒 背包角色拖拽上阵系统
// ══════════════════════════════════════════════════

let _bagDragPending = null;   // {charId, charDef, el, startX, startY}
let _bagDragging    = false;

function _bindBagCardDrag(el, charDef, slot){
  el.addEventListener('mousedown', e=>{
    if(e.button !== 0) return;
    // 不拦截「上阵」按钮自身
    if(e.target.classList.contains('bag-to-hand')) return;
    e.preventDefault();
    _bagDragPending = {charId: slot.id, charDef, el, startX: e.clientX, startY: e.clientY};
  });
}

// 全局 mousemove 处理背包拖拽（注入到已有的 mousemove 监听之前用独立函数）
document.addEventListener('mousemove', _onBagDragMove);
function _onBagDragMove(e){
  if(!_bagDragPending && !_bagDragging) return;
  // 待定阶段：判断是否超过阈值
  if(_bagDragPending && !_bagDragging){
    const dx = e.clientX - _bagDragPending.startX;
    const dy = e.clientY - _bagDragPending.startY;
    if(dx*dx + dy*dy > DRAG_THRESHOLD * DRAG_THRESHOLD){
      // 确认为拖拽
      const {charDef, el} = _bagDragPending;
      _bagDragging = true;
      el.classList.add('dragging');
      // 更新幽灵
      const ghost = $('bag-drag-ghost');
      $('bdg-ico').textContent = charDef.emoji || '⚔️';
      $('bdg-nm').textContent  = charDef.name;
      ghost.style.display = 'flex';
      // 高亮 Canvas 以提示可放置
      _bagDragHighlight(e.clientX, e.clientY);
    }
    if(_bagDragging){
      const z = getZoom();
      const ghost = $('bag-drag-ghost');
      ghost.style.left = (e.clientX / z) + 'px';
      ghost.style.top  = (e.clientY / z) + 'px';
    }
    return;
  }
  if(!_bagDragging) return;
  const z = getZoom();
  const ghost = $('bag-drag-ghost');
  ghost.style.left = (e.clientX / z) + 'px';
  ghost.style.top  = (e.clientY / z) + 'px';
  _bagDragHighlight(e.clientX, e.clientY);
}

document.addEventListener('mouseup', _onBagDragUp);
function _onBagDragUp(e){
  if(_bagDragPending && !_bagDragging){
    // 没有拖拽，纯点击，清除待定即可
    _bagDragPending = null;
    return;
  }
  if(!_bagDragging) return;

  const charId = _bagDragPending ? _bagDragPending.charId : null;
  const el     = _bagDragPending ? _bagDragPending.el     : null;

  // 清理状态
  _bagDragging    = false;
  _bagDragPending = null;
  $('bag-drag-ghost').style.display = 'none';
  _bagDragClearHL();
  if(el){
    el.classList.remove('dragging');
    el._justDragged = true;   // 阻止接下来的 click 触发详情
  }

  if(!charId) return;

  // 检测落点是否在 Canvas 上
  const canvas = $('gc');
  if(!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const z = getZoom();
  const lx = e.clientX / z, ly = e.clientY / z;
  if(lx < rect.left || lx > rect.right || ly < rect.top || ly > rect.bottom){
    showMsg('请拖拽到地图上放置', true);
    return;
  }

  // 将落点转为地图格子坐标
  const cx = lx - rect.left, cy = ly - rect.top;
  const w = renderer.screenToWorld(cx, cy);
  const col = Math.floor(w.x / MAP.ts);
  const row = Math.floor(w.y / MAP.ts);
  const key = col + ',' + row;

  // 选中该角色，然后模拟放置到该格子
  // 先通过 selectCard 选中（把它放入手牌并选中），再触发放置
  _placeBagCharAt(charId, col, row, key);
}

// 拖拽时高亮 Canvas 上的可放置格子
function _bagDragHighlight(mx, my){
  if(!renderer) return;
  const canvas = $('gc');
  if(!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const z = getZoom();
  const lx = mx/z, ly = my/z;
  if(lx < rect.left || lx > rect.right || ly < rect.top || ly > rect.bottom){
    if(renderer) renderer.selTile = null;
    return;
  }
  const cx = lx - rect.left, cy = ly - rect.top;
  const w = renderer.screenToWorld(cx, cy);
  const col = Math.floor(w.x / MAP.ts);
  const row = Math.floor(w.y / MAP.ts);
  // 用 renderer.selTile 高亮当前格子（复用已有的格子高亮逻辑）
  renderer.selTile = col + ',' + row;
}

function _bagDragClearHL(){
  if(renderer) renderer.selTile = null;
}

// 将背包角色拖拽放置到指定格子（直接内联全部逻辑，避免中间状态问题）
function _placeBagCharAt(charId, col, row, key){
  const c = CHAR_MAP[charId];
  if(!c){ showMsg('未知角色', true); return; }
  if(gameOver) return;

  // 校验格子
  if(col===SHOP_TILE.col&&row===SHOP_TILE.row){showMsg('💼 这里是商店，不能放置',true);return;}
  if(typeof EQUIP_SHOP_TILE!=='undefined'&&col===EQUIP_SHOP_TILE.col&&row===EQUIP_SHOP_TILE.row){showMsg('⚒️ 这里是装备铺，不能放置',true);return;}
  if(renderer&&renderer.allPathTiles&&renderer.allPathTiles.has(key)){showMsg('不能放在路径上',true);return;}
  if(lastSnap&&lastSnap.players){
    const allT=Object.values(lastSnap.players).flatMap(p=>p.towers||[]);
    if(allT.some(t=>Math.floor(t.x/MAP.ts)===col&&Math.floor(t.y/MAP.ts)===row)){
      showMsg('该格已被占用',true);return;
    }
  }

  // 找背包槽
  const bagSlotSel = bag.find(b=>b.id===charId);
  if(!bagSlotSel||(bagSlotSel.count||1)<=0){showMsg('背包中没有该角色',true);return;}

  // 乐观消耗
  bagSlotSel.count=(bagSlotSel.count||1)-1;
  if(bagSlotSel.count<=0) bag=bag.filter(b=>b!==bagSlotSel);

  // 构建塔数据
  const tProg  = getProgress(charId);
  const tStars = tProg.stars||0;
  const tSlv   = Math.max(1, Math.round(1 + tStars*0.5 + (tProg.lv||1)*0.1));
  const skillDef = (c.skill&&typeof SKILLS!=='undefined'&&SKILLS[c.skill])||null;
  const tSmult   = skillDef?(1+(skillDef.dmgMult||0)*tSlv*0.1):1;
  const tx = col*MAP.ts+MAP.ts/2, ty = row*MAP.ts+MAP.ts/2;

  const tower={
    id:c.id, name:c.name, emoji:c.emoji,
    color:c.color||'#fff',
    dmg:Math.round((c.dmg||10)*tSmult),
    range:c.range||3, rate:c.rate||1,
    syns:c.syns||[], x:tx, y:ty,
    charLv:tProg.lv||1, charStars:tStars, skillLv:tSlv
  };
  const reqId=Date.now()+'_'+Math.random().toString(36).slice(2,6);

  if(isHost||isSolo){
    worker&&worker.postMessage({type:'tower',d:{pid:myPid,tower,reqId,_returnCard:charId}});
  } else {
    netClient&&netClient.send({type:'placeTower',pid:myPid,tower,reqId});
  }

  selCard=null;
  if(renderer) renderer.selTile={col,row};
  renderBag();
  showMsg(c.name+' 待确认中…');
}

// ─── 拖拽系统（移动超过阈值才触发，否则视为点击）──
let _dragEquipUid=null;     // 当前拖拽中的装备实例uid
let _dragEquipEl=null;      // 原始 DOM 元素
let _dragEquipId=null;      // 装备 id
let _dragPending=null;      // 待确认是否为拖拽 {uid,id,el,startX,startY}
const DRAG_THRESHOLD=6;     // 超过 6px 才算拖拽

function _bindEquipCardDrag(el){
  el.addEventListener('mousedown', e=>{
    if(e.button!==0) return;
    e.preventDefault();
    const uid=el.dataset.uid;
    const id=el.dataset.id;
    if(!EQUIP_DATA[id]) return;
    // 记录待定状态，先不启动拖拽
    _dragPending={uid,id,el,startX:e.clientX,startY:e.clientY};
    $('equip-tooltip').style.display='none';
  });
}

// 全局 mousemove：超过阈值后才真正启动拖拽
document.addEventListener('mousemove', e=>{
  // 待定阶段：判断是否超过阈值
  if(_dragPending && !_dragEquipUid){
    const dx=e.clientX-_dragPending.startX;
    const dy=e.clientY-_dragPending.startY;
    if(dx*dx+dy*dy > DRAG_THRESHOLD*DRAG_THRESHOLD){
      // 确认为拖拽，启动幽灵
      const {uid,id,el}=_dragPending;
      const def=EQUIP_DATA[id];
      _dragEquipUid=uid;
      _dragEquipId=id;
      _dragEquipEl=el;
      _dragPending=null;
      el.classList.add('dragging');
      const ghost=$('equip-ghost');
      $('equip-ghost-ico').textContent=def.icon;
      $('equip-ghost-nm').textContent=def.name;
      ghost.style.display='flex';
      ghost.style.left=e.clientX+'px';
      ghost.style.top=e.clientY+'px';
    }
    return;
  }
  if(!_dragEquipUid) return;
  // 拖拽进行中：更新幽灵位置
  const ghost=$('equip-ghost');
  ghost.style.left=e.clientX+'px';
  ghost.style.top=e.clientY+'px';
  // 高亮 Canvas 上的塔 或 详情面板的装备槽
  _checkEquipDropHighlight(e.clientX, e.clientY);
  _checkEquipSlotHighlight(e.clientX, e.clientY);
});

document.addEventListener('mouseup', e=>{
  // 若还在待定阶段（移动距离不够），视为普通点击，不做任何事
  if(_dragPending){ _dragPending=null; return; }
  if(!_dragEquipUid) return;
  const uid=_dragEquipUid;
  _dragEquipUid=null;
  _dragEquipId=null;
  _dragPending=null;
  // 清理幽灵 & 高亮
  $('equip-ghost').style.display='none';
  $('equip-drop-overlay').style.display='none';
  _clearSlotHighlight();
  if(_dragEquipEl){ _dragEquipEl.classList.remove('dragging'); _dragEquipEl=null; }

  // ① 先检测：是否落在塔详情面板的装备槽（空槽）
  const slotEl = document.elementFromPoint(e.clientX, e.clientY);
  const emptySlot = slotEl && slotEl.closest('.char-equip-slot:not(.filled)');
  if(emptySlot){
    const charUid = emptySlot.dataset.charUid;
    if(charUid){
      if(equipItem(charUid, uid)){
        // 实时刷新塔详情面板
        _refreshTowerDetailIfOpen(charUid);
      }
    }
    return;
  }

  // ② 再检测：是否落在 Canvas 上的塔
  const canvas=$('gc');
  if(!canvas) return;
  const rect=canvas.getBoundingClientRect();
  const z=getZoom();
  const lx=e.clientX/z, ly=e.clientY/z;
  if(lx<rect.left||lx>rect.right||ly<rect.top||ly>rect.bottom) return;
  const cx=lx-rect.left;
  const cy=ly-rect.top;
  const tw=_tryEquipOnTowerAt(cx,cy,uid);
  if(tw) _refreshTowerDetailIfOpen(tw.uid);
});

// ─── 高亮塔详情面板里的空装备槽 ─────────────────
function _checkEquipSlotHighlight(mx,my){
  const el=document.elementFromPoint(mx,my);
  const slot=el&&el.closest('.char-equip-slot:not(.filled)');
  document.querySelectorAll('.char-equip-slot:not(.filled)').forEach(s=>{
    s.classList.toggle('drag-over', s===slot);
  });
}
function _clearSlotHighlight(){
  document.querySelectorAll('.char-equip-slot.drag-over').forEach(s=>s.classList.remove('drag-over'));
}

// ─── 装备/卸下后实时刷新塔详情面板 ──────────────
function _refreshTowerDetailIfOpen(charUid){
  const ttdetEl=$('ttdet');
  if(!ttdetEl||!ttdetEl._towerRef) return;
  // 若当前塔详情展示的就是这个塔，立即刷新
  if(String(ttdetEl._towerRef.uid)===String(charUid)){
    showTowerDetail(ttdetEl._towerRef, ttdetEl._ownerRef);
  }
}

// ─── 检测鼠标下是否有塔并高亮 ──────────────────
function _checkEquipDropHighlight(mx,my){
  const canvas=$('gc');
  const overlay=$('equip-drop-overlay');
  if(!canvas||!lastSnap){ overlay.style.display='none'; return; }
  const rect=canvas.getBoundingClientRect();
  const z=getZoom();
  const lx=mx/z, ly=my/z;
  if(lx<rect.left||lx>rect.right||ly<rect.top||ly>rect.bottom){ overlay.style.display='none'; return; }
  const cx=lx-rect.left, cy=ly-rect.top;
  const tw=_findTowerAt(cx,cy);
  if(tw&&renderer){
    const eqCnt=(charEquips[tw.uid]||[]).length;
    const canEquip=eqCnt<4;
    // 将塔的世界坐标转换为屏幕坐标以定位 overlay
    // overlay 是 position:fixed，坐标在缩放空间内，需乘以 zoom 还原
    const cam=renderer.cam;
    const sx=tw.x*cam.scale+cam.x; // 世界→屏幕(逻辑px)
    const sy=tw.y*cam.scale+cam.y;
    const r=Math.max(22, 20*cam.scale);
    overlay.style.display='block';
    overlay.style.left=((rect.left+sx-r)*z)+'px';
    overlay.style.top=((rect.top+sy-r)*z)+'px';
    overlay.style.width=(r*2)+'px';
    overlay.style.height=(r*2)+'px';
    overlay.style.borderRadius='50%';
    overlay.style.borderColor=canEquip?'var(--pri)':'var(--danger)';
    overlay.style.background=canEquip?'rgba(95,140,255,.15)':'rgba(255,107,107,.12)';
  } else { overlay.style.display='none'; }
}

// ─── 在 Canvas 坐标找到我方塔 ──────────────────
// cx/cy 是相对于 Canvas 元素的屏幕像素坐标
function _findTowerAt(cx,cy){
  if(!lastSnap||!lastSnap.players||!renderer) return null;
  const ps=lastSnap.players[myPid];
  if(!ps||!ps.towers) return null;
  // 将屏幕坐标转为世界坐标
  const w=renderer.screenToWorld(cx,cy);
  const hitR=20/renderer.cam.scale; // 命中半径（世界单位，随缩放调整）
  for(const tw of ps.towers){
    const dx=w.x-tw.x, dy=w.y-tw.y;
    if(dx*dx+dy*dy<=hitR*hitR) return tw;
  }
  return null;
}

// ─── 尝试将装备放到指定坐标的塔上，返回成功时的塔对象 ──
function _tryEquipOnTowerAt(cx,cy,equipInstUid){
  const tw=_findTowerAt(cx,cy);
  if(!tw){ showMsg('请拖拽到场上角色身上',true); return null; }
  if((charEquips[tw.uid]||[]).includes(equipInstUid)){
    showMsg('该角色已装备此物品',true); return null;
  }
  const ok=equipItem(tw.uid, equipInstUid);
  return ok ? tw : null;
}

// ─── 渲染角色详情抽屉中的装备槽区块 ──────────────
// charUid: 场上塔的uid（若null则是背包角色）
// charId: 角色模板ID
function buildEquipSlotHtml(charUid, charId){
  const slots=charUid?(charEquips[charUid]||[]):[];
  const insts=slots.map(uid=>equipBag.find(e=>e.uid===uid)).filter(Boolean);
  let slotsHtml='';
  for(let i=0;i<4;i++){
    const inst=insts[i];
    if(inst){
      const def=EQUIP_DATA[inst.id];
      slotsHtml+=`<div class="char-equip-slot filled" data-uid="${inst.uid}" data-char-uid="${charUid}" title="点击卸下：${def?def.name:''}">
        <span class="ces-rm">✕</span>
        <span class="ces-ico">${def?def.icon:'?'}</span>
        <span class="ces-nm">${def?def.name:'未知'}</span>
      </div>`;
    } else {
      slotsHtml+=`<div class="char-equip-slot" data-slot="${i}" data-char-uid="${charUid||''}">
        <span style="font-size:10px;opacity:.3">+</span>
        <span style="font-size:7px;opacity:.3">装备</span>
      </div>`;
    }
  }

  // 套装加成摘要（仅有角色uid才显示）
  let setBonusHtml='';
  if(charUid && insts.length>0){
    const setCount={};
    for(const inst of insts){
      const def=EQUIP_DATA[inst.id];
      if(def&&def.set) setCount[def.set]=(setCount[def.set]||0)+1;
    }
    const activeRows=[];
    for(const [setId,cnt] of Object.entries(setCount)){
      const sd=EQUIP_SETS[setId];
      if(!sd) continue;
      const isExcl=sd.exclusiveChar&&charId===sd.exclusiveChar;
      for(const tier of sd.bonuses){
        const active=cnt>=tier.need;
        const exclNote=isExcl&&active?` <span style="color:#ffd36b;font-size:8px">★专属×${sd.exclusiveMultiplier}</span>`:'';
        activeRows.push(`<div class="set-bonus-row">
          <span class="set-bonus-tag ${active?'active':''}">${sd.icon}${cnt}/${tier.need}</span>
          <span class="sbt">${sd.name}</span>
          <span class="sbv">${tier.desc.replace(/^\d件：/,'')}${exclNote}</span>
        </div>`);
      }
    }
    if(activeRows.length){
      setBonusHtml=`<div class="set-bonus-box">
        <div class="set-bonus-title">🎯 套装加成</div>${activeRows.join('')}
      </div>`;
    }
  }

  const bgLabel=charUid?'(点击槽位卸下装备)':'(上阵后可装备)';
  return `<div style="margin-top:8px">
    <div style="font-size:9px;font-weight:800;color:var(--pri2);margin-bottom:4px;letter-spacing:1px">
      🛡️ 装备槽 <span style="color:var(--muted);font-weight:600;font-size:8px">${bgLabel}</span>
    </div>
    <div class="char-equip-slots">${slotsHtml}</div>
    ${setBonusHtml}
  </div>`;
}

// ─── 绑定抽屉中装备槽的点击（卸下）事件 ──────────
function bindDrawerEquipSlots(container){
  container.querySelectorAll('.char-equip-slot.filled').forEach(sl=>{
    sl.addEventListener('click', e=>{
      e.stopPropagation();
      const uid=sl.dataset.uid;
      const charUid=sl.dataset.charUid;
      if(!uid||!charUid) return;
      unequipItem(charUid, uid);
      // 判断是 ttdet（地图塔详情面板）还是 drawer-body（侧边抽屉）
      const ttdetEl=$('ttdet');
      if(ttdetEl && ttdetEl.contains(sl)){
        // 重新渲染塔详情面板
        const tRef = ttdetEl._towerRef;
        const oRef = ttdetEl._ownerRef;
        if(tRef && oRef) showTowerDetail(tRef, oRef);
      } else {
        // 重新打开侧边角色抽屉
        const nameEl=$('drawer-name');
        if(nameEl&&nameEl._charId) showCharDetail(nameEl._charId);
      }
    });
  });
}

// ─── 装备加成同步到 Worker（每次放塔/重算时调用）─
// 在发送 snap update 时附加装备加成数据
function getMyEquipBonusForSnap(){
  // 为 worker 提供每个塔的装备加成 {uid: {dmg,rng,spd,gld}}
  if(!lastSnap||!lastSnap.players||!lastSnap.players[myPid]) return {};
  const result={};
  const towers=lastSnap.players[myPid].towers||[];
  for(const tw of towers){
    const charId=tw.id;
    const bonus=calcEquipBonus(tw.uid, charId);
    if(bonus.dmg||bonus.rng||bonus.spd||bonus.gld){
      result[tw.uid]=bonus;
    }
  }
  return result;
}

// ─── 波次奖励：随机掉落装备 ────────────────────────
function rollEquipDrop(wave){
  // 每4波有概率掉落一件装备，随波次提升品质概率
  if(wave%4!==0) return;
  const roll=Math.random();
  let pool;
  if(wave>=20) pool=Object.keys(EQUIP_DATA).filter(k=>['epic','legendary'].includes(EQUIP_DATA[k].quality));
  else if(wave>=12) pool=Object.keys(EQUIP_DATA).filter(k=>['rare','epic'].includes(EQUIP_DATA[k].quality));
  else pool=Object.keys(EQUIP_DATA).filter(k=>['common','rare'].includes(EQUIP_DATA[k].quality));
  const id=pool[Math.floor(Math.random()*pool.length)];
  gainEquip(id);
}

// ══════════════════════════════════════════════════
//  ⚒️  装备铺 — 独立商店系统
// ══════════════════════════════════════════════════

// 装备铺状态
let equipShopSlots = [];          // 当前上架的4件：[{id, sold}]
let equipShopRefreshCost = 2;     // 当前刷新费用（随波次增加）
let _equipShopAutoRefreshed = false; // 本波是否已自动刷新

/** 计算当前波次的刷新费用 */
function _calcEquipShopRefreshCost(){
  const wave = (typeof currentWave !== 'undefined' ? currentWave : 1) || 1;
  if(wave <= 5)  return 2;
  if(wave <= 10) return 4;
  if(wave <= 20) return 6;
  return 8;
}

/** 生成4件随机装备上架（含稀有度权重） */
function _rollEquipShopSlots(){
  const allIds = Object.keys(EQUIP_DATA||{});
  if(!allIds.length) return [];
  const wave = (typeof currentWave !== 'undefined' ? currentWave : 1) || 1;

  // 稀有度权重随波次提升
  const qualityWeight = {
    common:    Math.max(5, 40 - wave*1.5),
    rare:      30,
    epic:      Math.min(35, 15 + wave*1.2),
    legendary: Math.min(15, wave*0.6)
  };
  const totalW = Object.values(qualityWeight).reduce((a,b)=>a+b,0);

  function pickByWeight(){
    let r = Math.random()*totalW, acc=0;
    for(const [q,w] of Object.entries(qualityWeight)){
      acc+=w; if(r<=acc) return q;
    }
    return 'common';
  }

  const result=[], usedIds=new Set();
  for(let i=0;i<4;i++){
    const q=pickByWeight();
    const pool=allIds.filter(id=>EQUIP_DATA[id].quality===q && !usedIds.has(id));
    const fallback=allIds.filter(id=>!usedIds.has(id));
    const chosen=(pool.length?pool:fallback)[Math.floor(Math.random()*(pool.length||fallback.length))];
    if(chosen){ usedIds.add(chosen); result.push({id:chosen,sold:false}); }
  }
  return result;
}

/** 渲染装备铺商品网格 */
function _renderEquipShopGrid(){
  const grid = $('eshop-grid');
  if(!grid) return;
  if(!equipShopSlots.length){
    grid.innerHTML='<div class="equip-shop-empty">🎒 暂无可购装备，请等待刷新</div>';
    return;
  }
  grid.innerHTML='';
  equipShopSlots.forEach((slot,idx)=>{
    const def = EQUIP_DATA[slot.id];
    if(!def) return;
    const statParts=[];
    if(def.stat&&def.stat.dmg) statParts.push(`⚔️+${Math.round(def.stat.dmg*100)}%`);
    if(def.stat&&def.stat.rng) statParts.push(`🎯+${Math.round(def.stat.rng*100)}%`);
    if(def.stat&&def.stat.spd) statParts.push(`⚡+${Math.round(def.stat.spd*100)}%`);
    if(def.stat&&def.stat.gld) statParts.push(`💰+${Math.round(def.stat.gld*100)}%`);
    const setInfo = def.set&&EQUIP_SETS[def.set] ? EQUIP_SETS[def.set] : null;
    const cantAfford = !slot.sold && myGold < def.price;

    const item = document.createElement('div');
    item.className = 'equip-shop-item' + (slot.sold?' sold':'');
    item.dataset.q = def.quality||'common';
    item.style.paddingBottom = '30px';
    item.innerHTML = `
      <span class="esi-ico">${def.icon||'📦'}</span>
      <div class="esi-info">
        <div class="esi-name" style="color:${(typeof EQUIP_QUALITY_COLOR!=='undefined'?EQUIP_QUALITY_COLOR[def.quality]:'#fff')||'#fff'}">${def.name}</div>
        <div class="esi-desc">${statParts.join(' ')||'—'}</div>
        ${setInfo?`<div class="esi-set">${setInfo.icon||''}${setInfo.name}套装</div>`:''}
        ${def.exclusive?`<div class="esi-excl">★ ${def.exclusive}专属·${def.exclusiveMultiplier||2}倍效果</div>`:''}
      </div>
      ${slot.sold
        ? `<span class="esi-sold-tag">已售出</span>`
        : `<span class="esi-price ${cantAfford?'cant-afford':''}">${def.price}💰</span>`}
    `;
    if(!slot.sold){
      item.title = cantAfford?'金币不足':'点击购买';
      item.addEventListener('click',()=>_buyEquipShopSlot(idx));
    }
    grid.appendChild(item);
  });
}

/** 购买装备铺第 idx 格 */
function _buyEquipShopSlot(idx){
  const slot = equipShopSlots[idx];
  if(!slot||slot.sold) return;
  const def = EQUIP_DATA[slot.id];
  if(!def) return;
  if(myGold < def.price){ showMsg('💸 金币不足',true); return; }

  // 扣金币（权威端同步）
  const spendMsg={type:'spendGold',pid:myPid,amount:def.price,d:{pid:myPid,amount:def.price}};
  if(worker) worker.postMessage(spendMsg);
  else if(!isHost&&netClient) netClient.send(spendMsg);
  myGold -= def.price;

  // 标记已售
  equipShopSlots[idx].sold = true;

  // 加入背包
  gainEquip(slot.id);

  // 刷新显示
  const goldNum=$('eshop-gold-num');
  if(goldNum) goldNum.textContent=myGold;
  _renderEquipShopGrid();
  _updateEquipShopRefreshBtn();

  showMsg(`🎉 获得 ${def.icon}${def.name}！`);
}

/** 更新刷新按钮状态 */
function _updateEquipShopRefreshBtn(){
  const btn=$('eshop-refresh-btn');
  const costEl=$('eshop-refresh-cost');
  const goldNum=$('eshop-gold-num');
  if(goldNum) goldNum.textContent=myGold;
  if(costEl)  costEl.textContent=`（${equipShopRefreshCost}💰）`;
  if(btn)     btn.disabled = myGold < equipShopRefreshCost;
}

/** 手动刷新装备铺（消耗金币） */
function manualRefreshEquipShop(){
  if(myGold < equipShopRefreshCost){ showMsg('💸 金币不足，无法刷新',true); return; }
  const spendMsg={type:'spendGold',pid:myPid,amount:equipShopRefreshCost,d:{pid:myPid,amount:equipShopRefreshCost}};
  if(worker) worker.postMessage(spendMsg);
  else if(!isHost&&netClient) netClient.send(spendMsg);
  myGold -= equipShopRefreshCost;
  equipShopSlots = _rollEquipShopSlots();
  _renderEquipShopGrid();
  _updateEquipShopRefreshBtn();
}

/** 每波次自动刷新（免费，只调用一次） */
function autoRefreshEquipShopOnWave(){
  if(_equipShopAutoRefreshed) return;
  _equipShopAutoRefreshed = true;
  equipShopRefreshCost = _calcEquipShopRefreshCost();
  equipShopSlots = _rollEquipShopSlots();
  // 若商店此刻是打开的，刷新显示
  const modal=$('equip-shop-modal');
  if(modal&&modal.classList.contains('open')){
    _renderEquipShopGrid();
    _updateEquipShopRefreshBtn();
    const wt=$('eshop-wave-tip');
    const wave=(typeof currentWave!=='undefined'?currentWave:1)||1;
    if(wt) wt.textContent=`第 ${wave} 波（已刷新）`;
  }
}

/** 打开装备铺 */
function openEquipShopModal(){
  const modal=$('equip-shop-modal');
  if(!modal) return;
  // 若还没滚过商品，先滚一次（开局首次）
  if(!equipShopSlots.length) equipShopSlots = _rollEquipShopSlots();
  equipShopRefreshCost = _calcEquipShopRefreshCost();
  const wave=(typeof currentWave!=='undefined'?currentWave:1)||1;
  const wt=$('eshop-wave-tip');
  if(wt) wt.textContent=`第 ${wave} 波`;
  _renderEquipShopGrid();
  _updateEquipShopRefreshBtn();
  modal.classList.add('open');
}

/** 关闭装备铺 */
function closeEquipShopModal(){
  const modal=$('equip-shop-modal');
  if(modal) modal.classList.remove('open');
}

// 绑定装备铺按钮事件（等 DOM 就绪后执行）
(function _bindEquipShopEvents(){
  const closeBtn=$('equip-shop-close');
  const refreshBtn=$('eshop-refresh-btn');
  const modal=$('equip-shop-modal');
  if(closeBtn)   closeBtn.addEventListener('click', closeEquipShopModal);
  if(refreshBtn) refreshBtn.addEventListener('click', manualRefreshEquipShop);
  if(modal){
    modal.addEventListener('click',e=>{ if(e.target===modal) closeEquipShopModal(); });
    // ESC 键关闭
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&modal.classList.contains('open')) closeEquipShopModal();
    });
  }
})();

// ─── 存档集成：装备数据序列化 ────────────────────
function serializeEquipState(){
  return {equipBag, charEquips, _eqUidCounter};
}
function restoreEquipState(data){
  if(!data) return;
  equipBag=data.equipBag||[];
  charEquips=data.charEquips||{};
  _eqUidCounter=data._eqUidCounter||1;
  renderEquipPanel();
}

// ─── 游戏重置时清空装备 ──────────────────────────
function resetEquipState(){
  equipBag=[];
  charEquips={};
  _eqUidCounter=1;
  // 同时重置装备铺状态
  equipShopSlots=[];
  equipShopRefreshCost=2;
  _equipShopAutoRefreshed=false;
  closeEquipShopModal&&closeEquipShopModal();
}

// ════════════════════════════════════════════
// 地图内商店系统
// ════════════════════════════════════════════

// ─── 打开商店 ──────────────────────────────
function openShopModal(){
  const modal=$('shop-modal');
  // 确保 myGold 是最新值
  if(lastSnap&&lastSnap.players&&lastSnap.players[myPid]){
    myGold=lastSnap.players[myPid].gold;
  }
  $('shop-gold-num').textContent=myGold;
  renderShopBody();
  modal.classList.add('open');
}
function closeShopModal(){
  $('shop-modal').classList.remove('open');
}
$('shop-close').addEventListener('click',closeShopModal);
$('shop-modal').addEventListener('click',e=>{if(e.target===$('shop-modal'))closeShopModal();});

// ── 人口价格表（与 Worker 侧一致）──────────────────────
const SLOT_COSTS_UI=[0,0,0,0,0, 500,900,1500,2300,3300,4500];

// ─── 渲染商店内容 ──────────────────────────
function renderShopBody(){
  // 克隆替换，清除旧事件监听器
  const oldBody=$('shop-body');
  const body=oldBody.cloneNode(false);
  oldBody.replaceWith(body);
  body.innerHTML='';
  // 更新金币
  $('shop-gold-num').textContent=myGold;

  // ── 人口扩充区 ──────────────────────────────────────
  const curSlot=(lastSnap&&lastSnap.players&&lastSnap.players[myPid])
    ? (lastSnap.players[myPid].slotLimit||4) : 4;
  const curUsed=(lastSnap&&lastSnap.players&&lastSnap.players[myPid])
    ? (lastSnap.players[myPid].towers||[]).length : 0;
  const MAX_SLOT=10;
  const nextSlot=curSlot+1;
  const nextCost=SLOT_COSTS_UI[nextSlot]||null;

  const slotSection=document.createElement('div');
  slotSection.style.cssText='margin-bottom:14px;padding:12px 14px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid #334155';
  const atMax=curSlot>=MAX_SLOT;
  slotSection.innerHTML=
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
      '<div>' +
        '<div style="font-size:13px;font-weight:700;color:#e0e8f0;margin-bottom:3px">👥 人口扩充</div>' +
        '<div style="font-size:11px;color:#94a3b8">当前人口上限：<b style="color:#7dd3fc">'+curSlot+'/'+MAX_SLOT+'</b>　已上阵：<b style="color:'+(curUsed>=curSlot?'#f87171':'#86efac')+'">'+curUsed+'</b></div>' +
        (atMax ? '<div style="font-size:11px;color:#fbbf24;margin-top:3px">✅ 人口已达最大上限</div>'
               : '<div style="font-size:11px;color:#94a3b8;margin-top:3px">下一格：<b style="color:#fbbf24">+'+nextCost+' 💰</b>　→ '+nextSlot+' 格</div>') +
      '</div>' +
      (!atMax ? '<button id="btn-buy-slot" style="white-space:nowrap;padding:8px 16px;border-radius:8px;border:none;background:'+(myGold>=nextCost?'linear-gradient(135deg,#3b82f6,#6366f1)':'#334155')+';color:'+(myGold>=nextCost?'#fff':'#64748b')+';font-size:12px;font-weight:700;cursor:'+(myGold>=nextCost?'pointer':'not-allowed')+'">'+(myGold>=nextCost?'购买 +1 格':'金币不足')+'</button>' : '') +
    '</div>';
  body.appendChild(slotSection);

  if(!atMax){
    const btnBuySlot=slotSection.querySelector('#btn-buy-slot');
    if(btnBuySlot&&myGold>=nextCost){
      btnBuySlot.addEventListener('click',()=>{
        doBuySlot();
        closeShopModal();
      });
    }
  }

  // ── 分割线 ──────────────────────────────────────────
  const hr=document.createElement('div');
  hr.style.cssText='margin:8px 0 14px;border-top:1px solid #1e293b;padding-top:12px;font-size:11px;color:#475569;text-align:center;letter-spacing:.5px';
  hr.textContent='── 角色召唤 ──';
  body.appendChild(hr);

  GACHA_TIERS.forEach(tier=>{
    const rc=RARITY_CFG[tier.id];
    const card=document.createElement('div');
    card.className=`gacha-card ${tier.id}`;
    const canx1=myGold>=tier.cost1, canx5=myGold>=tier.cost5;

    card.innerHTML=
      '<div class="gc-top">' +
        '<span class="gc-badge '+tier.id+'">'+rc.abbr+'</span>' +
        '<span class="gc-name">'+tier.name+'</span>' +
        '<span class="gc-ico">'+tier.ico+'</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--muted);margin:-2px 0 2px">'+tier.desc+'</div>' +
      '<div class="gc-rates">' +
        '<div class="gc-rate-row"><span class="gc-rate-label">普通 N</span><span class="gc-rate-val n">'+Math.round(tier.rates.n*100)+'%</span></div>' +
        '<div class="gc-rate-row"><span class="gc-rate-label">稀有 R</span><span class="gc-rate-val r">'+Math.round(tier.rates.r*100)+'%</span></div>' +
        '<div class="gc-rate-row"><span class="gc-rate-label">史诗 SR</span><span class="gc-rate-val sr">'+Math.round(tier.rates.sr*100)+'%</span></div>' +
        '<div class="gc-rate-row"><span class="gc-rate-label">传说 SSR</span><span class="gc-rate-val ssr">'+Math.round(tier.rates.ssr*100)+'%</span></div>' +
      '</div>' +
      '<div class="gc-actions" id="gc-actions-'+tier.id+'"></div>';
    body.appendChild(card);

    // 直接绑定按钮事件（避免委托链问题）
    const actionsEl=card.querySelector('.gc-actions');
    const btn1=document.createElement('button');
    btn1.className='gc-btn '+tier.id;
    btn1.disabled=!canx1;
    btn1.title=canx1?'':'金币不足';
    btn1.innerHTML='单抽<br><span style="font-size:10px;font-weight:900">'+tier.cost1+'💰</span>';
    btn1.addEventListener('click',function(e){ e.stopPropagation(); doShopGacha(tier.id,1); });
    actionsEl.appendChild(btn1);

    const btn5=document.createElement('button');
    btn5.className='gc-btn '+tier.id;
    btn5.disabled=!canx5;
    btn5.title=canx5?'':'金币不足';
    btn5.innerHTML='五连抽<br><span style="font-size:10px;font-weight:900">'+tier.cost5+'💰</span>';
    btn5.addEventListener('click',function(e){ e.stopPropagation(); doShopGacha(tier.id,5); });
    actionsEl.appendChild(btn5);
  });

}

// ─── 购买人口格 ───────────────────────────
function doBuySlot(){
  if(isHost||isSolo){
    worker&&worker.postMessage({type:'buySlot',d:{pid:myPid}});
  } else {
    netClient&&netClient.send({type:'buySlot',d:{pid:myPid}});
  }
}

// ─── 执行品质抽卡 ──────────────────────────
function doShopGacha(tierId, n){
  const tier=GACHA_TIERS.find(t=>t.id===tierId);
  if(!tier){ showMsg('❌ 找不到召唤台：'+tierId,true); return; }
  // 确保金币最新
  if(lastSnap&&lastSnap.players&&lastSnap.players[myPid]){
    myGold=lastSnap.players[myPid].gold;
  }
  const cost=n===1?tier.cost1:tier.cost5;
  if(myGold<cost){showMsg('💰 金币不足！需要'+cost+'金，当前'+myGold,true);return;}
  if(!worker&&(isHost||isSolo)){showMsg('❌ 游戏未开始，无法抽卡',true);return;}

  setSt(gst,'祈愿中…');
  if(isHost||isSolo){
    worker.postMessage({type:'gacha',d:{pid:myPid,n,tierId}});
  } else {
    netClient&&netClient.send({type:'gacha',pid:myPid,n,tierId});
  }
  closeShopModal();
}

// ─── 抽卡结果展示 ─────────────────────────
function showGachaResult(gotArr){
  const overlay=$('gacha-result-overlay');
  const cardsEl=$('gacha-result-cards');
  cardsEl.innerHTML='';

  // 按稀有度排序（稀有在后，更醒目）
  const order={n:0,r:1,sr:2,ssr:3};
  const sorted=[...gotArr].sort((a,b)=>(order[a.rarity||'n']||0)-(order[b.rarity||'n']||0));

  sorted.forEach((c,i)=>{
    const rc=RARITY_CFG[c.rarity||'n'];
    const div=document.createElement('div');
    div.className=`gacha-result-card ${c.rarity||'n'}`;
    div.style.animationDelay=i*0.08+'s';
    div.innerHTML=`
      <span class="rc-ico">${c.emoji||'⚔️'}</span>
      <span class="rc-name">${c.name}</span>
      <span class="rc-badge" style="background:${rc.bg};color:${rc.color};border:1px solid ${rc.color}44">${rc.abbr}</span>`;
    cardsEl.appendChild(div);
  });

  // 标题 & 音效
  const hasSSR=sorted.some(c=>c.rarity==='ssr');
  const hasSR=sorted.some(c=>c.rarity==='sr');
  $('gacha-result-title').textContent=
    hasSSR?'✨ 传说降临！': hasSR?'💫 史诗出现！':'🎴 获得英雄';
  $('gacha-result-title').style.color=
    hasSSR?'#7fe7ff': hasSR?'#c084fc':'var(--text)';

  // 抽卡音效：SSR 华彩，SR 明亮，普通轻拨
  if(hasSSR)       SFX.play.gachaSSR();
  else if(hasSR)   SFX.play.gachaSR();
  else             SFX.play.gachaNormal();

  overlay.classList.add('open');
}
$('gacha-result-close').addEventListener('click',()=>{
  $('gacha-result-overlay').classList.remove('open');
});

// ─── 覆写 gachaResult 处理逻辑（支持品质展示）──
// 原有的 gachaResult 处理在主消息循环中，这里用 monkey-patch 方式
// 在 worker 消息 gachaResult 时，额外调用 showGachaResult
// （已在 worker onmessage / netClient onmessage 中处理，此处为补充入口）
function handleGachaResultExtra(msg){
  if(!msg.ok) return;
  const chars=msg.got.map(id=>CHAR_MAP[id]).filter(Boolean);
  showGachaResult(chars);
}
// 注册到全局，供消息处理器调用
window._handleGachaResultExtra=handleGachaResultExtra;

// ─── 设置面板逻辑 ─────────────────────────────
(function(){
  const overlay=$('settings-overlay');
  const btn=$('bsettings');
  if(!overlay||!btn) return;

  function pct(v){ return Math.round(v*100)+'%'; }

  // 打开设置
  btn.addEventListener('click',()=>{
    SFX.init(); // 确保音频上下文已初始化
    overlay.style.display='flex';
  });
  $('settings-close').addEventListener('click',()=>{ overlay.style.display='none'; });
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.style.display='none'; });

  // 滑块同步
  const sliders=[
    {id:'vol-master', valId:'vol-master-val', key:'master'},
    {id:'vol-bgm',    valId:'vol-bgm-val',    key:'bgm'},
    {id:'vol-sfx',    valId:'vol-sfx-val',    key:'sfx'},
  ];
  sliders.forEach(s=>{
    const el=$( s.id), valEl=$(s.valId);
    if(!el||!valEl) return;
    el.addEventListener('input',()=>{
      valEl.textContent=pct(+el.value);
      const m=+$('vol-master').value;
      const b=+$('vol-bgm').value;
      const x=+$('vol-sfx').value;
      SFX.setVol(m,b,x);
    });
  });
})();

// ─── 渲染器：绘制地图商店图标 ─────────────────
// 在 Renderer.draw() 中注入商店绘制（通过 prototype 扩展）
const _origDraw=Renderer.prototype.draw;
Renderer.prototype.draw=function(dt){
  _origDraw.call(this,dt);
  if(!this.cur||!this.map) return;
  this._drawShop();
};
Renderer.prototype._drawShop=function(){
  const {ts}=this.map;
  const {col,row}=SHOP_TILE;
  const ctx=this.ctx;
  const dpr=this._dpr||1;
  const t=Date.now()/1000;

  ctx.save();
  ctx.setTransform(
    this.cam.scale*dpr,0,
    0,this.cam.scale*dpr,
    this.cam.x*dpr,this.cam.y*dpr
  );

  const sx=col*ts, sy=row*ts;
  const cx=sx+ts/2, cy=sy+ts/2;
  const r=ts*0.42;

  // 脉冲光晕
  const pulse=0.5+0.5*Math.sin(t*2.5);
  const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.6);
  grd.addColorStop(0,`rgba(255,211,107,${0.25+pulse*0.15})`);
  grd.addColorStop(1,'rgba(255,211,107,0)');
  ctx.fillStyle=grd;
  ctx.beginPath(); ctx.arc(cx,cy,r*1.6,0,Math.PI*2); ctx.fill();

  // 背景圆
  const bg=ctx.createRadialGradient(cx,cy-r*0.2,0,cx,cy,r);
  bg.addColorStop(0,'#3a2e10');
  bg.addColorStop(1,'#1a1500');
  ctx.fillStyle=bg;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

  // 金色边框
  ctx.strokeStyle=`rgba(255,211,107,${0.7+pulse*0.3})`;
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();

  // 商店 emoji
  ctx.font=`${ts*0.38}px Arial`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🏪',cx,cy);

  // 下方文字
  ctx.font=`bold ${ts*0.14}px Arial`;
  ctx.fillStyle=`rgba(255,211,107,${0.8+pulse*0.2})`;
  ctx.textBaseline='top';
  ctx.fillText('商店',cx,sy+ts*0.78);

  ctx.restore();
};

// ─── 装备铺地图图标（商店右侧一格）─────────────────
const EQUIP_SHOP_TILE = {col: SHOP_TILE.col+1, row: SHOP_TILE.row};

Renderer.prototype._drawEquipShop = function(){
  const {ts} = this.map;
  const {col,row} = EQUIP_SHOP_TILE;
  const ctx = this.ctx;
  const dpr = this._dpr||1;
  const t = Date.now()/1000;

  ctx.save();
  ctx.setTransform(
    this.cam.scale*dpr, 0,
    0, this.cam.scale*dpr,
    this.cam.x*dpr, this.cam.y*dpr
  );

  const sx=col*ts, sy=row*ts;
  const cx=sx+ts/2, cy=sy+ts/2;
  const r=ts*0.42;
  const pulse=0.5+0.5*Math.sin(t*2.2+1.5);

  // 光晕
  const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.6);
  grd.addColorStop(0,`rgba(192,132,252,${0.22+pulse*0.12})`);
  grd.addColorStop(1,'rgba(192,132,252,0)');
  ctx.fillStyle=grd;
  ctx.beginPath(); ctx.arc(cx,cy,r*1.6,0,Math.PI*2); ctx.fill();

  // 背景圆
  const bg=ctx.createRadialGradient(cx,cy-r*0.2,0,cx,cy,r);
  bg.addColorStop(0,'#2e1a3a');
  bg.addColorStop(1,'#180d22');
  ctx.fillStyle=bg;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

  // 紫色边框
  ctx.strokeStyle=`rgba(192,132,252,${0.7+pulse*0.3})`;
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();

  // 图标
  ctx.font=`${ts*0.36}px Arial`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('⚒️',cx,cy);

  // 下方文字
  ctx.font=`bold ${ts*0.14}px Arial`;
  ctx.fillStyle=`rgba(192,132,252,${0.8+pulse*0.2})`;
  ctx.textBaseline='top';
  ctx.fillText('装备铺',cx,sy+ts*0.78);

  ctx.restore();
};

// 在 draw() 中注入装备铺绘制
const _origDrawEquipPatch=Renderer.prototype.draw;
Renderer.prototype.draw=function(dt){
  _origDrawEquipPatch.call(this,dt);
  if(!this.cur||!this.map) return;
  this._drawEquipShop&&this._drawEquipShop();
};

// ─── HUD 快捷按钮 ─────────────────────────────────
if($('bg1')){
  const oldBg1=$('bg1');
  const newBg1=oldBg1.cloneNode(false);
  newBg1.innerHTML='🏪 角色商店<br><small>点击地图🏪</small>';
  newBg1.addEventListener('click', openShopModal);
  oldBg1.replaceWith(newBg1);
}
if($('bg5')){
  const oldBg5=$('bg5');
  const newBg5=oldBg5.cloneNode(false);
  newBg5.style.display='';
  newBg5.innerHTML='⚒️ 装备铺<br><small>点击地图⚒️</small>';
  newBg5.addEventListener('click', openEquipShopModal);
  oldBg5.replaceWith(newBg5);
}

})(); // end IIFE
