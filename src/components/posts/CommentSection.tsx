import { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Comment } from '../../types';

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  isOpen: boolean;
}

export default function CommentSection({ comments, postId, isOpen }: CommentSectionProps) {
  const { state, addComment } = useDemoContext();
  const { showToast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUser = state.users[state.currentUserId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const formattedText = replyTo ? `@${replyTo} ${commentText.trim()}` : commentText.trim();
    addComment(postId, formattedText);
    setCommentText('');
    setReplyTo(null);
    showToast('Comment posted!', 'success');
  };

  return (
    <div className="pt-3 border-t border-brand-border/60 animate-fade-in text-xs">
      {/* Existing Comments List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-3">
        {comments.length === 0 ? (
          <p className="text-center py-4 text-brand-text-secondary/70 italic text-[11px]">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => {
            const author = state.users[comment.userId];
            const authorName = author?.displayName || 'Fitness Member';
            const authorUsername = author?.username || 'member';

            return (
              <div key={comment.id} className="flex items-start gap-2.5 group">
                {author ? (
                  <Avatar user={author} size="xs" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-brand-border" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="bg-brand-elevated/70 rounded-xl p-2.5 border border-brand-border/40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-semibold text-brand-text-primary text-xs">
                        {authorName}
                      </span>
                      {author?.isVerified && author.verificationCategory && (
                        <VerificationBadge category={author.verificationCategory} size="sm" />
                      )}
                      <span className="text-[10px] text-brand-text-secondary">
                        @{authorUsername}
                      </span>
                    </div>
                    <p className="text-xs text-brand-text-primary/95 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>

                  {/* Actions under comment */}
                  <div className="flex items-center gap-3 px-1 mt-1 text-[10px] text-brand-text-secondary">
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => setReplyTo(authorUsername)}
                      className="hover:text-brand-text-primary font-medium"
                    >
                      Reply
                    </button>
                    <button className="flex items-center gap-1 hover:text-brand-accent transition-colors ml-auto">
                      <Heart className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply target indicator */}
      {replyTo && (
        <div className="flex items-center justify-between bg-brand-accent/10 px-2.5 py-1 rounded-md mb-2 text-[11px] text-brand-accent">
          <span>Replying to @{replyTo}</span>
          <button
            onClick={() => setReplyTo(null)}
            className="text-brand-text-secondary hover:text-brand-text-primary"
          >
            ✕
          </button>
        </div>
      )}

      {/* Comment Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {currentUser && <Avatar user={currentUser} size="xs" />}
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={replyTo ? `Reply to @${replyTo}...` : 'Add an encouraging comment...'}
          className="flex-1 bg-brand-elevated border border-brand-border/70 rounded-full px-3 py-1.5 text-xs text-brand-text-primary placeholder:text-brand-text-secondary/60 focus:outline-none focus:border-brand-accent/50"
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="p-1.5 rounded-full bg-brand-accent text-brand-bg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-accent-hover transition-all"
          aria-label="Send comment"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
