import os
import re
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
                
                soup = BeautifulSoup(content, 'html.parser')
                updated = False
                
                # Fix a href
                for tag in soup.find_all('a'):
                    href = tag.get('href', '')
                    if href.startswith('https://turponefoods.com/'):
                        tag['href'] = href.replace('https://turponefoods.com', '')
                        if not tag['href'].startswith('/'):
                            tag['href'] = '/' + tag['href']
                        updated = True
                    elif href.startswith('https://turpone-foods.pages.dev/'):
                        tag['href'] = href.replace('https://turpone-foods.pages.dev', '')
                        if not tag['href'].startswith('/'):
                            tag['href'] = '/' + tag['href']
                        updated = True

                # Fix img src
                for tag in soup.find_all('img'):
                    src = tag.get('src', '')
                    if src.startswith('https://turponefoods.com/'):
                        tag['src'] = src.replace('https://turponefoods.com', '')
                        updated = True
                    elif src.startswith('https://turpone-foods.pages.dev/'):
                        tag['src'] = src.replace('https://turpone-foods.pages.dev', '')
                        updated = True
                        
                # Fix form action
                for tag in soup.find_all('form'):
                    action = tag.get('action', '')
                    if action.startswith('https://turponefoods.com/'):
                        tag['action'] = action.replace('https://turponefoods.com', '')
                        updated = True
                
                if updated:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(str(soup))
                    print(f"Updated absolute URLs in: {filepath}")

process_directory('.')
