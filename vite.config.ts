import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * FitFolk Local Network Sync Plugin
 * Allows multiple devices (laptops, phones via QR code) on the same Wi-Fi
 * to synchronize user signups, profiles, and posts in real time without paid cloud services!
 */
function localSyncPlugin(): Plugin {
  const DATA_FILE = path.resolve(__dirname, 'server-data.json');

  function loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[FitFolk Sync] Error loading server-data.json', e);
    }
    return { users: [], posts: [] };
  }

  function saveData(data: any) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[FitFolk Sync] Error saving server-data.json', e);
    }
  }

  // Active SSE clients
  const sseClients = new Set<any>();

  function broadcast(event: { type: string; [key: string]: any }) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch {
        sseClients.delete(client);
      }
    }
  }

  return {
    name: 'fitfolk-local-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        const url = req.url?.split('?')[0];

        // Static file server for user-uploaded photos and reels in public/uploads
        if (url && url.startsWith('/uploads/')) {
          const fileName = path.basename(url);
          const filePath = path.resolve(__dirname, 'public', 'uploads', fileName);
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.mp4': 'video/mp4',
              '.webm': 'video/webm',
              '.mov': 'video/quicktime',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000',
              'Access-Control-Allow-Origin': '*',
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }

        // 0. GET /api/tunnel (Returns active public tunnel URL if any)
        if (url === '/api/tunnel' && req.method === 'GET') {
          const tunnelFile = path.resolve(__dirname, 'tunnel-url.json');
          let tunnelUrl = '';
          if (fs.existsSync(tunnelFile)) {
            try {
              const parsed = JSON.parse(fs.readFileSync(tunnelFile, 'utf-8'));
              tunnelUrl = parsed.url || '';
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ url: tunnelUrl }));
          return;
        }

        // 1. Real-time Server-Sent Events stream
        if (url === '/api/events' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });
          res.write(`data: ${JSON.stringify({ type: 'connected', clientsCount: sseClients.size + 1 })}\n\n`);
          sseClients.add(res);

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        // 2. GET /api/users
        if (url === '/api/users' && req.method === 'GET') {
          const data = loadData();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ users: data.users || [] }));
          return;
        }

        // 3. POST /api/users (Create new profile from phone or PC)
        if (url === '/api/users' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const newUser = JSON.parse(body);
              const data = loadData();
              data.users = data.users || [];
              const idx = data.users.findIndex(
                (u: any) => u.id === newUser.id || u.username === newUser.username
              );
              if (idx >= 0) {
                data.users[idx] = { ...data.users[idx], ...newUser };
              } else {
                data.users.push(newUser);
              }
              saveData(data);
              broadcast({ type: 'user_registered', user: newUser });
              console.log(
                `\x1b[32m[FitFolk Sync Server] New user registered: @${newUser.username} (${newUser.displayName})\x1b[0m`
              );

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, user: newUser }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid user payload' }));
            }
          });
          return;
        }

        // 4. POST /api/users/update
        if (url === '/api/users/update' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { userId, updates } = JSON.parse(body);
              const data = loadData();
              data.users = data.users || [];
              const idx = data.users.findIndex((u: any) => u.id === userId);
              if (idx >= 0) {
                data.users[idx] = { ...data.users[idx], ...updates };
                saveData(data);
                broadcast({ type: 'user_updated', userId, updates });
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid update payload' }));
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
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const newPost = JSON.parse(body);
              const data = loadData();
              data.posts = data.posts || [];
              data.posts.unshift(newPost);
              saveData(data);
              broadcast({ type: 'post_created', post: newPost });
              console.log(
                `\x1b[34m[FitFolk Sync Server] New post published: ${newPost.caption?.slice(0, 30)}...\x1b[0m`
              );

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, post: newPost }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid post payload' }));
            }
          });
          return;
        }

        // 6b. POST /api/posts/delete (Delete post across all devices)
        if (url === '/api/posts/delete' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { postId } = JSON.parse(body);
              const data = loadData();
              data.posts = data.posts || [];
              data.posts = data.posts.filter((p: any) => p.id !== postId);
              saveData(data);
              broadcast({ type: 'post_deleted', postId });
              console.log(`\x1b[33m[FitFolk Sync Server] Post deleted: ${postId}\x1b[0m`);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, postId }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid delete payload' }));
            }
          });
          return;
        }

        // 6c. POST /api/posts/archive (Archive / Unarchive post)
        if (url === '/api/posts/archive' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { postId, isArchived } = JSON.parse(body);
              const data = loadData();
              data.posts = data.posts || [];
              const post = data.posts.find((p: any) => p.id === postId);
              if (post) {
                post.isArchived = isArchived;
                saveData(data);
              }
              broadcast({ type: 'post_archived', postId, isArchived });
              console.log(`\x1b[35m[FitFolk Sync Server] Post archived (${isArchived}): ${postId}\x1b[0m`);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, postId, isArchived }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid archive payload' }));
            }
          });
          return;
        }

        // 7. POST /api/upload (Upload photo/video reels to public/uploads)
        if (url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { name, data: dataUrl } = JSON.parse(body);
              if (!dataUrl) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing data URL' }));
                return;
              }

              // Extract base64
              const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              if (!matches || matches.length !== 3) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid base64 payload' }));
                return;
              }

              const buffer = Buffer.from(matches[2], 'base64');
              const sanitizedName = (name || 'upload.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
              const fileName = `${Date.now()}-${sanitizedName}`;
              const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const filePath = path.resolve(uploadsDir, fileName);
              fs.writeFileSync(filePath, buffer);

              const publicUrl = `/uploads/${fileName}`;
              console.log(`\x1b[32m[FitFolk Media Server] Saved user file: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)\x1b[0m`);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, url: publicUrl }));
            } catch (err) {
              console.error('[FitFolk Upload Error]', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Upload processing failed' }));
            }
          });
          return;
        }

        // 8. POST /api/follow (Follow / Unfollow synchronization)
        if (url === '/api/follow' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { followerId, followingId, isFollowing } = JSON.parse(body);
              broadcast({ type: 'follow_toggled', followerId, followingId, isFollowing });
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid follow payload' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localSyncPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
    watch: {
      ignored: ['**/*.exe', '**/server-data.json', '**/*tunnel-url.json', '**/public/uploads/**'],
    },
    proxy: {
      '/api/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
});
