const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function verifyAdobe() {
  await mongoose.connect(mongoUri);
  const doc = await Service.findOne({ name: /Adobe/i });
  console.log("Adobe Creative Document:", JSON.stringify(doc, null, 2));
  process.exit(0);
}
verifyAdobe();
