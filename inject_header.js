const fs = require('fs');

// 1. Read index.html to extract the header
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Find the header tag
const headerStart = indexHtml.indexOf('<header class="elementor');
const headerEnd = indexHtml.indexOf('</header>') + 9;
const headerContent = indexHtml.substring(headerStart, headerEnd);

// Ensure image src paths in the extracted header are absolute so they work from any folder depth!
// Wait, the header logo uses `<img ... src="assets/images/TF-LOgo.svg">`
// Let's replace any `src="assets/` or `src="../assets/` with `src="/assets/` to make it root-relative.
let processedHeader = headerContent.replace(/src="\/?(\.\.\/)*assets\//g, 'src="/assets/');
// And links should be absolute: href="/" instead of href="../", etc. (they probably already are)

// 2. Create the JS block header script
const scriptContent = `document.write(\`${processedHeader.replace(/`/g, '\\`')}\`);`;
fs.writeFileSync('assets/js/header-injector.js', scriptContent, 'utf8');

// 3. Replace the header in all HTML files with the script tag
const files = [];
function findHtmlFiles(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const path = dir + '/' + file;
        const stat = fs.statSync(path);
        if (stat.isDirectory() && !path.includes('.git') && !path.includes('apps') && !path.includes('node_modules') && !path.includes('dist')) {
            findHtmlFiles(path);
        } else if (path.endsWith('.html')) {
            files.push(path);
        }
    }
}
findHtmlFiles('.');

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const start = html.indexOf('<header class="elementor');
    if (start !== -1) {
        const end = html.indexOf('</header>') + 9;
        const scriptTag = `<script src="/assets/js/header-injector.js"></script>`;
        html = html.substring(0, start) + scriptTag + html.substring(end);
        fs.writeFileSync(file, html, 'utf8');
    }
}
