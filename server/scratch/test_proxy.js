const fetch = global.fetch;

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

async function test() {
  const urls = [
    'https://cdn.brandfetch.io/idhQlYRiX2/w/128/h/128/fallback/lettermark/icon.webp?c=1ax1780412855200bfumLaCV7mfkLR_3cI',
    'https://lutris.net/games/banner/f1-24.jpg',
    'https://cdn.akamai.steamstatic.com/steam/apps/389730/capsule_184x69.jpg',
    'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg'
  ];

  for (const u of urls) {
    try {
      const res = await fetchWithTimeout(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, 5000);
      console.log(`URL: ${u}`);
      console.log(`Status: ${res.status} ${res.statusText}`);
      console.log(`Content-Type: ${res.headers.get('content-type')}`);
      console.log('-'.repeat(40));
    } catch (err) {
      console.error(`Error for ${u}:`, err.message);
      console.log('-'.repeat(40));
    }
  }
}

test();
