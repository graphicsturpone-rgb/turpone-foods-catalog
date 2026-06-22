import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['', 'es/', 'fr/']:
    path = f"{lang}turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Checking {path} ---")
    titles = soup.find_all(class_="e-n-tab-title")
    for t in titles:
        print(f"  Title: '{t.get_text().strip()}', index: {t.get('data-tab-index')}, aria-selected: {t.get('aria-selected')}")
