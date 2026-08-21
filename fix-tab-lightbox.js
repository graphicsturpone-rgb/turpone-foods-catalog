const fs = require('fs');

const files = [
  'turpone-products/index.html',
  'es/turpone-products/index.html',
  'fr/turpone-products/index.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // We need to inject a helper function to update the base64 hash
    const helperFunction = `
              function updateActionHash(item, newSlideshowId) {
                  try {
                      var hashStr = item.getAttribute('data-e-action-hash');
                      if (hashStr) {
                          var decodedUri = decodeURIComponent(hashStr);
                          var prefix = '#elementor-action:action=lightbox&settings=';
                          if (decodedUri.indexOf(prefix) === 0) {
                              var base64Str = decodedUri.replace(prefix, '');
                              var jsonStr = atob(base64Str);
                              var jsonObj = JSON.parse(jsonStr);
                              jsonObj.slideshow = newSlideshowId;
                              var newJsonStr = JSON.stringify(jsonObj);
                              var newBase64 = btoa(newJsonStr);
                              var newEncodedUri = encodeURIComponent(prefix + newBase64);
                              item.setAttribute('data-e-action-hash', newEncodedUri);
                          }
                      }
                  } catch(e) {}
              }
`;

    // Make sure we only insert it once
    if (!content.includes('function updateActionHash(item, newSlideshowId)')) {
      content = content.replace(
        /items\.forEach\(function\(item\) \{/g,
        helperFunction + '\n              items.forEach(function(item) {'
      );
    }

    // Now update the lines where it sets data-elementor-lightbox-slideshow to also call updateActionHash
    content = content.replace(
      /item\.setAttribute\('data-elementor-lightbox-slideshow',\s*(.*?)\);/g,
      "var _newId = $1; item.setAttribute('data-elementor-lightbox-slideshow', _newId); updateActionHash(item, _newId);"
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed tab gallery slideshow ID logic in ' + file);
  }
});
