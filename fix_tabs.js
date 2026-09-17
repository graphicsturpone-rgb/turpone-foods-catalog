const fs = require('fs');
let html = fs.readFileSync('turpone-products/index.html', 'utf8');

// 1. Change menu link in header
html = html.replace(/>Turpone Products</g, '>Food Services<');
html = html.replace(/>Turpone Products </g, '>Food Services <');

// 2. Delete Retail Tab Button
html = html.replace(/<button aria-controls="e-n-tab-content-2183931401"[^>]*>.*?Retail\s*<\/span><\/button>/s, '');

// 3. Delete Retail Tab Content
html = html.replace(/<div aria-labelledby="e-n-tab-title-2183931401".*?(?=<div aria-labelledby="e-n-tab-title-2183931402")/s, '');

// 4. Make Food Service tab active
html = html.replace('aria-controls="e-n-tab-content-2183931402" aria-selected="false"', 'aria-controls="e-n-tab-content-2183931402" aria-selected="true"');
html = html.replace(/(<div aria-labelledby="e-n-tab-title-2183931402"[^>]*class=")([^"]*)/, '-active ');

fs.writeFileSync('turpone-products/index.html', html, 'utf8');
