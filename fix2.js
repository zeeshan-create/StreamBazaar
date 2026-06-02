const fs = require('fs');
let file = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

file = file.replace(
  /<div style=\{\{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: editForm\.color \|\| '#333' \}\}><\/div>\s*<input className="admin-form-input" style=\{\{ flex: 1 \}\} value=\{editForm\.color\} onChange=\{e => setEditForm\(\{\.\.\.editForm, color: e\.target\.value\}\)\} \/>/g,
  `<div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.color || '').trim())) ? '#' + editForm.color.trim() : editForm.color || '#333' }}></div>
                                      <input className="admin-form-input" style={{ flex: 1 }} value={editForm.color || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, color: val}); }} />`
);

file = file.replace(
  /<div style=\{\{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: editForm\.color \|\| '#333' \}\}><\/div>\s*<input className="admin-form-input" style=\{\{ flex: 1 \}\} placeholder="#e50914" value=\{editForm\.color \|\| ''\} onChange=\{e => setEditForm\(\{\.\.\.editForm, color: e\.target\.value\}\)\} \/>/g,
  `<div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.color || '').trim())) ? '#' + editForm.color.trim() : editForm.color || '#333' }}></div>
                                <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.color || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, color: val}); }} />`
);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', file);
console.log('Patched');
