const fs = require('fs');

let adminContent = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

// 1. Update the PLAN_LABELS array definition
adminContent = adminContent.replace(
  /const PLAN_LABELS = \[\s*"4K UHD", "4K Ultra HD", "Full HD 1080p", "720p", "Premium Plan", \s*"Individual Plan", "Shared Profile", "Private Profile", \s*"1 Device Seat Access", "2 Device Seat Access", "PC Game Seat Access", \s*"PlayStation", "Xbox", "WWE 2K25", "Forza Horizon 5", "GTA V", "Spider-Man 2",\s*"Uncharted", "Crimson Desert", "The Last of Us II", "Black Myth Wukong",\s*"Ghost of Tsushima", "Elden Ring", "Resident Evil", "Hogwarts Legacy", "God of War"\s*\];/,
  `const PLAN_LABELS = [
  "4K UHD", "4K Ultra HD", "Full HD 1080p", "720p", "Premium Plan", 
  "Individual Plan", "Shared Profile", "Private Profile", 
  "1 Device Seat Access", "2 Device Seat Access", "PC Game Seat Access", 
  "PlayStation", "Xbox", "private account", "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION"
];`
);

// 2. Replace DESC_OPTIONS.map
adminContent = adminContent.replace(
  /\{DESC_OPTIONS\.map\(opt => <option key=\{opt\} value=\{opt\}>\{opt\}<\/option>\)\}/g,
  `{DESC_OPTIONS.filter(opt => {
                                  const isGaming = ['Steam', 'PlayStation', 'Gaming'].includes(editForm.category);
                                  const gamingDesc = ["Offline game activation for PC. Full updates supported.", "Premium Seat Access • Guaranteed", "100% legal, genuine, and carefully verified premium accounts."];
                                  return isGaming ? gamingDesc.includes(opt) : !gamingDesc.includes(opt);
                                }).map(opt => <option key={opt} value={opt}>{opt}</option>)}`
);

// 3. Replace PLAN_LABELS.map
adminContent = adminContent.replace(
  /\{PLAN_LABELS\.map\(opt => <option key=\{opt\} value=\{opt\}>\{opt\}<\/option>\)\}/g,
  `{PLAN_LABELS.filter(opt => {
                                        const isGaming = ['Steam', 'PlayStation', 'Gaming'].includes(editForm.category);
                                        const gamingLabels = ["Xbox", "PlayStation", "PC Game Seat Access", "private account", "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION"];
                                        return isGaming ? gamingLabels.includes(opt) : !gamingLabels.includes(opt);
                                      }).map(opt => <option key={opt} value={opt}>{opt}</option>)}`
);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', adminContent);
console.log('Successfully applied all changes accurately.');
