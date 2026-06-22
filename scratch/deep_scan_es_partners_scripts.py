import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
path = os.path.join(workspace, "es/partners/index.html")

content = open(path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

print("--- All Script Tags in es/partners/index.html ---")
for idx, s in enumerate(soup.find_all('script')):
    text = s.get_text()
    if len(text.strip()) > 0:
        # Check if it has redirect keywords
        if any(kw in text for kw in ['location', 'replace', 'href', 'preferred-lang', 'navigator.language']):
            print(f"Script {idx} (Length: {len(text)}):")
            print(text[:500])
            print("...")
