/**
 * Cloudflare Pages Function: /api/recipes
 * Full Automated Recipes Sync, Atomic Git Production Deployments & Multilingual Translation Engine
 * 
 * Supports:
 * - GET: Fetch full live recipes list from recipes/data.js with 0-cache guarantee
 * - POST: Add/Update recipe, auto-translate (FR & ES), upload images, atomic commit to main & production
 * - DELETE: Remove recipe from recipes/data.js, atomic commit to main & production
 */

const REPO_OWNER = "graphicsturpone-rgb";
const REPO_NAME = "turpone-foods-catalog";
const RECIPES_DATA_PATH = "recipes/data.js";
const DIST_RECIPES_DATA_PATH = "dist/recipes/data.js";
const RECIPES_IMAGES_DIR = "assets/images/recipes";
const DIST_RECIPES_IMAGES_DIR = "dist/assets/images/recipes";

// Helper for GitHub REST API calls with 0-cache guarantee
async function githubRequest(path, method = "GET", body = null, token) {
    const separator = path.includes("?") ? "&" : "?";
    const cacheBuster = method === "GET" ? `${separator}_cb=${Date.now()}` : "";
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}${cacheBuster}`;
    const headers = {
        "User-Agent": "Turpone-Recipe-Sync-Engine",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
    };

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        cf: { cacheTtl: 0, cacheEverything: false }
    });

    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

function decodeBase64Utf8(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

function encodeBase64Utf8(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Fetch file contents from GitHub with 0-cache direct Git Data API guarantee
async function getFileContent(filePath, branch = "main", token) {
    // 1. Primary: Direct Git Tree & Blob inspection (Bypasses GitHub's 60s contents/ REST edge cache)
    try {
        const refRes = await githubRequest(`git/ref/heads/${branch}`, "GET", null, token);
        if (refRes.ok && refRes.data && refRes.data.object && refRes.data.object.sha) {
            const headCommitSha = refRes.data.object.sha;
            const commitRes = await githubRequest(`git/commits/${headCommitSha}`, "GET", null, token);
            if (commitRes.ok && commitRes.data && commitRes.data.tree && commitRes.data.tree.sha) {
                const treeSha = commitRes.data.tree.sha;
                const treeRes = await githubRequest(`git/trees/${treeSha}?recursive=1`, "GET", null, token);
                if (treeRes.ok && treeRes.data && Array.isArray(treeRes.data.tree)) {
                    const fileEntry = treeRes.data.tree.find(e => e.path === filePath);
                    if (fileEntry && fileEntry.sha) {
                        const blobRes = await githubRequest(`git/blobs/${fileEntry.sha}`, "GET", null, token);
                        if (blobRes.ok && blobRes.data && blobRes.data.content) {
                            const cleanBase64 = blobRes.data.content.replace(/\n/g, "");
                            const decoded = decodeBase64Utf8(cleanBase64);
                            return {
                                sha: fileEntry.sha,
                                commitSha: headCommitSha,
                                treeSha: treeSha,
                                content: decoded
                            };
                        }
                    }
                }
            }
        }
    } catch (gitErr) {
        console.warn("Direct Git Data API tree lookup failed, falling back to contents API:", gitErr);
    }

    // 2. Fallback: Standard contents/ endpoint with cache-busting query
    const res = await githubRequest(`contents/${filePath}?ref=${branch}`, "GET", null, token);
    if (!res.ok || !res.data) return null;

    const base64 = res.data.content.replace(/\n/g, "");
    const decoded = decodeBase64Utf8(base64);
    return {
        sha: res.data.sha,
        content: decoded
    };
}

// Built-in Canadian French (OQLF standard) & Mexican Spanish Culinary Translation Fallback
function translateRecipeCulinary(recipe) {
    if (!recipe) return recipe;
    const clone = { ...recipe };

    const terms = [
        { en: /\bwith Roasted Garlic Olive Oil\b/gi, fr: "à l'huile d'olive à l'ail rôti", es: "con aceite de oliva con ajo asado" },
        { en: /\bwith Spicy Garlic Olive Oil\b/gi, fr: "à l'huile d'olive à l'ail piquant", es: "con aceite de oliva con ajo picante" },
        { en: /\bwith Lemon Pepper Olive Oil\b/gi, fr: "à l'huile d'olive citron et poivre", es: "con aceite de oliva con limón y pimienta" },
        { en: /\bCrispy Roasted Whole Chicken\b/gi, fr: "Poulet entier rôti croustillant", es: "Pollo entero asado crujiente" },
        { en: /\bWhole Chicken\b/gi, fr: "Poulet entier", es: "Pollo entero" },
        { en: /\bRoasted Garlic Olive Oil\b/gi, fr: "Huile d'olive à l'ail rôti", es: "Aceite de oliva con ajo asado" },
        { en: /\bSpicy Garlic Olive Oil\b/gi, fr: "Huile d'olive à l'ail piquant", es: "Aceite de oliva con ajo picante" },
        { en: /\bLemon Pepper Olive Oil\b/gi, fr: "Huile d'olive citron et poivre", es: "Aceite de oliva limón y pimienta" },
        { en: /\bBalsamic Garlic & Herb Olive Oil\b/gi, fr: "Huile d'olive balsamique ail et herbes", es: "Aceite de oliva balsámico ajo y hierbas" },
        { en: /\bExtra Virgin Olive Oil\b/gi, fr: "Huile d'olive extra vierge", es: "Aceite de oliva extra virgen" },
        { en: /\bOlive Oil\b/gi, fr: "Huile d'olive", es: "Aceite de oliva" },
        { en: /\bFennel and Rosemary Crusted Pork Loin\b/gi, fr: "Longe de porc en croûte de fenouil et romarin", es: "Lomo de cerdo en costra de hinojo y romero" },
        { en: /\bPork Loin\b/gi, fr: "Longe de porc", es: "Lomo de cerdo" },
        { en: /\bPan-Seared Salmon\b/gi, fr: "Saumon poêlé", es: "Salmón sellado a la sartén" },
        { en: /\bSalmon\b/gi, fr: "Saumon", es: "Salmón" },
        { en: /\bLemon Black Pepper Honey Glaze\b/gi, fr: "Glaçage au miel, citron et poivre noir", es: "Glaseado de miel con limón y pimienta negra" },
        { en: /\bHoney Glaze\b/gi, fr: "Glaçage au miel", es: "Glaseado de miel" },
        { en: /\bProsciutto Arugula Pizza\b/gi, fr: "Pizza au prosciutto et roquette", es: "Pizza de prosciutto y rúcula" },
        { en: /\bSpicy Italian Sausage Pizza\b/gi, fr: "Pizza à la saucisse italienne piquante", es: "Pizza de salchicha italiana picante" },
        { en: /\bItalian Sausage\b/gi, fr: "Saucisse italienne", es: "Salchicha italiana" },
        { en: /\bQuick Garden Herb Ranch Dip\b/gi, fr: "Trempette ranch rapide aux fines herbes du jardin", es: "Dip Ranch Rápido con Hierbas del Huerto" },
        { en: /\bRanch Dip\b/gi, fr: "Trempette ranch", es: "Dip Ranch" },
        { en: /\bMediterranean Tomato Marinade\b/gi, fr: "Marinade méditerranéenne aux tomates", es: "Marinado mediterráneo de tomate" },
        { en: /\bFresh Bocconcini\b/gi, fr: "Bocconcini frais", es: "Bocconcini frescos" },
        { en: /\bFig & Herb Balsamic Vinaigrette\b/gi, fr: "Vinaigrette balsamique aux figues et herbes", es: "Vinagreta balsámica de higo y hierbas" },
        { en: /\bTableside Dressing\b/gi, fr: "Vinaigrette minute pour la table", es: "Aderezo de mesa clásico" },
        { en: /\bSimple Balsamic Garlic & Herb Tableside Dressing\b/gi, fr: "Vinaigrette minute au balsamique, ail et fines herbes", es: "Aderezo de mesa clásico de vinagreta balsámica, ajo y hierbas finas" },
        { en: /\bGrilled White Fish\b/gi, fr: "Poisson blanc grillé", es: "Pescado blanco a la parrilla" },
        { en: /\bTriple Chili Honey Glazed Skewers\b/gi, fr: "Brochettes glacées au miel et trois piments", es: "Brochetas glaseadas con miel y tres chiles" },
        { en: /\bTriple Pepper Crusted New York Strip Steak\b/gi, fr: "Contre-filet New York en croûte de trois poivres", es: "Bistec New York Strip en costra de tres pimientas" }
    ];

    let t_fr = clone.title || "";
    let t_es = clone.title || "";
    terms.forEach(t => {
        t_fr = t_fr.replace(t.en, t.fr);
        t_es = t_es.replace(t.en, t.es);
    });

    if (!clone.title_fr) clone.title_fr = t_fr;
    if (!clone.title_es) clone.title_es = t_es;
    if (!clone.description_fr) clone.description_fr = clone.description || "";
    if (!clone.description_es) clone.description_es = clone.description || "";
    if (!clone.ingredients_fr) clone.ingredients_fr = clone.ingredients || [];
    if (!clone.ingredients_es) clone.ingredients_es = clone.ingredients || [];
    if (!clone.instructions_fr) clone.instructions_fr = clone.instructions || [];
    if (!clone.instructions_es) clone.instructions_es = clone.instructions || [];

    return clone;
}

// AI-powered culinary translation using Gemini 2.5 Flash
async function autoTranslateRecipe(recipe, geminiKey) {
    if (!geminiKey) return translateRecipeCulinary(recipe);

    const prompt = `You are an executive bilingual food translator and culinary copywriter for Turpone Foods in North America.
Translate the following recipe fields into authentic culinary Canadian French (Français canadien / OQLF standards) and Mexican Spanish (Español de México).
- For French Canadian: Use natural Canadian culinary terminology (e.g. "c. à soupe", "c. à thé", "tasse", "essuie-tout", "sauce soya", "Trempette", "filet de miel", "contre-filet", "Mélange à levée rapide").
- For Mexican Spanish: Use natural Mexican cooking terminology (e.g. "cdas." for cucharadas, "cdtas." for cucharaditas, "taza", "toallas de papel", "salsa de soya", "chiles", "Dip", "sartén de hierro fundido", "bistec", "camarones", "leudado rápido").

Recipe details to translate:
Title: "${recipe.title || ""}"
Description: "${recipe.description || ""}"
Ingredients: ${JSON.stringify(recipe.ingredients || [])}
Instructions: ${JSON.stringify(recipe.instructions || [])}

Respond ONLY with valid, raw JSON (no markdown formatting, no code fences):
{
  "title_fr": "...",
  "title_es": "...",
  "description_fr": "...",
  "description_es": "...",
  "ingredients_fr": ["...", "..."],
  "ingredients_es": ["...", "..."],
  "instructions_fr": ["...", "..."],
  "instructions_es": ["...", "..."]
}`;

    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 2500 }
            })
        });

        if (resp.ok) {
            const result = await resp.json();
            let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
            const translations = JSON.parse(text);
            return {
                ...recipe,
                title_fr: translations.title_fr || recipe.title_fr || recipe.title,
                title_es: translations.title_es || recipe.title_es || recipe.title,
                description_fr: translations.description_fr || recipe.description_fr || recipe.description,
                description_es: translations.description_es || recipe.description_es || recipe.description,
                ingredients_fr: Array.isArray(translations.ingredients_fr) && translations.ingredients_fr.length ? translations.ingredients_fr : (recipe.ingredients_fr || recipe.ingredients),
                ingredients_es: Array.isArray(translations.ingredients_es) && translations.ingredients_es.length ? translations.ingredients_es : (recipe.ingredients_es || recipe.ingredients),
                instructions_fr: Array.isArray(translations.instructions_fr) && translations.instructions_fr.length ? translations.instructions_fr : (recipe.instructions_fr || recipe.instructions),
                instructions_es: Array.isArray(translations.instructions_es) && translations.instructions_es.length ? translations.instructions_es : (recipe.instructions_es || recipe.instructions)
            };
        }
    } catch (e) {
        console.warn("Gemini API call failed, falling back to built-in culinary translator:", e);
    }

    return translateRecipeCulinary(recipe);
}

// Parse recipesData array from javascript text
function parseRecipesData(jsCode) {
    const marker = "const recipesData =";
    const idx = jsCode.indexOf(marker);
    if (idx === -1) return [];

    let arrayStr = jsCode.substring(idx + marker.length).trim();
    if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
    try {
        return JSON.parse(arrayStr);
    } catch (e) {
        const fn = new Function(jsCode + "; return recipesData;");
        return fn();
    }
}

// Serialize recipes back to clean recipes/data.js format
function serializeRecipesData(recipes) {
    return `const recipesData = ${JSON.stringify(recipes, null, 2)};\n\nif (typeof window !== 'undefined') window.recipesData = recipesData;\nif (typeof globalThis !== 'undefined') globalThis.recipesData = recipesData;\nif (typeof module !== 'undefined' && module.exports) module.exports = recipesData;\n`;
}

// Main handler
export async function onRequest(context) {
    const { request, env } = context;
    const token = env.GITHUB_TOKEN;
    const geminiKey = env.GEMINI_API_KEY || "AQ.Ab8RN6JIKnLiwIi9Mjh_N2XMweKksD2Is3McnIQsFTLy5VuCBA";

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET: Fetch live recipes from repository with 0-cache guarantee
        if (request.method === "GET") {
            const fileData = await getFileContent(RECIPES_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Failed to load recipes from GitHub" }), {
                    status: 500,
                    headers: corsHeaders
                });
            }
            const recipes = parseRecipesData(fileData.content);
            return new Response(JSON.stringify({ success: true, count: recipes.length, recipes }), {
                headers: corsHeaders
            });
        }

        // POST: Add or Update a recipe
        if (request.method === "POST") {
            const body = await request.json();
            let recipe = body.recipe;

            if (!recipe || !recipe.title) {
                return new Response(JSON.stringify({ error: "Recipe title is required." }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            // 1. Fetch current recipes file from GitHub with 0-cache Git Data API
            const fileData = await getFileContent(RECIPES_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Unable to reach repository recipes catalog file." }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            let recipes = parseRecipesData(fileData.content);

            // 2. Auto-translate into authentic French & Spanish
            recipe = await autoTranslateRecipe(recipe, geminiKey);

            // 3. Process base64 Image upload if provided
            const slug = (recipe.slug || recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
            recipe.slug = slug;
            recipe.id = slug;
            recipe.updated_at = Date.now();

            const treeEntries = [];

            // Helper to upload image blob and add to tree
            async function addImageBlobToTree(fileName, base64) {
                const blobRes = await githubRequest("git/blobs", "POST", {
                    content: base64,
                    encoding: "base64"
                }, token);

                if (blobRes.ok && blobRes.data && blobRes.data.sha) {
                    treeEntries.push({
                        path: `${RECIPES_IMAGES_DIR}/${fileName}`,
                        mode: "100644",
                        type: "blob",
                        sha: blobRes.data.sha
                    });
                    treeEntries.push({
                        path: `${DIST_RECIPES_IMAGES_DIR}/${fileName}`,
                        mode: "100644",
                        type: "blob",
                        sha: blobRes.data.sha
                    });
                }
            }

            if (recipe.image && recipe.image.startsWith("data:image/")) {
                const match = recipe.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}-${Date.now()}.${ext}`;
                    await addImageBlobToTree(imageFileName, match[2]);
                    recipe.image = `/assets/images/recipes/${imageFileName}`;
                }
            }

            if (recipe.upsellImage && recipe.upsellImage.startsWith("data:image/")) {
                const match = recipe.upsellImage.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const upsellFileName = `${slug}-recommended-${Date.now()}.${ext}`;
                    await addImageBlobToTree(upsellFileName, match[2]);
                    recipe.upsellImage = `/assets/images/recipes/${upsellFileName}`;
                }
            }

            // 4. Update or Insert recipe into recipes array, preserving translations
            const existingIndex = recipes.findIndex(r => 
                String(r.id || r.slug).toLowerCase() === slug.toLowerCase()
            );

            let updatedRecipe = null;
            if (existingIndex >= 0) {
                const prev = recipes[existingIndex];
                if (!recipe.title_fr && prev.title_fr) recipe.title_fr = prev.title_fr;
                if (!recipe.title_es && prev.title_es) recipe.title_es = prev.title_es;
                if (!recipe.description_fr && prev.description_fr) recipe.description_fr = prev.description_fr;
                if (!recipe.description_es && prev.description_es) recipe.description_es = prev.description_es;
                if ((!recipe.ingredients_fr || !recipe.ingredients_fr.length) && prev.ingredients_fr) recipe.ingredients_fr = prev.ingredients_fr;
                if ((!recipe.ingredients_es || !recipe.ingredients_es.length) && prev.ingredients_es) recipe.ingredients_es = prev.ingredients_es;
                if ((!recipe.instructions_fr || !recipe.instructions_fr.length) && prev.instructions_fr) recipe.instructions_fr = prev.instructions_fr;
                if ((!recipe.instructions_es || !recipe.instructions_es.length) && prev.instructions_es) recipe.instructions_es = prev.instructions_es;

                recipes[existingIndex] = { ...prev, ...recipe };
                updatedRecipe = recipes[existingIndex];
            } else {
                recipes.unshift(recipe);
                updatedRecipe = recipes[0];
            }

            // 5. Serialize and create Git Blobs
            const updatedJsContent = serializeRecipesData(recipes);
            const dataBlobRes = await githubRequest("git/blobs", "POST", {
                content: encodeBase64Utf8(updatedJsContent),
                encoding: "base64"
            }, token);

            if (!dataBlobRes.ok || !dataBlobRes.data || !dataBlobRes.data.sha) {
                throw new Error("Failed to create blob for updated recipes data.");
            }

            treeEntries.push({
                path: RECIPES_DATA_PATH,
                mode: "100644",
                type: "blob",
                sha: dataBlobRes.data.sha
            });
            treeEntries.push({
                path: DIST_RECIPES_DATA_PATH,
                mode: "100644",
                type: "blob",
                sha: dataBlobRes.data.sha
            });

            // 6. Execute Atomic Commit (1 Tree, 1 Commit, updates main & production)
            const refRes = await githubRequest("git/ref/heads/main", "GET", null, token);
            if (!refRes.ok || !refRes.data) {
                throw new Error("Unable to fetch head commit on main branch.");
            }
            const baseCommitSha = refRes.data.object.sha;

            const baseCommitRes = await githubRequest(`git/commits/${baseCommitSha}`, "GET", null, token);
            const baseTreeSha = baseCommitRes.data.tree.sha;

            const newTreeRes = await githubRequest("git/trees", "POST", {
                base_tree: baseTreeSha,
                tree: treeEntries
            }, token);

            if (!newTreeRes.ok || !newTreeRes.data) {
                throw new Error("Failed to create Git tree for recipe update.");
            }
            const newTreeSha = newTreeRes.data.sha;

            const newCommitRes = await githubRequest("git/commits", "POST", {
                message: `Recipe update: ${recipe.title} (atomic production sync)`,
                tree: newTreeSha,
                parents: [baseCommitSha]
            }, token);

            if (!newCommitRes.ok || !newCommitRes.data) {
                throw new Error("Failed to create Git commit for recipe update.");
            }
            const newCommitSha = newCommitRes.data.sha;

            // Update main branch
            await githubRequest("git/refs/heads/main", "PATCH", {
                sha: newCommitSha,
                force: false
            }, token);

            // Update production branch strictly for instant Cloudflare production deployments
            await githubRequest("git/refs/heads/production", "PATCH", {
                sha: newCommitSha,
                force: true
            }, token).catch(e => console.warn("Failed to sync production branch ref:", e));

            return new Response(JSON.stringify({
                success: true,
                message: `Recipe "${recipe.title}" saved, translated, and deployed to Production!`,
                recipe: updatedRecipe
            }), { headers: corsHeaders });
        }

        // DELETE: Remove recipe from catalog
        if (request.method === "DELETE") {
            const url = new URL(request.url);
            const id = (url.searchParams.get("id") || "").trim().toLowerCase();
            if (!id) {
                return new Response(JSON.stringify({ error: "Recipe ID (slug) is required for deletion." }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            const fileData = await getFileContent(RECIPES_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Unable to reach repository recipes catalog file." }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            let recipes = parseRecipesData(fileData.content);
            const initialCount = recipes.length;
            recipes = recipes.filter(r => 
                String(r.id || r.slug).toLowerCase() !== id
            );

            if (recipes.length === initialCount) {
                return new Response(JSON.stringify({ error: "Recipe not found in repository." }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            const updatedJsContent = serializeRecipesData(recipes);
            const dataBlobRes = await githubRequest("git/blobs", "POST", {
                content: encodeBase64Utf8(updatedJsContent),
                encoding: "base64"
            }, token);

            if (!dataBlobRes.ok || !dataBlobRes.data || !dataBlobRes.data.sha) {
                throw new Error("Failed to create blob for deleted recipes data.");
            }

            const treeEntries = [
                { path: RECIPES_DATA_PATH, mode: "100644", type: "blob", sha: dataBlobRes.data.sha },
                { path: DIST_RECIPES_DATA_PATH, mode: "100644", type: "blob", sha: dataBlobRes.data.sha }
            ];

            const refRes = await githubRequest("git/ref/heads/main", "GET", null, token);
            const baseCommitSha = refRes.data.object.sha;
            const baseCommitRes = await githubRequest(`git/commits/${baseCommitSha}`, "GET", null, token);
            const baseTreeSha = baseCommitRes.data.tree.sha;

            const newTreeRes = await githubRequest("git/trees", "POST", {
                base_tree: baseTreeSha,
                tree: treeEntries
            }, token);

            const newCommitRes = await githubRequest("git/commits", "POST", {
                message: `Recipe delete: ${id} (atomic production sync)`,
                tree: newTreeRes.data.sha,
                parents: [baseCommitSha]
            }, token);

            const newCommitSha = newCommitRes.data.sha;

            await githubRequest("git/refs/heads/main", "PATCH", {
                sha: newCommitSha,
                force: false
            }, token);

            await githubRequest("git/refs/heads/production", "PATCH", {
                sha: newCommitSha,
                force: true
            }, token).catch(e => console.warn("Failed to sync production branch ref:", e));

            return new Response(JSON.stringify({
                success: true,
                message: `Recipe "${id}" deleted from Production!`
            }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: corsHeaders
        });
    } catch (err) {
        console.error("Recipe API error:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
