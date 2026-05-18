const Datastore = require('nedb-promises');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'services.db');
const Service = Datastore.create(dbPath);

module.exports = Service;
