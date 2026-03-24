/**
 * export_excel.js
 * 从 index.html 提取 CHARS / SYNERGIES / ENEMIES 配置表，
 * 导出为 game_data_backup.xlsx（三张 Sheet）
 * 运行: node export_excel.js
 */

const fs   = require('fs');
const path = require('path');

// ── 1. 尝试引入 exceljs，若未安装则自动安装 ──────────────
let ExcelJS;
try { ExcelJS = require('exceljs'); }
catch(e){
  console.log('⏳ 正在安装 exceljs...');
  require('child_process').execSync('npm install exceljs', {stdio:'inherit'});
  ExcelJS = require('exceljs');
}

// ── 2. 从 index.html 提取原始 JS 数据 ────────────────────
const html   = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// 用 vm 沙盒执行，只暴露我们需要的变量
const vm     = require('vm');
const ctx    = { console, CHARS:null, SYNERGIES:null, SYN_DEF:null, ENEMIES:null };
// 注入浏览器全局 stub，防止报错
const stub   = `
  const document={getElementById:()=>({addEventListener:()=>{},style:{},textContent:'',innerHTML:'',classList:{add:()=>{},remove:()=>{}}}),
    querySelector:()=>null,querySelectorAll:()=>[],body:{appendChild:()=>{}},addEventListener:()=>{}};
  const window={devicePixelRatio:1,addEventListener:()=>{},requestAnimationFrame:()=>{}};
  const navigator={hardwareConcurrency:4};
  const Worker=class{constructor(){}postMessage(){}onmessage=null};
  const URL={createObjectURL:()=>''};
  const Blob=class{constructor(){}};
  const Audio=class{constructor(){this.volume=1}play(){return Promise.resolve()}};
  const localStorage={getItem:()=>null,setItem:()=>{}};
  const HTMLCanvasElement=class{};
  function hexPath(){}
`;
try {
  vm.runInNewContext(stub + script, ctx, {timeout:8000});
} catch(e) {
  // 运行时错误（DOM 操作）是预期的，数据应该已提取
  if(!e.message.includes('document') && !e.message.includes('window') && !e.message.includes('canvas')){
    console.warn('⚠️  VM 警告:', e.message.slice(0,120));
  }
}

// 直接用 eval 提取数据（更简单，跳过 DOM 依赖）
// 从脚本中截取数据段
function extractArray(src, varName) {
  const start = src.indexOf(`const ${varName}`);
  if(start===-1) return null;
  // 找到第一个 [
  let bi = src.indexOf('[', start);
  if(bi===-1) return null;
  // 同时追踪 [] 和 {} 的嵌套深度，以确保完整提取
  let bracketDepth=0, braceDepth=0;
  let inStr=false, strChar='', escape=false;
  let i=bi;
  for(;i<src.length;i++){
    const ch=src[i];
    if(escape){ escape=false; continue; }
    if(ch==='\\'){ escape=true; continue; }
    if(inStr){ if(ch===strChar) inStr=false; continue; }
    if(ch==='"'||ch==="'"||ch==='`'){ inStr=true; strChar=ch; continue; }
    if(ch==='[') bracketDepth++;
    else if(ch===']'){ bracketDepth--; if(bracketDepth===0 && braceDepth===0){i++;break;} }
    else if(ch==='{') braceDepth++;
    else if(ch==='}') braceDepth--;
  }
  return src.slice(bi, i);
}

// 提取 CHARS
let CHARS, SYNERGIES, ENEMIES;
try {
  const charsStr = extractArray(script,'CHARS');
  CHARS = eval(charsStr);
  console.log(`✅ CHARS: ${CHARS.length} 条`);
} catch(e){ console.error('❌ CHARS 解析失败:',e.message); CHARS=[]; }

// 提取 SYNERGIES（有多种变量名）
try {
  let synStr = extractArray(script,'SYNERGIES') || extractArray(script,'SYN_DEF');
  if(synStr){
    // 移除函数调用等 runtime 依赖
    SYNERGIES = eval(synStr.replace(/fx:\{[^}]*\}/g, 'fx:{}'));
    console.log(`✅ SYNERGIES: ${SYNERGIES.length} 条`);
  } else {
    // 从 script 里找羁绊配置
    const synMatch = script.match(/(?:const|let|var)\s+(?:SYNERGIES|SYN_DEF)\s*=\s*(\[[\s\S]*?\n\s*\];)/);
    SYNERGIES = synMatch ? eval(synMatch[1]) : [];
    console.log(`✅ SYNERGIES: ${SYNERGIES.length} 条`);
  }
} catch(e){ console.warn('⚠️  SYNERGIES 解析警告:',e.message.slice(0,80)); SYNERGIES=[]; }

// 提取 ENEMIES（直接 eval，无需替换 skill 字段）
try {
  const eStr = extractArray(script,'ENEMIES');
  if(!eStr) throw new Error('未找到 ENEMIES 变量');
  ENEMIES = eval(eStr);
  console.log(`✅ ENEMIES: ${ENEMIES.length} 条`);
} catch(e){ console.warn('⚠️  ENEMIES 解析警告:',e.message.slice(0,80)); ENEMIES=[]; }

// 提取 TALI（符咒）
let TALI;
try {
  const tStr = extractArray(script,'TALI');
  if(!tStr) throw new Error('未找到 TALI 变量');
  TALI = eval(tStr);
  console.log(`✅ TALI: ${TALI.length} 条`);
} catch(e){ console.warn('⚠️  TALI 解析警告:',e.message.slice(0,80)); TALI=[]; }

// 提取 EQUIP_DATA（装备，对象结构）
let EQUIP_DATA, EQUIP_SETS;
try {
  // EQUIP_DATA 是对象 {}，用专门函数提取
  function extractObject(src, varName) {
    const start = src.indexOf(`const ${varName}`);
    if(start===-1) return null;
    let bi = src.indexOf('{', start);
    if(bi===-1) return null;
    let braceDepth=0;
    let inStr=false, strChar='', escape=false;
    let i=bi;
    for(;i<src.length;i++){
      const ch=src[i];
      if(escape){ escape=false; continue; }
      if(ch==='\\'){ escape=true; continue; }
      if(inStr){ if(ch===strChar) inStr=false; continue; }
      if(ch==='"'||ch==="'"||ch==='`'){ inStr=true; strChar=ch; continue; }
      if(ch==='{') braceDepth++;
      else if(ch==='}'){ braceDepth--; if(braceDepth===0){i++;break;} }
    }
    return src.slice(bi, i);
  }
  const edStr = extractObject(script,'EQUIP_DATA');
  if(!edStr) throw new Error('未找到 EQUIP_DATA 变量');
  EQUIP_DATA = eval('('+edStr+')');
  const edCount = Object.keys(EQUIP_DATA).length;
  console.log(`✅ EQUIP_DATA: ${edCount} 件装备`);
} catch(e){ console.warn('⚠️  EQUIP_DATA 解析警告:',e.message.slice(0,80)); EQUIP_DATA={}; }

try {
  function extractObject(src, varName) {
    const start = src.indexOf(`const ${varName}`);
    if(start===-1) return null;
    let bi = src.indexOf('{', start);
    if(bi===-1) return null;
    let braceDepth=0;
    let inStr=false, strChar='', escape=false;
    let i=bi;
    for(;i<src.length;i++){
      const ch=src[i];
      if(escape){ escape=false; continue; }
      if(ch==='\\'){ escape=true; continue; }
      if(inStr){ if(ch===strChar) inStr=false; continue; }
      if(ch==='"'||ch==="'"||ch==='`'){ inStr=true; strChar=ch; continue; }
      if(ch==='{') braceDepth++;
      else if(ch==='}'){ braceDepth--; if(braceDepth===0){i++;break;} }
    }
    return src.slice(bi, i);
  }
  const esStr = extractObject(script,'EQUIP_SETS');
  if(!esStr) throw new Error('未找到 EQUIP_SETS 变量');
  EQUIP_SETS = eval('('+esStr+')');
  const esCount = Object.keys(EQUIP_SETS).length;
  console.log(`✅ EQUIP_SETS: ${esCount} 个套装`);
} catch(e){ console.warn('⚠️  EQUIP_SETS 解析警告:',e.message.slice(0,80)); EQUIP_SETS={}; }

// 手动补充 rarity（复制游戏里的 auto-assign 逻辑）
const RARITY_SEQ=['n','n','n','r','r','r','sr','sr','sr','ssr','ssr','ssr'];
const groups={};
for(const c of CHARS){
  const m=c.id.match(/^c(\d+?)0+(\d)$/);
  if(!m) continue;
  const gid=m[1];
  if(!groups[gid]) groups[gid]=[];
  groups[gid].push(c);
}
for(const arr of Object.values(groups)){
  arr.sort((a,b)=>a.id.localeCompare(b.id));
  arr.forEach((c,i)=>{ if(!c.rarity) c.rarity=RARITY_SEQ[i]||'n'; });
}

const RARITY_LABEL = {n:'普通(N)',r:'稀有(R)',sr:'史诗(SR)',ssr:'传说(SSR)'};
const RARITY_COLOR = {n:'FFB2BEC3',r:'FF74B9FF',sr:'FFC084FC',ssr:'FF7FE7FF'};

// ── 3. 构建 Excel ─────────────────────────────────────────
const wb = new ExcelJS.Workbook();
wb.creator = 'GameDataExport';
wb.created  = new Date();

// 通用表头样式
function headerStyle(color='FF2C3E50'){
  return {
    font:{bold:true, color:{argb:'FFFFFFFF'}, size:11},
    fill:{type:'pattern', pattern:'solid', fgColor:{argb:color}},
    alignment:{vertical:'middle', horizontal:'center', wrapText:true},
    border:{bottom:{style:'thin',color:{argb:'FF95A5A6'}}}
  };
}
function cellStyle(argb){
  return {
    fill:{type:'pattern',pattern:'solid',fgColor:{argb:argb||'FFFFFFFF'}},
    alignment:{vertical:'middle', wrapText:true},
    border:{bottom:{style:'thin',color:{argb:'FFE0E0E0'}}}
  };
}

// ════════════════════════════════════════════════════════════
// Sheet 1：角色配置表
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('角色配置表', {
    views:[{state:'frozen',ySplit:1}],
    properties:{defaultRowHeight:20}
  });

  ws.columns = [
    {key:'id',      header:'角色ID',     width:12},
    {key:'rarity',  header:'品质',       width:10},
    {key:'name',    header:'名称',       width:14},
    {key:'emoji',   header:'图标',       width:8},
    {key:'syns',    header:'羁绊系列',   width:20},
    {key:'dmg',     header:'基础攻击',   width:10},
    {key:'range',   header:'射程(px)',   width:10},
    {key:'rate',    header:'攻速(次/s)', width:11},
    {key:'desc',    header:'角色描述',   width:16},
    {key:'skillName',  header:'技能名称', width:16},
    {key:'skillIcon',  header:'技能图标', width:10},
    {key:'skillType',  header:'技能类型', width:10},
    {key:'skillDesc',  header:'技能描述', width:45},
    {key:'color',   header:'颜色',       width:10},
  ];

  // 表头样式
  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF1A252F'); });
  ws.getRow(1).height=28;

  // 填充数据
  for(const c of CHARS){
    const row = ws.addRow({
      id:       c.id,
      rarity:   RARITY_LABEL[c.rarity]||c.rarity,
      name:     c.name,
      emoji:    c.emoji,
      syns:     (c.syns||[]).join(' + '),
      dmg:      c.dmg,
      range:    c.range,
      rate:     c.rate,
      desc:     c.desc,
      skillName: c.skill?.name||'',
      skillIcon: c.skill?.icon||'',
      skillType: c.skill?.type||'',
      skillDesc: c.skill?.desc||'',
      color:    c.color,
    });
    // 按品质染色
    const bg = RARITY_COLOR[c.rarity]||'FFFFFFFF';
    const fgMap={n:'FF636E72',r:'FF0984E3',sr:'FF6C3483',ssr:'FF0C5460'};
    row.getCell('rarity').style={
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:bg}},
      font:{bold:true,color:{argb:fgMap[c.rarity]||'FF000000'}},
      alignment:{horizontal:'center',vertical:'middle'}
    };
    row.getCell('skillType').style={
      ...cellStyle(),
      font:{color:{argb: c.skill?.type==='主动'?'FFE74C3C':'FF27AE60'}, bold:true},
      alignment:{horizontal:'center',vertical:'middle'}
    };
  }

  // 隔行浅色底纹
  ws.eachRow((row,ri)=>{
    if(ri===1) return;
    row.height=18;
    row.eachCell({includeEmpty:true}, cell=>{
      if(!cell.style?.fill?.fgColor?.argb){
        cell.style={...cell.style,
          fill:{type:'pattern',pattern:'solid',fgColor:{argb: ri%2===0?'FFF8F9FA':'FFFFFFFF'}},
          alignment:{vertical:'middle', wrapText:true}
        };
      }
    });
  });

  // 自动筛选
  ws.autoFilter={from:'A1',to:'N1'};
  console.log(`📊 Sheet1 角色配置表: ${CHARS.length} 行`);
}

// ════════════════════════════════════════════════════════════
// Sheet 2：羁绊/装备配置表
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('羁绊装备配置表', {
    views:[{state:'frozen',ySplit:1}],
    properties:{defaultRowHeight:20}
  });

  ws.columns = [
    {key:'id',      header:'羁绊ID',     width:14},
    {key:'name',    header:'羁绊名称',   width:16},
    {key:'emoji',   header:'图标',       width:8},
    {key:'category',header:'分类',       width:12},
    {key:'chars',   header:'包含角色ID', width:55},
    {key:'need',    header:'件套数',     width:8},
    {key:'desc',    header:'套装效果描述', width:55},
    {key:'fx',      header:'实际属性加成(JSON)', width:30},
  ];

  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF1A3A4A'); });
  ws.getRow(1).height=28;

  const SYN_COLOR={'攻击系':'FFFFF3CD','防御系':'FFD1ECF1','辅助系':'FFD4EDDA','混合系':'FFF8D7DA'};

  if(SYNERGIES.length>0){
    for(const syn of SYNERGIES){
      const charList=(syn.chars||[]).join(', ');
      if(syn.tiers && syn.tiers.length>0){
        syn.tiers.forEach((tier,ti)=>{
          const row=ws.addRow({
            id:      ti===0?syn.id:'',
            name:    ti===0?syn.name:'',
            emoji:   ti===0?(syn.emoji||''):'',
            category:ti===0?(syn.category||''):'',
            chars:   ti===0?charList:'',
            need:    tier.need,
            desc:    tier.desc,
            fx:      JSON.stringify(tier.fx||{}),
          });
          const bg=SYN_COLOR[syn.category]||'FFFFFFFF';
          if(ti===0){
            row.getCell('name').style={
              fill:{type:'pattern',pattern:'solid',fgColor:{argb:bg}},
              font:{bold:true}, alignment:{vertical:'middle'}
            };
          }
          row.getCell('need').style={
            fill:{type:'pattern',pattern:'solid',
              fgColor:{argb: tier.need===9?'FFFFD700':tier.need===6?'FFC084FC':'FFB2BEC3'}},
            font:{bold:true}, alignment:{horizontal:'center',vertical:'middle'}
          };
          row.height=20;
        });
      } else {
        ws.addRow({id:syn.id,name:syn.name,emoji:syn.emoji||'',category:syn.category||'',
          chars:charList,need:'',desc:'（无tier数据）',fx:''});
      }
    }
  } else {
    // 如果 SYNERGIES 提取失败，输出提示行
    ws.addRow({id:'⚠️',name:'羁绊数据提取失败',desc:'请检查源码中 SYNERGIES 或 SYN_DEF 变量名'});
  }

  ws.autoFilter={from:'A1',to:'H1'};
  console.log(`📊 Sheet2 羁绊装备配置表: ${SYNERGIES.length} 个羁绊`);
}

// ════════════════════════════════════════════════════════════
// Sheet 3：怪物配置表
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('怪物配置表', {
    views:[{state:'frozen',ySplit:1}],
    properties:{defaultRowHeight:20}
  });

  ws.columns = [
    {key:'id',        header:'怪物ID',     width:16},
    {key:'grade',     header:'品质',       width:10},
    {key:'name',      header:'名称',       width:14},
    {key:'ico',       header:'图标',       width:8},
    {key:'hp',        header:'生命值',     width:10},
    {key:'speed',     header:'移速',       width:8},
    {key:'reward',    header:'金币奖励',   width:10},
    {key:'expReward', header:'经验奖励',   width:10},
    {key:'boss',      header:'是否BOSS',   width:10},
    {key:'skillId',   header:'技能ID',     width:14},
    {key:'skillDesc', header:'技能描述',   width:50},
    {key:'tip',       header:'特别说明',   width:40},
  ];

  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF2D1B2E'); });
  ws.getRow(1).height=28;

  const GRADE_BG={normal:'FFF0F0F0',elite:'FFCFE2FF',epic:'FFDDD6FE',boss:'FFFFF3CD'};
  const GRADE_LABEL={normal:'普通',elite:'精英',epic:'史诗',boss:'BOSS'};

  for(const e of ENEMIES){
    const row=ws.addRow({
      id:       e.id,
      grade:    GRADE_LABEL[e.grade]||e.grade,
      name:     e.name,
      ico:      e.ico,
      hp:       e.hp,
      speed:    e.speed,
      reward:   e.reward,
      expReward:e.expReward,
      boss:     e.boss?'✅ BOSS':'',
      skillId:  e.skill?.id||'无',
      skillDesc:e.skill?.desc||'无技能',
      tip:      e.tip||'',
    });
    const bg=GRADE_BG[e.grade]||'FFFFFFFF';
    row.getCell('grade').style={
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:bg}},
      font:{bold:true,color:{argb: e.grade==='boss'?'FFC0392B':e.grade==='epic'?'FF6C3483':'FF2C3E50'}},
      alignment:{horizontal:'center',vertical:'middle'}
    };
    if(e.boss){
      row.getCell('boss').style={
        font:{bold:true,color:{argb:'FFC0392B'}},
        alignment:{horizontal:'center',vertical:'middle'}
      };
    }
    row.height=20;
  }

  ws.autoFilter={from:'A1',to:'L1'};
  console.log(`📊 Sheet3 怪物配置表: ${ENEMIES.length} 行`);
}

// ════════════════════════════════════════════════════════════
// Sheet 4：技能系统速查表（按技能系汇总所有角色）
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('技能系速查表', {
    views:[{state:'frozen',ySplit:1}],
  });

  ws.columns = [
    {key:'syn',      header:'技能系',     width:14},
    {key:'rarity',   header:'品质',       width:10},
    {key:'name',     header:'角色名',     width:14},
    {key:'id',       header:'角色ID',     width:12},
    {key:'dmg',      header:'攻击',       width:8},
    {key:'range',    header:'射程',       width:8},
    {key:'rate',     header:'攻速',       width:8},
    {key:'skillType',header:'技能类型',   width:10},
    {key:'skillName',header:'技能名',     width:16},
    {key:'skillDesc',header:'技能描述',   width:50},
  ];

  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF0B3D0B'); });
  ws.getRow(1).height=28;

  // 按主技能系排序
  const SYN_ORDER=['swift','cannon','crit','element','shadow','ranger',
                   'warrior','dragon','undead','arcane','mech','holy','tank','nature','shield'];
  const SYN_LABEL={
    swift:'疾风剑豪',cannon:'重炮火力',crit:'暴击猎手',element:'元素使者',
    shadow:'暗影刺客',ranger:'游侠射手',warrior:'战士先锋',dragon:'龙族血脉',
    undead:'亡灵天灾',arcane:'奥术法师',mech:'机械工匠',holy:'圣光守护',
    tank:'钢铁壁垒',nature:'自然之佑',shield:'魔法护盾'
  };
  const SYN_COLORS={
    swift:'FFEFF9FF',cannon:'FFFFF0EB',crit:'FFFFF9EC',element:'FFFDF5E6',
    shadow:'FFF5F0FF',ranger:'FFECFDF5',warrior:'FFFFF0F0',dragon:'FFFEF5E7',
    undead:'FFF8F0FE',arcane:'FFF0F0FF',mech:'FFF5F5F5',holy:'FFFFF9E6',
    tank:'FFF0F0F0',nature:'FFF0FFF0',shield:'FFF0F8FF'
  };

  const rarityOrder={n:0,r:1,sr:2,ssr:3};
  let lastSyn='';

  for(const syn of SYN_ORDER){
    const members=CHARS
      .filter(c=>(c.syns||[]).includes(syn))
      .sort((a,b)=>(rarityOrder[a.rarity]||0)-(rarityOrder[b.rarity]||0));

    for(const c of members){
      const isFirst = lastSyn!==syn;
      lastSyn=syn;
      const row=ws.addRow({
        syn:      isFirst?`${SYN_LABEL[syn]||syn}(${syn})`:'',
        rarity:   RARITY_LABEL[c.rarity]||c.rarity,
        name:     c.name,
        id:       c.id,
        dmg:      c.dmg,
        range:    c.range,
        rate:     c.rate,
        skillType:c.skill?.type||'',
        skillName:c.skill?.name||'',
        skillDesc:c.skill?.desc||'',
      });
      const bg=SYN_COLORS[syn]||'FFFFFFFF';
      row.getCell('syn').style={
        fill:{type:'pattern',pattern:'solid',fgColor:{argb:bg}},
        font:{bold:isFirst,size:isFirst?11:10},
        alignment:{vertical:'middle'}
      };
      row.getCell('rarity').style={
        fill:{type:'pattern',pattern:'solid',fgColor:{argb:RARITY_COLOR[c.rarity]||'FFFFFFFF'}},
        font:{bold:true,size:10}, alignment:{horizontal:'center',vertical:'middle'}
      };
      row.getCell('skillType').style={
        font:{color:{argb: c.skill?.type==='主动'?'FFE74C3C':'FF27AE60'}, bold:true},
        alignment:{horizontal:'center',vertical:'middle'}
      };
      row.height=18;
    }
    // 分组间距
    if(members.length>0) ws.addRow({}).height=6;
  }

  ws.autoFilter={from:'A1',to:'J1'};
  console.log(`📊 Sheet4 技能系速查表: ${SYN_ORDER.length} 个技能系`);
}

// ════════════════════════════════════════════════════════════
// Sheet 5：符咒配置表（TALI）
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('符咒配置表', {
    views:[{state:'frozen',ySplit:1}],
    properties:{defaultRowHeight:22}
  });

  ws.columns = [
    {key:'id',       header:'符咒ID',     width:18},
    {key:'rarity',   header:'品质',       width:12},
    {key:'name',     header:'名称',       width:18},
    {key:'type',     header:'类型',       width:12},
    {key:'synTarget',header:'专属羁绊系', width:14},
    {key:'desc',     header:'效果描述',   width:50},
    {key:'fx',       header:'主效果Key',  width:12},
    {key:'v',        header:'主效果值',   width:12},
    {key:'bonuses',  header:'额外加成(JSON)', width:55},
  ];

  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF4A1A6E'); });
  ws.getRow(1).height=28;

  // 品质颜色映射
  const TALI_RARITY_COLOR={
    common:   {bg:'FFE8F5E9', fg:'FF2E7D32', label:'普通'},
    rare:     {bg:'FFE3F2FD', fg:'FF1565C0', label:'稀有'},
    epic:     {bg:'FFF3E5F5', fg:'FF6A1B9A', label:'史诗'},
    legendary:{bg:'FFFFF8E1', fg:'FFE65100', label:'传说'},
  };

  // 类型分组标色
  const TYPE_COLORS={
    base:   {bg:'FFECFDF5', label:'基础'},
    syn:    {bg:'FFFFF0F4', label:'羁绊专属'},
    multi:  {bg:'FFFEF9EC', label:'觉醒多重'},
  };

  const SYN_LABEL_MAP={
    swift:'疾风剑豪',cannon:'重炮火力',crit:'暴击猎手',element:'元素使者',
    shadow:'暗影刺客',ranger:'游侠射手',warrior:'战士先锋',dragon:'龙族血脉',
    undead:'亡灵天灾',arcane:'奥术法师',mech:'机械工匠',holy:'圣光守护',
    tank:'钢铁壁垒',nature:'自然之佑',shield:'魔法护盾'
  };

  // 推断符咒类型
  function getTaliType(t){
    if(t.fx==='syn') return 'syn';
    if(t.fx==='multi') return 'multi';
    return 'base';
  }

  let rowIdx=1;
  for(const t of TALI){
    const type = getTaliType(t);
    const rCfg = TALI_RARITY_COLOR[t.rarity] || {bg:'FFFFFFFF', fg:'FF000000', label:t.rarity||''};
    const typeCfg = TYPE_COLORS[type] || {bg:'FFFFFFFF', label:type};
    const synName = t.synTarget ? (SYN_LABEL_MAP[t.synTarget]||t.synTarget) : '';

    const row = ws.addRow({
      id:        t.id,
      rarity:    rCfg.label,
      name:      t.name,
      type:      typeCfg.label,
      synTarget: synName,
      desc:      t.desc,
      fx:        t.fx && t.fx!=='syn' && t.fx!=='multi' ? t.fx : '',
      v:         t.v != null ? t.v : '',
      bonuses:   t.bonuses ? JSON.stringify(t.bonuses) : '',
    });
    rowIdx++;

    // 品质列染色
    row.getCell('rarity').style={
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:rCfg.bg}},
      font:{bold:true, color:{argb:rCfg.fg}},
      alignment:{horizontal:'center',vertical:'middle'}
    };
    // 类型列染色
    row.getCell('type').style={
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:typeCfg.bg}},
      font:{bold:true, color:{argb: type==='syn'?'FFC0392B': type==='multi'?'FF8E44AD':'FF27AE60'}},
      alignment:{horizontal:'center',vertical:'middle'}
    };
    // 专属羁绊系高亮
    if(synName){
      row.getCell('synTarget').style={
        fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF0E6'}},
        font:{color:{argb:'FFD35400'}, bold:true},
        alignment:{horizontal:'center',vertical:'middle'}
      };
    }
    // 数值列右对齐
    if(t.v != null){
      row.getCell('v').style={
        alignment:{horizontal:'right',vertical:'middle'},
        font:{bold:true, color:{argb: t.v>0 ? 'FF27AE60':'FF000000'}}
      };
    }
    row.height=20;
  }

  // 隔行底纹
  ws.eachRow((row,ri)=>{
    if(ri===1) return;
    row.eachCell({includeEmpty:true}, cell=>{
      if(!cell.style?.fill?.fgColor?.argb){
        cell.style={...cell.style,
          fill:{type:'pattern',pattern:'solid',fgColor:{argb: ri%2===0?'FFF8F9FA':'FFFFFFFF'}},
          alignment:{vertical:'middle', wrapText:true}
        };
      }
    });
  });

  ws.autoFilter={from:'A1',to:'I1'};
  console.log(`📊 Sheet5 符咒配置表: ${TALI.length} 条符咒`);
}

// ════════════════════════════════════════════════════════════
// Sheet 6：装备配置表（EQUIP_DATA + EQUIP_SETS）
// ════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('装备配置表', {
    views:[{state:'frozen',ySplit:1}],
    properties:{defaultRowHeight:20}
  });

  ws.columns = [
    {key:'id',        header:'装备ID',       width:18},
    {key:'name',      header:'名称',         width:16},
    {key:'icon',      header:'图标',         width:6},
    {key:'quality',   header:'品质',         width:10},
    {key:'set',       header:'所属套装',     width:14},
    {key:'setName',   header:'套装名称',     width:12},
    {key:'exclusive', header:'专属角色',     width:14},
    {key:'price',     header:'价格',         width:8},
    {key:'stat',      header:'属性加成(JSON)', width:40},
    {key:'desc',      header:'效果描述',     width:40},
    {key:'setBonuses',header:'套装效果',     width:55},
  ];

  ws.getRow(1).eachCell(cell=>{ cell.style=headerStyle('FF1A3A1A'); });
  ws.getRow(1).height=28;

  const QUALITY_CFG={
    common:    {bg:'FFF5F5F5', fg:'FF616161', label:'普通'},
    rare:      {bg:'FFE3F2FD', fg:'FF1565C0', label:'精英'},
    epic:      {bg:'FFF3E5F5', fg:'FF6A1B9A', label:'史诗'},
    legendary: {bg:'FFFFF8E1', fg:'FFE65100', label:'传说'},
  };

  // 按品质排序：common < rare < epic < legendary
  const qualityOrder={common:0,rare:1,epic:2,legendary:3};
  const equipList = Object.entries(EQUIP_DATA)
    .sort((a,b)=>{
      const qa=qualityOrder[a[1].quality]??0, qb=qualityOrder[b[1].quality]??0;
      if(qa!==qb) return qa-qb;
      // 同品质按套装分组
      const sa=a[1].set||'zzz', sb=b[1].set||'zzz';
      return sa.localeCompare(sb);
    });

  let lastSet='';
  for(const [eid, eq] of equipList){
    const qCfg = QUALITY_CFG[eq.quality] || {bg:'FFFFFFFF', fg:'FF000000', label:eq.quality||''};
    const setDef = eq.set && EQUIP_SETS ? EQUIP_SETS[eq.set] : null;
    const setName = setDef ? (setDef.name||eq.set) : (eq.set||'—');
    // 套装效果描述（拼接各件套效果）
    const setBonusStr = setDef && setDef.bonuses
      ? setDef.bonuses.map(b=>`${b.desc}`).join(' / ')
      : '';

    const row = ws.addRow({
      id:         eid,
      name:       eq.name,
      icon:       eq.icon||'',
      quality:    qCfg.label,
      set:        eq.set||'—',
      setName:    setName,
      exclusive:  eq.exclusive||'',
      price:      eq.price,
      stat:       JSON.stringify(eq.stat||{}),
      desc:       eq.desc||'',
      setBonuses: setBonusStr,
    });

    // 品质染色
    row.getCell('quality').style={
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:qCfg.bg}},
      font:{bold:true, color:{argb:qCfg.fg}},
      alignment:{horizontal:'center',vertical:'middle'}
    };
    // 套装高亮（同套装第一行加粗）
    if(eq.set && eq.set!==lastSet){
      row.getCell('setName').style={
        fill:{type:'pattern',pattern:'solid',fgColor:{argb: setDef?.color ? 'FFFFF0E6':'FFECFDF5'}},
        font:{bold:true, color:{argb:'FF2C3E50'}},
        alignment:{vertical:'middle'}
      };
    }
    // 专属角色高亮
    if(eq.exclusive){
      row.getCell('exclusive').style={
        fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF3CD'}},
        font:{bold:true, color:{argb:'FFD35400'}},
        alignment:{horizontal:'center',vertical:'middle'}
      };
    }
    // 价格右对齐金色
    row.getCell('price').style={
      font:{bold:true, color:{argb:'FF8B6914'}},
      alignment:{horizontal:'right',vertical:'middle'}
    };
    if(eq.set) lastSet=eq.set;
    row.height=20;
  }

  // 隔行底纹
  ws.eachRow((row,ri)=>{
    if(ri===1) return;
    row.eachCell({includeEmpty:true}, cell=>{
      if(!cell.style?.fill?.fgColor?.argb){
        cell.style={...cell.style,
          fill:{type:'pattern',pattern:'solid',fgColor:{argb: ri%2===0?'FFF8F9FA':'FFFFFFFF'}},
          alignment:{vertical:'middle', wrapText:true}
        };
      }
    });
  });

  ws.autoFilter={from:'A1',to:'K1'};
  const eqCount = Object.keys(EQUIP_DATA).length;
  const esCount = Object.keys(EQUIP_SETS||{}).length;
  console.log(`📊 Sheet6 装备配置表: ${eqCount} 件装备，${esCount} 个套装`);
}

// ── 4. 输出文件 ────────────────────────────────────────────
const outPath = path.join(__dirname, 'game_data_backup.xlsx');
wb.xlsx.writeFile(outPath).then(()=>{
  const size=(fs.statSync(outPath).size/1024).toFixed(1);
  const eqCount = Object.keys(EQUIP_DATA||{}).length;
  const esCount = Object.keys(EQUIP_SETS||{}).length;
  console.log(`\n✅ 导出完成！`);
  console.log(`📁 文件: ${outPath}`);
  console.log(`📦 大小: ${size} KB`);
  console.log(`📋 包含 6 张 Sheet：`);
  console.log(`   Sheet1 角色配置表   —— ${CHARS.length} 个角色`);
  console.log(`   Sheet2 羁绊装备配置 —— ${SYNERGIES.length} 个羁绊`);
  console.log(`   Sheet3 怪物配置表   —— ${ENEMIES.length} 种怪物`);
  console.log(`   Sheet4 技能系速查表 —— 15 个技能系`);
  console.log(`   Sheet5 符咒配置表   —— ${TALI.length} 条符咒`);
  console.log(`   Sheet6 装备配置表   —— ${eqCount} 件装备 / ${esCount} 套装`);
}).catch(e=>{ console.error('❌ 写入失败:',e.message); });
