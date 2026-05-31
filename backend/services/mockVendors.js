// Curated fallback dataset when Google Places API fails or returns no results
const mockVendors = {
  Venue: [
    { name: "The Grand Regal Banquet", rating: "4.8", reviewCount: 452, address: "Central District, Main Road", priceRange: 3500 },
    { name: "Emerald Gardens & Lawns", rating: "4.6", reviewCount: 310, address: "West End, Near Metro", priceRange: 2800 },
    { name: "The Imperial Palace", rating: "4.9", reviewCount: 890, address: "Luxury Lane, South City", priceRange: 5500 },
    { name: "Sunset Valley Resorts", rating: "4.5", reviewCount: 220, address: "Highway 12, Suburbs", priceRange: 2200 },
    { name: "Crystal Ballroom Hotel", rating: "4.7", reviewCount: 560, address: "Downtown City Center", priceRange: 4000 }
  ],
  Decoration: [
    { name: "Elite Florals & Decor", rating: "4.7", reviewCount: 280, address: "Market Area", priceRange: 150000 },
    { name: "Royal Weddings Decorators", rating: "4.9", reviewCount: 512, address: "Heritage Street", priceRange: 250000 },
    { name: "Petals & Promises", rating: "4.5", reviewCount: 145, address: "New City Link Road", priceRange: 90000 },
    { name: "The Dream Theme Makers", rating: "4.8", reviewCount: 340, address: "Creative Hub", priceRange: 180000 },
    { name: "Classic Stage Designs", rating: "4.6", reviewCount: 198, address: "Industrial Area Phase 1", priceRange: 120000 }
  ],
  Catering: [
    { name: "Gourmet Delights Catering", rating: "4.8", reviewCount: 620, address: "Food Street", priceRange: 1800 },
    { name: "Royal Feast Caterers", rating: "4.9", reviewCount: 850, address: "Culinary Avenue", priceRange: 2500 },
    { name: "Spice Route Events", rating: "4.6", reviewCount: 310, address: "Old City Kitchens", priceRange: 1500 },
    { name: "The Grand Buffet Co.", rating: "4.7", reviewCount: 445, address: "Metro Park Road", priceRange: 2100 },
    { name: "Premium Plates Catering", rating: "4.5", reviewCount: 190, address: "Suburban Complex", priceRange: 1200 }
  ],
  Photography: [
    { name: "Cinematic Wedding Studios", rating: "4.9", reviewCount: 420, address: "Studio Lane", priceRange: 150000 },
    { name: "Moments Captured", rating: "4.8", reviewCount: 380, address: "Artisan District", priceRange: 120000 },
    { name: "The Wedding Lens", rating: "4.6", reviewCount: 210, address: "South View Plaza", priceRange: 80000 },
    { name: "Candid Tales Photography", rating: "4.7", reviewCount: 295, address: "Central Mall Road", priceRange: 95000 },
    { name: "Visual Memoirs", rating: "4.5", reviewCount: 150, address: "North Avenue", priceRange: 70000 }
  ],
  'Makeup Artist': [
    { name: "Glamour Queen Studio", rating: "4.9", reviewCount: 510, address: "Fashion Street", priceRange: 35000 },
    { name: "Bridal Glow by Sarah", rating: "4.8", reviewCount: 340, address: "Beauty Hub", priceRange: 25000 },
    { name: "The Flawless Face", rating: "4.7", reviewCount: 280, address: "Downtown Complex", priceRange: 30000 },
    { name: "Elite Bridal Makeovers", rating: "4.6", reviewCount: 190, address: "Westside Plaza", priceRange: 20000 },
    { name: "Radiant Brides", rating: "4.5", reviewCount: 125, address: "South Market", priceRange: 15000 }
  ]
};

function getCuratedVendors(city, category) {
  // Normalize category key
  let key = category;
  if (category.includes('Venue')) key = 'Venue';
  else if (category.includes('Decor')) key = 'Decoration';
  else if (category.includes('Cater')) key = 'Catering';
  else if (category.includes('Photo')) key = 'Photography';
  else if (category.includes('Makeup')) key = 'Makeup Artist';

  const vendors = mockVendors[key] || mockVendors['Venue'];
  
  return vendors.map(v => ({
    name: v.name,
    category: key,
    city: city,
    rating: v.rating,
    reviewCount: v.reviewCount,
    address: `${v.address}, ${city}`,
    priceRange: v.priceRange,
    googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + ' ' + city)}`,
    source: 'Curated Local Dataset'
  }));
}

module.exports = { getCuratedVendors };
