const fetch = global.fetch;

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
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
  const u = 'https://cdn.brandfetch.io/domain/netflix.com?c=1ax1781966806943bfumLaCV7mvIC5iK4g';
  try {
    const res = await fetchWithTimeout(u, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(`URL: ${u}`);
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
  } catch (err) {
    console.error(`Error for ${u}:`, err.message);
  }
}

test();
