const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'client', 'dist');
const dest = path.join(__dirname, 'dist');

try {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log('✅ Successfully copied client/dist to root dist/');
  } else {
    console.warn('⚠️ client/dist does not exist');
  }
} catch (err) {
  console.error('Failed to copy dist:', err.message);
}
