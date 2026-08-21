document.addEventListener('DOMContentLoaded', () => {
    // Check if consent is already given
    if (localStorage.getItem('turpone_cookie_consent')) return;

    // Detect Language
    const path = window.location.pathname;
    let lang = 'en';
    if (path.startsWith('/es/')) lang = 'es';
    else if (path.startsWith('/fr/')) lang = 'fr';

    // Translations
    const t = {
        en: {
            bannerText: "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.",
            acceptAll: "Accept All",
            rejectAll: "Reject All",
            customize: "Customize",
            modalTitle: "Cookie Preferences",
            savePreferences: "Save Preferences",
            necessary: "Strictly Necessary Cookies",
            necessaryDesc: "These cookies are required for the website to function and cannot be switched off.",
            analytics: "Performance & Analytics",
            analyticsDesc: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
            marketing: "Marketing & Advertising",
            marketingDesc: "These cookies may be set through our site by our advertising partners to build a profile of your interests."
        },
        es: {
            bannerText: "Utilizamos cookies para mejorar su experiencia de navegación, mostrar anuncios o contenido personalizados y analizar nuestro tráfico. Al hacer clic en 'Aceptar todo', usted acepta nuestro uso de cookies.",
            acceptAll: "Aceptar todo",
            rejectAll: "Rechazar todo",
            customize: "Personalizar",
            modalTitle: "Preferencias de cookies",
            savePreferences: "Guardar preferencias",
            necessary: "Cookies estrictamente necesarias",
            necessaryDesc: "Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar.",
            analytics: "Rendimiento y análisis",
            analyticsDesc: "Estas cookies nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio.",
            marketing: "Marketing y publicidad",
            marketingDesc: "Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios para crear un perfil de sus intereses."
        },
        fr: {
            bannerText: "Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des publicités ou des contenus personnalisés et analyser notre trafic. En cliquant sur 'Tout accepter', vous consentez à notre utilisation des cookies.",
            acceptAll: "Tout accepter",
            rejectAll: "Tout refuser",
            customize: "Personnaliser",
            modalTitle: "Préférences de cookies",
            savePreferences: "Enregistrer les préférences",
            necessary: "Cookies strictement nécessaires",
            necessaryDesc: "Ces cookies sont nécessaires au fonctionnement du site Web et ne peuvent pas être désactivés.",
            analytics: "Performances et analyses",
            analyticsDesc: "Ces cookies nous permettent de compter les visites et les sources de trafic afin de mesurer et d'améliorer les performances de notre site.",
            marketing: "Marketing et publicité",
            marketingDesc: "Ces cookies peuvent être mis en place via notre site par nos partenaires publicitaires pour établir un profil de vos intérêts."
        }
    };

    const text = t[lang];

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .cookie-banner { position: fixed; bottom: 0; left: 0; width: 100%; background: #1a1a1a; color: #fff; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999999; font-family: 'Poppins', sans-serif; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); transform: translateY(100%); transition: transform 0.5s ease; }
        .cookie-banner.show { transform: translateY(0); }
        .cookie-banner p { font-size: 14px; margin-bottom: 15px; text-align: center; max-width: 800px; line-height: 1.5; color: #ccc; }
        .cookie-buttons { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .cookie-btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s; }
        .cookie-btn-primary { background: #dca35a; color: #000; }
        .cookie-btn-primary:hover { background: #c58f4a; }
        .cookie-btn-secondary { background: #333; color: #fff; }
        .cookie-btn-secondary:hover { background: #444; }
        .cookie-btn-text { background: none; color: #aaa; text-decoration: underline; }
        .cookie-btn-text:hover { color: #fff; }
        
        .cookie-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; z-index: 1000000; opacity: 0; transition: opacity 0.3s; }
        .cookie-modal-overlay.show { display: flex; opacity: 1; }
        .cookie-modal { background: #fff; color: #333; width: 90%; max-width: 500px; border-radius: 8px; padding: 30px; font-family: 'Poppins', sans-serif; max-height: 90vh; overflow-y: auto; }
        .cookie-modal h2 { margin-top: 0; font-size: 20px; margin-bottom: 20px; }
        .cookie-option { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
        .cookie-option:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .cookie-option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .cookie-option h3 { margin: 0; font-size: 16px; color: #000; }
        .cookie-option p { margin: 0; font-size: 13px; color: #666; }
        
        .cookie-toggle { position: relative; width: 40px; height: 20px; background: #ccc; border-radius: 20px; cursor: pointer; transition: background 0.3s; }
        .cookie-toggle.active { background: #dca35a; }
        .cookie-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.3s; }
        .cookie-toggle.active::after { transform: translateX(20px); }
        .cookie-toggle.disabled { cursor: not-allowed; background: #dca35a; opacity: 0.6; }
        .cookie-toggle.disabled::after { transform: translateX(20px); }
        
        @media (min-width: 768px) {
            .cookie-banner { flex-direction: row; justify-content: space-between; padding: 20px 40px; }
            .cookie-banner p { margin-bottom: 0; text-align: left; margin-right: 20px; }
        }
    `;
    document.head.appendChild(style);

    // Build DOM
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <p>${text.bannerText}</p>
        <div class="cookie-buttons">
            <button class="cookie-btn cookie-btn-text" id="btn-cookie-customize">${text.customize}</button>
            <button class="cookie-btn cookie-btn-secondary" id="btn-cookie-reject">${text.rejectAll}</button>
            <button class="cookie-btn cookie-btn-primary" id="btn-cookie-accept">${text.acceptAll}</button>
        </div>
    `;

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'cookie-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="cookie-modal">
            <h2>${text.modalTitle}</h2>
            <div class="cookie-option">
                <div class="cookie-option-header">
                    <h3>${text.necessary}</h3>
                    <div class="cookie-toggle disabled"></div>
                </div>
                <p>${text.necessaryDesc}</p>
            </div>
            <div class="cookie-option">
                <div class="cookie-option-header">
                    <h3>${text.analytics}</h3>
                    <div class="cookie-toggle" id="toggle-analytics"></div>
                </div>
                <p>${text.analyticsDesc}</p>
            </div>
            <div class="cookie-option">
                <div class="cookie-option-header">
                    <h3>${text.marketing}</h3>
                    <div class="cookie-toggle" id="toggle-marketing"></div>
                </div>
                <p>${text.marketingDesc}</p>
            </div>
            <button class="cookie-btn cookie-btn-primary" id="btn-cookie-save" style="width:100%; margin-top:20px;">${text.savePreferences}</button>
        </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modalOverlay);

    // Logic
    setTimeout(() => banner.classList.add('show'), 500);

    const saveConsent = (analytics, marketing) => {
        localStorage.setItem('turpone_cookie_consent', JSON.stringify({
            necessary: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        }));
        banner.classList.remove('show');
        modalOverlay.classList.remove('show');
    };

    document.getElementById('btn-cookie-accept').addEventListener('click', () => saveConsent(true, true));
    document.getElementById('btn-cookie-reject').addEventListener('click', () => saveConsent(false, false));
    
    document.getElementById('btn-cookie-customize').addEventListener('click', () => {
        modalOverlay.classList.add('show');
    });

    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) modalOverlay.classList.remove('show');
    });

    const toggleAnalytics = document.getElementById('toggle-analytics');
    const toggleMarketing = document.getElementById('toggle-marketing');

    toggleAnalytics.addEventListener('click', () => toggleAnalytics.classList.toggle('active'));
    toggleMarketing.addEventListener('click', () => toggleMarketing.classList.toggle('active'));

    document.getElementById('btn-cookie-save').addEventListener('click', () => {
        saveConsent(toggleAnalytics.classList.contains('active'), toggleMarketing.classList.contains('active'));
    });
});
