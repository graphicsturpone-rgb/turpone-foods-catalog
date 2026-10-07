const fs = require('fs'); 
let html = fs.readFileSync('index.html', 'utf8'); 
const newNavItem = '<li class="menu-item menu-item-type-post_type menu-item-object-page"><a class="elementor-item" href="/products/">Products</a></li>'; 
html = html.replace(/(<ul class="elementor-nav-menu"[^>]*>)/g, '$1' + newNavItem); 
fs.writeFileSync('index.html', html);
