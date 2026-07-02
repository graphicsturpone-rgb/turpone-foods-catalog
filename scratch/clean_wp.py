import os
import re
from bs4 import BeautifulSoup

def clean_wp_artifacts(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove generator meta tags
    for meta in soup.find_all('meta', {'name': 'generator'}):
        if 'WordPress' in meta.get('content', '') or 'Elementor' in meta.get('content', ''):
            meta.decompose()
            
    # Remove WP API and xmlrpc links
    for link in soup.find_all('link'):
        href = link.get('href', '')
        rel = link.get('rel', [])
        if not isinstance(rel, list):
            rel = [rel]
            
        if 'https://api.w.org/' in rel or 'EditURI' in rel or 'wlwmanifest' in rel:
            link.decompose()
        elif 'wp-json' in href or 'xmlrpc.php' in href or 'wlwmanifest.xml' in href:
            link.decompose()
            
    # Remove shortlink
    for link in soup.find_all('link', {'rel': 'shortlink'}):
        link.decompose()
        
    return str(soup)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'scratch' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                cleaned_content = clean_wp_artifacts(content)
                
                if cleaned_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(cleaned_content)
                    print(f"Cleaned WP artifacts in: {filepath}")

process_directory('.')
