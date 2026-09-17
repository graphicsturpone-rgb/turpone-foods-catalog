
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    const filters = document.querySelectorAll('.category-filter');
    
    function renderProducts(category) {
        grid.innerHTML = '';
        let filtered = category === 'All' ? [...productsData].sort((a, b) => a.category.localeCompare(b.category)) : productsData.filter(p => p.category === category);
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No products found in this category.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <a href="/products/detail.html?id=${p.id}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                    <div class="img-wrapper">
                        <img src="/assets/images/ca_imgs/${p.image}" alt="${p.title}" loading="lazy">
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
