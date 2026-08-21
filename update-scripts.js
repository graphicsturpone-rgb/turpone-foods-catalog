const fs = require('fs');

// 1. Update admin/config.yml
let config = fs.readFileSync('admin/config.yml', 'utf8');
config = config.replace(
    /- \{label: "Cook Time", name: "cookTime", widget: "string", default: "30 min", i18n: true\}/g,
    '- {label: "Total Time", name: "cookTime", widget: "string", default: "30 min", i18n: true}'
);
config = config.replace(
    /\s*- \{label: "Calories", name: "calories", widget: "string", default: "320 kcal", i18n: true\}\n/g,
    '\n'
);
fs.writeFileSync('admin/config.yml', config, 'utf8');

// 2. Update recipes/template.html
let templateHtml = fs.readFileSync('recipes/template.html', 'utf8');
templateHtml = templateHtml.replace(
    /<span><strong>Cook:<\/strong> \{\{cookTime\}\}<\/span>/g,
    '<span><strong>{{totalTimeLabel}}:</strong> {{cookTime}}</span>'
);
templateHtml = templateHtml.replace(
    /\s*<span><strong>Calories:<\/strong> \{\{calories\}\}<\/span>/g,
    ''
);
fs.writeFileSync('recipes/template.html', templateHtml, 'utf8');

// 3. Update scripts/build-recipes.js
let buildJs = fs.readFileSync('scripts/build-recipes.js', 'utf8');

// Add totalTime translations
buildJs = buildJs.replace(
    /{ code: 'en',([^}]+)t: \{ title: 'Our Recipes', ing: 'Ingredients', inst: 'Instructions', nut: 'Nutrition Information', rec: 'Recommended Product' \} \}/g,
    "{ code: 'en',$1t: { title: 'Our Recipes', ing: 'Ingredients', inst: 'Instructions', nut: 'Nutrition Information', rec: 'Recommended Product', totalTime: 'Total Time' } }"
);
buildJs = buildJs.replace(
    /{ code: 'fr',([^}]+)t: \{ title: 'Nos Recettes', ing: 'Ingrédients', inst: 'Instructions', nut: 'Valeur nutritive', rec: 'Produit recommandé' \} \}/g,
    "{ code: 'fr',$1t: { title: 'Nos Recettes', ing: 'Ingrédients', inst: 'Instructions', nut: 'Valeur nutritive', rec: 'Produit recommandé', totalTime: 'Temps Total' } }"
);
buildJs = buildJs.replace(
    /{ code: 'es',([^}]+)t: \{ title: 'Nuestras Recetas', ing: 'Ingredientes', inst: 'Instrucciones', nut: 'Información nutricional', rec: 'Producto recomendado' \} \}/g,
    "{ code: 'es',$1t: { title: 'Nuestras Recetas', ing: 'Ingredientes', inst: 'Instrucciones', nut: 'Información nutricional', rec: 'Producto recomendado', totalTime: 'Tiempo Total' } }"
);

// Inject the replacement logic for totalTimeLabel into build-recipes.js
if (!buildJs.includes('{{totalTimeLabel}}')) {
    buildJs = buildJs.replace(
        /html = html\.replace\(\/\{\{cookTime\}\}\/g, metadata\.cookTime \|\| ''\);/g,
        "html = html.replace(/{{cookTime}}/g, metadata.cookTime || '');\n            html = html.replace(/{{totalTimeLabel}}/g, lang.t.totalTime);"
    );
}

// Remove calories logic from build-recipes.js
buildJs = buildJs.replace(
    /\s*html = html\.replace\(\/\{\{calories\}\}\/g, metadata\.calories \|\| ''\);/g,
    ''
);

fs.writeFileSync('scripts/build-recipes.js', buildJs, 'utf8');

console.log('Successfully updated config.yml, template.html, and build-recipes.js');
