const fs = require('fs');

let code = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

const target = `<div style={{ width: '48px', height: '48px', borderRadius: '12px', background: \`\${s.color}22\`, border: \`1px solid \${s.color}33\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Package size={22} style={{ color: s.color }} />
                                    </div>`;

const replacement = `<div style={{ width: '48px', height: '48px', borderRadius: '12px', background: \`\${s.color}22\`, border: \`1px solid \${s.color}33\`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                      {(s.customIcon || getFavicon(s.name) || getGameIcon(s.name)) ? (
                                        <img src={s.customIcon || getFavicon(s.name) || getGameIcon(s.name)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={s.name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                      ) : null}
                                      <Package size={22} style={{ color: s.color, display: (s.customIcon || getFavicon(s.name) || getGameIcon(s.name)) ? 'none' : 'block' }} />
                                    </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', code);
console.log('Replaced grid icon logic!');
