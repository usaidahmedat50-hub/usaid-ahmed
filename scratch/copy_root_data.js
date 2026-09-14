const fs = require('fs');
if (!fs.existsSync('data')) {
  fs.mkdirSync('data', { recursive: true });
}
fs.copyFileSync('public/data/stations.json', 'data/stations.json');
if (fs.existsSync('public/data/vehicles.json')) {
  fs.copyFileSync('public/data/vehicles.json', 'data/vehicles.json');
}
console.log('Copied stations.json and vehicles.json to root data/');
