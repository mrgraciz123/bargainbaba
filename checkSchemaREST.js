const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});
const url = env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/wedding_projects';
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const payload = {
  budget: 1000,
  guests: 100,
  city: 'Test',
  wedding_type: 'Test',
  ai_analysis: {}
};

fetch(url, { 
  method: 'POST',
  headers: { 
    'apikey': key, 
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
