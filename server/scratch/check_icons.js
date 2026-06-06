const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

async function run() {
  await mongoose.connect(mongoUri);
  const docs = await Service.find({});
  for (const d of docs) {
    console.log({
      id: d._id,
      name: d.name,
      category: d.category,
      customIcon: d.customIcon,
      plansImage: d.plans?.[0]?.image,
      primaryColor: d.primaryColor,
      secondaryColor: d.secondaryColor,
    });
  }
  process.exit(0);
}
run();
