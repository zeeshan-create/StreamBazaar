const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function testStringIds() {
  await mongoose.connect(mongoUri);
  const docs = await Service.find({}).lean();
  
  for (const doc of docs) {
    const isObjectId = doc._id instanceof mongoose.Types.ObjectId;
    console.log(`Doc ID: ${doc._id}, name: ${doc.name}, isObjectId: ${isObjectId}`);
    
    // Let's test querying it
    const byStr = await Service.findOne({ _id: doc._id.toString() });
    const byObj = mongoose.Types.ObjectId.isValid(doc._id.toString()) 
      ? await Service.findOne({ _id: new mongoose.Types.ObjectId(doc._id.toString()) })
      : null;
      
    console.log(`  Query by string: ${!!byStr}, Query by ObjectId: ${!!byObj}`);
  }
  
  process.exit(0);
}
testStringIds();
