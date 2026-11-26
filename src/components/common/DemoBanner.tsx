import { useState } from 'react';
import { X, RefreshCw, ArrowRightLeft, QrCode, LogIn, LogOut, UserPlus, Sun, Moon } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

export default function DemoBanner() {
  const { state, isLoggedIn, logout, resetDemo, switchUser, toggleTheme } = useDemoContext();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (dismissed) return null;

  const currentUser = isLoggedIn ? state.users[state.currentUserId] : null;
  const otherUsers = Object.values(state.users).filter((u) => u.id !== state.currentUserId);

  return (
    <>
      <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white text-xs font-medium py-1.5 px-4 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-black/25 px-1.5 py-0.5 rounded">
              Prototype
            </span>
            <span className="truncate">
              {isLoggedIn ? (
                <>
                  Logged in as <strong>@{currentUser?.username || 'user'}</strong> ({currentUser?.displayName})
                </>
              ) : (
                <span className="text-white font-semibold">Browsing as Guest (Logged Out)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 hover:bg-black/35 transition-colors text-xs font-semibold"
              title={state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {state.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-200" />}
              <span className="hidden sm:inline capitalize">{state.theme} Mode</span>
            </button>

            {/* Share / Scan QR Code Button */}
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 hover:bg-black/35 transition-colors text-xs font-bold"
              title="Show QR Code for phone scan & profile registration"
            >
              <QrCode className="w-3 h-3" />
              <span>Share QR</span>
            </button>

            {isLoggedIn ? (
              <>
                {/* Switch Persona */}
                <div className="relative">
                  <button
                    onClick={() => setShowSwitcher((prev) => !prev)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/15 hover:bg-black/25 transition-colors text-xs font-semibold"
                    aria-label="Switch persona"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span className="hidden sm:inline">Switch Persona</span>
                  </button>

                  {showSwitcher && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSwitcher(false)} />
                      <div className="absolute top-full right-0 mt-1 bg-brand-elevated border border-brand-border rounded-lg shadow-2xl py-1 w-56 z-50 animate-scale-in">
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-brand-text-secondary border-b border-brand-border/60">
                          Switch Demo Persona
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {otherUsers.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => {
                                switchUser(user.id);
                                setShowSwitcher(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-brand-text-primary hover:bg-brand-surface transition-colors flex items-center gap-2"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${user.avatarGradient[0]}, ${user.avatarGradient[1]})`,
                                }}
                              >
                                {user.avatarInitials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold truncate">{user.displayName}</div>
                                <div className="text-[10px] text-brand-text-secondary truncate">
                                  @{user.username} {user.verificationCategory ? `• ${user.verificationCategory.replace('_', ' ')}` : ''}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Log Out */}
                <button
                  onClick={() => {
                    logout();
                    showToast('Logged out of FitFolk', 'info');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/15 hover:bg-black/25 transition-colors text-xs font-bold text-red-950"
                  title="Log Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Log In Button */}
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/25 hover:bg-black/35 transition-colors text-xs font-bold text-black"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Log In</span>
                </button>

                {/* Sign Up Button */}
                <button
                  onClick={() => setShowRegister(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-black text-brand-accent hover:bg-black/90 transition-colors text-xs font-bold"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Sign Up</span>
                </button>
              </>
            )}

            {/* Reset Demo */}
            <button
              onClick={resetDemo}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/15 hover:bg-black/25 transition-colors text-xs font-semibold"
              aria-label="Reset demo"
              title="Restore original seed data"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-black/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
