const fs = require('fs');

const file = 'assets/js/custom-interactions.js';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove the hardcoded /assets/images/ logic
    content = content.replace(
        /if \(url\) \{\s*var filename = url\.substring\(url\.lastIndexOf\('\/'\) \+ 1\);\s*url = '\/assets\/images\/' \+ filename;\s*\}/g,
        '// Use the original url which is dynamically swapped by us-image-swap.js'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed custom-interactions.js');
}
