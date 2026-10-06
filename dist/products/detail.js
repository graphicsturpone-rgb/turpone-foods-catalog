const onlineStores = [
    { id: 'walmart', name: 'Walmart', logo: '/assets/images/store_logos/Walmart-logo.svg', url: 'https://www.walmart.com' },
    { id: 'loblaws', name: 'Loblaws', logo: '/assets/images/store_logos/loblaws-logo.svg', url: 'https://www.loblaws.ca' },
    { id: 'longos', name: 'Longos', logo: '/assets/images/store_logos/longos-logo.svg', url: 'https://www.longos.com' },
    { id: 'provigo', name: 'Provigo', logo: '/assets/images/store_logos/provigo-logo.svg', url: 'https://www.provigo.ca' },
    { id: 'superstore', name: 'Real Canadian Superstore', logo: '/assets/images/store_logos/real-canadian-superstore-logo.svg', url: 'https://www.realcanadiansuperstore.ca' }
];

const physicalStores = [
    { id: 'walmart-1', name: 'Walmart Supercentre', logo: '/assets/images/store_logos/Walmart-logo.svg', lat: 45.5017, lng: -73.5673, address: 'Montreal, QC', address2: '123 Main St' },
    { id: 'loblaws-1', name: 'Loblaws', logo: '/assets/images/store_logos/loblaws-logo.svg', lat: 43.6532, lng: -79.3832, address: 'Toronto, ON', address2: '456 King St' },
    { id: 'provigo-1', name: 'Provigo Le Marché', logo: '/assets/images/store_logos/provigo-logo.svg', lat: 45.5414, lng: -73.6146, address: 'Montreal, QC', address2: '789 Queen Ave' },
    { id: 'longos-1', name: 'Longos', logo: '/assets/images/store_logos/longos-logo.svg', lat: 43.5890, lng: -79.6441, address: 'Mississauga, ON', address2: '321 Duke Blvd' },
    { id: 'superstore-1', name: 'Real Canadian Superstore', logo: '/assets/images/store_logos/real-canadian-superstore-logo.svg', lat: 45.3850, lng: -75.7533, address: 'Ottawa, ON', address2: '555 Prince St' },
    { id: 'walmart-2', name: 'Walmart', logo: '/assets/images/store_logos/Walmart-logo.svg', lat: 40.7128, lng: -74.0060, address: 'New York, NY', address2: '999 Broadway' }
];

let userLocation = null;
let currentTab = 'online';
let showAll = false;

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
    return deg * (Math.PI / 180)
}

function renderStores() {
    const container = document.getElementById('store-list-container');
    
    let html = `
        <div class="store-list-header">
            <div class="${currentTab === 'online' ? 'active' : ''}" onclick="switchTab('online')">Online</div>
            <div class="${currentTab === 'instore' ? 'active' : ''}" onclick="switchTab('instore')">In Store</div>
        </div>
    `;

    let items = currentTab === 'online' ? onlineStores : physicalStores;
    
    if (currentTab === 'instore' && userLocation) {
        items.forEach(store => {
            store.distance = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, store.lat, store.lng);
        });
        items.sort((a, b) => a.distance - b.distance);
    }

    const displayCount = showAll ? items.length : (currentTab === 'online' ? 4 : 4);
    const itemsToShow = items.slice(0, displayCount);

    if (currentTab === 'instore') {
        html += `<div class="instore-layout">
            <div class="instore-map" id="map-container">`;
        
        if (userLocation && items.length > 0) {
            const closest = items[0];
            html += `<iframe src="https://maps.google.com/maps?q=${closest.lat},${closest.lng}&z=13&output=embed" allowfullscreen="" loading="lazy"></iframe>`;
        } else {
            html += `<div style="display:flex; height:100%; align-items:center; justify-content:center; background:#eee; color:#999;">Loading Map...</div>`;
        }

        html += `</div>
            <div class="instore-list">`;
            
        itemsToShow.forEach((store, index) => {
            html += `<div class="store-item" style="border-bottom: 1px solid #eaeaea; padding: 15px 10px;">
                <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <img src="${store.logo}" class="store-logo-img" alt="${store.name} Logo" style="max-width:120px; max-height:45px;" />
                        <button class="btn-buy" style="padding: 8px 15px; font-size:11px;">Directions</button>
                    </div>
                    <div class="store-item-info" style="margin:0;">
                        <div class="store-dist" style="font-weight:600; color:#111;">${store.distance !== undefined ? store.distance.toFixed(1) + ' mi' : ''} - ${store.address2}</div>
                        <div class="store-addr">${store.address}</div>
                    </div>
                    <a href="#" style="font-size:12px; font-weight:600; color:#111; text-decoration:none;">Buy <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i></a>
                </div>
            </div>`;
        });

        if (items.length > 4) {
            html += `
                <div style="text-align: center; padding: 15px; font-size: 13px; color: #111111; cursor: pointer; font-weight: 600;" onclick="toggleSeeMore()">
                    ${showAll ? 'See Less <i class="fa-solid fa-angle-up"></i>' : 'See More <i class="fa-solid fa-angle-down"></i>'}
                </div>
            `;
        }
        
        html += `</div></div>`; // Close instore-list and instore-layout
    } else {
        html += `<div class="online-list">`;
        itemsToShow.forEach((store) => {
            html += `<div class="store-item">
                <img src="${store.logo}" class="store-logo-img" alt="${store.name} Logo" />
                <a href="${store.url}" target="_blank"><button class="btn-buy">Buy</button></a>
            </div>`;
        });
        if (items.length > 4) {
            html += `
                <div style="text-align: center; padding: 15px; font-size: 13px; color: #111111; cursor: pointer; font-weight: 600;" onclick="toggleSeeMore()">
                    ${showAll ? 'See Less <i class="fa-solid fa-angle-up"></i>' : 'See More <i class="fa-solid fa-angle-down"></i>'}
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
}

window.toggleSeeMore = function() {
    showAll = !showAll;
    renderStores();
}

function fetchLocation() {
    const container = document.getElementById('store-list-container');
    container.innerHTML += '<div style="text-align:center; padding: 20px;">Finding closest store...</div>';
    
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

function resolveImageUrl(img) {
    if (!img) return '/assets/images/TF-LOgo.svg';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
        return img;
    }
    return '/assets/images/ca_imgs/' + img;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    
    let product = null;
    if (window.ProductStore) {
        product = window.ProductStore.getById(idParam);
    } else if (typeof productsData !== 'undefined') {
        const numId = parseInt(idParam);
        product = productsData.find(p => p.id === numId || String(p.id) === String(idParam));
    }

    if (!product) {
        document.getElementById('product-content').innerHTML = '<h2 style="text-align:center; padding: 50px;">Product Not Found</h2>';
        return;
    }

    // Populate data
    document.getElementById('breadcrumb-cat').textContent = product.category || 'Product';
    document.getElementById('title-cat').textContent = product.category || 'Product';
    document.getElementById('product-title').textContent = product.title || '';
    
    const mainImg = document.getElementById('main-img');
    const mainImgSrc = resolveImageUrl(product.image);
    mainImg.src = mainImgSrc;
    
    // Sanitize any previously split Data URLs
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

    // Gallery Thumbnails setup
    let galleryImages = [];
    const cleanGallery = sanitizeGallery(product.gallery);
    if (cleanGallery.length > 0) {
        galleryImages = cleanGallery.map(img => resolveImageUrl(img));
        // Ensure the main image is the first in gallery if not already present
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
            thumbBox.innerHTML = `<img src="${imgUrl}" alt="Thumbnail ${idx + 1}" style="max-width:100%; max-height:100%; object-fit:contain;" />`;
            
            // Hover and click dynamic image swap
            const selectThumbnail = () => {
                mainImg.src = imgUrl;
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

    document.getElementById('desc-text').textContent = product.description || 'Authentic Turpone quality, crafted for excellence.';
    
    // Accordions
    document.getElementById('details-text').textContent = product.features || 'This package contains premium ingredients crafted for authenticity.';
    document.getElementById('ingredients-text').textContent = product.ingredients || 'Ingredients information coming soon.';

    // Interactive 2x Zoom on Mouse Hover for Main Product Image
    const mainImgBox = document.querySelector('.main-img-box');
    if (mainImgBox && mainImg) {
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

    // Pinsa specific block
    if (product.category === 'Frozen Pinsa') {
        const pinsaInfo = document.getElementById('pinsa-info');
        if (pinsaInfo) pinsaInfo.style.display = 'block';
    }

    // Initial render of store locator
    renderStores();
    
    // Attach accordion listeners globally
    window.toggleAccordion = toggleAccordion;
});
