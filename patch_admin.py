import re

with open('client/src/components/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update LogoUploader to use Brandfetch instead of Clearbit
# Replace: const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${val}`);
code = code.replace(
    "const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${val}`);",
    "const res = await fetch(`https://api.brandfetch.io/v2/search/${val}`);"
)

# Brandfetch returns data in different format than Clearbit.
# Clearbit: [{name, domain, logo}, ...]
# Brandfetch: [{name, domain, icon}, ...] (and no logo property, it's called icon).
brandfetch_mapping_target = """        if (res.ok) data = await res.json();"""
brandfetch_mapping_replacement = """        if (res.ok) {
          const rawData = await res.json();
          data = rawData.map(item => ({
            name: item.name,
            domain: item.domain,
            logo: item.icon,
            isGame: false
          }));
        }"""
code = code.replace(brandfetch_mapping_target, brandfetch_mapping_replacement)

# Update the rendering of the icon in LogoUploader suggestions
# from: src={s.isGame ? s.logo : `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`}
# to: src={s.logo || `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`}
code = code.replace(
    "src={s.isGame ? s.logo : `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`}",
    "src={s.logo || `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`}"
)

# Update handleSelect to use item.logo if available, else favicon
code = code.replace(
    "let iconUrl = item.isGame ? item.logo : `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`;",
    "let iconUrl = item.logo || `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`;"
)


# 2. Add ActiveCategoryFilter state and logic
filter_target = """  const filteredServices = services.filter(s => {
    return s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
           s.category.toLowerCase().includes(debouncedSearch.toLowerCase());
  });"""
filter_replacement = """  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                          s.category.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || s.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });"""
code = code.replace(filter_target, filter_replacement)

# 3. Add Category Filter Tabs to the UI
ui_target = """                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setProductView('grid')}
                        className="user-filter-btn" 
                        style={{ background: productView === 'grid' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'grid' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        Grid Layout
                      </button>
                      <button 
                        onClick={() => setProductView('list')}
                        className="user-filter-btn"
                        style={{ background: productView === 'list' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'list' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        List Layout
                      </button>
                    </div>

                    <button 
                      className="btn-primary"
                      onClick={() => {"""
ui_replacement = """                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setProductView('grid')}
                        className="user-filter-btn" 
                        style={{ background: productView === 'grid' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'grid' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        Grid Layout
                      </button>
                      <button 
                        onClick={() => setProductView('list')}
                        className="user-filter-btn"
                        style={{ background: productView === 'list' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'list' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        List Layout
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--card)', padding: '4px', borderRadius: '12px' }}>
                      {['All', 'Streaming', 'VPN', 'Gaming', 'AI+'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategoryFilter(cat)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeCategoryFilter === cat ? 'var(--color-primary)' : 'transparent',
                            color: activeCategoryFilter === cat ? 'white' : 'var(--color-text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button 
                      className="btn-primary"
                      onClick={() => {"""
code = code.replace(ui_target, ui_replacement)

with open('client/src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patcher finished")
