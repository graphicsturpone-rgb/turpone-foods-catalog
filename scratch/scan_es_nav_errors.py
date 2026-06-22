import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_dir = os.path.join(workspace, "es")

# Walk through es_dir and check the hrefs of all links with text 'Socios' or 'Productos Turpone'
for root, dirs, files in os.walk(es_dir):
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            soup = BeautifulSoup(open(filepath, 'r', encoding='utf-8').read(), 'html.parser')
            for a in soup.find_all('a'):
                text = a.get_text().strip()
                href = a.get('href', '')
                if text in ['Socios', 'Productos Turpone'] or 'partner' in href or 'product' in href:
                    # Ignore the flags/lang switchers or external
                    if 'lang-btn' not in a.get('id', '') and not href.startswith('http'):
                        if not href.startswith('/es/'):
                            print(f"ERROR: File {os.path.relpath(filepath, workspace)} | Text: '{text}' | Href is: '{href}' (Points to English!)")
