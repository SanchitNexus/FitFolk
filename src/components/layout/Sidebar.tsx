import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, Compass, Film, MessageCircle, Bell, PlusSquare,
  Dumbbell, UtensilsCrossed, HelpCircle, Radio, Bookmark, User,
  Settings, Trophy, Sun, Moon, RotateCcw, Map, ChevronDown, LogOut,
  MoreHorizontal, Users, QrCode, LogIn, UserPlus, Bot, BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import { isOwnerDevice } from '../../lib/deviceAuth';
import Avatar from '../common/Avatar';
import QRCodeModal from '../common/QRCodeModal';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

interface SidebarProps {
  onOpenGuide?: () => void;
}

const mainNav = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/ai-coach', icon: Bot, label: 'AI Coach' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/reels', icon: Film, label: 'Reels' },
  { to: '/messages', icon: MessageCircle, label: 'Messages', badgeKey: 'messages' as const },
  { to: '/notifications', icon: Bell, label: 'Notifications', badgeKey: 'notifications' as const },
  { to: '/create', icon: PlusSquare, label: 'Create' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
  { to: '/community', icon: HelpCircle, label: 'Community' },
  { to: '/live', icon: Radio, label: 'Live' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
];

export default function Sidebar({ onOpenGuide }: SidebarProps) {
  const { state, isLoggedIn, logout, switchUser, toggleTheme, resetDemo, setTourCompleted } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isOwner = isOwnerDevice();

  const [showMore, setShowMore] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const currentUser = isLoggedIn ? state.users[state.currentUserId] : null;
  const unreadNotifications = state.notifications.filter((n) => !n.isRead).length;
  const unreadMessages = state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const getBadge = (key?: 'messages' | 'notifications') => {
    if (key === 'messages' && unreadMessages > 0) return unreadMessages;
    if (key === 'notifications' && unreadNotifications > 0) return unreadNotifications;
    return 0;
  };

  const handleLogout = () => {
    logout();
    setShowMore(false);
    showToast('Logged out of your profile.', 'info');
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-[72px] lg:w-[245px] h-screen sticky top-0 border-r border-brand-border bg-brand-bg p-2 lg:p-3 z-40 select-none">
      {/* Brand Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-3 py-3 mb-2 group">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-md border border-brand-border/60 group-hover:scale-105 transition-transform">
          <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-cover" />
        </div>
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center">
            <span className="font-black text-2xl tracking-tight text-brand-text-primary">Fit</span>
            <span className="font-black text-2xl tracking-tight text-[#99FF00]">folk</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-brand-text-secondary font-semibold -mt-0.5">
            Your fitness. Your people.
          </span>
        </div>
      </NavLink>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto" aria-label="Main navigation">
        {mainNav.map(({ to, icon: Icon, label, badgeKey }) => {
          const badge = getBadge(badgeKey);
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                ${isActive
                  ? 'bg-brand-surface text-brand-text-primary font-semibold'
                  : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary'
                }`
              }
              title={label}
            >
              <div className="relative">
                <Icon className="w-6 h-6 shrink-0" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-error text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="hidden lg:block truncate">{label}</span>
            </NavLink>
          );
        })}

        {/* QR Code Action Item */}
        <button
          onClick={() => setShowQRModal(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-accent hover:bg-brand-surface transition-all duration-150 font-semibold"
          title="Share QR Code"
        >
          <QrCode className="w-6 h-6 shrink-0 text-brand-accent" />
          <span className="hidden lg:block truncate text-brand-accent">Scan / Join QR</span>
        </button>

        {/* Profile Link (if logged in) */}
        {isLoggedIn && currentUser && (
          <NavLink
            to={`/profile/${currentUser.username}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
              ${isActive
                ? 'bg-brand-surface text-brand-text-primary font-semibold'
                : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary'
              }`
            }
            title="Profile"
          >
            <Avatar user={currentUser} size="xs" />
            <span className="hidden lg:block truncate">@{currentUser.username}</span>
          </NavLink>
        )}
        {/* Direct Theme Switcher (Dark / Light Mode) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-text-secondary hover:bg-brand-elevated hover:text-brand-text-primary transition-all duration-150 group w-full text-left"
          title={state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark / Light Theme"
        >
          <div className="relative">
            {state.theme === 'dark' ? (
              <Sun className="w-6 h-6 shrink-0 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-6 h-6 shrink-0 text-indigo-500 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </div>
          <div className="hidden lg:flex items-center justify-between flex-1 min-w-0">
            <span className="truncate text-xs font-semibold">
              {state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-elevated border border-brand-border text-brand-text-secondary uppercase font-bold">
              {state.theme}
            </span>
          </div>
        </button>
      </nav>

      {/* Auth / Account Controls at bottom */}
      <div className="mt-auto pt-2 border-t border-brand-border/60 space-y-1">
        {isLoggedIn ? (
          /* Logged In State: More Menu + Log Out Button */
          <>
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-all w-full"
                aria-label="More options"
              >
                <MoreHorizontal className="w-6 h-6 shrink-0" />
                <span className="hidden lg:block">More Options</span>
              </button>

              {showMore && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-brand-elevated border border-brand-border rounded-xl shadow-2xl py-1 z-50 animate-scale-in">
                    <button
                      onClick={() => {
                        setShowQRModal(true);
                        setShowMore(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-accent hover:bg-brand-surface transition-colors font-semibold"
                    >
                      <QrCode className="w-5 h-5" /> Share QR Code
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowMore(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-colors"
                    >
                      <Settings className="w-5 h-5" /> Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/challenges');
                        setShowMore(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-colors"
                    >
                      <Trophy className="w-5 h-5" /> Challenges
                    </button>
                    {isOwner && (
                      <>
                        <button
                          onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-colors"
                        >
                          <Users className="w-5 h-5" /> Switch Persona <ChevronDown className="w-4 h-4 ml-auto" />
                        </button>
                        {showAccountSwitcher && (
                          <div className="border-t border-brand-border py-1 max-h-48 overflow-y-auto">
                            {Object.values(state.users).map((u) => (
                              <button
                                key={u.id}
                                onClick={() => {
                                  switchUser(u.id);
                                  setShowMore(false);
                                  setShowAccountSwitcher(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-brand-surface transition-colors ${
                                  u.id === state.currentUserId ? 'text-brand-accent font-bold' : 'text-brand-text-secondary'
                                }`}
                              >
                                <Avatar user={u} size="xs" />
                                <span className="truncate">@{u.username}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => toggleTheme()}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-colors"
                    >
                      {state.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      {state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          setShowMore(false);
                          onOpenGuide?.();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary transition-colors"
                      >
                        <BookOpen className="w-5 h-5 text-[#0095F6]" /> User Guide & Help
                      </button>
                    )}
                    <div className="border-t border-brand-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-error hover:bg-brand-error/10 transition-colors font-semibold"
                    >
                      <LogOut className="w-5 h-5" /> Log Out
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          resetDemo();
                          setShowMore(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-brand-text-secondary/70 hover:bg-brand-surface text-xs transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset Demo
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Direct Log Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-brand-error/90 hover:bg-brand-error/10 hover:text-brand-error transition-all w-full text-xs font-semibold"
              title="Log Out"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block">Log Out</span>
            </button>
          </>
        ) : (
          /* Logged Out State: Log In & Register Buttons */
          <div className="space-y-1.5 p-1">
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn-primary w-full py-2 flex items-center justify-center gap-2 text-xs font-bold"
              title="Log In"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden lg:inline">Log In</span>
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-secondary w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold"
              title="Create Profile"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden lg:inline">Sign Up</span>
            </button>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </aside>
  );
}
