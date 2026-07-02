from bs4 import BeautifulSoup

with open('contact/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

for form in soup.find_all('form'):
    for input_tag in form.find_all(['input', 'textarea', 'select']):
        print(f"Tag: {input_tag.name}, Name: {input_tag.get('name')}, Type: {input_tag.get('type')}")
