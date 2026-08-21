const fs = require('fs');

const pagesData = [
    {
        file: 'index.html',
        title: "Turpone Foods | Premium Martha Stewart Food Products",
        desc: "Turpone Foods, a subdivision of Turpone Group, specializes in premium ingredients, authentic pizza dough, infused olive oils, and retail food innovation."
    },
    {
        file: 'services/index.html',
        title: "Retail & Food Services | Turpone Group Licensing",
        desc: "Discover Turpone Group's expertise in retail food innovation, brand licensing, and global sourcing for specialty retailers and the food service industry."
    },
    {
        file: 'recipes/index.html',
        title: "Premium Food Recipes | Turpone Foods & Martha Stewart",
        desc: "Explore our collection of delicious recipes crafted to highlight premium Turpone Foods ingredients and the exclusive line of Martha Stewart infused olive oils."
    },
    {
        file: 'about-us/index.html',
        title: "About Turpone Group & Turpone Foods",
        desc: "Learn about Turpone Group, a global leader in food innovation, and our Turpone Foods subdivision featuring our exclusive partnership with Martha Stewart."
    },
    {
        file: 'partners/index.html',
        title: "Strategic Partners & Food Service Licensees | Turpone Group",
        desc: "Join Turpone Group's network of strategic brand partners and food service experts. Together, we bring premium quality goods to challenge current markets."
    },
    // ES
    {
        file: 'es/index.html',
        title: "Turpone Foods | Productos Alimenticios Premium Martha Stewart",
        desc: "Turpone Foods, una subdivisión de Turpone Group, se especializa en ingredientes premium, auténtica masa de pizza, aceites de oliva infundidos e innovación alimentaria minorista."
    },
    {
        file: 'es/services/index.html',
        title: "Servicios Minoristas y Alimentarios | Licencias de Turpone Group",
        desc: "Descubra la experiencia de Turpone Group en innovación alimentaria minorista, licencias de marcas y abastecimiento global para minoristas especializados y la industria de servicios alimentarios."
    },
    {
        file: 'es/recetas/index.html',
        title: "Recetas de Comida Premium | Turpone Foods y Martha Stewart",
        desc: "Explore nuestra colección de deliciosas recetas diseñadas para destacar los ingredientes premium de Turpone Foods y la línea exclusiva de aceites de oliva infundidos de Martha Stewart."
    },
    {
        file: 'es/about-us/index.html',
        title: "Sobre Turpone Group y Turpone Foods",
        desc: "Conozca Turpone Group, líder mundial en innovación alimentaria, y nuestra subdivisión Turpone Foods que presenta nuestra asociación exclusiva con Martha Stewart."
    },
    {
        file: 'es/partners/index.html',
        title: "Socios Estratégicos y Licenciatarios de Servicio de Alimentos | Turpone Group",
        desc: "Únase a la red de socios de marca estratégicos y expertos en servicios alimentarios de Turpone Group. Juntos, ofrecemos productos de calidad premium para desafiar los mercados actuales."
    },
    // FR
    {
        file: 'fr/index.html',
        title: "Turpone Foods | Produits Alimentaires Premium Martha Stewart",
        desc: "Turpone Foods, une subdivision de Turpone Group, se spécialise dans les ingrédients premium, la pâte à pizza authentique, les huiles d'olive infusées et l'innovation alimentaire au détail."
    },
    {
        file: 'fr/services/index.html',
        title: "Services de Vente au Détail et Alimentaires | Licences Turpone Group",
        desc: "Découvrez l'expertise de Turpone Group dans l'innovation alimentaire au détail, les licences de marque et l'approvisionnement mondial pour les détaillants spécialisés et l'industrie des services alimentaires."
    },
    {
        file: 'fr/recettes/index.html',
        title: "Recettes de Cuisine Premium | Turpone Foods et Martha Stewart",
        desc: "Explorez notre collection de délicieuses recettes conçues pour mettre en valeur les ingrédients premium de Turpone Foods et la gamme exclusive d'huiles d'olive infusées Martha Stewart."
    },
    {
        file: 'fr/about-us/index.html',
        title: "À propos de Turpone Group et Turpone Foods",
        desc: "Découvrez Turpone Group, un leader mondial de l'innovation alimentaire, et notre subdivision Turpone Foods présentant notre partenariat exclusif avec Martha Stewart."
    },
    {
        file: 'fr/partners/index.html',
        title: "Partenaires Stratégiques et Licenciés de Services Alimentaires | Turpone Group",
        desc: "Rejoignez le réseau de partenaires de marque stratégiques et d'experts en services alimentaires de Turpone Group. Ensemble, nous proposons des produits de qualité premium pour défier les marchés actuels."
    }
];

pagesData.forEach(p => {
    if (fs.existsSync(p.file)) {
        let content = fs.readFileSync(p.file, 'utf8');
        
        // Replace Title
        content = content.replace(/<title>[\s\S]*?<\/title>/gi, '<title>' + p.title + '</title>');
        
        // Replace Meta Description
        content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']/gi, '<meta name="description" content="' + p.desc + '"');
        
        // Replace OG Title (if exists)
        if (content.match(/<meta\s+property=["']og:title["']/i)) {
            content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']/gi, '<meta property="og:title" content="' + p.title + '"');
        }
        
        // Replace OG Description (if exists)
        if (content.match(/<meta\s+property=["']og:description["']/i)) {
            content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']/gi, '<meta property="og:description" content="' + p.desc + '"');
        }
        
        fs.writeFileSync(p.file, content, 'utf8');
        console.log('Updated SEO in ' + p.file);
    } else {
        console.log('File not found: ' + p.file);
    }
});
