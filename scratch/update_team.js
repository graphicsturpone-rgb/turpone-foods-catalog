const fs = require("fs");

function updateCustomInteractions(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");

    // Replace roles
    const roleMarker = '"Senior Graphic Design / AI Web Developer":';
    const roleIdx = content.indexOf(roleMarker);
    if (roleIdx !== -1) {
        const nextBrace = content.indexOf("};", roleIdx);
        if (nextBrace !== -1) {
            const toReplace = content.substring(roleIdx, nextBrace + 2);
            const replacement = `"Senior Graphic Design / AI Web Developer": isFr ? "Concepteur Graphique Senior / Développeur Web IA" : (isEs ? "Diseñador Gráfico Senior / Desarrollador Web IA" : "Senior Graphic Design / AI Web Developer"),
                    "Digital Marketing Intern": isFr ? "Stagiaire en Marketing Numérique" : (isEs ? "Pasante de Marketing Digital" : "Digital Marketing Intern"),
                    "Brand and Marketing Coordinator": isFr ? "Coordinateur de Marque et Marketing" : (isEs ? "Coordinador de Marca y Marketing" : "Brand and Marketing Coordinator"),
                    "Sales and Product Management": isFr ? "Gestion des Ventes et des Produits" : (isEs ? "Gestión de Ventas y Productos" : "Sales and Product Management")
                };`;
            content = content.replace(toReplace, replacement);
        }
    }

    // Replace teamMembers ending at Stephen Liu
    const stephenMarker = '{ id: "member8", name: "Stephen Liu"';
    const stephenIdx = content.indexOf(stephenMarker);
    if (stephenIdx !== -1) {
        const nextBracket = content.indexOf("];", stephenIdx);
        if (nextBracket !== -1) {
            const toReplace = content.substring(stephenIdx, nextBracket + 2);
            const replacement = `{ id: "member8", name: "Stephen Liu", role: "Accounting", img: "Stephen%20Liu.webp" },
                { id: "member12", name: "Natalia Leano", role: "Digital Marketing Intern", img: "Natalia.webp" },
                { id: "member13", name: "KahKashan Ansary", role: "Brand and Marketing Coordinator", img: "Kkay.webp" },
                { id: "member14", name: "Grace Sidaway", role: "Sales and Product Management", img: "Grace.webp" }
            ];`;
            content = content.replace(toReplace, replacement);
        }
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated: " + filePath);
}

updateCustomInteractions("assets/js/custom-interactions.js");
updateCustomInteractions("turpone-astro/public/assets/js/custom-interactions.js");
