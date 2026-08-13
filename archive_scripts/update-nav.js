const fs = require('fs');
const path = require('path');

function processDir(dir, lang, recipesLabel) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath, lang, recipesLabel);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const targetRegex = new RegExp(`(<li[^>]*><a[^>]*href="/${lang}/contact/"[^>]*>Contact</a></li>)`, 'g');
            
            content = content.replace(targetRegex, (match) => {
                // Determine if it has tabindex="-1"
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

processDir('fr', 'fr', 'Recettes');
processDir('es', 'es', 'Recetas');
console.log('Navigation updated for FR and ES');
