import os

hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
if os.path.exists(hosts_path):
    print("Hosts file content:")
    for line in open(hosts_path, 'r'):
        if 'turpone-foods' in line or '127.0.0.1' in line or 'localhost' in line:
            print(line.strip())
else:
    print("Hosts file not found!")
