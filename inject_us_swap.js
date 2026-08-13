const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let injectedCount = 0;

function injectScript(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.git', 'scratch'].includes(file)) {
                injectScript(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('us-image-swap.js')) {
                const scriptTag = '<script src="assets/js/us-image-swap.js" defer></script>';
                if (content.includes('</body>')) {
                    content = content.replace('</body>', scriptTag + '\n</body>');
                } else {
                    content += scriptTag;
                }
                fs.writeFileSync(fullPath, content, 'utf8');
                injectedCount++;
                // console.log('Injected into ' + fullPath);
            }
        }
    }
}

injectScript(rootDir);
console.log('Successfully injected into ' + injectedCount + ' HTML files.');
