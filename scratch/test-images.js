const fs = require('fs');

const vehicles = JSON.parse(fs.readFileSync('data/vehicles.json', 'utf8'));

async function testAll() {
  console.log('Testing ' + vehicles.length + ' vehicle imageUrls against http://localhost:3000 ...');
  let ok = 0;
  let failed = [];

  for (const v of vehicles) {
    const url = 'http://localhost:3000' + v.imageUrl;
    try {
      const res = await fetch(url);
      const ct = res.headers.get('content-type') || '';
      const cl = res.headers.get('content-length') || '';
      if (res.status === 200 && !ct.includes('text/html')) {
        console.log('✓ OK: [' + v.id + '] ' + v.imageUrl + ' (' + cl + ' bytes, ' + ct + ')');
        ok++;
      } else {
        console.log('✗ FAIL: [' + v.id + '] ' + v.imageUrl + ' (status: ' + res.status + ', type: ' + ct + ')');
        failed.push({ name: v.name, id: v.id, url: v.imageUrl, status: res.status, ct: ct });
      }
    } catch (e) {
      console.log('✗ ERROR: [' + v.id + '] ' + v.imageUrl + ' (' + e.message + ')');
      failed.push({ name: v.name, id: v.id, url: v.imageUrl, error: e.message });
    }
  }

  console.log('\n--- Summary: ' + ok + ' OK, ' + failed.length + ' FAILED ---');
  if (failed.length > 0) {
    console.log('Failed items:');
    failed.forEach(f => console.log('  - ' + f.id + ': ' + f.url + ' (status: ' + f.status + ')'));
  }
}

testAll();
