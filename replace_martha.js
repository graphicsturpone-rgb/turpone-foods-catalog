const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const replacement = '<strong><a href="https://martha.com/" target="_blank">Martha Stewart</a></strong>';
            
            // Regex to match "Martha Stewart" and "Matha Stewart", avoiding double replacement if already matched
            // Lookahead/lookbehind is useful, but since we know it's plain text right now, we can just replace.
            // Using a simple regex:
            const re = /(Martha|Matha)\s+Stewart/gi;
            
            // To ensure we don't accidentally replace inside the a href tag if it's already run:
            if (!content.includes('href="https://martha.com/"')) {
                content = content.replace(re, replacement);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir('content/recipes');
