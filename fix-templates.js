const fs = require('fs');
const path = require('path');

const filesToFix = ['recipes/template.html', 'recipes/index-template.html'];

filesToFix.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix CSS/JS paths
    content = content.replace(/\.\.\/assets\//g, '/assets/');
    
    // Inject {{body}} after the main image only in template.html
    if (file === 'recipes/template.html') {
        const imageTag = '<img src="{{image}}" alt="{{title}}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />';
        if (content.includes(imageTag) && !content.includes('{{body}}')) {
            const injectedContent = imageTag + '\n    </div>\n    \n    <div class="recipe-description" style="font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 50px;">\n        {{body}}\n    ';
            content = content.replace(imageTag + '\n    </div>', injectedContent);
        }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});
