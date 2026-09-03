const fs = require('fs');
const path = require('path');

console.log('Running postbuild: checking export & standalone assets...');

const standaloneDir = path.join(__dirname, '../.next/standalone');
const staticDir = path.join(__dirname, '../.next/static');
const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(standaloneDir)) {
  const targetStaticDir = path.join(standaloneDir, '.next/static');
  const targetPublicDir = path.join(standaloneDir, 'public');

  if (fs.existsSync(staticDir)) {
    fs.cpSync(staticDir, targetStaticDir, { recursive: true, force: true });
    console.log('Copied .next/static to standalone folder.');
  }

  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, targetPublicDir, { recursive: true, force: true });
    console.log('Copied public folder to standalone folder.');
  }
}

console.log('Postbuild asset processing completed successfully!');
