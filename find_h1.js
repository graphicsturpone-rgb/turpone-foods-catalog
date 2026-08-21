const fs = require('fs');

const html = fs.readFileSync('about-us/index.html', 'utf8');
const h1Pos = html.indexOf('<h1 class="elementor-heading-title elementor-size-default">About Turpone Group & Turpone Foods</h1>');
if (h1Pos !== -1) {
    const context = html.substring(h1Pos, h1Pos + 200);
    console.log(context);
}
