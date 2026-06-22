const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://7697c8f8.turpone-foods.pages.dev/turpone-products/', {waitUntil: 'networkidle0'});
    
    console.log("Page loaded");
    
    // Check if scripts are attached
    await page.evaluate(() => {
        console.log("Test log from inside page");
    });
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Click 'Oils' filter
    await page.click('.elementor-gallery-title[data-gallery-index="0"]');
    await new Promise(r => setTimeout(r, 1000));
    
    const visibleItems = await page.$$eval('.elementor-gallery-item:not(.hidden-gallery-item)', els => els.length);
    const hiddenItems = await page.$$eval('.hidden-gallery-item', els => els.length);
    const allItems = await page.$$eval('.elementor-gallery-item', els => els.length);
    
    console.log('Visible items:', visibleItems);
    console.log('Hidden items:', hiddenItems);
    console.log('Total items:', allItems);
    
    // check if Elementor added inline styles
    const firstHiddenStyle = await page.$eval('.elementor-gallery-item', el => el.getAttribute('style'));
    console.log('Style of first item:', firstHiddenStyle);
    
    await browser.close();
})();
