import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  MoreHorizontal,
  Dumbbell,
  Utensils,
  Play,
  CheckCircle,
  Flag,
  EyeOff,
  UserPlus,
  UserCheck,
  BookOpen,
  Vote,
  TrendingUp,
  Archive,
  Trash2,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import CommentSection from './CommentSection';
import ShareDialog from './ShareDialog';
import ReportDialog from '../dialogs/ReportDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const {
    state,
    toggleLike,
    toggleSave,
    toggleFollow,
    hidePost,
    deletePost,
    archivePost,
    unarchivePost,
    addWorkout,
  } = useDemoContext();
  const { showToast } = useToast();

  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [votedOption, setVotedOption] = useState<string | undefined>(post.votedOptionId);
  const [localPollOptions, setLocalPollOptions] = useState(post.pollOptions);
  const [imageError, setImageError] = useState(false);

  const author = state.users[post.userId];
  const isFollowing = (state.following[state.currentUserId] || []).includes(post.userId);
  const isAuthorSelf = post.userId === state.currentUserId;
  const isArchived = Boolean(post.isArchived || state.archivedPostIds?.includes(post.id));

  const isLiked = state.likedPostIds.includes(post.id) || post.isLiked;
  const isSaved = state.savedPostIds.includes(post.id) || post.isSaved;

  const handleVote = (optionId: string) => {
    if (votedOption || !localPollOptions) return;
    setVotedOption(optionId);
    setLocalPollOptions(
      localPollOptions.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
    showToast('Vote submitted!', 'success');
  };

  const handleLogWorkout = () => {
    if (!post.workoutData) return;
    addWorkout({
      id: `wk-logged-${Date.now()}`,
      userId: state.currentUserId,
      title: post.workoutData.title,
      duration: post.workoutData.duration,
      date: new Date().toISOString().split('T')[0],
      isTemplate: false,
      isCompleted: true,
      calories: 320,
      exercises: [
        {
          id: `we-${Date.now()}-1`,
          exerciseId: 'ex-1',
          exerciseName: 'Bench Press',
          sets: [{ id: 's1', reps: 10, weight: 60, isCompleted: true }],
          restSeconds: 90,
        },
      ],
    });
    showToast(`Logged "${post.workoutData.title}" into your history!`, 'success');
  };

  // Poll total votes
  const totalVotes = (localPollOptions || []).reduce((sum, o) => sum + o.votes, 0);

  return (
    <article className="card p-4 mb-4 bg-brand-surface border border-brand-border/80 rounded-2xl shadow-sm hover:border-brand-border transition-colors">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Link to={`/profile/${author?.username || 'user'}`} className="flex items-center gap-2.5 min-w-0 group">
          {author ? (
            <Avatar user={author} size="md" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-border" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-brand-text-primary group-hover:text-brand-accent transition-colors truncate">
                {author?.displayName || 'Fitness Creator'}
              </span>
              {author?.isVerified && author.verificationCategory && (
                <VerificationBadge category={author.verificationCategory} size="sm" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-brand-text-secondary">
              <span className="truncate">@{author?.username || 'member'}</span>
              <span>•</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              {isArchived && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Archive className="w-2.5 h-2.5" />
                  <span>Archived</span>
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1">
          {!isAuthorSelf && (
            <button
              onClick={() => toggleFollow(post.userId)}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors hidden sm:flex items-center gap-1 ${
                isFollowing
                  ? 'bg-brand-elevated text-brand-text-secondary border border-brand-border hover:text-brand-error'
                  : 'bg-brand-accent text-white hover:bg-[#1877F2]'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}

          {/* Overflow menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-elevated transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-brand-elevated border border-brand-border rounded-xl shadow-2xl py-1 z-40 text-xs animate-scale-in">
                  {/* Instagram-style Post Actions for Owner */}
                  {isAuthorSelf && (
                    <>
                      <button
                        onClick={() => {
                          if (isArchived) {
                            unarchivePost(post.id);
                            showToast('Post restored to your profile', 'success');
                          } else {
                            archivePost(post.id);
                            showToast('Post moved to your archive', 'info');
                          }
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-brand-text-primary hover:bg-brand-surface text-left"
                      >
                        <Archive className="w-4 h-4 text-brand-text-secondary" />
                        <span>{isArchived ? 'Show on Profile (Unarchive)' : 'Archive Post'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-brand-error hover:bg-brand-error/10 text-left font-medium"
                      >
                        <Trash2 className="w-4 h-4 text-brand-error" />
                        <span>Delete Post</span>
                      </button>

                      <div className="border-t border-brand-border/60 my-1" />
                    </>
                  )}

                  <button
                    onClick={() => {
                      toggleSave(post.id);
                      setShowMenu(false);
                      showToast(isSaved ? 'Removed from saved' : 'Saved to bookmarks', 'info');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-brand-text-primary hover:bg-brand-surface text-left"
                  >
                    <Bookmark className="w-4 h-4 text-brand-text-secondary" />
                    <span>{isSaved ? 'Remove from Saved' : 'Save Post'}</span>
                  </button>

                  {!isAuthorSelf && (
                    <button
                      onClick={() => {
                        toggleFollow(post.userId);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-brand-text-primary hover:bg-brand-surface text-left"
                    >
                      {isFollowing ? <UserCheck className="w-4 h-4 text-brand-accent" /> : <UserPlus className="w-4 h-4 text-brand-text-secondary" />}
                      <span>{isFollowing ? `Unfollow @${author?.username}` : `Follow @${author?.username}`}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      hidePost(post.id);
                      setShowMenu(false);
                      showToast('Post hidden from your feed', 'info');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-brand-text-primary hover:bg-brand-surface text-left"
                  >
                    <EyeOff className="w-4 h-4 text-brand-text-secondary" />
                    <span>Not Interested</span>
                  </button>

                  <div className="border-t border-brand-border/60 my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowReport(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-brand-error hover:bg-brand-error/10 text-left"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Format-Specific Visuals / Media */}
      {post.mediaUrl && !imageError ? (
        post.type === 'video' || post.mediaType === 'video' || post.isReel ? (
          <div className="relative w-full rounded-xl mb-3 overflow-hidden bg-black shadow-md border border-brand-border/60">
            <video
              src={post.mediaUrl}
              controls
              playsInline
              loop
              className="w-full max-h-[520px] object-contain mx-auto"
            />
          </div>
        ) : (
          <div className="w-full rounded-xl mb-3 overflow-hidden bg-brand-surface border border-brand-border/60 shadow-sm">
            <img
              src={post.mediaUrl}
              alt=""
              onError={() => setImageError(true)}
              className="w-full max-h-[550px] object-cover mx-auto"
              loading="lazy"
            />
          </div>
        )
      ) : post.type === 'photo' && post.mediaPlaceholders && post.mediaPlaceholders[0] ? (
        <div
          className="w-full h-64 sm:h-80 rounded-xl mb-3 flex flex-col items-center justify-center p-4 text-center select-none shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${post.mediaPlaceholders[0].gradient[0]}, ${post.mediaPlaceholders[0].gradient[1]})`,
          }}
        >
          <span className="text-white font-bold text-lg drop-shadow-md">
            {post.mediaPlaceholders[0].label}
          </span>
          <span className="text-white/80 text-xs mt-1 drop-shadow">
            FitFolk Visual Demonstration
          </span>
        </div>
      ) : post.type === 'video' && post.mediaPlaceholders && post.mediaPlaceholders[0] ? (
        <div
          className="relative w-full h-72 sm:h-96 rounded-xl mb-3 flex items-center justify-center select-none overflow-hidden group cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${post.mediaPlaceholders[0].gradient[0]}, ${post.mediaPlaceholders[0].gradient[1]})`,
          }}
          onClick={() => showToast('Video playback demo active', 'info')}
        >
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl">
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white font-medium">
            {post.mediaPlaceholders[0].label} • 0:45
          </div>
        </div>
      ) : null}

      {post.type === 'progress' && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="h-48 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-brand-border flex flex-col items-center justify-center p-3 text-center">
            <span className="text-xs uppercase font-bold text-brand-text-secondary tracking-widest mb-1">
              Before
            </span>
            <span className="text-sm font-semibold text-brand-text-primary">
              {post.progressBefore || 'Month 1 Milestone'}
            </span>
            <span className="text-[10px] text-brand-text-secondary/70 mt-1">Starting point</span>
          </div>
          <div className="h-48 rounded-xl bg-gradient-to-br from-brand-accent/20 to-neutral-900 border border-brand-accent/40 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-xs uppercase font-bold text-brand-accent tracking-widest mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> After
            </span>
            <span className="text-sm font-semibold text-brand-text-primary">
              {post.progressAfter || 'Month 4 Transformation'}
            </span>
            <span className="text-[10px] text-brand-accent/80 mt-1">Consistency wins</span>
          </div>
        </div>
      )}

      {post.type === 'workout' && post.workoutData && (
        <div className="bg-brand-elevated border border-brand-border rounded-xl p-3.5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/15 text-brand-accent flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-text-primary">{post.workoutData.title}</h4>
                <p className="text-[11px] text-brand-text-secondary">
                  {post.workoutData.exerciseCount} exercises • {post.workoutData.duration} min duration
                </p>
              </div>
            </div>
            <button
              onClick={handleLogWorkout}
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <span>Log Routine</span>
            </button>
          </div>
          {post.workoutData.totalVolume && (
            <div className="text-[11px] text-brand-accent font-medium mt-1 bg-brand-accent/10 px-2 py-0.5 rounded inline-block">
              Estimated Total Volume: {post.workoutData.totalVolume} kg
            </div>
          )}
        </div>
      )}

      {post.type === 'nutrition' && post.nutritionData && (
        <div className="bg-brand-elevated border border-brand-border rounded-xl p-3.5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-text-primary">{post.nutritionData.mealName}</h4>
                <p className="text-[11px] text-brand-accent font-semibold">
                  {post.nutritionData.calories} kcal
                </p>
              </div>
            </div>
          </div>
          {/* Macro breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-brand-border/60">
            <div className="bg-brand-surface p-1.5 rounded-lg border border-brand-border/40">
              <div className="text-[10px] text-brand-text-secondary">Protein</div>
              <div className="text-xs font-bold text-brand-text-primary">{post.nutritionData.protein}g</div>
            </div>
            <div className="bg-brand-surface p-1.5 rounded-lg border border-brand-border/40">
              <div className="text-[10px] text-brand-text-secondary">Carbs</div>
              <div className="text-xs font-bold text-brand-text-primary">{post.nutritionData.carbs}g</div>
            </div>
            <div className="bg-brand-surface p-1.5 rounded-lg border border-brand-border/40">
              <div className="text-[10px] text-brand-text-secondary">Fat</div>
              <div className="text-xs font-bold text-brand-text-primary">{post.nutritionData.fat}g</div>
            </div>
          </div>
        </div>
      )}

      {post.type === 'poll' && localPollOptions && (
        <div className="bg-brand-elevated border border-brand-border rounded-xl p-3.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent mb-2.5">
            <Vote className="w-4 h-4" />
            <span>Community Fitness Poll</span>
          </div>
          <div className="space-y-2">
            {localPollOptions.map((opt) => {
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const hasVotedThis = votedOption === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={!!votedOption}
                  className={`w-full relative overflow-hidden p-2.5 rounded-lg border text-left text-xs transition-all ${
                    hasVotedThis
                      ? 'border-brand-accent bg-brand-accent/10 font-bold'
                      : 'border-brand-border bg-brand-surface hover:bg-brand-elevated'
                  }`}
                >
                  {/* Progress fill */}
                  {votedOption && (
                    <div
                      className="absolute inset-y-0 left-0 bg-brand-accent/20 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-brand-text-primary">{opt.text}</span>
                    {votedOption && (
                      <span className="font-semibold text-brand-accent text-xs">{pct}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-brand-text-secondary mt-2 flex items-center justify-between">
            <span>{totalVotes} total votes</span>
            <span>{votedOption ? 'Vote recorded' : 'Click to vote'}</span>
          </div>
        </div>
      )}

      {post.type === 'article' && (
        <div className="bg-brand-elevated border border-brand-border rounded-xl p-3.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Educational Article</span>
          </div>
          <h4 className="text-base font-bold text-brand-text-primary mb-1.5">
            {post.articleTitle}
          </h4>
          <p className="text-xs text-brand-text-secondary leading-relaxed mb-3">
            {post.articleBody}
          </p>
          {post.references && post.references.length > 0 && (
            <div className="pt-2 border-t border-brand-border/60">
              <span className="text-[10px] font-semibold text-brand-text-secondary uppercase">
                Peer-reviewed References:
              </span>
              <ul className="text-[10px] text-brand-text-secondary/80 list-disc list-inside mt-0.5 space-y-0.5">
                {post.references.map((ref, idx) => (
                  <li key={idx} className="truncate">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3. Caption */}
      <div className="text-xs text-brand-text-primary/90 leading-relaxed mb-2.5">
        <p>
          {expandedCaption || post.caption.length <= 140
            ? post.caption
            : `${post.caption.slice(0, 140)}... `}
          {post.caption.length > 140 && (
            <button
              onClick={() => setExpandedCaption((prev) => !prev)}
              className="text-brand-accent font-medium ml-1 hover:underline"
            >
              {expandedCaption ? 'show less' : 'more'}
            </button>
          )}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.hashtags.map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="text-brand-accent hover:underline text-[11px] font-medium"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-brand-border/50 text-xs">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={() => toggleLike(post.id)}
            className="flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-text-primary transition-colors group"
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart
              className={`w-4 h-4 transition-transform group-active:scale-125 ${
                isLiked ? 'fill-brand-error text-brand-error' : ''
              }`}
            />
            <span className={`text-[11px] ${isLiked ? 'text-brand-error font-semibold' : ''}`}>
              {post.likes + (isLiked && !post.isLiked ? 1 : 0)}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            aria-label="View comments"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px]">{post.comments.length}</span>
          </button>

          {/* Repost */}
          <button
            onClick={() => showToast('Reposted to your followers!', 'success')}
            className="flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-accent transition-colors"
            aria-label="Repost"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="text-[11px]">{post.reposts}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="p-1 rounded text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Save Bookmark */}
        <button
          onClick={() => {
            toggleSave(post.id);
            showToast(isSaved ? 'Removed from saved' : 'Saved to your collection', 'info');
          }}
          className="p-1 rounded text-brand-text-secondary hover:text-brand-accent transition-colors"
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-accent text-brand-accent' : ''}`} />
        </button>
      </div>

      {/* 5. Embedded Comment Section */}
      <CommentSection comments={post.comments} postId={post.id} isOpen={showComments} />

      {/* Share Dialog */}
      <ShareDialog isOpen={showShare} onClose={() => setShowShare(false)} postId={post.id} />

      {/* Report Dialog */}
      <ReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetType="post"
        targetId={post.id}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={() => {
          deletePost(post.id);
          showToast('Post permanently deleted', 'success');
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
      />
    </article>
  );
}
