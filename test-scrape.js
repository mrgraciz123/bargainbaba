const fetch = require('node-fetch');

async function testFetch() {
  try {
    const res = await fetch('https://html.duckduckgo.com/html/?q=wedding+photographers+in+lucknow+price', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await res.text();
    console.log("DuckDuckGo length:", text.length);
    console.log("DuckDuckGo snippet:", text.substring(0, 200));

    const res2 = await fetch('https://www.wedmegood.com/vendors/lucknow/wedding-photographers/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text2 = await res2.text();
    console.log("WedMeGood length:", text2.length);
  } catch (e) {
    console.error(e);
  }
}

testFetch();
