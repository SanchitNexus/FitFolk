import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

interface StoryViewerProps {
  userId: string;
  onClose: () => void;
}

export default function StoryViewer({ userId, onClose }: StoryViewerProps) {
  const { state } = useDemoContext();
  const { showToast } = useToast();
  const [itemIndex, setItemIndex] = useState(0);
  const [reactionSent, setReactionSent] = useState(false);
  const [replyText, setReplyText] = useState('');

  const story = state.stories.find((s) => s.userId === userId);
  const user = state.users[userId];

  const items = story?.items || [
    {
      id: 'default',
      type: 'text' as const,
      gradient: ['#10B981', '#047857'] as [string, string],
      text: 'Crushed a 5K morning run! Feeling energized. 🏃‍♂️✨',
      duration: 5,
    },
  ];

  const currentItem = items[itemIndex] || items[0];

  // Auto-advance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (itemIndex < items.length - 1) {
        setItemIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, (currentItem.duration || 5) * 1000);

    return () => clearTimeout(timer);
  }, [itemIndex, items.length, currentItem, onClose]);

  const handleNext = () => {
    if (itemIndex < items.length - 1) {
      setItemIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
    }
  };

  const handleSendReaction = () => {
    setReactionSent(true);
    showToast('Sent reaction to story!', 'success');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Replied to @${user?.username}: "${replyText}"`, 'success');
    setReplyText('');
  };

  const gradient = currentItem.gradient || ['#10B981', '#064E3B'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in p-2 sm:p-4 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm h-[90vh] max-h-[720px] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-brand-surface border border-brand-border/60">
        {/* Story Progress Indicators */}
        <div className="absolute top-2.5 inset-x-3 z-30 flex items-center gap-1.5">
          {items.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx < itemIndex ? 'w-full' : idx === itemIndex ? 'w-full animate-pulse' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white drop-shadow">
          <div className="flex items-center gap-2">
            {user && <Avatar user={user} size="sm" />}
            <div className="min-w-0">
              <span className="font-bold text-xs truncate">{user?.displayName}</span>
              <p className="text-[10px] text-white/80">
                2h ago • <span className="text-brand-accent">24h Demo Story</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Content Canvas with Gradient */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white relative"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          }}
        >
          {/* Navigation Click Zones */}
          <div
            onClick={handlePrev}
            className="absolute left-0 inset-y-0 w-1/3 cursor-pointer z-10"
            aria-label="Previous story item"
          />
          <div
            onClick={handleNext}
            className="absolute right-0 inset-y-0 w-2/3 cursor-pointer z-10"
            aria-label="Next story item"
          />

          {/* Interactive Poll in Story */}
          {currentItem.type === 'poll' ? (
            <div className="relative z-20 w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <h4 className="font-bold text-base mb-3 text-white">{currentItem.pollQuestion}</h4>
              <div className="space-y-2">
                {(currentItem.pollOptions || ['Yes', 'No']).map((opt, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`Voted for "${opt}"!`, 'success');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-xs font-semibold text-white transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : currentItem.type === 'question' ? (
            <div className="relative z-20 w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <Sparkles className="w-6 h-6 text-brand-accent mx-auto mb-2" />
              <h4 className="font-bold text-sm mb-2 text-white">{currentItem.questionPrompt}</h4>
              <p className="text-xs text-white/80">Type a response below</p>
            </div>
          ) : (
            <div className="relative z-20 max-w-xs">
              <p className="text-lg sm:text-xl font-bold leading-relaxed drop-shadow-md">
                {currentItem.text}
              </p>
            </div>
          )}
        </div>

        {/* Story Footer Controls */}
        <div className="p-3 bg-brand-surface/90 border-t border-brand-border/60 flex items-center gap-2 relative z-30">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${user?.username}...`}
              className="w-full bg-brand-elevated border border-brand-border rounded-full px-3 py-1.5 text-xs text-brand-text-primary placeholder:text-brand-text-secondary/60 focus:outline-none"
            />
          </form>
          <button
            onClick={handleSendReaction}
            className="p-2 rounded-full hover:bg-brand-elevated text-brand-text-secondary hover:text-brand-error transition-colors"
            aria-label="Send heart reaction"
          >
            <Heart className={`w-5 h-5 ${reactionSent ? 'fill-brand-error text-brand-error' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
