const fs = require('fs');

const replacements = [
    {
        file: 'index.html',
        find: /<h3 class="elementor-image-box-title"([^>]*)>\s*Retail and food service experts\s*<\/h3>/i,
        replace: '<h1 class="elementor-image-box-title"$1>Premium Martha Stewart Food Products</h1>'
    },
    {
        file: 'es/index.html',
        find: /<h3 class="elementor-image-box-title"([^>]*)>\s*Expertos en comercio minorista y servicios de alimentación\s*<\/h3>/i,
        replace: '<h1 class="elementor-image-box-title"$1>Productos Alimenticios Premium Martha Stewart</h1>'
    },
    {
        file: 'fr/index.html',
        find: /<h3 class="elementor-image-box-title"([^>]*)>\s*Experts en commerce de détail et service alimentaire\s*<\/h3>/i,
        replace: '<h1 class="elementor-image-box-title"$1>Produits Alimentaires Premium Martha Stewart</h1>'
    }
];

replacements.forEach(rep => {
    if (fs.existsSync(rep.file)) {
        let content = fs.readFileSync(rep.file, 'utf8');
        content = content.replace(rep.find, rep.replace);
        fs.writeFileSync(rep.file, content, 'utf8');
        console.log('Fixed H1 in ' + rep.file);
    }
});
