const fs = require('fs');
let content = fs.readFileSync('scripts/build-recipes.js', 'utf8');

// Replace the lines where headerMatch and footerMatch are applied
const targetStr = `
    if (headerMatch && footerMatch) {
        currentTemplate = currentTemplate.replace(/<header.*?<\\/header>/s, headerMatch[0]).replace(/<footer.*?<\\/footer>/s, footerMatch[0]);
        currentIndexTemplate = currentIndexTemplate.replace(/<header.*?<\\/header>/s, headerMatch[0]).replace(/<footer.*?<\\/footer>/s, footerMatch[0]);
    }
`;

const replaceStr = `
    if (headerMatch && footerMatch) {
        let h = headerMatch[0].replace(/(src|href)="\\.\\.\\//g, '$1="/');
        let f = footerMatch[0].replace(/(src|href)="\\.\\.\\//g, '$1="/');
        currentTemplate = currentTemplate.replace(/<header.*?<\\/header>/s, h).replace(/<footer.*?<\\/footer>/s, f);
        currentIndexTemplate = currentIndexTemplate.replace(/<header.*?<\\/header>/s, h).replace(/<footer.*?<\\/footer>/s, f);
    }
`;

content = content.replace(targetStr.trim(), replaceStr.trim());
fs.writeFileSync('scripts/build-recipes.js', content, 'utf8');
console.log('Build script patched for relative paths');
