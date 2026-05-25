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

const { allServices: seedServices } = require('./seed');

app.get('/api/plans', async (req, res) => {
  try {
    let allServices = await Service.find({});
    // If KVDB is empty, seed it permanently so _ids are generated
    if (allServices.length === 0) {
      console.log('KVDB empty! Seeding initial data...');
      await Service.insert(seedServices);
      allServices = await Service.find({});
    }
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ── ORDER/BUYER ROUTES ──────────────────────────────────────────
app.get('/api/admin/orders', async (req, res) => {
  try {
    let orders = await Order.find({});
    if (orders.length === 0) {
      const seedOrders = [
        { _id: 'o1', name: "Rahul Sharma", email: "rahul@streambazaar.in", role: "Viewer", status: "Active", product: "Netflix", plan: "Premium 4K · 30D", device: "Laptop", price: "₹175", date: "2026-05-16" },
        { _id: 'o2', name: "Anjali Gupta", email: "anjali@streambazaar.in", role: "Editor", status: "Active", product: "Steam Gaming", plan: "Forza Horizon 5 · 30D", device: "PC", price: "₹175", date: "2026-05-17" },
        { _id: 'o3', name: "Vikram Singh", email: "vikram@streambazaar.in", role: "Admin", status: "Active", product: "Netflix", plan: "UHD · 45D", device: "Mobile", price: "₹249", date: "2026-05-18" },
        { _id: 'o4', name: "Aman Verma", email: "aman@streambazaar.in", role: "Viewer", status: "Inactive", product: "PlayStation", plan: "Black Myth Wukong · 30D", device: "PS5", price: "₹599", date: "2026-05-15" },
        { _id: 'o5', name: "Sneha Patel", email: "sneha@streambazaar.in", role: "Viewer", status: "Active", product: "Prime Video", plan: "UHD · 30D", device: "Tablet", price: "₹129", date: "2026-05-18" }
      ];
      await Order.insert(seedOrders);
      orders = await Order.find({});
    }
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
