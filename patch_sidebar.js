const fs = require('fs');
let content = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

// 1. Initial State
content = content.replace(
  "const [activeTab, setActiveTab] = useState('products');",
  "const [activeTab, setActiveTab] = useState('ott');"
);

// 2. Filter logic
content = content.replace(
  /const filteredServices = services\.filter\(s => \{\s*return s\.name\.toLowerCase\(\)\.includes\(debouncedSearch\.toLowerCase\(\)\) \|\| \s*s\.category\.toLowerCase\(\)\.includes\(debouncedSearch\.toLowerCase\(\)\);\s*\}\);/,
  `const filteredServices = services.filter(s => {
    const searchMatch = (s.name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) || 
           (s.category || '').toLowerCase().includes(debouncedSearch.toLowerCase());
           
    let tabMatch = true;
    if (activeTab === 'ott') {
      tabMatch = !['Steam', 'PlayStation', 'Gaming'].includes(s.category);
    } else if (activeTab === 'steam') {
      tabMatch = ['Steam', 'Gaming'].includes(s.category) || (s.category || '').toLowerCase() === 'steam';
    } else if (activeTab === 'playstation') {
      tabMatch = ['PlayStation'].includes(s.category) || (s.category || '').toLowerCase() === 'playstation';
    }
    
    return searchMatch && tabMatch;
  });`
);

// 3. Sidebar Buttons
content = content.replace(
  /<div className="sidebar-menu">\s*<button \s*className=\{`sidebar-btn \$\{activeTab === 'products' \? 'active' : ''\}`\}\s*onClick=\{\(\) => \{ setActiveTab\('products'\); setSidebarExpanded\(false\); \}\}\s*>\s*<Package size=\{18\} \/> Products & Plans\s*<\/button>/,
  `<div className="sidebar-menu">
              <button 
                className={\`sidebar-btn \${activeTab === 'ott' ? 'active' : ''}\`}
                onClick={() => { setActiveTab('ott'); setSidebarExpanded(false); }}
              >
                <Monitor size={18} /> OTT & Streaming
              </button>
              <button 
                className={\`sidebar-btn \${activeTab === 'steam' ? 'active' : ''}\`}
                onClick={() => { setActiveTab('steam'); setSidebarExpanded(false); }}
              >
                <Gamepad2 size={18} /> Steam Games
              </button>
              <button 
                className={\`sidebar-btn \${activeTab === 'playstation' ? 'active' : ''}\`}
                onClick={() => { setActiveTab('playstation'); setSidebarExpanded(false); }}
              >
                <Tv2 size={18} /> PlayStation Games
              </button>
              <button 
                className={\`sidebar-btn \${activeTab === 'products' ? 'active' : ''}\`}
                onClick={() => { setActiveTab('products'); setSidebarExpanded(false); }}
              >
                <Package size={18} /> All Services
              </button>`
);

// 4. Panel Title
content = content.replace(
  /<h1 style=\{\{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var\(--font-display\)', textTransform: 'capitalize' \}\}>\s*\{activeTab\} Panel\s*<\/h1>/,
  `<h1 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'capitalize' }}>
                  {activeTab === 'products' ? 'All Services' : activeTab === 'ott' ? 'OTT & Streaming' : activeTab === 'steam' ? 'Steam Games' : activeTab === 'playstation' ? 'PlayStation Games' : activeTab} Panel
                </h1>`
);

// 5. Render activeTab condition
content = content.replace(
  /\{activeTab === 'products' && \(/g,
  `{['products', 'ott', 'steam', 'playstation'].includes(activeTab) && (`
);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', content);
console.log('Sidebar patch applied!');
