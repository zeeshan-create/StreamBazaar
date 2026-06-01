const fs = require('fs');

let code = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

const newLogoUploader = `const LogoUploader = ({ editForm, setEditForm, getFavicon, onNameChange }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  
  const handleSearch = async (val) => {
    if (onNameChange) {
      onNameChange(val);
    } else {
      setEditForm({...editForm, name: val});
    }

    if (val.length > 2) {
      try {
        const res = await fetch(\`https://api.brandfetch.io/v2/search/\${val}\`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {}
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (company) => {
    if (onNameChange) {
      onNameChange(company.name);
    } else {
      setEditForm({ ...editForm, name: company.name });
    }
    // Set custom icon after a tiny delay so it overrides onNameChange
    setTimeout(() => {
      const bestIcon = company.icon || \`https://www.google.com/s2/favicons?domain=\${company.domain}&sz=256\`;
      setEditForm(prev => ({ ...prev, name: company.name, customIcon: bestIcon }));
    }, 10);
    setSuggestions([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
        setEditForm(prev => ({ ...prev, customIcon: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: '1.5rem', background: 'var(--color-surface)', borderRadius: '12px' }}>
      <div className="admin-form-group">
        <label>Service/Game Title (Auto-Search)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {(editForm.customIcon || getFavicon(editForm.name)) && (
            <img src={editForm.customIcon || getFavicon(editForm.name)} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: '#222' }} alt="Preview" />
          )}
          <div style={{ flex: 1, position: 'relative' }}>
             <input className="admin-form-input" style={{ width: '100%' }} placeholder="Enter name to search brand (e.g. Netflix, Spotify)..." value={editForm.name || ''} onChange={e => handleSearch(e.target.value)} />
             {suggestions.length > 0 && (
               <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                 {suggestions.map(s => (
                    <div key={s.brandId || s.domain} onClick={() => handleSelect(s)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                       <img src={s.icon || \`https://www.google.com/s2/favicons?domain=\${s.domain}&sz=128\`} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain', background: '#fff' }} alt={s.name} onError={e => e.target.style.display='none'} />
                       <span style={{ fontWeight: '500' }}>{s.name}</span>
                       <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.domain}</span>
                    </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('logo-upload').click()}
        style={{ border: \`2px dashed \${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}\`, padding: '1.5rem', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}
      >
        <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = null; }} />
        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Drag & Drop Custom Image or Click to Browse</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', opacity: 0.7 }}>(Auto-optimizes to WebP. Leave empty to use auto-search logo)</div>
      </div>
    </div>
  );
};`;

if (!code.includes('const LogoUploader =')) {
  code = code.replace(/export default function AdminDashboard\(\) \{/, newLogoUploader + '\n\nexport default function AdminDashboard() {');
} else {
  code = code.replace(/const LogoUploader = \(\{ editForm, setEditForm, getFavicon, onNameChange \}\) => \{[\s\S]*?\}\s*;\s*(?=\nexport default)/, newLogoUploader + '\n');
}

// Regex to replace the Service Name (Edit Modal)
const editRegex = /<div className="admin-form-group">\s*<label>Service Name<\/label>\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: '10px' \}\}>\s*\{\(getFavicon\(editForm\.name\) \|\| getGameIcon\(editForm\.name\)\) && \(\s*<img[^>]*>\s*\)\}\s*<input className="admin-form-input" style=\{\{ flex: 1 \}\} value=\{editForm\.name\} onChange=\{e => \{([\s\S]*?)\}\} \/>\s*<\/div>\s*<\/div>/;

// Regex to replace the Service/Game Title (Add Modal)
const addRegex = /<div className="admin-form-group">\s*<label>Service\/Game Title<\/label>\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: '10px' \}\}>\s*\{\(getFavicon\(editForm\.name\) \|\| getGameIcon\(editForm\.name\)\) && \(\s*<img[^>]*>\s*\)\}\s*<input className="admin-form-input" style=\{\{ flex: 1 \}\} placeholder="[^"]*" value=\{editForm\.name \|\| ''\} onChange=\{e => \{([\s\S]*?)\}\} \/>\s*<\/div>\s*<\/div>/;

let count = 0;
code = code.replace(editRegex, (match, onChangeLogic) => {
  count++;
  const extractedLogic = onChangeLogic.replace(/const val = e\.target\.value;/, 'const val = e_val;');
  return `<LogoUploader 
    editForm={editForm} 
    setEditForm={setEditForm} 
    getFavicon={getFavicon} 
    onNameChange={(e_val) => {${extractedLogic}}} 
  />`;
});

code = code.replace(addRegex, (match, onChangeLogic) => {
  count++;
  const extractedLogic = onChangeLogic.replace(/const val = e\.target\.value;/, 'const val = e_val;');
  return `<LogoUploader 
    editForm={editForm} 
    setEditForm={setEditForm} 
    getFavicon={getFavicon} 
    onNameChange={(e_val) => {${extractedLogic}}} 
  />`;
});

fs.writeFileSync('client/src/components/AdminDashboard.jsx', code);
console.log('Successfully refactored LogoUploader! Replaced ' + count + ' inputs.');

