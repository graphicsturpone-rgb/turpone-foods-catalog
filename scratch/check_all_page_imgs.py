import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for page in ['turpone-products/index.html', 'es/turpone-products/index.html', 'fr/turpone-products/index.html']:
    html_path = os.path.join(workspace, page)
    if not os.path.exists(html_path):
        print(f"{page} does not exist!")
        continue
    soup = BeautifulSoup(open(html_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Images in {page} ---")
    
    # Check all img tags
    imgs = soup.find_all('img')
    print(f"Total img tags: {len(imgs)}")
    for img in imgs:
        src = img.get('src')
        if src and ('assets' in src or 'wp-content' in src):
            # Resolve relative to the html file location
            html_dir = os.path.dirname(html_path)
            resolved_local = os.path.normpath(os.path.join(html_dir, src))
            exists = os.path.exists(resolved_local)
            print(f"  src: {src} -> exists: {exists} ({resolved_local})")

    # Check gallery item data-thumbnails
    gallery_imgs = soup.find_all(class_="elementor-gallery-item__image")
    print(f"Total gallery image tags: {len(gallery_imgs)}")
    for img in gallery_imgs:
        thumb = img.get('data-thumbnail')
        if thumb:
            html_dir = os.path.dirname(html_path)
            # data-thumbnail is usually absolute like "/wp-content/uploads..."
            if thumb.startswith('/'):
                resolved_local = os.path.normpath(os.path.join(workspace, thumb[1:]))
            else:
                resolved_local = os.path.normpath(os.path.join(html_dir, thumb))
            exists = os.path.exists(resolved_local)
            if not exists:
                print(f"  gallery data-thumbnail: {thumb} -> exists: {exists} ({resolved_local})")
