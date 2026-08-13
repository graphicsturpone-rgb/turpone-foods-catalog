const fs = require('fs');
const path = require('path');

function processDir(dir, lang, recipesLabel, contactLabel) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath, lang, recipesLabel, contactLabel);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const targetRegex = new RegExp(`(<li[^>]*><a[^>]*href="/${lang}/contact/"[^>]*>${contactLabel}</a></li>)`, 'g');
            
            content = content.replace(targetRegex, (match) => {
                const hasTabindex = match.includes('tabindex="-1"');
                const tabindexStr = hasTabindex ? ' tabindex="-1"' : '';
                
                const newLi = `<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-recipes"><a class="elementor-item" href="/${lang}/recipes/"${tabindexStr}>${recipesLabel}</a></li>`;
                modified = true;
                return newLi + match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('es', 'es', 'Recetas', 'Contacto');
console.log('Navigation updated for ES');
