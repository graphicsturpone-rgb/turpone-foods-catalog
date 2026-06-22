import os
from bs4 import BeautifulSoup

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

soup = BeautifulSoup(open(html_path, 'r', encoding='utf-8').read(), 'html.parser')

panel2 = soup.find(id="e-n-tab-content-2183931402")
if panel2:
    imgs = panel2.find_all('img')
    print(f"Found {len(imgs)} img tags in panel 2:")
    for i in imgs:
        src = i.get('src')
        local = os.path.join(workspace, src[1:] if src.startswith('/') else src)
        print(f"  src: {src}, local path exists: {os.path.exists(local)}")
        
    # check background images or others
    divs = panel2.find_all(class_=True)
    for d in divs:
        style = d.get('style')
        if style and 'background' in style:
            print(f"  div with style background: {style}")
else:
    print("Panel 2 not found!")
