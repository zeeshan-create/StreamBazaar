const fs = require('fs');

// 1. Patch Storefront.jsx
let sfContent = fs.readFileSync('client/src/components/Storefront.jsx', 'utf8');

const sfOld = `const matchCat    = activeCategory === 'all' || p.category === activeCategory;`;
const sfNew = `const matchCat    = activeCategory === 'all' || p.category === activeCategory || (activeCategory === 'Gaming' && (p.category === 'Steam' || p.category === 'PlayStation' || p.category === 'Steam Gaming'));`;

sfContent = sfContent.replace(sfOld.replace(/\n/g, '\r\n'), sfNew.replace(/\n/g, '\r\n'));
sfContent = sfContent.replace(sfOld, sfNew);
fs.writeFileSync('client/src/components/Storefront.jsx', sfContent);


// 2. Patch AdminDashboard.jsx
let adminContent = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

// A. Patch the Add Product Category Selector
const catOld = `<div className="admin-form-group">
                              <label>Category</label>
                              <select 
                                className="admin-form-input" 
                                value={['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) ? editForm.category : 'Custom'}
                                onChange={e => {
                                  if (e.target.value === 'Custom') {
                                    setEditForm({...editForm, category: ''});
                                  } else {
                                    setEditForm({...editForm, category: e.target.value});
                                  }
                                }}
                              >
                                <option value="Streaming" style={{color: '#ef4444'}}>Streaming</option>
                                <option value="Gaming" style={{color: '#22c55e'}}>Gaming</option>
                                <option value="VPN" style={{color: '#3b82f6'}}>VPN</option>
                                <option value="AI+" style={{color: '#a855f7'}}>AI+</option>
                                <option value="Custom">Custom...</option>
                              </select>
                              {!['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) && editForm.category !== undefined && (`;

const catNew = `<div className="admin-form-group">
                              <label>Category / Section</label>
                              <select 
                                className="admin-form-input" 
                                value={['Streaming', 'Steam', 'PlayStation', 'VPN', 'AI+'].includes(editForm.category) ? editForm.category : 'Custom'}
                                onChange={e => {
                                  if (e.target.value === 'Custom') {
                                    setEditForm({...editForm, category: ''});
                                  } else {
                                    setEditForm({...editForm, category: e.target.value});
                                  }
                                }}
                              >
                                <option value="Streaming" style={{color: '#ef4444'}}>OTT / Streaming</option>
                                <option value="Steam" style={{color: '#22c55e'}}>Steam Games</option>
                                <option value="PlayStation" style={{color: '#0070CC'}}>PlayStation Games</option>
                                <option value="VPN" style={{color: '#3b82f6'}}>VPN Services</option>
                                <option value="AI+" style={{color: '#a855f7'}}>AI Services</option>
                                <option value="Custom">Custom...</option>
                              </select>
                              {!['Streaming', 'Steam', 'PlayStation', 'VPN', 'AI+'].includes(editForm.category) && editForm.category !== undefined && (`;

adminContent = adminContent.replace(catOld.replace(/\n/g, '\r\n'), catNew.replace(/\n/g, '\r\n'));
adminContent = adminContent.replace(catOld, catNew);


// B. Patch the Layout Filter logic I added previously
const filterOld = `{services.filter(s => {
                      if (activeTab === 'ott') return s.category === 'Streaming' || s.category === 'AI+' || s.category === 'VPN'; // Show streaming & other generic stuff here, or maybe just 'Streaming'
                      if (activeTab === 'steam') return s.name.toLowerCase().includes('steam');
                      if (activeTab === 'playstation') return s.name.toLowerCase().includes('playstation');
                      return false;
                    }).map(service => (`;

const filterNew = `{services.filter(s => {
                      if (activeTab === 'ott') return ['Streaming', 'VPN', 'AI+'].includes(s.category) || (s.category || '').toLowerCase() === 'ott';
                      if (activeTab === 'steam') return s.category === 'Steam' || (s.category || '').toLowerCase() === 'gaming' && s.name.toLowerCase().includes('steam');
                      if (activeTab === 'playstation') return s.category === 'PlayStation' || (s.category || '').toLowerCase() === 'gaming' && s.name.toLowerCase().includes('playstation');
                      return false;
                    }).map(service => (`;

adminContent = adminContent.replace(filterOld.replace(/\n/g, '\r\n'), filterNew.replace(/\n/g, '\r\n'));
adminContent = adminContent.replace(filterOld, filterNew);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', adminContent);
console.log('Successfully patched Storefront.jsx and AdminDashboard.jsx for exact category mapping.');
