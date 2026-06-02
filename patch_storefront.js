const fs = require('fs');

let sfContent = fs.readFileSync('./client/src/components/Storefront.jsx', 'utf-8');

// 1. Update fetchPlans
const fetchPlansStart = sfContent.indexOf("const fetchPlans = useCallback(() => {");
const fetchPlansEnd = sfContent.indexOf("}, []);", fetchPlansStart) + 7;

if (fetchPlansStart !== -1 && fetchPlansEnd !== -1) {
  const replacementFetchPlans = `const fetchPlans = useCallback(() => {
    const cacheBuster = Date.now();
    fetch(\`\${API_BASE}/api/plans?v=\${cacheBuster}\`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { 
        const formatted = d.map(p => {
          const lower = p.name.toLowerCase();
          
          if (!p.primaryColor || p.primaryColor === '#000000' || p.primaryColor === '#333' || p.primaryColor === '#333333' || p.primaryColor === '') {
             const matchedBrand = Object.keys(BRAND_COLORS).find(k => lower.includes(k));
             if (matchedBrand) {
                p.primaryColor = BRAND_COLORS[matchedBrand];
                p.secondaryColor = BRAND_COLORS[matchedBrand];
             } else {
                // Fallback for old 'color' field
                if (p.color) {
                   p.primaryColor = p.color;
                   p.secondaryColor = p.color;
                }
             }
          }

          if (!p.category || p.category.trim() === '') {
             const matchedCat = Object.keys(BRAND_CATEGORIES).find(k => lower.includes(k));
             p.category = matchedCat ? BRAND_CATEGORIES[matchedCat] : 'Streaming';
          }
          
          return p;
        });
        setPlans(formatted); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);`;

  sfContent = sfContent.substring(0, fetchPlansStart) + replacementFetchPlans + sfContent.substring(fetchPlansEnd);
}

// 2. Update rendering colors
// Replace: const rawColor = sanitizeColor(product.color);
// With: const rawPrimary = sanitizeColor(product.primaryColor) || sanitizeColor(product.color); const rawSecondary = sanitizeColor(product.secondaryColor) || sanitizeColor(product.color) || rawPrimary;
sfContent = sfContent.replace(/const rawColor = sanitizeColor\(product\.color\);/g, 
  "const rawPrimary = sanitizeColor(product.primaryColor) || sanitizeColor(product.color);\n                const rawSecondary = sanitizeColor(product.secondaryColor) || sanitizeColor(product.color) || rawPrimary;");

// Replace: const effectiveColor = isDarkColor(rawColor) ? VIBRANT_COLORS[idx % VIBRANT_COLORS.length] : rawColor;
// With effectivePrimary and effectiveSecondary
sfContent = sfContent.replace(/const effectiveColor = isDarkColor\(rawColor\) \? VIBRANT_COLORS\[idx % VIBRANT_COLORS\.length\] : rawColor;/g, 
  "const effectiveColor = isDarkColor(rawPrimary) ? VIBRANT_COLORS[idx % VIBRANT_COLORS.length] : rawPrimary;\n                const effectiveSecondary = isDarkColor(rawSecondary) ? VIBRANT_COLORS[(idx+2) % VIBRANT_COLORS.length] : rawSecondary;");

// Update gradients to use effectiveSecondary
// Old: background: `linear-gradient(135deg, ${effectiveColor}, ${VIBRANT_COLORS[(i + 2) % VIBRANT_COLORS.length]}, ${VIBRANT_COLORS[(i + 4) % VIBRANT_COLORS.length]})`
sfContent = sfContent.replace(/background: `linear-gradient\(135deg, \$\{effectiveColor\}, \$\{VIBRANT_COLORS\[\(i \+ 2\) % VIBRANT_COLORS\.length\]\}, \$\{VIBRANT_COLORS\[\(i \+ 4\) % VIBRANT_COLORS\.length\]\}\)`/g,
  "background: `linear-gradient(135deg, ${effectiveColor}, ${effectiveSecondary})`");
  
sfContent = sfContent.replace(/background: `linear-gradient\(135deg, \$\{effectiveColor\}, \$\{VIBRANT_COLORS\[\(i \+ 1\) % VIBRANT_COLORS\.length\]\}, \$\{VIBRANT_COLORS\[\(i \+ 3\) % VIBRANT_COLORS\.length\]\}\)`/g,
  "background: `linear-gradient(135deg, ${effectiveColor}, ${effectiveSecondary})`");

fs.writeFileSync('./client/src/components/Storefront.jsx', sfContent);
console.log("Storefront.jsx patched successfully.");
