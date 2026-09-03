const http = require('http');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'production';
const port = process.env.PORT || 3000;

console.log(`Starting PakevFinder Hostinger Server on port ${port}...`);

const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServerPath)) {
  console.log('Loading Next.js standalone server entrypoint...');
  require(standaloneServerPath);
} else {
  console.log('Fallback to next standard server launcher...');
  const next = require('next');
  const app = next({ dev: false, dir: __dirname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    http.createServer((req, res) => {
      handle(req, res);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> PakevFinder ready on http://localhost:${port}`);
    });
  }).catch((err) => {
    console.error('Failed to initialize Next.js server:', err);
    process.exit(1);
  });
}
