const fs = require('fs');

const filesToFix = ['index.html', 'products/index.html', 'products/detail.html'];

filesToFix.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Remove the incorrectly placed "Products" link that was at the start of the <ul>
    const badNavItemRegex = /<li class="menu-item menu-item-type-post_type menu-item-object-page"><a class="elementor-item" href="\/products\/">Products<\/a><\/li>/g;
    html = html.replace(badNavItemRegex, '');
    
    // Also might have been added with active classes if I ever did that, so remove any Products li
    const anyProductsLi = /<li[^>]*><a[^>]*href="\/products\/"[^>]*>Products<\/a><\/li>/g;
    html = html.replace(anyProductsLi, '');

    // 2. Find the Home <li> and inject Products right after it
    // The Home li looks like: <li class="menu-item... menu-item-home..."><a ... href="/">Home</a></li>
    // We'll use a regex that captures the entire Home <li>
    const homeLiRegex = /(<li[^>]*menu-item-home[^>]*>[\s\S]*?<a[^>]*href="\/"[^>]*>Home<\/a><\/li>)/ig;
    
    const isProductPage = file.includes('products/');
    
    html = html.replace(homeLiRegex, (match) => {
        // If we are on a products page, Home should not be active
        let newHome = match;
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
});

console.log("Navigation fixed successfully!");
