const fs = require('fs');
const cheerio = require('cheerio');

const localHtml = fs.readFileSync('turpone_local.html', 'utf8');
const staticHtml = fs.readFileSync('turpone-products/index.html', 'utf8');

const $local = cheerio.load(localHtml);
const $static = cheerio.load(staticHtml);

const gallerySelector = '.elementor-widget-gallery[data-id="89c4864"]';
console.log('Local:', $local(gallerySelector).length);
console.log('Static:', $static(gallerySelector).length);
