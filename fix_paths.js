const fs = require('fs');
const file = 'turpone-products/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace /wp-content/uploads/YYYY/MM/filename with /assets/images/filename
content = content.replace(/\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\/\"']+)/g, '/assets/images/');

// There are also encoded versions like in data-e-action-hash
// For example: %2Fwp-content%2Fuploads%2F2026%2F05%2Ffilename
content = content.replace(/%2Fwp-content%2Fuploads%2F\d{4}%2F\d{2}%2F([^%\"'&]+)/g, '%2Fassets%2Fimages%2F');

// And Base64 versions like: \/wp-content\/uploads\/...
content = content.replace(/\\\/wp-content\\\/uploads\\\/\\d{4}\\\/\\d{2}\\\/([^\\\"']+)/g, '\\/assets\\/images\\/');

fs.writeFileSync(file, content);
console.log('Fixed image paths!');
