import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        print(f"{path} does not exist!")
        continue
        
    print(f"\nAuditing {path}...")
    content = open(full_path, 'r', encoding='utf-8').read()
    
    # Check if script is injected
    print(f"  initFallbackGallery in HTML: {'initFallbackGallery' in content}")
    
    # Inspect thumbnails to see if they are different
    soup = BeautifulSoup(content, 'html.parser')
    gallery_items = soup.find_all(class_="elementor-gallery-item__image")
    print(f"  Gallery items: {len(gallery_items)}")
    if gallery_items:
        print(f"  First gallery item thumbnail: {gallery_items[0].get('data-thumbnail')}")
        
    # Check accordion image tags in panel 2
    panel2 = soup.find(id="e-n-tab-content-2183931402")
    if panel2:
        imgs = panel2.find_all('img')
        print(f"  Panel 2 image tags: {len(imgs)}")
        for img in imgs:
            print(f"    src: {img.get('src')}")
    else:
        print("  Panel 2 not found!")
