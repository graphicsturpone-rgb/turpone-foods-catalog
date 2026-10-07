const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const baseUrl = 'https://turponefoods.com/';
const excludeDirs = ['wp-content', 'author', 'my-account', 'scripts', 'content', '.git', '.github', 'assets'];
const excludeFiles = ['404.html', 'template.html', 'index-template.html'];

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(walkDir(fullPath));
            }
        } else {
            if (file.endsWith('.html') && !excludeFiles.includes(file)) {
                results.push(fullPath);
            }
        }
    });
    
    return results;
}

function generateSitemap() {
    console.log('Generating sitemap...');
    const allFiles = walkDir(rootDir);
    let urls = [];
    
    allFiles.forEach(file => {
        // Convert backslashes to forward slashes for URLs
        let relPath = path.relative(rootDir, file).split(path.sep).join('/');
        
        let urlPath = '';
        if (relPath === 'index.html') {
            urlPath = '';
        } else if (relPath.endsWith('/index.html')) {
            urlPath = relPath.slice(0, -10); // removes index.html
        } else {
            urlPath = relPath;
        }
        
        urls.push(baseUrl + urlPath);
    });
    
    urls.sort();
    
    // Remove duplicates
    urls = [...new Set(urls)];
    
    const today = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`Successfully generated sitemap.xml with ${urls.length} URLs.`);
}

generateSitemap();
