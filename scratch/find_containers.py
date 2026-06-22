import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

soup = BeautifulSoup(open(html_path, 'r', encoding='utf-8').read(), 'html.parser')

containers = soup.find_all(class_="elementor-gallery__container")
print(f"Found {len(containers)} gallery containers.")
for idx, c in enumerate(containers):
    # Print parents to see what tab or section they belong to
    parent = c.parent
    while parent and not parent.get('id') and not 'e-active' in parent.get('class', []):
        parent = parent.parent
    print(f"Container {idx}: parent class={parent.get('class') if parent else 'None'} id={parent.get('id') if parent else 'None'}")
    
    # check item count inside
    items = c.find_all(class_="elementor-gallery-item")
    print(f"  Item count: {len(items)}")
