import os

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"
ignore_path = os.path.join(workspace, ".pagesignore")

if os.path.exists(ignore_path):
    print(".pagesignore exists:")
    print(open(ignore_path, 'r').read())
else:
    print(".pagesignore does not exist.")
