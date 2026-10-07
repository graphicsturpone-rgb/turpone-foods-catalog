/**
 * Image fallback for /assets/images/*
 *
 * Why: the Admin backend (/api/products, /api/recipes) uploads new images by
 * committing them to GitHub `main`. The product data is read live from GitHub,
 * but the static Cloudflare Pages deployment only contains images that existed
 * at the last `wrangler pages deploy`. Newly uploaded images therefore 404'd
 * until someone redeployed.
 *
 * How: serve the static asset if it exists; if Pages returns 404, fetch the
 * same file from the GitHub repo (main branch) and cache it at the edge.
 */
const REPO_OWNER = "graphicsturpone-rgb";
const REPO_NAME = "turpone-foods-catalog";
const BRANCH = "main";

const MIME = {
    webp: "image/webp",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
};

export async function onRequestGet(context) {
    const { request, env, next } = context;

    // 1. Try the deployed static asset first
    const staticRes = await next();
    if (staticRes.status !== 404) return staticRes;

    const url = new URL(request.url);
    const repoPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (repoPath.includes("..")) return staticRes;

    const ext = (repoPath.split(".").pop() || "").toLowerCase();
    if (!MIME[ext]) return staticRes;

    // 2. Edge cache lookup
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    // 3. Fetch from GitHub (contents API with token works for private repos too)
    const encodedPath = repoPath.split("/").map(encodeURIComponent).join("/");
    const headers = {
        "User-Agent": "Turpone-Image-Fallback",
        Accept: "application/vnd.github.raw",
    };
    if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

    let ghRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}?ref=${BRANCH}`,
        { headers }
    );
    if (!ghRes.ok) {
        // Public raw fallback
        ghRes = await fetch(
            `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${encodedPath}`
        );
    }
    if (!ghRes.ok) return staticRes;

    const res = new Response(ghRes.body, {
        status: 200,
        headers: {
            "Content-Type": MIME[ext],
            "Cache-Control": "public, max-age=3600",
        },
    });
    context.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
}
