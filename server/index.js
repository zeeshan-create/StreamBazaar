const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Service = require('./models/Service');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('StreamBazaar API v2 (NeDB Connected)'));

const POPULAR_EGS_GAMES = [
  {
    name: "Marvel's Spider-Man Remastered",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co4w1w.jpg',
    type: 'Game'
  },
  {
    name: "Marvel's Spider-Man: Miles Morales",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co582f.jpg',
    type: 'Game'
  },
  {
    name: "Marvel's Spider-Man 2",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co6mkv.jpg',
    type: 'Game'
  },
  {
    name: "God of War",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co1tpx.jpg',
    type: 'Game'
  },
  {
    name: "God of War Ragnarök",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co582b.jpg',
    type: 'Game'
  },
  {
    name: "Grand Theft Auto V",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co2lbd.jpg',
    type: 'Game'
  },
  {
    name: "Red Dead Redemption 2",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co1q1f.jpg',
    type: 'Game'
  },
  {
    name: "Elden Ring",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co4p96.jpg',
    type: 'Game'
  },
  {
    name: "Black Myth: Wukong",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co7d6v.jpg',
    type: 'Game'
  },
  {
    name: "Cyberpunk 2077",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co2mo1.jpg',
    type: 'Game'
  },
  {
    name: "Alan Wake 2",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co6mkh.jpg',
    type: 'Game'
  },
  {
    name: "Hogwarts Legacy",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co6525.jpg',
    type: 'Game'
  },
  {
    name: "Ghost of Tsushima DIRECTOR'S CUT",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co843a.jpg',
    type: 'Game'
  },
  {
    name: "The Last of Us Part I",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co55h3.jpg',
    type: 'Game'
  },
  {
    name: "Uncharted: Legacy of Thieves Collection",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co3w40.jpg',
    type: 'Game'
  },
  {
    name: "EA SPORTS FC 25",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co8g5w.jpg',
    type: 'Game'
  },
  {
    name: "Horizon Forbidden West Complete Edition",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co7m30.jpg',
    type: 'Game'
  },
  {
    name: "WWE 2K24",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co7ss3.jpg',
    type: 'Game'
  },
  {
    name: "Forza Horizon 5",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co3w7y.jpg',
    type: 'Game'
  },
  {
    name: "Assassin's Creed Mirage",
    domain: 'Epic Games',
    icon: 'https://lutris.net/media/igdb/cover_big/co6845.jpg',
    type: 'Game'
  }
];

  app.get('/api/search-games', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);
    
    try {
      let results = [];
      const qLower = q.toLowerCase();

      // 0. Match local high-fidelity Epic Games Store fallback database
      const localMatches = POPULAR_EGS_GAMES.filter(g => g.name.toLowerCase().includes(qLower));
      if (localMatches.length > 0) {
        results = [...results, ...localMatches];
      }
      
      // 1. Fetch Steam Games
      try {
        const steamRes = await fetch(`https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(q)}`);
        const steamData = await steamRes.json();
        
        if (steamData && steamData.length > 0) {
          const gameResults = steamData.slice(0, 4).map(item => ({
            name: item.name,
            domain: 'Steam Game',
            icon: `https://cdn.akamai.steamstatic.com/steam/apps/${item.appid}/capsule_184x69.jpg`,
            type: 'Game'
          }));
          results = [...results, ...gameResults];
        }
      } catch (err) {
        console.log('Steam search error:', err.message);
      }

      // 1.5. Fetch Epic Games (Lutris/IGDB)
      try {
        const lutrisRes = await fetch(`https://lutris.net/api/games?search=${encodeURIComponent(q)}`);
        const lutrisData = await lutrisRes.json();
        if (lutrisData && lutrisData.results && lutrisData.results.length > 0) {
          const epicResults = lutrisData.results.slice(0, 4).map(item => {
            let iconUrl = item.coverart || item.banner_url || `https://www.google.com/s2/favicons?domain=epicgames.com&sz=256`;
            if (iconUrl && iconUrl.startsWith('/')) {
              iconUrl = 'https://lutris.net' + iconUrl;
            }
            return {
              name: item.name,
              domain: 'Epic Games',
              icon: iconUrl,
              type: 'Game'
            };
          });
          
          // Deduplicate based on name with localMatches
          const filteredEpicResults = epicResults.filter(er => !results.some(r => r.name.toLowerCase() === er.name.toLowerCase()));
          results = [...results, ...filteredEpicResults];
        }
      } catch (err) {
        console.log('Lutris/Epic search error:', err.message);
      }
      
      // 2. Fetch OTT Brands
      try {
        const brandRes = await fetch(`https://api.brandfetch.io/v2/search/${encodeURIComponent(q)}`);
        const brandData = await brandRes.json();
        
        if (brandData && brandData.length > 0) {
          const brandResults = brandData.slice(0, 3).map(brand => ({
            name: brand.name,
            domain: brand.domain,
            icon: brand.icon || `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=256`,
            type: 'OTT/Brand'
          }));
          results = [...results, ...brandResults];
        }
      } catch (err) {
        console.log('Brandfetch error:', err.message);
      }
      
      res.json(results);
    } catch (err) {
      console.error('Unified Search error:', err.message);
      res.status(500).json({ error: 'Failed to search' });
    }
  });


app.get('/api/plans', async (req, res) => {
  try {
    let allServices = await Service.find({});
    // Tell mobile browsers NEVER to cache, and disable Vercel CDN caching to ensure real-time price updates
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ── ORDER/BUYER ROUTES ──────────────────────────────────────────
app.get('/api/admin/orders', async (req, res) => {
  try {
    let orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, product, plan, device, price } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newOrder = await Order.insert({
      name,
      email,
      product,
      plan,
      device,
      price,
      role: 'Viewer',
      status: 'Active',
      date: new Date().toISOString().split('T')[0]
    });
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/orders/:id', async (req, res) => {
  try {
    await Order.remove({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN ROUTES ────────────────────────────────────────────────
app.post('/api/admin/plans', async (req, res) => {
  try {
    const newService = await Service.insert(req.body);
    res.json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/plans/:id', async (req, res) => {
  try {
    await Service.update({ _id: req.params.id }, { $set: req.body });
    const updated = await Service.findOne({ _id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/plans/:id', async (req, res) => {
  try {
    await Service.remove({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GEMINI AI CHAT ──────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const allServices = await Service.find({});
    const msgLower = message.toLowerCase().trim();
    
    // Greetings & Menu
    if (/^(hi|hello|hey|help|menu|start|namaste)$/.test(msgLower)) {
      return res.json({ reply: 'Hello there! 👋 Welcome to StreamBazaar.\n\nI can help you with:\n• Finding OTT prices (e.g., type "Netflix" or "Spotify")\n• Gaming seat prices (e.g., type "Steam")\n• How to purchase\n\nWhat are you looking for today?' });
    }

    // Quick Chips - Dynamic Price Lookups
    if (msgLower.includes('cheapest netflix')) {
      const netflix = allServices.find(s => s.name === 'Netflix');
      if (netflix) {
        const cheapestPlan = [...netflix.plans].sort((a, b) => parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', '')))[0];
        return res.json({ reply: `Our cheapest **Netflix** plan is the **${cheapestPlan.label}** for just **${cheapestPlan.price}**! \n\n👉 [Buy now on Telegram](https://t.me/TrustedStreams)` });
      }
    }
    if (msgLower.includes('sabse sasta ott plan')) {
      let cheapestService = null;
      let cheapestPlan = null;
      let lowestPrice = Infinity;
      allServices.filter(s => s.category === 'Streaming').forEach(service => {
        service.plans.forEach(plan => {
          const price = parseInt(plan.price.replace('₹', ''));
          if (price < lowestPrice) { lowestPrice = price; cheapestPlan = plan; cheapestService = service; }
        });
      });
      return res.json({ reply: `Hamara sabse sasta OTT plan **${cheapestService.name}** ka hai. Sirf **${cheapestPlan.price}** mein aapko **${cheapestPlan.label}** mil jayega!\n\n👉 [Buy on Telegram](https://t.me/TrustedStreams)` });
    }
    if (msgLower.includes('gaming seat prices')) {
      let reply = 'We offer premium **Steam** & **PlayStation** seat access (Laptop/PC only):\n\n';
      const gamingServices = allServices.filter(s => s.category === 'Gaming');
      gamingServices.forEach(service => {
        reply += `🎮 **${service.name}:**\n`;
        service.plans.slice(0, 4).forEach(plan => {
          reply += `• ${plan.label} → **${plan.price}**\n`;
        });
        reply += '\n';
      });
      reply += '👉 [Get access on Telegram](https://t.me/TrustedStreams)';
      return res.json({ reply });
    }
    if (msgLower.includes('how do i buy') || msgLower.includes('kaise kharidein')) {
      return res.json({ reply: 'Khareedna bahut asaan hai! (Buying is very easy!)\n\n1️⃣ Choose your plan on the website.\n2️⃣ Click "Buy" to select your device.\n3️⃣ It will redirect you to our Telegram.\n4️⃣ Send the message and pay securely.\n5️⃣ Get your login details instantly!\n\n👉 [Chat with us on Telegram](https://t.me/TrustedStreams)' });
    }
    if (msgLower.includes('kaunse devices support') || msgLower.includes('which devices work')) {
      return res.json({ reply: 'Hamare plans in devices par chalte hain:\n\n💻 **Laptop**\n🖥️ **PC**\n📱 **iOS** (iPhone/iPad)\n🤖 **Android**\n\n*(Note: Gaming plans like Steam/PlayStation sirf Laptop aur PC par chalte hain!)*' });
    }

    // ── SMART INTENT MATCHING ──
    if (/support|issue|not working|refund|password|login|scam|fake/.test(msgLower)) {
      return res.json({ reply: 'If you are facing any issues with your account, login, or need a replacement, our human support team is ready to help you instantly!\n\n👉 [Contact Support on Telegram](https://t.me/TrustedStreams)' });
    }
    if (/free/.test(msgLower)) {
      return res.json({ reply: 'We do not offer free accounts, but we do offer premium, secure, and fully guaranteed subscriptions at up to 90% off official prices! 🔒\n\nWhat service are you looking for?' });
    }
    if (/recommend|suggest|best/.test(msgLower) && !msgLower.includes('netflix')) {
      return res.json({ reply: 'Looking for a recommendation? 🍿\n\n• For Movies/Series: **Netflix 4K** or **Amazon Prime**\n• For Indian Content: **Sony LIV** or **Jio Hotstar**\n• For Music: **Spotify Premium**\n\nType any of these names to see their prices!' });
    }
    if (/vpn/.test(msgLower)) {
      let reply = 'Here are our secure VPN options:\n\n';
      allServices.filter(s => s.category === 'VPN').forEach(s => {
        reply += `🛡️ **${s.name}**\n`;
        s.plans.forEach(p => reply += `• ${p.label} → **${p.price}**\n`);
      });
      reply += '\n👉 [Buy on Telegram](https://t.me/TrustedStreams)';
      return res.json({ reply });
    }

    // Smart Local Search for Products
    const matchedProducts = allServices.filter(p => msgLower.includes(p.name.toLowerCase()));
    if (matchedProducts.length > 0) {
      let reply = '';
      matchedProducts.forEach(p => {
        reply += `📌 **${p.name}**\n`;
        p.plans.forEach(plan => {
          reply += `• ${plan.label} → **${plan.price}**\n`;
        });
        reply += '\n';
      });
      reply += '👉 [Buy on Telegram](https://t.me/TrustedStreams)';
      return res.json({ reply });
    }
    // ────────────────────────────────────────────────────────────

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ reply: "Our AI assistant is currently being upgraded. In the meantime, our human agents are ready to help you instantly on Telegram!\n\n👉 [Chat with us on Telegram](https://t.me/TrustedStreams)" });
    }

    const productContext = allServices.map(s =>
      `📌 ${s.name} [${s.category}]\n` +
      s.plans.map(p => `   • ${p.label} → ${p.price}`).join('\n')
    ).join('\n\n');

    const SYSTEM_PROMPT = `You are StreamBot 🤖, a friendly and knowledgeable customer support AI for StreamBazaar — a premium digital subscription seat access store.
Your job is to help customers:
- Find the right subscription plan
- Understand pricing and what "seat access" means
- Know which devices are supported
- Direct them to buy via Telegram

🛒 PURCHASE LINK: https://t.me/TrustedStreams
(Always share this link when a customer wants to buy)

📦 AVAILABLE PRODUCTS & PRICES:
${productContext}

📋 RULES & LANGUAGE:
- **Language Matching:** If the user speaks in Hindi, Hinglish (Hindi written in English), or asks for Hindi, reply in natural, polite Hindi/Hinglish. If they speak in English, reply in English.
- Be concise, warm, and professional.
- Always quote prices accurately from the list above.
- Seat access = 1 private profile/seat on a shared premium account.
- Supported devices: Laptop, PC, iOS, Android (Gaming: Laptop & PC only).
- Delivery is instant via Telegram after payment.
- For anything not in the list, say "We don't currently offer that" (or Hindi equivalent).
- Never mention competitor stores.
- Keep replies short (max 4-5 lines) unless listing prices.
- Use emojis sparingly but friendly.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    const chat = model.startChat({
      history: history.map(m => {
        let text = m.content || '';
        // Strip any raw filename references (e.g. "Screenshot 2025-xx-xx......png")
        // so they never reach the model as unsupported image input.
        text = text.replace(/[A-Za-z]:?[\\\/][^\s\\\/]+(\.(png|jpg|jpeg|gif|webp|bmp|svg))(\s.*)?/gi, '#referenced-image#');
        text = text.replace(/\b\w+\.(png|jpg|jpeg|gif|webp|bmp|svg)\b/gi, '#referenced-image#');
        const parts = [{ text }];
        return { role: m.role === 'bot' ? 'model' : 'user', parts };
      }),
    });
    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ reply: "I seem to be experiencing technical difficulties right now. But don't worry, our human agents are online and ready to help!\n\n👉 [Chat with us on Telegram](https://t.me/TrustedStreams)" });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
