const fs = require('fs');
const content = fs.readFileSync('src/lib/data/stations.ts', 'utf8');
const idMatches = content.match(/id:\s*'[^']+'/g) || [];
console.log('Total id matches in stations.ts:', idMatches.length);

const jsonContent = JSON.parse(fs.readFileSync('public/data/stations.json', 'utf8'));
console.log('Total stations in public/data/stations.json:', jsonContent.length);
