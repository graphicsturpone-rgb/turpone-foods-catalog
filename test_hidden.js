const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    await page.click('.elementor-gallery-title[data-gallery-index="3"]');
    await new Promise(r => setTimeout(r, 2000));
    
    const hiddenItemStyles = await page.$$eval('.e-gallery-item', els => {
        return els.filter(el => el.classList.contains('e-gallery-item--hidden'))
                  .map(el => {
                      const style = window.getComputedStyle(el);
                      const parentStyle = window.getComputedStyle(el.parentElement);
                      return { display: style.display, parentDisplay: parentStyle.display, classList: [...el.classList].join(' ') };
                  })[0];
    });
    
    console.log(hiddenItemStyles);
    
    await browser.close();
})();
