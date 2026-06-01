import re

with open('client/src/components/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# We need to add an autocomplete input for the Plan Name if category is Gaming.
# Currently the plan label input looks like this:
target_plan_label = """                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Plan Name (e.g. 4K)</label>
                                            <input className="admin-form-input" placeholder="Plan Name" value={plan.label} onChange={e => {
                                              const newPlans = [...editForm.plans];
                                              newPlans[idx] = { ...newPlans[idx], label: e.target.value };
                                              setEditForm({...editForm, plans: newPlans});
                                            }} />
                                          </div>"""

replacement_plan_label = """                                          <div className="admin-form-group" style={{ marginBottom: 0, position: 'relative' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Plan / Game Name</label>
                                            <input 
                                              className="admin-form-input" 
                                              placeholder={editForm.category === 'Gaming' ? "Search Game (e.g. GTA V)..." : "Plan Name (e.g. 4K)"}
                                              value={plan.label} 
                                              onChange={async e => {
                                                const val = e.target.value;
                                                const newPlans = [...editForm.plans];
                                                newPlans[idx] = { ...newPlans[idx], label: val };
                                                setEditForm({...editForm, plans: newPlans});
                                                
                                                if (editForm.category === 'Gaming' && val.length > 2) {
                                                  try {
                                                    const res = await fetch(`/api/search-games?q=${val}`);
                                                    if (res.ok) {
                                                      const data = await res.json();
                                                      if (Array.isArray(data)) {
                                                        const suggestions = data.slice(0, 5).map(g => ({ name: g.name, logo: g.icon || g.logo }));
                                                        // We store suggestions in a special state or just attach it to the plan object temporarily
                                                        newPlans[idx]._suggestions = suggestions;
                                                        setEditForm({...editForm, plans: newPlans});
                                                      }
                                                    }
                                                  } catch (err) {}
                                                } else {
                                                  newPlans[idx]._suggestions = null;
                                                  setEditForm({...editForm, plans: newPlans});
                                                }
                                              }} 
                                            />
                                            {plan._suggestions && plan._suggestions.length > 0 && (
                                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                                                {plan._suggestions.map((s, sidx) => (
                                                  <div key={sidx} onClick={() => {
                                                    const newPlans = [...editForm.plans];
                                                    newPlans[idx] = { ...newPlans[idx], label: s.name, image: s.logo, _suggestions: null };
                                                    setEditForm({...editForm, plans: newPlans});
                                                  }} style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <img src={s.logo} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain' }} alt="" onError={e => e.target.style.display='none'} />
                                                    <span style={{ fontSize: '0.85rem' }}>{s.name}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>"""

code = code.replace(target_plan_label, replacement_plan_label)

with open('client/src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Game plan patcher finished")
