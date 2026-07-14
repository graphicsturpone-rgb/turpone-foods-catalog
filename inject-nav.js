const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'admin' || file === 'recipes' || file.startsWith('.')) continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getHtmlFiles(baseDir);

const newMenuItem = `<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-recipes"><a class="elementor-item" href="/recipes/">Recipes</a></li>`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Inject the link before the "Contact" link (menu-item-28) in both desktop and mobile menus
    if (content.includes('menu-item-28"')) {
        content = content.replace(/<li class="menu-item[^>]*menu-item-28"[^>]*><a[^>]*href="\/contact\/"[^>]*>Contact<\/a><\/li>/g, match => {
            return newMenuItem + match;
        });
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Navigation injection complete.');
