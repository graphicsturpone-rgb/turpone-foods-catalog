const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    await page.click('.elementor-gallery-title[data-gallery-index="3"]');
    await new Promise(r => setTimeout(r, 2000));
    
    const visibleItemRects = await page.$$eval('.e-gallery-item', els => {
        return els.filter(el => {
            const style = window.getComputedStyle(el);
            return style.opacity !== '0' && style.display !== 'none';
        }).map(el => {
            const rect = el.getBoundingClientRect();
            return { top: Math.round(rect.top), left: Math.round(rect.left), height: Math.round(rect.height) };
        });
    });
    
    console.log('Rects of visible items:');
    console.log(visibleItemRects);
    
    await browser.close();
})();
