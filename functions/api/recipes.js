/**
 * Cloudflare Pages Function: /api/recipes
 * Full Automated Recipes Sync & Multilingual Translation Engine
 * 
 * Supports:
 * - GET: Fetch full live recipes list from recipes/data.js
 * - POST: Add/Update recipe, auto-translate (FR & ES), upload images to repo & dist, commit to GitHub & Production
 * - DELETE: Remove recipe from recipes/data.js, commit & deploy to Production
 */

const REPO_OWNER = "graphicsturpone-rgb";
const REPO_NAME = "turpone-foods-catalog";
const RECIPES_DATA_PATH = "recipes/data.js";
const DIST_RECIPES_DATA_PATH = "dist/recipes/data.js";
const RECIPES_IMAGES_DIR = "assets/images/recipes";
const DIST_RECIPES_IMAGES_DIR = "dist/assets/images/recipes";

// Helper for GitHub REST API calls
async function githubRequest(path, method = "GET", body = null, token) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`;
    const headers = {
        "User-Agent": "Turpone-Recipe-Sync-Engine",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    };

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

// Fetch file contents from GitHub
async function getFileContent(filePath, branch = "main", token) {
    const res = await githubRequest(`contents/${filePath}?ref=${branch}`, "GET", null, token);
    if (!res.ok || !res.data) return null;

    const base64 = res.data.content.replace(/\n/g, "");
    const decoded = atob(base64);
    return {
        sha: res.data.sha,
        content: decoded
    };
}

// Commit a file update or creation to GitHub
async function putFileContent(filePath, contentBase64, message, sha = null, branch = "main", token) {
    const payload = {
        message,
        content: contentBase64,
        branch
    };
    if (sha) payload.sha = sha;

    return await githubRequest(`contents/${filePath}`, "PUT", payload, token);
}

// Auto-translate recipe metadata and steps via Gemini API
async function autoTranslateRecipe(recipe, geminiKey) {
    if (!geminiKey) return recipe;

    const prompt = `You are a Michelin-star bilingual food translator and culinary copywriter for Turpone Foods.
Translate the following recipe fields into authentic culinary French and Spanish.
Never use literal word-for-word translation; use natural cooking & gastronomy terminology.

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
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const translations = JSON.parse(text);
            return {
                ...recipe,
                title_fr: translations.title_fr || recipe.title,
                title_es: translations.title_es || recipe.title,
                description_fr: translations.description_fr || recipe.description,
                description_es: translations.description_es || recipe.description,
                ingredients_fr: Array.isArray(translations.ingredients_fr) && translations.ingredients_fr.length ? translations.ingredients_fr : recipe.ingredients,
                ingredients_es: Array.isArray(translations.ingredients_es) && translations.ingredients_es.length ? translations.ingredients_es : recipe.ingredients,
                instructions_fr: Array.isArray(translations.instructions_fr) && translations.instructions_fr.length ? translations.instructions_fr : recipe.instructions,
                instructions_es: Array.isArray(translations.instructions_es) && translations.instructions_es.length ? translations.instructions_es : recipe.instructions
            };
        }
    } catch (e) {
        console.error("Recipe auto-translation error:", e);
    }
    return recipe;
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
    return `const recipesData = ${JSON.stringify(recipes, null, 2)};\n`;
}

// Convert string to base64 safely in Cloudflare Workers UTF-8 environment
function toBase64Utf8(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Main handler
export async function onRequest(context) {
    const { request, env } = context;
    const token = env.GITHUB_TOKEN;
    const geminiKey = env.GEMINI_API_KEY;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET: Fetch live recipes from repository
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

            // 1. Fetch current recipes file from GitHub
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

            // Image saver: saves to both assets/images/recipes AND dist/assets/images/recipes
            async function saveRecipeImageFile(fileName, base64) {
                const rootPath = `${RECIPES_IMAGES_DIR}/${fileName}`;
                const distPath = `${DIST_RECIPES_IMAGES_DIR}/${fileName}`;

                const existingRoot = await getFileContent(rootPath, "main", token);
                await putFileContent(
                    rootPath,
                    base64,
                    `Upload recipe image ${fileName} to ${RECIPES_IMAGES_DIR}`,
                    existingRoot ? existingRoot.sha : null,
                    "main",
                    token
                );

                const existingDist = await getFileContent(distPath, "main", token);
                await putFileContent(
                    distPath,
                    base64,
                    `Upload recipe image ${fileName} to ${DIST_RECIPES_IMAGES_DIR}`,
                    existingDist ? existingDist.sha : null,
                    "main",
                    token
                );
            }

            if (recipe.image && recipe.image.startsWith("data:image/")) {
                const match = recipe.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}.${ext}`;
                    const imgBase64 = match[2];

                    await saveRecipeImageFile(imageFileName, imgBase64);
                    recipe.image = `/assets/images/recipes/${imageFileName}`;
                }
            }

            if (recipe.upsellImage && recipe.upsellImage.startsWith("data:image/")) {
                const match = recipe.upsellImage.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const upsellFileName = `${slug}-recommended.${ext}`;
                    const imgBase64 = match[2];

                    await saveRecipeImageFile(upsellFileName, imgBase64);
                    recipe.upsellImage = `/assets/images/recipes/${upsellFileName}`;
                }
            }

            // 4. Update or Insert recipe into recipes array
            const existingIndex = recipes.findIndex(r => 
                r.id === recipe.id || r.slug === recipe.slug
            );

            if (existingIndex >= 0) {
                recipes[existingIndex] = { ...recipes[existingIndex], ...recipe };
            } else {
                recipes.push(recipe);
            }

            // 5. Serialize and Commit updated recipes/data.js (main and dist on main branch)
            const updatedJsContent = serializeRecipesData(recipes);
            const updatedBase64 = toBase64Utf8(updatedJsContent);

            await putFileContent(
                RECIPES_DATA_PATH,
                updatedBase64,
                `Recipe update: ${recipe.title} [auto-sync]`,
                fileData.sha,
                "main",
                token
            );

            const distFileData = await getFileContent(DIST_RECIPES_DATA_PATH, "main", token);
            await putFileContent(
                DIST_RECIPES_DATA_PATH,
                updatedBase64,
                `Recipe update: ${recipe.title} (dist) [auto-sync]`,
                distFileData ? distFileData.sha : null,
                "main",
                token
            );

            return new Response(JSON.stringify({
                success: true,
                message: `Recipe "${recipe.title}" saved, translated, and committed directly to GitHub & Production!`,
                recipe
            }), { headers: corsHeaders });
        }

        // DELETE: Remove recipe from catalog
        if (request.method === "DELETE") {
            const url = new URL(request.url);
            const id = url.searchParams.get("id");
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
            const beforeCount = recipes.length;
            recipes = recipes.filter(r => String(r.id) !== String(id) && String(r.slug) !== String(id));

            if (recipes.length === beforeCount) {
                return new Response(JSON.stringify({ error: `Recipe "${id}" not found in catalog.` }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            const updatedJsContent = serializeRecipesData(recipes);
            const updatedBase64 = toBase64Utf8(updatedJsContent);

            await putFileContent(
                RECIPES_DATA_PATH,
                updatedBase64,
                `Remove recipe: ${id} [auto-sync]`,
                fileData.sha,
                "main",
                token
            );

            const distFileData = await getFileContent(DIST_RECIPES_DATA_PATH, "main", token);
            await putFileContent(
                DIST_RECIPES_DATA_PATH,
                updatedBase64,
                `Remove recipe: ${id} (dist) [auto-sync]`,
                distFileData ? distFileData.sha : null,
                "main",
                token
            );

            return new Response(JSON.stringify({
                success: true,
                message: `Recipe "${id}" successfully removed from catalog!`
            }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: corsHeaders
        });
    } catch (err) {
        console.error("API /api/recipes error:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
