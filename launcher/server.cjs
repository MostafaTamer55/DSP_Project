#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ==============================
// DSP Platform — Launcher Server
// ==============================
// Serves the built React app (dist/) and opens the browser automatically.
// Packaged into a standalone EXE via `pkg`.

const PORT = 5173;

// Determine where the dist folder is:
// - When running as a packaged EXE (via pkg), look next to the EXE file
// - When running as a plain Node script, look one level up (project root)
const isPackaged = typeof process.pkg !== 'undefined';
const baseDir = isPackaged
  ? path.dirname(process.execPath)   // next to the .exe
  : path.join(__dirname, '..'); // project root (m:\DSP\Frontend_Project)
const distPath = path.join(baseDir, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  // Strip query string
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distPath, urlPath);

  // If directory, try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback: always serve index.html for client-side routing
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('DSP Platform: dist/index.html not found. Please rebuild the project.');
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n🚀 DSP Learning Platform running at ${url}\n`);

  // Open default browser
  let openCmd;
  if (process.platform === 'win32') {
    openCmd = `start "" "${url}"`;
  } else if (process.platform === 'darwin') {
    openCmd = `open "${url}"`;
  } else {
    openCmd = `xdg-open "${url}"`;
  }

  exec(openCmd, (err) => {
    if (err) console.warn('Could not auto-open browser:', err.message);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use. Close any other process using it and try again.\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
