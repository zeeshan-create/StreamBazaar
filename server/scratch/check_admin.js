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
  const admins = await Admin.find({}).lean();
  console.log("Found admins:", JSON.stringify(admins, null, 2));
  await mongoose.disconnect();
}
run().catch(console.error);
