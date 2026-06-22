import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for path in ['es/partners/index.html', 'es/turpone-products/index.html']:
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    content = open(full_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    print(f"\n--- Redirect logic in {path} ---")
    scripts = soup.find_all('script')
    for idx, s in enumerate(scripts):
        text = s.get_text()
        if 'window.location' in text or 'location.href' in text or 'location.replace' in text:
            print(f"  Script {idx}:")
            for line in text.split('\n'):
                if 'location' in line:
                    print(f"    {line.strip()}")
