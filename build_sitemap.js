const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const baseUrl = 'https://turponefoods.com/';

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'scratch', 'archive_scripts'].includes(file)) {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html') && !file.includes('template')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(rootDir);
const today = new Date().toISOString().split('T')[0];

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const file of htmlFiles) {
    let relPath = file.replace(rootDir, '').replace(/\\/g, '/');
    if (relPath.startsWith('/')) {
        relPath = relPath.substring(1);
    }
    
    // Convert index.html to trailing slash
    let urlPath = relPath;
    if (urlPath.endsWith('index.html')) {
        urlPath = urlPath.replace('index.html', '');
    }
    
    const url = baseUrl + urlPath;
    
    sitemap += '  <url>\n';
    sitemap += '    <loc>' + url + '</loc>\n';
    sitemap += '    <lastmod>' + today + '</lastmod>\n';
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
}

sitemap += '</urlset>\n';

fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
console.log('Successfully generated sitemap.xml with ' + htmlFiles.length + ' URLs.');
