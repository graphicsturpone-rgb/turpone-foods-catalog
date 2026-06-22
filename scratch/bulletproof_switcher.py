import os
import re

workspace = r"C:\Users\User\Desktop\Web Design Google\Turpone Foods"

bulletproof_script = """<script>
document.addEventListener("DOMContentLoaded", function() {
    var enBtn = document.getElementById("lang-btn-en");
    var esBtn = document.getElementById("lang-btn-es");
    var frBtn = document.getElementById("lang-btn-fr");
    var currentPath = window.location.pathname;
    
    // Determine current lang from path
    var isFr = currentPath.indexOf("/fr/") !== -1 || currentPath === "/fr";
    var isEs = currentPath.indexOf("/es/") !== -1 || currentPath === "/es";
    
    // Set active states
    if (isFr) {
        if (frBtn) frBtn.classList.add("active");
        if (enBtn) enBtn.classList.remove("active");
        if (esBtn) esBtn.classList.remove("active");
    } else if (isEs) {
        if (esBtn) esBtn.classList.add("active");
        if (enBtn) enBtn.classList.remove("active");
        if (frBtn) frBtn.classList.remove("active");
    } else {
        if (enBtn) enBtn.classList.add("active");
        if (frBtn) frBtn.classList.remove("active");
        if (esBtn) esBtn.classList.remove("active");
    }
    
    // Direct robust routing for products page
    if (enBtn) {
        enBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.setItem("preferred-lang", "en");
            window.location.href = "/turpone-products/";
        });
    }
    
    if (esBtn) {
        esBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.setItem("preferred-lang", "es");
            window.location.href = "/es/turpone-products/";
        });
    }
    
    if (frBtn) {
        frBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.setItem("preferred-lang", "fr");
            window.location.href = "/fr/turpone-products/";
        });
    }
});
</script>"""

for path in ['turpone-products/index.html', 'es/turpone-products/index.html', 'fr/turpone-products/index.html']:
    full_path = os.path.join(workspace, path)
    if os.path.exists(full_path):
        content = open(full_path, 'r', encoding='utf-8').read()
        
        # We replace the script block containing the lang switcher logic
        # Find start of lang switcher script and replace it
        pattern = r'<script>\s*document\.addEventListener\("DOMContentLoaded",\s*function\(\)\s*\{\s*var\s*enBtn\s*=\s*document\.getElementById\("lang-btn-en"\);[\s\S]*?</script>'
        new_content = re.sub(pattern, bulletproof_script, content)
        
        open(full_path, 'w', encoding='utf-8').write(new_content)
        print(f"Updated language switcher to bulletproof routing in {path}")
