const fs = require('fs');
const content = fs.readFileSync('src/data/seed-data.ts', 'utf8');

const regex = /slug:\s*'([^']+)'/g;
let match;
const slugs = [];
while ((match = regex.exec(content)) !== null) {
  slugs.push(match[1]);
}
console.log('Total slugs found:', slugs.length);
console.log('Slugs list:', slugs);
