document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwo9p5XNE-eONQBB8xgQnlryF6MOz_QIFp3eyH9IKgSd6cT7muCSpEQuJMCjQKw8jf_/exec';

    // Check if user already subscribed or dismissed
    if (localStorage.getItem('turpone_newsletter_dismissed')) return;

    // Detect Language
    const path = window.location.pathname;
    let lang = 'en';
    if (path.startsWith('/es/')) lang = 'es';
    else if (path.startsWith('/fr/')) lang = 'fr';

    // Translations
    const t = {
        en: {
            title: "Join Our Newsletter",
            subtitle: "Subscribe to get the latest updates, exclusive offers, and news from Turpone Foods.",
            name: "Full Name",
            phone: "Phone Number",
            email: "Email Address",
            btn: "Subscribe Now",
            success: "Thank you for subscribing!",
            error: "An error occurred. Please try again.",
            ctaTitle: "Subscribe to our newsletter!",
            ctaSubtitle: "Don't miss out on the latest updates and exclusive offers.",
            ctaBtn: "Subscribe Now"
        },
        es: {
            title: "Únete a nuestro boletín",
            subtitle: "Suscríbete para recibir las últimas actualizaciones, ofertas exclusivas y noticias de Turpone Foods.",
            name: "Nombre completo",
            phone: "Número de teléfono",
            email: "Correo electrónico",
            btn: "Suscribirse ahora",
            success: "¡Gracias por suscribirse!",
            error: "Se produjo un error. Inténtalo de nuevo.",
            ctaTitle: "¡Suscríbete a nuestro boletín!",
            ctaSubtitle: "No te pierdas las últimas actualizaciones y ofertas exclusivas.",
            ctaBtn: "Suscríbete ahora"
        },
        fr: {
            title: "Rejoignez notre newsletter",
            subtitle: "Inscrivez-vous pour recevoir les dernières mises à jour, des offres exclusives et des nouvelles de Turpone Foods.",
            name: "Nom complet",
            phone: "Numéro de téléphone",
            email: "Adresse e-mail",
            btn: "S'abonner maintenant",
            success: "Merci de vous être abonné !",
            error: "Une erreur s'est produite. Veuillez réessayer.",
            ctaTitle: "Abonnez-vous à notre newsletter !",
            ctaSubtitle: "Ne manquez pas les dernières mises à jour et les offres exclusives.",
            ctaBtn: "S'abonner maintenant"
        }
    };

    const text = t[lang];

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Popup Styles */
        .nl-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 2000000; opacity: 0; transition: opacity 0.4s ease; padding: 20px; box-sizing: border-box; backdrop-filter: blur(5px); }
        .nl-overlay.show { display: flex; opacity: 1; }
        .nl-modal { background: #1a1a1a; color: #fff; width: 100%; max-width: 450px; border-radius: 12px; padding: 40px 30px; font-family: 'Poppins', sans-serif; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.4s ease; border: 1px solid #333; }
        .nl-overlay.show .nl-modal { transform: translateY(0); }
        .nl-close { position: absolute; top: 15px; right: 20px; font-size: 28px; color: #888; cursor: pointer; transition: color 0.2s; line-height: 1; }
        .nl-close:hover { color: #fff; }
        .nl-title { margin: 0 0 10px 0; font-size: 24px; font-weight: 600; text-align: center; color: #dca35a; }
        .nl-subtitle { margin: 0 0 25px 0; font-size: 14px; text-align: center; color: #aaa; line-height: 1.5; }
        .nl-form { display: flex; flex-direction: column; gap: 15px; }
        .nl-input { width: 100%; padding: 12px 15px; border: 1px solid #444; border-radius: 6px; background: #222; color: #fff; font-family: inherit; font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .nl-input:focus { border-color: #dca35a; }
        .nl-btn { width: 100%; padding: 14px; background: #dca35a; color: #000; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; margin-top: 10px; }
        .nl-btn:hover { background: #c58f4a; }
        .nl-btn:disabled { background: #555; cursor: not-allowed; color: #888; }
        .nl-msg { text-align: center; font-size: 14px; margin-top: 15px; display: none; }
        .nl-msg.success { color: #4caf50; display: block; }
        .nl-msg.error { color: #f44336; display: block; }

        /* CTA Banner Styles */
        .cta-inline-banner {
            background-color: #1a1a1a;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
            padding: 40px 20px;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            box-sizing: border-box;
        }
        .cta-inline-container {
            max-width: 1140px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            text-align: center;
        }
        @media (min-width: 768px) {
            .cta-inline-container {
                flex-direction: row;
                justify-content: space-between;
                text-align: left;
                padding: 0 20px;
            }
        }
        .cta-inline-text h3 {
            color: #ffffff;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: 600;
        }
        .cta-inline-text p {
            color: #aaa;
            margin: 0;
            font-size: 16px;
        }
        .cta-inline-action .nl-btn {
            width: auto;
            padding: 15px 40px;
            font-size: 18px;
            margin: 0;
        }
    `;
    document.head.appendChild(style);

    // Build DOM
    const overlay = document.createElement('div');
    overlay.className = 'nl-overlay';
    overlay.innerHTML = `
        <div class="nl-modal">
            <span class="nl-close" id="nl-close">&times;</span>
            <h2 class="nl-title">${text.title}</h2>
            <p class="nl-subtitle">${text.subtitle}</p>
            <form class="nl-form" id="nl-form">
                <input type="text" name="Name" class="nl-input" placeholder="${text.name}" required>
                <input type="tel" name="Phone" class="nl-input" placeholder="${text.phone}">
                <input type="email" name="Email" class="nl-input" placeholder="${text.email}" required>
                <button type="submit" class="nl-btn" id="nl-submit">${text.btn}</button>
            </form>
            <div id="nl-msg" class="nl-msg"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Logic
    const closePopup = () => {
        overlay.classList.remove('show');
    };

    const openPopup = () => {
        overlay.classList.add('show');
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'newsletter_popup_open', {
                'event_category': 'engagement'
            });
        }
    };

    document.getElementById('nl-close').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closePopup();
    });

    // Build CTA Inline Banner
    const ctaBanner = document.createElement('div');
    ctaBanner.className = 'cta-inline-banner';
    ctaBanner.innerHTML = `
        <div class="cta-inline-container">
            <div class="cta-inline-text">
                <h3>${text.ctaTitle}</h3>
                <p>${text.ctaSubtitle}</p>
            </div>
            <div class="cta-inline-action">
                <button class="nl-btn" id="cta-inline-btn">${text.ctaBtn}</button>
            </div>
        </div>
    `;

    // Inject CTA Banner above the footer
    const footer = document.querySelector('footer') || document.querySelector('.elementor-location-footer');
    if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(ctaBanner, footer);
    } else {
        document.body.appendChild(ctaBanner); // Fallback
    }

    // Trigger popup on CTA click
    document.getElementById('cta-inline-btn').addEventListener('click', openPopup);

    // Handle Form Submission
    const form = document.getElementById('nl-form');
    const msgDiv = document.getElementById('nl-msg');
    const submitBtn = document.getElementById('nl-submit');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            msgDiv.textContent = 'Setup Required: Please add the Google Apps Script URL to assets/js/newsletter-popup.js';
            msgDiv.className = 'nl-msg error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        const formData = new FormData(form);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'generate_lead', {
                    'event_category': 'engagement',
                    'event_label': 'Newsletter Subscription'
                });
            }
            msgDiv.textContent = text.success;
            msgDiv.className = 'nl-msg success';
            form.reset();
            setTimeout(closePopup, 3000);
        })
        .catch(error => {
            msgDiv.textContent = text.error;
            msgDiv.className = 'nl-msg error';
            submitBtn.disabled = false;
            submitBtn.textContent = text.btn;
        });
    });
});
