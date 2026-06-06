const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testMatched() {
  await mongoose.connect(mongoUri);
  const doc = await Service.findOne({});
  console.log("Found doc:", doc._id, "type of doc._id:", typeof doc._id, doc._id.constructor.name);
  
  // Test 1: updateMany with ObjectId
  const res1 = await Service.updateMany({ _id: doc._id }, { $set: { name: doc.name } });
  console.log("Res 1 (ObjectId query):", res1);
  
  // Test 2: updateMany with string id
  const res2 = await Service.updateMany({ _id: doc._id.toString() }, { $set: { name: doc.name } });
  console.log("Res 2 (string query):", res2);
  
  process.exit(0);
}
testMatched();
