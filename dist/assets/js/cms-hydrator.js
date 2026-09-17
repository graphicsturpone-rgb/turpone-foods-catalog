/**
 * Turpone Foods - High-Performance CMS Hydrator Engine
 * Synchronously or asynchronously hydrates static HTML pages with cms-data.json
 */
(function () {
  const DATA_URL = '/wp-content/cms-data.json';

  // Detect current page key and locale
  function detectContext() {
    const path = window.location.pathname;
    const isFr = path.includes('/fr/');
    const locale = isFr ? 'fr' : 'en';

    let page = 'home';
    if (path.includes('/about-us/')) page = 'about';
    else if (path.includes('/services/')) page = 'services';
    else if (path.includes('/partners/')) page = 'partners';
    else if (path.includes('/turpone-products/')) page = 'products';
    else if (path.includes('/contact/')) page = 'contact';
    else if (path.includes('/privacy-policy/')) page = 'privacy';
    else if (path.includes('/terms-of-service/')) page = 'terms';

    return { page, locale };
  }

  // Hydrate DOM elements based on CMS data
  function hydrate(cmsData) {
    const { page, locale } = detectContext();
    const pageData = cmsData[page];
    if (!pageData || !pageData.sections) return;

    // Index sections by ID
    const sectionsMap = {};
    pageData.sections.forEach(sec => {
      sectionsMap[sec.id] = sec;
    });

    // 1. Process Section Visibility, Ordering, and Layout
    document.querySelectorAll('[data-cms-section]').forEach(el => {
      const secId = el.getAttribute('data-cms-section');
      const sec = sectionsMap[secId];
      if (sec) {
        // Toggle visibility
        if (sec.visible === false) {
          el.style.setProperty('display', 'none', 'important');
          return;
        } else {
          // If hidden before, restore layout
          if (el.style.display === 'none') {
            el.style.display = '';
          }
        }

        // Set flexbox/grid order on section container
        el.style.order = sec.order;

        // Apply layouts
        if (sec.layout) {
          if (sec.layout.align) {
            const alignTarget = el.querySelector('[data-cms-layout="align"]') || el;
            alignTarget.style.textAlign = sec.layout.align;
            if (sec.layout.align === 'center') {
              alignTarget.style.justifyContent = 'center';
              alignTarget.style.margin = '0 auto';
            } else if (sec.layout.align === 'right') {
              alignTarget.style.justifyContent = 'flex-end';
            } else {
              alignTarget.style.justifyContent = 'flex-start';
            }
          }
        }
      }
    });

    // Process layouts safely without breaking parent structures

    // 2. Hydrate Text Fields
    document.querySelectorAll('[data-cms-id]').forEach(el => {
      const path = el.getAttribute('data-cms-id');
      const parts = path.split('.');
      if (parts.length < 2) return;

      const secId = parts[0];
      const fieldKey = parts[1];
      const sec = sectionsMap[secId];
      if (!sec || !sec.fields) return;

      // Resolve localized or general field value
      let value = sec.fields[`${fieldKey}_${locale}`];
      if (value === undefined) {
        value = sec.fields[fieldKey];
      }

      if (value !== undefined) {
        // Hydrate appropriate property
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.placeholder) {
            el.placeholder = value;
          } else {
            el.value = value;
          }
        } else if (el.tagName === 'A' && fieldKey.includes('link')) {
          el.href = value;
        } else {
          el.innerHTML = value;
        }
      }
    });

    // 3. Hydrate Image Fields
    document.querySelectorAll('[data-cms-img]').forEach(el => {
      const path = el.getAttribute('data-cms-img');
      const parts = path.split('.');
      if (parts.length < 2) return;

      const secId = parts[0];
      const imgKey = parts[1];
      const sec = sectionsMap[secId];
      if (!sec || !sec.images || !sec.images[imgKey]) return;

      const img = sec.images[imgKey];
      if (el.tagName === 'IMG') {
        el.src = img.url;
        if (img.alt) el.alt = img.alt;
      } else {
        el.style.backgroundImage = `url('${img.url}')`;
      }
    });
  }

  // Load configuration and hydrate
  function init() {
    fetch(DATA_URL)
      .then(res => {
        if (!res.ok) throw new Error('CMS data load failed');
        return res.json();
      })
      .then(data => {
        hydrate(data);
        // Dispatch completion event for real-time editor sync
        window.dispatchEvent(new CustomEvent('cmsHydrated', { detail: data }));
      })
      .catch(err => {
        console.warn('CMS Hydration engine running in offline/static fallback:', err);
      });
  }

  // Execute synchronously or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API globally for live-syncing iframe in Admin panel
  window.TurponeCMS = {
    hydrate,
    detectContext
  };
})();
