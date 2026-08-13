const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    await page.click('.elementor-gallery-title[data-gallery-index="3"]');
    await new Promise(r => setTimeout(r, 2000));
    
    const itemStyle = await page.$eval('.e-gallery-item:not(.e-gallery-item--hidden)', el => {
        return el.getAttribute('style') || window.getComputedStyle(el).cssText;
    });
    
    console.log(itemStyle);
    await browser.close();
})();
