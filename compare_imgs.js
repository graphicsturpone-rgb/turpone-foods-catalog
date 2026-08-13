const fs = require('fs');
const path = require('path');

const caDir = path.join(__dirname, 'assets/images/ca_imgs');
const usDir = path.join(__dirname, 'assets/images/us_imgs');

const caFiles = fs.readdirSync(caDir).filter(f => f.endsWith('.webp'));
const usFiles = fs.readdirSync(usDir).filter(f => f.endsWith('.webp'));

console.log('## Image Name Comparison Report\n');

const matched = [];
const missingInUs = [];
const extraInUs = [];

for (const ca of caFiles) {
    if (usFiles.includes(ca)) {
        matched.push(ca);
    } else {
        missingInUs.push(ca);
    }
}

for (const us of usFiles) {
    if (!caFiles.includes(us)) {
        extraInUs.push(us);
    }
}

console.log('### Perfect Matches (' + matched.length + ')');
console.log('These images are correctly named in both folders and will swap flawlessly:\n');
for (const m of matched) {
    console.log('- ' + m);
}

console.log('\n### Missing US Versions (' + missingInUs.length + ')');
console.log('These Canadian images do not have an identically named US version. The script will safely skip them and just show the Canadian image:\n');
for (const m of missingInUs) {
    console.log('- ' + m);
}

console.log('\n### Orphaned US Images (' + extraInUs.length + ')');
console.log('These images are in the us_imgs folder, but there is no matching Canadian image in ca_imgs. The script will never use these because the names do not match:\n');
for (const m of extraInUs) {
    console.log('- ' + m);
}
