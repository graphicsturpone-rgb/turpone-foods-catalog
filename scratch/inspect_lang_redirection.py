import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    content = open(full_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    print(f"\n--- Checking scripts in {path} ---")
    scripts = soup.find_all('script')
    for idx, s in enumerate(scripts):
        text = s.get_text()
        if 'lang-btn' in text or 'preferred-lang' in text:
            print(f"  Script {idx} contains lang logic.")
            # Print redirect logic specifically
            if 'window.location.href' in text:
                print("    Redirect logic found:")
                for line in text.split('\n'):
                    if 'window.location.href' in line or 'clean =' in line or 'esBtn' in line or 'enBtn' in line:
                        print(f"      {line.strip()}")
