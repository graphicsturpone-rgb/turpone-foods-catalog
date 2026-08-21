const fs = require('fs');
const pages = ['index.html', 'about-us/index.html', 'turpone-products/index.html', 'recipes/index.html', 'services/index.html', 'partners/index.html'];

pages.forEach(page => {
    if (fs.existsSync(page)) {
        const content = fs.readFileSync(page, 'utf8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        
        console.log('--- ' + page + ' ---');
        console.log('Title: ', titleMatch ? titleMatch[1] : 'N/A');
        console.log('Desc:  ', descMatch ? descMatch[1] : 'N/A');
        console.log('H1:    ', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A');
    }
});
