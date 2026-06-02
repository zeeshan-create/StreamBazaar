const fs = require('fs');

let adminContent = fs.readFileSync('./client/src/components/AdminDashboard.jsx', 'utf-8');

// 1. Add vibrant import
if (!adminContent.includes("import Vibrant from 'node-vibrant'")) {
  adminContent = adminContent.replace("import '../App.css';", "import Vibrant from 'node-vibrant';\nimport '../App.css';");
}

// 2. Replace handleSelect
const handleSelectStart = adminContent.indexOf("const handleSelect = (item) => {");
const handleDropStart = adminContent.indexOf("const handleDrop = (e) => {");

if (handleSelectStart !== -1 && handleDropStart !== -1) {
  const replacementHandleSelect = `const handleSelect = (item) => {
    if (onNameChange) {
      onNameChange(item.name);
    } else {
      setEditForm({ ...editForm, name: item.name });
    }

    const autoColor = '#6366f1'; // Default fallback

    const bestIcon = item.icon || \`https://www.google.com/s2/favicons?domain=\${item.domain}&sz=256\`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = async () => {
      try {
        const palette = await Vibrant.from(img).getPalette();
        const primary = palette.Vibrant ? palette.Vibrant.hex : autoColor;
        const secondary = palette.DarkVibrant ? palette.DarkVibrant.hex : (palette.Muted ? palette.Muted.hex : autoColor);
        
        setEditForm(prev => ({ 
          ...prev, 
          name: item.name, 
          customIcon: bestIcon,
          primaryColor: primary,
          secondaryColor: secondary,
          ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
        }));
      } catch(e) {
        setEditForm(prev => ({ 
          ...prev, 
          name: item.name, 
          customIcon: bestIcon,
          primaryColor: autoColor,
          secondaryColor: autoColor,
          ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
        }));
      }
    };
    img.onerror = () => {
      setEditForm(prev => ({ 
        ...prev, 
        name: item.name, 
        customIcon: bestIcon,
        primaryColor: autoColor,
        secondaryColor: autoColor,
        ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
      }));
    };
    img.src = bestIcon;
    setSuggestions([]);
  };

  `;

  adminContent = adminContent.substring(0, handleSelectStart) + replacementHandleSelect + adminContent.substring(handleDropStart);
}

// 3. Replace processFile
const processFileStart = adminContent.indexOf("const processFile = (file) => {");
const returnStart = adminContent.indexOf("return (\n    <div style={{ marginBottom: '1.5rem'");

if (processFileStart !== -1 && returnStart !== -1) {
  const replacementProcessFile = `const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX = 256;
        let w = img.width;
        let h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/webp', 0.9);
        
        let extractedPrimary = editForm.primaryColor || '#6366f1';
        let extractedSecondary = editForm.secondaryColor || '#6366f1';
        
        try {
          const palette = await Vibrant.from(img).getPalette();
          if (palette.Vibrant) extractedPrimary = palette.Vibrant.hex;
          if (palette.DarkVibrant) extractedSecondary = palette.DarkVibrant.hex;
          else if (palette.Muted) extractedSecondary = palette.Muted.hex;
        } catch(e) {}
        
        setEditForm(prev => ({ ...prev, customIcon: dataUrl, primaryColor: extractedPrimary, secondaryColor: extractedSecondary }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  `;

  adminContent = adminContent.substring(0, processFileStart) + replacementProcessFile + adminContent.substring(returnStart);
}

// 4. Update the input fields in AdminDashboard to use primaryColor and secondaryColor
adminContent = adminContent.replace(/editForm\.color/g, "editForm.primaryColor");

// Also add secondaryColor input next to primaryColor
const accentColorSectionRegex = /<label>Accent Hex Color<\/label>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
const accentColorMatch = adminContent.match(accentColorSectionRegex);

if (accentColorMatch) {
  const newAccentColorSection = `<label>Brand Colors (Auto-Extracted)</label>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Primary Color</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.primaryColor || '').trim())) ? '#' + editForm.primaryColor.trim() : editForm.primaryColor || '#333' }}></div>
                                    <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.primaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, primaryColor: val}); }} />
                                  </div>
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Secondary Color</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.secondaryColor || '').trim())) ? '#' + editForm.secondaryColor.trim() : editForm.secondaryColor || '#333' }}></div>
                                    <input className="admin-form-input" style={{ flex: 1 }} placeholder="#7a0010" value={editForm.secondaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, secondaryColor: val}); }} />
                                  </div>
                                </div>
                              </div>
                            </div>`;
  
  adminContent = adminContent.replace(accentColorMatch[0], newAccentColorSection);
}

// 5. Update the accent color section in the EDIT block as well
const accentColorSectionRegex2 = /<label>Accent Color<\/label>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
const accentColorMatch2 = adminContent.match(accentColorSectionRegex2);

if (accentColorMatch2) {
  const newAccentColorSection2 = `<label>Brand Colors (Auto-Extracted)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Primary Color</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                          <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.primaryColor || '').trim())) ? '#' + editForm.primaryColor.trim() : editForm.primaryColor || '#333' }}></div>
                                          <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.primaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, primaryColor: val}); }} />
                                        </div>
                                      </div>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Secondary Color</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                          <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.secondaryColor || '').trim())) ? '#' + editForm.secondaryColor.trim() : editForm.secondaryColor || '#333' }}></div>
                                          <input className="admin-form-input" style={{ flex: 1 }} placeholder="#7a0010" value={editForm.secondaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, secondaryColor: val}); }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>`;
  adminContent = adminContent.replace(accentColorMatch2[0], newAccentColorSection2);
}

// 6. Fix onNameChange setting of newColor
adminContent = adminContent.replace(/let newColor = editForm.primaryColor;/g, "let newPrimary = editForm.primaryColor; let newSecondary = editForm.secondaryColor;");
adminContent = adminContent.replace(/const colorIsDefault = !editForm.primaryColor \|\| editForm.primaryColor === '#6366f1' \|\| editForm.primaryColor === '#000000';/g, "const colorIsDefault = !editForm.primaryColor || editForm.primaryColor === '#6366f1' || editForm.primaryColor === '#000000';");
adminContent = adminContent.replace(/if \(colorIsDefault && BRAND_COLORS\[matchedBrand\]\) newColor = BRAND_COLORS\[matchedBrand\];/g, "if (colorIsDefault && BRAND_COLORS[matchedBrand]) { newPrimary = BRAND_COLORS[matchedBrand]; newSecondary = BRAND_COLORS[matchedBrand]; }");
adminContent = adminContent.replace(/setEditForm\(\{...editForm, name: val, category: newCategory, primaryColor: newColor\}\);/g, "setEditForm({...editForm, name: val, category: newCategory, primaryColor: newPrimary, secondaryColor: newSecondary});");

// 7. Update Add button default state
adminContent = adminContent.replace(/color: '#6366f1'/g, "primaryColor: '#6366f1', secondaryColor: '#4f46e5'");

fs.writeFileSync('./client/src/components/AdminDashboard.jsx', adminContent);
console.log("AdminDashboard.jsx patched successfully.");
