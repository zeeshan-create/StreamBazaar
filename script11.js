const fs = require('fs');
const file = 'client/src/components/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace <d.icon /> with {d.icon()}
content = content.replace(
  /<d\.icon \/>/g,
  "{d.icon()}"
);

fs.writeFileSync(file, content);
console.log('Fixed SVG rendering in Storefront.jsx');
