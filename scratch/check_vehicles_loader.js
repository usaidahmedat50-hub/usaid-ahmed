const path = require('path');
// Check if supabase or static seed is used in vehicles.ts
const fs = require('fs');
const content = fs.readFileSync('src/lib/vehicles.ts', 'utf8');
console.log(content.slice(0, 500));
