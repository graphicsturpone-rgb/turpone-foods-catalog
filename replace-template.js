const fs = require('fs');
let content = fs.readFileSync('recipes/index-template.html', 'utf8');

const startStr = '<div class="recipe-container"';
const endStr = '</main>';

const start = content.indexOf(startStr);
const end = content.indexOf(endStr);

if (start !== -1 && end !== -1) {
    const newGrid = `
<div class="recipes-index" style="max-width:1200px; margin: 0 auto; padding: 100px 20px; background-color: #ffffff; color: #000000; min-height: 70vh;">
    <h1 style="font-size: 60px; font-weight: 300; letter-spacing: -1px; margin-bottom: 50px; text-align: center;">Our Recipes</h1>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px;">
        {{RECIPES_GRID}}
    </div>
</div>
`;
    content = content.substring(0, start) + newGrid + content.substring(end);
    fs.writeFileSync('recipes/index-template.html', content, 'utf8');
    console.log('Successfully updated index-template.html');
} else {
    console.log('Could not find start or end bounds');
}
