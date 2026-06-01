const fs = require('fs');
const file = 'client/src/components/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// Modify the map in Storefront to show TV, PC, iOS, Android for OTT, and PlayStation, Xbox, PC, Laptop for Gaming.
content = content.replace(
  /\{DEVICES\.map\(\(d, i\) => \{/,
  `{(popup.product.category === 'Gaming' ? DEVICES.filter(d => ['PC', 'Laptop', 'PlayStation', 'Xbox'].includes(d.id)) : DEVICES.filter(d => ['TV', 'PC', 'iOS', 'Android'].includes(d.id))).map((d, i) => {`
);

// We need to also fix the grid template columns
// If Gaming has 4, and OTT has 4, it's always repeat(4, 1fr)!
content = content.replace(
  /style=\{\{ gridTemplateColumns: popup\.product\.category === 'Gaming' \? 'repeat\(2,1fr\)' : 'repeat\(4,1fr\)' \}\}/,
  `style={{ gridTemplateColumns: 'repeat(4,1fr)' }}`
);

// We also need to fix FEATURES text! "Works on Laptop, PC, iOS and Android"
content = content.replace(
  /\{ icon: '📱', title: '1 Device Access',    desc: 'Works on Laptop, PC, iOS and Android — your choice\.' \},/,
  `{ icon: '📱', title: '1 Device Access',    desc: 'Works on TV, PC, iOS and Android — your choice.' },`
);


fs.writeFileSync(file, content);
console.log('Storefront updated');
