import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

pages = [
    'es/partners/index.html',
    'es/turpone-products/index.html',
    'es/about-us/index.html'
]

for p in pages:
    full_path = os.path.join(workspace, p)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Menu Links in {p} ---")
    # Find links that go to partners or products
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = a.get_text().strip()
        if 'partner' in href or 'product' in href or 'socio' in text.lower() or 'producto' in text.lower():
            print(f"  Text: '{text}', href: '{href}'")
