const fs = require('fs');
const content = fs.readFileSync('src/lib/data/stations.ts', 'utf8');

const regex = /name:\s*'([^']+)'/g;
let match;
const names = [];
while ((match = regex.exec(content)) !== null) {
  names.push(match[1]);
}

console.log(`Total stations parsed: ${names.length}`);
['Bhera', 'Kahar', 'Hakla', 'Painsra', 'Rashakai', 'Nooriabad', 'Zahir', 'Moro', 'Sukkur', 'Mall of Lahore', 'Shami', 'Flash', 'Libra', 'Blue Area'].forEach(k => {
  const matches = names.filter(n => n.toLowerCase().includes(k.toLowerCase()));
  console.log(`\nKeyword "${k}":`);
  matches.forEach(m => console.log(`  - ${m}`));
});
