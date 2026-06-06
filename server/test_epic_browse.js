const fetch = require('node-fetch');

async function testEpicBrowse() {
  try {
    const query = 'Battlefield';
    const url = `https://store-content.epicgames.com/api/en-US/browse?q=${encodeURIComponent(query)}&count=5`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testEpicBrowse();
