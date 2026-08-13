const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let updatedHtmlFiles = 0;
let deletedImages = 0;

function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.github' && file !== '.wrangler' && file !== 'scratch') {
                processHtmlFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Find all -WidthxHeight.ext patterns in src, href, data-thumbnail, data-src
            const regex = /(src|href|data-thumbnail|data-src|content)=["']([^"']+?)-(\d+)x(\d+)\.(jpg|jpeg|png|webp|gif)["']/gi;
            
            content = content.replace(regex, (match, attr, basePath, w, h, ext) => {
                const newUrl = basePath + '.' + ext;
                
                // Let's try to verify if the original exists locally before replacing
                let localPath = null;
                if (newUrl.startsWith('/')) {
                    localPath = path.join(rootDir, newUrl);
                } else if (!newUrl.startsWith('http')) {
                    // Resolve relative to this HTML file
                    localPath = path.join(path.dirname(fullPath), newUrl);
                }

                if (localPath && fs.existsSync(localPath)) {
                    modified = true;
                    return attr + '="' + newUrl + '"';
                }
                
                return match;
            });

            // Also remove srcset and sizes which point to multiple resolutions
            let newContent = content.replace(/\s+srcset="[^"]*"/g, '').replace(/\s+sizes="[^"]*"/g, '');
            if (content !== newContent) modified = true;
            content = newContent;

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                updatedHtmlFiles++;
            }
        }
    }
}

function cleanupResizedImages(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                cleanupResizedImages(fullPath);
            }
        } else {
            const match = file.match(/^(.*)-(\d+)x(\d+)\.(jpg|jpeg|png|webp|gif)$/i);
            if (match) {
                const baseName = match[1];
                const ext = match[4];
                const originalPath = path.join(dir, baseName + '.' + ext);
                
                if (fs.existsSync(originalPath)) {
                    fs.unlinkSync(fullPath);
                    deletedImages++;
                }
            }
        }
    }
}

processHtmlFiles(rootDir);
cleanupResizedImages(path.join(rootDir, 'assets', 'images'));
cleanupResizedImages(path.join(rootDir, 'wp-content', 'uploads'));

console.log('HTML files updated: ' + updatedHtmlFiles);
console.log('Duplicate resized images deleted: ' + deletedImages);
