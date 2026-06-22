import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
path = os.path.join(workspace, "es/partners/index.html")

content = open(path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

scripts = soup.find_all('script')
for idx, s in enumerate(scripts):
    text = s.get_text()
    if 'lang-btn-en' in text:
        print(f"--- Script {idx} in es/partners/index.html ---")
        print(text)
