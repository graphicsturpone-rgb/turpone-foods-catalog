const canadianOnlineStores = [
    { id: 'walmart-ca', name: 'Walmart Canada', logo: '/assets/images/store_logos/Walmart-logo.svg', url: 'https://www.walmart.ca' },
    { id: 'loblaws', name: 'Loblaws', logo: '/assets/images/store_logos/loblaws-logo.svg', url: 'https://www.loblaws.ca' },
    { id: 'longos', name: 'Longos', logo: '/assets/images/store_logos/longos-logo.svg', url: 'https://www.longos.com' },
    { id: 'provigo', name: 'Provigo', logo: '/assets/images/store_logos/provigo-logo.svg', url: 'https://www.provigo.ca' },
    { id: 'superstore', name: 'Real Canadian Superstore', logo: '/assets/images/store_logos/real-canadian-superstore-logo.svg', url: 'https://www.realcanadiansuperstore.ca' }
];

const usOnlineStores = [
    { id: 'walmart-us', name: 'Walmart', logo: '/assets/images/store_logos/Walmart-logo.svg', url: 'https://www.walmart.com' },
    { id: 'target', name: 'Target', logo: '/assets/images/store_logos/target-logo.svg', url: 'https://www.target.com' },
    { id: 'kroger', name: 'Kroger', logo: '/assets/images/store_logos/kroger-logo.svg', url: 'https://www.kroger.com' },
    { id: 'wholefoods', name: 'Whole Foods Market', logo: '/assets/images/store_logos/whole-foods-logo.svg', url: 'https://www.wholefoodsmarket.com' }
];

const canadianPhysicalStores = [
    { id: 'walmart-ca-1', name: 'Walmart Supercentre', logo: '/assets/images/store_logos/Walmart-logo.svg', lat: 45.5017, lng: -73.5673, address: 'Montreal, QC', address2: '6832 Rue Jarry E' },
    { id: 'loblaws-1', name: 'Loblaws', logo: '/assets/images/store_logos/loblaws-logo.svg', lat: 43.6532, lng: -79.3832, address: 'Toronto, ON', address2: '456 King St W' },
    { id: 'provigo-1', name: 'Provigo Le Marché', logo: '/assets/images/store_logos/provigo-logo.svg', lat: 45.5414, lng: -73.6146, address: 'Montreal, QC', address2: '789 Queen Ave' },
    { id: 'longos-1', name: 'Longos', logo: '/assets/images/store_logos/longos-logo.svg', lat: 43.5890, lng: -79.6441, address: 'Mississauga, ON', address2: '321 Duke Blvd' },
    { id: 'superstore-1', name: 'Real Canadian Superstore', logo: '/assets/images/store_logos/real-canadian-superstore-logo.svg', lat: 45.3850, lng: -75.7533, address: 'Ottawa, ON', address2: '555 Prince St' }
];

const usPhysicalStores = [
    { id: 'walmart-us-1', name: 'Walmart Supercenter', logo: '/assets/images/store_logos/Walmart-logo.svg', lat: 40.7128, lng: -74.0060, address: 'New York, NY', address2: '999 Broadway' },
    { id: 'target-us-1', name: 'Target', logo: '/assets/images/store_logos/target-logo.svg', lat: 41.8781, lng: -87.6298, address: 'Chicago, IL', address2: '1154 S Clark St' },
    { id: 'kroger-us-1', name: 'Kroger', logo: '/assets/images/store_logos/kroger-logo.svg', lat: 33.7490, lng: -84.3880, address: 'Atlanta, GA', address2: '725 Ponce De Leon Ave' },
    { id: 'wholefoods-us-1', name: 'Whole Foods Market', logo: '/assets/images/store_logos/whole-foods-logo.svg', lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA', address2: '788 S Grand Ave' },
    { id: 'walmart-us-2', name: 'Walmart Supercenter', logo: '/assets/images/store_logos/Walmart-logo.svg', lat: 25.7617, lng: -80.1918, address: 'Miami, FL', address2: '3200 NW 79th St' }
];

function getActiveMarket() {
    if (window.TurponeMarket && typeof window.TurponeMarket.getMarket === 'function') {
        return window.TurponeMarket.getMarket();
    }
    return (localStorage.getItem('turpone_market') || 'CA').toUpperCase();
}

function getOnlineStores() {
    return getActiveMarket() === 'US' ? usOnlineStores : canadianOnlineStores;
}

function getPhysicalStores() {
    return getActiveMarket() === 'US' ? usPhysicalStores : canadianPhysicalStores;
}

let userLocation = null;
let currentTab = 'online';
let showAll = false;
let pageCurrentLang = 'en';

// Comprehensive UI dictionary for EN, FR, and ES
const UI_TRANSLATIONS = {
    en: {
        home: "Home",
        products: "Products",
        onlineTab: "Online",
        instoreTab: "In Store",
        directions: "Directions",
        buy: "Buy",
        seeMore: "See More",
        seeLess: "See Less",
        termsOfUse: "Terms of Use",
        moreDetails: "More Details",
        ingredients: "Ingredients",
        pinsaTitle: "What is a Pinsa?",
        pinsaDesc: "Pinsa is a hand-stretched Roman-style crust inspired by an ancient recipe, known for its crisp exterior and light, airy texture.",
        relatedTitle: "Related Products",
        relatedSubtitle: "Discover more authentic selections from our kitchen.",
        viewDetails: "View Details",
        loadingMap: "Loading Map...",
        findingStore: "Finding closest store...",
        productNotFound: "Product Not Found",
        defaultDesc: "Authentic Turpone quality, crafted for excellence.",
        defaultFeatures: "This package contains premium ingredients crafted for authenticity.",
        defaultIngredients: "Ingredients information coming soon."
    },
    fr: {
        home: "Accueil",
        products: "Produits",
        onlineTab: "En ligne",
        instoreTab: "En magasin",
        directions: "Itinéraire",
        buy: "Acheter",
        seeMore: "Voir plus",
        seeLess: "Voir moins",
        termsOfUse: "Conditions d'utilisation",
        moreDetails: "Plus de détails",
        ingredients: "Ingrédients",
        pinsaTitle: "Qu'est-ce qu'une Pinsa ?",
        pinsaDesc: "La pinsa est une pâte de style romain étirée à la main et inspirée d'une recette ancestrale, réputée pour son croustillant et sa texture légère et aérée.",
        relatedTitle: "Produits associés",
        relatedSubtitle: "Découvrez d'autres sélections authentiques de notre cuisine.",
        viewDetails: "Voir les détails",
        loadingMap: "Chargement de la carte...",
        findingStore: "Recherche du magasin le plus proche...",
        productNotFound: "Produit non trouvé",
        defaultDesc: "Qualité Turpone authentique, conçue pour l'excellence.",
        defaultFeatures: "Ce produit contient des ingrédients de première qualité confectionnés pour l'authenticité.",
        defaultIngredients: "Informations sur les ingrédients à venir."
    },
    es: {
        home: "Inicio",
        products: "Productos",
        onlineTab: "En línea",
        instoreTab: "En tienda",
        directions: "Cómo llegar",
        buy: "Comprar",
        seeMore: "Ver más",
        seeLess: "Ver menos",
        termsOfUse: "Términos de uso",
        moreDetails: "Más detalles",
        ingredients: "Ingredientes",
        pinsaTitle: "¿Qué es una Pinsa?",
        pinsaDesc: "La pinsa es una masa artesanal de estilo romano estirada a mano inspirada en una receta antigua, conocida por su exterior crujiente y su textura ligera y aireada.",
        relatedTitle: "Productos relacionados",
        relatedSubtitle: "Descubra más selecciones auténticas de nuestra cocina.",
        viewDetails: "Ver detalles",
        loadingMap: "Cargando mapa...",
        findingStore: "Buscando la tienda más cercana...",
        productNotFound: "Producto no encontrado",
        defaultDesc: "Calidad Turpone auténtica, creada para la excelencia.",
        defaultFeatures: "Este producto contiene ingredientes de primera calidad creados para la autenticidad.",
        defaultIngredients: "Información de ingredientes próximamente."
    }
};

function getT(key) {
    const langDict = UI_TRANSLATIONS[pageCurrentLang] || UI_TRANSLATIONS.en;
    return langDict[key] || (UI_TRANSLATIONS.en[key] || '');
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function renderStores() {
    const container = document.getElementById('store-list-container');
    if (!container) return;
    
    let html = `
        <div class="store-list-header">
            <div class="${currentTab === 'online' ? 'active' : ''}" onclick="switchTab('online')">${getT('onlineTab')}</div>
            <div class="${currentTab === 'instore' ? 'active' : ''}" onclick="switchTab('instore')">${getT('instoreTab')}</div>
        </div>
    `;

    let items = currentTab === 'online' ? getOnlineStores() : getPhysicalStores();
    
    if (currentTab === 'instore' && userLocation) {
        items.forEach(store => {
            store.distance = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, store.lat, store.lng);
        });
        items.sort((a, b) => a.distance - b.distance);
    }

    const displayCount = showAll ? items.length : 4;
    const itemsToShow = items.slice(0, displayCount);

    if (currentTab === 'instore') {
        html += `<div class="instore-layout">
            <div class="instore-map" id="map-container">`;
        
        if (userLocation && items.length > 0) {
            const closest = items[0];
            html += `<iframe src="https://maps.google.com/maps?q=${closest.lat},${closest.lng}&z=13&output=embed" allowfullscreen="" loading="lazy"></iframe>`;
        } else {
            html += `<div style="display:flex; height:100%; align-items:center; justify-content:center; background:#eee; color:#999;">${getT('loadingMap')}</div>`;
        }

        html += `</div>
            <div class="instore-list">`;
            
        itemsToShow.forEach((store) => {
            html += `<div class="store-item" style="border-bottom: 1px solid #eaeaea; padding: 15px 10px;">
                <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <img src="${store.logo}" class="store-logo-img" alt="${store.name} Logo" style="max-width:120px; max-height:45px;" />
                        <button class="btn-buy" style="padding: 8px 15px; font-size:11px;">${getT('directions')}</button>
                    </div>
                    <div class="store-item-info" style="margin:0;">
                        <div class="store-dist" style="font-weight:600; color:#111;">${store.distance !== undefined ? store.distance.toFixed(1) + ' mi' : ''} - ${store.address2}</div>
                        <div class="store-addr">${store.address}</div>
                    </div>
                    <a href="#" style="font-size:12px; font-weight:600; color:#111; text-decoration:none;">${getT('buy')} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i></a>
                </div>
            </div>`;
        });

        if (items.length > 4) {
            html += `
                <div style="text-align: center; padding: 15px; font-size: 13px; color: #111111; cursor: pointer; font-weight: 600;" onclick="toggleSeeMore()">
                    ${showAll ? `${getT('seeLess')} <i class="fa-solid fa-angle-up"></i>` : `${getT('seeMore')} <i class="fa-solid fa-angle-down"></i>`}
                </div>
            `;
        }
        
        html += `</div></div>`;
    } else {
        html += `<div class="online-list">`;
        itemsToShow.forEach((store) => {
            html += `<div class="store-item">
                <img src="${store.logo}" class="store-logo-img" alt="${store.name} Logo" />
                <a href="${store.url}" target="_blank"><button class="btn-buy">${getT('buy')}</button></a>
            </div>`;
        });
        if (items.length > 4) {
            html += `
                <div style="text-align: center; padding: 15px; font-size: 13px; color: #111111; cursor: pointer; font-weight: 600;" onclick="toggleSeeMore()">
                    ${showAll ? `${getT('seeLess')} <i class="fa-solid fa-angle-up"></i>` : `${getT('seeMore')} <i class="fa-solid fa-angle-down"></i>`}
                </div>
            `;
        }
        html += `</div>`;
    }

    container.innerHTML = html;
}

window.switchTab = function(tab) {
    currentTab = tab;
    showAll = false;
    if (tab === 'instore' && !userLocation) {
        fetchLocation();
    } else {
        renderStores();
    }
};

window.toggleSeeMore = function() {
    showAll = !showAll;
    renderStores();
};

function fetchLocation() {
    const container = document.getElementById('store-list-container');
    if (container) {
        container.innerHTML += `<div style="text-align:center; padding: 20px;">${getT('findingStore')}</div>`;
    }
    
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            userLocation = {
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude)
            };
            renderStores();
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            // Fallback location (e.g. Toronto)
            userLocation = { latitude: 43.6532, longitude: -79.3832 };
            renderStores();
        });
}

function toggleAccordion(el) {
    const content = el.nextElementSibling;
    if (content.style.display === 'block') {
        content.style.display = 'none';
        el.querySelector('i').classList.replace('fa-angle-up', 'fa-angle-down');
    } else {
        content.style.display = 'block';
        el.querySelector('i').classList.replace('fa-angle-down', 'fa-angle-up');
    }
}

const NEUTRAL_PRODUCT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8fafc'/%3E%3Cpath d='M30 65 L45 45 L58 58 L68 46 L80 65 Z' fill='%23cbd5e1'/%3E%3Ccircle cx='40' cy='38' r='5' fill='%23cbd5e1'/%3E%3C/svg%3E";

function resolveImageUrl(img) {
    if (!img) return NEUTRAL_PRODUCT_PLACEHOLDER;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
        return img;
    }
    return '/assets/images/ca_imgs/' + img;
}

// Multi-path image fallback loader for detail page
function attachImageFallback(imgEl, originalFilename) {
    if (!imgEl || !originalFilename) return;
    
    const cleanName = originalFilename.replace(/^.*[\\\/]/, '');
    const fallbackPaths = [
        `/assets/images/ca_imgs/${cleanName}`,
        `/assets/images/us_imgs/${cleanName}`,
        `/assets/uploads/2026/05/${cleanName}`,
        `/assets/images/${cleanName}`,
        NEUTRAL_PRODUCT_PLACEHOLDER
    ];

    let currentFallbackIdx = 0;
    imgEl.onerror = function() {
        while (currentFallbackIdx < fallbackPaths.length) {
            const nextCandidate = fallbackPaths[currentFallbackIdx++];
            if (imgEl.src !== nextCandidate && !imgEl.src.endsWith(nextCandidate)) {
                imgEl.src = nextCandidate;
                return;
            }
        }
        imgEl.onerror = null;
        imgEl.src = NEUTRAL_PRODUCT_PLACEHOLDER;
    };
}

function sanitizeGallery(gallery) {
    if (!Array.isArray(gallery)) return [];
    const sanitized = [];
    for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];
        if (typeof item !== 'string') continue;
        if (item.startsWith('data:image/') && item.includes(';base64') && !item.includes(',') && i + 1 < gallery.length) {
            sanitized.push(item + ',' + gallery[i + 1]);
            i++;
        } else {
            sanitized.push(item);
        }
    }
    return sanitized;
}

// Main page rendering function
function renderDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    
    let product = null;
    if (window.ProductStore) {
        product = window.ProductStore.getById(idParam);
    } else if (typeof productsData !== 'undefined') {
        const numId = parseInt(idParam);
        product = productsData.find(p => p.id === numId || String(p.id) === String(idParam));
    }

    // Determine current language: pathname has top priority (/fr/, /es/), fallback to preferred-lang
    let currentLang = 'en';
    const path = window.location.pathname.toLowerCase();
    const storedLang = (localStorage.getItem('preferred-lang') || '').toLowerCase();
    if (path.includes('/fr/') || path.startsWith('/fr')) {
        currentLang = 'fr';
    } else if (path.includes('/es/') || path.startsWith('/es')) {
        currentLang = 'es';
    } else if (storedLang === 'fr' || storedLang === 'es') {
        currentLang = storedLang;
    }
    pageCurrentLang = currentLang;

    // Self-healing: merge missing gallery, image, or localized keys from base productsData
    if (product && typeof productsData !== 'undefined') {
        const base = productsData.find(p => String(p.id) === String(product.id));
        if (base) {
            if ((!product.gallery || product.gallery.length === 0) && base.gallery && base.gallery.length > 0) {
                product.gallery = base.gallery;
            }
            if (base.image && (!product.image || product.image.includes('placeholder'))) {
                product.image = base.image;
            }
            const keysToSync = [
                'title_fr', 'title_es',
                'category_fr', 'category_es',
                'description_fr', 'description_es',
                'features_fr', 'features_es',
                'ingredients_fr', 'ingredients_es'
            ];
            keysToSync.forEach(k => {
                if (!product[k] && base[k]) product[k] = base[k];
            });
        }
    }

    const contentContainer = document.getElementById('product-content');
    if (!product) {
        if (contentContainer) {
            contentContainer.innerHTML = `<h2 style="text-align:center; padding: 50px;">${getT('productNotFound')}</h2>`;
        }
        return;
    }

    const localizedTitle = (currentLang === 'fr' && product.title_fr) ? product.title_fr :
                           (currentLang === 'es' && product.title_es) ? product.title_es :
                           (product.title || '');

    const localizedCat = (currentLang === 'fr' && product.category_fr) ? product.category_fr :
                         (currentLang === 'es' && product.category_es) ? product.category_es :
                         (product.category || (currentLang === 'fr' ? 'Produit' : currentLang === 'es' ? 'Producto' : 'Product'));

    // Localize Breadcrumbs & Title Links
    const homeLink = document.querySelector('#product-content a[href="/"], #product-content a[href="/fr/"], #product-content a[href="/es/"], #breadcrumb-home');
    if (homeLink) {
        homeLink.textContent = getT('home');
        homeLink.setAttribute('href', currentLang === 'fr' ? '/fr/' : (currentLang === 'es' ? '/es/' : '/'));
    }

    const productsLink = document.querySelector('#product-content a[href="/products/"], #product-content a[href="/fr/products/"], #product-content a[href="/es/products/"], #breadcrumb-products');
    if (productsLink) {
        productsLink.textContent = getT('products');
        productsLink.setAttribute('href', currentLang === 'fr' ? '/fr/products/' : (currentLang === 'es' ? '/es/products/' : '/products/'));
    }

    const breadcrumbCat = document.getElementById('breadcrumb-cat');
    if (breadcrumbCat) breadcrumbCat.textContent = localizedCat;

    const titleCat = document.getElementById('title-cat');
    if (titleCat) titleCat.textContent = localizedCat;

    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = localizedTitle;

    if (localizedTitle) {
        document.title = `${localizedTitle} | Turpone Foods`;
    }
    
    // Main Product Image
    const mainImg = document.getElementById('main-img');
    const mainImgSrc = resolveImageUrl(product.image);
    if (mainImg) {
        attachImageFallback(mainImg, product.image);
        mainImg.src = mainImgSrc;
        mainImg.alt = localizedTitle;
    }
    
    // Gallery Thumbnails setup
    let galleryImages = [];
    const cleanGallery = sanitizeGallery(product.gallery);
    if (cleanGallery.length > 0) {
        galleryImages = cleanGallery.map(img => resolveImageUrl(img));
        if (!galleryImages.includes(mainImgSrc)) {
            galleryImages.unshift(mainImgSrc);
        }
    } else if (product.image) {
        galleryImages = [mainImgSrc];
    }

    const thumbsContainer = document.querySelector('.thumbs-container');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        galleryImages.forEach((imgUrl, idx) => {
            const thumbBox = document.createElement('div');
            thumbBox.className = 'thumb-box';
            thumbBox.style.cssText = `width:70px; height:70px; border: 1px solid ${idx === 0 ? '#111' : '#ddd'}; border-radius:8px; padding:8px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: all 0.2s ease;`;
            
            const thumbImg = document.createElement('img');
            thumbImg.src = imgUrl;
            thumbImg.alt = `Thumbnail ${idx + 1}`;
            thumbImg.style.cssText = 'width:100%; height:100%; object-fit:cover; border-radius:4px;';
            attachImageFallback(thumbImg, imgUrl);
            thumbBox.appendChild(thumbImg);
            
            const selectThumbnail = () => {
                if (mainImg) {
                    attachImageFallback(mainImg, imgUrl);
                    mainImg.src = imgUrl;
                }
                document.querySelectorAll('.thumbs-container .thumb-box').forEach(b => {
                    b.style.borderColor = '#ddd';
                    b.style.transform = 'scale(1)';
                });
                thumbBox.style.borderColor = '#111';
                thumbBox.style.transform = 'scale(1.05)';
            };

            thumbBox.addEventListener('mouseenter', selectThumbnail);
            thumbBox.addEventListener('click', selectThumbnail);
            thumbsContainer.appendChild(thumbBox);
        });
    }

    // Localized Description
    const localizedDesc = (currentLang === 'fr' && product.description_fr) ? product.description_fr :
                          (currentLang === 'es' && product.description_es) ? product.description_es :
                          (product.description || getT('defaultDesc'));
    
    const descText = document.getElementById('desc-text');
    if (descText) descText.textContent = localizedDesc;
    
    // Accordion Titles & Content
    const accordionTitles = document.querySelectorAll('.accordion-title');
    if (accordionTitles.length >= 2) {
        accordionTitles[0].innerHTML = `${getT('moreDetails')} <i class="fa-solid fa-angle-up" style="color:#777;"></i>`;
        accordionTitles[1].innerHTML = `${getT('ingredients')} <i class="fa-solid fa-angle-down" style="color:#777;"></i>`;
    }

    const localizedFeatures = (currentLang === 'fr' && product.features_fr) ? product.features_fr :
                              (currentLang === 'es' && product.features_es) ? product.features_es :
                              (product.features || getT('defaultFeatures'));

    const localizedIngredients = (currentLang === 'fr' && product.ingredients_fr) ? product.ingredients_fr :
                                (currentLang === 'es' && product.ingredients_es) ? product.ingredients_es :
                                (product.ingredients || getT('defaultIngredients'));

    const detailsText = document.getElementById('details-text');
    if (detailsText) detailsText.textContent = localizedFeatures;

    const ingredientsText = document.getElementById('ingredients-text');
    if (ingredientsText) ingredientsText.textContent = localizedIngredients;

    // Terms of Use string
    const termsEl = document.querySelector('.detail-right > div[style*="text-align:center"]');
    if (termsEl) {
        termsEl.innerHTML = `${getT('termsOfUse')} <i class="fa-solid fa-building-columns"></i>`;
    }

    // Pinsa specific block localization
    const pinsaInfo = document.getElementById('pinsa-info');
    if (pinsaInfo) {
        if (product.category === 'Frozen Pinsa') {
            pinsaInfo.style.display = 'block';
            pinsaInfo.innerHTML = `
                <h4 style="font-size: 16px; font-weight: 700; color: #111111; margin-bottom: 10px;">${getT('pinsaTitle')}</h4>
                <p style="font-size: 14px; color: #555; line-height: 1.6; margin:0;">${getT('pinsaDesc')}</p>
            `;
        } else {
            pinsaInfo.style.display = 'none';
        }
    }

    // Related Products Section Header localization
    const relatedSection = document.getElementById('related-products-section');
    if (relatedSection) {
        const h3 = relatedSection.querySelector('.related-header h3');
        const p = relatedSection.querySelector('.related-header p');
        if (h3) h3.textContent = getT('relatedTitle');
        if (p) p.textContent = getT('relatedSubtitle');
    }

    // Interactive 2x Zoom on Mouse Hover for Main Product Image
    const mainImgBox = document.querySelector('.main-img-box');
    if (mainImgBox && mainImg && !mainImgBox.dataset.zoomAttached) {
        mainImgBox.dataset.zoomAttached = 'true';
        mainImgBox.addEventListener('mousemove', (e) => {
            const rect = mainImgBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            mainImg.style.transform = 'scale(2)';
        });

        mainImgBox.addEventListener('mouseleave', () => {
            mainImg.style.transformOrigin = 'center center';
            mainImg.style.transform = 'scale(1)';
        });
    }

    // Render Store Locator
    renderStores();

    // Render Related Products Carousel
    initRelatedProducts(product);
}

function initRelatedProducts(currentProduct) {
    const section = document.getElementById('related-products-section');
    const track = document.getElementById('relatedTrack');
    const prevBtn = document.getElementById('relatedPrevBtn');
    const nextBtn = document.getElementById('relatedNextBtn');

    if (!section || !track) return;

    let allProducts = [];
    if (window.ProductStore) {
        allProducts = window.ProductStore.getAll();
    } else if (typeof productsData !== 'undefined') {
        allProducts = [...productsData];
    }

    const otherProducts = allProducts.filter(p => String(p.id) !== String(currentProduct.id));
    if (otherProducts.length === 0) return;

    const sameCategory = otherProducts.filter(p => p.category === currentProduct.category);
    const diffCategory = otherProducts.filter(p => p.category !== currentProduct.category);
    const relatedList = [...sameCategory, ...diffCategory];

    if (relatedList.length === 0) return;

    const detailUrlPrefix = (pageCurrentLang === 'fr') ? '/fr/products/detail.html?id=' :
                            (pageCurrentLang === 'es') ? '/es/products/detail.html?id=' :
                            '/products/detail.html?id=';

    track.innerHTML = relatedList.map(p => {
        const imgSrc = resolveImageUrl(p.image);
        const cardTitle = (pageCurrentLang === 'fr' && p.title_fr) ? p.title_fr :
                          (pageCurrentLang === 'es' && p.title_es) ? p.title_es :
                          (p.title || '');
        const cardCat = (pageCurrentLang === 'fr' && p.category_fr) ? p.category_fr :
                        (pageCurrentLang === 'es' && p.category_es) ? p.category_es :
                        (p.category || (pageCurrentLang === 'fr' ? 'Produit' : pageCurrentLang === 'es' ? 'Producto' : 'Product'));

        return `
            <a href="${detailUrlPrefix}${p.id}" class="related-card">
                <div>
                    <div class="img-wrapper">
                        <img src="${imgSrc}" alt="${cardTitle}" loading="lazy" onerror="this.onerror=null; this.src=NEUTRAL_PRODUCT_PLACEHOLDER;">
                    </div>
                    <div class="related-card-cat">${cardCat}</div>
                    <h4>${cardTitle}</h4>
                </div>
                <div class="btn-view">
                    ${getT('viewDetails')} <i class="fa-solid fa-arrow-right"></i>
                </div>
            </a>
        `;
    }).join('');

    section.style.display = 'block';

    let currentIndex = 0;
    const totalItems = relatedList.length;

    function getVisibleCount() {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        if (width <= 992) return 3;
        return 4;
    }

    function getSlideStep() {
        const visible = getVisibleCount();
        return visible === 1 ? 1 : 2;
    }

    function getMaxIndex() {
        const visible = getVisibleCount();
        return Math.max(0, totalItems - visible);
    }

    function updateCarousel() {
        const visible = getVisibleCount();
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const firstCard = track.children[0];
        if (firstCard) {
            const gap = window.innerWidth <= 768 ? 16 : (window.innerWidth <= 992 ? 20 : 24);
            const cardWidth = firstCard.getBoundingClientRect().width;
            const shift = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${shift}px)`;
        }

        if (prevBtn) prevBtn.disabled = (currentIndex === 0);
        if (nextBtn) nextBtn.disabled = (currentIndex >= maxIdx);
    }

    function slideNext() {
        const step = getSlideStep();
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
            currentIndex = Math.min(currentIndex + step, maxIdx);
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function slidePrev() {
        const step = getSlideStep();
        const maxIdx = getMaxIndex();
        if (currentIndex > 0) {
            currentIndex = Math.max(currentIndex - step, 0);
        } else {
            currentIndex = maxIdx;
        }
        updateCarousel();
    }

    if (nextBtn && !nextBtn.dataset.listenerAttached) {
        nextBtn.dataset.listenerAttached = 'true';
        nextBtn.addEventListener('click', slideNext);
    }
    if (prevBtn && !prevBtn.dataset.listenerAttached) {
        prevBtn.dataset.listenerAttached = 'true';
        prevBtn.addEventListener('click', slidePrev);
    }

    if (!window.detailCarouselResizeAttached) {
        window.detailCarouselResizeAttached = true;
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    }

    if (window.detailAutoSlideInterval) {
        clearInterval(window.detailAutoSlideInterval);
    }
    window.detailAutoSlideInterval = setInterval(slideNext, 4500);

    if (!section.dataset.hoverAttached) {
        section.dataset.hoverAttached = 'true';
        section.addEventListener('mouseenter', () => {
            clearInterval(window.detailAutoSlideInterval);
        });
        section.addEventListener('mouseleave', () => {
            clearInterval(window.detailAutoSlideInterval);
            window.detailAutoSlideInterval = setInterval(slideNext, 4500);
        });
    }

    setTimeout(updateCarousel, 100);
}

// Lifecycle listeners
document.addEventListener('DOMContentLoaded', () => {
    window.toggleAccordion = toggleAccordion;
    renderDetailPage();
});

// Re-render automatically when background API sync delivers updated products
window.addEventListener('turpone:products-updated', () => {
    renderDetailPage();
});
