const fs = require('fs');
const path = require('path');

// Target new CSS:
// 1. Erase gap between icons: exactly stack them sequentially with 0 gap.
// 2. Reduce icon size to half: font-size 12px (was 24px), SVG icon 12px x 12px, padding 6px 9px.
// 3. Spacing/offset per icon: exactly 24px height per item, no gap:
//    - IG: top: 50%
//    - TK: top: calc(50% + 24px)
//    - PT: top: calc(50% + 48px)
//    - FB: top: calc(50% + 72px)
//    - X:  top: calc(50% + 96px)

const NEW_CSS = `/* Floating Social Media Icons */
.floating-ig {
    position: fixed !important;
    top: 50% !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 6px 9px !important;
    border-radius: 0 4px 4px 0 !important;
    font-size: 12px !important;
    line-height: 1 !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-tk {
    position: fixed !important;
    top: calc(50% + 24px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 6px 9px !important;
    border-radius: 0 4px 4px 0 !important;
    font-size: 12px !important;
    line-height: 1 !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-pt {
    position: fixed !important;
    top: calc(50% + 48px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 6px 9px !important;
    border-radius: 0 4px 4px 0 !important;
    font-size: 12px !important;
    line-height: 1 !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-fb {
    position: fixed !important;
    top: calc(50% + 72px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 6px 9px !important;
    border-radius: 0 4px 4px 0 !important;
    font-size: 12px !important;
    line-height: 1 !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-xtwitter {
    position: fixed !important;
    top: calc(50% + 96px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 6px 9px !important;
    border-radius: 0 4px 4px 0 !important;
    font-size: 12px !important;
    line-height: 1 !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-ig span, .floating-tk span, .floating-pt span, .floating-fb span, .floating-xtwitter span {
    font-size: 12px !important;
    max-width: 0 !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    transition: max-width 0.3s ease !important;
    font-family: Arial, sans-serif !important;
}
.floating-ig:hover span, .floating-tk:hover span, .floating-pt:hover span, .floating-fb:hover span, .floating-xtwitter:hover span {
    max-width: 200px !important;
}
.floating-ig:hover, .floating-tk:hover, .floating-pt:hover, .floating-fb:hover, .floating-xtwitter:hover {
    padding-right: 14px !important;
    color: white !important;
    transform: translateY(-50%) !important;
}
.floating-xtwitter .fa-x-twitter, .floating-xtwitter svg {
    color: white !important;
    fill: white !important;
    width: 12px !important;
    height: 12px !important;
}`;

const REGEX = /\/\*\s*Floating Social Media Icons\s*\*\/[\s\S]*?\.floating-xtwitter\s+\.fa-x-twitter,\s*\.floating-xtwitter\s+svg\s*\{[\s\S]*?\}/;

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'turpone-cms' && file !== 'turpone-astro' && file !== 'apps') {
                results = results.concat(getHtmlFiles(full));
            }
        } else if (file.endsWith('.html')) {
            results.push(full);
        }
    });
    return results;
}

const files = getHtmlFiles('.');
let count = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (REGEX.test(content)) {
        content = content.replace(REGEX, NEW_CSS);
        fs.writeFileSync(f, content, 'utf8');
        count++;
        console.log(`Updated social icons in: ${f}`);
    }
});

console.log(`Successfully updated ${count} HTML files.`);
