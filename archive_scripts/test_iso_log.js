const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    await page.evaluate(() => {
        window.iso.arrange({
            filter: function(itemElem) {
                var tagsStr = itemElem.getAttribute('data-e-gallery-tags') || '';
                var tags = tagsStr.split(',');
                console.log("Checking item with tags:", tagsStr, "Includes 3?", tags.includes("3"));
                return tags.includes("3");
            }
        });
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
