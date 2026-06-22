import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for path in ['es/partners/index.html', 'es/turpone-products/index.html', 'es/about-us/index.html']:
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    content = open(full_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    print(f"\n--- Checking Head Scripts in {path} ---")
    head = soup.find('head')
    if head:
        scripts = head.find_all('script')
        for idx, s in enumerate(scripts):
            text = s.get_text()
            if 'location' in text or 'lang' in text or 'href' in text:
                print(f"  Head Script {idx}:")
                print(text[:300])
    else:
        print("  No head section found!")
