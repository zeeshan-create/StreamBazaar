const fs = require('fs');
const file = 'client/src/components/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the map logic with explicitly ordered arrays
const newMapLogic = `
                {(popup.product.category === 'Gaming' ? [
                  { id: 'PC', label: 'PC', emoji: '🖥️' },
                  { id: 'Laptop', label: 'Laptop', emoji: '💻' },
                  { id: 'PlayStation', label: 'PlayStation', emoji: '🎮' },
                  { id: 'Xbox', label: 'Xbox', emoji: '🎮' }
                ] : [
                  { id: 'TV', label: 'TV', emoji: '📺' },
                  { id: 'PC', label: 'PC', emoji: '🖥️' },
                  { id: 'iOS', label: 'iOS', emoji: '📱' },
                  { id: 'Android', label: 'Android', emoji: '🤖' }
                ]).map((d, i) => {
`;

// Find the line to replace
content = content.replace(
  /\{\(popup\.product\.category === 'Gaming' \? DEVICES\.filter\(d => \['PC', 'Laptop', 'PlayStation', 'Xbox'\]\.includes\(d\.id\)\) : DEVICES\.filter\(d => \['TV', 'PC', 'iOS', 'Android'\]\.includes\(d\.id\)\)\)\.map\(\(d, i\) => \{/,
  newMapLogic
);

fs.writeFileSync(file, content);
console.log('Fixed Storefront device order.');
