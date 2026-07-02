import os
from bs4 import BeautifulSoup

css = '''
<style id="custom-responsive-titles">
/* Mobile responsiveness for Turpone Products page titles */
@media (max-width: 768px) {
    .elementor-image-box-title {
        font-size: 32px !important;
        line-height: 1.2 !important;
        padding: 0 10px !important;
        white-space: normal !important;
        word-wrap: break-word !important;
    }
}
@media (max-width: 480px) {
    .elementor-image-box-title {
        font-size: 24px !important;
        line-height: 1.3 !important;
        padding: 0 5px !important;
    }
}
</style>
'''

files = ['turpone-products/index.html', 'fr/turpone-products/index.html', 'es/turpone-products/index.html']

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'custom-responsive-titles' not in html:
        soup = BeautifulSoup(html, 'html.parser')
        new_style = BeautifulSoup(css, 'html.parser')
        if soup.head:
            soup.head.append(new_style)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            print(f'Updated {filepath}')
        else:
            print(f'No head in {filepath}')
    else:
        print(f'Already updated {filepath}')
