const fs = require('fs');

const path = 'client/src/components/AdminDashboard.jsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<div className="admin-form-group" style=\{\{ marginBottom: 0 \}\}>\s*<label style=\{\{ fontSize: '0\.85rem' \}\}>Game Logo \/ Cover URL<\/label>[\s\S]*?<\/div>\s*<\/div>/g;

// Wait, the grid has 2 columns: Platform/Device and Game Logo.
// Let's replace the grid to just be a flex or just 1 column!
code = code.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' \}\}>([\s\S]*?)<div className="admin-form-group" style=\{\{ marginBottom: 0 \}\}>\s*<label style=\{\{ fontSize: '0\.85rem' \}\}>Game Logo \/ Cover URL<\/label>[\s\S]*?<\/div>\s*<\/div>/g, (match, platformDiv) => {
    return `<div style={{ marginTop: '1rem' }}>${platformDiv}</div>`;
});

fs.writeFileSync(path, code);
console.log('Replaced instances:', code.match(/Game Logo \/ Cover URL/g));
