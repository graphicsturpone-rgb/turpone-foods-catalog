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
                
                if 'hidden_iframe' in content and 'alert(' in content:
                    # Quick string replace for the specific iframe onload we injected
                    old_onload = "if(submitted){alert('Your message was sent successfully!'); submitted=false;}"
                    new_onload = "if(submitted){window.location.href='/thank-you/';}"
                    
                    if old_onload in content:
                        content = content.replace(old_onload, new_onload)
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated iframe onload in: {filepath}")

process_directory('.')
