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
            console.error('Error saving custom products, attempting quota recovery:', e);
            try {
                // If quota exceeded, strip large DataURL strings to preserve product metadata
                const lightweight = products.map(p => {
                    const clone = { ...p };
                    if (typeof clone.image_ca === 'string' && clone.image_ca.startsWith('data:')) delete clone.image_ca;
                    if (typeof clone.image_us === 'string' && clone.image_us.startsWith('data:')) delete clone.image_us;
                    if (Array.isArray(clone.gallery_ca)) clone.gallery_ca = clone.gallery_ca.filter(g => typeof g === 'string' && !g.startsWith('data:'));
                    if (Array.isArray(clone.gallery_us)) clone.gallery_us = clone.gallery_us.filter(g => typeof g === 'string' && !g.startsWith('data:'));
                    return clone;
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
                return true;
            } catch (err2) {
                console.error('Fatal quota error on localStorage:', err2);
                return false;
            }
        }
    }

    function mergeProducts(baseList, customList) {
        const merged = [...baseList];
        const translationKeys = [
            'title_fr', 'title_es',
            'category_fr', 'category_es',
            'description_fr', 'description_es',
            'features_fr', 'features_es',
            'ingredients_fr', 'ingredients_es'
        ];

        const activeDrafts = [];
        customList.forEach(custom => {
            const index = merged.findIndex(p => String(p.id) === String(custom.id) || (custom.aliasId && String(p.id) === String(custom.aliasId)));
            if (index >= 0) {
                const baseProd = merged[index];

                // CRITICAL ANTI-ROLLBACK CHECK:
                // If base canonical product has an equal or newer timestamp, NEVER let older custom draft overwrite it!
                const baseTs = Number(baseProd.updated_at) || 0;
                const customTs = Number(custom.updated_at) || 0;
                if (baseTs > 0 && baseTs >= customTs) {
                    // Stale draft detected: canonical base is newer or already synced. Skip draft.
                    return;
                }

                activeDrafts.push(custom);
                const updated = { ...baseProd, ...custom };
                
                // Explicitly preserve market separation
                if (custom.image_ca !== undefined) updated.image_ca = custom.image_ca;
                if (custom.image_us !== undefined) updated.image_us = custom.image_us;
                if (custom.gallery_ca !== undefined) updated.gallery_ca = custom.gallery_ca;
                if (custom.gallery_us !== undefined) updated.gallery_us = custom.gallery_us;
                if (custom.image_ca === "") updated.image = (custom.image_us || "");
                if (custom.image_us === "") updated.image = (custom.image_ca || "");
                if (custom.updated_at) updated.updated_at = custom.updated_at;

                // Ensure localized strings are preserved from baseProd if custom draft did not specify them
                translationKeys.forEach(k => {
                    if (!updated[k] && baseProd[k]) {
                        updated[k] = baseProd[k];
                    }
                });

                // If title in custom draft changed, ensure title_fr and title_es match the updated size/volume
                if (custom.title && baseProd.title && custom.title !== baseProd.title) {
                    const oldParen = baseProd.title.match(/\(([^)]+)\)/);
                    const newParen = custom.title.match(/\(([^)]+)\)/);
                    if (oldParen && newParen) {
                        const oldSuffix = oldParen[0];
                        const newSuffix = newParen[0];
                        if (updated.title_fr) updated.title_fr = updated.title_fr.replace(oldSuffix, newSuffix);
                        if (updated.title_es) updated.title_es = updated.title_es.replace(oldSuffix, newSuffix);
                    }
                    const oldInch = baseProd.title.match(/\b(10|12)\s*["”']/);
                    const newInch = custom.title.match(/\b(10|12)\s*["”']/);
                    if (oldInch && newInch) {
                        if (updated.title_fr) updated.title_fr = updated.title_fr.replace(oldInch[0], newInch[0]);
                        if (updated.title_es) updated.title_es = updated.title_es.replace(oldInch[0], newInch[0]);
                    }
                }

                merged[index] = updated;
            } else {
                activeDrafts.push(custom);
                merged.unshift(custom);
            }
        });

        // Auto-purge stale drafts from localStorage if any were skipped
        if (activeDrafts.length !== customList.length) {
            saveCustomProducts(activeDrafts);
        }

        return merged;
    }

    function getAllProducts() {
        const baseProducts = (window.__apiProducts && window.__apiProducts.length > 0)
            ? [...window.__apiProducts]
            : ((typeof productsData !== 'undefined' && Array.isArray(productsData)) ? [...productsData] : []);
        const customProducts = getCustomProducts();
        return mergeProducts(baseProducts, customProducts);
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
        
        // Ensure id and updated_at
        if (!product.id) {
            product.id = 'prod_' + Date.now();
        }
        if (!product.updated_at) {
            product.updated_at = Date.now();
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
        fetch('/api/products?t=' + Date.now(), {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.products)) {
                    window.__apiProducts = data.products;
                    // Automatically clean up stale drafts in localStorage ONLY if remote has equal or newer timestamp
                    const custom = getCustomProducts();
                    if (custom.length > 0) {
                        const remaining = custom.filter(c => {
                            const remote = data.products.find(p => String(p.id) === String(c.id) || (c.aliasId && String(p.id) === String(c.aliasId)));
                            if (!remote) return true; // keep if local product doesn't exist remotely
                            
                            const localTs = Number(c.updated_at) || 0;
                            const remoteTs = Number(remote.updated_at) || 0;
                            // If remote has equal or newer timestamp, discard stale local draft
                            if (remoteTs >= localTs && remoteTs > 0) {
                                return false;
                            }
                            return true;
                        });
                        if (remaining.length !== custom.length) {
                            saveCustomProducts(remaining);
                        }
                    }
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
        getAll: getAllProducts,
        getById: getProductById,
        save: saveProduct,
        delete: deleteProduct,
        getCustom: getCustomProducts,
        saveCustom: saveCustomProducts,
        syncFromApi: syncFromApi
    };
})(window);
