import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.normpath(os.path.join(workspace, "es/turpone-products/index.html"))

content = open(es_path, 'r', encoding='utf-8').read()
start = content.find('initFallbackGallery')
if start != -1:
    print("Found script in ES page:")
    print(content[start-300:start+1200])
else:
    print("Script not found in ES page!")
