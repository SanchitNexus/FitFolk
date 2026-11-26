// ============================================================
// FitFolk Cloudflare Quick Tunnel Manager
// 100% Free - Accessible from Any Network & Mobile 4G/5G Worldwide
// ============================================================
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXE_PATH = path.resolve(__dirname, 'cloudflared.exe');
const TUNNEL_FILE = path.resolve(__dirname, 'tunnel-url.json');

if (!fs.existsSync(EXE_PATH)) {
  console.error('[FitFolk Tunnel] Error: cloudflared.exe not found at', EXE_PATH);
  process.exit(1);
}

console.log('⚡ Launching encrypted Cloudflare Quick Tunnel on port 5173...');

const proc = spawn(EXE_PATH, ['tunnel', '--url', 'http://127.0.0.1:5173', '--no-autoupdate'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let detectedUrl = '';

function handleOutput(data) {
  const text = data.toString();
  // Match Cloudflare trycloudflare URL
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !detectedUrl) {
    detectedUrl = match[0];
    fs.writeFileSync(TUNNEL_FILE, JSON.stringify({ url: detectedUrl }, null, 2), 'utf-8');

    console.log('\n================================================================');
    console.log('\x1b[32m\x1b[1m🌍 FITFOLK IS NOW LIVE WORLDWIDE (ANY NETWORK / 4G / 5G)!\x1b[0m');
    console.log('================================================================');
    console.log(`\x1b[36mPublic Website:   \x1b[1m${detectedUrl}/\x1b[0m`);
    console.log(`\x1b[33mQR Scan & Join:   \x1b[1m${detectedUrl}/join\x1b[0m`);
    console.log('================================================================');
    console.log('Anyone, sitting in ANY corner of the world on ANY network, can scan');
    console.log('the QR code or open this link to create a profile and see it sync live!');
    console.log('Keep this window open while demonstrating.\n');
  }
}

proc.stdout.on('data', handleOutput);
proc.stderr.on('data', handleOutput);

proc.on('close', (code) => {
  if (fs.existsSync(TUNNEL_FILE)) {
    try { fs.unlinkSync(TUNNEL_FILE); } catch {}
  }
  console.log(`[FitFolk Tunnel] Closed (code ${code})`);
});

process.on('SIGINT', () => {
  proc.kill();
  if (fs.existsSync(TUNNEL_FILE)) {
    try { fs.unlinkSync(TUNNEL_FILE); } catch {}
  }
  process.exit(0);
});
