const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const platformsArray = "const PLATFORMS = ['TV', 'PC', 'iOS', 'Android', 'Laptop', 'PS4', 'PS5', 'Xbox'];\n";

if (!content.includes('const PLATFORMS =')) {
  // Inject after const DURATION_OPTIONS array
  content = content.replace(
    /const DURATION_OPTIONS = \[[\s\S]*?\];/,
    "const DURATION_OPTIONS = [\n  '1 Month',\n  '3 Months',\n  '6 Months',\n  '12 Months'\n];\n" + platformsArray
  );
  fs.writeFileSync(file, content);
  console.log('PLATFORMS array injected successfully.');
} else {
  console.log('PLATFORMS array already exists.');
}
