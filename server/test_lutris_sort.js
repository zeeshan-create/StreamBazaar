const getRelevanceScore = (name, query) => {
  const n = name.toLowerCase();
  const q = query.toLowerCase();
  if (n === q) return 1000;
  if (n.startsWith(q)) return 500 - (n.length - q.length);
  if (n.includes(q)) return 100 - (n.length - q.length);
  return 0;
};

async function testLutrisImages(q) {
  try {
    const response = await fetch(`https://lutris.net/api/games?search=${encodeURIComponent(q)}`);
    const data = await response.json();
    console.log(`--- Images for "${q}" ---`);
    if (data && data.results) {
      const sorted = [...data.results].sort((a, b) => getRelevanceScore(b.name, q) - getRelevanceScore(a.name, q));
      sorted.slice(0, 3).forEach(item => {
        console.log({
          name: item.name,
          slug: item.slug,
          coverart: item.coverart,
          banner_url: item.banner_url
        });
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testLutrisImages("Grand Theft Auto V");
