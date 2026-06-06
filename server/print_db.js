const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function printDb() {
  await mongoose.connect(mongoUri);
  const docs = await Service.find({});
  console.log(JSON.stringify(docs, null, 2));
  process.exit(0);
}
printDb();
