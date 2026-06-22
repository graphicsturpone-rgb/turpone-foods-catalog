const fs = require('fs');
let html = fs.readFileSync('turpone-products/index.html', 'utf8');

// Remove the custom filter script
html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*console\.log\('Custom filter initialized!'\);[\s\S]*?<\/script>/, '');

// Re-enable Elementor Free and Pro
html = html.replace('<!-- disabled elementor frontend -->', '<script id="elementor-frontend-js" src="../assets/js/frontend-free.min.js"></script>');
html = html.replace('<!-- disabled elementor pro frontend -->', '<script id="elementor-pro-frontend-js" src="../assets/js/frontend-pro.min.js"></script>');

fs.writeFileSync('turpone-products/index.html', html);
console.log('Restored native Elementor JS and removed custom filter!');
