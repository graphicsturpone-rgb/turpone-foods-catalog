const fs = require('fs');

const files = [
  'turpone-products/index.html',
  'es/turpone-products/index.html',
  'fr/turpone-products/index.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the inline script's hardcoded path logic
    content = content.replace(
        /var filename = origUrl\.substring\(origUrl\.lastIndexOf\('\/'\) \+ 1\);\s*var resolvedUrl = '\/assets\/images\/' \+ filename;/g,
        'var resolvedUrl = origUrl;'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + file);
  }
});
