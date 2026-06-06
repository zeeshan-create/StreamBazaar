const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) process.env[k] = envConfig[k];
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.log("MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  await mongoose.connect(mongoUri);
  console.log("Connected successfully");
  const Admin = mongoose.model('Admin', new mongoose.Schema({}, { strict: false }));
  
  // Update all admins
  await Admin.updateMany(
    {},
    { 
      $set: {
        email: 'zeeshanhussain0999@gmail.com'
      }
    }
  );
  console.log("All Admins updated successfully to zeeshanhussain0999@gmail.com!");
  
  const updatedAdmins = await Admin.find({}).lean();
  console.log("Current Admin collection contents:", JSON.stringify(updatedAdmins, null, 2));
  
  await mongoose.disconnect();
}
run().catch(console.error);
