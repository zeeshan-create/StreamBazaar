const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testInspect() {
  await mongoose.connect(mongoUri);
  const docs = await Service.find({ name: /test/i });
  console.log("Documents containing 'test':", docs.map(d => ({ _id: d._id, name: d.name })));
  
  // Clean up any test names
  for (const doc of docs) {
    if (doc.name.includes(' test2')) {
      const cleanName = doc.name.replace(' test2', '');
      await Service.updateOne({ _id: doc._id }, { $set: { name: cleanName } });
      console.log(`Cleaned up: ${doc.name} -> ${cleanName}`);
    } else if (doc.name.includes(' test')) {
      const cleanName = doc.name.replace(' test', '');
      await Service.updateOne({ _id: doc._id }, { $set: { name: cleanName } });
      console.log(`Cleaned up: ${doc.name} -> ${cleanName}`);
    }
  }
  process.exit(0);
}
testInspect();
