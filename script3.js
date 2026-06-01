const fs = require('fs');
const file = 'client/src/components/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update DEVICES array
const newDevices = `const DEVICES = [
  { id: 'PC', label: 'PC', emoji: '🖥️' },
  { id: 'Laptop', label: 'Laptop', emoji: '💻' },
  { id: 'PlayStation', label: 'PlayStation', emoji: '🎮' },
  { id: 'Xbox', label: 'Xbox', emoji: '🎮' },
  { id: 'Android', label: 'Android', emoji: '🤖' },
  { id: 'iOS', label: 'iOS', emoji: '📱' },
  { id: 'Tablet', label: 'Tablet', emoji: '📱' },
  { id: 'TV', label: 'TV', emoji: '📺' },
];`;

content = content.replace(
  /const DEVICES = \[\s*\{ id: 'Laptop',  label: 'Laptop',  emoji: '💻' \},\s*\{ id: 'PC',      label: 'PC',      emoji: '🖥️' \},\s*\{ id: 'iOS',     label: 'iOS',     emoji: '📱' \},\s*\{ id: 'Android', label: 'Android', emoji: '🤖' \},\s*\];/,
  newDevices
);

// We also have `DEVICES_GAMING` which we don't need anymore if we just use `DEVICES` and filter by `plan.device`.
// But wait, the existing code uses `DEVICES_GAMING`.
// Let's modify the popup to map over `DEVICES` but add `.device-btn.out-of-stock` if not matching `popup.plan.device`.

content = content.replace(
  /\{\(popup\.product\.category === 'Gaming' \? DEVICES_GAMING : DEVICES\)\.map\(\(d, i\) => \(/,
  `{DEVICES.map((d, i) => {
                  const isAvailable = !popup.plan.device || popup.plan.device === d.id || (popup.plan.device === 'PC' && d.id === 'Laptop') || (popup.plan.device === 'Laptop' && d.id === 'PC'); // default logic if not strict, or just strict match.
                  // Wait, actually, let's just make it strict if \`plan.device\` is provided, otherwise everything available except for Gaming which only PC/Laptop/PS/Xbox.
                  // For simplicity:
                  const available = popup.plan.device ? (popup.plan.device === d.id || popup.plan.device === 'All') : true;
                  return (`
);

content = content.replace(
  /className=\{`device-btn \$\{popup\.device === d\.id \? 'selected' : ''\}`\}/,
  "className={`device-btn ${popup.device === d.id ? 'selected' : ''} ${available ? 'available' : 'out-of-stock'}`}"
);

// Disable click if out of stock
content = content.replace(
  /onClick=\{\(\) => setPopup\(prev => \(\{ \.\.\.prev, device: d\.id \}\)\)\}/,
  "onClick={() => { if(available) setPopup(prev => ({ ...prev, device: d.id })) }}"
);

// Fix the return tag closing for map
content = content.replace(
  /\{d\.label\}\s*<\/motion\.button>\s*\)\)\}/,
  `{d.label}
                    {!available && <span className="oos-badge">Out of Stock</span>}
                  </motion.button>
                );
              })}`
);


// Update game icon rendering
// Look at `const gameIcon = product.category === 'Gaming' ? getGameIcon(plan.label) : null;`
content = content.replace(
  /const gameIcon = product\.category === 'Gaming' \? getGameIcon\(plan\.label\) : null;/,
  "const gameIcon = (product.category === 'Gaming' || plan.image) ? (plan.image || getGameIcon(plan.label)) : null;"
);

// Popup logo update
content = content.replace(
  /src=\{popup\.product\.category === 'Gaming' \? \(getGameIcon\(popup\.plan\.label\) \|\| getFavicon\(popup\.product\.name\)\) : getFavicon\(popup\.product\.name\)\}/,
  "src={popup.product.category === 'Gaming' || popup.plan.image ? (popup.plan.image || getGameIcon(popup.plan.label) || getFavicon(popup.product.name)) : getFavicon(popup.product.name)}"
);

fs.writeFileSync(file, content);
console.log('Done Storefront replacement.');
