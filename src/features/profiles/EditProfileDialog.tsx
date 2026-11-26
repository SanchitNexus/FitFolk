import { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Trash2,
  Check,
  Palette,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { User } from '../../types';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const AVATAR_PRESETS = [
  { id: 'priya', name: 'Priya', role: 'Beginner / Yoga', url: '/assets/avatars/priya.svg' },
  { id: 'marcus', name: 'Marcus', role: 'Powerbuilder', url: '/assets/avatars/marcus.svg' },
  { id: 'sarah', name: 'Dr. Sarah', role: 'Physical Therapist', url: '/assets/avatars/sarah.svg' },
  { id: 'raj', name: 'Dr. Raj', role: 'Sports Dietitian', url: '/assets/avatars/raj.svg' },
  { id: 'zoe', name: 'Zoe', role: 'Dance & HIIT', url: '/assets/avatars/zoe.svg' },
  { id: 'aisha', name: 'Aisha', role: 'Marathon Runner', url: '/assets/avatars/aisha.svg' },
  { id: 'jake', name: 'Jake', role: 'Tech Lifter', url: '/assets/avatars/jake.svg' },
  { id: 'mike', name: 'Coach Mike', role: 'D1 Strength Coach', url: '/assets/avatars/mike.svg' },
  { id: 'luna', name: 'Luna', role: 'Powerlifting Champion', url: '/assets/avatars/luna.svg' },
  { id: 'alex', name: 'Alex', role: 'Yoga & Mobility', url: '/assets/avatars/alex.svg' },
  { id: 'demo', name: 'FitFolk Pro', role: 'Lightning Emblem', url: '/assets/avatars/demo.svg' },
];

const GRADIENT_PRESETS: [string, string][] = [
  ['#FF6B6B', '#FFE66D'],
  ['#4ECDC4', '#2C3E50'],
  ['#A3FF12', '#0D9488'],
  ['#F59E0B', '#EF4444'],
  ['#EC4899', '#8B5CF6'],
  ['#06B6D4', '#A3E635'],
  ['#3B82F6', '#1E3A5F'],
  ['#10B981', '#6366F1'],
];

export default function EditProfileDialog({ isOpen, onClose, user }: EditProfileDialogProps) {
  const { updateProfile } = useDemoContext();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [interestsText, setInterestsText] = useState(user.fitnessInterests.join(', '));
  const [goalsText, setGoalsText] = useState(user.fitnessGoals.join(', '));
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [avatarGradient, setAvatarGradient] = useState<[string, string]>(user.avatarGradient);
  const [avatarInitials, setAvatarInitials] = useState(user.avatarInitials);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'presets' | 'upload' | 'gradients'>('presets');

  // Handle local device image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        showToast('Photo uploaded successfully!', 'success');
        setShowAvatarPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    showToast('Profile picture removed. Using gradient initials.', 'info');
    setShowAvatarPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedInterests = interestsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const parsedGoals = goalsText
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    updateProfile({
      displayName: displayName.trim() || user.displayName,
      bio: bio.trim(),
      fitnessInterests: parsedInterests,
      fitnessGoals: parsedGoals,
      avatarUrl,
      avatarGradient,
      avatarInitials: avatarInitials.trim() || user.avatarInitials,
    });

    showToast('Profile and avatar updated successfully!', 'success');
    onClose();
  };

  // Construct a preview user object
  const previewUser: User = {
    ...user,
    displayName,
    avatarUrl,
    avatarGradient,
    avatarInitials,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* ========================================================= */}
        {/* Profile Picture Setup Header */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center justify-center p-4 bg-brand-surface border border-brand-border/70 rounded-2xl">
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
            <Avatar user={previewUser} size="xl" />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="mt-3 text-xs font-semibold text-[#0095F6] hover:text-[#0095F6]/80 flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{avatarUrl ? 'Change Profile Picture' : 'Set Up Profile Picture'}</span>
          </button>
          <span className="text-[10px] text-brand-text-secondary mt-0.5">
            Click to upload a photo, choose an athlete avatar, or pick colors
          </span>

          {/* ========================================================= */}
          {/* Interactive Profile Picture Setup Panel */}
          {/* ========================================================= */}
          {showAvatarPicker && (
            <div className="w-full mt-4 p-3 bg-brand-elevated border border-brand-border/80 rounded-xl space-y-3 animate-in fade-in duration-200">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPickerTab('presets')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      pickerTab === 'presets'
                        ? 'bg-brand-accent text-black font-bold'
                        : 'text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Avatars
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerTab('upload')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      pickerTab === 'upload'
                        ? 'bg-brand-accent text-black font-bold'
                        : 'text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                  >
                    <Upload className="w-3 h-3 inline mr-1" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerTab('gradients')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      pickerTab === 'gradients'
                        ? 'bg-brand-accent text-black font-bold'
                        : 'text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                  >
                    <Palette className="w-3 h-3 inline mr-1" />
                    Gradients
                  </button>
                </div>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Tab 1: Presets Gallery */}
              {pickerTab === 'presets' && (
                <div>
                  <p className="text-[11px] text-brand-text-secondary mb-2">
                    Select an official FitFolk fitness avatar:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected = avatarUrl === p.url;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(p.url);
                            showToast(`Selected ${p.name}'s avatar!`, 'success');
                          }}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'border-brand-accent bg-brand-accent/15 ring-2 ring-brand-accent'
                              : 'border-brand-border/60 hover:border-brand-text-primary/40 bg-brand-surface'
                          }`}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                          />
                          <span className="text-[9px] font-semibold text-brand-text-primary truncate max-w-full">
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Upload from Device */}
              {pickerTab === 'upload' && (
                <div className="py-2 text-center space-y-3">
                  <div className="border-2 border-dashed border-brand-border/80 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-brand-text-secondary opacity-60" />
                    <div>
                      <p className="font-semibold text-brand-text-primary text-xs">
                        Upload a photo from your computer or phone
                      </p>
                      <p className="text-[10px] text-brand-text-secondary">
                        Supports PNG, JPG, GIF, WebP, SVG
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 mt-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Gradients & Initials */}
              {pickerTab === 'gradients' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-brand-text-secondary">
                    Pick a signature gradient backdrop & custom initials:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {GRADIENT_PRESETS.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAvatarGradient(grad);
                          setAvatarUrl(undefined); // use gradient
                        }}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          !avatarUrl && avatarGradient[0] === grad[0]
                            ? 'ring-2 ring-brand-accent scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] text-brand-text-secondary font-semibold block mb-1">
                      Avatar Initials (1-2 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={avatarInitials}
                      onChange={(e) => setAvatarInitials(e.target.value.toUpperCase())}
                      className="input-field text-xs w-24 uppercase font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* Profile Information Fields */}
        {/* ========================================================= */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input-field text-xs"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">Bio / Slogan</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="input-field text-xs"
            placeholder="Share your fitness journey, certifications, or motto..."
          />
        </div>

        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">
            Fitness Interests (comma separated)
          </label>
          <input
            type="text"
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
            placeholder="e.g. Powerlifting, Running, Yoga, Meal Prep"
            className="input-field text-xs"
          />
        </div>

        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">
            Fitness Goals (comma separated)
          </label>
          <input
            type="text"
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
            placeholder="e.g. Bench 100kg, Run 10k, Improve mobility"
            className="input-field text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
          <button type="button" onClick={onClose} className="btn-secondary text-xs px-3 py-2">
            Cancel
          </button>
          <button type="submit" className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
