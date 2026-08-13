const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/turpone-products/', {waitUntil: 'networkidle0'});
    
    // Check if any requests failed
    const failedRequests = [];
    page.on('requestfailed', request => {
        failedRequests.push(request.url());
    });
    
    await page.reload({waitUntil: 'networkidle0'});
    
    console.log('Failed requests:', failedRequests.length);
    if(failedRequests.length > 0) {
        console.log(failedRequests.slice(0,5));
    }
    
    await browser.close();
})();
