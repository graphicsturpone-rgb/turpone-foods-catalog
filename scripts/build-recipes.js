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

const languages = [
    { code: 'en', outDir: outputDir, indexFile: '../index.html', t: { ing: 'Ingredients', inst: 'Instructions', nut: 'Nutrition Information', rec: 'Recommended Product' } },
    { code: 'fr', outDir: path.join(__dirname, '../fr/recipes'), indexFile: '../fr/index.html', t: { ing: 'Ingr�dients', inst: 'Instructions', nut: 'Valeur nutritive', rec: 'Produit recommand�' } },
    { code: 'es', outDir: path.join(__dirname, '../es/recipes'), indexFile: '../es/index.html', t: { ing: 'Ingredientes', inst: 'Instrucciones', nut: 'Informaci�n nutricional', rec: 'Producto recomendado' } }
];

languages.forEach(lang => {
    const langContentDir = path.join(contentDir, lang.code);
    if (!fs.existsSync(langContentDir)) return;

    // Get header/footer from lang.indexFile
    const langIndexContent = fs.readFileSync(path.join(__dirname, lang.indexFile), 'utf8');
    const headerMatch = langIndexContent.match(/<header.*?<\/header>/s);
    const footerMatch = langIndexContent.match(/<footer.*?<\/footer>/s);
    
    // Replace header/footer in templates
    let currentTemplate = template;
    let currentIndexTemplate = indexTemplate;
    
    if (headerMatch && footerMatch) {
        currentTemplate = currentTemplate.replace(/<header.*?<\/header>/s, headerMatch[0]).replace(/<footer.*?<\/footer>/s, footerMatch[0]);
        currentIndexTemplate = currentIndexTemplate.replace(/<header.*?<\/header>/s, headerMatch[0]).replace(/<footer.*?<\/footer>/s, footerMatch[0]);
    }

    const files = fs.readdirSync(langContentDir);
    const recipesList = [];

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const filePath = path.join(langContentDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            const parsed = matter(fileContent);
            const metadata = parsed.data;
            const markdownBody = parsed.content;
            
            const bodyHtml = marked.parse(markdownBody);
            
            let ingredientsHtml = '';
            if (metadata.ingredients && Array.isArray(metadata.ingredients)) {
                metadata.ingredients.forEach(item => {
                    ingredientsHtml += `<li><span style="color:#000; font-weight:bold;">\u2714</span> ${item}</li>\n`;
                });
            }
            
            let instructionsHtml = '<ol style="padding-left: 20px; line-height: 1.8; font-size: 16px; color: #444;">\n';
            if (metadata.instructions && Array.isArray(metadata.instructions)) {
                metadata.instructions.forEach(item => {
                    instructionsHtml += `<li style="margin-bottom: 20px;">${marked.parseInline(item)}</li>\n`;
                });
            }
            instructionsHtml += '</ol>';
            
            let html = currentTemplate;
            html = html.replace(/{{title}}/g, metadata.title || '');
            html = html.replace(/{{image}}/g, metadata.image || '');
            html = html.replace(/{{prepTime}}/g, metadata.prepTime || '');
            html = html.replace(/{{cookTime}}/g, metadata.cookTime || '');
            html = html.replace(/{{yields}}/g, metadata.yields || '');
            html = html.replace(/{{calories}}/g, metadata.calories || '');
            html = html.replace(/{{ingredients_list}}/g, ingredientsHtml);
            html = html.replace(/{{instructions_list}}/g, instructionsHtml);
            html = html.replace(/{{body}}/g, bodyHtml);
            
            // Translate static strings
            html = html.replace(/>Ingredients<\/h3>/g, `>${lang.t.ing}</h3>`);
            html = html.replace(/>Instructions<\/h3>/g, `>${lang.t.inst}</h3>`);
            html = html.replace(/>Nutrition Information<\/h3>/g, `>${lang.t.nut}</h3>`);

            let upsellHtml = '';
            if (metadata.upsellImage && metadata.upsellLink) {
                upsellHtml = `
                <div style="margin-top: 40px; text-align: left;">
                    <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">${lang.t.rec}</h4>
                    <a href="${metadata.upsellLink}" target="_blank" style="display: inline-block;">
                        <img src="${metadata.upsellImage}" alt="${lang.t.rec}" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                    </a>
                </div>`;
            } else if (metadata.upsellImage) {
                upsellHtml = `
                <div style="margin-top: 40px; text-align: left;">
                    <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">${lang.t.rec}</h4>
                    <img src="${metadata.upsellImage}" alt="${lang.t.rec}" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
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
            
            const slug = file.replace('.md', '');
            const recipeDir = path.join(lang.outDir, slug);
            
            if (!fs.existsSync(recipeDir)) {
                fs.mkdirSync(recipeDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(recipeDir, 'index.html'), html);
            console.log(`Generated: ${lang.outDir}/${slug}/index.html`);
            
            recipesList.push({
                title: metadata.title,
                image: metadata.image,
                slug: slug,
                prefix: lang.code === 'en' ? '/recipes/' : `/${lang.code}/recipes/`
            });
        }
    });

    let htmlIndex = currentIndexTemplate;
    let gridHtml = '';

    recipesList.forEach(recipe => {
        gridHtml += `
        <a href="${recipe.prefix}${recipe.slug}/" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
            <div style="height: 250px; background-image: url('${recipe.image}'); background-size: cover; background-position: center;"></div>
            <div style="padding: 25px; background: #fff;">
                <h3 style="font-size: 22px; font-weight: 600; margin: 0;">${recipe.title}</h3>
            </div>
        </a>
        `;
    });

    htmlIndex = htmlIndex.replace('{{RECIPES_GRID}}', gridHtml);
    if (!fs.existsSync(lang.outDir)) fs.mkdirSync(lang.outDir, { recursive: true });
    fs.writeFileSync(path.join(lang.outDir, 'index.html'), htmlIndex);
    console.log(`Generated: ${lang.outDir}/index.html`);
});

console.log('Recipe build complete!');
