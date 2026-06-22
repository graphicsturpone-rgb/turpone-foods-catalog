import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['', 'es/', 'fr/']:
    path = f"{lang}turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Language switchers in {path} ---")
    # Search for links that look like language switcher
    links = soup.find_all('a')
    for a in links:
        href = a.get('href', '')
        text = a.get_text().strip()
        # look for typical lang switcher keywords or flags
        if 'lang-btn' in str(a.get('id')) or 'es/' in href or 'fr/' in href or 'english' in text.lower() or 'spanish' in text.lower() or 'french' in text.lower() or text in ['EN', 'ES', 'FR']:
            print(f"  Link Text: '{text}', href: '{href}', id: '{a.get('id')}'")
