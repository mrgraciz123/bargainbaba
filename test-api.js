const fetch = require('node-fetch'); // Next.js global fetch might not be here, let's use standard node fetch if node 18+, else we'll see. Actually Node 18+ has global fetch.

async function testApi() {
  try {
    console.log("Testing port 3000...");
    let res = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budget: 1500000,
        guestCount: 300,
        city: 'Delhi NCR',
        weddingType: 'Grand Royal Palace Wedding',
        requiredServices: ['venues']
      })
    }).catch(e => null);

    if (!res) {
      console.log("Port 3000 failed, trying 3001...");
      res = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: 1500000,
          guestCount: 300,
          city: 'Delhi NCR',
          weddingType: 'Grand Royal Palace Wedding',
          requiredServices: ['venues']
        })
      });
    }

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Error connecting:", err);
  }
}

testApi();
