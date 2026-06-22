import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

content = open(html_path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

style_tags = soup.find_all('style')
if style_tags:
    print("Style tag 0 content:")
    print(style_tags[0].get_text())
