import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
large_files = []

for root, dirs, files in os.walk(workspace):
    # Skip .git or .wrangler folders
    if '.git' in root or '.wrangler' in root:
        continue
    for f in files:
        filepath = os.path.join(root, f)
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        if size_mb > 24: # slightly less than 25
            large_files.append((os.path.relpath(filepath, workspace), size_mb))

print(f"Found {len(large_files)} files larger than 24MB:")
for path, size in large_files:
    print(f"  {path} ({size:.2f} MB)")
