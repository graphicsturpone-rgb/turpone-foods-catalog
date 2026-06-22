import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    style_tags = soup.find_all('style')
    print(f"\n--- Style tag 0 in {path} ---")
    if style_tags:
        print(style_tags[0].get_text()[:400])
    else:
        print("No style tags found!")
