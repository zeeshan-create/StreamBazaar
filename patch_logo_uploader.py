import re

with open('client/src/components/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the LogoUploader definition
new_logo_uploader = """const LogoUploader = ({ editForm, setEditForm, getFavicon, onNameChange }) => {
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
        // Search clearbit
        const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${val}`);
        let data = [];
        if (res.ok) data = await res.json();
        
        // Search steam via our new API
        try {
          const steamRes = await fetch(`/api/search-games?q=${val}`);
          if (steamRes.ok) {
            const steamData = await steamRes.json();
            if (Array.isArray(steamData)) {
              const gameSuggestions = steamData.slice(0, 3).map(g => ({
                name: g.name,
                domain: g.appid, // Use appid as domain key
                logo: g.icon || g.logo,
                isGame: true
              }));
              data = [...data, ...gameSuggestions];
            }
          }
        } catch(e) {}
        
        setSuggestions(data);
      } catch (err) {}
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    if (onNameChange) {
      onNameChange(item.name);
    } else {
      setEditForm({ ...editForm, name: item.name });
    }
    
    // Set custom icon after a tiny delay so it overrides onNameChange
    setTimeout(() => {
      let iconUrl = item.isGame ? item.logo : `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`;
      setEditForm(prev => ({ ...prev, name: item.name, customIcon: iconUrl }));
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
        <label>Service/Game Title (Auto-Search Logo)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {(editForm.customIcon || getFavicon(editForm.name)) && (
            <img src={editForm.customIcon || getFavicon(editForm.name)} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: '#222' }} alt="Preview" />
          )}
          <div style={{ flex: 1, position: 'relative' }}>
             <input className="admin-form-input" style={{ width: '100%' }} placeholder="Type to search auto logo (e.g. Netflix, GTA V)..." value={editForm.name || ''} onChange={e => handleSearch(e.target.value)} />
             {suggestions.length > 0 && (
               <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                 {suggestions.map(s => (
                    <div key={s.domain} onClick={() => handleSelect(s)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                       <img src={s.isGame ? s.logo : `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain', background: '#fff' }} alt={s.name} onError={e => e.target.style.display='none'} />
                       <span style={{ fontWeight: '500' }}>{s.name}</span>
                       <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.isGame ? 'Game' : s.domain}</span>
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
        style={{ border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`, padding: '1rem', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '10px' }}
      >
        <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = null; }} />
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Drop Custom Image or Click to Browse</div>
      </div>
    </div>
  );
};"""

# Replace the LogoUploader function definition completely
code = re.sub(r'const LogoUploader = \(\{ editForm, setEditForm, getFavicon \}\) => \{.*?\n\};\n', new_logo_uploader + '\n', code, flags=re.DOTALL)


# Now we replace the usages
# There are two places where it looks like this:
# <LogoUploader editForm={editForm} setEditForm={setEditForm} getFavicon={getFavicon} />
# <div className="admin-form-group">
#   <label>Service Name</label>  (or <label>Service/Game Title</label>)
#   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
#     <input className="admin-form-input" style={{ flex: 1 }} value={editForm.name} onChange={e => {
#       const val = e.target.value;
#       // logic
#     }} />
#   </div>
# </div>

# Let's replace the grid edit modal
grid_edit_target = """                                                                    <LogoUploader editForm={editForm} setEditForm={setEditForm} getFavicon={getFavicon} />
                                  <div className="admin-form-group">
                                    <label>Service Name</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <input className="admin-form-input" style={{ flex: 1 }} value={editForm.name} onChange={e => {
                                        const val = e.target.value;
                                        const lowerVal = val.toLowerCase();
                                        let newCategory = editForm.category;
                                        let newColor = editForm.color;
                                        
                                        const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                        if (matchedBrand) {
                                          const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                          const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                          if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                          if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                        }
                                        setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                                      }} />
                                    </div>
                                  </div>"""

grid_edit_replacement = """                                  <LogoUploader 
                                    editForm={editForm} 
                                    setEditForm={setEditForm} 
                                    getFavicon={getFavicon}
                                    onNameChange={(val) => {
                                      const lowerVal = val.toLowerCase();
                                      let newCategory = editForm.category;
                                      let newColor = editForm.color;
                                      
                                      const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                      if (matchedBrand) {
                                        const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                        const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                        if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                        if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                      }
                                      setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                                    }}
                                  />"""

code = code.replace(grid_edit_target, grid_edit_replacement)


# Add modal
add_modal_target = """                                                        <LogoUploader editForm={editForm} setEditForm={setEditForm} getFavicon={getFavicon} />
                            <div className="admin-form-group">
                              <label>Service/Game Title</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input className="admin-form-input" style={{ flex: 1 }} placeholder="Netflix, Grok AI, etc." value={editForm.name || ''} onChange={e => {
                                  const val = e.target.value;
                                  const lowerVal = val.toLowerCase();
                                  
                                  let newCategory = editForm.category;
                                  let newColor = editForm.color;
                                  
                                  const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                  if (matchedBrand) {
                                    const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                    const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                    if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                    if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                  }
                                  
                                  setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                                }} />
                              </div>
                            </div>"""

add_modal_replacement = """                            <LogoUploader 
                              editForm={editForm} 
                              setEditForm={setEditForm} 
                              getFavicon={getFavicon}
                              onNameChange={(val) => {
                                const lowerVal = val.toLowerCase();
                                let newCategory = editForm.category;
                                let newColor = editForm.color;
                                
                                const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                if (matchedBrand) {
                                  const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                  const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                  if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                  if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                }
                                
                                setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                              }}
                            />"""

code = code.replace(add_modal_target, add_modal_replacement)

# Fix React undefined errors by replacing React.useState with just useState
code = code.replace('React.useState', 'useState')

with open('client/src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Success')
