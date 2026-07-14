const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const contentDir = path.join(__dirname, '../content/recipes');
const templatePath = path.join(__dirname, '../recipes/template.html');
const outputDir = path.join(__dirname, '../recipes');

// Ensure directories exist
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

// Read the template
const template = fs.readFileSync(templatePath, 'utf8');

// Get all markdown files
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

// Function to generate the HTML list for ingredients/instructions
function generateListHtml(items, isNumbered = false) {
    if (!items || !items.length) return '';
    return items.map((item, idx) => {
        const val = typeof item === 'string' ? item : Object.values(item)[0];
        return `<li style="margin-bottom: 15px; display: flex; gap: 15px;">
            ${isNumbered ? `<span style="font-weight: bold; font-size: 20px; color: #ccc;">${idx + 1}.</span>` : '<span style="color: #000; font-weight: bold;">&bull;</span>'}
            <span>${val}</span>
        </li>`;
    }).join('');
}

files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content } = matter(fileContent);
    
    // Create the HTML by replacing placeholders
    let recipeHtml = template;
    
    // Basic fields
    recipeHtml = recipeHtml.replace(/\{\{title\}\}/g, data.title || 'Untitled Recipe');
    recipeHtml = recipeHtml.replace(/\{\{image\}\}/g, data.image || '');
    recipeHtml = recipeHtml.replace(/\{\{prepTime\}\}/g, data.prepTime || '-');
    recipeHtml = recipeHtml.replace(/\{\{cookTime\}\}/g, data.cookTime || '-');
    recipeHtml = recipeHtml.replace(/\{\{yields\}\}/g, data.yields || '-');
    recipeHtml = recipeHtml.replace(/\{\{calories\}\}/g, data.calories || '-');
    
    // Upsell
    recipeHtml = recipeHtml.replace(/\{\{upsellImage\}\}/g, data.upsellImage || '');
    recipeHtml = recipeHtml.replace(/\{\{upsellLink\}\}/g, data.upsellLink || '#');
    
    // Lists
    recipeHtml = recipeHtml.replace(/\{\{ingredients_list\}\}/g, generateListHtml(data.ingredients, false));
    recipeHtml = recipeHtml.replace(/\{\{instructions_list\}\}/g, generateListHtml(data.instructions, true));
    
    // Markdown fields
    recipeHtml = recipeHtml.replace(/\{\{nutrition\}\}/g, marked(data.nutrition || ''));

    // Fix relative paths in the template (since it's now in recipes/slug/index.html instead of recipes/template.html)
    // Wait, the template uses paths like `../assets/`. We are moving to `recipes/slug/index.html` which is two levels deep.
    // So `../assets/` needs to become `../../assets/`.
    recipeHtml = recipeHtml.replace(/\.\.\/assets\//g, '../../assets/');
    recipeHtml = recipeHtml.replace(/href="\/"/g, 'href="/"');

    // Create a folder for the recipe based on the slug (filename without .md)
    const slug = path.basename(file, '.md');
    const recipeDir = path.join(outputDir, slug);
    if (!fs.existsSync(recipeDir)) {
        fs.mkdirSync(recipeDir, { recursive: true });
    }
    
    // Write the final HTML file
    fs.writeFileSync(path.join(recipeDir, 'index.html'), recipeHtml);
    console.log(`Generated: /recipes/${slug}/index.html`);
});

console.log('Recipe build complete!');
