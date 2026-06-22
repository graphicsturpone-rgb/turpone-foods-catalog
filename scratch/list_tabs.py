import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

soup = BeautifulSoup(open(html_path, 'r', encoding='utf-8').read(), 'html.parser')

tab_titles = soup.find_all(class_="e-n-tab-title")
print(f"Found {len(tab_titles)} tab titles:")
for t in tab_titles:
    print(f"  Title text: '{t.get_text().strip()}', index: {t.get('data-tab-index')}, active: {'e-active' in t.get('class', [])}")

panels = soup.find_all(attrs={"role": "tabpanel"})
print(f"Found {len(panels)} tab panels:")
for p in panels:
    print(f"  Panel ID: {p.get('id')}, index: {p.get('data-tab-index')}, active: {'e-active' in p.get('class', [])}")
    # Print some child elements inside the panel to understand what it contains
    content_summary = [c.get('class') for c in p.find_all(class_=True)[:10]]
    print(f"    Content summary classes: {content_summary}")
