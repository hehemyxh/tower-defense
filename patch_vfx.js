const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const lines = html.split('\n');

// 找旧的 else if(false) 开始位置
const deadStart = lines.findIndex(l => l.includes('else if(false){ // c1001-style dead code guard'));
// 找 // 默认兜底 else { 的位置
const elseDefault = lines.findIndex((l,i) => i > deadStart && l.includes('// 默认兜底') && l.includes('else'));
console.log(`死代码段: ${deadStart+1} ~ ${elseDefault}`);

if(deadStart > 0 && elseDefault > deadStart){
  // 删除从 else if(false) 到 // 默认兜底 else 的前一行
  lines.splice(deadStart, elseDefault - deadStart);
  fs.writeFileSync(path.join(__dirname,'index.html'), lines.join('\n'));
  console.log(`✅ 已删除 ${elseDefault - deadStart} 行旧角色 VFX 死代码`);
} else {
  console.log('未找到范围，检查关键词');
}
