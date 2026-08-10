const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const rootDir = "c:/Users/User/Desktop/Web Design Google/Turpone Foods";
const htmlFiles = getHtmlFiles(rootDir);
const formRegex = /(<form[^>]*action="https:\/\/script\.google\.com[^>]*>)/;

for (const file of htmlFiles) {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  
  let lang = "en";
  if (relPath.startsWith("fr/")) lang = "fr";
  else if (relPath.startsWith("es/")) lang = "es";
  
  let content = fs.readFileSync(file, 'utf8');
  if (formRegex.test(content) && !content.includes('name="lang"')) {
    content = content.replace(formRegex, `$1<input name="lang" type="hidden" value="${lang}"/>`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${relPath} with lang=${lang}`);
  }
}
