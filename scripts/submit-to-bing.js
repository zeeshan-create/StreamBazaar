const https = require('https');

const payload = JSON.stringify({
  host: 'streambazaar.vercel.app',
  key: '7f4c9a8e2b1d4f6a9e3c5b7a1d8f2e4c',
  keyLocation: 'https://streambazaar.vercel.app/7f4c9a8e2b1d4f6a9e3c5b7a1d8f2e4c.txt',
  urlList: [
    'https://streambazaar.vercel.app/',
    'https://streambazaar.vercel.app/policy',
    'https://streambazaar.vercel.app/terms',
    'https://streambazaar.vercel.app/warranty'
  ]
});

function postIndexNow(hostname, path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          host: hostname,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: data
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

function getIndexNowBing(url, key) {
  return new Promise((resolve, reject) => {
    const fullUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${key}`;
    https.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url: fullUrl,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- Submitting StreamBazaar to Microsoft Bing (IndexNow API) ---');
  
  try {
    const resBing = await postIndexNow('www.bing.com', '/indexnow');
    console.log('Bing POST Response:', resBing.statusCode, resBing.statusMessage, resBing.body || '(OK/Accepted)');
  } catch (e) {
    console.error('Bing POST Error:', e.message);
  }

  try {
    const resIndexNow = await postIndexNow('api.indexnow.org', '/indexnow');
    console.log('IndexNow Central Response:', resIndexNow.statusCode, resIndexNow.statusMessage, resIndexNow.body || '(OK/Accepted)');
  } catch (e) {
    console.error('IndexNow Central Error:', e.message);
  }

  try {
    const getRes = await getIndexNowBing('https://streambazaar.vercel.app/', '7f4c9a8e2b1d4f6a9e3c5b7a1d8f2e4c');
    console.log('Bing GET Ping Response:', getRes.statusCode, getRes.statusMessage, getRes.body || '(OK)');
  } catch (e) {
    console.error('Bing GET Error:', e.message);
  }
}

run();
