const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'assets/images/us_imgs');

const files = fs.readdirSync(dir);
let renamed = 0;
for (const file of files) {
    if (file.endsWith('-US.webp') || file.endsWith('-US-US.webp') || file.endsWith('-us.webp')) {
        let newName = file.replace(/-US-US\.webp$/i, '.webp').replace(/-US\.webp$/i, '.webp');
        fs.renameSync(path.join(dir, file), path.join(dir, newName));
        renamed++;
    }
}
console.log('Renamed ' + renamed + ' files by stripping -US.');
