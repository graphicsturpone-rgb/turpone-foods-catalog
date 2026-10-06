/**
 * Product Data Store & Sync Manager for Turpone Foods Catalog
 * Manages loading products from productsData (data.js) + custom products added via Admin Backend (localStorage)
 */
(function(window) {
    const STORAGE_KEY = 'turpone_custom_products';

    function getCustomProducts() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading custom products:', e);
            return [];
        }
    }

    function saveCustomProducts(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            return true;
        } catch (e) {
            console.error('Error saving custom products:', e);
            return false;
        }
    }

    function getAllProducts() {
        const baseProducts = (typeof productsData !== 'undefined' && Array.isArray(productsData)) ? [...productsData] : [];
        const customProducts = getCustomProducts();
        
        // Merge custom products, overriding base products if ID matches or appending new ones
        const merged = [...baseProducts];
        customProducts.forEach(custom => {
            const index = merged.findIndex(p => String(p.id) === String(custom.id));
            if (index >= 0) {
                merged[index] = { ...merged[index], ...custom };
            } else {
                merged.unshift(custom);
            }
        });

        return merged;
    }

    function getProductById(id) {
        const all = getAllProducts();
        const strId = String(id).trim().toLowerCase();
        return all.find(p => 
            String(p.id).trim().toLowerCase() === strId ||
            (p.aliasId && String(p.aliasId).trim().toLowerCase() === strId) ||
            (p.slug && String(p.slug).trim().toLowerCase() === strId)
        ) || null;
    }

    function saveProduct(product) {
        const customProducts = getCustomProducts();
        const baseProducts = (typeof productsData !== 'undefined' && Array.isArray(productsData)) ? productsData : [];
        
        // Ensure id
        if (!product.id) {
            product.id = 'prod_' + Date.now();
        }

        const index = customProducts.findIndex(p => String(p.id) === String(product.id));
        if (index >= 0) {
            customProducts[index] = { ...customProducts[index], ...product };
        } else {
            customProducts.unshift(product);
        }

        saveCustomProducts(customProducts);
        return product;
    }

    function deleteProduct(id) {
        let customProducts = getCustomProducts();
        customProducts = customProducts.filter(p => String(p.id) !== String(id));
        saveCustomProducts(customProducts);
        return true;
    }

    // Background live sync from /api/products if connected
    function syncFromApi(callback) {
        if (typeof fetch === 'undefined') return;
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.products)) {
                    window.__apiProducts = data.products;
                    if (typeof callback === 'function') callback(data.products);
                }
            })
            .catch(() => { /* offline fallback */ });
    }

    // Run background sync on load
    if (typeof window !== 'undefined') {
        syncFromApi();
    }

    // Export to window
    window.ProductStore = {
        getAll: function() {
            if (window.__apiProducts && window.__apiProducts.length > 0) {
                // If remote API products are loaded, merge custom drafts
                const custom = getCustomProducts();
                const merged = [...window.__apiProducts];
                custom.forEach(c => {
                    const idx = merged.findIndex(p => String(p.id) === String(c.id));
                    if (idx >= 0) merged[idx] = { ...merged[idx], ...c };
                    else merged.unshift(c);
                });
                return merged;
            }
            return getAllProducts();
        },
        getById: getProductById,
        save: saveProduct,
        delete: deleteProduct,
        getCustom: getCustomProducts,
        saveCustom: saveCustomProducts,
        syncFromApi: syncFromApi
    };
})(window);
