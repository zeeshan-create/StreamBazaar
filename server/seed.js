const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI missing in .env");
  process.exit(1);
}

const serviceSchema = new mongoose.Schema({}, { strict: false });
const orderSchema = new mongoose.Schema({}, { strict: false });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");

    const servicesData = fs.readFileSync(__dirname + '/data/services.db', 'utf8');
    const ordersData = fs.readFileSync(__dirname + '/data/orders.db', 'utf8');

    const services = servicesData.trim().split('\n').map(line => {
      const obj = JSON.parse(line);
      delete obj._id;
      return obj;
    });

    const orders = ordersData.trim().split('\n').filter(l => l.trim() !== '').map(line => {
      const obj = JSON.parse(line);
      delete obj._id;
      return obj;
    });

    await Service.deleteMany({});
    console.log("Cleared existing services");
    await Service.insertMany(services);
    console.log(`Inserted ${services.length} services`);

    await Order.deleteMany({});
    console.log("Cleared existing orders");
    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log(`Inserted ${orders.length} orders`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
