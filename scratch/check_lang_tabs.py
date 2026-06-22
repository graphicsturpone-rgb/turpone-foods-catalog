import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['es', 'fr']:
    path = f"{lang}/turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- {lang.upper()} Tab Titles & Panels ---")
    titles = soup.find_all(class_="e-n-tab-title")
    for t in titles:
        print(f"  Title: '{t.get_text().strip()}', index: {t.get('data-tab-index')}, active: {'e-active' in t.get('class', [])}")
        
    panels = soup.find_all(attrs={"role": "tabpanel"})
    for p in panels:
        print(f"  Panel ID: {p.get('id')}, index: {p.get('data-tab-index')}, active: {'e-active' in p.get('class', [])}")
