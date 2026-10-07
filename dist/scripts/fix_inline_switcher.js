const fs = require('fs');
const path = require('path');

const targetFiles = [
    'index.html',
    'about-us/index.html',
    'contact/index.html',
    'partners/index.html',
    'privacy-policy/index.html',
    'products/detail.html',
    'products/index.html',
    'recipes/detail.html',
    'recipes/index-template.html',
    'recipes/index.html',
    'recipes/template.html',
    'services/index.html',
    'terms-of-service/index.html',
    'turpone-logistics/index.html',
    'turpone-ventures/index.html',
    'fr/index.html',
    'es/index.html',
    'fr/products/detail.html',
    'es/products/detail.html'
];

let updatedCount = 0;

targetFiles.forEach(relPath => {
    const fullPath = path.resolve(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    const orig = content;

    content = content.replace(
        /window\.location\.href\s*=\s*clean;/g,
        'window.location.href = clean + (window.location.search || "") + (window.location.hash || "");'
    );
    content = content.replace(
        /window\.location\.href\s*=\s*["']\/es["']\s*\+\s*clean;/g,
        'window.location.href = "/es" + clean + (window.location.search || "") + (window.location.hash || "");'
    );
    content = content.replace(
        /window\.location\.href\s*=\s*["']\/fr["']\s*\+\s*clean;/g,
        'window.location.href = "/fr" + clean + (window.location.search || "") + (window.location.hash || "");'
    );

    if (content !== orig) {
        fs.writeFileSync(fullPath, content, 'utf8');
        updatedCount++;
        console.log(`Updated inline switcher in ${relPath}`);
    }
});

console.log(`Finished updating ${updatedCount} files.`);
