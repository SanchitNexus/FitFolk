import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, TrendingUp, Users, ChevronRight, QrCode, LogIn, LogOut } from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import { isOwnerDevice } from '../../lib/deviceAuth';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import QRCodeModal from '../common/QRCodeModal';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

interface RightSidebarProps {
  onOpenGuide?: () => void;
}

export default function RightSidebar({ onOpenGuide }: RightSidebarProps) {
  const { state, isLoggedIn, logout, toggleFollow, switchUser } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isOwner = isOwnerDevice();

  const [showQR, setShowQR] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const currentUser = isLoggedIn ? state.users[state.currentUserId] : null;
  const followingList = state.following[state.currentUserId] || [];

  // Suggest creators who are not the current user and not yet followed (or first 3)
  const suggestedUsers = Object.values(state.users)
    .filter((u) => u.id !== state.currentUserId)
    .slice(0, 4);

  const trendingTopics = [
    { tag: '#PushUpChallenge', count: '1.2k posts', category: 'Challenge' },
    { tag: '#MealPrepSunday', count: '890 posts', category: 'Nutrition' },
    { tag: '#DeadliftPR', count: '640 posts', category: 'Strength' },
    { tag: '#MindfulRunning', count: '412 posts', category: 'Cardio' },
    { tag: '#FormCheck', count: '320 questions', category: 'Q&A' },
  ];

  const featuredChallenges = state.challenges.slice(0, 2);

  return (
    <aside className="hidden xl:flex flex-col w-[340px] sticky top-0 h-screen overflow-y-auto p-4 border-l border-brand-border bg-brand-bg/50 text-sm">
      {/* Current User Quick Status & Switcher Card */}
      <div className="card p-3 mb-4 bg-brand-surface/90">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? 'ACTIVE ACCOUNT' : 'GUEST MODE'}</span>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                showToast('Logged out of FitFolk', 'info');
                navigate('/login');
              }}
              className="text-[10px] text-brand-error hover:underline font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-[10px] text-brand-accent hover:underline font-bold flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Log In</span>
            </button>
          )}
        </div>

        {isLoggedIn && currentUser ? (
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-brand-text-primary truncate">
                  {currentUser.displayName}
                </span>
                {currentUser.isVerified && currentUser.verificationCategory && (
                  <VerificationBadge category={currentUser.verificationCategory} size="sm" />
                )}
              </div>
              <p className="text-xs text-brand-text-secondary truncate">
                @{currentUser.username}
              </p>
            </div>
            {isOwner && (
              <select
                value={state.currentUserId}
                onChange={(e) => switchUser(e.target.value)}
                className="text-xs bg-brand-elevated border border-brand-border text-brand-accent font-medium rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
                title="Switch demo persona"
              >
                {Object.values(state.users).map((u) => (
                  <option key={u.id} value={u.id} className="bg-brand-surface text-brand-text-primary">
                    @{u.username}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="py-2 text-center space-y-2">
            <p className="text-xs text-brand-text-secondary">
              You are currently logged out. Log in to a demo persona or create your own profile.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowLogin(true)}
                className="btn-primary text-xs px-3 py-1 font-bold"
              >
                Log In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="btn-secondary text-xs px-3 py-1"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Scan & Invite Card */}
      <div className="card p-3.5 mb-4 bg-gradient-to-br from-brand-surface to-brand-elevated border-brand-border hover:border-brand-accent transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl ig-gradient-bg text-white flex items-center justify-center shrink-0 shadow-md">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-brand-text-primary">Scan QR Code to Join</h4>
            <p className="text-[11px] text-brand-text-secondary mt-0.5 leading-tight">
              Ask friends or teachers to scan the QR code to create their profile directly on their phone!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQR(true)}
          className="btn-primary w-full mt-3 py-1.5 text-xs flex items-center justify-center gap-1.5 font-bold"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Open Invitation QR Code</span>
        </button>
      </div>

      {/* Suggested Creators */}
      <div className="card p-3.5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-semibold text-brand-text-primary">
            <Users className="w-4 h-4 text-brand-accent" />
            <span>Suggested Creators</span>
          </div>
          <Link to="/explore" className="text-xs text-brand-accent hover:underline">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user) => {
            const isFollowing = followingList.includes(user.id);
            return (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-2.5 min-w-0 group"
                >
                  <Avatar user={user} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-brand-text-primary group-hover:text-brand-accent transition-colors truncate">
                        {user.displayName}
                      </span>
                      {user.isVerified && user.verificationCategory && (
                        <VerificationBadge category={user.verificationCategory} size="sm" />
                      )}
                    </div>
                    <p className="text-[11px] text-brand-text-secondary truncate">
                      @{user.username}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    isFollowing
                      ? 'bg-brand-elevated text-brand-text-secondary border border-brand-border hover:text-brand-error'
                      : 'bg-brand-accent text-brand-bg font-semibold hover:bg-brand-accent-hover'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Fitness Topics */}
      <div className="card p-3.5 mb-4">
        <div className="flex items-center gap-1.5 font-semibold text-brand-text-primary mb-3">
          <TrendingUp className="w-4 h-4 text-brand-accent" />
          <span>Trending in Fitness</span>
        </div>
        <div className="space-y-2.5">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.tag}
              to={`/search?q=${encodeURIComponent(topic.tag)}`}
              className="block p-1.5 -mx-1.5 rounded-lg hover:bg-brand-elevated transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-text-primary text-brand-accent/90">
                  {topic.tag}
                </span>
                <span className="text-[10px] text-brand-text-secondary/70">
                  {topic.category}
                </span>
              </div>
              <p className="text-[11px] text-brand-text-secondary">{topic.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Challenges */}
      <div className="card p-3.5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-semibold text-brand-text-primary">
            <Trophy className="w-4 h-4 text-brand-accent" />
            <span>Active Challenges</span>
          </div>
          <Link to="/challenges" className="text-xs text-brand-accent hover:underline flex items-center">
            View <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {featuredChallenges.map((ch) => (
            <Link
              key={ch.id}
              to="/challenges"
              className="block p-2 rounded-lg bg-brand-elevated border border-brand-border/60 hover:border-brand-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-text-primary truncate">
                  {ch.title}
                </span>
                <span className="text-[10px] text-brand-accent font-medium">
                  {ch.participantCount} joined
                </span>
              </div>
              <div className="w-full bg-brand-border/50 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-brand-accent h-full rounded-full transition-all"
                  style={{ width: `${ch.progress}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Prototype Disclaimer & Footer */}
      <div className="mt-auto pt-2 text-[11px] text-brand-text-secondary/70 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link to="/settings" className="hover:underline">Settings</Link>
          <span>•</span>
          <Link to="/community" className="hover:underline">Q&A</Link>
          <span>•</span>
          <Link to="/live" className="hover:underline">Live</Link>
          <span>•</span>
          <Link to="/workouts" className="hover:underline">Workouts</Link>
        </div>
        <p className="pt-1">
          FitFolk Investor Demonstration Prototype • Zero-cost client-side deployment.
        </p>
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
    </aside>
  );
}
