const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (['node_modules', '.git', '.wrangler', 'mingit'].includes(item)) continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllHtmlFiles(fullPath, fileList);
        } else if (item.endsWith('.html')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

const rootDir = process.cwd();
const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to clean.`);

let cleanedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Remove WordPress auto sizes inline css
    content = content.replace(/<style id="wp-img-auto-sizes-contain-inline-css">[\s\S]*?<\/style>/gi, '');

    // 2. Clean WP body classes: replace "wp-singular page-template-default ... wp-theme-hello-elementor hello-elementor-default" with clean "turpone-site-body" or keep essential layout classes
    content = content.replace(/class="([^"]*)\bwp-singular\b([^"]*)"/gi, (match, before, after) => {
        let classes = `${before} ${after}`.replace(/\b(wp-singular|page-template-default|wp-custom-logo|wp-embed-responsive|wp-theme-hello-elementor|hello-elementor-default)\b/g, '').replace(/\s+/g, ' ').trim();
        return `class="${classes}"`;
    });

    // 3. Remove WP speculation rules mentioning wp-admin or wp-*.php
    content = content.replace(/<script type="speculationrules">[\s\S]*?<\/script>/gi, '');

    // 4. Remove /wp-admin/ajax endpoints and replace with clean static or API paths
    content = content.replace(/\/wp-admin\/admin-ajax\.php/g, '/api/products');
    content = content.replace(/\/wp-json\//g, '/api/');

    // 5. Remove WP emoji / generator / meta tags if any
    content = content.replace(/<meta name="generator" content="WordPress[^"]*" \/>/gi, '');
    content = content.replace(/<!-- \/?(wp|elementor):[^>]* -->/gi, '');

    // 6. Clean Hello / WP / Elementor inline script comments like sourceURL=wp-i18n-js-after
    content = content.replace(/\/\/# sourceURL=wp-[^\n]*/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        cleanedCount++;
    }
}

console.log(`Cleaned WordPress artifacts from ${cleanedCount} files.`);
