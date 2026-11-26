import { useState } from 'react';
import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { BookOpen, QrCode, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';
import RightSidebar from './RightSidebar';
import UserGuideModal from '../../features/guide/UserGuideModal';
import QRCodeModal from '../common/QRCodeModal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { isOwnerDevice } from '../../lib/deviceAuth';

export default function AppLayout() {
  const { state, isLoggedIn, toggleTheme } = useDemoContext();
  const [showGuide, setShowGuide] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const location = useLocation();
  const isOwner = isOwnerDevice();

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/join';

  // ============================================================
  // LOGGED OUT OR AUTH ROUTE STATE:
  // Render clean standalone center view with NO sidebars, NO notifications,
  // NO message icons, and NO bottom navigation!
  // ============================================================
  if (!isLoggedIn || isAuthRoute) {
    // If not logged in and attempting to access private routes, redirect to /login
    if (!isLoggedIn && !isAuthRoute) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans selection:bg-[#0095F6] selection:text-white">
        {/* Minimal clean top header */}
        <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3 border-b border-brand-border/40 bg-brand-bg/95 backdrop-blur-md sticky top-0 z-30 select-none">
          <Link to={isLoggedIn ? '/' : '/login'} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-sm border border-brand-border/60">
              <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center">
              <span className="font-black text-2xl tracking-tight text-brand-text-primary">Fit</span>
              <span className="font-black text-2xl tracking-tight text-[#99FF00]">folk</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => setShowGuide(true)}
                className="text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-elevated hover:bg-brand-surface transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#0095F6]" />
                <span className="hidden sm:inline">User Guide & Passwords</span>
                <span className="sm:hidden">Guide</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-elevated transition-colors"
              title={state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {state.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </header>

        {/* Center Canvas Only (No side panels, no bottom nav) */}
        <main className="flex-1 w-full flex items-center justify-center p-4">
          <Outlet />
        </main>

        {/* User Guide Modal (Owner Only) */}
        {isOwner && <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />}
      </div>
    );
  }

  // ============================================================
  // LOGGED IN STATE:
  // Show full Instagram 3-column layout with left & right panels!
  // ============================================================
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans selection:bg-[#0095F6] selection:text-white">
      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Layout Container */}
      <div className="flex-1 flex justify-center w-full max-w-7xl mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar onOpenGuide={() => setShowGuide(true)} />

        {/* Center Main Scrollable Canvas */}
        <main className="flex-1 min-w-0 max-w-2xl border-r border-brand-border/60 pb-20 md:pb-8 min-h-[calc(100vh-40px)]">
          <Outlet />
        </main>

        {/* Right Recommended & Trends Sidebar */}
        <RightSidebar onOpenGuide={() => setShowGuide(true)} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Action Pills (Desktop / Tablet) - QR Code and Owner Guide */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2">
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0095F6] text-white shadow-xl text-xs font-bold hover:bg-[#1877F2] hover:scale-105 active:scale-95 transition-all"
          title="Open QR Code to invite others"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan / Join QR</span>
        </button>

        {isOwner && (
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-elevated border border-brand-border shadow-lg text-xs font-semibold text-brand-text-primary hover:border-[#0095F6] hover:scale-105 active:scale-95 transition-all"
            title="Open User Guide & Help"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0095F6]" />
            <span>User Guide</span>
          </button>
        )}
      </div>

      {/* FitFolk Platform User Guide Modal (Owner Only) */}
      {isOwner && <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />}

      {/* QR Code Modal */}
      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
}
