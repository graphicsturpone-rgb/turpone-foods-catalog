const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    console.log("Page loaded");
    
    // Click 'Oils' filter
    await page.click('.elementor-gallery-title[data-gallery-index="0"]');
    await new Promise(r => setTimeout(r, 1000));
    
    const hiddenItems = await page.$$eval('.e-gallery-item', els => els.filter(el => getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0' || el.classList.contains('hidden-gallery-item')).length);
    const totalItems = await page.$$eval('.e-gallery-item', els => els.length);
    
    console.log('Hidden items:', hiddenItems, 'Total items:', totalItems);
    
    await browser.close();
})();
