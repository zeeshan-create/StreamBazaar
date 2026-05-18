const mongoose = require('mongoose');
const Datastore = require('nedb-promises');
const path = require('path');

const mongoUri = process.env.MONGODB_URI;
let isMongo = false;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('🚀 Connected dynamically to MongoDB Atlas Cloud!'))
    .catch(err => console.error('❌ MongoDB Atlas connection error, falling back to local NeDB:', err));
  isMongo = true;
} else {
  console.log('💻 MONGODB_URI not found in env. Running with local NeDB file datastore.');
}

// ── SCHEMAS & MODELS FOR MONGO ──────────────────────────────
let MongoService, MongoOrder;
if (isMongo) {
  const serviceSchema = new mongoose.Schema({}, { strict: false });
  const orderSchema = new mongoose.Schema({}, { strict: false });
  MongoService = mongoose.models.Service || mongoose.model('Service', serviceSchema);
  MongoOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);
}

// ── LOCAL NEDB DATASTORES ──────────────────────────────────
const servicesDbPath = path.join(__dirname, '..', 'data', 'services.db');
const ordersDbPath = path.join(__dirname, '..', 'data', 'orders.db');

const nedbService = Datastore.create(servicesDbPath);
const nedbOrder = Datastore.create(ordersDbPath);

// ── ADAPTER WRAPPER FUNCTION ──────────────────────────────
function createAdapter(nedbInstance, mongoModel) {
  return {
    find: async (query) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.find(query).lean();
      }
      return nedbInstance.find(query);
    },
    findOne: async (query) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.findOne(query).lean();
      }
      return nedbInstance.findOne(query);
    },
    insert: async (doc) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        // If doc doesn't have an _id, MongoDB will auto-generate it.
        // We can cast the mongoose document to standard JS object.
        const res = await mongoModel.create(doc);
        return res.toObject();
      }
      return nedbInstance.insert(doc);
    },
    update: async (query, updateDoc) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.updateOne(query, updateDoc);
      }
      return nedbInstance.update(query, updateDoc);
    },
    remove: async (query) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.deleteMany(query);
      }
      return nedbInstance.remove(query);
    }
  };
}

module.exports = {
  Service: createAdapter(nedbService, MongoService),
  Order: createAdapter(nedbOrder, MongoOrder)
};
