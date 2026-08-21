const fs = require('fs');
const html = fs.readFileSync('turpone-products/index.html', 'utf8');

const products = [];
// This is a naive regex approach. It looks for image boxes.
const regex = /<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<h3 class="elementor-image-box-title">([^<]+)<\/h3>[\s\S]*?<p class="elementor-image-box-description">([\s\S]*?)<\/p>/g;

let match;
while ((match = regex.exec(html)) !== null) {
    products.push({
        image: match[1],
        title: match[2].trim(),
        description: match[3].trim().replace(/<[^>]+>/g, '') // remove inner HTML like <br>
    });
}

console.log(JSON.stringify(products, null, 2));
