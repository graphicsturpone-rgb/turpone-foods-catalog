const fs = require('fs');

const indexHtmlContent = fs.readFileSync('index.html', 'utf8');

const headerMatch = indexHtmlContent.match(/^([\s\S]*?<\/header>)/i);
let header = headerMatch ? headerMatch[1] : '';

const footerMatch = indexHtmlContent.match(/(<footer[\s\S]*)$/i);
let footer = footerMatch ? footerMatch[1] : '';

const fixPaths = (html) => html.replace(/(href|src)="assets\//g, '$1="/assets/');
header = fixPaths(header);
footer = fixPaths(footer);

const layoutAstro = `---
---
${header}
<main id="content">
  <slot />
</main>
${footer}
`;

fs.writeFileSync('turpone-astro/src/layouts/Layout.astro', layoutAstro);
console.log('Layout.astro created successfully.');
