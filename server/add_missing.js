const mongoose = require('mongoose');

const URI = 'mongodb+srv://zk45681_db_user:nbU3QDZat24g3Yzw@streambazaar.7lg63mf.mongodb.net/streambazaar?retryWrites=true&w=majority&appName=streambazaar';

const BRAND_CATEGORIES = {
  'netflix': 'Streaming',
  'youtube': 'Streaming',
  'amazon': 'Streaming',
  'prime': 'Streaming',
  'hotstar': 'Streaming',
  'jio hotstar': 'Streaming',
  'jio': 'Streaming',
  'jiocinema': 'Streaming',
  'sony': 'Streaming',
  'sonyliv': 'Streaming',
  'zee5': 'Streaming',
  'chatgpt': 'AI+',
  'claude': 'AI+',
  'canva': 'AI+',
  'spotify': 'Streaming',
  'discord': 'AI+',
  'discovery': 'Streaming',
  'airtel': 'Streaming',
  'lionsgate': 'Streaming',
  'aha': 'Streaming',
  'ullu': 'Streaming',
  'nord': 'VPN',
  'nordvpn': 'VPN',
  'surfshark': 'VPN',
  'iptv': 'Streaming',
  'hoichoi': 'Streaming'
};

const DEFAULT_PLANS = [
  { label: 'Premium Plan', quality: 'Full HD', duration: '1 Month', price: '₹99', type: 'Premium', supportedDevices: ['TV', 'PC', 'iOS', 'Android'] },
  { label: 'Premium Plan', quality: '4K UHD', duration: '6 Months', price: '₹399', type: 'Premium', supportedDevices: ['TV', 'PC', 'iOS', 'Android'] }
];

const PRETTY_NAMES = {
  'netflix': 'Netflix',
  'youtube': 'YouTube Premium',
  'amazon': 'Amazon Prime',
  'prime': 'Amazon Prime Video',
  'hotstar': 'Disney+ Hotstar',
  'jio hotstar': 'Jio Hotstar',
  'jio': 'JioCinema',
  'jiocinema': 'JioCinema',
  'sony': 'Sony LIV',
  'sonyliv': 'Sony LIV',
  'zee5': 'ZEE5',
  'chatgpt': 'ChatGPT Plus',
  'claude': 'Claude AI',
  'canva': 'Canva Pro',
  'spotify': 'Spotify Premium',
  'discord': 'Discord Nitro',
  'discovery': 'Discovery Plus',
  'airtel': 'Airtel Xstream',
  'lionsgate': 'Lionsgate Play',
  'aha': 'Aha Video',
  'ullu': 'Ullu',
  'nord': 'NordVPN',
  'nordvpn': 'NordVPN',
  'surfshark': 'Surfshark VPN',
  'iptv': 'IPTV Smarters Pro',
  'hoichoi': 'Hoichoi'
};

mongoose.connect(URI).then(async () => {
  const db = mongoose.connection.db;
  const existing = await db.collection('services').find({}).toArray();
  const existingNames = existing.map(e => e.name.toLowerCase());
  
  const toInsert = [];
  
  for (const [key, cat] of Object.entries(BRAND_CATEGORIES)) {
    const prettyName = PRETTY_NAMES[key];
    const exists = existingNames.find(n => n.includes(key) || n.includes(prettyName.toLowerCase()));
    
    if (!exists) {
      toInsert.push({
        name: prettyName,
        category: cat,
        description: 'Premium Seat Access • Guaranteed',
        status: 'Available',
        plans: DEFAULT_PLANS
      });
      console.log(`Will add missing service: ${prettyName}`);
    }
  }
  
  if (toInsert.length > 0) {
    // Filter duplicates in toInsert (e.g. jio and jiocinema might both trigger)
    const uniqueInsert = [];
    const seen = new Set();
    for (const item of toInsert) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueInsert.push(item);
      }
    }
    
    await db.collection('services').insertMany(uniqueInsert);
    console.log(`Added ${uniqueInsert.length} new services.`);
  } else {
    console.log('No missing services found from the list.');
  }
  
  process.exit(0);
}).catch(console.error);
