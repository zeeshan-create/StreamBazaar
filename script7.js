const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update PLATFORMS
content = content.replace(
  /const PLATFORMS = \['PC', 'Laptop', 'PlayStation', 'Xbox', 'Android', 'iOS', 'Tablet', 'TV'\];/,
  "const PLATFORMS = ['TV', 'PC', 'iOS', 'Android', 'Laptop', 'PS4', 'PS5', 'Xbox'];"
);

// We need to replace the <select> for plan.device with a custom chip selector for plan.supportedDevices
const selectorHtml = `
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                              {PLATFORMS.map(opt => {
                                                // Handle legacy plan.device OR plan.supportedDevices array
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
                                                      border: \`1px solid \${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}\`
                                                    }}
                                                  >
                                                    {opt}
                                                  </div>
                                                )
                                              })}
                                            </div>
`;

// Find and replace the specific block
const oldSelectRegex = /<select[\s\S]*?className="admin-form-input"[\s\S]*?value=\{plan\.device \|\| 'PC'\}[\s\S]*?onChange=\{e => \{[\s\S]*?const newPlans = \[\.\.\.editForm\.plans\];[\s\S]*?newPlans\[idx\] = \{ \.\.\.newPlans\[idx\], device: e\.target\.value \};[\s\S]*?setEditForm\(\{\.\.\.editForm, plans: newPlans\}\);[\s\S]*?\}\}[\s\S]*?>[\s\S]*?\{PLATFORMS\.map\(opt => <option key=\{opt\} value=\{opt\}>\{opt\}<\/option>\)\}[\s\S]*?<\/select>/g;

content = content.replace(oldSelectRegex, selectorHtml);

fs.writeFileSync(file, content);
console.log('AdminDashboard updated');
