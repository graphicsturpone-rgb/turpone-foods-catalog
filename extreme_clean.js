const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const IGNORE_DIRS = ['node_modules', '.git', 'turpone-cms', 'turpone-astro', 'apps', 'packages', 'legacy'];

// 1. Rename directories safely
const renames = [
  { old: 'assets/plugins/elementor', new: 'assets/vendor/ui-builder' },
  { old: 'assets/plugins/elementor-pro', new: 'assets/vendor/ui-builder-pro' },
  { old: 'assets/plugins/connect-polylang-elementor', new: 'assets/vendor/i18n-connect' },
  { old: 'assets/plugins/polylang', new: 'assets/vendor/i18n' },
  { old: 'assets/plugins/font-awesome', new: 'assets/vendor/font-awesome' },
  { old: 'assets/themes/hello-elementor', new: 'assets/styles/base-theme' },
  { old: 'assets/core', new: 'assets/framework' } // formerly wp-includes
];

for (const rm of renames) {
  const fullOld = path.join(rootDir, rm.old);
  const fullNew = path.join(rootDir, rm.new);
  
  if (fs.existsSync(fullOld)) {
    fs.mkdirSync(path.dirname(fullNew), { recursive: true });
    try {
      fs.renameSync(fullOld, fullNew);
      console.log(`Renamed: ${rm.old} -> ${rm.new}`);
    } catch (e) {
      console.error(`Failed to rename ${rm.old}:`, e.message);
    }
  }
}

// Cleanup empty old dirs
try {
  if (fs.existsSync(path.join(rootDir, 'assets/plugins'))) fs.rmdirSync(path.join(rootDir, 'assets/plugins'));
  if (fs.existsSync(path.join(rootDir, 'assets/themes'))) fs.rmdirSync(path.join(rootDir, 'assets/themes'));
} catch (e) {}

// 2. Scan and replace PATHS in files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        processDirectory(fullPath);
      }
      continue;
    }

    if (!/\.(html|css|js|json)$/.test(file)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    // Replace specific paths
    content = content.replace(/\/assets\/vendor\/ui-builder\//g, '/assets/vendor/ui-builder/');
    content = content.replace(/\/assets\/vendor\/ui-builder-pro\//g, '/assets/vendor/ui-builder-pro/');
    content = content.replace(/\/assets\/plugins\/connect-polylang-elementor\//g, '/assets/vendor/i18n-connect/');
    content = content.replace(/\/assets\/plugins\/polylang\//g, '/assets/vendor/i18n/');
    content = content.replace(/\/assets\/plugins\/font-awesome\//g, '/assets/vendor/font-awesome/');
    content = content.replace(/\/assets\/styles\/base-theme\//g, '/assets/styles/base-theme/');
    content = content.replace(/\/assets\/framework\//g, '/assets/framework/');

    // Handle escaped versions (for JSON / inline JS)
    content = content.replace(/\\\/assets\\\/plugins\\\/elementor\\\//g, '\\/assets\\/vendor\\/ui-builder\\/');
    content = content.replace(/\\\/assets\\\/plugins\\\/elementor-pro\\\//g, '\\/assets\\/vendor\\/ui-builder-pro\\/');
    content = content.replace(/\\\/assets\\\/themes\\\/hello-elementor\\\//g, '\\/assets\\/styles\\/base-theme\\/');
    content = content.replace(/\\\/assets\\\/core\\\//g, '\\/assets\\/framework\\/');

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated paths in: ${fullPath.replace(rootDir, '')}`);
    }
  }
}

console.log('Scanning files and replacing extreme paths...');
processDirectory(rootDir);
console.log('Extreme de-WordPressification complete!');
