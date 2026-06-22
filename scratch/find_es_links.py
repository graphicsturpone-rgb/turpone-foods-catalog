import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.normpath(os.path.join(workspace, "es/turpone-products/index.html"))

content = open(es_path, 'r', encoding='utf-8').read()
soup = BeautifulSoup(content, 'html.parser')

# Find links that match these texts
targets = ['Inicio', 'Nosotros', 'Servicios', 'Socios', 'Productos Turpone', 'Contacto']
for link in soup.find_all('a'):
    text = link.get_text().strip()
    if text in targets:
        print(f"Match: text='{text}', href='{link.get('href')}', outerHTML:")
        print(str(link)[:150])
