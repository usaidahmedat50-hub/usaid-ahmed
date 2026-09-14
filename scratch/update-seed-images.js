const fs = require('fs');

const mapping = {
  'byd-seal': '/data/byd-seal.webp',
  'byd-atto-3': '/data/byd-atto-3.webp',
  'deepal-s07': '/data/deepal-s07.webp',
  'deepal-l07': '/data/deepal-l07.webp',
  'honri-ve-2': '/data/honri-ve-2.webp',
  'honri-ve-3-0': '/data/honri-ve-3.webp',
  'gugo-gigi-ev': '/data/gugo-gigi-ev.webp',
  'mg4-ev': '/data/mg4-ev.webp',
  'mg-zs-ev': '/data/mg-zs-ev.webp',
  'mg-hs-phev': '/data/mg-hs-phev.webp',
  'dongfeng-box': '/data/dongfeng-box.webp',
  'omoda-e5': '/data/omoda-e5.webp',
  'kia-ev5': '/data/kia-ev5.webp',
  'mercedes-benz-eqs-suv': '/data/mercedes-eqs-suv.webp',
  'audi-q8-55-etron': '/data/audi-q8-etron.webp',
  'audi-e-tron-50-quattro': '/data/audi-etron-50.webp',
  'bmw-i4-edrive40': '/data/bmw-i4.webp',
  'tesla-model-3': '/data/tesla-model-3.webp',
  'tesla-model-y-standard-range': '/data/tesla-model-y.webp',
  'byd-sealion-7': '/data/byd-sealion-7.webp',
  'chery-tiggo-7-pro-phev': '/data/chery-tiggo-7-phev.webp',
  'chery-tiggo-8-pro-e-plus': '/data/chery-tiggo-8-phev.webp',
  'forthing-friday-reev': '/data/forthing-friday-reev.webp',
  'jaecoo-j7-shs': '/data/jaecoo-j7-shs.webp',
  'changan-nevo-hunter-reev': '/data/changan-nevo-hunter.webp',
  'gwm-haval-h6-hev': '/data/haval-h6-hev.webp',
  'gwm-ora-03': '/data/gwm-ora-03.webp',
  'gac-aion-v': '/data/gac-aion-v.webp',
  'seres-3-ev': '/data/seres-3-ev.webp',
  'jmev-ev3': '/data/jmev-ev3.webp',
  'zeekr-x': '/data/zeekr-x.webp',
  'riddara-rd6': '/data/riddara-rd6.webp'
};

let content = fs.readFileSync('src/data/seed-data.ts', 'utf8');
let count = 0;

for (const [slug, imgPath] of Object.entries(mapping)) {
  const pattern = new RegExp(`(slug:\\s*['"]${slug}['"][\\s\\S]*?hero_image_url:\\s*)['"][^'"]*['"]`, 'g');
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1'${imgPath}'`);
    count++;
  }
}

fs.writeFileSync('src/data/seed-data.ts', content);
console.log('Successfully updated', count, 'vehicles in src/data/seed-data.ts');
