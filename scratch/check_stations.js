const fs = require('fs');
const content = fs.readFileSync('src/lib/data/stations.ts', 'utf8');

const targetStations = [
  'A-Charge Bhera South',
  'A-Charge Bhera North',
  'Indigost Kallar Kahar',
  'Plug Point Kallar Kahar',
  'Indigost Chakri',
  'Indigost Sial',
  'PSO Bhera',
  'Abdul Hakim M-4',
  'Attock Painsra M-4',
  'Attock Hakla M-1',
  'Rashakai M-1',
  'Ali Baba Nooriabad M-9',
  'Al-Madina M-9',
  'ABB Shell M-9',
  'Zahir Pir M-5',
  'PSO Multan Service Area',
  'PSO Moro N-5',
  'PSO Bedal Sukkur',
  'PSO Wadu Wah Hyderabad',
  'Go Green Mall of Lahore',
  'Shell Shami Rd',
  'Euro-18',
  'Caltex Estate Ave',
  'Flash Gulshan',
  'GO Libra',
  'Tesla Industries I-10/3',
  'Attock Blue Area',
  'Centaurus'
];

targetStations.forEach(s => {
  const found = content.toLowerCase().includes(s.toLowerCase());
  console.log(`${s}: ${found ? 'FOUND' : 'MISSING'}`);
});
