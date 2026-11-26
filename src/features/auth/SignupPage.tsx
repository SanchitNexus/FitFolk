import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Sparkles, Check, Flame, Trophy, Palette, ArrowRight } from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { User, VerificationCategory } from '../../types';
import QRCodeModal from '../../components/common/QRCodeModal';

const GRADIENT_PRESETS: [string, string][] = [
  ['#f09433', '#bc1888'], // Instagram Sunrise
  ['#0095F6', '#00F2FE'], // Instagram Royal Ocean
  ['#667EEA', '#764BA2'], // Purple / Violet
  ['#FF6B6B', '#FFE66D'], // Warm Sunrise
  ['#FA709A', '#FEE140'], // Energetic Pink
  ['#10B981', '#3B82F6'], // Emerald / Cyan
];

export default function SignupPage() {
  const { registerUser } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [personaType, setPersonaType] = useState<'beginner' | 'enthusiast' | 'trainer' | 'runner' | 'wellness'>('beginner');
  const [goals, setGoals] = useState('Build consistent habits, Improve strength');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(GRADIENT_PRESETS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      setError('Please choose a valid username (letters, numbers, underscores).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FF';

    const isVerifiedTrainer = personaType === 'trainer';

    const avatarMap: Record<string, string> = {
      beginner: '/assets/avatars/priya.svg',
      enthusiast: '/assets/avatars/marcus.svg',
      trainer: '/assets/avatars/sarah.svg',
      runner: '/assets/avatars/aisha.svg',
      wellness: '/assets/avatars/alex.svg',
    };

    const newUser: User = {
      id: `user-${Date.now()}`,
      displayName: fullName.trim() || 'FitFolk Athlete',
      username: cleanUsername,
      email: emailOrPhone.trim().includes('@') ? emailOrPhone.trim().toLowerCase() : `${cleanUsername}@fitfolk.com`,
      password: password || 'fitfolk123',
      bio: `New member of the FitFolk community! Goal: ${goals.split(',')[0] || 'Build strength'} 💪`,
      avatarUrl: avatarMap[personaType],
      avatarGradient: selectedGradient,
      avatarInitials: initials,
      isVerified: isVerifiedTrainer,
      verificationCategory: isVerifiedTrainer ? ('personal_trainer' as VerificationCategory) : undefined,
      credentials: isVerifiedTrainer
        ? [
            {
              title: 'Certified Fitness Specialist',
              issuer: 'FitFolk Community Board',
              year: 2026,
              category: 'personal_trainer' as VerificationCategory,
            },
          ]
        : undefined,
      fitnessInterests: ['strength', 'nutrition', 'lifestyle'],
      fitnessGoals: goals.split(',').map((s) => s.trim()).filter(Boolean),
      followers: 1,
      following: 2,
      postsCount: 0,
      isPrivate: false,
      joinedDate: new Date().toISOString().split('T')[0],
      personalRecords: [
        { exercise: 'First Workout', value: 'Ready to start!', date: new Date().toISOString().split('T')[0] },
      ],
      achievements: [
        {
          id: `ach-${Date.now()}`,
          title: 'Welcome to FitFolk',
          description: 'Created your profile and joined the community',
          icon: '🌱',
          earnedDate: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setTimeout(() => {
      registerUser(newUser);
      setIsSubmitting(false);
      showToast(`Welcome to FitFolk, @${newUser.username}! Your profile is live.`, 'success');
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex-1 flex items-center justify-center max-w-sm mx-auto w-full">
        <div className="w-full space-y-3">
          {/* Main Instagram Signup Card */}
          <div className="card p-8 border border-brand-border bg-brand-surface rounded-xl shadow-sm text-center">
            {/* Logo Mark & Wordmark */}
            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-black shadow-lg border border-brand-border/80 mb-3 p-1">
              <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-center">
              <span className="font-black text-3xl tracking-tight text-brand-text-primary">Fit</span>
              <span className="font-black text-3xl tracking-tight text-[#99FF00]">folk</span>
            </div>
            <p className="text-[11px] text-brand-text-secondary font-medium tracking-wide mb-3">
              Your fitness. Your people. Your progress.
            </p>

            <p className="text-xs font-semibold text-brand-text-secondary leading-snug mb-5">
              Sign up to see workout logs, healthy recipes, and fitness reels from athletes worldwide.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-left leading-tight">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 text-left text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Mobile Number or Email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Username (e.g. alex_lifts)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>

              {/* Fitness Persona Selector */}
              <div>
                <label className="text-[11px] font-semibold text-brand-text-secondary block mb-1">
                  Choose Your Fitness Journey:
                </label>
                <select
                  value={personaType}
                  onChange={(e) => setPersonaType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary focus:outline-none focus:border-neutral-500 transition-colors"
                >
                  <option value="beginner">🌱 Beginner Starting Journey</option>
                  <option value="enthusiast">🏋️ Gym & Strength Enthusiast</option>
                  <option value="trainer">⚡ Certified Coach / Personal Trainer</option>
                  <option value="runner">🏃 Runner / Endurance Athlete</option>
                  <option value="wellness">🧘 Yoga / Holistic Wellness</option>
                </select>
              </div>

              {/* Avatar Color Gradient */}
              <div>
                <label className="text-[11px] font-semibold text-brand-text-secondary block mb-1">
                  Avatar Color Style:
                </label>
                <div className="flex items-center gap-2">
                  {GRADIENT_PRESETS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedGradient(grad)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        selectedGradient[0] === grad[0] ? 'scale-125 ring-2 ring-[#0095F6]' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
                    />
                  ))}
                </div>
              </div>

              {/* Instagram Terms Disclaimer */}
              <p className="text-[10px] text-brand-text-secondary text-center leading-relaxed pt-1">
                People who use our service may have uploaded your contact information to Fitfolk.{' '}
                <span className="text-[#0095F6] cursor-pointer hover:underline">Learn More</span>
              </p>

              <p className="text-[10px] text-brand-text-secondary text-center leading-relaxed">
                By signing up, you agree to our{' '}
                <span className="text-[#0095F6] cursor-pointer hover:underline">Terms</span>,{' '}
                <span className="text-[#0095F6] cursor-pointer hover:underline">Privacy Policy</span> and{' '}
                <span className="text-[#0095F6] cursor-pointer hover:underline">Cookies Policy</span>.
              </p>

              <button
                type="submit"
                disabled={!username.trim() || !password || isSubmitting}
                className="w-full py-2 bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Creating Profile...' : 'Sign up'}
              </button>
            </form>
          </div>

          {/* Bottom Card: Have an account? Log in */}
          <div className="card p-4 border border-brand-border bg-brand-surface rounded-xl text-center text-xs">
            <span className="text-brand-text-secondary">Have an account? </span>
            <Link to="/login" className="text-[#0095F6] font-bold hover:underline">
              Log in
            </Link>
          </div>

          {/* Mobile QR Invitation */}
          <div className="text-center pt-1">
            <button
              onClick={() => setShowQR(true)}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#0095F6]" />
              <span>Invite a friend via QR code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-brand-text-secondary space-y-2 mt-6 pt-4 border-t border-brand-border/40">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/explore" className="hover:underline">Explore</Link>
          <Link to="/workouts" className="hover:underline">Workouts</Link>
          <Link to="/nutrition" className="hover:underline">Nutrition</Link>
          <Link to="/ai-coach" className="hover:underline">AI Coach</Link>
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
