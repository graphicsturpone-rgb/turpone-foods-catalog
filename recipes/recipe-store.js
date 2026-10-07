/**
 * Recipes Data Store & Sync Manager for Turpone Foods
 * Manages loading recipes from recipesData (recipes/data.js) + custom/modified recipes (localStorage)
 */
(function(window) {
    const STORAGE_KEY = 'turpone_custom_recipes';

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

    function getAllRecipes() {
        const baseRecipes = (typeof recipesData !== 'undefined' && Array.isArray(recipesData)) ? [...recipesData] : [];
        const customRecipes = getCustomRecipes();
        
        const merged = [...baseRecipes];
        customRecipes.forEach(custom => {
            const index = merged.findIndex(r => String(r.id || r.slug) === String(custom.id || custom.slug));
            if (index >= 0) {
                merged[index] = { ...merged[index], ...custom };
            } else {
                merged.unshift(custom);
            }
        });

        return merged;
    }

    function getRecipeBySlug(slug) {
        const all = getAllRecipes();
        const strSlug = String(slug).trim().toLowerCase();
        return all.find(r => 
            String(r.id).trim().toLowerCase() === strSlug ||
            String(r.slug).trim().toLowerCase() === strSlug
        ) || null;
    }

    function saveRecipe(recipe) {
        const customRecipes = getCustomRecipes();
        const baseRecipes = (typeof recipesData !== 'undefined' && Array.isArray(recipesData)) ? recipesData : [];
        
        if (!recipe.id && !recipe.slug) {
            recipe.slug = (recipe.title || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            recipe.id = recipe.slug;
        } else if (!recipe.id) {
            recipe.id = recipe.slug;
        } else if (!recipe.slug) {
            recipe.slug = recipe.id;
        }

        const index = customRecipes.findIndex(r => String(r.id || r.slug) === String(recipe.id || recipe.slug));
        if (index >= 0) {
            customRecipes[index] = { ...customRecipes[index], ...recipe };
        } else {
            customRecipes.unshift(recipe);
        }

        saveCustomRecipes(customRecipes);
        return recipe;
    }

    function deleteRecipe(id) {
        let customRecipes = getCustomRecipes();
        customRecipes = customRecipes.filter(r => String(r.id || r.slug) !== String(id));
        saveCustomRecipes(customRecipes);
        return true;
    }

    function syncFromApi(callback) {
        if (typeof fetch === 'undefined') return;
        fetch('/api/recipes')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.recipes)) {
                    window.__apiRecipes = data.recipes;
                    if (typeof callback === 'function') callback(data.recipes);
                }
            })
            .catch(() => { /* offline fallback */ });
    }

    if (typeof window !== 'undefined') {
        syncFromApi();
    }

    window.RecipeStore = {
        getAll: function() {
            if (window.__apiRecipes && window.__apiRecipes.length > 0) {
                const custom = getCustomRecipes();
                const merged = [...window.__apiRecipes];
                custom.forEach(c => {
                    const idx = merged.findIndex(r => String(r.id || r.slug) === String(c.id || c.slug));
                    if (idx >= 0) merged[idx] = { ...merged[idx], ...c };
                    else merged.unshift(c);
                });
                return merged;
            }
            return getAllRecipes();
        },
        getBySlug: getRecipeBySlug,
        save: saveRecipe,
        delete: deleteRecipe,
        getCustom: getCustomRecipes,
        saveCustom: saveCustomRecipes,
        syncFromApi: syncFromApi
    };
})(window);
