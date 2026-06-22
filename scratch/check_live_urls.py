import urllib.request

urls = [
    'http://turpone-foods.local/es/partners/',
    'http://turpone-foods.local/es/turpone-products/',
    'http://turpone-foods.local/es/about-us/'
]

for u in urls:
    try:
        resp = urllib.request.urlopen(u)
        print(f"{u} -> Success: {resp.geturl()} (code: {resp.getcode()})")
    except Exception as e:
        print(f"{u} -> Error: {e}")
