const fs = require('fs');
let file = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

file = file.replace(
  /color:\s*\(\!prev\.color\s*\|\|\s*\[.*\]\.includes\(prev\.color\.toLowerCase\(\)\)\)\s*\?\s*autoColor\s*:\s*prev\.color,/g,
  'color: extractedColor || autoColor,'
);

file = file.replace(
  /color:\s*\(\!prev\.color\s*\|\|\s*\[.*\]\.includes\(prev\.color\.toLowerCase\(\)\)\)\s*\?\s*autoColor\s*:\s*prev\.color,/g,
  'color: autoColor,' // fallback
);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', file);
console.log('Fixed AdminDashboard colors');
