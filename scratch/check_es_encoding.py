import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
es_path = os.path.normpath(os.path.join(workspace, "es/turpone-products/index.html"))

try:
    with open(es_path, 'rb') as f:
        content_bytes = f.read()
    print("Read ES index file bytes successfully.")
    content_bytes.decode('utf-8')
    print("Decoded as utf-8 successfully.")
except UnicodeDecodeError as e:
    print(f"UnicodeDecodeError: {e}")
except Exception as e:
    print(f"Error: {e}")
