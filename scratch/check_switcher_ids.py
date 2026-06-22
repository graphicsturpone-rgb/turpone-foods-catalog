import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['', 'es/', 'fr/']:
    path = f"{lang}turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Language switcher elements in {path} ---")
    en = soup.find(id="lang-btn-en")
    es = soup.find(id="lang-btn-es")
    fr = soup.find(id="lang-btn-fr")
    
    print(f"  EN: {en}")
    print(f"  ES: {es}")
    print(f"  FR: {fr}")
