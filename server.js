const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'production';

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServerPath)) {
  // Execute Next.js standalone server
  require(standaloneServerPath);
} else {
  // Custom Next.js server fallback
  const { createServer } = require('http');
  const { parse } = require('url');
  const next = require('next');

  const app = next({ dev: false, hostname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> PakEVFinder production server running on http://${hostname}:${port}`);
    });
  });
}