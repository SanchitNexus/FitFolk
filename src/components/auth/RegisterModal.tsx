import { useState } from 'react';
import { UserPlus, Sparkles, Check, Palette, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { User, VerificationCategory } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const GRADIENT_PRESETS: [string, string][] = [
  ['#f09433', '#bc1888'], // Instagram Signature Gradient
  ['#0095F6', '#00F2FE'], // Instagram Royal Ocean
  ['#667EEA', '#764BA2'], // Purple / Violet
  ['#FF6B6B', '#FFE66D'], // Warm Sunrise
  ['#FA709A', '#FEE140'], // Energetic Pink
  ['#10B981', '#3B82F6'], // Emerald / Cyan
];

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { registerUser } = useDemoContext();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [personaType, setPersonaType] = useState<'beginner' | 'enthusiast' | 'trainer' | 'runner' | 'wellness'>('beginner');
  const [goals, setGoals] = useState('Build consistent habits, Improve strength');
  const [interests, setInterests] = useState('General Fitness, Healthy Eating');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(GRADIENT_PRESETS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      showToast('Please enter a valid alphanumeric username', 'error');
      return;
    }

    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FF';

    const isVerifiedTrainer = personaType === 'trainer';

    const newUser: User = {
      id: `user-${Date.now()}`,
      displayName: displayName.trim() || 'FitFolk Athlete',
      username: cleanUsername,
      bio: bio.trim() || 'New member of the FitFolk community. Ready to progress! 💪',
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
      fitnessInterests: interests.split(',').map((s) => s.trim()).filter(Boolean),
      fitnessGoals: goals.split(',').map((s) => s.trim()).filter(Boolean),
      followers: 12,
      following: 2,
      postsCount: 0,
      isPrivate: false,
      joinedDate: new Date().toISOString().split('T')[0],
      personalRecords: [
        { exercise: 'First Workout', value: 'Completed!', date: new Date().toISOString().split('T')[0] },
      ],
      achievements: [
        {
          id: `ach-${Date.now()}`,
          title: 'Welcome to FitFolk',
          description: 'Joined the community and created your profile',
          icon: '🌱',
          earnedDate: new Date().toISOString().split('T')[0],
        },
      ],
    };

    registerUser(newUser);
    showToast(`Welcome to FitFolk, @${newUser.username}! Your profile has been created.`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your FitFolk Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Live Avatar Preview */}
        <div className="flex items-center gap-3 p-3 bg-brand-elevated rounded-xl border border-brand-border/60">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base text-white shrink-0 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${selectedGradient[0]}, ${selectedGradient[1]})`,
            }}
          >
            {displayName
              ? displayName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'FF'}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm text-brand-text-primary block truncate">
              {displayName || 'Your Name'}
            </span>
            <span className="text-xs text-brand-text-secondary truncate block">
              @{username.toLowerCase() || 'username'}
            </span>
            <span className="text-[10px] text-brand-accent mt-0.5 inline-block font-semibold">
              Scan & Join Profile Ready
            </span>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Full / Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Miller"
              className="input-field text-xs py-2"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Unique Username</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-brand-text-secondary">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_fitness"
                className="input-field text-xs py-2 pl-7"
                required
              />
            </div>
          </div>
        </div>

        {/* Fitness Persona */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">Your Fitness Persona</label>
          <select
            value={personaType}
            onChange={(e) => setPersonaType(e.target.value as any)}
            className="input-field text-xs bg-brand-surface py-2"
          >
            <option value="beginner">Beginner starting out (Learning form & habits)</option>
            <option value="enthusiast">Gym & Strength Enthusiast (Lifting & progress)</option>
            <option value="trainer">Certified Personal Trainer (Verified Pro badge)</option>
            <option value="runner">Runner & Endurance Athlete</option>
            <option value="wellness">Yoga & Holistic Wellness</option>
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">Short Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share your goals, motivation, or favorite lifts..."
            rows={2}
            className="input-field text-xs py-2"
          />
        </div>

        {/* Goals & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Fitness Goals</label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Build Muscle, 5K Run"
              className="input-field text-xs py-2"
            />
          </div>
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Weightlifting, Yoga"
              className="input-field text-xs py-2"
            />
          </div>
        </div>

        {/* Avatar Color Selector */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-brand-accent" />
            <span>Avatar Color Gradient</span>
          </label>
          <div className="flex items-center gap-2">
            {GRADIENT_PRESETS.map((g, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedGradient(g)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  selectedGradient[0] === g[0]
                    ? 'scale-110 ring-2 ring-white shadow-md'
                    : 'hover:scale-105'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                }}
                aria-label={`Gradient choice ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border">
          {onSwitchToLogin && (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-brand-accent hover:underline font-medium"
            >
              Already have an account? Log In
            </button>
          )}
          <button type="submit" className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5 font-bold ml-auto">
            <span>Create Profile & Enter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
