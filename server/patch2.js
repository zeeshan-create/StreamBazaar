const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function patchPrices() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");
    
    const services = await Service.find({});
    for (const service of services) {
      let updated = false;
      const doc = service.toObject();
      if (doc.plans) {
        doc.plans.forEach(plan => {
          if (plan.price && plan.price.includes('.')) {
            console.log(`Found decimal price in ${doc.name}: ${plan.price}`);
            // e.g. "₹1748.90" -> "₹1748"
            const withoutDecimal = plan.price.split('.')[0];
            plan.price = withoutDecimal;
            updated = true;
          }
        });
      }
      if (updated) {
        await Service.updateOne({ _id: doc._id }, { $set: { plans: doc.plans } });
        console.log(`Updated ${doc.name} to new prices`);
      }
    }
    
    console.log("Patch complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

patchPrices();
