import re

def update_template(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all existing og:title, og:description, twitter:title, twitter:description, name="description"
    content = re.sub(r'<meta[^>]*name="description"[^>]*>', '', content)
    content = re.sub(r'<meta[^>]*property="og:title"[^>]*>', '', content)
    content = re.sub(r'<meta[^>]*property="og:description"[^>]*>', '', content)
    content = re.sub(r'<meta[^>]*name="twitter:title"[^>]*>', '', content)
    content = re.sub(r'<meta[^>]*name="twitter:description"[^>]*>', '', content)

    # Replace <title>
    if "index-template.html" in filepath:
        content = re.sub(r'<title>.*?</title>', '<title>{{title}} | Turpone Foods</title>\n<meta name="description" content="{{seo_description}}">\n<meta property="og:title" content="{{title}} | Turpone Foods">\n<meta property="og:description" content="{{seo_description}}">\n<link rel="canonical" href="{{canonical_url}}">', content)
    else:
        content = re.sub(r'<title>.*?</title>', '<title>{{seo_title}} | Turpone Foods</title>\n<meta name="description" content="{{seo_description}}">\n<meta property="og:title" content="{{seo_title}} | Turpone Foods">\n<meta property="og:description" content="{{seo_description}}">\n<link rel="canonical" href="{{canonical_url}}">', content)

    # Remove any empty lines left by re.sub
    content = re.sub(r'\n\s*\n', '\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

update_template('recipes/template.html')
update_template('recipes/index-template.html')
