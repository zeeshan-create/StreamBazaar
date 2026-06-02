import os
import re

path = r'server\index.js'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = """  app.get('/api/search-games', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);
    
    try {
      let results = [];
      
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
  });"""

# Replace the existing block
pattern = r"app\.get\('/api/search-games', async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: 'Failed to search games' \}\);\s*\}\s*\}\);"

if re.search(pattern, code):
    code = re.sub(pattern, replacement, code)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully replaced /api/search-games block.")
else:
    print("Pattern not found!")

