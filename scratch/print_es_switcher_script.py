import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.join(workspace, "es/turpone-products/index.html")

content = open(es_path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

scripts = soup.find_all('script')
for idx, s in enumerate(scripts):
    text = s.get_text()
    if 'lang-btn-en' in text:
        print(f"--- Script {idx} in ES page ---")
        print(text)
