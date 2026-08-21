const fs = require('fs');

const file = 'assets/js/newsletter-popup.js';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Add open tracking
    content = content.replace(
        "    const openPopup = () => {\n        overlay.classList.add('show');\n    };",
        "    const openPopup = () => {\n        overlay.classList.add('show');\n        if (typeof window.gtag === 'function') {\n            window.gtag('event', 'newsletter_popup_open', {\n                'event_category': 'engagement'\n            });\n        }\n    };"
    );

    // Add submit tracking
    content = content.replace(
        "        .then(response => {\n            msgDiv.textContent = text.success;",
        "        .then(response => {\n            if (typeof window.gtag === 'function') {\n                window.gtag('event', 'generate_lead', {\n                    'event_category': 'engagement',\n                    'event_label': 'Newsletter Subscription'\n                });\n            }\n            msgDiv.textContent = text.success;"
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Added GA4 event tracking to newsletter-popup.js');
}
