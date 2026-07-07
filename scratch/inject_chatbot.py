import os
from bs4 import BeautifulSoup

# Define files
files_to_update = []
for root, dirs, files in os.walk('.'):
    if 'index.html' in files:
        files_to_update.append(os.path.join(root, 'index.html'))

css_tag = '<link rel="stylesheet" href="/assets/css/chatbot.css">'
js_tag = '<script src="/assets/js/chatbot.js" defer=""></script>'

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '/assets/js/chatbot.js' in content:
        continue

    soup = BeautifulSoup(content, 'html.parser')
    body = soup.find('body')
    if body:
        # Append before closing body
        css_soup = BeautifulSoup(css_tag, 'html.parser')
        js_soup = BeautifulSoup(js_tag, 'html.parser')
        body.append(css_soup)
        body.append(js_soup)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Injected chatbot into {filepath}")
