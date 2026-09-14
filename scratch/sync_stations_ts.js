const fs = require('fs');

const stationsJson = JSON.parse(fs.readFileSync('public/data/stations.json', 'utf8'));

const tsHeader = `// PakevFinder.com — 118+ Verified Charging Stations Dataset
// Verified coordinates, high-speed DC corridors (M-2, M-4, M-1, M-5, M-9), and urban hubs
import { ChargingStation } from '../types';

export const VERIFIED_PAKISTAN_CHARGING_STATIONS: ChargingStation[] = `;

const tsContent = tsHeader + JSON.stringify(stationsJson, null, 2) + ';\n';
fs.writeFileSync('src/lib/data/stations.ts', tsContent, 'utf8');
console.log(`Updated src/lib/data/stations.ts with ${stationsJson.length} stations.`);
