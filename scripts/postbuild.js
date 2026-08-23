const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Running postbuild: copying public and .next/static into .next/standalone...');
  
  // 1. Copy public -> .next/standalone/public
  const publicSrc = path.join(__dirname, '..', 'public');
  const publicDest = path.join(__dirname, '..', '.next', 'standalone', 'public');
  copyDirSync(publicSrc, publicDest);

  // 2. Copy .next/static -> .next/standalone/.next/static
  const staticSrc = path.join(__dirname, '..', '.next', 'static');
  const staticDest = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static');
  copyDirSync(staticSrc, staticDest);

  console.log('Postbuild asset copying completed successfully!');
} catch (error) {
  console.error('Error during postbuild script execution:', error);
}
