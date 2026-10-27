/**
 * Cloudflare Pages Function: /api/recipes
 * Full Automated Recipes Sync, Atomic Git Production Deployments & Multilingual Translation Engine
 * 
 * Supports:
 * - GET: Fetch full live recipes list from recipes/data.js with cache-busting
 * - POST: Add/Update recipe, auto-translate (FR & ES), upload images, atomic commit to main & production
 * - DELETE: Remove recipe from recipes/data.js, atomic commit to main & production
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

// Fetch file contents from GitHub
async function getFileContent(filePath, branch = "main", token) {
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
        { en: /\bQuick Garden Herb Ranch Dip\b/gi, fr: "Trempette ranch rapide aux herbes du jardin", es: "Dip ranch rápido con hierbas del huerto" },
        { en: /\bRanch Dip\b/gi, fr: "Trempette ranch", es: "Dip estilo ranch" },
        { en: /\bFig & Herb Balsamic Vinaigrette\b/gi, fr: "Vinaigrette balsamique aux figues et herbes", es: "Vinagreta balsámica de higos y hierbas" },
        { en: /\bFig Herb Balsamic Vinaigrette\b/gi, fr: "Vinaigrette balsamique aux figues et herbes", es: "Vinagreta balsámica de higos y hierbas" },
        { en: /\bGrilled White Fish\b/gi, fr: "Poisson blanc grillé", es: "Pescado blanco a la parrilla" },
        { en: /\bWhite Fish\b/gi, fr: "Poisson blanc", es: "Pescado blanco" },
        { en: /\bMediterranean Tomato Marinade\b/gi, fr: "Marinade méditerranéenne aux tomates", es: "Marinado mediterráneo de jitomates" },
        { en: /\bFresh Bocconcini\b/gi, fr: "Bocconcini frais", es: "Bocconcini frescos" },
        { en: /\bSpicy Garlic Grilled Shrimp Skewers\b/gi, fr: "Brochettes de crevettes grillées à l'ail piquant", es: "Brochetas de camarones a la parrilla con ajo picante" },
        { en: /\bShrimp Skewers\b/gi, fr: "Brochettes de crevettes", es: "Brochetas de camarones" },
        { en: /\bTriple Chili Honey Glazed Skewers\b/gi, fr: "Brochettes glacées au miel aux trois piments", es: "Brochetas glaseadas con miel de tres chiles" },
        { en: /\bTriple Pepper Crusted New York Strip Steak\b/gi, fr: "Contre-filet New York en croûte de trois poivres", es: "Corte New York en costra de tres pimientas" },
        { en: /\bStrip Steak\b/gi, fr: "Contre-filet", es: "Bistec New York" },
        { en: /\bQuick Rising Dough Mix\b/gi, fr: "Mélange à levée rapide", es: "Mezcla de masa de leudado rápido" },
        { en: /\bPizza Dough Balls\b/gi, fr: "Boules de pâte à pizza", es: "Bolas de masa para pizza" },
        { en: /\bPizza Sauce\b/gi, fr: "Sauce à pizza", es: "Salsa para pizza" },
        { en: /\bwith\b/gi, fr: "avec", es: "con" },
        { en: /\band\b/gi, fr: "et", es: "y" },
        { en: /\bfor\b/gi, fr: "pour", es: "para" }
    ];

    const ingTerms = [
        { en: /\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:tablespoons?|tbsp\.?)\b/gi, fr: "$1 c. à soupe", es: "$1 cdas." },
        { en: /\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:teaspoons?|tsp\.?)\b/gi, fr: "$1 c. à thé", es: "$1 cdtas." },
        { en: /\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*cups?\b/gi, fr: "$1 tasse(s)", es: "$1 taza(s)" },
        { en: /\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/gi, fr: "$1 lb", es: "$1 lb" },
        { en: /\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:oz|ounces?)\b/gi, fr: "$1 oz", es: "$1 oz" },
        { en: /\b(\d+)\s*garlic cloves?,?\s*crushed\b/gi, fr: "$1 gousses d'ail, écrasées", es: "$1 dientes de ajo, machacados" },
        { en: /\b(\d+)\s*garlic cloves?,?\s*minced\b/gi, fr: "$1 gousses d'ail, émincées", es: "$1 dientes de ajo, picados" },
        { en: /\bgarlic cloves?\b/gi, fr: "gousses d'ail", es: "dientes de ajo" },
        { en: /\bwhole roasting chicken\b/gi, fr: "poulet entier à rôtir", es: "pollo entero para asar" },
        { en: /\bkosher salt\b/gi, fr: "sel casher", es: "sal kosher" },
        { en: /\bsea salt\b/gi, fr: "sel de mer", es: "sal marina" },
        { en: /\bfreshly ground black pepper\b/gi, fr: "poivre noir fraîchement moulu", es: "pimienta negra recién molida" },
        { en: /\bblack pepper\b/gi, fr: "poivre noir", es: "pimienta negra" },
        { en: /\bfresh mozzarella\b/gi, fr: "mozzarella fraîche", es: "mozzarella fresca" },
        { en: /\bfresh basil leaves\b/gi, fr: "feuilles de basilic frais", es: "hojas de albahaca fresca" },
        { en: /\bfresh arugula\b/gi, fr: "roquette fraîche", es: "rúcula fresca" },
        { en: /\bprosciutto di parma\b/gi, fr: "prosciutto di Parma", es: "prosciutto di Parma" },
        { en: /\bparmesan cheese\b/gi, fr: "parmesan râpé", es: "queso parmesano" },
        { en: /\blemon juice\b/gi, fr: "jus de citron frais", es: "jugo de limón fresco" },
        { en: /\bbalsamic vinegar\b/gi, fr: "vinaigre balsamique", es: "vinagre balsámico" },
        { en: /\bsour cream\b/gi, fr: "crème sûre", es: "crema ácida" },
        { en: /\bmayonnaise\b/gi, fr: "mayonnaise", es: "mayonesa" },
        { en: /\bsoy sauce\b/gi, fr: "sauce soya", es: "salsa de soya" },
        { en: /\bdijon mustard\b/gi, fr: "moutarde de Dijon", es: "mostaza Dijon" },
        { en: /\bto taste\b/gi, fr: "au goût", es: "al gusto" },
        { en: /\bapprox\.\b/gi, fr: "environ", es: "aprox." }
    ];

    const instPrefixes = [
        { en: /^\*\*Preheat Oven:\*\*/i, fr: "**Préchauffer le four :**", es: "**Precalentar el horno:**" },
        { en: /^\*\*Preheat:\*\*/i, fr: "**Préchauffer :**", es: "**Precalentar:**" },
        { en: /^\*\*Season:\*\*/i, fr: "**Assaisonner :**", es: "**Sazonar:**" },
        { en: /^\*\*Marinate:\*\*/i, fr: "**Mariner :**", es: "**Marinar:**" },
        { en: /^\*\*Roast:\*\*/i, fr: "**Rôtir :**", es: "**Asar :**" },
        { en: /^\*\*Bake:\*\*/i, fr: "**Cuire au four :**", es: "**Hornear :**" },
        { en: /^\*\*Sear:\*\*/i, fr: "**Saisir :**", es: "**Sellar :**" },
        { en: /^\*\*Grill:\*\*/i, fr: "**Griller :**", es: "**Asar a la parrilla :**" },
        { en: /^\*\*Toss:\*\*/i, fr: "**Mélanger :**", es: "**Mezclar :**" },
        { en: /^\*\*Combine:\*\*/i, fr: "**Combiner :**", es: "**Combinar :**" },
        { en: /^\*\*Assemble:\*\*/i, fr: "**Assembler :**", es: "**Armar :**" },
        { en: /^\*\*Rest & Serve:\*\*/i, fr: "**Reposer et servir :**", es: "**Reposar y servir :**" },
        { en: /^\*\*Serve:\*\*/i, fr: "**Servir :**", es: "**Servir :**" }
    ];

    function applyDict(txt, lang) {
        if (!txt) return "";
        let res = txt;
        for (const t of terms) res = res.replace(t.en, t[lang]);
        return res;
    }

    function applyIng(txt, lang) {
        if (!txt) return "";
        let res = txt;
        for (const t of ingTerms) res = res.replace(t.en, t[lang]);
        for (const t of terms) res = res.replace(t.en, t[lang]);
        return res;
    }

    function applyInst(txt, lang) {
        if (!txt) return "";
        let res = txt;
        for (const p of instPrefixes) res = res.replace(p.en, p[lang]);
        for (const t of terms) res = res.replace(t.en, t[lang]);
        for (const t of ingTerms) res = res.replace(t.en, t[lang]);
        if (lang === 'fr') {
            res = res.replace(/\bPreheat oven to\b/gi, "Préchauffer le four à")
                     .replace(/\bminutes until golden brown\b/gi, "minutes jusqu'à coloration dorée")
                     .replace(/\bLet rest for\b/gi, "Laisser reposer pendant")
                     .replace(/\bbefore carving and serving\b/gi, "avant de découper et de servir");
        } else {
            res = res.replace(/\bPreheat oven to\b/gi, "Precalentar el horno a")
                     .replace(/\bminutes until golden brown\b/gi, "minutos hasta que esté dorado")
                     .replace(/\bLet rest for\b/gi, "Dejar reposar durante")
                     .replace(/\bbefore carving and serving\b/gi, "antes de rebanar y servir");
        }
        return res;
    }

    if (!clone.title_fr) clone.title_fr = applyDict(clone.title, 'fr');
    if (!clone.title_es) clone.title_es = applyDict(clone.title, 'es');

    if (!clone.description_fr) clone.description_fr = applyDict(clone.description, 'fr');
    if (!clone.description_es) clone.description_es = applyDict(clone.description, 'es');

    if (Array.isArray(clone.ingredients)) {
        if (!Array.isArray(clone.ingredients_fr) || clone.ingredients_fr.length === 0) {
            clone.ingredients_fr = clone.ingredients.map(i => applyIng(i, 'fr'));
        }
        if (!Array.isArray(clone.ingredients_es) || clone.ingredients_es.length === 0) {
            clone.ingredients_es = clone.ingredients.map(i => applyIng(i, 'es'));
        }
    }

    if (Array.isArray(clone.instructions)) {
        if (!Array.isArray(clone.instructions_fr) || clone.instructions_fr.length === 0) {
            clone.instructions_fr = clone.instructions.map(i => applyInst(i, 'fr'));
        }
        if (!Array.isArray(clone.instructions_es) || clone.instructions_es.length === 0) {
            clone.instructions_es = clone.instructions.map(i => applyInst(i, 'es'));
        }
    }

    return clone;
}

// Auto-translate recipe metadata via Gemini API if key is provided and functional
async function autoTranslateRecipe(recipe, geminiKey) {
    if (!geminiKey) return translateRecipeCulinary(recipe);

    const prompt = `You are a Michelin-star bilingual food translator and culinary copywriter for Turpone Foods in North America.
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
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
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
    return `const recipesData = ${JSON.stringify(recipes, null, 2)};\n`;
}

// Main handler
export async function onRequest(context) {
    const { request, env } = context;
    const token = env.GITHUB_TOKEN;
    const geminiKey = env.GEMINI_API_KEY || "";

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

            // 4. Update or Insert recipe into recipes array
            const existingIndex = recipes.findIndex(r => 
                String(r.id || r.slug).toLowerCase() === slug.toLowerCase()
            );

            if (existingIndex >= 0) {
                recipes[existingIndex] = { ...recipes[existingIndex], ...recipe };
            } else {
                recipes.unshift(recipe);
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
                recipe
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
            const beforeCount = recipes.length;
            recipes = recipes.filter(r => {
                const rId = String(r.id || '').trim().toLowerCase();
                const rSlug = String(r.slug || '').trim().toLowerCase();
                return rId !== id && rSlug !== id;
            });

            if (recipes.length === beforeCount) {
                return new Response(JSON.stringify({ error: `Recipe "${id}" not found in catalog.` }), {
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
                throw new Error("Failed to create blob for updated recipes data.");
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
            const newTreeSha = newTreeRes.data.sha;

            const newCommitRes = await githubRequest("git/commits", "POST", {
                message: `Remove recipe: ${id} (atomic production sync)`,
                tree: newTreeSha,
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
