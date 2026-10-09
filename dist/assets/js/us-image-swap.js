/**
 * Unified Market & Geolocation Engine for Turpone Foods
 * Detects visitor country (US vs CA), manages market state in localStorage,
 * and handles dynamic image path switching across the site.
 */
(function() {
    // 1. Market Resolver
    function getStoredMarket() {
        return localStorage.getItem('turpone_market');
    }

    function setStoredMarket(market) {
        localStorage.setItem('turpone_market', market.toUpperCase());
        window.dispatchEvent(new CustomEvent('turpone:market-changed', { detail: { market: market.toUpperCase() } }));
    }

    // Default or detected market
    let activeMarket = getStoredMarket() || 'CA';

    // 2. Global helper exposed on window
    window.TurponeMarket = {
        getMarket: function() {
            return activeMarket;
        },
        setMarket: function(market) {
            activeMarket = market.toUpperCase();
            setStoredMarket(activeMarket);
            applyMarketImages(activeMarket);
            // If on product detail or catalog page, re-render
            if (typeof renderStores === 'function') {
                renderStores();
            }
            if (typeof renderDetailPage === 'function') {
                renderDetailPage();
            }
        },
        isUS: function() {
            return activeMarket === 'US';
        }
    };

    function applyMarketImages(market) {
        const fromFolder = market === 'US' ? '/ca_imgs/' : '/us_imgs/';
        const toFolder = market === 'US' ? '/us_imgs/' : '/ca_imgs/';

        // 1. Swap normal <img> tags
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.includes(fromFolder)) {
                img.setAttribute('src', src.replace(fromFolder, toFolder));
            }
            const srcset = img.getAttribute('srcset');
            if (srcset && srcset.includes(fromFolder)) {
                img.setAttribute('srcset', srcset.replace(new RegExp(fromFolder, 'g'), toFolder));
            }
        });

        // 2. Swap gallery links
        const galleryLinks = document.querySelectorAll('a.elementor-gallery-item, a[href*="ca_imgs"], a[href*="us_imgs"]');
        galleryLinks.forEach(a => {
            const href = a.getAttribute('href');
            if (href && href.includes(fromFolder)) {
                a.setAttribute('href', href.replace(fromFolder, toFolder));
            }
        });

        // 3. Swap Elementor styles
        const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
        elementsWithBg.forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes(fromFolder)) {
                el.setAttribute('style', style.replace(new RegExp(fromFolder, 'g'), toFolder));
            }
        });
    }

    // 3. Async Geolocation Check (if no manual preference previously stored)
    async function initGeoDetection() {
        const manualPref = getStoredMarket();
        if (!manualPref) {
            try {
                const response = await fetch('https://get.geojs.io/v1/ip/country.json');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.country === 'US') {
                        activeMarket = 'US';
                        setStoredMarket('US');
                    } else {
                        activeMarket = 'CA';
                        setStoredMarket('CA');
                    }
                }
            } catch (e) {
                console.warn('GeoJS lookup skipped, using default market CA', e);
            }
        }
        applyMarketImages(activeMarket);
    }

    // Run on ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGeoDetection);
    } else {
        initGeoDetection();
    }

    // Observe DOM mutations to ensure lazy-loaded elements respect market
    const observer = new MutationObserver((mutations) => {
        let shouldSwap = false;
        for (const m of mutations) {
            if (m.addedNodes.length > 0 || m.attributeName === 'src' || m.attributeName === 'style') {
                shouldSwap = true;
                break;
            }
        }
        if (shouldSwap && activeMarket === 'US') {
            applyMarketImages('US');
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style', 'srcset']
    });
})();
