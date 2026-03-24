const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const lines = html.split('\n');

const wStart = lines.findIndex(l => l.includes('const WAVES = ['));
const wEnd   = lines.findIndex((l,i) => i > wStart && l.trim() === '];');
console.log(`WAVES: ${wStart+1} ~ ${wEnd+1}，共 ${wEnd-wStart+1} 行`);

// 生成新的50波（goblin=无技能 + wolf=有技能）
const newWaves = ['const WAVES = ['];
for(let w = 1; w <= 50; w++){
  const gobN  = 20 + w * 3;
  const wolfN = 5  + Math.floor(w * 1.5);
  const gobIv  = Math.max(300, 800 - w * 8);
  const wolfIv = Math.max(400, 1000 - w * 10);
  newWaves.push(`  {w:${w}, eg:[{id:'goblin', n:${gobN}, iv:${gobIv}},{id:'wolf', n:${wolfN}, iv:${wolfIv}}]},`);
}
newWaves.push('];');

lines.splice(wStart, wEnd - wStart + 1, ...newWaves);
fs.writeFileSync(path.join(__dirname,'index.html'), lines.join('\n'));
console.log(`✅ WAVES 已替换为 50 波，每波含 goblin + wolf`);
console.log(`示例 W1: ${newWaves[1]}`);
console.log(`示例 W50: ${newWaves[50]}`);
