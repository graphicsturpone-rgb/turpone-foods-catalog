/**
 * Recipes Data Store & Sync Manager for Turpone Foods
 * Manages loading recipes from recipesData (recipes/data.js) + custom/modified recipes (localStorage)
 * Supports instant local persistence, deletion tracking (tombstones), and live API synchronization.
 */
(function(window) {
    const STORAGE_KEY = 'turpone_custom_recipes';
    const DELETED_KEY = 'turpone_deleted_recipes';

    function getCustomRecipes() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading custom recipes:', e);
            return [];
        }
    }

    function saveCustomRecipes(recipes) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
            return true;
        } catch (e) {
            console.error('Error saving custom recipes:', e);
            return false;
        }
    }

    function getDeletedSlugs() {
        try {
            const data = localStorage.getItem(DELETED_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveDeletedSlugs(slugs) {
        try {
            localStorage.setItem(DELETED_KEY, JSON.stringify(slugs));
            return true;
        } catch (e) {
            return false;
        }
    }

    function getAllRecipes() {
        const baseRecipes = (window.__apiRecipes && window.__apiRecipes.length > 0)
            ? [...window.__apiRecipes]
            : ((typeof recipesData !== 'undefined' && Array.isArray(recipesData)) ? [...recipesData] : []);

        const customRecipes = getCustomRecipes();
        const deletedSlugs = new Set(getDeletedSlugs().map(s => String(s).trim().toLowerCase()));

        const merged = [...baseRecipes];
        customRecipes.forEach(custom => {
            const customId = String(custom.id || custom.slug || '').trim().toLowerCase();
            const index = merged.findIndex(r => {
                const baseId = String(r.id || r.slug || '').trim().toLowerCase();
                return baseId === customId;
            });

            if (index >= 0) {
                merged[index] = { ...merged[index], ...custom };
            } else {
                merged.unshift(custom);
            }
        });

        // Exclude all recipes that were marked as deleted
        const active = merged.filter(r => {
            const id = String(r.id || '').trim().toLowerCase();
            const slug = String(r.slug || '').trim().toLowerCase();
            return !deletedSlugs.has(id) && !deletedSlugs.has(slug);
        });

        return active;
    }

    function getRecipeBySlug(slug) {
        if (!slug) return null;
        const all = getAllRecipes();
        const strSlug = String(slug).trim().toLowerCase();
        return all.find(r => 
            String(r.id || '').trim().toLowerCase() === strSlug ||
            String(r.slug || '').trim().toLowerCase() === strSlug
        ) || null;
    }

    function saveRecipe(recipe) {
        if (!recipe) return null;

        // Ensure clean slug and id
        if (!recipe.id && !recipe.slug) {
            recipe.slug = (recipe.title || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            recipe.id = recipe.slug;
        } else if (!recipe.id) {
            recipe.id = recipe.slug;
        } else if (!recipe.slug) {
            recipe.slug = recipe.id;
        }

        recipe.updated_at = recipe.updated_at || Date.now();

        // 1. Remove from deleted tombstones if it was previously deleted
        const normId = String(recipe.id).trim().toLowerCase();
        const normSlug = String(recipe.slug).trim().toLowerCase();
        let deleted = getDeletedSlugs();
        deleted = deleted.filter(s => {
            const ns = String(s).trim().toLowerCase();
            return ns !== normId && ns !== normSlug;
        });
        saveDeletedSlugs(deleted);

        // 2. Save into custom recipes localStorage
        const customRecipes = getCustomRecipes();
        const index = customRecipes.findIndex(r => {
            const rId = String(r.id || r.slug || '').trim().toLowerCase();
            return rId === normId || rId === normSlug;
        });

        if (index >= 0) {
            customRecipes[index] = { ...customRecipes[index], ...recipe };
        } else {
            customRecipes.unshift(recipe);
        }
        saveCustomRecipes(customRecipes);

        // 3. Update memory cache if present
        if (window.__apiRecipes && Array.isArray(window.__apiRecipes)) {
            const memIdx = window.__apiRecipes.findIndex(r => {
                const mId = String(r.id || r.slug || '').trim().toLowerCase();
                return mId === normId || mId === normSlug;
            });
            if (memIdx >= 0) {
                window.__apiRecipes[memIdx] = { ...window.__apiRecipes[memIdx], ...recipe };
            } else {
                window.__apiRecipes.unshift(recipe);
            }
        }

        // 4. Dispatch event for instant UI reactivity across components
        try {
            window.dispatchEvent(new CustomEvent('turpone:recipes-updated', { detail: { action: 'save', recipe } }));
        } catch (e) {}

        return recipe;
    }

    function deleteRecipe(id) {
        if (!id) return false;
        const norm = String(id).trim().toLowerCase();

        // 1. Add to deleted tombstones
        const deleted = getDeletedSlugs();
        if (!deleted.some(s => String(s).trim().toLowerCase() === norm)) {
            deleted.push(norm);
            saveDeletedSlugs(deleted);
        }

        // 2. Remove from custom recipes
        let customRecipes = getCustomRecipes();
        customRecipes = customRecipes.filter(r => {
            const rId = String(r.id || r.slug || '').trim().toLowerCase();
            return rId !== norm;
        });
        saveCustomRecipes(customRecipes);

        // 3. Remove from memory cache
        if (window.__apiRecipes && Array.isArray(window.__apiRecipes)) {
            window.__apiRecipes = window.__apiRecipes.filter(r => {
                const mId = String(r.id || r.slug || '').trim().toLowerCase();
                return mId !== norm;
            });
        }

        // 4. Dispatch event for instant UI reactivity
        try {
            window.dispatchEvent(new CustomEvent('turpone:recipes-updated', { detail: { action: 'delete', id: norm } }));
        } catch (e) {}

        return true;
    }

    // Background live sync from /api/recipes with cache-busting
    function syncFromApi(callback) {
        if (typeof fetch === 'undefined') return;
        fetch('/api/recipes?t=' + Date.now(), {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.recipes)) {
                    window.__apiRecipes = data.recipes;

                    // Reconcile deleted tombstones: if remote no longer has them, prune tombstone
                    let deleted = getDeletedSlugs();
                    if (deleted.length > 0) {
                        const remaining = deleted.filter(slug => {
                            return data.recipes.some(r => 
                                String(r.id || '').trim().toLowerCase() === slug ||
                                String(r.slug || '').trim().toLowerCase() === slug
                            );
                        });
                        saveDeletedSlugs(remaining);
                    }

                    try {
                        window.dispatchEvent(new CustomEvent('turpone:recipes-updated', { detail: { action: 'sync', recipes: data.recipes } }));
                    } catch (e) {}

                    if (typeof callback === 'function') callback(data.recipes);
                }
            })
            .catch(() => { /* offline fallback */ });
    }

    // Auto-sync on load
    if (typeof window !== 'undefined') {
        syncFromApi();
    }

    // Export to window
    window.RecipeStore = {
        getAll: getAllRecipes,
        getBySlug: getRecipeBySlug,
        save: saveRecipe,
        delete: deleteRecipe,
        getCustom: getCustomRecipes,
        saveCustom: saveCustomRecipes,
        getDeleted: getDeletedSlugs,
        syncFromApi: syncFromApi
    };
})(typeof window !== 'undefined' ? window : this);
