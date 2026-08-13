const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let referencedPaths = new Set();

function addReference(urlPath) {
    if (!urlPath) return;
    urlPath = urlPath.split('?')[0].split('#')[0]; // strip query/hash
    try {
        urlPath = decodeURIComponent(urlPath);
    } catch (e) {
        // Ignore URI malformed
    }
    
    // Convert backslashes to forward slashes for matching
    let normalized = urlPath.replace(/\\/g, '/');
    
    // We only care about local paths in assets, wp-content, wp-includes
    if (normalized.includes('/assets/') || normalized.includes('assets/')) {
        let match = normalized.match(/assets\/.*$/);
        if (match) referencedPaths.add(match[0]);
    }
    if (normalized.includes('/wp-content/') || normalized.includes('wp-content/')) {
        let match = normalized.match(/wp-content\/.*$/);
        if (match) referencedPaths.add(match[0]);
    }
    if (normalized.includes('/wp-includes/') || normalized.includes('wp-includes/')) {
        let match = normalized.match(/wp-includes\/.*$/);
        if (match) referencedPaths.add(match[0]);
    }
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Match common URL patterns
    const regexes = [
        /(?:src|href|data-thumbnail|data-src|content|url)=["']([^"']+)["']/gi,
        /url\(['"]?([^'"\)]+)['"]?\)/gi,
        /["']([^"']+\.(png|jpg|jpeg|webp|gif|svg|css|js|json|woff|woff2|ttf))["']/gi
    ];
    
    for (const regex of regexes) {
        let match;
        while ((match = regex.exec(content)) !== null) {
            addReference(match[1]);
        }
    }
}

function scanDirForReferences(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.github') {
                scanDirForReferences(fullPath);
            }
        } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
            scanFile(fullPath);
        }
    }
}

let deletedFiles = 0;

function purgeUnused(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            purgeUnused(fullPath);
        } else {
            let relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
            
            let isReferenced = referencedPaths.has(relPath);
            
            if (!isReferenced) {
                for (let ref of referencedPaths) {
                    if (ref.endsWith(relPath) || relPath.endsWith(ref)) {
                        isReferenced = true;
                        break;
                    }
                }
            }
            
            if (!isReferenced) {
                fs.unlinkSync(fullPath);
                deletedFiles++;
            }
        }
    }
}

console.log('Phase 2: Scanning all files to build reference map...');
scanDirForReferences(rootDir);
console.log('Found ' + referencedPaths.size + ' unique asset references.');

console.log('Phase 2: Purging unused files from assets, wp-content, wp-includes...');
purgeUnused(path.join(rootDir, 'assets'));
purgeUnused(path.join(rootDir, 'wp-content'));
purgeUnused(path.join(rootDir, 'wp-includes'));

console.log('Total unused files deleted:', deletedFiles);
