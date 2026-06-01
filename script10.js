const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Inject PLATFORMS array
const platformsArray = "const PLATFORMS = ['TV', 'PC', 'iOS', 'Android', 'Laptop', 'PS4', 'PS5', 'Xbox'];";
if (!content.includes(platformsArray)) {
  content = content.replace(
    /const DURATION_OPTIONS = \[.*?\];/,
    "const DURATION_OPTIONS = ['1 Month', '3 Months', '6 Months', '12 Months'];\n" + platformsArray
  );
}

// Inject fields into both map loops (there are two map loops for plans)
// The loop ends with:
//                                         </div>
//                                       </div>
//                                     ))}
// Let's replace the grid div block for duration/price to ALSO append the new fields block.
const fieldsToInject = `
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Platform/Device</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                              {PLATFORMS.map(opt => {
                                                const currentSupported = plan.supportedDevices || (plan.device ? [plan.device] : ['TV', 'PC', 'iOS', 'Android']);
                                                const isSelected = currentSupported.includes(opt);
                                                return (
                                                  <div 
                                                    key={opt}
                                                    onClick={() => {
                                                      const newPlans = [...editForm.plans];
                                                      let newSupported = [...currentSupported];
                                                      if (isSelected) {
                                                        newSupported = newSupported.filter(d => d !== opt);
                                                      } else {
                                                        newSupported.push(opt);
                                                      }
                                                      newPlans[idx] = { ...newPlans[idx], supportedDevices: newSupported };
                                                      setEditForm({...editForm, plans: newPlans});
                                                    }}
                                                    style={{
                                                      padding: '0.2rem 0.6rem',
                                                      fontSize: '0.75rem',
                                                      borderRadius: '12px',
                                                      cursor: 'pointer',
                                                      background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                      color: isSelected ? 'white' : 'var(--text-muted)',
                                                      border: '1px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--color-border)')
                                                    }}
                                                  >
                                                    {opt}
                                                  </div>
                                                )
                                              })}
                                            </div>
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
                                        </div>
`;

// There are two "Price" form groups. Let's find them and append `fieldsToInject`.
const priceBlockRegex = /(<div className="admin-form-group" style={{ marginBottom: 0 }}>\s*<label style={{ fontSize: '0\.85rem' }}>Price \(₹\)<\/label>\s*<input className="admin-form-input" placeholder="Price" value=\{plan\.price\} onChange=\{e => \{\s*const newPlans = \[\.\.\.editForm\.plans\];\s*newPlans\[idx\] = \{ \.\.\.newPlans\[idx\], price: e\.target\.value \};\s*setEditForm\(\{\.\.\.editForm, plans: newPlans\}\);\s*\}\} \/>\s*<\/div>\s*<\/div>)/g;

content = content.replace(priceBlockRegex, "$1" + fieldsToInject);

// Fix the "Add Plan" button to include supportedDevices default
content = content.replace(
  /\{ label: 'default', quality: '', duration: 'default', price: '₹', type: '' \}/g,
  "{ label: 'default', quality: '', duration: 'default', price: '₹', type: '', supportedDevices: ['TV', 'PC', 'iOS', 'Android'], image: '' }"
);

fs.writeFileSync(file, content);
console.log('Restored and updated AdminDashboard fields.');
