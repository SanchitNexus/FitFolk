import { useState } from 'react';
import { Sparkles, Palette } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

interface CreateStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRADIENT_PRESETS: [string, string][] = [
  ['#10B981', '#064E3B'],
  ['#6366F1', '#312E81'],
  ['#F43F5E', '#881337'],
  ['#F59E0B', '#78350F'],
  ['#8B5CF6', '#4C1D95'],
];

export default function CreateStoryDialog({ isOpen, onClose }: CreateStoryDialogProps) {
  const { state } = useDemoContext();
  const { showToast } = useToast();

  const [storyText, setStoryText] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(GRADIENT_PRESETS[0]);
  const [audience, setAudience] = useState<'public' | 'close_friends'>('public');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) {
      showToast('Please add some text to your story', 'error');
      return;
    }

    // In demo mode, push to state stories
    state.stories.unshift({
      id: `story-${Date.now()}`,
      userId: state.currentUserId,
      isViewed: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      audience,
      items: [
        {
          id: `item-${Date.now()}`,
          type: 'text',
          text: storyText.trim(),
          gradient: selectedGradient,
          duration: 5,
        },
      ],
    });

    showToast('Your 24h Story is live!', 'success');
    setStoryText('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create 24h Story">
      <form onSubmit={handlePublish} className="space-y-4 text-xs">
        {/* Story Canvas Live Preview */}
        <div
          className="w-full h-56 rounded-2xl flex items-center justify-center p-6 text-center text-white relative shadow-inner overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${selectedGradient[0]}, ${selectedGradient[1]})`,
          }}
        >
          <p className="text-base font-bold leading-relaxed max-w-xs drop-shadow-md">
            {storyText.trim() || 'Type your story message below...'}
          </p>
        </div>

        {/* Text Input */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">
            Story Text / Workout Update:
          </label>
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="e.g. Just hit a 100kg deadlift! Rest day tomorrow 💪"
            rows={2}
            className="input-field text-xs"
          />
        </div>

        {/* Background Gradient Palette */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-brand-accent" />
            Theme Gradient:
          </label>
          <div className="flex items-center gap-2">
            {GRADIENT_PRESETS.map((g, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedGradient(g)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  selectedGradient[0] === g[0]
                    ? 'scale-110 border-white shadow-md'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                }}
                aria-label={`Gradient preset ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1">Story Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as any)}
            className="input-field text-xs bg-brand-surface"
          >
            <option value="public">Public (All FitFolk members)</option>
            <option value="close_friends">Close Friends Circle only</option>
          </select>
          <p className="text-[10px] text-brand-text-secondary mt-1">
            Note: Stories automatically expire after 24 hours in the full product roadmap.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
          <button type="button" onClick={onClose} className="btn-secondary text-xs px-3 py-2">
            Cancel
          </button>
          <button type="submit" className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Share Story
          </button>
        </div>
      </form>
    </Modal>
  );
}
