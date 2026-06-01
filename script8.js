const fs = require('fs');
const file = 'client/src/components/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// The SVG icons
const svgIcons = `
const CustomIcons = {
  Apple: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>,
  Android: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a9 9 0 1 0-16.48 0"/><path d="M17 19H7"/><path d="M4.26 15.26 2 13"/><path d="M19.74 15.26 22 13"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M21 16v2a2 2 0 0 1-2 2h-1"/><path d="M3 16v2a2 2 0 0 0 2 2h1"/></svg>,
  TV: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>,
  PC: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>,
  Laptop: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>,
  PlayStation: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M17 12h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2"/><path d="M7 12H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/></svg>,
  Xbox: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/></svg>,
};
`;

// Insert the CustomIcons component after DOMAINS or around there
if (!content.includes('const CustomIcons = {')) {
  content = content.replace(
    /const TELEGRAM_LINK =/,
    `${svgIcons}\nconst TELEGRAM_LINK =`
  );
}

// Replace the map arrays in Storefront.jsx to use these SVG components
const newMapLogic = `
                {(popup.product.category === 'Gaming' ? [
                  { id: 'PC', label: 'PC', icon: CustomIcons.PC },
                  { id: 'Laptop', label: 'Laptop', icon: CustomIcons.Laptop },
                  { id: 'PS4', label: 'PS4', icon: CustomIcons.PlayStation },
                  { id: 'PS5', label: 'PS5', icon: CustomIcons.PlayStation },
                  { id: 'Xbox', label: 'Xbox', icon: CustomIcons.Xbox }
                ] : [
                  { id: 'TV', label: 'TV', icon: CustomIcons.TV },
                  { id: 'PC', label: 'PC', icon: CustomIcons.PC },
                  { id: 'iOS', label: 'iOS', icon: CustomIcons.Apple },
                  { id: 'Android', label: 'Android', icon: CustomIcons.Android }
                ]).map((d, i) => {
                  const supported = popup.plan.supportedDevices || (popup.plan.device ? [popup.plan.device] : ['TV', 'PC', 'iOS', 'Android']);
                  const available = supported.includes(d.id);
                  return (
`;

// Find and replace the specific block for the mapping
const oldMapRegex = /\{\(popup\.product\.category === 'Gaming' \? \[[^\]]*\] : \[[^\]]*\]\)\.map\(\(d, i\) => \{[\s\S]*?const available = popup\.plan\.device \? \(popup\.plan\.device === d\.id \|\| popup\.plan\.device === 'All'\) : true;\s*return \(/;

content = content.replace(oldMapRegex, newMapLogic);

// Replace emoji render with the new icon render
// `<motion.span className="device-icon"[^>]*>{d.emoji}</motion.span>`
// It spans 4 lines!
content = content.replace(
  /<motion\.span\s*className="device-icon"\s*animate=\{popup\.device === d\.id \? \{ rotate: \[0, -8, 8, 0\], scale: \[1, 1\.25, 1\] \} : \{\}\}\s*transition=\{\{ duration: 0\.35 \}\}\s*>\{d\.emoji\}<\/motion\.span>/,
  `<motion.span
                      className="device-icon"
                      animate={popup.device === d.id ? { rotate: [0, -8, 8, 0], scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.35 }}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem' }}
                    >
                      <d.icon />
                    </motion.span>`
);

// We should also adjust grid columns to fit 5 items for gaming
content = content.replace(
  /style=\{\{ gridTemplateColumns: 'repeat\(4,1fr\)' \}\}/,
  `style={{ gridTemplateColumns: popup.product.category === 'Gaming' ? 'repeat(5,1fr)' : 'repeat(4,1fr)' }}`
);

fs.writeFileSync(file, content);
console.log('Storefront SVG updated');
