async function testEpicMapping() {
  try {
    const response = await fetch('https://store-content.ak.epicgames.com/api/content/productmapping', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response length:', text.length);
    console.log('Start of response:', text.slice(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testEpicMapping();
