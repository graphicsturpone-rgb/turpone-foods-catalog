import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.normpath(os.path.join(workspace, "es/turpone-products/index.html"))

if os.path.exists(es_path):
    print("Reading ES products page...")
    content = open(es_path, 'r', encoding='utf-8').read()
    soup = BeautifulSoup(content, 'html.parser')
    
    # Let's find navigation menu links and other page links to prepend /es
    # Only target links that go to EN pages: href starts with / and doesn't start with /es
    updated_count = 0
    for link in soup.find_all('a'):
        href = link.get('href', '')
        if href.startswith('/') and not href.startswith('/es/') and href != '/es':
            # Ignore absolute external/resource links or anchors
            if href == '/':
                new_href = '/es/'
            else:
                new_href = '/es' + href
            link['href'] = new_href
            updated_count += 1
            
    if updated_count > 0:
        # Write back the updated HTML
        open(es_path, 'w', encoding='utf-8').write(str(soup))
        print(f"Updated {updated_count} links inside {es_path} to use Spanish prefix '/es/'.")
    else:
        print("No links needed updating.")
