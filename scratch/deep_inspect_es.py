import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.normpath(os.path.join(workspace, "es/turpone-products/index.html"))

soup = BeautifulSoup(open(es_path, 'r', encoding='utf-8').read(), 'html.parser')

# Find all gallery items and print their data-thumbnail and class attributes
items = soup.find_all(class_="elementor-gallery-item")
print(f"Found {len(items)} gallery items in ES page.")
for i in items[:3]:
    img_div = i.find(class_="elementor-gallery-item__image")
    print(f"Item class: {i.get('class')}")
    print(f"  Img div class: {img_div.get('class') if img_div else 'None'}")
    print(f"  Img div data-thumbnail: {img_div.get('data-thumbnail') if img_div else 'None'}")
    
# Check style tags injected
style_tags = soup.find_all('style')
print(f"Found {len(style_tags)} style tags.")
for s in style_tags:
    if 'elementor-gallery__container' in s.get_text():
        print("Found Elementor Gallery override style block:")
        print(s.get_text()[:400])
