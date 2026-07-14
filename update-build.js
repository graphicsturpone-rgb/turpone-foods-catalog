const fs = require('fs');
let content = fs.readFileSync('scripts/build-recipes.js', 'utf8');

const targetStr = `            metadata.instructions.forEach(item => {
                instructionsHtml += \`<li style="margin-bottom: 20px;">\${item}</li>\\n\`;
            });`;

const replaceStr = `            metadata.instructions.forEach(item => {
                instructionsHtml += \`<li style="margin-bottom: 20px;">\${marked.parseInline(item)}</li>\\n\`;
            });`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('scripts/build-recipes.js', content, 'utf8');
    console.log('Script updated successfully.');
} else {
    console.log('Target string not found or already updated.');
}
