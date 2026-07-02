import os
from bs4 import BeautifulSoup

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'scratch' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                if 'formspree' in content:
                    soup = BeautifulSoup(content, 'html.parser')
                    form_updated = False
                    
                    for form in soup.find_all('form', class_='elementor-form'):
                        if form.get('action') == "https://formspree.io/f/REPLACE_WITH_YOUR_ID":
                            del form['action']
                            del form['method']
                            form_updated = True
                    
                    if form_updated:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(str(soup))
                        print(f"Reverted forms in: {filepath}")

process_directory('.')
