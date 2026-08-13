const fs = require('fs');
const path = require('path');

let deletedDirs = 0;

function removeEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    // Recursively check subdirectories
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            removeEmptyDirs(fullPath);
        }
    }
    
    // Check if dir is now empty
    const currentFiles = fs.readdirSync(dir);
    if (currentFiles.length === 0) {
        fs.rmdirSync(dir);
        deletedDirs++;
        // console.log('Deleted empty dir:', dir);
    }
}

const rootDir = __dirname;
console.log('Phase 3: Removing empty directories...');
removeEmptyDirs(path.join(rootDir, 'assets'));
removeEmptyDirs(path.join(rootDir, 'wp-content'));
removeEmptyDirs(path.join(rootDir, 'wp-includes'));
console.log('Total empty directories deleted:', deletedDirs);
