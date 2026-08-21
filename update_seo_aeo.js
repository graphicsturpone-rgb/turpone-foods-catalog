const fs = require('fs');
const path = require('path');

const seoPayload = `
<!-- AEO / SEO Optimization -->
<meta name="keywords" content="martha, martha stewart, pizza, turpone foods, premium ingredients, food products, pizza dough, infused olive oil, recipes, food innovation">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Turpone Foods",
  "url": "https://turponefoods.com/",
  "description": "Premium food products, pizza dough, and infused olive oils featuring Martha Stewart.",
  "publisher": {
    "@type": "Organization",
    "name": "Turpone Foods",
    "logo": "https://turponefoods.com/assets/images/TF-LOgo.svg"
  }
}
</script>
</head>`;

function injectSeo(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'admin' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      injectSeo(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any previously injected payload so we don't duplicate
      if (content.includes('<!-- AEO / SEO Optimization -->')) {
         const regex = /<!-- AEO \/ SEO Optimization -->[\s\S]*?<\/script>\s*<\/head>/;
         content = content.replace(regex, '</head>');
      }

      // Inject the payload right before </head>
      content = content.replace('</head>', seoPayload);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Injected SEO into:', filePath);
    }
  }
}

injectSeo('.');
