const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Try selecting one row to see which columns exist
  const { data, error } = await supabase.from('wedding_projects').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  }
  
  if (data && data.length > 0) {
    console.log("Columns found in row:", Object.keys(data[0]));
  } else if (data) {
    console.log("No rows, but query succeeded.");
    // Insert a dummy row with just required fields (maybe just user_id if we had one) or we can just fetch the schema via REST
  }

  // To get columns when table is empty, we can try to query a non-existent column to see the error
  const expectedCols = ['id', 'user_id', 'budget', 'guests', 'city', 'wedding_type', 'venue_type', 'catering', 'ai_analysis', 'created_at', 'updated_at'];
  const missing = [];
  
  for (const col of expectedCols) {
    const { error: colErr } = await supabase.from('wedding_projects').select(col).limit(1);
    if (colErr && colErr.message.includes('Could not find')) {
      missing.push(col);
    }
  }

  console.log("Missing columns:", missing);
}

checkSchema();
