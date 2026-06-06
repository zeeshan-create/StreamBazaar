const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testQuery() {
  await mongoose.connect(mongoUri);
  const doc = await Service.findOne({});
  if (!doc) {
    console.log("No documents found in services collection.");
    process.exit(1);
  }
  console.log("Found doc:", doc._id, typeof doc._id);
  const idStr = doc._id.toString();
  
  // Test finding by string _id
  const docByStr = await Service.findOne({ _id: idStr });
  console.log("Query by string ID success:", !!docByStr);
  
  // Test finding by ObjectId
  const docByObj = await Service.findOne({ _id: new mongoose.Types.ObjectId(idStr) });
  console.log("Query by ObjectId success:", !!docByObj);
  
  process.exit(0);
}
testQuery();
