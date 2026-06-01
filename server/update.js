const mongoose = require('mongoose');
const URI = 'mongodb+srv://zk45681_db_user:nbU3QDZat24g3Yzw@streambazaar.7lg63mf.mongodb.net/streambazaar?retryWrites=true&w=majority&appName=streambazaar';
mongoose.connect(URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('services').updateOne({ name: 'LinkedIn Premium' }, { $set: { category: 'AI+' } });
  console.log('Updated LinkedIn Premium category to AI+');
  process.exit(0);
}).catch(console.error);
