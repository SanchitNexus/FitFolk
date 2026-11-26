import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Download,
  Check,
  Smartphone,
  Sparkles,
  ExternalLink,
  Wifi,
  Globe,
  Radio,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import Modal from './Modal';
import { useToast } from '../../app/providers/ToastContext';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NetworkMode = 'worldwide' | 'wifi' | 'custom';

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('worldwide');
  const [worldwideUrl, setWorldwideUrl] = useState<string>('');
  const detectedWifi =
    window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? `${window.location.origin}/join`
      : 'http://192.168.1.38:5173/join';
  const [wifiUrl, setWifiUrl] = useState<string>(detectedWifi);
  const [tunnelPassword] = useState<string>('45.118.156.246');
  const [customUrl, setCustomUrl] = useState<string>(`${window.location.origin}/join`);
  const [isTunnelActive, setIsTunnelActive] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Check if a global tunnel is running on /api/tunnel
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/tunnel')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.url) {
          setWorldwideUrl(`${data.url}/join`);
          setIsTunnelActive(true);
        } else {
          setIsTunnelActive(false);
          // Default placeholder or suggested link
          if (!worldwideUrl) {
            setWorldwideUrl('https://fitfolk-live.trycloudflare.com/join');
          }
        }
      })
      .catch(() => {
        setIsTunnelActive(false);
      });
  }, [isOpen]);

  // Determine active target URL based on mode
  const currentTargetUrl =
    networkMode === 'worldwide'
      ? worldwideUrl || 'https://fitfolk-live.trycloudflare.com/join'
      : networkMode === 'wifi'
      ? wifiUrl
      : customUrl;

  // Generate QR code whenever the target URL or modal open state changes
  useEffect(() => {
    if (!isOpen || !currentTargetUrl) return;

    QRCode.toDataURL(currentTargetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#262626', // Instagram deep charcoal
        light: '#FFFFFF', // Clean white background for highest optical contrast
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, currentTargetUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTargetUrl).then(
      () => {
        setCopied(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2500);
      },
      () => {
        showToast('Failed to copy link', 'error');
      }
    );
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `fitfolk_join_qr_code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    showToast('QR Code image downloaded!', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FitFolk Registration QR Code" size="md">
      <div className="space-y-3.5 text-xs text-center">
        {/* Network Mode Switcher */}
        <div className="flex items-center justify-center p-1 bg-brand-elevated border border-brand-border/80 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setNetworkMode('worldwide')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all text-xs ${
              networkMode === 'worldwide'
                ? 'bg-brand-accent text-black font-bold shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide (4G/5G)</span>
            {isTunnelActive && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setNetworkMode('wifi')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all text-xs ${
              networkMode === 'wifi'
                ? 'bg-brand-accent text-black font-bold shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Same Wi-Fi</span>
          </button>

          <button
            type="button"
            onClick={() => setNetworkMode('custom')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all text-xs ${
              networkMode === 'custom'
                ? 'bg-brand-accent text-black font-bold shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Custom / Cloud</span>
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-brand-text-secondary">
          <span className="inline-flex items-center gap-1.5 text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Sync Server Active
          </span>
          <span>•</span>
          <span>
            {networkMode === 'worldwide'
              ? 'Accessible from ANY network or mobile data globally'
              : networkMode === 'wifi'
              ? 'Accessible to devices on this Wi-Fi network'
              : 'Custom public domain or deployed cloud instance'}
          </span>
        </div>

        {/* QR Code Presentation Frame */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl max-w-[260px] mx-auto border-4 border-[#0095F6] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-sm">
              <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center">
              <span className="font-black text-xl tracking-tight text-[#101010]">Fit</span>
              <span className="font-black text-xl tracking-tight text-[#65A30D]">folk</span>
            </div>
          </div>

          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Scan to join FitFolk"
              className="w-48 h-48 rounded-lg shadow-inner"
            />
          ) : (
            <div className="w-48 h-48 bg-neutral-100 rounded-lg animate-pulse flex items-center justify-center text-neutral-400">
              Generating QR...
            </div>
          )}

          <span className="text-[11px] font-bold text-[#101010] mt-2 block">
            Scan with Phone Camera
          </span>
          <span className="text-[9px] text-neutral-500 font-medium">
            {networkMode === 'worldwide'
              ? 'Works from anywhere in the world on mobile data'
              : 'Works instantly on your local network'}
          </span>
        </div>

        {/* Mode-Specific Destination URL Bar */}
        <div className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-brand-text-primary block text-[11px]">
              {networkMode === 'worldwide'
                ? '🌍 Worldwide Public Destination URL:'
                : networkMode === 'wifi'
                ? '🏠 Local Wi-Fi Destination URL:'
                : '☁️ Custom Destination URL:'}
            </label>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-[#0095F6] hover:underline text-[10px] flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showGuide ? 'Hide Guide' : 'How does worldwide sync work?'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {networkMode === 'worldwide' ? (
              <input
                type="text"
                value={worldwideUrl}
                onChange={(e) => setWorldwideUrl(e.target.value)}
                placeholder="e.g. https://xyz.trycloudflare.com/join or https://fitfolk.loca.lt/join"
                className="input-field text-xs py-1.5 flex-1 select-all font-mono"
              />
            ) : networkMode === 'wifi' ? (
              <input
                type="text"
                value={wifiUrl}
                readOnly
                className="input-field text-xs py-1.5 flex-1 select-all font-mono opacity-80"
              />
            ) : (
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. https://my-fitfolk.vercel.app/join"
                className="input-field text-xs py-1.5 flex-1 select-all font-mono"
              />
            )}

            <button
              onClick={handleCopy}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 shrink-0 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Localtunnel Password Reminder Callout */}
          {networkMode === 'worldwide' && (
            <div className="mt-2 p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] text-blue-400 font-semibold block">
                  🔑 Localtunnel Password (if prompted on phone):
                </span>
                <span className="font-mono text-xs font-bold text-brand-text-primary">
                  {tunnelPassword}
                </span>
                <span className="text-[9px] text-brand-text-secondary block">
                  (Enter once on phone and tap Submit to load FitFolk)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(tunnelPassword);
                  showToast('Tunnel password copied!', 'success');
                }}
                className="btn-secondary text-[10px] px-2.5 py-1.5 flex items-center gap-1 font-semibold shrink-0"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Password</span>
              </button>
            </div>
          )}
        </div>

        {/* Expandable Teacher / Worldwide Guide */}
        {showGuide && (
          <div className="p-3 bg-brand-elevated border border-brand-border rounded-xl text-left text-[11px] space-y-2 text-brand-text-secondary">
            <div className="font-bold text-brand-text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>How Anyone from ANY Network Joins (Zero Cost):</span>
            </div>
            <p className="leading-relaxed">
              When a user is on mobile cellular data (4G/5G) or another Wi-Fi, their phone cannot reach local private IPs (like <code className="bg-brand-surface px-1 py-0.5 rounded text-brand-accent">10.x.x.x</code>).
            </p>
            <div className="space-y-1">
              <strong className="text-brand-text-primary block">Option 1: 1-Click Free Tunnel (Keep server on laptop)</strong>
              <p>Run this command in a terminal to get an instant worldwide HTTPS link:</p>
              <div className="bg-brand-surface p-2 rounded-lg font-mono text-[10px] text-brand-accent flex items-center justify-between border border-brand-border/60">
                <span>npm run tunnel</span>
                <span className="text-neutral-400 text-[9px]">100% Free / No Account</span>
              </div>
              <p className="text-[10px]">
                Paste the resulting <code className="text-brand-text-primary">https://...</code> link above. Anyone anywhere in the world can scan the QR code and their new profile will instantly pop up on your laptop!
              </p>
            </div>
            <div className="space-y-1 pt-1 border-t border-brand-border/50">
              <strong className="text-brand-text-primary block">Option 2: Free 24/7 Cloud Hosting (Vercel / Netlify)</strong>
              <p className="text-[10px]">
                Deploy to Vercel (<code className="text-brand-text-primary">vercel</code>) for a permanent <code className="text-brand-text-primary">fitfolk.vercel.app</code> URL that runs 24/7 without needing your laptop powered on.
              </p>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-brand-text-secondary">
              Target: <span className="text-brand-accent font-semibold">{networkMode.toUpperCase()}</span>
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 font-bold ml-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR Code Image</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
