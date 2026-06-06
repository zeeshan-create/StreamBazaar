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
  
  // Find the admin or create/update it
  const admin = await Admin.findOne({ email: 'zeeshanshussain0999@gmail.com' });
  if (admin) {
    await Admin.updateOne(
      { _id: admin._id },
      { 
        $set: {
          username: 'Ai+rizwan#1974000hussain!#/',
          password: '@#12Rizwan55Hussain/!#7861974000!12',
          otp: null,
          otpExpires: null
        }
      }
    );
    console.log("Admin updated successfully!");
  } else {
    await Admin.create({
      username: 'Ai+rizwan#1974000hussain!#/',
      password: '@#12Rizwan55Hussain/!#7861974000!12',
      email: 'zeeshanshussain0999@gmail.com',
      otp: null,
      otpExpires: null
    });
    console.log("Admin created successfully!");
  }
  
  const updatedAdmins = await Admin.find({}).lean();
  console.log("Current Admin collection contents:", JSON.stringify(updatedAdmins, null, 2));
  
  await mongoose.disconnect();
}
run().catch(console.error);
