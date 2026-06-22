import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

content = open(html_path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

style_tags = soup.find_all('style')
for idx, s in enumerate(style_tags):
    text = s.get_text()
    if 'lang' in text.lower() or 'btn' in text.lower():
        print(f"Style tag {idx} contains 'lang' or 'btn':")
        print(text[:500])
