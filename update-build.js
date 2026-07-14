const fs = require('fs');
let content = fs.readFileSync('scripts/build-recipes.js', 'utf8');

content = content.replace(/<div style="margin-top: 40px; text-align: center;">/g, '<div style="margin-top: 40px; text-align: left;">');

fs.writeFileSync('scripts/build-recipes.js', content, 'utf8');
console.log('Script updated successfully.');
