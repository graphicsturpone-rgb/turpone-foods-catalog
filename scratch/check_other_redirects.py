import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

pages = ['es/about-us/index.html', 'es/services/index.html', 'es/partners/index.html']
for p in pages:
    full_path = os.path.join(workspace, p)
    if not os.path.exists(full_path):
        print(f"File not found: {p}")
        continue
    content = open(full_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    print(f"\n--- Checking scripts in {p} ---")
    scripts = soup.find_all('script')
    for idx, s in enumerate(scripts):
        text = s.get_text()
        if 'location' in text or 'lang' in text or 'preferred-lang' in text:
            print(f"  Script {idx}:")
            print(text[:400])
