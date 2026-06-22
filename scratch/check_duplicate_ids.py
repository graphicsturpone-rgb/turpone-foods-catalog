import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

for lang in ['', 'es/', 'fr/']:
    path = f"{lang}turpone-products/index.html"
    full_path = os.path.join(workspace, path)
    if not os.path.exists(full_path):
        continue
    soup = BeautifulSoup(open(full_path, 'r', encoding='utf-8').read(), 'html.parser')
    
    print(f"\n--- ID counts in {path} ---")
    for btn_id in ['lang-btn-en', 'lang-btn-es', 'lang-btn-fr']:
        elements = soup.find_all(id=btn_id)
        print(f"  ID '{btn_id}' count: {len(elements)}")
        for idx, el in enumerate(elements):
            # Print parent structure of each to see where they are
            parent = el.parent
            parent_classes = parent.get('class', []) if parent else []
            grandparent = parent.parent if parent else None
            gp_classes = grandparent.get('class', []) if grandparent else []
            print(f"    Match {idx}: parent classes={parent_classes}, grandparent classes={gp_classes}")
