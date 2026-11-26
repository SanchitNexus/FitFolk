import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, QrCode, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import QRCodeModal from '../common/QRCodeModal';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

export default function MobileHeader() {
  const { state, isLoggedIn, logout, toggleTheme } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showQR, setShowQR] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const unreadNotifications = state.notifications.filter((n) => !n.isRead).length;
  const unreadMessages = state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border md:hidden select-none">
        <Link to={isLoggedIn ? '/' : '/login'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-sm border border-brand-border/60">
            <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center">
            <span className="font-black text-2xl tracking-tight text-brand-text-primary">Fit</span>
            <span className="font-black text-2xl tracking-tight text-[#99FF00]">folk</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-elevated transition-colors"
            aria-label="Toggle Theme"
            title={state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {state.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </button>

          {/* QR Code Quick Button */}
          <button
            onClick={() => setShowQR(true)}
            className="p-1.5 rounded-lg text-brand-accent hover:bg-brand-elevated transition-colors"
            aria-label="Scan / Share QR"
            title="Scan QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>

          {/* Authenticated Notifications & Messages */}
          {isLoggedIn ? (
            <>
              <Link
                to="/notifications"
                className="relative p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand-error text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              <Link
                to="/messages"
                className="relative p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface transition-colors"
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand-accent text-brand-bg text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

              <button
                onClick={() => {
                  logout();
                  showToast('Logged out of your profile', 'info');
                  navigate('/login');
                }}
                className="p-1.5 rounded-lg text-brand-error hover:bg-brand-error/10 transition-colors ml-1"
                aria-label="Log out"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-xs px-3 py-1 font-bold ml-1 rounded-lg"
            >
              Log In
            </Link>
          )}
        </div>
      </header>

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
