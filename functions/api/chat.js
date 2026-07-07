export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        
        // Parse the incoming JSON payload (expects { messages: [{role, content}] })
        const body = await request.json();
        
        if (!body.messages || !Array.isArray(body.messages)) {
            return new Response(JSON.stringify({ error: "Invalid request body format." }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Get the API key from environment variable (provided by user in Cloudflare dashboard, or fallback to the one provided in chat if we were hardcoding it, but we should use the env var and fallback to the hardcoded one just for ease of deployment right now, wait, they gave it in the chat, I'll hardcode it here for immediate functionality but they can override it with env var).
        const apiKey = env.GEMINI_API_KEY || "AQ.Ab8RN6JIKnLiwIi9Mjh_N2XMweKksD2Is3McnIQsFTLy5VuCBA";
        
        if (!apiKey) {
             return new Response(JSON.stringify({ error: "API key not configured." }), { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const systemInstruction = `You are a helpful, professional, and friendly virtual assistant for Turpone Foods. Turpone Foods is a Montreal-based food and cooking appliance company redefining the outdoor culinary experience through innovation, performance, and design. Specializing in high-technology pizza ovens and premium grilling solutions, Turpone launched the world's first portable rotating pizza oven in 2022. They also distribute fine foods to specialty retailers and restaurants, including a refined line of Martha Stewart products (artisanal pizzas, seasoning blends, rich and floral honeys, premium olive oils). They focus on generational asset growth rather than short-term fluctuations. They cater to both Retail and Food Service.
If the user asks a question you don't know the answer to, or if they want to make a large bulk order, politely redirect them to the Contact page. Keep your answers concise, ideally 1-3 sentences.
If a user asks for an email address, telephone number, or how to contact you, always provide them with this exact link: https://turponefoods.com/contact/
CRITICAL INSTRUCTION: You must detect the language of the user's message and reply in the EXACT SAME LANGUAGE (English, Spanish, or French).`;

        // Format for Gemini REST API
        // Gemini expects contents: [{ role: "user"|"model", parts: [{ text: "..." }] }]
        const contents = body.messages.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        const geminiPayload = {
            system_instruction: {
                parts: { text: systemInstruction }
            },
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            return new Response(JSON.stringify({ error: "Error communicating with AI service." }), {
                status: 502,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();
        
        let assistantReply = "Lo siento, no pude procesar tu mensaje.";
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            assistantReply = data.candidates[0].content.parts[0].text;
        }

        return new Response(JSON.stringify({ reply: assistantReply }), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                // Enable CORS if needed (though it's on same origin, good practice)
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
        
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
