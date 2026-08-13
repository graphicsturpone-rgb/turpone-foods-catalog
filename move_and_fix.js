const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const imgDir = path.join(rootDir, 'assets/images');
const caDir = path.join(imgDir, 'ca_imgs');

// List of non-product images that should stay in assets/images
const ignoreList = [
    'Anthony Capone.webp', 'Anthony.webp', 'Beata Niyoyita.webp', 'big_banner.webp',
    'Brand-Appeal-Group.webp', 'carlos-ozuna.webp', 'Costco.webp', 'Earthbound-Brands.webp',
    'Gianni Iaboni.webp', 'Gordon-Food-Service.webp', 'happy_camper_green_ronzio_turpone_pizza_oven.webp',
    'Joe Turturici.webp', 'Joe.webp', 'Kehe.webp', 'Laura Trentadue.webp', 'Loblaws-Logo.webp', 'Longos.webp',
    'Maria Guarin.webp', 'Marquee-Brands.webp', 'Martha-Stewart.webp', 'Metro.webp',
    'MS-Silhouette.webp', 'MSK_Logo.webp', 'Nassau-Candy.webp', 'Publix.webp',
    'Rosemary Bruni.webp', 'Sams_Club.webp', 'Sara-Turturici.webp', 'Save-On-Foods.webp',
    'small_banner.webp', 'Stephen Liu.webp', 'Sysco-Logo.webp', 'Target.webp', 'TJX.webp',
    'Tony Capone.webp', 'turnkey-solution-scaled.webp', 'Turpone-Pantry-Banner.webp',
    'Turpone.webp', 'UNFI_logo.webp', 'Walmart.webp', 'web-image.webp'
];

let movedCount = 0;
const movedFiles = [];

const files = fs.readdirSync(imgDir);
for (const file of files) {
    if (file.endsWith('.webp') && !ignoreList.includes(file)) {
        movedFiles.push(file);
        fs.renameSync(path.join(imgDir, file), path.join(caDir, file));
        movedCount++;
    }
}

console.log('Moved ' + movedCount + ' product images to ca_imgs.');

// Now update all HTML files to point to the new paths
let updatedHtmlCount = 0;

function processHtmlFiles(dir) {
    const entries = fs.readdirSync(dir);
    for (const file of entries) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
                processHtmlFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const moved of movedFiles) {
                // Replace normal URLs
                const normalRegex = new RegExp('assets/images/' + moved, 'g');
                if (normalRegex.test(content)) {
                    content = content.replace(normalRegex, 'assets/images/ca_imgs/' + moved);
                    modified = true;
                }

                // Replace escaped URLs (e.g., \/assets\/images\/product.webp)
                const escapedMoved = moved.replace(/\./g, '\\.');
                const escapedRegex = new RegExp('\\\\/assets\\\\/images\\\\/' + escapedMoved, 'g');
                if (escapedRegex.test(content)) {
                    content = content.replace(escapedRegex, '\\/assets\\/images\\/ca_imgs\\/' + moved);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                updatedHtmlCount++;
            }
        }
    }
}

processHtmlFiles(rootDir);
console.log('Updated ' + updatedHtmlCount + ' HTML files.');
