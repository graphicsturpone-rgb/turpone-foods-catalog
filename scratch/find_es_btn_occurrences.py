import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.join(workspace, "es/turpone-products/index.html")

content = open(es_path, 'r', encoding='utf-8').read()
# Find all occurrences of lang-btn-es
start = 0
while True:
    pos = content.find('lang-btn-es', start)
    if pos == -1:
        break
    print(f"Found lang-btn-es at position {pos}:")
    print(content[pos-100:pos+150])
    start = pos + 1
