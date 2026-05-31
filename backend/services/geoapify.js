async function getCityPlaceId(city, apiKey) {
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?city=${encodeURIComponent(city)}&format=json&apiKey=${apiKey}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].place_id;
    }
    return null;
  } catch (error) {
    console.error('[Geoapify] Geocoding error:', error.message);
    return null;
  }
}

function getGeoapifyCategory(category) {
  const cat = category.toLowerCase();
  if (cat.includes('venue')) return 'accommodation.hotel,commercial.event_space';
  if (cat.includes('photographer')) return 'service.photographic';
  if (cat.includes('caterer')) return 'catering';
  if (cat.includes('decorator')) return 'commercial.florist';
  if (cat.includes('makeup')) return 'commercial.health_and_beauty.beauty_salon';
  return 'commercial'; // fallback
}

function getDeterministicMetrics(name, categoryKey) {
  const basePrices = {
    'venues': 2500,
    'decorators': 120000,
    'caterers': 1800,
    'photographers': 90000,
    'makeup': 25000
  };
  
  const base = basePrices[categoryKey] || 50000;
  
  // Use string length to add pseudo-random variation
  const nameLen = (name || "vendor").length;
  const rating = (4.0 + (nameLen % 10) * 0.1).toFixed(1); // 4.0 to 4.9
  const reviewCount = 50 + (nameLen * 7) % 300;
  
  const ratingMultiplier = 1 + ((parseFloat(rating) - 4.0) * 0.2); 
  const variation = 1 + ((nameLen % 20) - 10) / 100;
  
  const priceRange = Math.round(base * ratingMultiplier * variation);

  return { priceRange, rating, reviewCount };
}

/**
 * Searches for vendors using Geoapify Places API.
 * @param {string} city - The city to search in.
 * @param {string} category - The category (venue, photographer, caterer, decorator, makeup_artist).
 * @returns {Promise<Array>} Array of vendor objects.
 */
async function searchVendors(city, category) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  
  if (!apiKey) {
    console.warn(`[Geoapify] Missing GEOAPIFY_API_KEY for ${category} in ${city}.`);
    return [];
  }

  // 1. Resolve city to place_id
  const placeId = await getCityPlaceId(city, apiKey);
  if (!placeId) {
    console.warn(`[Geoapify] Could not resolve place_id for city: ${city}`);
    return [];
  }

  // 2. Map standard category to Geoapify category
  const geoCategory = getGeoapifyCategory(category);

  // 3. Search Places
  const url = `https://api.geoapify.com/v2/places?categories=${geoCategory}&filter=place:${placeId}&limit=10&apiKey=${apiKey}`;

  if (category.toLowerCase() === 'venues' || category.toLowerCase() === 'venue') {
    console.log("VENUE REQUEST URL", url.replace(apiKey, "HIDDEN_KEY"));
    console.log("VENUE REQUEST PARAMS", { geoCategory, placeId, limit: 10 });
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Geoapify] Request failed (${response.status}) for ${category}`);
      if (category.toLowerCase() === 'venues' || category.toLowerCase() === 'venue') {
        console.error("GEOAPIFY VENUE ERROR BODY:", errorText);
      }
      return [];
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }

    // 4. Map to requested format
    return data.features.map(feature => {
      const props = feature.properties;
      const vendorName = props.name || props.address_line1 || 'Unnamed Vendor';
      const metrics = getDeterministicMetrics(vendorName, category);
      
      return {
        name: vendorName,
        category: category,
        address: props.formatted || `${props.address_line1}, ${props.address_line2}`,
        rating: metrics.rating,
        reviewCount: metrics.reviewCount,
        priceRange: metrics.priceRange,
        source: "Geoapify",
        latitude: props.lat,
        longitude: props.lon,
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lon}`
      };
    });

  } catch (error) {
    console.error(`[Geoapify] Error searching vendors for ${category}:`, error.message);
    return [];
  }
}

module.exports = { searchVendors };
