require('dotenv').config();
const { Vibrant } = require('node-vibrant/node');
const { Service } = require('./models/dbAdapter');

const CUSTOM_ICONS = {
  'airtel': 'https://icon.horse/icon/airtelxstream.in',
  'discovery': 'https://icon.horse/icon/discoveryplus.in'
};

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

const GAME_IMGS = {
  'gta 5': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_231x87.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_231x87.jpg',
  'rdr 2': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_231x87.jpg',
  'red dead': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_231x87.jpg',
  'cyberpunk': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_231x87.jpg',
  'wwe': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_231x87.jpg',
  'forza': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/capsule_231x87.jpg',
  'fifa': 'https://cdn.akamai.steamstatic.com/steam/apps/2195250/capsule_231x87.jpg',
  'fc 24': 'https://cdn.akamai.steamstatic.com/steam/apps/2195250/capsule_231x87.jpg',
  'spider-man': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_231x87.jpg',
  'spiderman': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_231x87.jpg',
  'god of war': 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_231x87.jpg',
  'hogwarts': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/capsule_231x87.jpg',
  'resident evil': 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_231x87.jpg',
  'elden ring': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_231x87.jpg',
  'call of duty': 'https://cdn.akamai.steamstatic.com/steam/apps/1938090/capsule_231x87.jpg'
};

const getFavicon = (serviceName) => {
  if (!serviceName) return null;
  const lowerName = serviceName.toLowerCase().trim();
  
  const matchedCustom = Object.keys(CUSTOM_ICONS).find(k => lowerName.includes(k));
  if (matchedCustom) return CUSTOM_ICONS[matchedCustom];

  const matchedGame = Object.keys(GAME_IMGS).find(k => lowerName.includes(k));
  if (matchedGame) return GAME_IMGS[matchedGame];

  const matchedKey = Object.keys(DOMAINS).find(key => lowerName.includes(key));
  if (matchedKey) {
    return `https://www.google.com/s2/favicons?domain=${DOMAINS[matchedKey]}&sz=256`;
  }
  const cleanName = lowerName.split(' ')[0].replace(/[^a-z0-9]/g, '');
  return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=256`;
};

async function migrateColors() {
  try {
    // Calling find() triggers connectToDatabase() in the adapter
    const services = await Service.find({});
    console.log(`Found ${services.length} services to process.`);

    for (let service of services) {
      // Find image URL to use
      let imageUrl = service.customIcon || getFavicon(service.name);
      
      let primary = service.primaryColor;
      let secondary = service.secondaryColor;

      // Skip if it already has both colors
      if (primary && secondary && primary !== '#6366f1' && primary !== '#333' && primary !== '#000000') {
        console.log(`[${service.name}] Skipping, already has colors.`);
        continue;
      }

      if (!imageUrl) {
        console.log(`[${service.name}] No image URL found, assigning defaults.`);
        await Service.update({ _id: service._id }, { 
            primaryColor: service.color || '#6366f1',
            secondaryColor: service.color || '#4f46e5'
        });
        continue;
      }

      console.log(`[${service.name}] Extracting colors from ${imageUrl}...`);
      
      try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        primary = palette.Vibrant ? palette.Vibrant.hex : (service.color || '#6366f1');
        secondary = palette.DarkVibrant ? palette.DarkVibrant.hex : (palette.Muted ? palette.Muted.hex : primary);
        
        await Service.update({ _id: service._id }, { 
            primaryColor: primary,
            secondaryColor: secondary
        });
        console.log(`[${service.name}] Updated: Primary ${primary}, Secondary ${secondary}`);
      } catch (err) {
        console.log(`[${service.name}] Failed to extract: ${err.message}`);
        await Service.update({ _id: service._id }, { 
            primaryColor: service.color || '#6366f1',
            secondaryColor: service.color || '#4f46e5'
        });
      }
    }

    console.log('Migration completed.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit(0);
  }
}

migrateColors();
