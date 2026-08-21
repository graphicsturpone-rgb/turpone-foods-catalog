const fs = require('fs');

const files = [
  'turpone-products/index.html',
  'es/turpone-products/index.html',
  'fr/turpone-products/index.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove custom-lightbox HTML and CSS
    content = content.replace(/<style>\s*\.custom-lightbox-overlay[\s\S]*?<\/style>/g, '');
    content = content.replace(/<div class="custom-lightbox-overlay" id="custom-lightbox">[\s\S]*?<\/div>/g, '');

    // Remove custom-lightbox JS block
    content = content.replace(/    \/\/ 3\. Custom Lightbox Popup Handler[\s\S]*?    \}\);/g, '');

    // Rewrite data-e-action-hash to use /assets/images/ca_imgs/ instead of localhost
    content = content.replace(/data-e-action-hash="([^"]+)"/g, (match, hash) => {
      try {
        const decodedUri = decodeURIComponent(hash);
        const prefix = '#elementor-action:action=lightbox&settings=';
        if (!decodedUri.startsWith(prefix)) return match;

        const base64Str = decodedUri.replace(prefix, '');
        const jsonStr = Buffer.from(base64Str, 'base64').toString('utf8');
        const jsonObj = JSON.parse(jsonStr);

        if (jsonObj.url && jsonObj.url.includes('/wp-content/uploads/')) {
          const filename = jsonObj.url.substring(jsonObj.url.lastIndexOf('/') + 1);
          // Set to ca_imgs. The us-image-swap.js will dynamically swap this to us_imgs if needed!
          jsonObj.url = '/assets/images/ca_imgs/' + filename;
          
          const newJsonStr = JSON.stringify(jsonObj);
          const newBase64 = Buffer.from(newJsonStr, 'utf8').toString('base64');
          const newEncodedUri = encodeURIComponent(prefix + newBase64);
          
          return `data-e-action-hash="${newEncodedUri}"`;
        }
      } catch (e) {
        console.error('Error modifying hash', e);
      }
      return match;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed hashes and removed custom lightbox in ' + file);
  }
});
