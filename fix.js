const fs = require('fs');
let code = fs.readFileSync('client/src/components/AdminDashboard.jsx', 'utf8');
code = code.replace(/.*assassin.*creed.*/g, `  "assassin's creed": "https://cdn.akamai.steamstatic.com/steam/apps/2208920/capsule_184x69.jpg",`);
fs.writeFileSync('client/src/components/AdminDashboard.jsx', code);
