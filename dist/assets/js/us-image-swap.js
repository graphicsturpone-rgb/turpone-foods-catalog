(async function() {
    try {
        // Fetch user location from GeoJS API
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!response.ok) return;
        
        const data = await response.json();
        
        // If the user is in the United States
        if (data.country === 'US') {
            console.log('US visitor detected. Swapping to US-specific product images.');
            
            function swapImages() {
                // 1. Swap normal <img> tags
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.includes('/ca_imgs/')) {
                        img.setAttribute('src', src.replace('/ca_imgs/', '/us_imgs/'));
                    }
                    
                    const srcset = img.getAttribute('srcset');
                    if (srcset && srcset.includes('/ca_imgs/')) {
                        img.setAttribute('srcset', srcset.replace(/\/ca_imgs\//g, '/us_imgs/'));
                    }
                });

                // Swap anchor hrefs for gallery lightboxes
                const galleryLinks = document.querySelectorAll('a.elementor-gallery-item');
                galleryLinks.forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && href.includes('/ca_imgs/')) {
                        a.setAttribute('href', href.replace('/ca_imgs/', '/us_imgs/'));
                    }
                });

                // 2. Swap Elementor background images if they use inline styles
                const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
                elementsWithBg.forEach(el => {
                    const style = el.getAttribute('style');
                    if (style && style.includes('/ca_imgs/')) {
                        el.setAttribute('style', style.replace(/\/ca_imgs\//g, '/us_imgs/'));
                    }
                });

                // 3. Swap Elementor data-settings attributes (used for background images)
                const elementsWithData = document.querySelectorAll('[data-settings*="ca_imgs"]');
                elementsWithData.forEach(el => {
                    const dataSettings = el.getAttribute('data-settings');
                    if (dataSettings) {
                        // Elementor heavily escapes URLs in JSON e.g. \/assets\/images\/ca_imgs\/
                        const newData = dataSettings
                            .replace(/\/ca_imgs\//g, '/us_imgs/')
                            .replace(/\\\\\/ca_imgs\\\\\//g, '\\/us_imgs\\/');
                        el.setAttribute('data-settings', newData);
                    }
                });
            }
            
            // Run immediately on load
            swapImages();
            
            // Re-run if DOM changes (useful for Elementor carousels, lazy loading, etc)
            const observer = new MutationObserver((mutations) => {
                let shouldSwap = false;
                for (const m of mutations) {
                    if (m.addedNodes.length > 0 || m.attributeName === 'src' || m.attributeName === 'style' || m.attributeName === 'data-settings') {
                        shouldSwap = true;
                        break;
                    }
                }
                if (shouldSwap) {
                    swapImages();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'style', 'data-settings', 'srcset']
            });
        }
    } catch (e) {
        console.error('Failed to detect user location for image swap:', e);
    }
})();
