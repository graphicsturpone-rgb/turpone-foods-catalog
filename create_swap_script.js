const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'assets/images/us_imgs');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

const jsCode = 
(async function() {
    // List of available English-only images in the us_imgs folder
    const availableUsImages = ;

    try {
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!response.ok) return;
        const data = await response.json();
        
        if (data.country === 'US') {
            console.log('USA Visitor Detected: Swapping to English-only images');
            document.documentElement.classList.add('country-us');
            
            function swapImages() {
                const imgs = document.querySelectorAll('img');
                imgs.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.includes('/ca_imgs/')) {
                        const filename = src.split('/').pop();
                        // Only swap if the USA image actually exists in our folder
                        if (availableUsImages.includes(filename)) {
                            const newSrc = src.replace('/ca_imgs/', '/us_imgs/');
                            img.setAttribute('src', newSrc);
                            
                            // Clear srcset to ensure it doesn't try to load CA responsive images
                            if (img.hasAttribute('srcset')) {
                                img.removeAttribute('srcset');
                            }
                        }
                    }
                });
            }
            
            // Run immediately and also on DOMContentLoaded
            swapImages();
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', swapImages);
            }
        }
    } catch (error) {
        console.error('Geolocation failed:', error);
    }
})();
;

fs.writeFileSync(path.join(__dirname, 'assets/js/us-image-swap.js'), jsCode.trim());
console.log('Created assets/js/us-image-swap.js');
