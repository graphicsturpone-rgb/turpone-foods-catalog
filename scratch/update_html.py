import json
from bs4 import BeautifulSoup

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # 1. Update the Clean Custom Grid Filter script
    for s in soup.find_all('script'):
        if s.string and 'Clean Custom Grid Filter Initialized' in s.string:
            old_script = s.string
            # Check if already updated
            if 'data-elementor-lightbox-slideshow' not in old_script:
                new_script = old_script.replace(
                    "item.classList.remove('hidden-item');",
                    "item.classList.remove('hidden-item');\n                    item.setAttribute('data-elementor-lightbox-slideshow', filterValue === 'all' ? '89c4864' : 'filtered-' + filterValue);"
                ).replace(
                    "item.style.transform = 'scale(0.8)';",
                    "item.style.transform = 'scale(0.8)';\n                        item.setAttribute('data-elementor-lightbox-slideshow', 'hidden');"
                )
                s.string = new_script
    
    # 2. Inject the missing CSS if it doesn't exist
    has_css = False
    for s in soup.find_all('style'):
        if s.string and 'Clean CSS Grid to replace Elementor Pro Masonry' in s.string:
            has_css = True
            break
            
    if not has_css:
        new_style = soup.new_tag('style')
        new_style.string = '''
/* Clean CSS Grid to replace Elementor Pro Masonry */
.elementor-gallery__container {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 20px !important;
    height: auto !important;
    padding-bottom: 0 !important;
}
.e-gallery-item {
    display: block !important;
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    padding: 0 !important;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.e-gallery-item.hidden-item {
    display: none !important;
}
@media (max-width: 1024px) {
    .elementor-gallery__container { grid-template-columns: repeat(3, 1fr) !important; }
}
@media (max-width: 768px) {
    .elementor-gallery__container { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 480px) {
    .elementor-gallery__container { grid-template-columns: 1fr !important; }
}
'''
        soup.head.append(new_style)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return 'Updated'

print('EN:', fix_file('turpone-products/index.html'))
print('FR:', fix_file('fr/turpone-products/index.html'))
print('ES:', fix_file('es/turpone-products/index.html'))
