const fs = require('fs');
let local = fs.readFileSync('turpone_local.html', 'utf8');
let static = fs.readFileSync('turpone-products/index.html', 'utf8');

const startMarker = 'data-id="89c4864"';
let localStart = local.indexOf(startMarker);
let staticStart = static.indexOf(startMarker);

// go backwards to the start of the <div class="elementor-element
localStart = local.lastIndexOf('<div class="elementor-element', localStart);
staticStart = static.lastIndexOf('<div class="elementor-element', staticStart);

// find the end of this widget. 
// A good marker is the next widget: '<div class="elementor-element elementor-element-05e83ec' or similar.
// In the static HTML, let's see what's after the gallery.
const endMarkerLocal = local.indexOf('<!--', localStart);
const endMarkerStatic = static.indexOf('<!--', staticStart); // This is likely the end of the elementor widget structure

// To be safe, just regex match the <a class="e-gallery-item" ...> from local and replace them in static!
// There are 32 items.
const localItems = local.match(/<a class="e-gallery-item[^>]+>([\s\S]*?)<\/a>/g);
const staticItems = static.match(/<a class="e-gallery-item[^>]+>([\s\S]*?)<\/a>/g);

if(localItems.length === staticItems.length) {
    for(let i=0; i<localItems.length; i++) {
        // Fix URLs in local item
        let fixedItem = localItems[i];
        fixedItem = fixedItem.replace(/http:\/\/turpone-foods\.local\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\/\"']+)/g, '/assets/images/$1');
        
        static = static.replace(staticItems[i], fixedItem);
    }
    fs.writeFileSync('turpone-products/index.html', static);
    console.log('Successfully patched all 32 gallery items from local HTML!');
} else {
    console.log('Mismatch:', localItems.length, staticItems.length);
}
