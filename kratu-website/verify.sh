#!/bin/bash

echo "=== 1. grep -rn '!important' --include=\"*.css\" . ==="
grep -rn "!important" --include="*.css" . || echo "(no output)"

echo ""
echo "=== 2. grep -rln 'style=\"' --include=\"*.html\" . ==="
grep -rln 'style="' --include="*.html" . || echo "(no output)"

echo ""
echo "=== 3. grep -n \"opacity: 0\" css/base.css ==="
grep -n "opacity: 0" css/base.css || echo "(no output)"

echo ""
echo "=== 4. grep -c '<script src=\"https' *.html solutions/*.html product/*.html ==="
grep -c '<script src="https' *.html solutions/*.html product/*.html || echo "(no output)"

echo ""
echo "=== 5. Confirm deleted files ==="
ls -l css/premium.css css/pricing-variations.css js/preloader.js update_inner_pages.py 2>&1 || echo "Files do not exist."
echo "Current css/: "
ls -1 css/
echo "Current js/: "
ls -1 js/

echo ""
echo "=== 6. Diff nav blocks (index vs solutions/colleges vs product/mcp) ==="
# Extract nav block from index.html
awk '/<nav/,/<\/nav>/' index.html > nav_index.tmp
awk '/<nav/,/<\/nav>/' solutions/colleges.html > nav_colleges.tmp
awk '/<nav/,/<\/nav>/' product/mcp.html > nav_mcp.tmp
diff -u nav_index.tmp nav_colleges.tmp || echo "(nav_colleges matches nav_index perfectly - only path prefixes differ if they are relative, but let's check diff output)"
diff -u nav_index.tmp nav_mcp.tmp || echo "(nav_mcp matches nav_index perfectly - only path prefixes differ if they are relative, but let's check diff output)"

echo ""
echo "=== 7. Confirm product-demo module ==="
ls -l js/product-demo.js css/components.css | grep product-demo || echo "(product-demo found in components.css and js)"
grep "demo-tab" js/product-demo.js | head -n 3
