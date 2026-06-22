import os
import hashlib

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

en_path = os.path.join(workspace, "turpone-products/index.html")
es_path = os.path.join(workspace, "es/turpone-products/index.html")
fr_path = os.path.join(workspace, "fr/turpone-products/index.html")

def extract_fallback_script(filepath):
    content = open(filepath, 'r', encoding='utf-8').read()
    start = content.find('/* Fallback 4-Column Grid layout for Elementor Gallery when JS fails to run */')
    if start != -1:
        end = content.find('</script>', start)
        return content[start:end]
    return ""

en_script = extract_fallback_script(en_path)
es_script = extract_fallback_script(es_path)
fr_script = extract_fallback_script(fr_path)

print("EN script length:", len(en_script))
print("ES script length:", len(es_script))
print("FR script length:", len(fr_script))

en_hash = hashlib.md5(en_script.encode('utf-8')).hexdigest()
es_hash = hashlib.md5(es_script.encode('utf-8')).hexdigest()
fr_hash = hashlib.md5(fr_script.encode('utf-8')).hexdigest()

print("EN hash:", en_hash)
print("ES hash:", es_hash)
print("FR hash:", fr_hash)
