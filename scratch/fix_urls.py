import os
import re

def fix_wp_urls(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace wp-content/uploads/YYYY/MM/filename.ext with /assets/images/filename.ext
    # The regex looks for wp-content/uploads/\d{4}/\d{2}/([^"'\s\?]+)(?:\?[^"'\s]*)?
    # It might also have a leading slash
    fixed_html = re.sub(r'(?:https?://[^/]+)?/?wp-content/uploads/\d{4}/\d{2}/([^"\'\s\?]+)(?:\?[^"\'\s]*)?', r'/assets/images/\1', html)
    
    if fixed_html != html:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_html)
        print(f'Fixed URLs in {filepath}')
    else:
        print(f'No wp-content URLs found in {filepath}')

fix_wp_urls('fr/turpone-products/index.html')
fix_wp_urls('es/turpone-products/index.html')
