const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

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
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Parse frontmatter and markdown body using gray-matter
        const parsed = matter(fileContent);
        const metadata = parsed.data;
        const markdownBody = parsed.content;
        
        // Render markdown body to HTML using marked
        const bodyHtml = marked.parse(markdownBody);
        
        // Build ingredients list
        let ingredientsHtml = '';
        if (metadata.ingredients && Array.isArray(metadata.ingredients)) {
            metadata.ingredients.forEach(item => {
                ingredientsHtml += `<li><span style="color:#000; font-weight:bold;">✓</span> ${item}</li>\n`;
            });
        }
        
        // Build instructions
        let instructionsHtml = '<ol style="padding-left: 20px; line-height: 1.8; font-size: 16px; color: #444;">\n';
        if (metadata.instructions && Array.isArray(metadata.instructions)) {
            metadata.instructions.forEach(item => {
                instructionsHtml += `<li style="margin-bottom: 20px;">${marked.parseInline(item)}</li>\n`;
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
        html = html.replace(/{{body}}/g, bodyHtml);

        let upsellHtml = '';
        if (metadata.upsellImage && metadata.upsellLink) {
            upsellHtml = `
            <div style="margin-top: 40px; text-align: center;">
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">Recommended Product</h4>
                <a href="${metadata.upsellLink}" target="_blank" style="display: inline-block;">
                    <img src="${metadata.upsellImage}" alt="Recommended Product" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                </a>
            </div>`;
        } else if (metadata.upsellImage) {
            upsellHtml = `
            <div style="margin-top: 40px; text-align: center;">
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">Recommended Product</h4>
                <img src="${metadata.upsellImage}" alt="Recommended Product" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            </div>`;
        }
        html = html.replace(/{{upsell_html}}/g, upsellHtml);

        if (metadata.nutrition && metadata.nutrition.trim() !== '') {
            html = html.replace(/{{nutrition_display}}/g, 'block');
            html = html.replace(/{{nutrition}}/g, marked.parse(metadata.nutrition));
        } else {
            html = html.replace(/{{nutrition_display}}/g, 'none');
            html = html.replace(/{{nutrition}}/g, '');
        }
        
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

