import os
import glob
import re

html_files = glob.glob('/Users/sridhar/Projects/Krutu/kratu-website/**/*.html', recursive=True)

for file in html_files:
    if 'index.html' in file and not 'blog' in file: # index.html is already updated
        continue
        
    with open(file, 'r') as f:
        content = f.read()

    # 1. Add data-preloader-fast="true" to body tag
    content = re.sub(r'<body([^>]*)>', r'<body\1 data-preloader-fast="true">', content)
    # Deduplicate if it was added twice
    content = re.sub(r'data-preloader-fast="true"\s*data-preloader-fast="true"', 'data-preloader-fast="true"', content)

    # 2. Add page-overlay and scroll-progress-bar right after <body>
    if '<div id="page-overlay" aria-hidden="true"></div>' not in content:
        content = re.sub(r'(<body[^>]*>)', r'\1\n  <div id="page-overlay" aria-hidden="true"></div>\n  <div class="scroll-progress-bar" aria-hidden="true"></div>', content)

    # 3. Add footer-wordmark before footer-bottom
    if '<div class="footer-wordmark" aria-hidden="true">KRATU</div>' not in content:
        content = content.replace('<div class="container footer-bottom">', '<div class="footer-wordmark" aria-hidden="true">KRATU</div>\n    <div class="container footer-bottom">')

    # 4. Remove stray <div class="page-overlay"></div>
    content = content.replace('<div class="page-overlay"></div>', '')

    # 5. Fix scripts. Determine prefix relative to root
    rel_depth = file.replace('/Users/sridhar/Projects/Krutu/kratu-website/', '').count('/')
    prefix = '../' * rel_depth if rel_depth > 0 else ''

    # Just ensure preloader.js is before lenis, and nav/page-load/cursor etc are included.
    # Actually, it might be safer to replace the whole script block.
    # Look for </footer\s*>.*</body>
    
    script_block = f"""
  <!-- CDNs load first, then preloader, then GSAP-dependent scripts -->
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js"></script>

  <script src="{prefix}js/preloader.js"></script>
  <script src="{prefix}js/init.js"></script>
  <script src="{prefix}js/graph.js"></script>
  <script src="{prefix}js/nav.js"></script>
  <script src="{prefix}js/page-load.js"></script>
  <script src="{prefix}js/scroll-anim.js"></script>
  <script src="{prefix}js/chat.js"></script>
  <script src="{prefix}js/counters.js"></script>
  <script src="{prefix}js/bento.js"></script>
  <script src="{prefix}js/cursor.js"></script>
</body>"""

    # We use regex to replace everything after </footer> up to </body>
    content = re.sub(r'</footer>\s*.*?</body>', f'</footer>\n{script_block}', content, flags=re.DOTALL)

    # 6. Some pages have missing animation tokens. The preloader might be broken without base.css, but they should all have it.
    
    with open(file, 'w') as f:
        f.write(content)

print("Updated all inner pages!")
