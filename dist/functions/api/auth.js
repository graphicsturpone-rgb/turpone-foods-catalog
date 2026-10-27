/**
 * Cloudflare Pages Function: /api/auth
 * Authentication endpoint for Turpone Foods Admin Portal
 */

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}

export async function onRequestGet() {
    return new Response(JSON.stringify({
        ok: true,
        service: "Turpone Foods Admin Authentication Service"
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}

export async function onRequestPost({ request }) {
    const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const email = (body.email || "").trim().toLowerCase();
        const password = (body.password || "").trim();

        if (!email || !password) {
            return new Response(JSON.stringify({
                success: false,
                error: "Please provide both email and password."
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // Account 1: Natalia Leano - Recipes Editor (Restricted to Recipes)
        if (email === "natalia.l@turpone.com" && password === "JarryGroup32$") {
            return new Response(JSON.stringify({
                success: true,
                user: {
                    email: "natalia.l@turpone.com",
                    name: "Natalia Leano",
                    role: "recipes_editor",
                    permissions: ["recipes_read", "recipes_write", "recipes_delete"],
                    defaultRoute: "/admin/recipes.html"
                },
                token: "turpone_sec_" + btoa("natalia.l@turpone.com:" + Date.now())
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        // Account 2: Full Administrator (Master / Owner)
        const isAdmin = (
            (email === "admin@turpone.com" || email === "graphicsturpone@gmail.com" || email === "admin") &&
            password === "JarryGroup32$"
        );

        if (isAdmin) {
            return new Response(JSON.stringify({
                success: true,
                user: {
                    email: email,
                    name: "Administrator",
                    role: "admin",
                    permissions: ["all"],
                    defaultRoute: "/admin/products.html"
                },
                token: "turpone_sec_" + btoa(email + ":" + Date.now())
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({
            success: false,
            error: "Invalid email or password. Please verify your credentials."
        }), {
            status: 401,
            headers: corsHeaders
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: "Authentication service error: " + err.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
