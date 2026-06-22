const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === '.agents') return;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllHtmlFiles(fullPath));
        } else {
            if (fullPath.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const processFiles = (files) => {
    let modifiedCount = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // Extract title
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(' – Turpone Foods', '').trim() : 'Turpone Foods';

        const description = `Discover ${title} at Turpone Foods. We are experts in retail and food service, engineered for growth and scaled for impact.`;
        const ogImage = `https://turpone-foods.pages.dev/assets/images/Turpone-Pantry-Banner.webp`;

        const metaTagsToInject = `
<meta name="description" content="${description}">
<meta property="og:title" content="${title} – Turpone Foods">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
`;

        const existingOgImagePattern = /<meta property="og:image" content="\/assets\/images\/TF-LOgo\.svg" \/>/gi;
        
        if (content.match(existingOgImagePattern)) {
            content = content.replace(existingOgImagePattern, metaTagsToInject);
            fs.writeFileSync(file, content, 'utf8');
            modifiedCount++;
        } else if (!content.includes('name="description"')) {
            content = content.replace(/<\/head>/i, `${metaTagsToInject}</head>`);
            fs.writeFileSync(file, content, 'utf8');
            modifiedCount++;
        }
    });
    console.log(`Successfully injected SEO tags into ${modifiedCount} HTML files!`);
};

const htmlFiles = getAllHtmlFiles('.');
processFiles(htmlFiles);
