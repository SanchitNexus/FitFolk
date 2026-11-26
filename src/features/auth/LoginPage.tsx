import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Sparkles, Check, QrCode, HelpCircle, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import { isOwnerDevice, enableOwnerDevice } from '../../lib/deviceAuth';
import QRCodeModal from '../../components/common/QRCodeModal';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function LoginPage() {
  const { state, login, switchUser } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isOwner, setIsOwner] = useState(() => isOwnerDevice());
  const [logoTaps, setLogoTaps] = useState(0);

  const handleLogoTap = () => {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 5) {
      enableOwnerDevice();
      setIsOwner(true);
      showToast('🔓 Owner device unlocked! Demo accounts enabled.', 'success');
      setLogoTaps(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your username, email, or mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(identifier.trim(), password);
      setIsSubmitting(false);

      if (success) {
        showToast('Logged in successfully! Welcome to FitFolk.', 'success');
        navigate('/');
      } else {
        setError(
          isOwner
            ? 'Invalid username or password. (Hint: Demo password for all accounts is "fitfolk123")'
            : 'Invalid username or password. Please check your credentials.'
        );
      }
    }, 300);
  };

  const handleQuickLogin = (userId: string) => {
    const user = state.users[userId];
    if (!user) return;
    setIdentifier(user.username);
    setPassword('fitfolk123');
    login(user.id);
    showToast(`Logged in as @${user.username} (${user.displayName})`, 'success');
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full gap-8">
        {/* Left Side: Instagram Phone Showcase (Desktop) */}
        <div className="hidden lg:flex relative w-[380px] h-[580px] shrink-0 items-center justify-center">
          {/* Phone Frame */}
          <div className="w-[320px] h-[560px] bg-brand-surface border-[8px] border-neutral-800 rounded-[44px] shadow-2xl p-4 flex flex-col overflow-hidden relative">
            {/* Top Speaker / Camera Notch */}
            <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-3" />

            {/* Simulated Live Post on Phone */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-brand-border">
              <div className="w-8 h-8 rounded-full ig-gradient-bg p-0.5">
                <div className="w-full h-full rounded-full bg-brand-bg flex items-center justify-center text-[10px] font-bold text-brand-text-primary">
                  SW
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-brand-text-primary block leading-tight">coach_sarah</span>
                <span className="text-[10px] text-brand-text-secondary">Push Workout Completed</span>
              </div>
            </div>

            {/* Simulated Fitness Visual */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-brand-border p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent text-white font-bold">
                  PR Set!
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#0095F6] font-extrabold uppercase tracking-wider">FitFolk Workout</span>
                <h4 className="text-lg font-black text-white leading-tight">Barbell Bench Press</h4>
                <p className="text-xs text-neutral-300">4 sets × 8 reps @ 100kg</p>
              </div>

              <div className="space-y-1.5 pt-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Heart Rate</span>
                  <span className="font-bold text-white">148 bpm</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] w-4/5" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Rest Timer</span>
                  <span className="font-mono text-[#0095F6] font-bold">01:30</span>
                </div>
              </div>
            </div>

            {/* Bottom mini phone nav */}
            <div className="flex justify-around items-center pt-3 text-neutral-500 text-xs">
              <div className="flex items-center gap-1.5">
                <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-4 h-4 rounded object-cover" />
                <span className="font-black text-sm tracking-tight text-brand-text-primary">Fit<span className="text-[#99FF00]">folk</span></span>
              </div>
              <span className="text-[10px] text-neutral-400">Social Fitness</span>
            </div>
          </div>
        </div>

        {/* Right Side: Instagram Login Box */}
        <div className="w-full max-w-[350px] space-y-3">
          {/* Main Login Card */}
          <div className="card p-8 border border-brand-border bg-brand-surface rounded-xl shadow-sm text-center">
            {/* Logo Mark & Wordmark */}
            <div
              onClick={handleLogoTap}
              className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-black shadow-lg border border-brand-border/80 mb-3 p-1 cursor-pointer active:scale-95 transition-transform"
              title={isOwner ? 'FitFolk Owner Mode Active' : 'FitFolk'}
            >
              <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-center">
              <span className="font-black text-3xl tracking-tight text-brand-text-primary">Fit</span>
              <span className="font-black text-3xl tracking-tight text-[#99FF00]">folk</span>
            </div>
            <p className="text-[11px] text-brand-text-secondary font-medium tracking-wide mb-6">
              Your fitness. Your people. Your progress.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-left leading-tight">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 text-left">
              <div>
                <input
                  type="text"
                  placeholder="Phone number, username, or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors"
                  autoComplete="username"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors pr-12"
                  autoComplete="current-password"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!identifier.trim() || isSubmitting}
                className="w-full py-2 mt-2 bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            {/* Demo Accounts Section (VISIBLE ONLY ON OWNER DEVICE / LOCALHOST) */}
            {isOwner && (
              <>
                {/* Instagram "OR" Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-[1px] bg-brand-border" />
                  <span className="px-4 text-[11px] font-bold text-brand-text-secondary">OR</span>
                  <div className="flex-1 h-[1px] bg-brand-border" />
                </div>

                {/* Quick 1-Click Demo Profiles Button */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    className="w-full py-2 px-3 rounded-lg border border-brand-border bg-brand-elevated hover:bg-brand-surface text-brand-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-[#0095F6]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Choose a Demo Account</span>
                    </div>
                    {showDemoAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Demo Account List */}
                  {showDemoAccounts && (
                    <div className="border border-brand-border rounded-lg bg-brand-elevated p-1.5 max-h-52 overflow-y-auto space-y-1 text-left animate-slide-down">
                      <div className="px-2 py-1 text-[10px] text-brand-text-secondary font-bold uppercase tracking-wider border-b border-brand-border/60">
                        Password for all: <span className="text-[#0095F6] select-all font-mono">fitfolk123</span>
                      </div>
                      {Object.values(state.users).map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleQuickLogin(user.id)}
                          className="w-full p-1.5 rounded-md hover:bg-brand-surface text-left flex items-center gap-2 transition-colors group"
                        >
                          <Avatar user={user} size="xs" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-brand-text-primary truncate">
                                {user.displayName}
                              </span>
                              {user.isVerified && user.verificationCategory && (
                                <VerificationBadge category={user.verificationCategory} size="sm" />
                              )}
                            </div>
                            <span className="text-[10px] text-brand-text-secondary truncate block">
                              @{user.username}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#0095F6] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Log in
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Forgot Password Link */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    isOwner
                      ? 'Demo Accounts Password: "fitfolk123". Enter any username from the list above!'
                      : 'To reset your password, please contact support or register a new account.',
                    'info'
                  )
                }
                className="text-[11px] text-[#0095F6] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Bottom Card: Don't have an account? Sign up */}
          <div className="card p-4 border border-brand-border bg-brand-surface rounded-xl text-center text-xs">
            <span className="text-brand-text-secondary">Don't have an account? </span>
            <Link to="/join" className="text-[#0095F6] font-bold hover:underline">
              Sign up
            </Link>
          </div>

          {/* Mobile Invitation / QR Code Trigger */}
          <div className="text-center pt-1">
            <button
              onClick={() => setShowQR(true)}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#0095F6]" />
              <span>Scan QR Code to join on phone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instagram-style Minimal Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-brand-text-secondary space-y-2 mt-6 pt-4 border-t border-brand-border/40">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/explore" className="hover:underline">Explore</Link>
          <Link to="/workouts" className="hover:underline">Workouts</Link>
          <Link to="/nutrition" className="hover:underline">Nutrition</Link>
          <Link to="/ai-coach" className="hover:underline">AI Coach</Link>
          <Link to="/community" className="hover:underline">Community Q&A</Link>
          <Link to="/settings" className="hover:underline">Privacy & Terms</Link>
        </div>
        <p className="text-[10px] text-brand-text-secondary/70">
          © 2026 Fitfolk — Your fitness. Your people. Your progress.
        </p>
      </footer>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
}
