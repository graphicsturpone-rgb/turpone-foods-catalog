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
    const langPath = window.location.pathname;
    let currentLang = 'en';
    if (langPath.includes('/fr/')) currentLang = 'fr';
    else if (langPath.includes('/es/')) currentLang = 'es';

    const categoryDescriptions = {
        en: {
            'all': 'Martha Stewart introduces a refined line of new food products that reflects her signature blend of elegance and everyday practicality. The collection features artisanal pizzas crafted with carefully selected ingredients, thoughtfully balanced seasoning blends designed to elevate home cooking, rich and floral honeys sourced for depth of flavor, and premium olive oils chosen for their smooth, nuanced profiles. Each product is developed with an emphasis on quality, simplicity, and versatility—bringing a touch of gourmet sophistication to the modern kitchen while remaining approachable for everyday use.',
            '0': 'Discover the Martha Stewart Infused Extra-Virgin Olive Oil collection, thoughtfully crafted to bring vibrant, nuanced flavors to your everyday cooking. Whether you\'re drizzling over a fresh salad, finishing a roasted dish, or dipping with artisanal bread, these premium oils add a touch of gourmet sophistication to any meal.',
            '1': 'The Martha Stewart Honey Drizzle collection offers a beautifully balanced touch of natural sweetness to complement your culinary creations. Perfect for finishing a savory pizza, drizzling over cheese boards, or stirring into marinades, these rich honeys are selected for their depth of flavor and culinary versatility.',
            '2': 'The Martha Stewart Pizza Seasonings collection brings expertly blended herbs and spices to your kitchen, designed to elevate every slice. Whether you prefer a classic Italian herb profile or a bold, spicy kick, these seasonings provide the perfect finishing touch to homemade or freshly baked pizzas.',
            '3': 'Experience the authentic taste of Italy with the Martha Stewart Pizza Sauce collection. Made from vine-ripened tomatoes and carefully selected herbs, these rich and robust sauces serve as the perfect foundation for any artisanal pizza, delivering a vibrant, homestyle flavor in every bite.',
            '4': 'The foundation of an exceptional pizza starts with the finest ingredients. The Martha Stewart Pizza Flour collection features premium, finely milled flours specifically crafted to help you achieve the perfect crust at home—whether you prefer a light, airy Neapolitan style or a crisp, sturdy base.',
            '5': 'The Martha Stewart Frozen Dough selection makes gourmet pizza preparation effortless without compromising on artisanal quality. Pre-portioned and ready to thaw, this premium dough yields a perfectly textured crust that bakes beautifully in your home oven.',
            '6': 'Enjoy artisanal quality from the comfort of your home with the Martha Stewart Frozen Pizza collection. Crafted with a perfectly baked crust, rich sauces, and premium toppings, these ready-to-bake pizzas offer a convenient yet elevated dining experience.',
            '7': 'The Martha Stewart Pinsa collection offers a light, airy, and highly digestible alternative to traditional pizza. Made with a specialized blend of flours and a long-fermentation process, these frozen pinsa crusts deliver a delightfully crisp exterior and a soft, cloud-like center.'
        },
        fr: {
            'all': 'Martha Stewart présente une gamme raffinée de nouveaux produits alimentaires qui reflète son mélange emblématique d\'élégance et de sens pratique au quotidien. La collection propose des pizzas artisanales préparées avec des ingrédients soigneusement sélectionnés, des mélanges d\'assaisonnements judicieusement équilibrés conçus pour sublimer la cuisine maison, des miels riches et floraux sélectionnés pour leur profondeur de goût, et des huiles d\'olive de qualité supérieure choisies pour leurs profils doux et nuancés. Chaque produit est développé en mettant l\'accent sur la qualité, la simplicité et la polyvalence — apportant une touche de sophistication gourmande à la cuisine moderne tout en restant accessible pour un usage quotidien.',
            '0': 'Découvrez la collection d\'Huiles d\'Olive Vierge Extra Infusées Martha Stewart, conçues pour apporter des saveurs vibrantes à votre cuisine. Parfaites pour arroser une salade, sublimer un plat rôti ou tremper un pain artisanal.',
            '1': 'La collection de Miels Martha Stewart offre une touche de douceur naturelle équilibrée pour vos créations culinaires. Idéale pour finir une pizza salée, accompagner un plateau de fromages ou relever des marinades.',
            '2': 'La collection d\'Assaisonnements pour Pizza Martha Stewart apporte des herbes et épices parfaitement mélangées, conçues pour sublimer chaque part de pizza, qu\'elle soit classique ou épicée.',
            '3': 'Découvrez le goût authentique de l\'Italie avec la collection de Sauces à Pizza Martha Stewart. À base de tomates mûries au soleil, elles constituent la base idéale pour toute pizza artisanale.',
            '4': 'La base d\'une pizza exceptionnelle commence par les meilleurs ingrédients. La collection de Farines Martha Stewart vous aide à obtenir une croûte parfaite à la maison.',
            '5': 'La sélection de Pâtes Surgelées Martha Stewart rend la préparation d\'une pizza gastronomique facile sans compromettre la qualité. Prête à décongeler, elle offre une croûte à la texture parfaite.',
            '6': 'Profitez d\'une qualité artisanale avec la collection de Pizzas Surgelées Martha Stewart. Fabriquées avec une croûte cuite à la perfection et des garnitures de premier choix.',
            '7': 'La collection de Pinsa Martha Stewart offre une alternative légère et très digeste à la pizza traditionnelle. Fabriquées avec un mélange de farines spécial, elles offrent un centre moelleux et une croûte croustillante.'
        },
        es: {
            'all': 'Marta Stewart presenta una línea refinada de nuevos productos alimenticios que reflejan su combinación característica de elegancia y practicidad diaria. La colección incluye pizzas artesanales elaboradas con ingredientes cuidadosamente seleccionados, mezclas de condimentos equilibradas para elevar la cocina casera, mieles ricas y florales, y aceites de oliva de primera calidad. Cada producto se desarrolla con énfasis en la calidad, simplicidad y versatilidad.',
            '0': 'Descubra la colección de Aceite de Oliva Virgen Extra Infusionado Marta Stewart, cuidadosamente elaborados para aportar sabores vibrantes y matizados a su cocina diaria. Perfectos para ensaladas o platos asados.',
            '1': 'La colección de Miel Marta Stewart ofrece un toque equilibrado de dulzura natural. Perfecta para terminar una pizza sabrosa, añadir a tablas de quesos o mezclar en marinadas.',
            '2': 'La colección de Condimentos para Pizza Marta Stewart trae hierbas y especias expertamente mezcladas a su cocina, diseñadas para elevar cada rebanada.',
            '3': 'Experimente el auténtico sabor de Italia con la colección de Salsas para Pizza Marta Stewart. Hechas con tomates madurados en la enredadera y hierbas seleccionadas, son la base perfecta.',
            '4': 'La base de una pizza excepcional comienza con los mejores ingredientes. La colección de Harinas para Pizza Marta Stewart le ayuda a lograr la masa perfecta en casa.',
            '5': 'La selección de Masa Congelada Marta Stewart facilita la preparación de pizzas gourmet. Lista para descongelar, esta masa de primera calidad produce una corteza con una textura perfecta.',
            '6': 'Disfrute de la calidad artesanal desde la comodidad de su hogar con la colección de Pizzas Congeladas Marta Stewart. Elaboradas con salsas ricas y coberturas de primera calidad.',
            '7': 'La colección de Pinsa Marta Stewart ofrece una alternativa ligera y muy digerible a la pizza tradicional. Hechas con una mezcla especializada de harinas y una fermentación larga.'
        }
    };

    const targetDescEl = document.querySelector('p[data-cms-id="products.martha.desc"]');
    const filterTags = document.querySelectorAll('.elementor-gallery-title');

    if (targetDescEl && filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Read the data-gallery-index directly instead of matching string text
                const index = this.getAttribute('data-gallery-index');
                if (index && categoryDescriptions[currentLang] && categoryDescriptions[currentLang][index]) {
                    // Update text instantly
                    targetDescEl.style.opacity = 0; // Simple fade effect
                    setTimeout(() => {
                        targetDescEl.innerHTML = categoryDescriptions[currentLang][index];
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
        
        const promoLink = document.createElement('a');
        promoLink.href = 'https://www.specialtyfood.com/fancy-food-shows/summer/';
        promoLink.target = '_blank';
        promoLink.style.display = 'block';

        const promoImg = document.createElement('img');
        promoImg.src = '/assets/images/big_banner.webp';
        promoImg.style.cssText = 'max-width: 100%; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); display: block; object-fit: contain;';
        
        promoLink.appendChild(promoImg);
        promoContainer.appendChild(promoCloseBtn);
        promoContainer.appendChild(promoLink);
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
    
    const headerBannerLink = document.createElement('a');
    headerBannerLink.href = 'https://www.specialtyfood.com/fancy-food-shows/summer/';
    headerBannerLink.target = '_blank';
    headerBannerLink.style.display = 'block';

    const headerBannerImg = document.createElement('img');
    headerBannerImg.src = '/assets/images/small_banner.webp';
    headerBannerImg.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 0 auto; vertical-align: top; max-height: 80px; object-fit: contain;'; 
    
    headerBannerLink.appendChild(headerBannerImg);
    headerBannerOverlay.appendChild(headerBannerLink);
    
    // Inject at the very top of the body
    if (document.body.firstChild) {
        document.body.insertBefore(headerBannerOverlay, document.body.firstChild);
    } else {
        document.body.appendChild(headerBannerOverlay);
    }

    // Advanced Smooth Scroll Animations Engine
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    });

    // Select elements to animate, explicitly excluding the header navigation and the global banner we just injected
    const elementsToAnimate = document.querySelectorAll(`
        main h1, main h2, main h3, main p, 
        .elementor-section:not(.elementor-location-header) .elementor-widget-image img,
        .elementor-section:not(.elementor-location-header) .elementor-button
    `);

    elementsToAnimate.forEach((el, index) => {
        // Add base class
        el.classList.add('reveal-on-scroll');
        // Add a slight stagger delay based on DOM order for a beautiful waterfall effect
        el.style.transitionDelay = `${(index % 5) * 0.1}s`;
        revealObserver.observe(el);
    });

    // Advanced Lightbox Navigation (Safe Mode - Does not destroy existing Elementor bindings)
    const customLightbox = document.getElementById('custom-lightbox');
    if (customLightbox) {
        // Inject arrows if they don't exist
        if (!document.getElementById('lightbox-prev')) {
            const prevArrow = document.createElement('div');
            prevArrow.id = 'lightbox-prev';
            prevArrow.className = 'lightbox-arrow lightbox-prev';
            prevArrow.innerHTML = '&#10094;';
            customLightbox.appendChild(prevArrow);

            const nextArrow = document.createElement('div');
            nextArrow.id = 'lightbox-next';
            nextArrow.className = 'lightbox-arrow lightbox-next';
            nextArrow.innerHTML = '&#10095;';
            customLightbox.appendChild(nextArrow);
        }

        const lightboxImgObj = document.getElementById('lightbox-img');
        const lightboxCapObj = document.getElementById('lightbox-caption');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        let currentGroup = [];
        let currentIndex = 0;

        // Simply add our own listener alongside the inline script
        document.querySelectorAll('.elementor-gallery-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                // Find siblings to build the gallery group based on the parent container
                const container = item.closest('.elementor-gallery__container') || item.closest('.e-con-inner') || item.parentElement;
                
                // Only select images that are currently visible (not hidden by category filters)
                const siblings = Array.from(container.querySelectorAll('.elementor-gallery-item')).filter(sib => {
                    return sib.offsetParent !== null && !sib.classList.contains('e-gallery-item--hidden');
                });
                
                currentGroup = siblings.map(sib => {
                    let url = sib.getAttribute('href');
                    if (url) {
                        var filename = url.substring(url.lastIndexOf('/') + 1);
                        url = '/assets/images/' + filename;
                    }
                    const titleEl = sib.querySelector('.elementor-gallery-item__title');
                    const titleText = titleEl ? titleEl.textContent.trim() : (sib.getAttribute('data-elementor-lightbox-title') || '');
                    return { url, title: titleText };
                }).filter(obj => obj.url);

                // Find current index
                var origUrl = item.getAttribute('href');
                if(origUrl) {
                    var thisFilename = origUrl.substring(origUrl.lastIndexOf('/') + 1);
                    var resolvedUrl = '/assets/images/' + thisFilename;
                    currentIndex = currentGroup.findIndex(obj => obj.url === resolvedUrl);
                }
                if (currentIndex === -1) currentIndex = 0;

                // Sync arrows visibility based on gallery size
                prevBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
                nextBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
            });
        });

        function updateLightbox() {
            if (currentGroup.length === 0) return;
            const current = currentGroup[currentIndex];
            lightboxImgObj.src = current.url;
            lightboxCapObj.textContent = current.title;
        }

        function slideNext(e) {
            if (e) e.stopPropagation();
            if (currentGroup.length === 0) return;
            currentIndex = (currentIndex + 1) % currentGroup.length;
            updateLightbox();
        }

        function slidePrev(e) {
            if (e) e.stopPropagation();
            if (currentGroup.length === 0) return;
            currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
            updateLightbox();
        }

        nextBtn.addEventListener('click', slideNext);
        prevBtn.addEventListener('click', slidePrev);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!customLightbox.classList.contains('show')) return;
            if (e.key === 'ArrowRight') slideNext();
            if (e.key === 'ArrowLeft') slidePrev();
        });
    }

    // Dynamic Team Section (Bypasses Elementor HTML fragility)
    if (window.location.pathname.includes('/about-us') || document.querySelector('[data-e-type="container"][data-id="a2326b3"]')) {
        const teamContainer = document.querySelector('[data-e-type="container"][data-id="a2326b3"]');
        if (teamContainer) {
            const isFr = window.location.pathname.includes('/fr/');
            const isEs = window.location.pathname.includes('/es/');

            const t = {
                meetOurTeam: isFr ? "RENCONTREZ NOTRE ÉQUIPE" : (isEs ? "CONOCE A NUESTRO EQUIPO" : "MEET OUR TEAM")
            };

            const translateRole = (role) => {
                const roles = {
                    "Managing Director": isFr ? "Directeur Général" : (isEs ? "Director General" : "Managing Director"),
                    "Sales Director": isFr ? "Directeur des Ventes" : (isEs ? "Director de Ventas" : "Sales Director"),
                    "Lead Creative Designer": isFr ? "Concepteur Créatif Principal" : (isEs ? "Diseñador Creativo Principal" : "Lead Creative Designer"),
                    "E-Commerce Specialist": isFr ? "Spécialiste E-Commerce" : (isEs ? "Especialista en E-Commerce" : "E-Commerce Specialist"),
                    "Project Manager": isFr ? "Chef de Projet" : (isEs ? "Gerente de Proyecto" : "Project Manager"),
                    "Logistic Coordinator": isFr ? "Coordinateur Logistique" : (isEs ? "Coordinador de Logística" : "Logistic Coordinator"),
                    "Accounting": isFr ? "Comptabilité" : (isEs ? "Contabilidad" : "Accounting"),
                    "Culinary Director": isFr ? "Directeur Culinaire" : (isEs ? "Director Culinario" : "Culinary Director"),
                    "Marketing Coordinator": isFr ? "Coordinateur Marketing" : (isEs ? "Coordinador de Marketing" : "Marketing Coordinator")
                };
                return roles[role] || role;
            };

            const teamMembers = [
                { id: "member2", name: "Anthony Capone", role: "Managing Director", img: "Anthony%20Capone.webp" },
                { id: "member1", name: "Joe Turturici", role: "Sales Director", img: "Joe%20Turturici.webp" },
                { id: "member3", name: "Laura Trentadue", role: "Lead Creative Designer", img: "Laura%20Trentadue.webp" },
                { id: "member4", name: "Gianni Iaboni", role: "E-Commerce Specialist", img: "Gianni%20Iaboni.webp" },
                { id: "member5", name: "Maria Guarin", role: "Project Manager", img: "Maria%20Guarin.webp" },
                { id: "member6", name: "Rosemary Bruni", role: "Logistic Coordinator", img: "Rosemary%20Bruni.webp" },
                { id: "member7", name: "Beata Niyoyita", role: "Accounting", img: "Beata%20Niyoyita.webp" },
                { id: "member8", name: "Stephen Liu", role: "Accounting", img: "Stephen%20Liu.webp" },
                { id: "member9", name: "Tony Capone", role: "Culinary Director", img: "Tony%20Capone.webp" },
                { id: "member10", name: "Sara Turturici", role: "Marketing Coordinator", img: "Sara-Turturici.webp" }
            ];

            let html = `
                <div class="dynamic-team-section" data-cms-section="team">
                    <div class="dynamic-team-header">
                        <h2 data-cms-id="about.team.heading">${t.meetOurTeam}</h2>
                    </div>
                    <div class="dynamic-team-grid">
            `;

            teamMembers.forEach((member, index) => {
                const bossClass = (index < 2) ? ' boss-card' : '';
                html += `
                    <div class="dynamic-team-member${bossClass}">
                        <div class="member-photo-wrap">
                            <img loading="lazy" src="/assets/images/${member.img}" alt="${member.name}" data-cms-img="about.team.${member.id}_img">
                        </div>
                        <div class="member-info-wrap">
                            <h3 class="member-name" data-cms-id="about.team.${member.id}_name">${member.name}</h3>
                            <p class="member-title" data-cms-id="about.team.${member.id}_role">${translateRole(member.role)}</p>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;

            teamContainer.innerHTML = html;
        }
    }

});

// ==========================================
// FRONT-END SECURITY SHIELD
// ==========================================

// 1. Disable Right Click (Context Menu)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 2. Disable Developer Tools and View Source Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Prevent F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    // Prevent Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
    }
    // Prevent Ctrl+S / Cmd+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
    }
});
