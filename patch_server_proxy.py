import os

path = r'server\index.js'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

api_proxy_code = """
// --- Unified API Search (Games + OTT) ---
app.get('/api/search-games', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  
  try {
    let results = [];
    
    // Check if it's a game (or try Steam API first)
    // Using Steam's public store search API
    const steamRes = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=US`);
    const steamData = await steamRes.json();
    
    if (steamData && steamData.items && steamData.items.length > 0) {
      results = steamData.items.slice(0, 4).map(item => ({
        name: item.name,
        domain: 'Steam Game',
        icon: `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/capsule_184x69.jpg`,
        type: 'Game'
      }));
    }
    
    // Also fetch OTT brands from Brandfetch public autocomplete
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
    console.error('Search API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});
"""

if '/api/search-games' not in code:
    # Insert right before app.post('/api/chat')
    code = code.replace("app.post('/api/chat'", api_proxy_code + "\napp.post('/api/chat'")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Backend proxy injected!")
else:
    print("Proxy already exists.")
