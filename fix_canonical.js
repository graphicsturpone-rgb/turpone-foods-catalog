const fs = require('fs');
function removeDuplicateCanonical(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    content = content.replace(/<link href="\/services\/" rel="canonical"\/>/g, '');
    fs.writeFileSync(filepath, content, 'utf8');
}
removeDuplicateCanonical('recipes/template.html');
removeDuplicateCanonical('recipes/index-template.html');
