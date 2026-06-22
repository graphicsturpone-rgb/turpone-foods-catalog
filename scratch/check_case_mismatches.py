import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
images_dir = os.path.join(workspace, "assets/images")
actual_files = set(os.listdir(images_dir))

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Case-Sensitivity Check for {lang.upper()} ---")
    items = soup.find_all(class_="elementor-gallery-item__image")
    mismatches = 0
    for item in items:
        thumb = item.get('data-thumbnail')
        if thumb:
            filename = os.path.basename(thumb)
            if filename not in actual_files:
                # Check case-insensitive match
                matches = [f for f in actual_files if f.lower() == filename.lower()]
                if matches:
                    print(f"  Case mismatch: HTML has '{filename}', actual file is '{matches[0]}'")
                    mismatches += 1
                else:
                    print(f"  Not found at all: '{filename}'")
                    mismatches += 1
    print(f"Total mismatches: {mismatches}")
