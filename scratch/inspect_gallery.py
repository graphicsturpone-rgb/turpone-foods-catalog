import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

soup = BeautifulSoup(open(html_path, 'r', encoding='utf-8').read(), 'html.parser')

items = soup.find_all(class_="elementor-gallery-item")
print(f"Found {len(items)} gallery items.")

if items:
    # Print the first one
    print("First item structure:")
    print(items[0].prettify()[:1000])
    
    # Check if the images exist locally
    missing = []
    found = []
    for item in items:
        img_div = item.find(class_="elementor-gallery-item__image")
        if img_div:
            thumb = img_div.get('data-thumbnail')
            if thumb:
                # normalize path
                clean = thumb
                if clean.startswith('/'):
                    clean = clean[1:]
                local = os.path.join(workspace, clean)
                if not os.path.exists(local):
                    missing.append((thumb, local))
                else:
                    found.append(thumb)
        else:
            # Maybe inside an <a> tag?
            a_tag = item.find('a')
            if a_tag:
                thumb = a_tag.get('data-thumbnail') or a_tag.get('href')
                if thumb:
                    clean = thumb
                    if clean.startswith('/'):
                        clean = clean[1:]
                    local = os.path.join(workspace, clean)
                    if not os.path.exists(local):
                        missing.append((thumb, local))
                    else:
                        found.append(thumb)

    print(f"Verified images. Found: {len(found)}, Missing: {len(missing)}")
    if missing:
        print("Missing examples:")
        for m in missing[:5]:
            print(m)
