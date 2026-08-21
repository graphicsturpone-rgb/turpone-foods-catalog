const fs = require('fs');

const replacements = [
    // --- HOMEPAGE ---
    {
        file: 'index.html',
        find: /Turpone Foods is a multi-divisional corporation focused on bringing innovation, sustainability, and commercialization to food and food-related products\. We leverage a vast global network/g,
        replace: 'Turpone Foods is a multi-divisional corporation focused on bringing innovation, sustainability, and commercialization to food and food-related products, proudly serving as an exclusive brand partner for Martha Stewart\'s Food Products. We leverage a vast global network'
    },
    {
        file: 'es/index.html',
        find: /Turpone Foods es una corporación multidivisional enfocada en llevar innovación, sostenibilidad y comercialización a alimentos y productos relacionados con los alimentos\. Aprovechamos una vasta red global/g,
        replace: 'Turpone Foods es una corporación multidivisional enfocada en llevar innovación, sostenibilidad y comercialización a alimentos y productos relacionados con los alimentos, sirviendo con orgullo como socio de marca exclusivo para los Productos Alimenticios de Martha Stewart. Aprovechamos una vasta red global'
    },
    {
        file: 'fr/index.html',
        find: /Turpone Foods est une société multidivisionnelle axée sur l'apport d'innovation, de durabilité et de commercialisation aux aliments et aux produits liés à l'alimentation\. Nous tirons parti d'un vaste réseau mondial/g,
        replace: "Turpone Foods est une société multidivisionnelle axée sur l'apport d'innovation, de durabilité et de commercialisation aux aliments et aux produits liés à l'alimentation, servant fièrement de partenaire de marque exclusif pour les Produits Alimentaires Martha Stewart. Nous tirons parti d'un vaste réseau mondial"
    },

    // --- SERVICES ---
    {
        file: 'services/index.html',
        find: /We offer licensors a turnkey solution to launch products in the retail and food service market – handling everything/g,
        replace: 'We offer licensors a turnkey solution to launch products in the retail and food service market. As the trusted licensee for Martha Stewart Food Products, we handle everything'
    },
    {
        file: 'es/services/index.html',
        find: /Ofrecemos a los licenciantes una solución llave en mano para lanzar productos en el mercado minorista y de servicios alimentarios, encargándonos de todo/g,
        replace: 'Ofrecemos a los licenciantes una solución llave en mano para lanzar productos en el mercado minorista y de servicios alimentarios. Como el licenciatario de confianza de los Productos Alimenticios de Martha Stewart, manejamos todo'
    },
    {
        file: 'fr/services/index.html',
        find: /Nous offrons aux concédants de licence une solution clé en main pour lancer des produits sur le marché du détail et de la restauration – gérant tout/g,
        replace: "Nous offrons aux concédants de licence une solution clé en main pour lancer des produits sur le marché du détail et de la restauration. En tant que licencié de confiance pour les Produits Alimentaires Martha Stewart, nous gérons tout"
    },

    // --- ABOUT US (INJECTION) ---
    {
        file: 'about-us/index.html',
        find: '</h1></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi',
        replace: '</h1></div></div><div class="elementor-element elementor-widget elementor-widget-text-editor" style="margin-top:20px; margin-bottom: 20px; color:#aaa; font-family:\'Poppins\', sans-serif; font-size:16px; line-height:1.6;"><div class="elementor-widget-container"><p>Turpone Group is built on a foundation of operational excellence and structured growth. Through our Turpone Foods subdivision, we have partnered with industry icons, including our exclusive licensing agreement to distribute premium Martha Stewart Food Products across global retail and food service markets.</p></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi'
    },
    {
        file: 'es/about-us/index.html',
        find: '</h1></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi',
        replace: '</h1></div></div><div class="elementor-element elementor-widget elementor-widget-text-editor" style="margin-top:20px; margin-bottom: 20px; color:#aaa; font-family:\'Poppins\', sans-serif; font-size:16px; line-height:1.6;"><div class="elementor-widget-container"><p>Turpone Group se basa en una base de excelencia operativa y crecimiento estructurado. A través de nuestra subdivisión Turpone Foods, nos hemos asociado con íconos de la industria, incluido nuestro acuerdo de licencia exclusivo para distribuir los Productos Alimenticios Premium de Martha Stewart en los mercados minoristas y de servicios alimentarios a nivel mundial.</p></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi'
    },
    {
        file: 'fr/about-us/index.html',
        find: '</h1></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi',
        replace: '</h1></div></div><div class="elementor-element elementor-widget elementor-widget-text-editor" style="margin-top:20px; margin-bottom: 20px; color:#aaa; font-family:\'Poppins\', sans-serif; font-size:16px; line-height:1.6;"><div class="elementor-widget-container"><p>Turpone Group repose sur une base d\'excellence opérationnelle et de croissance structurée. Par l\'intermédiaire de notre subdivision Turpone Foods, nous nous sommes associés à des icônes de l\'industrie, y compris notre accord de licence exclusif pour distribuer les Produits Alimentaires Premium Martha Stewart sur les marchés mondiaux de la vente au détail et des services alimentaires.</p></div></div><div class="elementor-element elementor-element-c246512 elementor-icon-list--layout-tradi'
    }
];

let successCount = 0;
replacements.forEach(u => {
    if (fs.existsSync(u.file)) {
        let content = fs.readFileSync(u.file, 'utf8');
        
        if (content.match(u.find) || content.indexOf(u.find) !== -1) {
            content = content.replace(u.find, u.replace);
            fs.writeFileSync(u.file, content, 'utf8');
            console.log('Successfully updated: ' + u.file);
            successCount++;
        } else {
            console.log('WARNING: Could not find target string in: ' + u.file);
        }
    } else {
        console.log('File not found: ' + u.file);
    }
});
console.log('Total files updated: ' + successCount);
