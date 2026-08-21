const fs = require('fs');
const path = require('path');

const domain = 'https://turponefoods.com';
const today = new Date().toISOString().split('T')[0];

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'admin' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') && !file.includes('template')) {
      fileList.push(filePath.replace(/\\\\/g, '/'));
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles('.');
let sitemapUrls = [];

htmlFiles.forEach(file => {
    let urlPath = file;
    // Remove index.html if it's the root of a folder
    if (urlPath.endsWith('index.html')) {
        urlPath = urlPath.replace('index.html', '');
    }
    
    // Formatting
    if (urlPath === '') urlPath = '/';
    else if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;
    
    if (urlPath !== '/' && !urlPath.endsWith('/')) {
        urlPath = urlPath + '/'; // enforce trailing slash for directory routes
    }
    
    // For specific html files not named index.html (like 404.html)
    if (file.endsWith('.html') && !file.endsWith('index.html')) {
        urlPath = '/' + file;
    }

    sitemapUrls.push(`  <url>\n    <loc>${domain}${urlPath}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapContent, 'utf8');
console.log('Successfully generated sitemap.xml with ' + sitemapUrls.length + ' URLs.');
