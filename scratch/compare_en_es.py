import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

en_soup = BeautifulSoup(open(os.path.join(workspace, "turpone-products/index.html"), 'r', encoding='utf-8').read(), 'html.parser')
es_soup = BeautifulSoup(open(os.path.join(workspace, "es/turpone-products/index.html"), 'r', encoding='utf-8').read(), 'html.parser')

en_gallery = en_soup.find(class_="elementor-gallery__container")
es_gallery = es_soup.find(class_="elementor-gallery__container")

print("EN gallery class:", en_gallery.get('class') if en_gallery else 'None')
print("ES gallery class:", es_gallery.get('class') if es_gallery else 'None')

en_items = en_gallery.find_all(class_="elementor-gallery-item") if en_gallery else []
es_items = es_gallery.find_all(class_="elementor-gallery-item") if es_gallery else []

print(f"EN items count: {len(en_items)}, ES items count: {len(es_items)}")

if en_items and es_items:
    print("\nEN item 0:")
    print(en_items[0].prettify()[:500])
    print("\nES item 0:")
    print(es_items[0].prettify()[:500])
