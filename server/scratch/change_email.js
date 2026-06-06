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
  const admin = await Admin.findOne({ username: 'Ai+rizwan#1974000hussain!#/' });
  if (admin) {
    await Admin.updateOne(
      { _id: admin._id },
      { 
        $set: {
          email: 'zk45681@gmail.com'
        }
      }
    );
    console.log("Admin email updated successfully to zk45681@gmail.com!");
  } else {
    // If not found by username, look for any admin or create a new one
    const anyAdmin = await Admin.findOne({});
    if (anyAdmin) {
      await Admin.updateOne(
        { _id: anyAdmin._id },
        { 
          $set: {
            username: 'Ai+rizwan#1974000hussain!#/',
            email: 'zk45681@gmail.com'
          }
        }
      );
      console.log("Updated existing admin document to use zk45681@gmail.com!");
    } else {
      await Admin.create({
        username: 'Ai+rizwan#1974000hussain!#/',
        password: '@#12Rizwan55Hussain/!#7861974000!12',
        email: 'zk45681@gmail.com',
        otp: null,
        otpExpires: null
      });
      console.log("Created brand new admin document with zk45681@gmail.com!");
    }
  }
  
  const updatedAdmins = await Admin.find({}).lean();
  console.log("Current Admin collection contents:", JSON.stringify(updatedAdmins, null, 2));
  
  await mongoose.disconnect();
}
run().catch(console.error);
