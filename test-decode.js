const fs = require('fs');

const file = 'turpone-products/index.html';
let html = fs.readFileSync(file, 'utf8');
const matches = html.match(/data-e-action-hash="([^"]+)"/g);

if (matches) {
    matches.slice(0, 3).forEach(m => {
        const hash = m.match(/"([^"]+)"/)[1];
        try {
            const decodedUri = decodeURIComponent(hash);
            const base64Str = decodedUri.replace('#elementor-action:action=lightbox&settings=', '');
            const jsonStr = Buffer.from(base64Str, 'base64').toString('utf8');
            console.log(jsonStr);
        } catch (e) {
            console.log('Error decoding', hash);
        }
    });
}
