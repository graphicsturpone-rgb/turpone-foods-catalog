import os
import shutil
import subprocess

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
backup_dir = r"C:\Users\User\.gemini\antigravity\brain\c38e6b29-eb00-4d61-a2ee-e70d611557de\large_videos"

large_files = [
    "wp-content/uploads/2025/12/FOL-BANNER.mp4",
    "wp-content/uploads/2025/12/Timeline-1.mov",
    "wp-content/uploads/2026/01/ENG-LAST-FEATURES-VID.mp4",
    "wp-content/uploads/2026/01/FR-LAST-FEATURES-VID.mp4"
]

# 1. Move files out
moved_files = []
os.makedirs(backup_dir, exist_ok=True)
print("Moving large files out of workspace...")
for rel_path in large_files:
    src_path = os.path.join(workspace, rel_path.replace('/', os.sep))
    if os.path.exists(src_path):
        dest_path = os.path.join(backup_dir, os.path.basename(src_path))
        print(f"  Moving: {rel_path} -> {dest_path}")
        shutil.move(src_path, dest_path)
        moved_files.append((src_path, dest_path))

# 2. Deploy to Cloudflare Pages
try:
    print("\nRunning wrangler deploy...")
    env = os.environ.copy()
    env["CLOUDFLARE_ACCOUNT_ID"] = "7b97368b9c914ebb22e0414f2cf822cb"
    # Execute wrangler pages deploy synchronously
    result = subprocess.run(
        'npx wrangler pages deploy "./" --project-name="turpone-foods"',
        shell=True,
        cwd=workspace,
        env=env,
        capture_output=True,
        text=True
    )
    print("Wrangler stdout:")
    print(result.stdout)
    print("Wrangler stderr:")
    print(result.stderr)
    print(f"Wrangler exit code: {result.returncode}")
finally:
    # 3. Move files back
    print("\nRestoring large files back to workspace...")
    for src_path, dest_path in moved_files:
        if os.path.exists(dest_path):
            print(f"  Restoring: {dest_path} -> {src_path}")
            os.makedirs(os.path.dirname(src_path), exist_ok=True)
            shutil.move(dest_path, src_path)
            
    # Clean up backup dir if empty
    try:
        os.rmdir(backup_dir)
    except:
        pass
        
    print("Done.")
