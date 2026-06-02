const fs = require('fs');

// Patch Storefront.jsx for ambient light animation
let sfContent = fs.readFileSync('./client/src/components/Storefront.jsx', 'utf-8');

// Replace whileTap={{ scale: 0.98 }} (gaming cards)
sfContent = sfContent.replace(/whileTap={{ scale: 0\.98 }}/g, "whileTap={{ scale: 0.96, boxShadow: `0px 0px 35px ${effectiveColor}88`, border: `1px solid ${effectiveColor}` }}");

// Replace whileTap={{ scale: 0.97 }} (ott cards)
sfContent = sfContent.replace(/whileTap={{ scale: 0\.97 }}/g, "whileTap={{ scale: 0.96, boxShadow: `0px 0px 35px ${effectiveColor}88`, border: `1px solid ${effectiveColor}` }}");

fs.writeFileSync('./client/src/components/Storefront.jsx', sfContent);
console.log("Storefront.jsx patched for animations.");


// Patch AdminDashboard.jsx for random nice color and modal fields
let adminContent = fs.readFileSync('./client/src/components/AdminDashboard.jsx', 'utf-8');

// 1. Replace the fallback color in handleSelect and processFile
adminContent = adminContent.replace(/const autoColor = '#6366f1'; \/\/ Default fallback/g, 
  `const VIBRANT_COLORS = ['#ff0055', '#00e5a0', '#00b8ff', '#ffaa00', '#b800ff', '#ff00aa', '#00ffcc', '#ff3366', '#33ccff', '#ffcc00'];
   const autoColor = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];`);

adminContent = adminContent.replace(/let extractedPrimary = editForm\.primaryColor \|\| '#6366f1';/g,
  `const VIBRANT_COLORS = ['#ff0055', '#00e5a0', '#00b8ff', '#ffaa00', '#b800ff', '#ff00aa', '#00ffcc', '#ff3366', '#33ccff', '#ffcc00'];
   let extractedPrimary = editForm.primaryColor || VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];`);
   
adminContent = adminContent.replace(/let extractedSecondary = editForm\.secondaryColor \|\| '#6366f1';/g,
  `let extractedSecondary = editForm.secondaryColor || VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];`);

// 2. Fix the color: newColor bug in the onNameChange handler for the Add New Service modal (around line 1400)
adminContent = adminContent.replace(/setEditForm\(\{\.\.\.editForm, name: val, category: newCategory, color: newColor\}\);/g,
  `setEditForm({...editForm, name: val, category: newCategory, primaryColor: newPrimary, secondaryColor: newSecondary});`);

// 3. Add Brand Colors block to the Add Form (replacing Accent Hex Color block in Add Form)
// The regex looks for Accent Hex Color specifically in the file (if it wasn't replaced earlier)
const accentColorSectionRegex3 = /<label>Accent Hex Color<\/label>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
const match3 = adminContent.match(accentColorSectionRegex3);

if (match3) {
  const newAccentColorSection3 = `<label>Brand Colors (Auto-Extracted)</label>
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
  adminContent = adminContent.replace(match3[0], newAccentColorSection3);
}

// 4. In `handleAddService`, change the payload to submit primaryColor and secondaryColor
// Currently it might be sending `color: editForm.color`
adminContent = adminContent.replace(/color: editForm\.color \|\| '#6366f1'/g, "primaryColor: editForm.primaryColor, secondaryColor: editForm.secondaryColor");

fs.writeFileSync('./client/src/components/AdminDashboard.jsx', adminContent);
console.log("AdminDashboard.jsx patched for modal bugs and random colors.");
