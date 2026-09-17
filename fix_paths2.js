const fs = require('fs');
let html = fs.readFileSync('turpone-products/index.html', 'utf8');

// Find all gallery items
let newHtml = html.replace(/<a class="e-gallery-item[^>]+>([\s\S]*?)<\/a>/g, (match) => {
    // Extract data-e-action-hash
    let hashMatch = match.match(/data-e-action-hash="([^"]+)"/);
    if(hashMatch) {
        let hashStr = hashMatch[1];
        // Decode URI component
        hashStr = decodeURIComponent(hashStr);
        // Remove #elementor-action:action=lightbox&settings=
        let settingsStr = hashStr.replace('#elementor-action:action=lightbox&settings=', '');
        try {
            // Base64 decode
            let settingsJson = Buffer.from(settingsStr, 'base64').toString('utf8');
            let settings = JSON.parse(settingsJson);
            let url = settings.url; // e.g. http://localhost:10008/assets/uploads/2026/05/Lemon-Pepper-Infused-Extra-Virgin-Olive-Oil.webp
            // Extract filename
            let filename = url.substring(url.lastIndexOf('/') + 1);
            
            // Now replace the blank href and data-thumbnail
            match = match.replace(/href="\/assets\/images\/"/g, 'href="/assets/images/' + filename + '"');
            match = match.replace(/data-thumbnail="\/assets\/images\/"/g, 'data-thumbnail="/assets/images/' + filename + '"');
            return match;
        } catch(e) {
            console.error('Error decoding', e.message);
        }
    }
    return match;
});

fs.writeFileSync('turpone-products/index.html', newHtml);
console.log('Fixed paths using Base64 data!');
