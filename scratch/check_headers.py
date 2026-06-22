import urllib.request

try:
    resp = urllib.request.urlopen('http://turpone-foods.local/')
    print("Headers for http://turpone-foods.local/:")
    for k, v in resp.getheaders():
        print(f"  {k}: {v}")
except Exception as e:
    print(f"Error fetching: {e}")
