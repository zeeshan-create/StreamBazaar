const fs = require('fs');
const path = require('path');

const STOREFRONT_PATH = path.join(__dirname, 'client/src/components/Storefront.jsx');
const ADMIN_PATH = path.join(__dirname, 'client/src/components/AdminDashboard.jsx');

const newGameImgs = `const GAME_IMGS = {
  'wwe 2k25': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg',
  'wwe bundles': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg',
  'forza horizon 5': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/capsule_184x69.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_184x69.jpg',
  'gta trilogy': 'https://cdn.akamai.steamstatic.com/steam/apps/1546930/capsule_184x69.jpg',
  'spider-man 2': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_184x69.jpg',
  'spider-man series': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_184x69.jpg',
  'uncharted': 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/capsule_184x69.jpg',
  'crimson desert': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=60',
  'the last of us': 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/capsule_184x69.jpg',
  'black myth wukong': 'https://cdn.akamai.steamstatic.com/steam/apps/2358720/capsule_184x69.jpg',
  'ghost of tsushima': 'https://cdn.akamai.steamstatic.com/steam/apps/2215430/capsule_184x69.jpg',
  'elden ring': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_184x69.jpg',
  'resident evil': 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_184x69.jpg',
  'hogwarts legacy': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/capsule_184x69.jpg',
  'god of war': 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_184x69.jpg',
  'cyberpunk 2077': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_184x69.jpg',
  'pragmata': 'https://cdn.akamai.steamstatic.com/steam/apps/1240440/capsule_184x69.jpg',
  'assassin\\'s creed': 'https://cdn.akamai.steamstatic.com/steam/apps/2208920/capsule_184x69.jpg',
  'khazan': 'https://cdn.akamai.steamstatic.com/steam/apps/2801450/capsule_184x69.jpg', // Placeholder
  'f1 25': 'https://cdn.akamai.steamstatic.com/steam/apps/2465800/capsule_184x69.jpg',
  'stellar blade': 'https://cdn.akamai.steamstatic.com/steam/apps/2522250/capsule_184x69.jpg', // Placeholder
  'mafia': 'https://cdn.akamai.steamstatic.com/steam/apps/1030840/capsule_184x69.jpg',
  'tekken 7': 'https://cdn.akamai.steamstatic.com/steam/apps/389730/capsule_184x69.jpg',
  'tekken 8': 'https://cdn.akamai.steamstatic.com/steam/apps/1778820/capsule_184x69.jpg',
  'expedition 33': 'https://cdn.akamai.steamstatic.com/steam/apps/2690040/capsule_184x69.jpg',
  'red dead redemption': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_184x69.jpg',
  'hitman': 'https://cdn.akamai.steamstatic.com/steam/apps/1659040/capsule_184x69.jpg',
  'rockstar pack': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_184x69.jpg',
  'far cry': 'https://cdn.akamai.steamstatic.com/steam/apps/2369390/capsule_184x69.jpg',
  'poppy playtime': 'https://cdn.akamai.steamstatic.com/steam/apps/1721470/capsule_184x69.jpg',
  'minecraft': 'https://cdn.akamai.steamstatic.com/steam/apps/1240440/capsule_184x69.jpg', // placeholder
  'special steam accounts': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_184x69.jpg', // placeholder
};`;

const fixGetFavicon = `  const getFavicon = name => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    
    // Check custom overrides first
    const matchedCustom = Object.keys(CUSTOM_ICONS).find(k => lowerName.includes(k));
    if (matchedCustom) return CUSTOM_ICONS[matchedCustom];

    const gameIcon = getGameIcon(name);
    if (gameIcon) return gameIcon;

    let domain = DOMAINS[lowerName];
    if (!domain) {
      // Smart domain fallback based on name
      domain = \`\${lowerName.replace(/[^a-z0-9]/g, '')}.com\`;
    }
    // Use high-quality Google Favicons API (sz=256 ensures high resolution)
    return \`https://www.google.com/s2/favicons?domain=\${domain}&sz=256\`;
  };`;

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace GAME_IMGS
  code = code.replace(/const GAME_IMGS = \{[\s\S]*?\};\n/, newGameImgs + '\\n');
  
  // Replace getFavicon logic
  code = code.replace(/const getFavicon = [^\n]+=> \{[\s\S]*?return `https:\/\/www\.google\.com\/s2\/favicons\?domain=\$\{domain\}\&sz=256`;\n\s*};/m, fixGetFavicon);
  
  // Also fix Storefront img tags if it's storefront
  if (filePath.includes('Storefront')) {
    code = code.replace(/<img src=\{getFavicon\(product\.name\)\} className="search-result-logo"/g, '<img src={product.customIcon || getFavicon(product.name)} className="search-result-logo"');
    code = code.replace(/src=\{getFavicon\(product\.name\)\}\n\s*alt=\{product\.name\}/g, 'src={product.customIcon || getFavicon(product.name)}\\n                          alt={product.name}');
    code = code.replace(/getFavicon\(popup\.product\.name\)/g, '(popup.product.customIcon || getFavicon(popup.product.name))');
  } else if (filePath.includes('AdminDashboard')) {
    code = code.replace(/<img src=\{getGameIcon\(editForm\.name\) \|\| getFavicon\(editForm\.name\)\}/g, '<img src={editForm.customIcon || getFavicon(editForm.name)}');
    code = code.replace(/\{\(getFavicon\(editForm\.name\) \|\| getGameIcon\(editForm\.name\)\) && \(/g, '{(editForm.customIcon || getFavicon(editForm.name)) && (');
  }
  
  fs.writeFileSync(filePath, code);
}

updateFile(STOREFRONT_PATH);
updateFile(ADMIN_PATH);
console.log('Successfully patched files!');
