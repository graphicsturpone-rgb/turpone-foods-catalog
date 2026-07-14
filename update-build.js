const fs = require('fs');
let content = fs.readFileSync('scripts/build-recipes.js', 'utf8');

const targetStr = `        html = html.replace(/{{body}}/g, bodyHtml);`;

const replaceStr = targetStr + `\n\n        let upsellHtml = '';
        if (metadata.upsellImage && metadata.upsellLink) {
            upsellHtml = \`
            <div style="margin-top: 40px; text-align: center;">
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">Recommended Product</h4>
                <a href="\${metadata.upsellLink}" target="_blank" style="display: inline-block;">
                    <img src="\${metadata.upsellImage}" alt="Recommended Product" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                </a>
            </div>\`;
        } else if (metadata.upsellImage) {
            upsellHtml = \`
            <div style="margin-top: 40px; text-align: center;">
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; text-transform: uppercase; letter-spacing: 1px;">Recommended Product</h4>
                <img src="\${metadata.upsellImage}" alt="Recommended Product" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            </div>\`;
        }
        html = html.replace(/{{upsell_html}}/g, upsellHtml);`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('scripts/build-recipes.js', content, 'utf8');
    console.log('Script updated successfully.');
} else {
    console.log('Target string not found.');
}
