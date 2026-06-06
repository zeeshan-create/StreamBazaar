require('dotenv').config();
const mongoose = require('mongoose');
const { Service } = require('./models/dbAdapter');

const DOMAINS = {
  'netflix': 'netflix.com',
  'youtube': 'youtube.com',
  'amazon': 'primevideo.com',
  'prime': 'primevideo.com',
  'hotstar': 'hotstar.com',
  'jio hotstar': 'hotstar.com',
  'jio': 'jiocinema.com',
  'jiocinema': 'jiocinema.com',
  'sony': 'sonyliv.com',
  'sonyliv': 'sonyliv.com',
  'zee5': 'zee5.com',
  'chatgpt': 'openai.com',
  'claude': 'anthropic.com',
  'canva': 'canva.com',
  'spotify': 'spotify.com',
  'crunchyroll': 'crunchyroll.com',
  'discord': 'discord.com',
  'disney': 'disneyplus.com',
  'hoichoi': 'hoichoi.tv',
  'discovery plus': 'discoveryplus.in',
  'discovery': 'discoveryplus.in',
  'airtel xstream': 'airtelxstream.in',
  'airtel': 'airtelxstream.in',
  'iptv': 'iptv-org.github.io',
  'ullu': 'ullu.app',
  'aha': 'aha.video',
  'altbalaji': 'altt.co.in',
  'voot': 'voot.com',
  'sun nxt': 'sunnxt.com',
  'sunnxt': 'sunnxt.com',
  'lionsgate': 'lionsgateplay.com',
  'epic on': 'epicon.in',
  'eros now': 'erosnow.com',
  'nord vpn': 'nordvpn.com',
  'nordvpn': 'nordvpn.com',
  'nord': 'nordvpn.com',
  'surfshark': 'surfshark.com',
  'express vpn': 'expressvpn.com',
  'expressvpn': 'expressvpn.com',
  'vpn': 'nordvpn.com',
  'epic': 'epicgames.com',
  'server': 'digitalocean.com',
  'stream server': 'plex.tv',
  'ott': 'netflix.com',
  'kaspersky': 'kaspersky.com'
};

async function migrate() {
  try {
    const services = await Service.find({});
    console.log(`Found ${services.length} services in the database.`);
    let updatedCount = 0;

    for (const s of services) {
      if (s.customIcon && s.customIcon.includes('brandfetch.io')) {
        console.log(`Processing expired Brandfetch icon for [${s.name}]: ${s.customIcon}`);
        
        // Find domain matching name
        const lowerName = s.name.toLowerCase().trim();
        const matchedKey = Object.keys(DOMAINS).find(key => lowerName.includes(key));
        let domain = '';
        if (matchedKey) {
          domain = DOMAINS[matchedKey];
        } else {
          domain = lowerName.split(' ')[0].replace(/[^a-z0-9]/g, '') + '.com';
        }

        const newIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        console.log(`Updating icon to: ${newIcon}`);
        
        await Service.update({ _id: s._id }, { customIcon: newIcon });
        updatedCount++;
      }
    }
    console.log(`Migration completed successfully! Updated ${updatedCount} products.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
