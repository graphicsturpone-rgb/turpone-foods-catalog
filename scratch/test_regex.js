const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'apps') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk('.');
const igFiles = htmlFiles.filter(f => fs.readFileSync(f, 'utf8').includes('floating-ig'));

let standardCount = 0;
let nonStandard = [];

for (const f of igFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/<style>\s*\/\*\s*Floating Instagram Icon\s*\*\/[\s\S]*?id="scrollTopBtn"[\s\S]*?<\/button>/i);
  if (match) {
    standardCount++;
  } else {
    nonStandard.push(f);
  }
}

console.log('Total with floating-ig:', igFiles.length);
console.log('Standard match count:', standardCount);
console.log('Non-standard count:', nonStandard.length, nonStandard);
