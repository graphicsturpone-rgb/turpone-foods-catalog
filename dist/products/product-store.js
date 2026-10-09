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
        const translationKeys = [
            'title_fr', 'title_es',
            'category_fr', 'category_es',
            'description_fr', 'description_es',
            'features_fr', 'features_es',
            'ingredients_fr', 'ingredients_es'
        ];

        customProducts.forEach(custom => {
            const index = merged.findIndex(p => String(p.id) === String(custom.id));
            if (index >= 0) {
                const baseProd = merged[index];
                const updated = { ...baseProd, ...custom };
                
                // Explicitly preserve empty values if customized
                if (custom.image_ca !== undefined) updated.image_ca = custom.image_ca;
                if (custom.image_us !== undefined) updated.image_us = custom.image_us;
                if (custom.gallery_ca !== undefined) updated.gallery_ca = custom.gallery_ca;
                if (custom.gallery_us !== undefined) updated.gallery_us = custom.gallery_us;
                if (custom.image_ca === "") updated.image = "";

                // Ensure localized strings are preserved from baseProd if custom draft did not specify them
                translationKeys.forEach(k => {
                    if (!updated[k] && baseProd[k]) {
                        updated[k] = baseProd[k];
                    }
                });
                merged[index] = updated;
            } else {
                merged.unshift(custom);
            }
        });

        return merged;
    }

    function getProductById(id) {
        const all = (window.ProductStore && window.ProductStore.getAll) ? window.ProductStore.getAll() : getAllProducts();
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
                    try {
                        window.dispatchEvent(new CustomEvent('turpone:products-updated', { detail: data.products }));
                    } catch (e) {}
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
                const translationKeys = [
                    'title_fr', 'title_es',
                    'category_fr', 'category_es',
                    'description_fr', 'description_es',
                    'features_fr', 'features_es',
                    'ingredients_fr', 'ingredients_es'
                ];
                custom.forEach(c => {
                    const idx = merged.findIndex(p => String(p.id) === String(c.id));
                    if (idx >= 0) {
                        const baseProd = merged[idx];
                        const updated = { ...baseProd, ...c };
                        translationKeys.forEach(k => {
                            if (!updated[k] && baseProd[k]) updated[k] = baseProd[k];
                        });
                        merged[idx] = updated;
                    } else {
                        merged.unshift(c);
                    }
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
