const fs = require('fs');
const path = require('path');

function fixScript(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.git', 'scratch'].includes(file)) {
                fixScript(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('"assets/js/us-image-swap.js"')) {
                content = content.replace(/"assets\/js\/us-image-swap\.js"/g, '"/assets/js/us-image-swap.js"');
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

fixScript(__dirname);
