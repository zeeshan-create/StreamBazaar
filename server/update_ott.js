require('dotenv').config();
const { Service } = require('./models/dbAdapter');

const netbondData = [
  {"platform": "Netflix", "plan": "4K Video Quality", "price": 120, "duration": "30 days"},
  {"platform": "Netflix", "plan": "4K Video Quality", "price": 150, "duration": "30 days"},
  {"platform": "Netflix", "plan": "4K Video Quality", "price": 80, "duration": "15 days"},
  {"platform": "Amazon Prime", "plan": "4K Video Quality", "price": 70, "duration": "30 days"},
  {"platform": "Sony LIV", "plan": "4K Video Quality", "price": 100, "duration": "30 days"},
  {"platform": "Sony LIV", "plan": "Full HD 1080", "price": 80, "duration": "30 days"},
  {"platform": "Crunchy Roll", "plan": "4K Video Quality", "price": 35, "duration": "15 days"},
  {"platform": "Crunchy Roll", "plan": "4K Video Quality", "price": 40, "duration": "15 days"},
  {"platform": "Crunchy Roll", "plan": "4K Video Quality", "price": 80, "duration": "30 days"},
  {"platform": "Crunchy Roll", "plan": "4K Video Quality", "price": 150, "duration": "3 Months"},
  {"platform": "YouTube", "plan": "Individual Plan", "price": 60, "duration": "30 days"},
  {"platform": "YouTube", "plan": "Individual Plan", "price": 70, "duration": "30 days"},
  {"platform": "Jio Hotstar", "plan": "Full HD 1080", "price": 80, "duration": "30 days"},
  {"platform": "Jio Hotstar", "plan": "Full HD 1080", "price": 90, "duration": "30 days"},
  {"platform": "Zee5", "plan": "Full HD 1080", "price": 75, "duration": "30 days"},
  {"platform": "Zee5", "plan": "Full HD 1080", "price": 80, "duration": "30 days"},
  {"platform": "Zee5", "plan": "Full HD 1080", "price": 499, "duration": "1 Year"},
  {"platform": "Spotify Premium", "plan": "Standard (Mobile)", "price": 80, "duration": "30 days"},
  {"platform": "Spotify Premium", "plan": "Standard (Mobile)", "price": 160, "duration": "30 days"},
  {"platform": "Spotify Premium", "plan": "Premium Plan", "price": 80, "duration": "30 days"},
  {"platform": "Spotify Premium", "plan": "Platinum Plan", "price": 180, "duration": "30 days"},
  {"platform": "Spotify Premium", "plan": "Standard (Private)", "price": 250, "duration": "3 Months"},
  {"platform": "YouTube Music", "plan": "Individual Plan", "price": 70, "duration": "30 days"},
  {"platform": "YouTube Music", "plan": "Individual Plan (Private)", "price": 70, "duration": "30 days"},
  {"platform": "YouTube Music", "plan": "Individual Plan (Private)", "price": 80, "duration": "30 days"},
  {"platform": "Hoichoi TV", "plan": "Premium Plan", "price": 70, "duration": "30 days"},
  {"platform": "Hoichoi TV", "plan": "Premium Plan (Private)", "price": 70, "duration": "30 days"},
  {"platform": "IPTV", "plan": "4K Video Quality (Private)", "price": 180, "duration": "30 days"},
  {"platform": "Lionsgate Play", "plan": "4K Video Quality", "price": 120, "duration": "30 days"},
  {"platform": "Discovery Plus", "plan": "Premium Plan (Private)", "price": 99, "duration": "30 days"}
];

const colors = {
  'Netflix': '#E50914',
  'Amazon Prime': '#00A8E1',
  'Sony LIV': '#FCA515',
  'Crunchy Roll': '#F47521',
  'YouTube': '#FF0000',
  'Jio Hotstar': '#a855f7',
  'Zee5': '#8230C6',
  'Spotify Premium': '#1DB954',
  'YouTube Music': '#FF0000',
  'Hoichoi TV': '#E91E63',
  'IPTV': '#888888',
  'Lionsgate Play': '#006633',
  'Discovery Plus': '#0060A9'
};

async function updateOTT() {
  try {
    console.log('Grouping and processing NetBond data...');
    const platforms = {};
    for (const item of netbondData) {
      if (!platforms[item.platform]) {
        platforms[item.platform] = [];
      }
      platforms[item.platform].push(item);
    }

    const updatedStreamingServices = [];
    
    for (const [name, plans] of Object.entries(platforms)) {
      const newPlans = plans.map(p => {
         // Apply 25% price increase
         const newPrice = Math.ceil(p.price * 1.25);
         let durationLabel = p.duration;
         if (durationLabel.toLowerCase() === '30 days') durationLabel = '30 Days';
         if (durationLabel.toLowerCase() === '15 days') durationLabel = '15 Days';
         
         return {
           label: p.plan,
           quality: p.plan,
           duration: durationLabel,
           price: `₹${newPrice}`,
           type: p.plan.includes('Private') || p.plan.includes('Individual') ? 'Own Email' : 'Seat Access'
         };
      });

      // Deduplicate: Keep the lowest price for the same plan & duration
      const uniquePlansMap = {};
      for (const p of newPlans) {
         const key = `${p.label}_${p.duration}`;
         const priceVal = parseInt(p.price.replace('₹', ''));
         if (!uniquePlansMap[key]) {
           uniquePlansMap[key] = p;
         } else {
           const existingPrice = parseInt(uniquePlansMap[key].price.replace('₹', ''));
           if (priceVal < existingPrice) {
              uniquePlansMap[key] = p; // Keep cheaper option (after markup)
           }
         }
      }
      
      updatedStreamingServices.push({
        name,
        category: 'Streaming',
        color: colors[name] || '#6366f1',
        description: 'Premium Seat Access · Guaranteed',
        plans: Object.values(uniquePlansMap)
      });
    }

    console.log(`Prepared ${updatedStreamingServices.length} OTT platforms.`);

    console.log('Removing old Streaming services from MongoDB...');
    await Service.remove({ category: 'Streaming' });
    
    console.log('Inserting newly scraped and 25% marked-up OTT services...');
    await Service.insert(updatedStreamingServices);
    
    console.log('✅ Successfully updated all OTT platforms with +25% prices!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating OTT data:', error);
    process.exit(1);
  }
}

updateOTT();
