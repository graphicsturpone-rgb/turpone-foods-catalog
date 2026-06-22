import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_dir = os.path.join(workspace, "es")

# Walk through all directories inside /es/ and find all index.html files
html_files = []
for root, dirs, files in os.walk(es_dir):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))
            
# Also add the root es/index.html if not already caught (it will be caught by walking es_dir)
print(f"Found {len(html_files)} HTML files in /es/ directory to process:")
for h in html_files:
    print(f"  {os.path.relpath(h, workspace)}")

for html_path in html_files:
    content = open(html_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    updated_count = 0
    # Find all links and update their hrefs to point to /es/ versions
    for link in soup.find_all('a'):
        href = link.get('href', '')
        if href.startswith('/') and not href.startswith('/es/') and href != '/es':
            if href == '/':
                new_href = '/es/'
            else:
                new_href = '/es' + href
            link['href'] = new_href
            updated_count += 1
            
    if updated_count > 0:
        open(html_path, 'w', encoding='utf-8').write(str(soup))
        print(f"  -> Updated {updated_count} links in {os.path.relpath(html_path, workspace)}")
    else:
        print(f"  -> No links needed updating in {os.path.relpath(html_path, workspace)}")
