const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@streambazaar.gnhf4.mongodb.net/?retryWrites=true&w=majority&appName=StreamBazaar";

if (!mongoUri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const serviceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

function calcPrice(basePrice) {
  return Math.ceil(basePrice * 1.25);
}

const gamesList = [
  {
    name: "The Last of Us",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Part 1", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Part 2", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Combo", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Spider-Man Series",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Remastered", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Miles Morales", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Spider-Man 2", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Bundle", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "God of War",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "God of War 4", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Ragnarok", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Combo", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Black Myth Wukong",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] },
      { label: "Deluxe", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Elden Ring",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Deluxe", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Cyberpunk 2077",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Phantom Liberty DLC", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Pragmata",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Crimson Desert",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] },
      { label: "Deluxe", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Resident Evil 9",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Assassin's Creed Shadows",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Deluxe", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Khazan",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "F1 25",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Stellar Blade",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Mafia: The Old Country",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Tekken 7",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(149).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Tekken 8",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Uncharted",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Legacy of Thieves", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Expedition 33",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Standard", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "WWE Bundles",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "2K24 + 2K25", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] },
      { label: "2K25 + 2K26", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Mafia Trilogy",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Bundle", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Red Dead Redemption 2",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Offline steam", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Online Full Access", quality: "private account", duration: "Lifetime", price: calcPrice(1199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "GTA V",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Offline Legacy", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] },
      { label: "Offline Enhanced", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] },
      { label: "Online Full Access", quality: "private account", duration: "Lifetime", price: calcPrice(1100).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Resident Evil Bundles",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "1–8", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(499).toString(), supportedDevices: ["PC"] },
      { label: "1–9", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(699).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Assassin's Creed Mega Bundle",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "All 19 Games + DLC", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(599).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Hitman Bundle",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "All Games + DLC", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(299).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Rockstar Pack",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Offline Bundle", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(499).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Far Cry Bundle",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "All Games", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(499).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Poppy Playtime Bundle",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "All Games", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(249).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Minecraft",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Private account. Instant delivery.",
    plans: [
      { label: "Standard Full Access", quality: "private account", duration: "Lifetime", price: calcPrice(999).toString(), supportedDevices: ["PC"] },
      { label: "Deluxe Full Access", quality: "private account", duration: "Lifetime", price: calcPrice(1399).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "GTA Trilogy Bundle",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "Offline game activation for PC. Full updates supported.",
    plans: [
      { label: "Definitive Editions", quality: "PC Game Seat Access", duration: "Lifetime", price: calcPrice(199).toString(), supportedDevices: ["PC"] }
    ]
  },
  {
    name: "Special Steam Accounts",
    category: "Steam",
    color: "#222222",
    status: "Available",
    description: "100% legal, genuine, and carefully verified premium accounts.",
    plans: [
      { label: "35+ Games Account", quality: "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION", duration: "Lifetime", price: calcPrice(999).toString(), supportedDevices: ["PC"] },
      { label: "200+ Games Account", quality: "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION", duration: "Lifetime", price: calcPrice(1499).toString(), supportedDevices: ["PC"] },
      { label: "450+ Games Account", quality: "PERSONAL KEY ACTIVATION AND CUSTOMISATION OPTION", duration: "Lifetime", price: calcPrice(1999).toString(), supportedDevices: ["PC"] }
    ]
  }
];

async function seedGames() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");
    
    let count = 0;
    for (const game of gamesList) {
      await Service.updateOne(
        { name: game.name },
        { $set: game },
        { upsert: true }
      );
      count++;
      console.log(`Upserted: ${game.name}`);
    }
    
    console.log(`Successfully processed ${count} games with a 25% price increase.`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding games:", err);
    process.exit(1);
  }
}

seedGames();
