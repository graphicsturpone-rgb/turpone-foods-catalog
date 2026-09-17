 = Get-Content -Path 'turpone-products\index.html' -Raw

# 1. Change the menu link in the header:
 =  -replace '>Turpone Products<', '>Food Services<'
 =  -replace '>Turpone Products <', '>Food Services <'

# 2. Delete the Retail Tab Button
# The button for Retail looks like: <button aria-controls="e-n-tab-content-2183931401"...>Retail...</button>
 =  -replace '<button aria-controls="e-n-tab-content-2183931401"[^>]*>.*?Retail\s*<\/span><\/button>', ''

# 3. Delete the Retail Tab Content
# The content for Retail starts with: <div aria-labelledby="e-n-tab-title-2183931401" ... id="e-n-tab-content-2183931401"
# It ends right before: <div aria-labelledby="e-n-tab-title-2183931402" ... id="e-n-tab-content-2183931402"
# Using regex to remove everything from the start of tab 1 content up to (but not including) tab 2 content
 =  -replace '(?s)<div aria-labelledby="e-n-tab-title-2183931401".*?(?=<div aria-labelledby="e-n-tab-title-2183931402")', ''

# 4. Make the Food Service tab active by default
# Change its aria-selected to "true"
 =  -replace 'aria-controls="e-n-tab-content-2183931402"\s*aria-selected="false"', 'aria-controls="e-n-tab-content-2183931402" aria-selected="true"'
# Add "e-active" class to its content div
 =  -replace '(<div aria-labelledby="e-n-tab-title-2183931402"[^>]*class=")([^"]*)', '-active '

Set-Content -Path 'turpone-products\index.html' -Value 
