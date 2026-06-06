const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Service = require('./models/Service');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

// Seed default admin credentials in database if not present
async function seedAdminUser() {
  try {
    const existing = await Admin.findOne({ email: 'zeeshanshussain0999@gmail.com' });
    if (!existing) {
      await Admin.insert({
        username: 'Ai+rizwan#1974000hussain!#/',
        password: '@#12Rizwan55Hussain/!#7861974000!12',
        email: 'zeeshanshussain0999@gmail.com',
        otp: null,
        otpExpires: null
      });
      console.log('🌱 Default Admin user seeded successfully.');
    }
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err.message);
  }
}
seedAdminUser();

const app = express();
app.use(cors());
app.use(express.json());

const fetchWithTimeout = async (url, options = {}, timeout = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

let twitchTokenInfo = null;

async function getTwitchToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return null;
  }
  
  if (twitchTokenInfo && twitchTokenInfo.accessToken && twitchTokenInfo.expiresAt > Date.now() + 60000) {
    return twitchTokenInfo.accessToken;
  }
  
  try {
    const res = await fetchWithTimeout(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
      method: 'POST'
    }, 4000);
    
    if (res.ok) {
      const data = await res.json();
      if (data.access_token) {
        twitchTokenInfo = {
          accessToken: data.access_token,
          expiresAt: Date.now() + (data.expires_in * 1000)
        };
        return data.access_token;
      }
    }
  } catch (err) {
    console.error('Failed to retrieve Twitch OAuth token:', err.message);
  }
  return null;
}

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
    let rawQ = req.query.q || '';
    if (!rawQ) return res.json([]);
    
    // Clean up unicode symbols like ™, ®, © and trim whitespace for robust API query matching
    const q = rawQ.replace(/[™®©]/g, '').replace(/\s+/g, ' ').trim();
    if (!q) return res.json([]);
    
    try {
      let results = [];
      const qLower = q.toLowerCase();

      // 0. Match local high-fidelity Epic Games Store fallback database
      const localMatches = POPULAR_EGS_GAMES.filter(g => g.name.toLowerCase().includes(qLower));
      if (localMatches.length > 0) {
        results = [...results, ...localMatches];
      }

      // 0.5. Fetch directly from Epic Games Store GraphQL
      try {
        const egsQuery = `
        query searchStoreQuery($keywords: String, $count: Int, $country: String!, $locale: String) {
          Catalog {
            searchStore(keywords: $keywords, count: $count, country: $country, locale: $locale) {
              elements {
                title
                id
                keyImages {
                  type
                  url
                }
              }
            }
          }
        }
        `;
        const egsRes = await fetchWithTimeout('https://store.epicgames.com/graphql', {
          method: 'POST',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: egsQuery,
            variables: { keywords: q, count: 6, country: 'US', locale: 'en-US' }
          })
        }, 3000);
        
        const egsData = await egsRes.json();
        const elements = egsData?.data?.Catalog?.searchStore?.elements;
        if (elements && elements.length > 0) {
          const egsSearchResults = elements.map(item => {
            let bestImg = '';
            if (item.keyImages && item.keyImages.length > 0) {
              const wide = item.keyImages.find(img => img.type === 'OfferImageWide');
              const tall = item.keyImages.find(img => img.type === 'OfferImageTall');
              const thumb = item.keyImages.find(img => img.type === 'Thumbnail');
              const logo = item.keyImages.find(img => img.type === 'ProductLogo');
              bestImg = (wide?.url || tall?.url || thumb?.url || logo?.url || item.keyImages[0]?.url || '').trim();
            }
            return {
              name: item.title,
              domain: 'Epic Games',
              icon: bestImg || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/1200px-Epic_Games_logo.svg.png',
              type: 'Game'
            };
          }).filter(g => g.name);

          const uniqueEgsResults = egsSearchResults.filter(egr => !results.some(r => r.name.toLowerCase() === egr.name.toLowerCase()));
          results = [...results, ...uniqueEgsResults];
        }
      } catch (err) {
        console.log('EGS store GraphQL search error:', err.message);
      }
      
      // 1. Fetch Steam Games (Using official storefront search for rate-limit resilience)
      try {
        const steamRes = await fetchWithTimeout(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=US`, {}, 3000);
        const steamData = await steamRes.json();
        
        if (steamData && steamData.items && steamData.items.length > 0) {
          const gameResults = steamData.items.slice(0, 5).map(item => ({
            name: item.name,
            domain: 'Steam Game',
            icon: `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg`,
            type: 'Game'
          }));
          
          // Deduplicate based on name
          const uniqueSteamResults = gameResults.filter(gr => !results.some(r => r.name.toLowerCase() === gr.name.toLowerCase()));
          results = [...results, ...uniqueSteamResults];
        }
      } catch (err) {
        console.log('Steam store search error:', err.message);
      }

      // 1.1. Fetch RAWG Games (if API key is present)
      try {
        const rawgKey = process.env.RAWG_API_KEY;
        if (rawgKey) {
          const rawgRes = await fetchWithTimeout(`https://api.rawg.io/api/games?search=${encodeURIComponent(q)}&key=${rawgKey}`, {}, 3000);
          if (rawgRes.ok) {
            const rawgData = await rawgRes.json();
            if (rawgData && Array.isArray(rawgData.results)) {
              const rawgResults = rawgData.results.slice(0, 5).map(item => ({
                name: item.name,
                domain: 'RAWG Game',
                icon: item.background_image || '',
                type: 'Game'
              }));
              const uniqueRawgResults = rawgResults.filter(rr => !results.some(r => r.name.toLowerCase() === rr.name.toLowerCase()));
              results = [...results, ...uniqueRawgResults];
            }
          }
        }
      } catch (err) {
        console.log('RAWG search error:', err.message);
      }

      // 1.2. Fetch IGDB Games (if Twitch credentials are present)
      try {
        const token = await getTwitchToken();
        const clientId = process.env.TWITCH_CLIENT_ID;
        if (token && clientId) {
          const igdbRes = await fetchWithTimeout('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': clientId,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'text/plain'
            },
            body: `search "${q.replace(/"/g, '\\"')}"; fields name, cover.url, cover.image_id; limit 5;`
          }, 3000);
          
          if (igdbRes.ok) {
            const igdbData = await igdbRes.json();
            if (Array.isArray(igdbData)) {
              const igdbResults = igdbData.map(item => {
                let iconUrl = '';
                if (item.cover && item.cover.image_id) {
                  iconUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg`;
                } else if (item.cover && item.cover.url) {
                  iconUrl = item.cover.url.startsWith('//') ? 'https:' + item.cover.url : item.cover.url;
                }
                return {
                  name: item.name,
                  domain: 'IGDB Game',
                  icon: iconUrl,
                  type: 'Game'
                };
              });
              const uniqueIgdbResults = igdbResults.filter(ir => !results.some(r => r.name.toLowerCase() === ir.name.toLowerCase()));
              results = [...results, ...uniqueIgdbResults];
            }
          }
        }
      } catch (err) {
        console.log('IGDB search error:', err.message);
      }

      // 1.5. Fetch Epic Games (Lutris/IGDB)
      try {
        const lutrisRes = await fetchWithTimeout(`https://lutris.net/api/games?search=${encodeURIComponent(q)}`, {}, 3000);
        const lutrisData = await lutrisRes.json();
        if (lutrisData && lutrisData.results && lutrisData.results.length > 0) {
          const epicResults = lutrisData.results.slice(0, 5).map(item => {
            let iconUrl = item.coverart || item.banner_url || `https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/1200px-Epic_Games_logo.svg.png`;
            if (iconUrl && iconUrl.startsWith('/')) {
              iconUrl = 'https://lutris.net' + iconUrl;
            }
            return {
              name: item.name,
              domain: 'IGDB Game',
              icon: iconUrl,
              type: 'Game'
            };
          });
          
          // Deduplicate based on name
          const filteredEpicResults = epicResults.filter(er => !results.some(r => r.name.toLowerCase() === er.name.toLowerCase()));
          results = [...results, ...filteredEpicResults];
        }
      } catch (err) {
        console.log('Lutris/Epic search error:', err.message);
      }
      
      // 1.8. Fetch Logo.dev Search (If Secret Key is set)
      if (process.env.LOGO_DEV_SECRET_KEY) {
        try {
          const logoDevRes = await fetchWithTimeout(`https://api.logo.dev/search?q=${encodeURIComponent(q)}`, {
            headers: {
              'Authorization': `Bearer ${process.env.LOGO_DEV_SECRET_KEY}`
            }
          }, 3000);
          const logoDevData = await logoDevRes.json();
          if (Array.isArray(logoDevData)) {
            const pubToken = process.env.VITE_LOGO_DEV_TOKEN || process.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || process.env.LOGO_DEV_PUBLISHABLE_KEY || '';
            const logoDevResults = logoDevData.slice(0, 5).map(item => {
              let iconUrl = item.logo_url;
              if (pubToken && iconUrl) {
                iconUrl = iconUrl.replace('YOUR_PUBLISHABLE_KEY', pubToken);
              }
              return {
                name: item.name,
                domain: item.domain,
                icon: iconUrl,
                type: 'OTT/Brand'
              };
            });
            // Deduplicate logo.dev search results based on domain name
            const filteredLogoDevResults = logoDevResults.filter(ldr => !results.some(r => r.domain.toLowerCase() === ldr.domain.toLowerCase()));
            results = [...filteredLogoDevResults, ...results];
          }
        } catch (err) {
          console.log('Logo.dev search error:', err.message);
        }
      }
      
      // 2. Fetch OTT Brands
      try {
        const brandRes = await fetchWithTimeout(`https://api.brandfetch.io/v2/search/${encodeURIComponent(q)}`, {}, 3000);
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

// ── ADMIN AUTHENTICATION ROUTES ──────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      res.json({ success: true, user: { username: admin.username, email: admin.email } });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const admin = await Admin.findOne({ email: email.trim() });
    if (!admin) {
      return res.status(404).json({ error: 'Admin email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    await Admin.update({ _id: admin._id }, { otp, otpExpires });

    if (!process.env.SMTP_PASS) {
      if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        console.log(`\n🔑 [MOCK EMAIL] OTP for admin password reset: ${otp} (Email: ${email})\n`);
        return res.json({ 
          success: true, 
          message: 'Verification code generated! (Running in mock mode: please configure SMTP_PASS in .env to receive emails. The code has been printed to the server console log for security.)',
          mock: true
        });
      }
      return res.status(500).json({ 
        error: 'SMTP_PASS environment variable is not configured on the live server. Please add SMTP_PASS to your Vercel Project settings.' 
      });
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER || 'zeeshanhussain0999@gmail.com',
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"StreamBazaar Security" <${process.env.SMTP_USER || 'zeeshanhussain0999@gmail.com'}>`,
      to: admin.email,
      subject: 'StreamBazaar Admin Access Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #0f111a; color: #ffffff;">
          <h2 style="color: #a855f7; text-align: center;">Admin Password Recovery</h2>
          <p>Hello Admin,</p>
          <p>A request was made to reset your admin panel credentials. Use the verification code below to authorize the password reset:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #a855f7; border: 2px dashed #a855f7; padding: 10px 20px; border-radius: 8px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code is valid for 10 minutes. If you did not request this, please secure your system immediately.</p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">StreamBazaar Premium Store Automation System</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    const admin = await Admin.findOne({ email: email.trim(), otp });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    if (new Date() > new Date(admin.otpExpires)) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }
    
    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { email, otp, newUsername, newPassword } = req.body;
    if (!email || !otp || !newUsername || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const admin = await Admin.findOne({ email: email.trim(), otp });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    if (new Date() > new Date(admin.otpExpires)) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    await Admin.update({ _id: admin._id }, { 
      username: newUsername, 
      password: newPassword,
      otp: null,
      otpExpires: null
    });
    
    res.json({ success: true, message: 'Admin credentials updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/update-credentials', async (req, res) => {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const admin = await Admin.findOne({ username: currentUsername, password: currentPassword });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid current credentials' });
    }
    
    await Admin.update({ _id: admin._id }, { 
      username: newUsername, 
      password: newPassword 
    });
    
    res.json({ success: true, message: 'Admin credentials updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    await Service.update({ _id: req.params.id }, { $set: updateData });
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

// ── IMAGE PROXY ENDPOINT ──────────────────────────────────────────
app.get('/api/proxy-image', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetchWithTimeout(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, 5000);

    if (!response.ok) {
      console.error(`Proxy fetch failed for ${targetUrl}: Status ${response.status}`);
      return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=604800'); // Cache for 7 days

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(`Proxy error for ${targetUrl}:`, err.message);
    res.status(500).send(`Proxy server error: ${err.message}`);
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;

