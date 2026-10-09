
const NEUTRAL_CATALOG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8fafc'/%3E%3Cpath d='M30 65 L45 45 L58 58 L68 46 L80 65 Z' fill='%23cbd5e1'/%3E%3Ccircle cx='40' cy='38' r='5' fill='%23cbd5e1'/%3E%3C/svg%3E";

function resolveImageUrl(img, market) {
    if (!img) return NEUTRAL_CATALOG_PLACEHOLDER;
    const currentMarket = market || (window.TurponeMarket ? window.TurponeMarket.getMarket() : (localStorage.getItem('turpone_market') || 'CA'));
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
        if (currentMarket === 'US' && img.includes('/ca_imgs/')) {
            return img.replace('/ca_imgs/', '/us_imgs/');
        }
        if (currentMarket === 'CA' && img.includes('/us_imgs/')) {
            return img.replace('/us_imgs/', '/ca_imgs/');
        }
        return img;
    }
    const folder = currentMarket === 'US' ? '/assets/images/us_imgs/' : '/assets/images/ca_imgs/';
    return folder + img;
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    const filters = document.querySelectorAll('.category-filter');
    let currentCategory = 'All';
    
    function getProductList() {
        if (window.ProductStore) {
            return window.ProductStore.getAll();
        }
        return (typeof productsData !== 'undefined') ? productsData : [];
    }

    function getCurrentLanguage() {
        const path = window.location.pathname.toLowerCase();
        const storedLang = (localStorage.getItem('preferred-lang') || '').toLowerCase();
        if (path.includes('/fr/') || path.startsWith('/fr')) return 'fr';
        if (path.includes('/es/') || path.startsWith('/es')) return 'es';
        if (storedLang === 'fr' || storedLang === 'es') return storedLang;
        return 'en';
    }

    function renderProducts(category) {
        currentCategory = category || currentCategory || 'All';
        if (!grid) return;
        grid.innerHTML = '';
        const allProds = getProductList();
        const lang = getCurrentLanguage();
        const market = window.TurponeMarket ? window.TurponeMarket.getMarket() : (localStorage.getItem('turpone_market') || 'CA');

        let filtered = currentCategory === 'All' 
            ? [...allProds].sort((a, b) => (a.category || '').localeCompare(b.category || '')) 
            : allProds.filter(p => p.category === currentCategory);
        
        if (filtered.length === 0) {
            const noProdMsg = lang === 'fr' ? 'Aucun produit trouvé dans cette catégorie.' :
                              lang === 'es' ? 'No se encontraron productos en esta categoría.' :
                              'No products found in this category.';
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">${noProdMsg}</p>`;
            return;
        }

        const viewDetailsText = lang === 'fr' ? 'Voir les détails' :
                                lang === 'es' ? 'Ver detalles' :
                                'View Details';

        const defaultDescText = lang === 'fr' ? 'Qualité Turpone authentique, conçue pour l\'excellence.' :
                                lang === 'es' ? 'Calidad Turpone auténtica, creada para la excelencia.' :
                                'Authentic Turpone quality, crafted for excellence.';

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const rawImg = (market === 'US' && p.image_us) ? p.image_us : (p.image_ca || p.image);
            const imgSrc = resolveImageUrl(rawImg, market);

            const displayTitle = (lang === 'fr' && p.title_fr) ? p.title_fr :
                                 (lang === 'es' && p.title_es) ? p.title_es :
                                 p.title;

            const displayCat = (lang === 'fr' && p.category_fr) ? p.category_fr :
                               (lang === 'es' && p.category_es) ? p.category_es :
                               p.category;

            const detailUrl = (lang === 'fr') ? `/fr/products/detail.html?id=${p.id}` :
                              (lang === 'es') ? `/es/products/detail.html?id=${p.id}` :
                              `/products/detail.html?id=${p.id}`;

            card.innerHTML = `
                <a href="${detailUrl}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                    <div class="img-wrapper">
                        <img src="${imgSrc}" alt="${displayTitle}" loading="lazy" onerror="this.onerror=null; this.src='${NEUTRAL_CATALOG_PLACEHOLDER}';">
                    </div>
                    <div class="card-cat">${displayCat}</div>
                    <h4>${displayTitle}</h4>
                    <p>${defaultDescText}</p>
                    <span class="btn-details" style="margin-top:auto;">${viewDetailsText} <i class="fa-solid fa-arrow-right"></i></span>
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
                const allCheckbox = document.querySelector('input[value="All"]');
                if (allCheckbox) allCheckbox.checked = true;
                renderProducts('All');
            }
        });
    });

    window.addEventListener('turpone:market-changed', () => {
        renderProducts(currentCategory);
    });

    // Initial render
    renderProducts('All');
});
