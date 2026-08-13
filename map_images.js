const fs = require('fs');

const origFiles = fs.readFileSync('original_images.txt', 'ucs2').split('\n').map(l => l.trim()).filter(Boolean);
const usFiles = fs.readdirSync('assets/images/us_imgs').filter(f => f.endsWith('.webp'));

function scoreMatch(a, b) {
    const aClean = a.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bClean = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    let longestCommon = 0;
    for(let i=0; i<aClean.length; i++) {
        for(let j=i+1; j<=aClean.length; j++) {
            const sub = aClean.substring(i, j);
            if(bClean.includes(sub) && sub.length > longestCommon) {
                longestCommon = sub.length;
            }
        }
    }
    return longestCommon / Math.max(aClean.length, bClean.length);
}

const mapping = {};
for (const us of usFiles) {
    let bestMatch = null;
    let bestScore = 0;
    for (const orig of origFiles) {
        const score = scoreMatch(orig, us);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = orig;
        }
    }
    mapping[us] = bestMatch;
}

fs.writeFileSync('mapping_guess.json', JSON.stringify(mapping, null, 2));
