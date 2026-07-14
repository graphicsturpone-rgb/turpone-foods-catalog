const fs = require('fs');
const files = ['recipes/template.html', 'recipes/index-template.html'];
const newMenuItem = `<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-recipes"><a class="elementor-item" href="/recipes/">Recipes</a></li>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('menu-item-28"') && !content.includes('href="/recipes/"')) {
        content = content.replace(/<li class="menu-item[^>]*menu-item-28"[^>]*><a[^>]*href="\/contact\/"[^>]*>Contact<\/a><\/li>/g, match => {
            return newMenuItem + match;
        });
        fs.writeFileSync(file, content, 'utf8');
        console.log('Injected in ' + file);
    }
});
