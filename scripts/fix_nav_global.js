const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html')) {
            fixNav(fullPath);
        }
    }
}

function fixNav(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    // First, let's check if the file even has a nav menu
    if (!html.includes('<ul class="elementor-nav-menu"')) return;

    // 1. Remove ANY existing "Products" link we added to clean up duplicates
    const badNavItemRegex = /<li[^>]*><a[^>]*href="\/products\/"[^>]*>Products<\/a><\/li>/g;
    html = html.replace(badNavItemRegex, '');

    // 2. Find the Home <li> and inject Products right after it
    const homeLiRegex = /(<li[^>]*menu-item-home[^>]*>[\s\S]*?<a[^>]*href="\/"[^>]*>Home<\/a><\/li>)/ig;
    
    // Normalize path separators to forward slash for checking if it's the products page
    const normalizedFile = file.replace(/\\/g, '/');
    const isProductPage = normalizedFile.includes('/products/index.html') || normalizedFile.includes('/products/detail.html');
    
    html = html.replace(homeLiRegex, (match) => {
        let newHome = match;
        // If we are on a products page, Home should not be active
        if (isProductPage) {
            newHome = newHome.replace(/current-menu-item/g, '')
                             .replace(/current_page_item/g, '')
                             .replace(/elementor-item-active/g, '')
                             .replace(/aria-current="page"/g, '');
        }

        // Create the Products <li>
        let productsClass = 'menu-item menu-item-type-post_type menu-item-object-page';
        let productsLinkClass = 'elementor-item';
        let ariaCurrent = '';
        
        if (isProductPage) {
            productsClass += ' current-menu-item current_page_item';
            productsLinkClass += ' elementor-item-active';
            ariaCurrent = ' aria-current="page"';
        }

        const newProductsLi = `<li class="${productsClass}"><a ${ariaCurrent} class="${productsLinkClass}" href="/products/">Products</a></li>`;

        return newHome + newProductsLi;
    });

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
}

processDirectory(__dirname + '/..');
console.log("Global Navigation fixed successfully!");
