async function testLutris(q) {
  try {
    const response = await fetch(`https://lutris.net/api/games?search=${encodeURIComponent(q)}`);
    const data = await response.json();
    console.log(`--- Results for "${q}" (Total: ${data?.results?.length || 0}) ---`);
    if (data && data.results) {
      data.results.slice(0, 5).forEach(item => {
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

async function run() {
  await testLutris("Grand Theft Auto V");
  await testLutris("Fortnite");
}

run();
