const express = require('express');
const router = express.Router();
const { searchVendors } = require('../services/googlePlaces');

router.get('/', async (req, res) => {
  console.log("====================================");
  console.log("GET /api/test-google-places called");
  console.log("GOOGLE_PLACES_API_KEY Loaded:", !!process.env.GOOGLE_PLACES_API_KEY);
  
  try {
    const city = "Lucknow";
    const category = "venues";
    
    console.log(`Executing search for 'wedding venue in ${city}'...`);
    const vendors = await searchVendors(city, category);
    
    if (!vendors || vendors.length === 0) {
      return res.status(500).json({
        error: "Google Places API returned empty results or failed. Check backend console logs."
      });
    }

    const firstVendor = vendors[0];
    
    return res.json({
      vendorCount: vendors.length,
      firstVendor: {
        name: firstVendor.name,
        rating: firstVendor.rating,
        address: firstVendor.address
      },
      allDiscovered: vendors
    });
    
  } catch (error) {
    console.error("Test Route Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
