const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const IGNORE_DIRS = ['node_modules', '.git', 'turpone-cms', 'turpone-astro', 'apps', 'packages', 'legacy'];

// 1. Rename directories
const dirMappings = {
  'wp-content/uploads': 'assets/uploads',
  'wp-content/plugins': 'assets/plugins',
  'wp-content/themes': 'assets/themes',
  'wp-includes': 'assets/core',
};

// Create assets dir if not exists
if (!fs.existsSync(path.join(rootDir, 'assets'))) {
  fs.mkdirSync(path.join(rootDir, 'assets'), { recursive: true });
}

// Rename the directories
for (const [oldPath, newPath] of Object.entries(dirMappings)) {
  const fullOld = path.join(rootDir, oldPath);
  const fullNew = path.join(rootDir, newPath);
  
  if (fs.existsSync(fullOld)) {
    // Ensure parent of newPath exists
    fs.mkdirSync(path.dirname(fullNew), { recursive: true });
    
    try {
      fs.renameSync(fullOld, fullNew);
      console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } catch (e) {
      console.error(`Failed to rename ${oldPath}:`, e.message);
    }
  }
}

// Check if wp-content is now empty and remove it
try {
  const wpContent = path.join(rootDir, 'wp-content');
  if (fs.existsSync(wpContent) && fs.readdirSync(wpContent).length === 0) {
    fs.rmdirSync(wpContent);
    console.log('Removed empty wp-content directory.');
  }
} catch (e) {}

// 2. Scan and replace in files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    // Skip ignored directories
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        processDirectory(fullPath);
      }
      continue;
    }

    // Only process html, css, js, json
    if (!/\.(html|css|js|json)$/.test(file)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    // String replacements
    content = content.replace(/\/assets\/uploads\//g, '/assets/uploads/');
    content = content.replace(/\/assets\/plugins\//g, '/assets/plugins/');
    content = content.replace(/\/assets\/themes\//g, '/assets/themes/');
    content = content.replace(/\/assets\/core\//g, '/assets/core/');
    content = content.replace(/\/assets\//g, '/assets/');
    
    // Also handle escaped JSON paths (e.g., \/assets\/uploads\/)
    content = content.replace(/\\\/wp-content\\\/uploads\\\//g, '\\/assets\\/uploads\\/');
    content = content.replace(/\\\/wp-content\\\/plugins\\\//g, '\\/assets\\/plugins\\/');
    content = content.replace(/\\\/wp-content\\\/themes\\\//g, '\\/assets\\/themes\\/');
    content = content.replace(/\\\/wp-includes\\\//g, '\\/assets\\/core\\/');
    content = content.replace(/\\\/wp-content\\\//g, '\\/assets\\/');

    // Relative replacements (just in case)
    content = content.replace(/(\.\.\/)+wp-content\/uploads\//g, '/assets/uploads/');
    content = content.replace(/(\.\.\/)+wp-content\/plugins\//g, '/assets/plugins/');
    
    // 3. Remove WordPress HTML bloat
    if (file.endsWith('.html')) {
      // Remove generator meta tags
      content = content.replace(/<meta name="generator" content="(WordPress|Elementor)[^>]+>\s*/gi, '');
      // Remove w.org link
      content = content.replace(/<link rel="https:\/\/api\.w\.org\/"[^>]+>\s*/gi, '');
      // Remove wp-json links
      content = content.replace(/<link rel="alternate" type="application\/json" href="[^"]*\/wp-json\/[^"]*"[^>]*>\s*/gi, '');
      // Remove xmlrpc/rsd
      content = content.replace(/<link rel="EditURI" type="application\/rsd\+xml"[^>]+>\s*/gi, '');
      content = content.replace(/<link rel="wlwmanifest" type="application\/wlwmanifest\+xml"[^>]+>\s*/gi, '');
      // Remove shortlink
      content = content.replace(/<link rel="shortlink" href="[^"]*"[^>]*>\s*/gi, '');
    }

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated paths in: ${fullPath.replace(rootDir, '')}`);
    }
  }
}

console.log('Scanning files and replacing WordPress paths...');
processDirectory(rootDir);
console.log('Complete! All WordPress traces stripped and redirected to /assets/');
