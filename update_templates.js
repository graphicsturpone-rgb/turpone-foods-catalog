const fs = require('fs');
function updateTemplate(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Remove all existing og:title, og:description, twitter:title, twitter:description, name="description"
    content = content.replace(/<meta[^>]*name="description"[^>]*>/g, '');
    content = content.replace(/<meta[^>]*property="og:title"[^>]*>/g, '');
    content = content.replace(/<meta[^>]*property="og:description"[^>]*>/g, '');
    content = content.replace(/<meta[^>]*name="twitter:title"[^>]*>/g, '');
    content = content.replace(/<meta[^>]*name="twitter:description"[^>]*>/g, '');
    
    // Replace <title>
    if (filepath.includes("index-template.html")) {
        content = content.replace(/<title>.*?<\/title>/, '<title>{{title}} | Turpone Foods</title>\n<meta name="description" content="{{seo_description}}">\n<meta property="og:title" content="{{title}} | Turpone Foods">\n<meta property="og:description" content="{{seo_description}}">\n<link rel="canonical" href="{{canonical_url}}">');
    } else {
        content = content.replace(/<title>.*?<\/title>/, '<title>{{seo_title}} | Turpone Foods</title>\n<meta name="description" content="{{seo_description}}">\n<meta property="og:title" content="{{seo_title}} | Turpone Foods">\n<meta property="og:description" content="{{seo_description}}">\n<link rel="canonical" href="{{canonical_url}}">');
    }
    
    // Remove any empty lines
    content = content.replace(/\n\s*\n/g, '\n');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log("Updated " + filepath);
}
updateTemplate('recipes/template.html');
updateTemplate('recipes/index-template.html');
