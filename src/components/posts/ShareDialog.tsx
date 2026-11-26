import { useState } from 'react';
import { Copy, Check, MessageSquare, Send, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../app/providers/ToastContext';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export default function ShareDialog({ isOpen, onClose, postId }: ShareDialogProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/post/${postId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2500);
      },
      () => {
        showToast('Failed to copy link', 'error');
      }
    );
  };

  const handleSimulatedShare = (platform: string) => {
    showToast(`Shared to ${platform}!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Post">
      <div className="space-y-4 text-xs">
        {/* Copy Link input */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1.5">
            Post Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="input-field text-xs text-brand-text-secondary select-all"
            />
            <button
              onClick={handleCopy}
              className="btn-primary flex items-center gap-1.5 px-3 py-2.5 shrink-0"
              aria-label="Copy post link"
            >
              {copied ? <Check className="w-4 h-4 text-brand-bg" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Share options */}
        <div className="border-t border-brand-border pt-3 space-y-2">
          <p className="font-semibold text-brand-text-primary mb-2">Quick Share Options:</p>

          <button
            onClick={() => handleSimulatedShare('FitFolk Direct Messages')}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-elevated transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-accent/15 text-brand-accent flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-brand-text-primary">Send in Direct Message</div>
              <div className="text-[10px] text-brand-text-secondary">Share with your gym buddies</div>
            </div>
          </button>

          <button
            onClick={() => handleSimulatedShare('Your Story')}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-elevated transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-brand-text-primary">Add to Your Story</div>
              <div className="text-[10px] text-brand-text-secondary">Highlight this workout on your story</div>
            </div>
          </button>

          <button
            onClick={() => handleSimulatedShare('External Fitness Community')}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-elevated transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-brand-text-primary">Share via System Share</div>
              <div className="text-[10px] text-brand-text-secondary">Export link to other apps</div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
