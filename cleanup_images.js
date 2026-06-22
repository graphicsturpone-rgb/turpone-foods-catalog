const fs = require('fs');
const path = require('path');

// 1. Strip srcset and sizes from all HTML files
function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processHtmlFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove srcset and sizes attributes safely
            let newContent = content.replace(/\s+srcset="[^"]*"/g, '').replace(/\s+sizes="[^"]*"/g, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated HTML:', fullPath);
            }
        }
    }
}

// 2. Delete resized images ONLY if original exists
function cleanupUploads(dir) {
    if (!fs.existsSync(dir)) return;
    let deletedCount = 0;
    
    function scanDir(currentDir) {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                scanDir(fullPath);
            } else {
                // Check if file matches -[width]x[height].[ext]
                const match = file.match(/^(.*)-(\d+)x(\d+)\.(jpg|jpeg|png|webp|gif)$/i);
                if (match) {
                    const baseName = match[1];
                    const ext = match[4];
                    const originalPath = path.join(currentDir, baseName + '.' + ext);
                    
                    // Only delete if the original non-resized file exists
                    if (fs.existsSync(originalPath)) {
                        fs.unlinkSync(fullPath);
                        deletedCount++;
                        console.log('Deleted resized image:', fullPath);
                    }
                }
            }
        }
    }
    
    scanDir(dir);
    console.log('Total resized images deleted:', deletedCount);
}

console.log('Starting Phase 1: Cleaning HTML attributes...');
processHtmlFiles(__dirname);
console.log('Starting Phase 2: Purging resized images...');
cleanupUploads(path.join(__dirname, 'wp-content', 'uploads'));
console.log('Cleanup complete!');
