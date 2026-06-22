import os
import re

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

def clean_pure_css_fallback(page_rel_path):
    html_path = os.path.normpath(os.path.join(workspace, page_rel_path))
    if not os.path.exists(html_path):
        print(f"File not found: {html_path}")
        return
        
    print(f"Cleaning {page_rel_path}...")
    content = open(html_path, 'r', encoding='utf-8').read()
    
    # Remove the pure CSS block
    content = re.sub(r'<style>\s*/\* Pure CSS fallback for images mapping data-thumbnail to background-image \*/[\s\S]*?</style>', '', content)
    
    open(html_path, 'w', encoding='utf-8').write(content)
    print(f"Cleaned pure CSS fallback from {page_rel_path}")

for page in ['turpone-products/index.html', 'es/turpone-products/index.html', 'fr/turpone-products/index.html']:
    clean_pure_css_fallback(page)
