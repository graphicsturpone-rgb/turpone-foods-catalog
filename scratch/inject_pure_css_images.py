import os
import re
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

def inject_pure_css_fallback(page_rel_path):
    html_path = os.path.normpath(os.path.join(workspace, page_rel_path))
    if not os.path.exists(html_path):
        print(f"File not found: {html_path}")
        return
        
    print(f"\nProcessing {page_rel_path}...")
    content = open(html_path, 'r', encoding='utf-8').read()
    
    # Extract all data-thumbnail attributes from the file
    soup = BeautifulSoup(content, 'html.parser')
    thumbnails = set()
    for el in soup.find_all(attrs={"data-thumbnail": True}):
        thumbnails.add(el['data-thumbnail'])
    for el in soup.find_all(attrs={"data-src": True}):
        thumbnails.add(el['data-src'])
        
    print(f"Found {len(thumbnails)} unique thumbnails to generate CSS for.")
    
    # Generate CSS rules
    css_rules = []
    for thumb in sorted(list(thumbnails)):
        # Ensure path starts with / if it is a wp-content upload
        adjusted = thumb
        if (thumb.startswith('wp-content') or thumb.startswith('assets')) and not thumb.startswith('/'):
            # In subdirectories, we might want absolute path from domain root
            adjusted = '/' + thumb
            
        css_rules.append(f'[data-thumbnail="{thumb}"], [data-src="{thumb}"] {{ background-image: url("{adjusted}") !important; }}')
        
    css_block = "<style>\n"
    css_block += "/* Pure CSS fallback for images mapping data-thumbnail to background-image */\n"
    css_block += "\n".join(css_rules)
    css_block += "\n</style>"
    
    # Remove any previous CSS block or script blocks injected by us to keep it clean
    content = re.sub(r'<style>\s*/\* Fallback Grid layout for Elementor Gallery when JS fails to run \*/[\s\S]*?</script>', '', content)
    content = re.sub(r'<style>\s*/\* Fallback 4-Column Grid layout for Elementor Gallery when JS fails to run \*/[\s\S]*?</script>', '', content)
    content = re.sub(r'<style>\s*/\* Pure CSS fallback for images mapping data-thumbnail to background-image \*/[\s\S]*?</style>', '', content)
    
    # Inject before </body>
    if '</body>' in content:
        content = content.replace('</body>', css_block + '\n</body>')
        
    open(html_path, 'w', encoding='utf-8').write(content)
    print(f"Successfully injected CSS mapping block into {page_rel_path}")

for page in ['turpone-products/index.html', 'es/turpone-products/index.html', 'fr/turpone-products/index.html']:
    inject_pure_css_fallback(page)
