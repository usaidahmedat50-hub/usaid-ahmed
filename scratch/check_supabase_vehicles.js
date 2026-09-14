const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2 && !parts[0].startsWith('#')) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', url ? 'Defined' : 'Missing');

if (url && key) {
  fetch(`${url}/rest/v1/vehicles?select=id,name,slug,body_type,powertrain,brand_id`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) {
      console.log(`Supabase returned ${data.length} vehicles:`);
      data.forEach(v => console.log(`- ${v.slug} | ${v.name} | ${v.powertrain} | ${v.body_type}`));
    } else {
      console.log('Response:', data);
    }
  })
  .catch(err => console.error('Fetch error:', err));
}
