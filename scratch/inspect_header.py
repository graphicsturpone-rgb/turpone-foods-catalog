import os
from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

header = soup.find('header')
if header:
    containers = header.find_all('div', recursive=False)
    for c in containers:
        print('Header container ID:', c.get('data-id'))
        print('Header container class:', c.get('class'))
        print('Text:', c.get_text()[:200].strip().replace('\n', ' '))
