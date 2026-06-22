import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

def inspect_nav_links(lang_prefix):
    path = f"{lang_prefix}turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        print(f"{path} does not exist!")
        return
        
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- Navigation Menu Links in {path} ---")
    # Menu container is usually under class sub-menu, menu-item, elements-nav or similar
    nav = soup.find('nav')
    if nav:
        links = nav.find_all('a')
        for a in links:
            print(f"  Link Text: '{a.get_text().strip()}', href: '{a.get('href')}'")
    else:
        # fallback: find all menu-item class links
        menu_items = soup.find_all(class_=lambda x: x and ('menu-item' in x or 'nav-link' in x or 'sub-menu' in x))
        links = []
        for item in menu_items:
            links.extend(item.find_all('a'))
        # Deduplicate and print
        seen = set()
        for a in links:
            href = a.get('href')
            text = a.get_text().strip()
            if (text, href) not in seen:
                seen.add((text, href))
                print(f"  Link Text: '{text}', href: '{href}'")

print("Auditing EN:")
inspect_nav_links("")
print("Auditing ES:")
inspect_nav_links("es/")
