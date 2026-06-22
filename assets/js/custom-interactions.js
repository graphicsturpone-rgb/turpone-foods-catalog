// Custom Vanilla JS for Mobile Menu and Lightbox (Replaces Elementor Free & jQuery)

document.addEventListener('DOMContentLoaded', () => {
    // Inject robust CSS for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .elementor-nav-menu--dropdown.custom-menu-active {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            position: fixed !important;
            left: 0 !important;
            width: 100vw !important;
            max-height: calc(100vh - 80px) !important;
            height: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
            overflow-y: auto !important;
            background-color: #fff !important;
            z-index: 9999 !important;
            padding: 10px 0 !important;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .elementor-nav-menu--dropdown.custom-menu-active ul {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .elementor-nav-menu--dropdown.custom-menu-active li {
            width: 100% !important;
            text-align: center !important;
        }
        .elementor-nav-menu--dropdown.custom-menu-active a {
            display: block !important;
            text-align: center !important;
            justify-content: center !important;
            padding: 15px !important;
            font-size: 18px !important;
        }
    `;
    document.head.appendChild(style);

    // 1. Mobile Menu Toggle
    const menuToggles = document.querySelectorAll('.elementor-menu-toggle');
    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            toggle.classList.toggle('elementor-active');
            
            // Find the dropdown menu that follows this toggle
            const dropdown = toggle.nextElementSibling;
            if (dropdown && dropdown.classList.contains('elementor-nav-menu--dropdown')) {
                dropdown.setAttribute('aria-hidden', isExpanded);
                if (!isExpanded) {
                    const header = document.querySelector('header') || toggle.closest('.elementor-location-header');
                    if (header) {
                        const headerRect = header.getBoundingClientRect();
                        dropdown.style.setProperty('top', headerRect.bottom + 'px', 'important');
                    }
                    dropdown.classList.add('custom-menu-active');
                } else {
                    dropdown.classList.remove('custom-menu-active');
                }
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        menuToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            if (dropdown && dropdown.classList.contains('custom-menu-active')) {
                if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.classList.remove('elementor-active');
                    dropdown.setAttribute('aria-hidden', 'true');
                    dropdown.classList.remove('custom-menu-active');
                }
            }
        });
    });

    // 2. Simple Lightbox
    const lightboxHtml = `
        <div id="custom-lightbox" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; justify-content:center; align-items:center; flex-direction:column;">
            <span id="custom-lightbox-close" style="position:absolute; top:20px; right:30px; color:white; font-size:40px; cursor:pointer; font-family:sans-serif;">&times;</span>
            <img id="custom-lightbox-img" style="max-width:90%; max-height:80vh; object-fit:contain; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5);" />
            <h3 id="custom-lightbox-title" style="color:white; margin-top:20px; font-family:'Poppins', sans-serif; font-weight:400; text-align:center;"></h3>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHtml);

    const lightbox = document.getElementById('custom-lightbox');
    const lightboxImg = document.getElementById('custom-lightbox-img');
    const lightboxTitle = document.getElementById('custom-lightbox-title');
    const lightboxClose = document.getElementById('custom-lightbox-close');

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') closeLightbox();
    });

    // Bind clicks to gallery items
    const galleryItems = document.querySelectorAll('a[data-elementor-open-lightbox="yes"], .e-gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = item.getAttribute('href');
            const title = item.getAttribute('data-elementor-lightbox-title') || '';
            
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxTitle.textContent = title;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Dynamic Category Text for Turpone Products
    const categoryDescriptions = {
        'all': 'Martha Stewart introduces a refined line of new food products that reflects her signature blend of elegance and everyday practicality. The collection features artisanal pizzas crafted with carefully selected ingredients, thoughtfully balanced seasoning blends designed to elevate home cooking, rich and floral honeys sourced for depth of flavor, and premium olive oils chosen for their smooth, nuanced profiles. Each product is developed with an emphasis on quality, simplicity, and versatility-bringing a touch of gourmet sophistication to the modern kitchen while remaining approachable for everyday use.',
        '0': 'Discover the Martha Stewart Infused Extra-Virgin Olive Oil collection—crafted to bring premium quality and exceptional flavor to any culinary lineup. Made from cold-pressed extra-virgin olive oil and natural ingredients, each distinct blend offers a sophisticated balance of rich taste and effortless depth.<br><br>Explore the range below to see how these expertly infused oils elevate everyday cooking, serving as the perfect addition for drizzling over artisan pizzas, tossing with pasta, or creating high-quality marinades, dressings, and finishes.',
        '1': 'The Martha Stewart Honey Drizzle collection brings innovative flavor profiles and exceptional quality to your product portfolio. Made with pure raw honey and natural ingredients, each thoughtfully curated selection offers a sophisticated balance of natural sweetness and distinct savory notes.<br><br>Explore the range below to see how these unique honey drizzles elevate everyday dishes, serving as a premium finishing touch for artisan pizzas, charcuterie boards, gourmet cheeses, and grilled meats or seafood.',
        '2': 'Discover the Martha Stewart Seasoning collection—crafted to deliver perfectly balanced, aromatic depth. Made with high-quality ingredients like pristine sea salt, vibrant herbs, and robust spices, each artisanal blend is designed for complete flavor consistency.<br><br>Explore the range below to see how these gourmet seasonings elevate everyday dishes, serving as the ideal premium addition for finishing artisan pizzas, crusts, roasted meats, vegetables, and specialty dressings.',
        '3': 'The Martha Stewart Pizza Sauce collection delivers premium, restaurant-quality foundations to any culinary lineup. Made from vine-ripened crushed tomatoes, olive oil, and aromatic herbs, each ready-to-use sauce delivers a rich, authentic, and perfectly balanced flavor profile.<br><br>Explore the range below to see how these exquisite pizza sauces elevate homemade creations, serving as the ideal base for artisan pizzas, Italian-style dishes, and curated pairings with gourmet toppings.',
        '4': 'Discover the Martha Stewart Pizza Dough Mix collection—expertly formulated to simplify the creation of exceptional, artisan crusts. Made from premium flours, these convenient mixes deliver the authentic textures of classic regional doughs, from a light, airy Neapolitan style to a soft, chewy New York style.<br><br>Explore the range below to see how these easy-to-use dough mixes deliver consistent, high-quality, and restaurant-style results every time.',
        '5': 'Discover the Martha Stewart Frozen Pizza Dough Ball collection—formulated to bring artisanal quality and reliable performance to your product lineup. Made from premium recipes utilizing high-quality ingredients like specialized 00 and 0 flours. These ready-to-thaw dough balls are exceptionally smooth, elastic, and easy to stretch.<br><br>Explore the range below to see how these convenient selections simplify the preparation of signature, large-format pizzas—from a puffy, lightly charred Neapolitan style to a thin, satisfyingly crispy New York style crust with a classic sourdough-inspired flavor.',
        '6': 'Discover the Martha Stewart Pizza collection—crafted to bring premium, stone-baked authenticity to a convenient frozen format. Built on a hand-stretched sourdough crust that is naturally fermented for 72 hours, these pizzas deliver a light, airy texture, a perfectly crispy exterior, and deep artisanal character.<br><br>Explore the range below to see how these selections pair gourmet flavor profiles—like smoky bacon with sweet caramelized onions, and savory Italian sausage with hot honey—to offer a premium, restaurant-quality solution ready in minutes.',
        '7': 'The Martha Stewart Pinsa collection brings authentic, Roman-style tradition to the frozen aisle. Built on a hand-stretched sourdough crust that is naturally fermented for 72 hours, these selections deliver an exceptional, light, and airy interior with a perfectly crisp exterior.<br><br>Explore the range below to see how these convenient, expertly crafted options combine sophisticated, high-quality toppings with traditional, slow-fermented dough to offer a premium, restaurant-quality solution that prepares from frozen in minutes.'
    };

    const targetDescEl = document.querySelector('p[data-cms-id="products.martha.desc"]');
    const filterTags = document.querySelectorAll('.elementor-gallery-title');

    if (targetDescEl && filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Read the data-gallery-index directly instead of matching string text
                const index = this.getAttribute('data-gallery-index');
                if (index && categoryDescriptions[index]) {
                    // Update text instantly
                    targetDescEl.style.opacity = 0; // Simple fade effect
                    setTimeout(() => {
                        targetDescEl.innerHTML = categoryDescriptions[index];
                        targetDescEl.style.opacity = 1;
                    }, 200);
                }
            });
        });
        
        
        // Add CSS transition for smooth text fade
        targetDescEl.style.transition = 'opacity 0.2s ease-in-out';
    }

    // Promotional Image Popup (Homepage Only)
    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('/index.html') || path === '/es/' || path === '/fr/';
    
    if (isHomePage) {
        // Build Popup DOM dynamically
        const promoOverlay = document.createElement('div');
        promoOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; z-index: 2147483647; opacity: 0; transition: opacity 0.4s ease; padding: 20px; box-sizing: border-box;';
        
        const promoContainer = document.createElement('div');
        promoContainer.style.cssText = 'position: relative; max-width: 90vw; max-height: 90vh; transform: scale(0.95); transition: transform 0.4s ease;';
        
        const promoCloseBtn = document.createElement('button');
        promoCloseBtn.innerHTML = '&times;';
        promoCloseBtn.style.cssText = 'position: absolute; top: -45px; right: -10px; background: none; border: none; color: #fff; font-size: 45px; cursor: pointer; line-height: 1; padding: 0;';
        
        const promoImg = document.createElement('img');
        promoImg.src = 'https://nvyt.es/banner/ace5b664c0878ee33afd';
        promoImg.style.cssText = 'max-width: 100%; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); display: block; object-fit: contain;';
        
        promoContainer.appendChild(promoCloseBtn);
        promoContainer.appendChild(promoImg);
        promoOverlay.appendChild(promoContainer);
        document.body.appendChild(promoOverlay);

        let promoAutoCloseTimer;

        const closePromo = () => {
            promoOverlay.style.opacity = '0';
            promoContainer.style.transform = 'scale(0.95)';
            setTimeout(() => { promoOverlay.style.display = 'none'; }, 400);
            clearTimeout(promoAutoCloseTimer); // Prevent double-closing if they manually close it early
        };

        promoCloseBtn.addEventListener('click', closePromo);
        promoOverlay.addEventListener('click', (e) => {
            if (e.target === promoOverlay) closePromo();
        });

        // Open after 3 seconds
        setTimeout(() => {
            promoOverlay.style.display = 'flex';
            // Small delay to ensure display:flex is applied before starting opacity transition
            setTimeout(() => {
                promoOverlay.style.opacity = '1';
                promoContainer.style.transform = 'scale(1)';
            }, 50);
            
            // Disappear automatically in 7 seconds after opening
            promoAutoCloseTimer = setTimeout(closePromo, 7000);
        }, 3000);
    }

    // Global Header Announcement Banner
    const headerBannerOverlay = document.createElement('div');
    headerBannerOverlay.style.cssText = 'width: 100%; background-color: #1a1a1a; text-align: center; display: block; line-height: 0; border-bottom: 1px solid #333; z-index: 999999; position: relative;';
    
    const headerBannerImg = document.createElement('img');
    headerBannerImg.src = 'https://nvyt.es/banner/565b68c8d0735afc9c1a';
    headerBannerImg.style.cssText = 'max-width: 100%; height: auto; display: inline-block; vertical-align: top; max-height: 80px; object-fit: contain;'; // Assuming it's a thin banner, limit height just in case
    
    headerBannerOverlay.appendChild(headerBannerImg);
    
    // Inject at the very top of the body
    if (document.body.firstChild) {
        document.body.insertBefore(headerBannerOverlay, document.body.firstChild);
    } else {
        document.body.appendChild(headerBannerOverlay);
    }
});
