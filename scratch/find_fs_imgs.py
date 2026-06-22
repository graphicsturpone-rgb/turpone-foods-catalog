import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
target_names = ["Pinsa-Romana.webp", "PLAIN-FOCACCIA.webp", "Turpone_Pizza_Dough_Balls_2.webp"]

print("Searching for images in workspace...")
for root, dirs, files in os.walk(workspace):
    for f in files:
        if any(name.lower() in f.lower() for name in target_names):
            print(f"Found match: {os.path.join(root, f)}")
