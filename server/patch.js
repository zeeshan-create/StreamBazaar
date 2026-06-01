const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function patchPrice() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");
    
    // Find NordVPN or any service containing the 868.90 price and update it
    const services = await Service.find({});
    for (const service of services) {
      let updated = false;
      const doc = service.toObject();
      if (doc.plans) {
        doc.plans.forEach(plan => {
          if (plan.price.includes('868.90')) {
            console.log(`Found old price in ${doc.name}: ${plan.price}`);
            plan.price = '₹868';
            updated = true;
          }
        });
      }
      if (updated) {
        await Service.updateOne({ _id: doc._id }, { $set: { plans: doc.plans } });
        console.log(`Updated ${doc.name} to new price`);
      }
    }
    
    console.log("Patch complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

patchPrice();
