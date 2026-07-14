const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/recipes');
const outputDir = path.join(__dirname, '../recipes');
const templatePath = path.join(outputDir, 'template.html');
const indexTemplatePath = path.join(outputDir, 'index-template.html');

if (!fs.existsSync(contentDir)) {
    console.log('No recipes to build.');
    process.exit(0);
}

const template = fs.readFileSync(templatePath, 'utf8');
const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');
const files = fs.readdirSync(contentDir);
const recipesList = [];

files.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Simple frontmatter parser
        const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
        if (match) {
            const frontmatterRaw = match[1];
            const markdownBody = match[2].trim();
            
            const metadata = {};
            frontmatterRaw.split('\n').forEach(line => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim().replace(/^"|"$/g, '');
                    metadata[key] = value;
                }
            });
            
            // Build ingredients list
            const ingredientsMatch = frontmatterRaw.match(/ingredients:\n((?:\s+- .*\n?)+)/);
            let ingredientsHtml = '';
            if (ingredientsMatch) {
                const items = ingredientsMatch[1].split('\n').filter(i => i.trim().startsWith('-'));
                items.forEach(item => {
                    ingredientsHtml += `<li><span style="color:#000; font-weight:bold;">✓</span> ${item.replace('-', '').trim().replace(/^"|"$/g, '')}</li>\n`;
                });
            }
            
            // Build instructions
            const instructionsMatch = frontmatterRaw.match(/instructions:\n((?:\s+- .*\n?)+)/);
            let instructionsHtml = '<ol style="padding-left: 20px; line-height: 1.8; font-size: 16px; color: #444;">\n';
            if (instructionsMatch) {
                const items = instructionsMatch[1].split('\n').filter(i => i.trim().startsWith('-'));
                items.forEach(item => {
                    instructionsHtml += `<li style="margin-bottom: 20px;">${item.replace('-', '').trim().replace(/^"|"$/g, '')}</li>\n`;
                });
            }
            instructionsHtml += '</ol>';
            
            let html = template;
            html = html.replace(/{{title}}/g, metadata.title || '');
            html = html.replace(/{{image}}/g, metadata.image || '');
            html = html.replace(/{{prepTime}}/g, metadata.prepTime || '');
            html = html.replace(/{{cookTime}}/g, metadata.cookTime || '');
            html = html.replace(/{{yields}}/g, metadata.yields || '');
            html = html.replace(/{{calories}}/g, metadata.calories || '');
            html = html.replace(/{{ingredients_list}}/g, ingredientsHtml);
            html = html.replace(/{{instructions_list}}/g, instructionsHtml);
            
            // Generate slug from filename
            const slug = file.replace('.md', '');
            const recipeDir = path.join(outputDir, slug);
            
            if (!fs.existsSync(recipeDir)) {
                fs.mkdirSync(recipeDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(recipeDir, 'index.html'), html);
            console.log(`Generated: /recipes/${slug}/index.html`);
            
            recipesList.push({
                title: metadata.title,
                image: metadata.image,
                slug: slug
            });
        }
    }
});

// Generate recipes index page
let indexHtml = indexTemplate;
let gridHtml = '';

recipesList.forEach(recipe => {
    gridHtml += `
    <a href="/recipes/${recipe.slug}/" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
        <div style="height: 250px; background-image: url('${recipe.image}'); background-size: cover; background-position: center;"></div>
        <div style="padding: 25px; background: #fff;">
            <h3 style="font-size: 22px; font-weight: 600; margin: 0;">${recipe.title}</h3>
        </div>
    </a>
    `;
});

indexHtml = indexHtml.replace('{{RECIPES_GRID}}', gridHtml);
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('Generated: /recipes/index.html');

console.log('Recipe build complete!');
