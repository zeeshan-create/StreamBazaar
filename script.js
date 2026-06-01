const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const PLATFORMS_CONST = `const PLATFORMS = ['PC', 'Laptop', 'PlayStation', 'Xbox', 'Android', 'iOS', 'Tablet', 'TV'];`;
if (!content.includes('PLATFORMS =')) {
  content = content.replace('const DURATION_OPTIONS = [', PLATFORMS_CONST + '\nconst DURATION_OPTIONS = [');
}

// Update default plan shape
content = content.replace(
  /\{ label: 'default', quality: '', duration: 'default', price: '₹', type: '' \}/g,
  "{ label: 'default', quality: '', duration: 'default', price: '₹', type: '', device: 'PC', image: '' }"
);

// We need to find the plan map rendering (lines 987 and 1329) and add device/image inputs.
// I will just use regex to insert the new fields after the duration/price grid.
const planHtml = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Platform/Device</label>
                                            <select 
                                              className="admin-form-input" 
                                              value={plan.device || 'PC'}
                                              onChange={e => {
                                                const newPlans = [...editForm.plans];
                                                newPlans[idx] = { ...newPlans[idx], device: e.target.value };
                                                setEditForm({...editForm, plans: newPlans});
                                              }}
                                            >
                                              {PLATFORMS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                          </div>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Game Logo / Cover URL</label>
                                            <input 
                                              className="admin-form-input" 
                                              placeholder="https://... (Optional)" 
                                              value={plan.image || ''} 
                                              onChange={e => {
                                                const newPlans = [...editForm.plans];
                                                newPlans[idx] = { ...newPlans[idx], image: e.target.value };
                                                setEditForm({...editForm, plans: newPlans});
                                              }} 
                                            />
                                          </div>
                                        </div>`;

content = content.replace(
  /<div className="admin-form-group" style={{ marginBottom: 0 }}>\s*<label style={{ fontSize: '0\.85rem' }}>Price \(₹\)<\/label>\s*<input className="admin-form-input" placeholder="Price" value={plan\.price} onChange={e => \{\s*const newPlans = \[\.\.\.editForm\.plans\];\s*newPlans\[idx\] = \{ \.\.\.newPlans\[idx\], price: e\.target\.value \};\s*setEditForm\(\{\.\.\.editForm, plans: newPlans\}\);\s*\}\} \/>\s*<\/div>\s*<\/div>/g,
  `<div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Price (₹)</label>
                                            <input className="admin-form-input" placeholder="Price" value={plan.price} onChange={e => {
                                              const newPlans = [...editForm.plans];
                                              newPlans[idx] = { ...newPlans[idx], price: e.target.value };
                                              setEditForm({...editForm, plans: newPlans});
                                            }} />
                                          </div>
                                        </div>
                                        ${planHtml}`
);

fs.writeFileSync(file, content);
console.log('Done replacement.');
