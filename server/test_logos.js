const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

async function test() {
  const domains = ['netflix.com', 'canva.com', 'discoveryplus.com', 'hoichoi.tv', 'openai.com'];
  
  for (const domain of domains) {
    const ih = await checkUrl(`https://icon.horse/icon/${domain}`);
    console.log(`${domain} - IconHorse: ${ih}`);
  }
}
test();
