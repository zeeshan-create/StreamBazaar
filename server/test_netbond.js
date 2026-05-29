const https = require('https');

https.get('https://netbond.in', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    console.log('Length:', data.length);
    const apiMatch = data.match(/\/api\/[a-zA-Z0-9_-]+/g);
    if(apiMatch) {
      console.log('APIs:', [...new Set(apiMatch)]);
    } else {
      console.log('No APIs found in HTML');
    }
    const nextDataMatch = data.match(/<script id="__NEXT_DATA__".*?>(.*?)<\/script>/s);
    if (nextDataMatch) {
      console.log('Has Next Data, size:', nextDataMatch[1].length);
      require('fs').writeFileSync('netbond.json', nextDataMatch[1]);
    } else {
      console.log('No NEXT_DATA');
    }
  });
});
