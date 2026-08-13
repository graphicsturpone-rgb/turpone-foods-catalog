const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    console.log("Initial load complete.");
    
    // Check visible items
    let visibleItems = await page.$$eval('.e-gallery-item', els => els.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && !el.classList.contains('elementor-gallery-item--hidden') && !el.classList.contains('e-gallery-item--hidden');
    }).length);
    console.log('Visible items initially:', visibleItems);
    
    // Click Pizza Sauce
    console.log("Clicking Pizza Sauce (index 3)");
    await page.click('.elementor-gallery-title[data-gallery-index="3"]');
    await new Promise(r => setTimeout(r, 2000));
    
    visibleItems = await page.$$eval('.e-gallery-item', els => els.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && !el.classList.contains('elementor-gallery-item--hidden') && !el.classList.contains('e-gallery-item--hidden');
    }).length);
    console.log('Visible items after click:', visibleItems);
    
    await browser.close();
})();
