const fs = require('fs');
const path = require('path');

// 1. Prepare products data
// 2. Prepare app.js
const appJs = `
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    const filters = document.querySelectorAll('.category-filter');
    
    function renderProducts(category) {
        grid.innerHTML = '';
        const filtered = category === 'All' ? productsData : productsData.filter(p => p.category === category);
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No products found in this category.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = \`
                <a href="/products/detail.html?id=\${p.id}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                    <div class="img-wrapper">
                        <img src="/assets/images/ca_imgs/\${p.image}" alt="\${p.title}" loading="lazy">
                    </div>
                    <div class="card-cat">\${p.category}</div>
                    <h4>\${p.title}</h4>
                    <p>Authentic Turpone quality, crafted for excellence.</p>
                    <span class="btn-details" style="margin-top:auto;">View Details <i class="fa-solid fa-arrow-right"></i></span>
                </a>
            \`;
            grid.appendChild(card);
        });
    }

    // Event listeners for filters
    filters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            if (e.target.checked) {
                // uncheck others
                filters.forEach(f => {
                    if (f !== e.target) f.checked = false;
                });
                renderProducts(e.target.value);
            } else {
                // if unchecked, default to All
                document.querySelector('input[value="All"]').checked = true;
                renderProducts('All');
            }
        });
    });

    // Initial render
    renderProducts('All');
});
`;
fs.writeFileSync('products/app.js', appJs);

// 3. Update products/index.html layout
const indexHtmlContent = fs.readFileSync('index.html', 'utf8');
const headerMatch = indexHtmlContent.match(/^([\s\S]*?<\/header>)/i);
let header = headerMatch ? headerMatch[1] : '';
const footerMatch = indexHtmlContent.match(/(<footer[\s\S]*)$/i);
let footer = footerMatch ? footerMatch[1] : '';

const fixPaths = (html) => html.replace(/(href|src)="assets\//g, '$1="/assets/');
header = fixPaths(header);
footer = fixPaths(footer);

// Inject "Products" into navigation
// The nav menu has <li class="menu-item..."><a href="/turpone-products/">...
const newNavItem = '<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item current_page_item"><a class="elementor-item elementor-item-active" aria-current="page" href="/products/">Products</a></li>';
header = header.replace(/(<li[^>]*menu-item-home[^>]*>[\s\S]*?<a[^>]*href="\/"[^>]*>Home<\/a><\/li>)/ig, (match) => {
    const cleanedHome = match.replace(/current-menu-item|current_page_item|elementor-item-active|aria-current="page"/g, '');
    return cleanedHome + newNavItem;
});

const customCSS = `
<style>
.products-layout { display: flex; max-width: 1200px; margin: 40px auto; padding: 0 20px; gap: 40px; font-family: 'Poppins', sans-serif; }
.products-sidebar { width: 250px; flex-shrink: 0; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea; align-self: flex-start; position: sticky; top: 120px; }
.products-sidebar h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;}
.products-sidebar ul { list-style: none; padding: 0; margin: 0; }
.products-sidebar li { margin-bottom: 15px; }
.products-sidebar label { display: flex; align-items: center; font-size: 14px; color: #555; cursor: pointer; }
.products-sidebar input[type="checkbox"] { margin-right: 10px; cursor: pointer; accent-color: #111111; }
.products-grid { flex-grow: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; align-items: stretch; }
.product-card { background: #fff; border-radius: 8px; border: 1px solid #eaeaea; padding: 20px; text-align: center; transition: box-shadow 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;}
.product-card:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.product-card .img-wrapper { width: 100%; height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; background: #ffffff; border-radius: 4px; padding: 10px;}
.product-card img { max-width: 100%; max-height: 100%; object-fit: contain; }
.card-cat { font-size: 10px; color: #111111; text-transform: uppercase; margin-bottom: 5px; font-weight: 600; letter-spacing: 1px;}
.product-card h4 { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px; line-height: 1.3;}
.product-card p { font-size: 13px; color: #777; margin-bottom: 20px; line-height: 1.4; flex-grow: 1;}
.product-card .btn-details { color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;}
.product-card .btn-details i { margin-left: 5px; transition: transform 0.2s; }
.product-card .btn-details:hover i { transform: translateX(3px); }
@media(max-width: 992px) { .products-grid { grid-template-columns: repeat(2, 1fr); } } @media(max-width: 768px) { .products-layout { flex-direction: column; } .products-sidebar { width: 100%; position: relative; top: 0; } .products-grid { grid-template-columns: repeat(2, 1fr); } } @media(max-width: 576px) { .products-grid { grid-template-columns: 1fr; } }
</style>
`;

const catalogHtml = `${header}
${customCSS}
<main style="background: #ffffff; min-height: 80vh; padding-top: 40px; padding-bottom: 60px;">
    <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="font-size: 42px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #333;">Turpone Products</h1>
        <p style="color: #666; font-size: 16px;">Discover our premium selection of authentic ingredients.</p>
    </div>
    <div class="products-layout">
        <aside class="products-sidebar">
            <h3>By Categories</h3>
            <ul>
                <li><label><input type="checkbox" class="category-filter" value="All" checked> View All</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Infused Oils"> Infused Oils</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Honeys"> Honeys</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Seasoning"> Seasoning</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Pizza Sauce"> Pizza Sauce</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Pizza Flour"> Pizza Flour</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Frozen Pizza Dough"> Frozen Pizza Dough</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Frozen Pizza"> Frozen Pizza</label></li>
                <li><label><input type="checkbox" class="category-filter" value="Frozen Pinsa"> Frozen Pinsa</label></li>
            </ul>
        </aside>
        <div class="products-grid" id="products-grid">
            <!-- Rendered by JS -->
        </div>
    </div>
</main>
<script src="/products/data.js"></script>
<script src="/products/app.js"></script>
${footer}`;

fs.writeFileSync('products/index.html', catalogHtml);
console.log("Senior-level rewrite complete.");
