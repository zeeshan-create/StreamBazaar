const fetch = require('node-fetch');

async function testEpicBrowse() {
  try {
    const query = 'Spider-Man';
    const url = `https://store-content.ak.epicgames.com/api/en-US/browse?q=${encodeURIComponent(query)}&count=5`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response Length:', text.length);
    if (res.status === 200) {
      const data = JSON.parse(text);
      console.log('Results count:', data.data?.Catalog?.searchStore?.elements?.length);
      console.log('First result:', JSON.stringify(data.data?.Catalog?.searchStore?.elements?.[0], null, 2));
    } else {
      console.log('Response body:', text);
    }
  } catch (err) {
    console.error(err);
  }
}

testEpicBrowse();
