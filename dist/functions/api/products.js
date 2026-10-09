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
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`;
    const headers = {
        "User-Agent": "Turpone-Catalog-Sync-Engine",
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

    const prompt = `You are a culinary translator for Turpone Foods and Martha Stewart.
Translate the following product fields into authentic, culinary-grade French and Spanish.
Never use literal word-for-word translation or automated widget translations. Use natural gastronomy terminology (e.g. for pinsa crust use "Croûte de Pinsa" in French and "Masa de Pinsa" in Spanish; for frozen use "surgelée" in French and "congelada" in Spanish).

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
        // GET: Fetch live products from repository
        if (request.method === "GET") {
            const fileData = await getFileContent(PRODUCTS_DATA_PATH, "main", token);
            if (!fileData) {
                return new Response(JSON.stringify({ error: "Failed to load products from GitHub" }), {
                    status: 500,
                    headers: corsHeaders
                });
            }
            const products = parseProductsData(fileData.content);
            return new Response(JSON.stringify({ success: true, count: products.length, products }), {
                headers: corsHeaders
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

            // 1. Fetch current catalog file from GitHub
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

            // Process Canada Main Image
            if (product.image_ca && product.image_ca.startsWith("data:image/")) {
                const match = product.image_ca.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}.${ext}`;
                    await createBlobAndAddTree(imageFileName, match[2], false);
                    product.image_ca = imageFileName;
                }
            }

            // Process US Main Image
            if (product.image_us && product.image_us.startsWith("data:image/")) {
                const match = product.image_us.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    const ext = match[1] === "jpeg" ? "jpg" : match[1];
                    const imageFileName = `${slug}-us.${ext}`;
                    await createBlobAndAddTree(imageFileName, match[2], true);
                    product.image_us = imageFileName;
                }
            }

            // Normalize base fallback image
            product.image = product.image_ca || product.image_us || product.image || "";

            // Process Canada Gallery
            if (Array.isArray(product.gallery_ca) && product.gallery_ca.length > 0) {
                const processedGallery = [];
                for (let i = 0; i < product.gallery_ca.length; i++) {
                    const item = product.gallery_ca[i];
                    if (typeof item === "string" && item.startsWith("data:image/")) {
                        const match = item.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                        if (match) {
                            const ext = match[1] === "jpeg" ? "jpg" : match[1];
                            const galFileName = `${slug}-gallery-${i + 1}.${ext}`;
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
                            const galFileName = `${slug}-us-gallery-${i + 1}.${ext}`;
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
            }

            // Normalize base gallery
            product.gallery = (Array.isArray(product.gallery_ca) && product.gallery_ca.length > 0)
                ? [...product.gallery_ca]
                : (Array.isArray(product.gallery_us) && product.gallery_us.length > 0 ? [...product.gallery_us] : []);

            // 4. Update or Insert product into catalog array
            const prodId = product.id ? String(product.id) : `prod_${Date.now()}`;
            product.id = isNaN(Number(prodId)) ? prodId : Number(prodId);

            const existingIndex = products.findIndex(p => 
                String(p.id) === String(product.id) ||
                (p.aliasId && String(p.aliasId) === String(product.id)) ||
                (p.slug && p.slug === product.slug)
            );

            if (existingIndex >= 0) {
                products[existingIndex] = { ...products[existingIndex], ...product };
            } else {
                if (typeof product.id === "string" && !isNaN(Number(product.id))) {
                    product.id = Number(product.id);
                } else if (typeof product.id === "string" && product.id.startsWith("prod_")) {
                    const nextId = Math.max(...products.filter(p => typeof p.id === "number").map(p => p.id), 30) + 1;
                    product.aliasId = product.id;
                    product.id = nextId;
                }
                products.push(product);
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
                message: `Catalog update: ${product.title} (atomic sync) [skip ci]`,
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
                message: `Product "${product.title}" saved, translated, and committed directly to GitHub & Production!`,
                product
            }), { headers: corsHeaders });
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
            }), { headers: corsHeaders });
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
