import os

# 1. Update custom-interactions.js
js_path = 'assets/js/custom-interactions.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Find the start of the popup section
start_marker = "// Promotional Image Popup (Homepage Only)"
end_marker = "// Advanced Smooth Scroll Animations Engine"

if start_marker in js_content and end_marker in js_content:
    start_idx = js_content.find(start_marker)
    end_idx = js_content.find(end_marker)
    
    # Remove the popup and banner block
    js_content = js_content[:start_idx] + js_content[end_idx:]
    
    # Also clean up the comment below
    js_content = js_content.replace('and the global banner we just injected', '')
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Cleaned up custom-interactions.js")
else:
    print("Could not find markers in custom-interactions.js")

# 2. Remove newsletter-popup.js from HTML files
html_files = ['index.html', 'fr/index.html', 'es/index.html']
for filepath in html_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        if '<script src="/assets/js/newsletter-popup.js"></script>' in html:
            html = html.replace('    <script src="/assets/js/newsletter-popup.js"></script>', '')
            html = html.replace('<script src="/assets/js/newsletter-popup.js"></script>', '')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Removed popup script from {filepath}")
        else:
            print(f"No popup script found in {filepath}")
