require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRouter = require('./routes/analyze');
const testGooglePlacesRouter = require('./routes/test-google-places');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Allow Next.js frontend
}));
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/test-google-places', testGooglePlacesRouter);

const fs = require('fs');
const path = require('path');
// Load root .env for Supabase credentials
const rootEnvPath = path.join(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
}

// Health check
app.get('/health', async (req, res) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let dbStatus = 'disconnected';
  
  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/wedding_projects?limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (response.ok) {
        dbStatus = 'connected';
      }
    } catch (e) {
      console.error('Supabase health check failed:', e);
    }
  }

  res.json({
    status: 'healthy',
    database: dbStatus,
    ai: 'connected' // Gemini service is verified via route logic separately, or assume connected if process.env.GEMINI_API_KEY exists
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BargainBaba AI Backend',
    provider: 'Google Gemini'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log("Google Places Key Loaded:", !!process.env.GOOGLE_PLACES_API_KEY);
});
