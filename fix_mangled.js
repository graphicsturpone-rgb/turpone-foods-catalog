const fs = require('fs');
let html = fs.readFileSync('turpone-products/index.html', 'utf8');

// Fix the mangled HTML tag
html = html.replace('<div class="e-n-tabs-content">-active "', '<div class="e-n-tabs-content"><div class="e-active e-con-full e-flex e-con e-child"');

fs.writeFileSync('turpone-products/index.html', html, 'utf8');
