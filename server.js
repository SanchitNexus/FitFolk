// ============================================================
// FitFolk Production & Local Sync Server
// Pure Node.js - 0 external dependencies - 100% Free
// ============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_FILE = path.resolve(__dirname, 'server-data.json');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return { users: [], posts: [] };
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

const sseClients = new Set();

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // 1. Real-time events SSE
  if (url === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', clientsCount: sseClients.size + 1 })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // 2. GET /api/users
  if (url === '/api/users' && req.method === 'GET') {
    const data = loadData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: data.users || [] }));
    return;
  }

  // 3. POST /api/users
  if (url === '/api/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newUser = JSON.parse(body);
        const data = loadData();
        data.users = data.users || [];
        const idx = data.users.findIndex(u => u.id === newUser.id || u.username === newUser.username);
        if (idx >= 0) {
          data.users[idx] = { ...data.users[idx], ...newUser };
        } else {
          data.users.push(newUser);
        }
        saveData(data);
        broadcast({ type: 'user_registered', user: newUser });
        console.log(`[Sync] Registered: @${newUser.username}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: newUser }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user' }));
      }
    });
    return;
  }

  // 4. POST /api/users/update
  if (url === '/api/users/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { userId, updates } = JSON.parse(body);
        const data = loadData();
        data.users = data.users || [];
        const idx = data.users.findIndex(u => u.id === userId);
        if (idx >= 0) {
          data.users[idx] = { ...data.users[idx], ...updates };
          saveData(data);
          broadcast({ type: 'user_updated', userId, updates });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid update' }));
      }
    });
    return;
  }

  // 5. GET /api/posts
  if (url === '/api/posts' && req.method === 'GET') {
    const data = loadData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ posts: data.posts || [] }));
    return;
  }

  // 6. POST /api/posts
  if (url === '/api/posts' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newPost = JSON.parse(body);
        const data = loadData();
        data.posts = data.posts || [];
        data.posts.unshift(newPost);
        saveData(data);
        broadcast({ type: 'post_created', post: newPost });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, post: newPost }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid post' }));
      }
    });
    return;
  }

  // Static file serving for SPA
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m[FitFolk Server] Running at http://localhost:${PORT}/\x1b[0m`);
  console.log(`\x1b[36m[FitFolk Server] Local Wi-Fi sync active on 0.0.0.0:${PORT}\x1b[0m`);
});
