import re

with open('turpone-products/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Change the menu link in the header:
html = html.replace('>Turpone Products<', '>Food Services<')
html = html.replace('>Turpone Products <', '>Food Services <')

# 2. Delete the Retail Tab Button
html = re.sub(r'<button aria-controls="e-n-tab-content-2183931401"[^>]*>.*?Retail\s*</span></button>', '', html)

# 3. Delete the Retail Tab Content
html = re.sub(r'<div aria-labelledby="e-n-tab-title-2183931401".*?(?=<div aria-labelledby="e-n-tab-title-2183931402")', '', html, flags=re.DOTALL)

# 4. Make the Food Service tab active by default
html = html.replace('aria-controls="e-n-tab-content-2183931402" aria-selected="false"', 'aria-controls="e-n-tab-content-2183931402" aria-selected="true"')
html = re.sub(r'(<div aria-labelledby="e-n-tab-title-2183931402"[^>]*class=")([^"]*)', r'\g<1>e-active \g<2>', html)

with open('turpone-products/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
