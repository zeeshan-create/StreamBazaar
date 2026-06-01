const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace backtick syntax with string concatenation to avoid esbuild parsing issues
content = content.replace(
  /border: `1px solid \$\{isSelected \? 'var\(--color-primary\)' : 'var\(--color-border\)'\}`/g,
  "border: '1px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--color-border)')"
);

fs.writeFileSync(file, content);
console.log('Fixed backticks in AdminDashboard.');
