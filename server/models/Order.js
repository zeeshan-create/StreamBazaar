const Datastore = require('nedb-promises');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'orders.db');
const Order = Datastore.create(dbPath);

module.exports = Order;
