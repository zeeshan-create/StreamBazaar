const fetch = require('node-fetch');
require('dotenv').config();

const q = 'Netflix';
console.log(`Testing search logic locally for query: "${q}"`);

// We'll emulate the search logic in server/index.js
async function runTest() {
  let results = [];
  
  // 1. Emulate Brandfetch
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

  // 2. Emulate Logo.dev Search (If Secret Key is set)
  const secretKey = process.env.LOGO_DEV_SECRET_KEY;
  if (secretKey) {
    console.log('LOGO_DEV_SECRET_KEY found. Fetching from Logo.dev...');
    try {
      const logoDevRes = await fetch(`https://api.logo.dev/search?q=${encodeURIComponent(q)}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`
        }
      });
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
        const filteredLogoDevResults = logoDevResults.filter(ldr => !results.some(r => r.domain.toLowerCase() === ldr.domain.toLowerCase()));
        results = [...filteredLogoDevResults, ...results];
      }
    } catch (err) {
      console.log('Logo.dev search error:', err.message);
    }
  } else {
    console.log('LOGO_DEV_SECRET_KEY not set in .env. Skipping Logo.dev search API call.');
  }

  console.log('\n--- Search Results ---');
  console.log(JSON.stringify(results, null, 2));
}

runTest();
