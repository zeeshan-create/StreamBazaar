const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  if (!mongoUri) {
    console.error('MONGODB_URI is missing in environment variables!');
    throw new Error('Database configuration error.');
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('🚀 Successfully connected to MongoDB Atlas (Serverless Mode)!');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    throw err;
  }
}

// ── SCHEMAS & MODELS ──────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({}, { strict: false });
const orderSchema = new mongoose.Schema({}, { strict: false });
const MongoService = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const MongoOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ── SERVERLESS MONGO ADAPTER ──────────────────────────────────────
function createAdapter(mongoModel) {
  return {
    find: async (query = {}) => {
      await connectToDatabase();
      return mongoModel.find(query).lean();
    },
    findOne: async (query) => {
      await connectToDatabase();
      return mongoModel.findOne(query).lean();
    },
    insert: async (doc) => {
      await connectToDatabase();
      if (Array.isArray(doc)) {
         const res = await mongoModel.insertMany(doc);
         return res.map(r => r.toObject());
      }
      const res = await mongoModel.create(doc);
      return res.toObject();
    },
    update: async (query, updateDoc) => {
      await connectToDatabase();
      // Emulate NeDB's $set behavior
      const payload = updateDoc.$set ? updateDoc : { $set: updateDoc };
      await mongoModel.updateMany(query, payload);
      return { success: true };
    },
    remove: async (query, options = {}) => {
      await connectToDatabase();
      if (Object.keys(query).length === 0 && options.multi) {
        await mongoModel.deleteMany({});
      } else {
        await mongoModel.deleteMany(query);
      }
      return { success: true };
    }
  };
}

module.exports = {
  Service: createAdapter(MongoService),
  Order: createAdapter(MongoOrder)
};
