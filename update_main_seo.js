const fs = require('fs');

// Index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/<title>.*?<\/title>/, "<title>Turpone Foods | Premium Pizza Ovens & Martha Stewart's Food Products</title>");
indexContent = indexContent.replace(/<meta name="description" content="Turpone Foods is a global corporation[^"]*">/, '<meta name="description" content="Turpone Foods is a global corporation specializing in premium outdoor pizza ovens, grills, and the exclusive line of Martha Stewart\'s Food Products.">');
indexContent = indexContent.replace(/Specializing in high-technology pizza ovens and premium grilling solutions/g, "Specializing in high-technology pizza ovens, premium grilling solutions, and Martha Stewart's Food Products");
fs.writeFileSync('index.html', indexContent);

// Turpone Products
let productsContent = fs.readFileSync('turpone-products/index.html', 'utf8');
productsContent = productsContent.replace(/<title>.*?<\/title>/, "<title>Our Products | Martha Stewart's Food Products | Turpone Foods</title>");
productsContent = productsContent.replace(/<meta name="description" content="Turpone Foods is a global corporation[^"]*">/, '<meta name="description" content="Explore our curated selection of premium ingredients, featuring the complete line of Martha Stewart\'s Food Products, from infused olive oils to authentic pizza dough.">');
productsContent = productsContent.replace(/Explore Martha Stewart Products/g, "Explore Martha Stewart's Food Products");
productsContent = productsContent.replace(/Martha Stewart introduces a refined line/g, "Martha Stewart's Food Products introduces a refined line");
fs.writeFileSync('turpone-products/index.html', productsContent);

// About Us
let aboutContent = fs.readFileSync('about-us/index.html', 'utf8');
aboutContent = aboutContent.replace(/<title>.*?<\/title>/, "<title>About Us | Turpone Foods & Martha Stewart's Food Products</title>");
aboutContent = aboutContent.replace(/<meta name="description" content="Turpone Foods is a global corporation[^"]*">/, '<meta name="description" content="Learn about Turpone Foods\' mission to bring food innovation, premium pizza ovens, and Martha Stewart\'s Food Products to your kitchen.">');
aboutContent = aboutContent.replace(/bringing innovation, sustainability, and commercialization to food and food-related products/g, "bringing innovation, sustainability, and commercialization to food, food-related products, and the exclusive line of Martha Stewart's Food Products");
fs.writeFileSync('about-us/index.html', aboutContent);

// Services
let servicesContent = fs.readFileSync('services/index.html', 'utf8');
servicesContent = servicesContent.replace(/<title>.*?<\/title>/, "<title>Retail & Food Services | Martha Stewart's Food Products | Turpone Foods</title>");
servicesContent = servicesContent.replace(/<meta name="description" content="Turpone Foods is a global corporation[^"]*">/, '<meta name="description" content="Discover Turpone Foods\' retail and food services, engineered for growth and scaled for impact. Proud purveyors of Martha Stewart\'s Food Products.">');
servicesContent = servicesContent.replace(/Engineered for growth and scaled for impact./g, "Engineered for growth and scaled for impact, proudly featuring Martha Stewart's Food Products.");
fs.writeFileSync('services/index.html', servicesContent);

console.log('SEO updates applied.');
