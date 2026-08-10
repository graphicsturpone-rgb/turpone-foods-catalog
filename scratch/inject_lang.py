import os
import re

def update_forms():
    root_dir = r"c:\Users\User\Desktop\Web Design Google\Turpone Foods"
    
    # Regex to find the <form> start tag
    form_regex = re.compile(r'(<form[^>]*action="https://script\.google\.com[^>]*>)')
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
            
        for filename in filenames:
            if filename.endswith('.html'):
                filepath = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(filepath, root_dir).replace('\\', '/')
                
                # Determine language
                lang = "en"
                if rel_path.startswith("fr/"):
                    lang = "fr"
                elif rel_path.startswith("es/"):
                    lang = "es"
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if it has a form
                if form_regex.search(content):
                    # Check if already has a lang hidden input
                    if 'name="lang"' not in content:
                        # Inject the hidden input right after the form opening tag
                        new_content = form_regex.sub(rf'\1<input name="lang" type="hidden" value="{lang}"/>', content)
                        
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {rel_path} with lang={lang}")

if __name__ == "__main__":
    update_forms()
