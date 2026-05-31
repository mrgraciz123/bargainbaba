const { getCuratedVendors } = require('./mockVendors');

function getDeterministicPrice(name, rating, categoryKey) {
  const basePrices = {
    'Venue': 2500,
    'Decoration': 120000,
    'Catering': 1800,
    'Photography': 90000,
    'Makeup Artist': 25000
  };
  
  const base = basePrices[categoryKey] || 50000;
  
  // Use rating as a multiplier (e.g. 5.0 rating = 1.3x cost, 4.0 rating = 1.0x cost)
  const rate = parseFloat(rating) || 4.5;
  const ratingMultiplier = 1 + ((rate - 4.0) * 0.3); 
  
  // Use string length to add slight pseudo-random variation (-10% to +10%)
  const nameLen = name.length;
  const variation = 1 + ((nameLen % 20) - 10) / 100;
  
  return Math.round(base * ratingMultiplier * variation);
}

function normalizeCategory(raw) {
  if (raw.includes('Venue') || raw.includes('Banquet')) return 'Venue';
  if (raw.includes('Decor')) return 'Decoration';
  if (raw.includes('Cater')) return 'Catering';
  if (raw.includes('Photo')) return 'Photography';
  if (raw.includes('Makeup')) return 'Makeup Artist';
  return 'Vendor';
}

async function fetchLiveMarketData(city, category) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const categoryKey = normalizeCategory(category);
  
  if (!apiKey) {
    console.warn(`[Places API] Missing GOOGLE_PLACES_API_KEY. Using curated fallback for ${category} in ${city}.`);
    return getCuratedVendors(city, categoryKey);
  }

  const query = `Top ${categoryKey} in ${city}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      console.warn(`[Places API] Request failed (${response.status}). Using curated fallback.`);
      return getCuratedVendors(city, categoryKey);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.warn(`[Places API] No results found for ${query}. Using curated fallback.`);
      return getCuratedVendors(city, categoryKey);
    }

    // Process top 5 results
    const results = data.results.slice(0, 5);
    
    const normalizedVendors = results.map(place => {
      const name = place.name;
      const rating = place.rating ? place.rating.toFixed(1) : "4.5";
      const reviewCount = place.user_ratings_total || Math.floor(Math.random() * 200 + 50);
      const address = place.formatted_address || city;
      const placeId = place.place_id;
      
      return {
        name,
        category: categoryKey,
        city,
        rating,
        reviewCount,
        address,
        googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        priceRange: getDeterministicPrice(name, rating, categoryKey),
        website: null,
        source: 'Google Places API'
      };
    });

    // Ensure we have at least 5 vendors by padding with fallback if necessary
    if (normalizedVendors.length < 5) {
      const fallback = getCuratedVendors(city, categoryKey);
      for (let i = normalizedVendors.length; i < 5; i++) {
        if (fallback[i]) normalizedVendors.push(fallback[i]);
      }
    }

    return normalizedVendors;

  } catch (error) {
    console.error("[Places API] Error:", error.message);
    return getCuratedVendors(city, categoryKey);
  }
}

module.exports = { fetchLiveMarketData };
