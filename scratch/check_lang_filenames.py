import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
images_dir = os.path.join(workspace, "assets/images")

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Checking files for {lang.upper()} ---")
    items = soup.find_all(class_="elementor-gallery-item__image")
    missing_files = []
    for item in items:
        thumb = item.get('data-thumbnail')
        if thumb:
            filename = os.path.basename(thumb)
            local_img = os.path.normpath(os.path.join(images_dir, filename))
            if not os.path.exists(local_img):
                missing_files.append((thumb, filename))
                
    print(f"Total items: {len(items)}, Missing locally: {len(missing_files)}")
    if missing_files:
        print("Missing examples:")
        for m in missing_files[:5]:
            print(f"  Attribute thumbnail: {m[0]} (Looking for file: {m[1]})")
