const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;
let isMongo = false;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('🚀 Connected dynamically to MongoDB Atlas Cloud!'))
    .catch(err => console.error('❌ MongoDB Atlas connection error:', err));
  isMongo = true;
} else {
  console.log('💻 MONGODB_URI not found. Running with KVDB remote datastore for Serverless compatibility.');
}

// ── SCHEMAS & MODELS FOR MONGO ──────────────────────────────
let MongoService, MongoOrder;
if (isMongo) {
  const serviceSchema = new mongoose.Schema({}, { strict: false });
  const orderSchema = new mongoose.Schema({}, { strict: false });
  MongoService = mongoose.models.Service || mongoose.model('Service', serviceSchema);
  MongoOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);
}

// ── KVDB CLOUD DATASTORE (Vercel Serverless Compatible) ──
const KVDB_URL = 'https://kvdb.io/5BtwDCTVqL7aaP8YPQGLfG';

class KvdbAdapter {
  constructor(bucketKey) {
    this.key = bucketKey;
    this.cache = null;
  }
  async _getData() {
    try {
      if (this.cache) return this.cache;
      const res = await fetch(`${KVDB_URL}/${this.key}`);
      if (!res.ok) return [];
      const text = await res.text();
      this.cache = text ? JSON.parse(text) : [];
      return this.cache;
    } catch (e) { return []; }
  }
  async _saveData(data) {
    this.cache = data;
    await fetch(`${KVDB_URL}/${this.key}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  async find(query = {}) {
    let data = await this._getData();
    if (Object.keys(query).length > 0) {
       data = data.filter(item => {
         for (let k in query) { if (item[k] !== query[k]) return false; }
         return true;
       });
    }
    return data;
  }
  async findOne(query) {
    const data = await this.find(query);
    return data[0] || null;
  }
  async insert(doc) {
    const data = await this._getData();
    if (Array.isArray(doc)) {
      for(let d of doc) { if (!d._id) d._id = Math.random().toString(36).substring(2, 15); }
      data.push(...doc);
      await this._saveData(data);
      return doc;
    }
    if (!doc._id) doc._id = Math.random().toString(36).substring(2, 15);
    data.push(doc);
    await this._saveData(data);
    return doc;
  }
  async update(query, updateDoc) {
    const data = await this._getData();
    let updated = false;
    for (let i = 0; i < data.length; i++) {
      let match = true;
      for (let k in query) { if (data[i][k] !== query[k]) match = false; }
      if (match) {
        if (updateDoc.$set) {
          data[i] = { ...data[i], ...updateDoc.$set };
        } else {
          data[i] = { ...data[i], ...updateDoc };
        }
        updated = true;
      }
    }
    if (updated) await this._saveData(data);
    return { success: updated };
  }
  async remove(query, options = {}) {
    let data = await this._getData();
    if (Object.keys(query).length === 0 && options.multi) {
      await this._saveData([]);
      return { success: true };
    }
    const initialLen = data.length;
    data = data.filter(item => {
       for (let k in query) { if (item[k] === query[k]) return false; }
       return true;
    });
    if (data.length !== initialLen) await this._saveData(data);
    return { success: true };
  }
}

const kvdbService = new KvdbAdapter('services');
const kvdbOrder = new KvdbAdapter('orders');

// ── ADAPTER WRAPPER FUNCTION ──────────────────────────────
function createAdapter(kvdbInstance, mongoModel) {
  return {
    find: async (query) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.find(query).lean();
      }
      return kvdbInstance.find(query);
    },
    findOne: async (query) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.findOne(query).lean();
      }
      return kvdbInstance.findOne(query);
    },
    insert: async (doc) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        if (Array.isArray(doc)) {
           const res = await mongoModel.insertMany(doc);
           return res.map(r => r.toObject());
        }
        const res = await mongoModel.create(doc);
        return res.toObject();
      }
      return kvdbInstance.insert(doc);
    },
    update: async (query, updateDoc) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.updateOne(query, updateDoc);
      }
      return kvdbInstance.update(query, updateDoc);
    },
    remove: async (query, options) => {
      if (isMongo && mongoose.connection.readyState === 1) {
        return mongoModel.deleteMany(query);
      }
      return kvdbInstance.remove(query, options);
    }
  };
}

module.exports = {
  Service: createAdapter(kvdbService, MongoService),
  Order: createAdapter(kvdbOrder, MongoOrder)
};
