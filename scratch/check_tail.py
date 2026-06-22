import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
html_path = os.path.join(workspace, "turpone-products/index.html")

content = open(html_path, 'r', encoding='utf-8').read()
print("Length of file:", len(content))
# Find last 1500 characters
print("Tail of file:")
print(content[-1500:])
