async function testSteam(q) {
  try {
    const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=US`);
    const data = await response.json();
    console.log(`--- Steam Results for "${q}" ---`);
    if (data && data.items) {
      data.items.slice(0, 5).forEach(item => {
        console.log({
          id: item.id,
          name: item.name,
          tiny_image: item.tiny_image
        });
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

async function run() {
  await testSteam("Battlefield");
}

run();
