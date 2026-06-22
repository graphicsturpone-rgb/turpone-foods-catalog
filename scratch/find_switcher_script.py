import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

content = open(html_path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

# Find all script tags containing lang-btn
scripts = soup.find_all('script')
print(f"Found {len(scripts)} script tags.")
for idx, s in enumerate(scripts):
    text = s.get_text()
    if 'lang-btn' in text:
        print(f"Script {idx}:")
        print(text[:1000])
