const fs = require('fs');

let adminContent = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');

adminContent = adminContent.replace(
  /const PLAN_LABELS = \[\s*"4K UHD", "4K Ultra HD", "Full HD 1080p", "720p", "Premium Plan", \s*"Individual Plan", "Shared Profile", "Private Profile", \s*"1 Device Seat Access", "2 Device Seat Access", "PC Game Seat Access", \s*"PlayStation", "Xbox"\s*\];/,
  `const PLAN_LABELS = [
  "4K UHD", "4K Ultra HD", "Full HD 1080p", "720p", "Premium Plan", 
  "Individual Plan", "Shared Profile", "Private Profile", 
  "1 Device Seat Access", "2 Device Seat Access", "PC Game Seat Access", 
  "PlayStation", "Xbox", "private account", "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION"
];`
);

fs.writeFileSync('client/src/components/AdminDashboard.jsx', adminContent);
console.log('Successfully updated PLAN_LABELS array.');
