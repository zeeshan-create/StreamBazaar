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
  
  // Delete the misspelled admin record
  const deleteResult = await Admin.deleteMany({ email: 'zeeshanshussain0999@gmail.com' });
  console.log("Deleted misspelled admins:", deleteResult.deletedCount);
  
  // Update all remaining admins to correct email
  await Admin.updateMany(
    {},
    { 
      $set: {
        email: 'zeeshanhussain0999@gmail.com'
      }
    }
  );
  console.log("Updated remaining admins to zeeshanhussain0999@gmail.com");

  // Keep only one admin to prevent duplicates
  const allAdmins = await Admin.find({});
  if (allAdmins.length > 1) {
    const keepId = allAdmins[0]._id;
    const deleteResult = await Admin.deleteMany({ _id: { $ne: keepId } });
    console.log("Deleted duplicate admins:", deleteResult.deletedCount);
  }

  // If no admin left, seed a default one
  const adminCount = await Admin.countDocuments({});
  if (adminCount === 0) {
    await Admin.create({
      username: 'Ai+rizwan#1974000hussain!#/',
      password: '@#12Rizwan55Hussain/!#7861974000!12',
      email: 'zeeshanhussain0999@gmail.com',
      otp: null,
      otpExpires: null
    });
    console.log("Seeded new default admin record.");
  }
  
  const updatedAdmins = await Admin.find({}).lean();
  console.log("Current Admin collection contents:", JSON.stringify(updatedAdmins, null, 2));
  
  await mongoose.disconnect();
}
run().catch(console.error);
