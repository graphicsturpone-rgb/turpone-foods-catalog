const fs = require('fs');

const metaReplacements = [
    {
        file: 'turpone-products/index.html',
        find: /<meta name="description" content="Explore our curated selection of premium ingredients, featuring the complete line of Martha Stewart([^"]*)">/i,
        replace: '<meta name="description" content="Shop the exclusive line of Martha Stewart Food Products by Turpone Foods. Discover premium infused olive oils, authentic pizza dough, and more.">'
    },
    {
        file: 'es/turpone-products/index.html',
        find: /<meta name="description" content="Explora nuestra cuidadosa selecci([^"]*)">/i,
        replace: '<meta name="description" content="Compre la exclusiva línea de productos alimenticios de Martha Stewart de Turpone Foods. Descubra aceites de oliva premium, masa de pizza y más.">'
    },
    {
        file: 'fr/turpone-products/index.html',
        find: /<meta name="description" content="D.couvrez notre s.lection([^"]*)">/i,
        replace: '<meta name="description" content="Achetez la ligne exclusive de produits alimentaires Martha Stewart par Turpone Foods. Découvrez des huiles d\'olive infusées premium, de la pâte à pizza et plus.">'
    }
];

metaReplacements.forEach(rep => {
    if (fs.existsSync(rep.file)) {
        let content = fs.readFileSync(rep.file, 'utf8');
        content = content.replace(rep.find, rep.replace);
        fs.writeFileSync(rep.file, content, 'utf8');
        console.log('Fixed Meta in ' + rep.file);
    }
});
