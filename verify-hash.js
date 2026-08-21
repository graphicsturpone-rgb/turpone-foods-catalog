const fs = require('fs');
let html = fs.readFileSync('turpone-products/index.html', 'utf8');
const match = html.match(/data-e-action-hash="([^"]+)"/);
console.log(match[1]);
const decoded = decodeURIComponent(match[1]).replace('#elementor-action:action=lightbox&settings=', '');
console.log(Buffer.from(decoded, 'base64').toString('utf8'));
