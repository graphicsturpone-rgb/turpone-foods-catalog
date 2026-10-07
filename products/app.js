
const NEUTRAL_CATALOG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8fafc'/%3E%3Cpath d='M30 65 L45 45 L58 58 L68 46 L80 65 Z' fill='%23cbd5e1'/%3E%3Ccircle cx='40' cy='38' r='5' fill='%23cbd5e1'/%3E%3C/svg%3E";

function resolveImageUrl(img) {
    if (!img) return NEUTRAL_CATALOG_PLACEHOLDER;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
        return img;
    }
    return '/assets/images/ca_imgs/' + img;
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    const filters = document.querySelectorAll('.category-filter');
    
    function getProductList() {
        if (window.ProductStore) {
            return window.ProductStore.getAll();
        }
        return (typeof productsData !== 'undefined') ? productsData : [];
    }

    function renderProducts(category) {
        grid.innerHTML = '';
        const allProds = getProductList();
        let filtered = category === 'All' 
            ? [...allProds].sort((a, b) => (a.category || '').localeCompare(b.category || '')) 
            : allProds.filter(p => p.category === category);
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No products found in this category.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const imgSrc = resolveImageUrl(p.image);
            card.innerHTML = `
                <a href="/products/detail.html?id=${p.id}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                    <div class="img-wrapper">
                        <img src="${imgSrc}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="card-cat">${p.category}</div>
                    <h4>${p.title}</h4>
                    <p>Authentic Turpone quality, crafted for excellence.</p>
                    <span class="btn-details" style="margin-top:auto;">View Details <i class="fa-solid fa-arrow-right"></i></span>
                </a>
            `;
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
