const fs = require('fs');
const content = fs.readFileSync('src/data/seed-data.ts', 'utf8');
const regex = /id:\s*'veh-([^']+)'/g;
let m;
const list = [];
while ((m = regex.exec(content)) !== null) {
  list.push(m[1]);
}
console.log('Vehicles count:', list.length);
console.log(list);
