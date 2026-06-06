const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testImmutable() {
  await mongoose.connect(mongoUri);
  const doc = await Service.findOne({});
  try {
    // Try updating by passing _id as string inside $set
    await Service.updateMany({ _id: doc._id }, { $set: { _id: doc._id.toString(), name: doc.name + ' test2' }});
    console.log("Update succeeded!");
  } catch (err) {
    console.error("Update failed:", err.message);
  }
  process.exit(0);
}
testImmutable();
