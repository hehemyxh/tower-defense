/**
 * skill_test.js — 自动化技能行为测试
 * 模拟 Worker 环境，逐一测试每个角色技能系
 * 运行: node skill_test.js
 */

// ── 模拟 Worker 环境 ──────────────────────────────────
const messages = [];
const self = {
  postMessage: (msg) => messages.push(msg)
};

// ── 基础工具函数（与 Worker 一致）──────────────────────
function dist(ax,ay,bx,by){ return Math.sqrt((ax-bx)**2+(ay-by)**2); }

function enemiesInRange(enemies, cx, cy, r){
  return enemies.filter(e => !e.dead && dist(cx,cy,e.x,e.y) <= r);
}

// ── dealDmg 简化版 ──────────────────────────────────
function dealDmg(e, rawDmg, owner, tower){
  if(e.dead) return;
  let dmg = rawDmg;
  if((e.shield||0) > 0){
    const abs = Math.min(e.shield, dmg);
    e.shield -= abs; dmg -= abs;
  }
  e.hp = Math.max(0, e.hp - dmg);
  if(e.hp <= 0){ e.dead = true; if(owner) owner.score = (owner.score||0)+1; }
  e._dmgReceived = (e._dmgReceived||0) + rawDmg;
}

// ── 测试工厂 ──────────────────────────────────────────
function makeEnemy(id, hp, x, y, opts={}){
  return { uid:id, eid:'test', name:'测试怪'+id, x, y,
    hp, maxHp:hp, dead:false, r:16, boss:opts.boss||false,
    slow:1, slowTick:0, dot:null, shield:0,
    _armorShred:0, _armorShredTick:0,
    _marked:0, _magicMark:0, skillDef:null, skillState:null,
    _dmgReceived:0
  };
}

function makeTower(syn, opts={}){
  return {
    uid: 'tower_'+syn, id: syn+'_char', name: syn+'角色',
    x: 200, y: 200, color: '#aaa',
    dmg: 100, range: 150, rate: 1000,
    syns: [syn], rarity: opts.rarity||'sr',
    stars: opts.stars||3,
    mana: opts.skillReady ? 80 : 0,
    maxMana: 80, hitCount: opts.hitCount||0,
    owner: 'p1', _mechTurrets: []
  };
}

function makeOwner(){
  return { id:'p1', hp:20, maxHp:20, score:0,
    gold:100, towers:[], taliDmg:0, taliSpd:0, taliRng:0,
    synergyBufs:{}, synTali:{}, _shieldUltActive:0 };
}

// ── 结果收集 ──────────────────────────────────────────
const results = [];
function assert(label, cond, detail=''){
  const status = cond ? '✅ PASS' : '❌ FAIL';
  results.push({ status, label, detail });
  console.log(`${status} | ${label}${detail?' | '+detail:''}`);
}

// ── 测试执行器 ──────────────────────────────────────────
function runSkillTest(syn, setupFn){
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`🧪 测试: ${syn.toUpperCase()}`);
  console.log('─'.repeat(55));
  messages.length = 0;
  setupFn();
}

// ─────────────────────────────────────────────────────
// 以下为从 index.html Worker 中提取的技能执行函数
// 每个 runSkillOnce(tower, enemies, owner, skillReady) 返回执行后状态
// ─────────────────────────────────────────────────────
function runSkillOnce(t, enemies, owner, skillReady){
  messages.length = 0;
  const baseDmgMult = 1.0;
  const sBonus = {};
  const syns = t.syns || [];
  const best = enemies[0];
  if(!best || best.dead) return;

  function pushFx(type, x, y, opts){}
  function pushSkillUlt(tower, label, tx, ty, extra){
    messages.push({type:'skillUlt', label, tower: tower.id});
  }
  function applyTowerBuff(pid, buffKey, value, duration){
    const p = owner;
    for(const tt of p.towers){
      tt[buffKey] = (tt[buffKey]||0) + value;
      tt[buffKey+'_tick'] = Math.max(tt[buffKey+'_tick']||0, duration);
    }
  }

  // ── SWIFT ──────────────────────────────────────────
  if(syns.includes('swift')){
    best.slow = Math.min(0.45,(best.slow||1)*0.80);
    best.slowTick = Math.max(best.slowTick||0, 20);
    dealDmg(best, t.dmg*baseDmgMult, owner, t);
    if(skillReady){
      const nearby = enemiesInRange(enemies, best.x, best.y, 65)
        .filter(e=>e.uid!==best.uid).slice(0,3);
      for(const ne of nearby){ dealDmg(ne, t.dmg*baseDmgMult*1.2, owner, t); }
      pushSkillUlt(t,'连斩');
    }
  }
  // ── CANNON ─────────────────────────────────────────
  else if(syns.includes('cannon')){
    const boomR = skillReady ? 120 : 65;
    const boomMult = skillReady ? 3.5 : 0.5;
    for(const e of enemiesInRange(enemies, best.x, best.y, boomR)){
      dealDmg(e, e.uid===best.uid ? t.dmg*baseDmgMult : t.dmg*baseDmgMult*boomMult, owner, t);
    }
    if(skillReady) pushSkillUlt(t,'超级爆炸');
  }
  // ── CRIT ───────────────────────────────────────────
  else if(syns.includes('crit')){
    if(skillReady){
      dealDmg(best, t.dmg*baseDmgMult*5.0, owner, t);
      pushSkillUlt(t,'致命一击');
    } else {
      const isCrit = Math.random() < 0.35;
      dealDmg(best, t.dmg*baseDmgMult*(isCrit?2.0:1.0), owner, t);
    }
  }
  // ── ELEMENT ────────────────────────────────────────
  else if(syns.includes('element')){
    const elem = (t.hitCount||0) % 3;
    dealDmg(best, t.dmg*baseDmgMult*1.1, owner, t);
    if(elem===0){ if(!best.dot) best.dot={dmg:0,tick:0}; best.dot.dmg=Math.floor(t.dmg*0.12); best.dot.tick=50; }
    else if(elem===1){ best.slow=Math.min(0.35,(best.slow||1)*0.60); best.slowTick=35; }
    else {
      for(const ce of enemiesInRange(enemies,best.x,best.y,90).filter(e=>e.uid!==best.uid).slice(0,3)){
        dealDmg(ce, t.dmg*baseDmgMult*0.55, owner, t);
      }
    }
    if(skillReady){
      for(const e of enemiesInRange(enemies,t.x,t.y,110)){
        if(!e.dead){ dealDmg(e, t.dmg*baseDmgMult*0.8, owner, t); }
      }
      pushSkillUlt(t,'全元素风暴');
    }
  }
  // ── SHADOW ─────────────────────────────────────────
  else if(syns.includes('shadow')){
    if(!best.dot) best.dot={dmg:0,tick:0,owner:'p1'};
    best.dot.dmg = Math.max(best.dot.dmg||0, Math.floor(t.dmg*0.14));
    best.dot.tick = Math.max(best.dot.tick||0, 60);
    dealDmg(best, t.dmg*baseDmgMult*0.9, owner, t);
    if(skillReady){
      const assassinMult = {n:2.5,r:3.0,sr:4.0,ssr:5.0}[t.rarity||'n'];
      const targets = enemiesInRange(enemies, t.x, t.y, t.range)
        .filter(e=>!e.dead&&!e.boss)
        .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))
        .slice(0,3);
      for(const e of targets){
        const hasDot = (e.dot&&e.dot.tick>0) ? 1.3 : 1.0;
        dealDmg(e, t.dmg*baseDmgMult*assassinMult*hasDot, owner, t);
      }
      pushSkillUlt(t,'暗影突袭');
    }
  }
  // ── RANGER ─────────────────────────────────────────
  else if(syns.includes('ranger')){
    if(!best._marked) best._marked=0;
    best._marked = Math.min(3, best._marked+1);
    dealDmg(best, t.dmg*baseDmgMult*(1+best._marked*0.08), owner, t);
    if(skillReady){
      const dx=best.x-t.x, dy=best.y-t.y, len=Math.sqrt(dx*dx+dy*dy)||1;
      const nx=dx/len, ny=dy/len;
      const pierceRange = t.range+60;
      for(const e of enemiesInRange(enemies, t.x, t.y, pierceRange)){
        if(e.dead) continue;
        const px=e.x-t.x, py=e.y-t.y, proj=px*nx+py*ny;
        if(proj<0) continue;
        if(Math.abs(px*ny-py*nx)<=e.r+18){ dealDmg(e, t.dmg*baseDmgMult*1.5, owner, t); }
      }
      pushSkillUlt(t,'穿透箭');
    }
  }
  // ── WARRIOR ────────────────────────────────────────
  else if(syns.includes('warrior')){
    if(!best._armorShred) best._armorShred=0;
    best._armorShred = Math.min(4, best._armorShred+1);
    dealDmg(best, t.dmg*baseDmgMult*(1+best._armorShred*0.06), owner, t);
    if(skillReady){
      for(const ne of enemiesInRange(enemies, t.x, t.y, 80)){
        dealDmg(ne, t.dmg*baseDmgMult*1.8, owner, t);
      }
      pushSkillUlt(t,'战吼冲锋');
    } else {
      for(const ne of enemiesInRange(enemies,best.x,best.y,60).filter(e=>e.uid!==best.uid).slice(0,2)){
        dealDmg(ne, t.dmg*baseDmgMult*0.65, owner, t);
      }
    }
  }
  // ── DRAGON ─────────────────────────────────────────
  else if(syns.includes('dragon')){
    if(!best.dot) best.dot={dmg:0,tick:0,owner:'p1'};
    best.dot.dmg = Math.max(best.dot.dmg||0, Math.floor(t.dmg*0.1));
    best.dot.tick = Math.max(best.dot.tick||0, 40);
    dealDmg(best, t.dmg*baseDmgMult*1.1, owner, t);
    if(skillReady){
      for(const e of enemiesInRange(enemies, t.x, t.y, 130)){
        if(!e.dead){
          dealDmg(e, t.dmg*baseDmgMult*2.5, owner, t);
          if(!e.dot) e.dot={dmg:0,tick:0}; e.dot.dmg=Math.floor(t.dmg*0.18); e.dot.tick=80;
        }
      }
      pushSkillUlt(t,'超级龙息');
    }
  }
  // ── UNDEAD ─────────────────────────────────────────
  else if(syns.includes('undead')){
    if(!best.dot) best.dot={dmg:0,tick:0,owner:'p1'};
    best.dot.dmg = Math.max(best.dot.dmg||0, Math.floor(t.dmg*0.22));
    best.dot.tick = Math.max(best.dot.tick||0, 80);
    best.slow = Math.min(0.6,(best.slow||1)*0.92);
    dealDmg(best, t.dmg*baseDmgMult, owner, t);
    if(skillReady){
      const ultR = {n:70,r:85,sr:100,ssr:120}[t.rarity||'n'];
      const ultMult = {n:1.2,r:1.5,sr:1.8,ssr:2.2}[t.rarity||'n'];
      for(const e of enemiesInRange(enemies, t.x, t.y, ultR)){
        if(!e.dead){ dealDmg(e, t.dmg*baseDmgMult*ultMult, owner, t); }
      }
      pushSkillUlt(t,'死亡爆发');
    }
  }
  // ── ARCANE ─────────────────────────────────────────
  else if(syns.includes('arcane')){
    dealDmg(best, t.dmg*baseDmgMult*1.05, owner, t);
    if(Math.random() < 0.18){
      const bounce = enemiesInRange(enemies,best.x,best.y,80).find(e=>e.uid!==best.uid&&!e.dead);
      if(bounce) dealDmg(bounce, t.dmg*baseDmgMult*0.45, owner, t);
    }
    if(skillReady){
      for(const e of enemiesInRange(enemies, t.x, t.y, 110)){
        if(!e.dead){ dealDmg(e, t.dmg*baseDmgMult*1.2, owner, t); }
      }
      pushSkillUlt(t,'魔法风暴');
    }
  }
  // ── MECH ───────────────────────────────────────────
  else if(syns.includes('mech')){
    best.slow = Math.min(0.50,(best.slow||1)*0.80);
    dealDmg(best, t.dmg*baseDmgMult, owner, t);
    if(!t._mechTurrets) t._mechTurrets=[];
    if(skillReady){
      t._mechTurrets.push({ x:t.x, y:t.y, dmg:t.dmg*0.6, range:100, rate:1200, life:300, cd:0 });
      pushSkillUlt(t,'部署炮台');
    }
  }
  // ── HOLY ───────────────────────────────────────────
  else if(syns.includes('holy')){
    best.slow = Math.min(0.40,(best.slow||1)*0.62);
    dealDmg(best, t.dmg*baseDmgMult, owner, t);
    if(skillReady){
      const holyR = {n:60,r:80,sr:100,ssr:140}[t.rarity||'n'];
      const holyDur = {n:100,r:150,sr:200,ssr:300}[t.rarity||'n'];
      for(const e of enemiesInRange(enemies, t.x, t.y, holyR)){
        if(!e.dead){
          e.slow = Math.min(0.20,(e.slow||1)*0.35);
          e.slowTick = Math.max(e.slowTick||0, holyDur);
          if(!e.boss){ e._holySealed=true; e._holySealTick=holyDur; }
          dealDmg(e, t.dmg*baseDmgMult*0.3, owner, t);
        }
      }
      pushSkillUlt(t,'圣光封禁阵');
    }
  }
  // ── TANK ───────────────────────────────────────────
  else if(syns.includes('tank')){
    best.slow = Math.min(0.20,(best.slow||1)*0.65);
    dealDmg(best, t.dmg*baseDmgMult*1.3, owner, t);
    if(skillReady){
      const tankR = {n:80,r:100,sr:120,ssr:99999}[t.rarity||'n'];
      for(const e of enemiesInRange(enemies, t.x, t.y, tankR)){
        if(!e.dead){
          e.slow = Math.min(0.10,(e.slow||1)*0.30);
          e.slowTick = Math.max(e.slowTick||0, 60);
          dealDmg(e, t.dmg*baseDmgMult*0.5, owner, t);
        }
      }
      pushSkillUlt(t,'震地硬直');
    }
  }
  // ── NATURE ─────────────────────────────────────────
  else if(syns.includes('nature')){
    best.slow = Math.min(0.30,(best.slow||1)*0.82);
    if(!best.dot) best.dot={dmg:0,tick:0,owner:'p1'};
    best.dot.dmg = Math.max(best.dot.dmg||0, Math.floor(t.dmg*0.12));
    best.dot.tick = Math.max(best.dot.tick||0, 50);
    dealDmg(best, t.dmg*baseDmgMult*0.9, owner, t);
    if(skillReady){
      for(const e of enemiesInRange(enemies, t.x, t.y, 110)){
        if(!e.dead){
          e.slow = Math.min(0.20,(e.slow||1)*0.40);
          e.slowTick = Math.max(e.slowTick||0, 80);
          if(!e.dot) e.dot={dmg:0,tick:0};
          e.dot.dmg = Math.floor(t.dmg*0.20); e.dot.tick=100;
          dealDmg(e, t.dmg*baseDmgMult*0.5, owner, t);
        }
      }
      applyTowerBuff('p1','_natureBuff',0.25,200);
      pushSkillUlt(t,'回春之息');
    }
  }
  // ── SHIELD ─────────────────────────────────────────
  else if(syns.includes('shield')){
    best.slow = Math.min(0.50,(best.slow||1)*0.85);
    best._magicMark = (best._magicMark||0)+1;
    dealDmg(best, t.dmg*baseDmgMult*(1+(best._magicMark||0)*0.05), owner, t);
    if(skillReady){
      const shieldR = {n:70,r:90,sr:110,ssr:99999}[t.rarity||'n'];
      for(const e of enemiesInRange(enemies, t.x, t.y, shieldR)){
        if(!e.dead){
          e._magicMark = Math.max(e._magicMark||0,3);
          e.slow = Math.min(0.30,(e.slow||1)*0.55);
          dealDmg(e, t.dmg*baseDmgMult*0.7, owner, t);
        }
      }
      owner._shieldUltActive = 250;
      pushSkillUlt(t,'法术解除');
    }
  }
}

// ═══════════════════════════════════════════════════════
//  测试场景构建
// ═══════════════════════════════════════════════════════

// 场景1：5只怪站在塔周围（半径80以内）
function makeNearEnemies(n, hp=500){
  const es = [];
  for(let i=0;i<n;i++){
    const a = i * Math.PI*2/n;
    es.push(makeEnemy(i, hp, 200+Math.cos(a)*60, 200+Math.sin(a)*60));
  }
  return es;
}

// 场景2：敌人分布在不同距离（测试范围限制）
function makeSpreadEnemies(){
  return [
    makeEnemy(0, 500, 230, 200),  // 近（30px）
    makeEnemy(1, 500, 300, 200),  // 中（100px）
    makeEnemy(2, 500, 400, 200),  // 超出范围（200px）
    makeEnemy(3, 500, 500, 200),  // 超出范围（300px）
  ];
}

// ═══════════════════════════════════════════════════════
//  开始跑测试
// ═══════════════════════════════════════════════════════

const SYNS = ['swift','cannon','crit','element','shadow','ranger',
              'warrior','dragon','undead','arcane','mech','holy','tank','nature','shield'];

for(const syn of SYNS){
  runSkillTest(syn, ()=>{
    const tower = makeTower(syn, {rarity:'sr', stars:3});
    const owner = makeOwner();
    owner.towers = [tower];

    // —— 普攻测试 ——
    const enemies1 = makeNearEnemies(5, 500);
    const hpBefore = enemies1.map(e=>e.hp);
    runSkillOnce(tower, enemies1, owner, false);
    const hpAfter = enemies1.map(e=>e.hp);

    const mainTargetHit = hpAfter[0] < hpBefore[0];
    assert(`[${syn}] 普攻打到主目标`, mainTargetHit,
      `主目标HP: ${hpBefore[0]} → ${hpAfter[0]}`);

    // 检测：普攻不能打到range之外（场景2）
    const spread = makeSpreadEnemies();
    runSkillOnce(makeTower(syn), spread, owner, false);
    const outOfRange = spread[3]; // 300px外
    assert(`[${syn}] 普攻不打超出射程(300px)的敌人`,
      outOfRange._dmgReceived === 0 || syn==='cannon', // cannon有AOE可以例外
      `300px外怪受到伤害: ${outOfRange._dmgReceived}`);

    // —— 蓝满技能测试 ——
    const tower2 = makeTower(syn, {rarity:'sr', stars:3, skillReady:true});
    owner.towers = [tower2];
    const enemies2 = makeNearEnemies(5, 2000); // 高血量不会被秒
    const hpBefore2 = enemies2.map(e=>e.hp);
    runSkillOnce(tower2, enemies2, owner, true);

    const ultFired = messages.some(m=>m.type==='skillUlt');
    assert(`[${syn}] 蓝满技能触发了skillUlt`, ultFired);

    const hpAfter2 = enemies2.map(e=>e.hp);
    const mainHit2 = hpAfter2[0] < hpBefore2[0];
    assert(`[${syn}] 蓝满技能打到了目标`, mainHit2,
      `主目标HP: ${hpBefore2[0]} → ${hpAfter2[0]}`);

    // 特殊检测
    if(syn === 'shadow'){
      // 暗杀不能一次打死全部5只满血怪
      const deadCount = enemies2.filter(e=>e.dead).length;
      assert(`[shadow] 暗杀不秒杀全场(最多3只)`,
        deadCount <= 3, `死亡数量: ${deadCount}`);
    }

    if(syn === 'mech'){
      // 蓝满后必须有炮台被部署
      assert(`[mech] 蓝满部署了炮台`,
        (tower2._mechTurrets||[]).length > 0,
        `炮台数量: ${(tower2._mechTurrets||[]).length}`);
    }

    if(syn === 'holy'){
      // 封禁检测
      const sealed = enemies2.filter(e=>e._holySealed);
      assert(`[holy] 封禁了至少1个敌人`,
        sealed.length > 0, `封禁数量: ${sealed.length}`);
      // holy不应造成高伤
      const maxDmg = Math.max(...enemies2.map(e=>e._dmgReceived));
      assert(`[holy] 每个敌人受到的伤害不超过2倍塔dmg`,
        maxDmg <= tower2.dmg*2, `最高伤害: ${Math.round(maxDmg)}, 塔dmg: ${tower2.dmg}`);
    }

    if(syn === 'tank'){
      // 震地：范围内怪减速，但伤害应偏低
      const maxDmg = Math.max(...enemies2.map(e=>e._dmgReceived));
      assert(`[tank] 震地伤害适中(不超过2倍dmg)`,
        maxDmg <= tower2.dmg*2, `最高伤害: ${Math.round(maxDmg)}`);
      const slowed = enemies2.filter(e=>e.slowTick>0);
      assert(`[tank] 震地减速了范围内敌人`,
        slowed.length > 0, `减速数量: ${slowed.length}`);
    }

    if(syn === 'nature'){
      // 检查攻速buff
      assert(`[nature] 回春之息给塔施加了攻速buff`,
        (tower2._natureBuff||0) > 0,
        `_natureBuff: ${tower2._natureBuff}`);
      // 检查DOT
      const hasDot = enemies2[0].dot && enemies2[0].dot.tick>0;
      assert(`[nature] 普攻给目标施加了毒DOT`, hasDot);
    }

    if(syn === 'shield'){
      assert(`[shield] 法术解除激活了破防增伤`,
        (owner._shieldUltActive||0) > 0,
        `_shieldUltActive: ${owner._shieldUltActive}`);
    }

    if(syn === 'ranger'){
      // 穿透：不超出射程外的敌人(spread[3]=300px)
      const spread2 = makeSpreadEnemies();
      const t3 = makeTower('ranger', {rarity:'sr', skillReady:true});
      runSkillOnce(t3, spread2, owner, true);
      assert(`[ranger] 穿透箭不打300px外的目标`,
        spread2[3]._dmgReceived === 0,
        `300px外受伤: ${spread2[3]._dmgReceived}`);
    }
  });
}

// ═══════════════════════════════════════════════════════
//  汇总报告
// ═══════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(55));
const pass = results.filter(r=>r.status.includes('PASS')).length;
const fail = results.filter(r=>r.status.includes('FAIL')).length;
console.log(`\n📊 测试结果: ${pass} 通过 / ${fail} 失败 / ${results.length} 总计`);
if(fail > 0){
  console.log('\n❌ 失败项目:');
  results.filter(r=>r.status.includes('FAIL')).forEach(r=>{
    console.log(`  • ${r.label}${r.detail?' — '+r.detail:''}`);
  });
}
console.log('\n' + '═'.repeat(55));
