import os
import re
from bs4 import BeautifulSoup

google_script_url = "https://script.google.com/macros/s/AKfycbzfrEwSm50EfAAz6kLfQkBFe3tlPPVqtG6kGbweeEZZEdCcwkxqXTF8nv49ZepukUOi/exec"
iframe_html = '''
<script>var submitted=false;</script>
<iframe name="hidden_iframe" id="hidden_iframe" style="display:none;" onload="if(submitted){alert('Your message was sent successfully!'); submitted=false;}"></iframe>
'''

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
                form_updated = False
                
                for form in soup.find_all('form', class_='elementor-form'):
                    if form.get('action') != google_script_url:
                        form['action'] = google_script_url
                        form['method'] = "POST"
                        form['target'] = "hidden_iframe"
                        form['onsubmit'] = "submitted=true;"
                        
                        # insert iframe and script just before the form
                        iframe_soup = BeautifulSoup(iframe_html, 'html.parser')
                        form.insert_before(iframe_soup)
                        
                        form_updated = True
                
                if form_updated:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(str(soup))
                    print(f"Connected Google Apps Script form in: {filepath}")

process_directory('.')
