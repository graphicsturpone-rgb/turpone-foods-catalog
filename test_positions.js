const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    console.log("Clicking Pizza Sauce (index 3)");
    await page.click('.elementor-gallery-title[data-gallery-index="3"]');
    await new Promise(r => setTimeout(r, 2000));
    
    const visibleItemPositions = await page.$$eval('.e-gallery-item', els => {
        return els.filter(el => window.getComputedStyle(el).display !== 'none' && !el.classList.contains('e-gallery-item--hidden'))
                  .map(el => ({ top: el.style.top, left: el.style.left }));
    });
    
    console.log('Positions of visible items:');
    console.log(visibleItemPositions);
    
    await browser.close();
})();
