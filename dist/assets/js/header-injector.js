document.write(`
<style>
/* Global Header & Container Padding: exactly 5px top and bottom */
.elementor-location-header,
header.elementor-location-header,
.elementor-element-4dc4acd,
.elementor-element-4dc4acd.logo-sticky,
.elementor-element-4dc4acd > .e-con-inner {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
}

/* Home Page Header: Fixed / Sticky to top while transparent over hero ONLY on home pages */
body.home:not(.page-products) .elementor-location-header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    z-index: 9999 !important;
    background: transparent !important;
    background-color: transparent !important;
    transition: background-color 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease !important;
}
body.home:not(.page-products) .elementor-element-4dc4acd {
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
}

/* Scrolled state: frosted semi-transparent background when user scrolls down */
body.home:not(.page-products).scrolled .elementor-location-header,
body.home:not(.page-products) .elementor-location-header.is-scrolled {
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
}

/* Logo & Navigation vertical alignment */
.elementor-24 .elementor-element.elementor-element-823fde1 img {
    height: auto !important;
    max-height: 50px !important;
    width: auto !important;
    display: block !important;
}
.elementor-24 .elementor-element.elementor-element-40b1f9e .elementor-nav-menu--main .elementor-item {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
}
</style>
<header class="elementor elementor-24 elementor-location-header" data-elementor-id="24" data-elementor-post-type="elementor_library" data-elementor-type="header"><div class="elementor-element elementor-element-4dc4acd logo-sticky e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="4dc4acd" data-settings='{"background_background":"classic","sticky":"top","animation":"slideInDown","sticky_effects_offset":50,"sticky_on":["desktop","tablet","mobile"],"sticky_offset":0,"sticky_anchor_link_offset":0}'><div class="e-con-inner"><div class="elementor-element elementor-element-b906c95 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="b906c95"><div class="elementor-element elementor-element-823fde1 elementor-widget elementor-widget-theme-site-logo elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="823fde1" data-widget_type="theme-site-logo.default"><div class="elementor-widget-container"><a href="/"><img alt="Turpone Foods Logo" class="attachment-full size-full wp-image-1594" fetchpriority="high" height="805" src="/assets/images/TF-LOgo.svg" width="841"/></a></div></div></div><div class="elementor-element elementor-element-58b26a2 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="58b26a2"><div class="elementor-element elementor-element-40b1f9e elementor-nav-menu--stretch elementor-nav-menu__align-center elementor-nav-menu--dropdown-mobile elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-e-type="widget" data-element_type="widget" data-id="40b1f9e" data-settings='{"full_width":"stretch","layout":"horizontal","submenu_icon":{"value":"&lt;svg aria-hidden=\"true\" class=\"e-font-icon-svg e-fas-caret-down\" viewBox=\"0 0 320 512\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\"&gt;&lt;path d=\"M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z\"&gt;&lt;\/path&gt;&lt;\/svg&gt;","library":"fa-solid"},"toggle":"burger"}' data-widget_type="nav-menu.default"><div class="elementor-widget-container"><nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-slide"><ul class="elementor-nav-menu" id="menu-1-40b1f9e"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home page_item page-item-9 menu-item-2859"><a class="elementor-item" href="/">Home</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page"><a  class="elementor-item" href="/products/">Products</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-202"><a class="elementor-item" href="/about-us/">About Us</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-201"><a class="elementor-item" href="/services/">Services</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3257"><a class="elementor-item" href="/partners/">Partners</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1860"><a class="elementor-item" href="/turpone-products/">Food Services</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-recipes"><a class="elementor-item" href="/recipes/">Recipes</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28"><a class="elementor-item" href="/contact/">Contact</a></li></ul></nav><div aria-expanded="false" aria-label="Menu Toggle" class="elementor-menu-toggle" role="button" tabindex="0"><svg aria-hidden="true" class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" role="presentation" viewbox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path></svg><svg aria-hidden="true" class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" role="presentation" viewbox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path></svg></div><nav aria-hidden="true" class="elementor-nav-menu--dropdown elementor-nav-menu__container"><ul class="elementor-nav-menu" id="menu-2-40b1f9e"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home page_item page-item-9 menu-item-2859"><a class="elementor-item" href="/" tabindex="-1">Home</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page"><a  class="elementor-item" href="/products/">Products</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-202"><a class="elementor-item" href="/about-us/" tabindex="-1">About Us</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-201"><a class="elementor-item" href="/services/" tabindex="-1">Services</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3257"><a class="elementor-item" href="/partners/" tabindex="-1">Partners</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1860"><a class="elementor-item" href="/turpone-products/" tabindex="-1">Food Services</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-recipes"><a class="elementor-item" href="/recipes/">Recipes</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28"><a class="elementor-item" href="/contact/" tabindex="-1">Contact</a></li></ul></nav></div></div><div class="elementor-element elementor-element-003e48c elementor-hidden-mobile elementor-widget elementor-widget-html" data-e-type="widget" data-element_type="widget" data-id="003e48c" data-widget_type="html.default"><div class="elementor-widget-container"><div class="lang-switcher"><a class="lang-btn" href="#" id="lang-btn-en">EN</a><span class="lang-separator">|</span><a class="lang-btn" href="#" id="lang-btn-fr">FR</a><span class="lang-separator">|</span><a class="lang-btn" href="#" id="lang-btn-es">ES</a></div></div></div></div></div></div></header>`);

(function() {
    function updateActiveNav() {
        var path = window.location.pathname.toLowerCase();
        // Remove index.html
        if (path.endsWith('/index.html')) {
            path = path.slice(0, -10);
        }
        // Normalize trailing slash (keep single slash for root)
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        if (!path) path = '/';

        var navLinks = document.querySelectorAll('.elementor-nav-menu a.elementor-item');
        if (!navLinks || navLinks.length === 0) return;

        navLinks.forEach(function(a) {
            var href = a.getAttribute('href');
            if (!href) return;
            var cleanHref = href.toLowerCase();
            if (cleanHref.endsWith('/index.html')) cleanHref = cleanHref.slice(0, -10);
            if (cleanHref.length > 1 && cleanHref.endsWith('/')) cleanHref = cleanHref.slice(0, -1);
            if (!cleanHref) cleanHref = '/';

            var isActive = false;
            if (cleanHref === '/' || cleanHref === '/fr' || cleanHref === '/es') {
                isActive = (path === '/' || path === '/fr' || path === '/es');
            } else {
                isActive = (path === cleanHref || path.startsWith(cleanHref + '/'));
            }

            var li = a.closest('li');
            if (isActive) {
                a.classList.add('elementor-item-active');
                a.setAttribute('aria-current', 'page');
                if (li) {
                    li.classList.add('current-menu-item', 'current_page_item');
                }
            } else {
                a.classList.remove('elementor-item-active');
                a.removeAttribute('aria-current');
                if (li) {
                    li.classList.remove('current-menu-item', 'current_page_item');
                }
            }
        });
    }

    function handleScrollHeader() {
        var header = document.querySelector('.elementor-location-header');
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('is-scrolled');
            document.body.classList.add('scrolled');
        } else {
            header.classList.remove('is-scrolled');
            document.body.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScrollHeader, { passive: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateActiveNav();
            handleScrollHeader();
        });
    } else {
        updateActiveNav();
        handleScrollHeader();
    }
})();
