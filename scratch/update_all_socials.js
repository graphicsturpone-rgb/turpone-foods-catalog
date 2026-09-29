const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'apps') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const cssBlock = `<style>
/* Floating Social Media Icons */
.floating-ig {
    position: fixed !important;
    top: 50% !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 10px 15px !important;
    border-radius: 0 5px 5px 0 !important;
    font-size: 24px !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-tk {
    position: fixed !important;
    top: calc(50% + 55px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 10px 15px !important;
    border-radius: 0 5px 5px 0 !important;
    font-size: 24px !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-pt {
    position: fixed !important;
    top: calc(50% + 110px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 10px 15px !important;
    border-radius: 0 5px 5px 0 !important;
    font-size: 24px !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-fb {
    position: fixed !important;
    top: calc(50% + 165px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 10px 15px !important;
    border-radius: 0 5px 5px 0 !important;
    font-size: 24px !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-xtwitter {
    position: fixed !important;
    top: calc(50% + 220px) !important;
    left: 0 !important;
    transform: translateY(-50%) !important;
    background-color: #000000 !important;
    color: white !important;
    padding: 10px 15px !important;
    border-radius: 0 5px 5px 0 !important;
    font-size: 24px !important;
    z-index: 9999 !important;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    text-decoration: none !important;
    transition: all 0.3s ease !important;
}
.floating-ig span, .floating-tk span, .floating-pt span, .floating-fb span, .floating-xtwitter span {
    font-size: 14px !important;
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
    padding-right: 20px !important;
    color: white !important;
    transform: translateY(-50%) !important;
}
.floating-xtwitter .fa-x-twitter, .floating-xtwitter svg {
    color: white !important;
    fill: white !important;
}

/* Scroll to Top Button */
.scroll-top-btn {
    position: fixed !important;
    bottom: 30px !important;
    right: 30px !important;
    background-color: #000000 !important;
    color: white !important;
    width: 50px !important;
    height: 50px !important;
    min-width: 50px !important;
    min-height: 50px !important;
    max-width: 50px !important;
    max-height: 50px !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 50% !important;
    border: none !important;
    outline: none !important;
    font-size: 20px !important;
    cursor: pointer !important;
    z-index: 9999 !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    line-height: 1 !important;
}
.scroll-top-btn.show {
    opacity: 1;
    visibility: visible;
}
.scroll-top-btn:hover {
    transform: translateY(-5px);
    background-color: #333333;
}
</style>`;

function getHtmlBlock(lang) {
  let igText, tkText, ptText, fbText, xText;
  if (lang === 'fr') {
    igText = 'Suivez-nous sur Instagram';
    tkText = 'Suivez-nous sur Tik Tok';
    ptText = 'Suivez-nous sur Pinterest';
    fbText = 'Suivez-nous sur Facebook';
    xText = 'Suivez-nous sur X';
  } else if (lang === 'es') {
    igText = 'Síguenos en Instagram';
    tkText = 'Síguenos en Tik Tok';
    ptText = 'Síguenos en Pinterest';
    fbText = 'Síguenos en Facebook';
    xText = 'Síguenos en X';
  } else {
    igText = 'Follow us on Instagram';
    tkText = 'Follow us on Tik Tok';
    ptText = 'Follow us on Pinterest';
    fbText = 'Follow us on Facebook';
    xText = 'Follow us on X';
  }

  return `${cssBlock}
<a class="floating-ig" href="https://instagram.com/turponefoods" target="_blank"><i class="fa-brands fa-instagram"></i><span>${igText}</span></a>
<a class="floating-tk" href="https://www.tiktok.com/@turponefoods" target="_blank"><i class="fa-brands fa-tiktok"></i><span>${tkText}</span></a>
<a class="floating-pt" href="https://ca.pinterest.com/turponefoods/" target="_blank"><i class="fa-brands fa-pinterest"></i><span>${ptText}</span></a>
<a class="floating-fb" href="https://www.facebook.com/people/Turpone-Foods/61593551650708/" target="_blank"><i class="fa-brands fa-facebook"></i><span>${fbText}</span></a>
<a class="floating-xtwitter" href="https://x.com/TurponeFoods" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="0.85em" height="0.85em" fill="white" style="display:inline-block;vertical-align:middle;"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg><span>${xText}</span></a>
<button class="scroll-top-btn" id="scrollTopBtn" title="Go to top"><i class="fa-solid fa-arrow-up"></i></button>`;
}

const htmlFiles = walk('.');
let updatedCount = 0;

for (const filepath of htmlFiles) {
  let content = fs.readFileSync(filepath, 'utf8');
  if (!content.includes('floating-ig')) continue;

  const normalizedPath = filepath.replace(/\\/g, '/');
  let lang = 'en';
  if (normalizedPath.startsWith('fr/') || normalizedPath.includes('/fr/')) lang = 'fr';
  else if (normalizedPath.startsWith('es/') || normalizedPath.includes('/es/')) lang = 'es';

  const newBlock = getHtmlBlock(lang);
  // Match either the original or updated social media block
  const regex = /<style>\s*\/\*\s*Floating (?:Instagram Icon|Social Media Icons)\s*\*\/[\s\S]*?id="scrollTopBtn"[\s\S]*?<\/button>/i;

  if (regex.test(content)) {
    content = content.replace(regex, newBlock);
    fs.writeFileSync(filepath, content, 'utf8');
    updatedCount++;
    console.log(`Updated [${lang}] ${filepath}`);
  } else {
    console.warn(`Could not match regex in ${filepath}`);
  }
}

console.log(`\nDone! Successfully updated ${updatedCount} HTML files.`);
