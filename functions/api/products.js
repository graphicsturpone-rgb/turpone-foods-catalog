/**
 * Cloudflare Pages Function: /api/products
 * Full Automated Catalog Sync & Multilingual Translation Engine
 * 
 * Supports:
 * - GET: Fetch full live catalog from repository
 * - POST: Add/Update product, auto-translate (FR & ES), upload images to repo, commit & deploy to Production
 * - DELETE: Remove product from catalog, commit & deploy to Production
 */

const REPO_OWNER = "graphicsturpone-rgb";
const REPO_NAME = "turpone-foods-catalog";
const PRODUCTS_DATA_PATH = "products/data.js";
const DIST_PRODUCTS_DATA_PATH = "dist/products/data.js";
const IMAGES_DIR = "assets/images/ca_imgs";
const DIST_IMAGES_DIR = "dist/assets/images/ca_imgs";
const US_IMAGES_DIR = "assets/images/us_imgs";
const DIST_US_IMAGES_DIR = "dist/assets/images/us_imgs";

// Helper for GitHub REST API calls
async function githubRequest(path, method = "GET", body = null, token) {
    const separator = path.includes("?") ? "&" : "?";
    const cacheBuster = method === "GET" ? `${separator}_cb=${Date.now()}` : "";
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}${cacheBuster}`;
    const headers = {
        "User-Agent": "Turpone-Catalog-Sync-Engine",
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

// Fetch file contents from GitHub with 0-cache Git Data API guarantee
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
        console.warn("Git Data API direct fetch error, falling back to contents API:", gitErr);
    }

    // 2. Fallback: Standard GitHub contents API with cache buster
    const res = await githubRequest(`contents/${filePath}?ref=${branch}`, "GET", null, token);
    if (!res.ok || !res.data) return null;

    const base64 = res.data.content.replace(/\n/g, "");
    const decoded = decodeBase64Utf8(base64);
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

// High-fidelity natural multilingual translation via Gemini (Strictly NO GTranslate)
async function autoTranslateProduct(product, geminiKey) {
    if (!geminiKey) return product;

    const prompt = `You are a bilingual culinary translator for Turpone Foods and Martha Stewart in Canada and North America.
Translate the following product fields into authentic Canadian French (Français canadien / OQLF / CFIA standards) and Mexican Spanish (Español de México).
- For French Canadian: Use authentic Canadian terminology (e.g. for Quick Rising Mix use "Mélange à levée rapide"; for pinsa crust use "Croûte de pinsa"; for dough balls use "Boules de pâte à pizza"; for seasonings use "Assaisonnement"; for dip use "Trempette"; use mL for liquid sauce volumes).
- For Mexican Spanish: Use natural Mexican culinary terminology (e.g. use "chile" instead of "pimiento" for spicy peppers; "tocino" instead of "panceta/beicon"; "masa" instead of "pasta/base"; "leudado rápido" for quick rising; "Sazonador" for seasoning; "congelada/congeladas" for frozen; "salsa de soya" instead of "salsa de soja"; use inches notation "10\"" and "12\"" for pizzas).`;

Product details to translate:
Title: "${product.title || ""}"
Category: "${product.category || ""}"
Description: "${product.description || ""}"
Features: "${product.features || ""}"
Ingredients: "${product.ingredients || ""}"

Respond ONLY with valid, raw JSON (no markdown formatting, no code fences):
{
  "title_fr": "...",
  "title_es": "...",
  "category_fr": "...",
  "category_es": "...",
  "description_fr": "...",
  "description_es": "...",
  "features_fr": "...",
  "features_es": "...",
  "ingredients_fr": "...",
  "ingredients_es": "..."
}`;

    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
            })
        });

        if (resp.ok) {
            const result = await resp.json();
            let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const translations = JSON.parse(text);
            return {
                ...product,
                title_fr: translations.title_fr || product.title,
                title_es: translations.title_es || product.title,
                category_fr: translations.category_fr || product.category,
                category_es: translations.category_es || product.category,
                description_fr: translations.description_fr || product.description,
                description_es: translations.description_es || product.description,
                features_fr: translations.features_fr || product.features,
                features_es: translations.features_es || product.features,
                ingredients_fr: translations.ingredients_fr || product.ingredients,
                ingredients_es: translations.ingredients_es || product.ingredients
            };
        }
    } catch (e) {
        console.error("Auto-translation error:", e);
    }
    return product;
}

// Parse productsData array from javascript text
function parseProductsData(jsCode) {
    const marker = "const productsData =";
    const idx = jsCode.indexOf(marker);
    if (idx === -1) return [];

    let arrayStr = jsCode.substring(idx + marker.length).trim();
    if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
    try {
        return JSON.parse(arrayStr);
    } catch (e) {
        // Fallback eval
        const fn = new Function(jsCode + "; return productsData;");
        return fn();
    }
}

// Serialize products back to clean products/data.js format
function serializeProductsData(products) {
    return `const productsData = ${JSON.stringify(products, null, 2)};\n`;
}

// Convert string to base64 safely in Cloudflare Workers UTF-8 environment
function toBase64Utf8(str) {
    return encodeBase64Utf8(str);
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
        "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET: Fetch live products from repository
        if (request.method === "GET") {
            const fileData = await getFileContent(PRODUCTS_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Failed to load products from GitHub" }), {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                        "Pragma": "no-cache"
                    }
                });
            }
            const products = parseProductsData(fileData.content);
            return new Response(JSON.stringify({ success: true, count: products.length, products }), {
                headers: {
                    ...corsHeaders,
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            });
        }

        // POST: Add or Update a product
        if (request.method === "POST") {
            const body = await request.json();
            let product = body.product;

            if (!product || !product.title || !product.category) {
                return new Response(JSON.stringify({ error: "Product title and category are required." }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            // 1. Fetch current catalog file from GitHub (freshly fetched without edge cache)
            const fileData = await getFileContent(PRODUCTS_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Unable to reach repository catalog file." }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            let products = parseProductsData(fileData.content);

            // 2. Auto-translate into authentic French & Spanish
            product = await autoTranslateProduct(product, geminiKey);

            // 3. Collect all files to commit via Atomic Git Tree
            const slug = (product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
            product.slug = slug;

            const treeEntries = [];

            async function createBlobAndAddTree(fileName, base64Data, isUs = false) {
                const targetImagesDir = isUs ? US_IMAGES_DIR : IMAGES_DIR;
                const targetDistDir = isUs ? DIST_US_IMAGES_DIR : DIST_IMAGES_DIR;
                const rootPath = `${targetImagesDir}/${fileName}`;
                const distPath = `${targetDistDir}/${fileName}`;

                const blobRes = await githubRequest("git/blobs", "POST", {
                    content: base64Data,
                    encoding: "base64"
                }, token);

                if (blobRes.ok && blobRes.data && blobRes.data.sha) {
                    const blobSha = blobRes.data.sha;
                    treeEntries.push({
                        path: rootPath,
                        mode: "100644",
                        type: "blob",
                        sha: blobSha
                    });
                    treeEntries.push({
                        path: distPath,
                        mode: "100644",
                        type: "blob",
                        sha: blobSha
                    });
                }
            }

            const saveTimestamp = Date.now();

            // Process Canada Main Image
            if (product.image_ca && product.image_ca.startsWith("data:image/")) {
                const match = product.image_ca.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}-v${saveTimestamp}-ca.${ext}`;
                    await createBlobAndAddTree(imageFileName, match[2], false);
                    product.image_ca = imageFileName;
                }
            } else if (product.image_ca === "") {
                product.image_ca = "";
            }

            // Process US Main Image
            if (product.image_us && product.image_us.startsWith("data:image/")) {
                const match = product.image_us.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}-v${saveTimestamp}-us.${ext}`;
                    await createBlobAndAddTree(imageFileName, match[2], true);
                    product.image_us = imageFileName;
                }
            } else if (product.image_us === "") {
                product.image_us = "";
            }

            // Process Canada Gallery
            if (Array.isArray(product.gallery_ca) && product.gallery_ca.length > 0) {
                const processedGallery = [];
                for (let i = 0; i < product.gallery_ca.length; i++) {
                    const item = product.gallery_ca[i];
                    if (typeof item === "string" && item.startsWith("data:image/")) {
                        const match = item.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                        if (match) {
                            const ext = match[1] === "jpeg" ? "jpg" : match[1];
                            const galFileName = `${slug}-ca-gal-${i + 1}-${saveTimestamp}.${ext}`;
                            await createBlobAndAddTree(galFileName, match[2], false);
                            processedGallery.push(galFileName);
                        } else {
                            processedGallery.push(item);
                        }
                    } else if (typeof item === "string" && item.trim()) {
                        processedGallery.push(item.trim());
                    }
                }
                product.gallery_ca = processedGallery;
            } else if (Array.isArray(product.gallery_ca)) {
                product.gallery_ca = [];
            }

            // Process US Gallery
            if (Array.isArray(product.gallery_us) && product.gallery_us.length > 0) {
                const processedGalleryUs = [];
                for (let i = 0; i < product.gallery_us.length; i++) {
                    const item = product.gallery_us[i];
                    if (typeof item === "string" && item.startsWith("data:image/")) {
                        const match = item.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                        if (match) {
                            const ext = match[1] === "jpeg" ? "jpg" : match[1];
                            const galFileName = `${slug}-us-gal-${i + 1}-${saveTimestamp}.${ext}`;
                            await createBlobAndAddTree(galFileName, match[2], true);
                            processedGalleryUs.push(galFileName);
                        } else {
                            processedGalleryUs.push(item);
                        }
                    } else if (typeof item === "string" && item.trim()) {
                        processedGalleryUs.push(item.trim());
                    }
                }
                product.gallery_us = processedGalleryUs;
            } else if (Array.isArray(product.gallery_us)) {
                product.gallery_us = [];
            }

            // 4. Update or Insert product into catalog array with strict market isolation & anti-rollback
            const prodId = product.id ? String(product.id) : `prod_${Date.now()}`;
            product.id = isNaN(Number(prodId)) ? prodId : Number(prodId);

            const isNewProduct = !product.id || (typeof product.id === "string" && product.id.startsWith("prod_"));
            let existingIndex = -1;

            if (!isNewProduct) {
                existingIndex = products.findIndex(p => 
                    String(p.id) === String(product.id) ||
                    (p.aliasId && String(p.aliasId) === String(product.id))
                );
            }

            // Ensure unique slug
            let baseSlug = (product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
            let candidateSlug = baseSlug;
            let counter = 1;
            while (products.some((p, idx) => idx !== existingIndex && p.slug === candidateSlug)) {
                counter++;
                candidateSlug = `${baseSlug}-${counter}`;
            }
            product.slug = candidateSlug;

            let finalProduct = null;

            if (existingIndex >= 0) {
                const existing = products[existingIndex];
                const updatedProduct = { ...existing, ...product };

                // Intelligently synchronize title translations across languages if title was modified
                if (existing.title && updatedProduct.title && existing.title !== updatedProduct.title) {
                    const oldParen = existing.title.match(/\(([^)]+)\)/);
                    const newParen = updatedProduct.title.match(/\(([^)]+)\)/);
                    if (oldParen && newParen) {
                        const oldSuffix = oldParen[0];
                        const newSuffix = newParen[0];
                        if (updatedProduct.title_fr) updatedProduct.title_fr = updatedProduct.title_fr.replace(oldSuffix, newSuffix);
                        if (updatedProduct.title_es) updatedProduct.title_es = updatedProduct.title_es.replace(oldSuffix, newSuffix);
                    }
                    const oldInch = existing.title.match(/\b(10|12)\s*["”']/);
                    const newInch = updatedProduct.title.match(/\b(10|12)\s*["”']/);
                    if (oldInch && newInch) {
                        if (updatedProduct.title_fr) updatedProduct.title_fr = updatedProduct.title_fr.replace(oldInch[0], newInch[0]);
                        if (updatedProduct.title_es) updatedProduct.title_es = updatedProduct.title_es.replace(oldInch[0], newInch[0]);
                    }
                }

                // Strictly isolate market images and galleries
                const effCa = (product.image_ca !== undefined) ? product.image_ca : (existing.image_ca || "");
                const effUs = (product.image_us !== undefined) ? product.image_us : (existing.image_us || "");
                updatedProduct.image_ca = effCa;
                updatedProduct.image_us = effUs;
                updatedProduct.image = effCa || effUs || "";

                if (Array.isArray(product.gallery_ca)) {
                    updatedProduct.gallery_ca = product.gallery_ca;
                } else if (updatedProduct.gallery_ca === undefined) {
                    updatedProduct.gallery_ca = existing.gallery_ca || [];
                }

                if (Array.isArray(product.gallery_us)) {
                    updatedProduct.gallery_us = product.gallery_us;
                } else if (updatedProduct.gallery_us === undefined) {
                    updatedProduct.gallery_us = existing.gallery_us || [];
                }

                updatedProduct.gallery = (Array.isArray(updatedProduct.gallery_ca) && updatedProduct.gallery_ca.length > 0)
                    ? [...updatedProduct.gallery_ca]
                    : (Array.isArray(updatedProduct.gallery_us) && updatedProduct.gallery_us.length > 0 ? [...updatedProduct.gallery_us] : []);

                updatedProduct.updated_at = saveTimestamp;
                products[existingIndex] = updatedProduct;
                finalProduct = updatedProduct;
            } else {
                if (typeof product.id === "string" && !isNaN(Number(product.id))) {
                    product.id = Number(product.id);
                } else if (typeof product.id === "string" && product.id.startsWith("prod_")) {
                    const nextId = Math.max(...products.filter(p => typeof p.id === "number").map(p => p.id), 30) + 1;
                    product.aliasId = product.id;
                    product.id = nextId;
                }
                product.image = product.image_ca || product.image_us || product.image || "";
                product.gallery = (Array.isArray(product.gallery_ca) && product.gallery_ca.length > 0)
                    ? [...product.gallery_ca]
                    : (Array.isArray(product.gallery_us) && product.gallery_us.length > 0 ? [...product.gallery_us] : []);
                product.updated_at = saveTimestamp;
                products.push(product);
                finalProduct = product;
            }

            // 5. Serialize products/data.js and add to Atomic Git Tree
            const updatedJsContent = serializeProductsData(products);
            const dataBlobRes = await githubRequest("git/blobs", "POST", {
                content: toBase64Utf8(updatedJsContent),
                encoding: "base64"
            }, token);

            if (dataBlobRes.ok && dataBlobRes.data && dataBlobRes.data.sha) {
                treeEntries.push({
                    path: PRODUCTS_DATA_PATH,
                    mode: "100644",
                    type: "blob",
                    sha: dataBlobRes.data.sha
                });
                treeEntries.push({
                    path: DIST_PRODUCTS_DATA_PATH,
                    mode: "100644",
                    type: "blob",
                    sha: dataBlobRes.data.sha
                });
            }

            // 6. Execute Atomic Commit (1 Tree, 1 Commit, 1 Ref update)
            const refRes = await githubRequest("git/ref/heads/main", "GET", null, token);
            if (!refRes.ok || !refRes.data) {
                throw new Error("Unable to fetch head commit on main branch.");
            }
            const baseCommitSha = refRes.data.object.sha;

            const baseCommitRes = await githubRequest(`git/commits/${baseCommitSha}`, "GET", null, token);
            const baseTreeSha = baseCommitRes.data.tree.sha;

            // Deduplicate tree entries by path
            const uniqueTreeEntriesMap = new Map();
            for (const entry of treeEntries) {
                uniqueTreeEntriesMap.set(entry.path, entry);
            }
            const uniqueTreeEntries = Array.from(uniqueTreeEntriesMap.values());

            const newTreeRes = await githubRequest("git/trees", "POST", {
                base_tree: baseTreeSha,
                tree: uniqueTreeEntries
            }, token);

            if (!newTreeRes.ok || !newTreeRes.data) {
                throw new Error("Failed to create Git tree for catalog update.");
            }
            const newTreeSha = newTreeRes.data.sha;

            const newCommitRes = await githubRequest("git/commits", "POST", {
                message: `Catalog update: ${finalProduct.title} (atomic production sync)`,
                tree: newTreeSha,
                parents: [baseCommitSha]
            }, token);

            if (!newCommitRes.ok || !newCommitRes.data) {
                throw new Error("Failed to create Git commit for catalog update.");
            }
            const newCommitSha = newCommitRes.data.sha;

            await githubRequest("git/refs/heads/main", "PATCH", {
                sha: newCommitSha,
                force: false
            }, token);

            // Keep production branch strictly in sync for instant Cloudflare production deployments
            await githubRequest("git/refs/heads/production", "PATCH", {
                sha: newCommitSha,
                force: true
            }, token).catch(e => console.warn("Failed to sync production branch ref:", e));

            return new Response(JSON.stringify({
                success: true,
                message: `Product "${finalProduct.title}" saved, translated, and committed directly to GitHub & Production!`,
                product: finalProduct
            }), {
                headers: {
                    ...corsHeaders,
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            });
        }

        // DELETE: Remove product from catalog
        if (request.method === "DELETE") {
            const url = new URL(request.url);
            const id = url.searchParams.get("id");

            if (!id) {
                return new Response(JSON.stringify({ error: "Product id is required." }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            const fileData = await getFileContent(PRODUCTS_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Unable to reach repository catalog file." }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            let products = parseProductsData(fileData.content);
            const initialLength = products.length;
            products = products.filter(p => String(p.id) !== String(id) && String(p.aliasId) !== String(id));

            if (products.length === initialLength) {
                return new Response(JSON.stringify({ error: "Product not found." }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            const updatedJsContent = serializeProductsData(products);
            const dataBlobRes = await githubRequest("git/blobs", "POST", {
                content: toBase64Utf8(updatedJsContent),
                encoding: "base64"
            }, token);

            const refRes = await githubRequest("git/ref/heads/main", "GET", null, token);
            const baseCommitSha = refRes.data.object.sha;

            const baseCommitRes = await githubRequest(`git/commits/${baseCommitSha}`, "GET", null, token);
            const baseTreeSha = baseCommitRes.data.tree.sha;

            const newTreeRes = await githubRequest("git/trees", "POST", {
                base_tree: baseTreeSha,
                tree: [
                    { path: PRODUCTS_DATA_PATH, mode: "100644", type: "blob", sha: dataBlobRes.data.sha },
                    { path: DIST_PRODUCTS_DATA_PATH, mode: "100644", type: "blob", sha: dataBlobRes.data.sha }
                ]
            }, token);

            const newCommitRes = await githubRequest("git/commits", "POST", {
                message: `Catalog delete: product ID ${id} [atomic sync]`,
                tree: newTreeRes.data.sha,
                parents: [baseCommitSha]
            }, token);

            await githubRequest("git/refs/heads/main", "PATCH", {
                sha: newCommitRes.data.sha,
                force: false
            }, token);

            // Keep production branch strictly in sync for instant Cloudflare production deployments
            await githubRequest("git/refs/heads/production", "PATCH", {
                sha: newCommitRes.data.sha,
                force: true
            }, token).catch(e => console.warn("Failed to sync production branch ref:", e));

            return new Response(JSON.stringify({
                success: true,
                message: `Product ID ${id} deleted and synced with GitHub.`
            }), {
                headers: {
                    ...corsHeaders,
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (err) {
        console.error("API error:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
