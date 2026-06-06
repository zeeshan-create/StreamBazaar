const fetch = require('node-fetch');

const query = `
query searchStoreQuery($keywords: String, $count: Int) {
  Catalog {
    searchStore(keywords: $keywords, count: $count) {
      elements {
        title
        id
        namespace
        keyImages {
          type
          url
        }
      }
    }
  }
}
`;

async function testEpicGraphQL() {
  try {
    const res = await fetch('https://store.epicgames.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        query,
        variables: {
          keywords: 'Spider-Man',
          count: 5
        }
      })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response Length:', text.length);
    console.log('Response body:', text.slice(0, 1000));
  } catch (err) {
    console.error(err);
  }
}

testEpicGraphQL();
