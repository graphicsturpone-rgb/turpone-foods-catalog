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
console.log('Total HTML files found:', htmlFiles.length);

let withIg = 0;
let withFa = 0;
let withTk = 0;

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('floating-ig')) withIg++;
  if (content.includes('fa-instagram') || content.includes('font-awesome')) withFa++;
  if (content.includes('floating-tk')) withTk++;
}
console.log({ withIg, withFa, withTk });
