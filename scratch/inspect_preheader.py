import os
from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.body
if body:
    children = body.find_all(recursive=False)
    for c in children:
        if c.name == 'header':
            break
        print('Tag:', c.name)
        print('Class:', c.get('class'))
        print('ID:', c.get('id'))
        print('Text:', c.get_text()[:200].strip().replace('\n', ' '))
