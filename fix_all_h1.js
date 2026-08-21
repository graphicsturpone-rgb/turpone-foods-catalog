const fs = require('fs');

const updates = [
    // ABOUT US
    { file: 'about-us/index.html', find: /<h2 class="elementor-heading-title elementor-size-default">MEET US<\/h2>/i, replace: '<h1 class="elementor-heading-title elementor-size-default">About Turpone Group & Turpone Foods</h1>' },
    { file: 'es/about-us/index.html', find: /<h2 class="elementor-heading-title elementor-size-default">CONÓCENOS<\/h2>/i, replace: '<h1 class="elementor-heading-title elementor-size-default">Sobre Turpone Group y Turpone Foods</h1>' },
    { file: 'fr/about-us/index.html', find: /<h2 class="elementor-heading-title elementor-size-default">RENCONTREZ-NOUS<\/h2>/i, replace: '<h1 class="elementor-heading-title elementor-size-default">À propos de Turpone Group et Turpone Foods</h1>' },

    // PRODUCTS
    { file: 'turpone-products/index.html', find: /<h3 class="elementor-image-box-title">Explore Our Products<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Explore Premium Turpone Foods & Martha Stewart Products</h1>' },
    { file: 'es/turpone-products/index.html', find: /<h3 class="elementor-image-box-title">Explora nuestros productos<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Explore los Productos Premium de Turpone Foods y Martha Stewart</h1>' },
    { file: 'fr/turpone-products/index.html', find: /<h3 class="elementor-image-box-title">Découvrez nos produits<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Découvrez les Produits Premium Turpone Foods et Martha Stewart</h1>' },

    // SERVICES
    { file: 'services/index.html', find: /<h3 class="elementor-image-box-title" data-cms-id="services.partner.heading">BRAND PARTNER AND LICENSEE<\/h3>/i, replace: '<h1 class="elementor-image-box-title" data-cms-id="services.partner.heading">Turpone Group: Brand Partner & Food Service Licensee</h1>' },
    { file: 'es/services/index.html', find: /<h3 class="elementor-image-box-title" data-cms-id="services.partner.heading">SOCIO DE MARCA Y LICENCIATARIO<\/h3>/i, replace: '<h1 class="elementor-image-box-title" data-cms-id="services.partner.heading">Turpone Group: Socio de Marca y Licenciatario de Servicio de Alimentos</h1>' },
    { file: 'fr/services/index.html', find: /<h3 class="elementor-image-box-title">PARTENAIRE DE MARQUE ET CONCESSIONNAIRE<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Turpone Group : Partenaire de Marque et Licencié de Services Alimentaires</h1>' },

    // PARTNERS
    { file: 'partners/index.html', find: /<h3 class="elementor-image-box-title">Our Partners<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Strategic Partners of Turpone Group</h1>' },
    { file: 'es/partners/index.html', find: /<h3 class="elementor-image-box-title">Nuestros socios<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Socios Estratégicos de Turpone Group</h1>' },
    { file: 'fr/partners/index.html', find: /<h3 class="elementor-image-box-title">Nos partenaires<\/h3>/i, replace: '<h1 class="elementor-image-box-title">Partenaires Stratégiques de Turpone Group</h1>' }
];

updates.forEach(u => {
    if (fs.existsSync(u.file)) {
        let content = fs.readFileSync(u.file, 'utf8');
        content = content.replace(u.find, u.replace);
        fs.writeFileSync(u.file, content, 'utf8');
        console.log('Updated H1 in ' + u.file);
    }
});
