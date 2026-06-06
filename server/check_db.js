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
  const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
  const services = await Service.find({}).lean();
  console.log("Found services count:", services.length);
  for (const s of services) {
    console.log("ID:", s._id, "Type:", typeof s._id);
    console.log("Name:", s.name);
    console.log("Color:", s.color, "PrimaryColor:", s.primaryColor);
    console.log("Plans:", s.plans);
    console.log("-".repeat(40));
  }
  await mongoose.disconnect();
}
run().catch(console.error);
