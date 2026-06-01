const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testUpdate() {
  await mongoose.connect(mongoUri);
  const doc = await Service.findOne({});
  try {
    await Service.updateMany({ _id: doc._id }, { $set: { _id: doc._id, name: doc.name + ' test' }});
    console.log("Update succeeded");
  } catch (err) {
    console.error("Update failed:", err.message);
  }
  process.exit(0);
}
testUpdate();
