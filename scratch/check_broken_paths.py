import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Checking link/script paths in {path} ---")
    broken = []
    
    # 1. Stylesheets
    for link in soup.find_all('link', rel='stylesheet'):
        href = link.get('href', '')
        if href and not href.startswith('http') and not href.startswith('//'):
            # resolve relative to the file
            resolved = os.path.normpath(os.path.join(os.path.dirname(full_path), href))
            if not os.path.exists(resolved):
                broken.append(('stylesheet', href, resolved))
                
    # 2. Scripts
    for script in soup.find_all('script', src=True):
        src = script.get('src', '')
        if src and not src.startswith('http') and not src.startswith('//'):
            resolved = os.path.normpath(os.path.join(os.path.dirname(full_path), src))
            if not os.path.exists(resolved):
                broken.append(('script', src, resolved))
                
    print(f"Total checked. Broken references found: {len(broken)}")
    for b in broken[:10]:
        print(f"  Type: {b[0]} | Path: {b[1]} | Resolved local path not found: {b[2]}")
