const fs = require('fs');
let content = fs.readFileSync('scripts/build-recipes.js', 'utf8');

const targetStr = `html = html.replace(/{{body}}/g, bodyHtml);`;
const replaceStr = targetStr + `

        if (metadata.nutrition && metadata.nutrition.trim() !== '') {
            html = html.replace(/{{nutrition_display}}/g, 'block');
            html = html.replace(/{{nutrition}}/g, marked.parse(metadata.nutrition));
        } else {
            html = html.replace(/{{nutrition_display}}/g, 'none');
            html = html.replace(/{{nutrition}}/g, '');
        }`;

if (content.includes(targetStr) && !content.includes('metadata.nutrition')) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('scripts/build-recipes.js', content, 'utf8');
    console.log('Script updated successfully.');
} else {
    console.log('Target string not found or already updated.');
}
