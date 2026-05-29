const mongoose = require('mongoose');
const mongoUri = 'mongodb+srv://zk45681_db_user:nbU3QDZat24g3Yzw@streambazaar.7lg63mf.mongodb.net/streambazaar?retryWrites=true&w=majority&appName=streambazaar';

const serviceSchema = new mongoose.Schema({}, { strict: false });
const MongoService = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function test() {
  await mongoose.connect(mongoUri);
  
  const service = await MongoService.findOne({});
  const idString = service._id.toString();
  
  try {
    const payload = { ...service.toObject(), testField: 'success2' };
    console.log('Testing update with _id in payload');
    const updateRes = await MongoService.updateMany({ _id: idString }, { $set: payload });
    console.log('Update result:', updateRes);
  } catch(e) {
    console.log('Update error:', e.message);
  }
  
  process.exit(0);
}

test().catch(console.error);
