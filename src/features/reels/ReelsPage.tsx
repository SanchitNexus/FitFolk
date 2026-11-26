import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import ShareDialog from '../../components/posts/ShareDialog';
import CommentSection from '../../components/posts/CommentSection';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

export default function ReelsPage() {
  const { state, toggleLike, toggleSave, toggleFollow } = useDemoContext();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Filter video / reel posts, or provide rich sample reels (excluding archived)
  const reelPosts = state.posts.filter(
    (p) =>
      !p.isArchived &&
      !state.archivedPostIds?.includes(p.id) &&
      (p.type === 'video' || p.isReel || p.mediaPlaceholders?.some((m) => m.type === 'video'))
  );

  const reels =
    reelPosts.length > 0
      ? reelPosts
      : [
          {
            id: 'reel-demo-1',
            userId: 'user-zoe',
            type: 'video' as const,
            caption: '30-second HIIT burst! High knees to squat pulse. Do 4 rounds for maximum burn 🔥 #HIIT #CardioBurst',
            mediaPlaceholders: [
              {
                type: 'video' as const,
                gradient: ['#F43F5E', '#881337'] as [string, string],
                label: 'Dance HIIT Routine',
              },
            ],
            hashtags: ['#HIIT', '#Cardio'],
            topicTags: ['HIIT'],
            likes: 1420,
            comments: [],
            reposts: 89,
            createdAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false,
            isReposted: false,
          },
        ];

  const currentReel = reels[currentIndex] || reels[0];
  const author = state.users[currentReel.userId];
  const isFollowing = (state.following[state.currentUserId] || []).includes(currentReel.userId);
  const isLiked = state.likedPostIds.includes(currentReel.id) || currentReel.isLiked;
  const isSaved = state.savedPostIds.includes(currentReel.id) || currentReel.isSaved;

  const gradient = currentReel.mediaPlaceholders?.[0]?.gradient || ['#6366F1', '#312E81'];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowComments(false);
    } else {
      showToast('You reached the end of demonstration reels', 'info');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowComments(false);
    }
  };

  return (
    <div className="py-2 px-2 sm:px-4 flex justify-center select-none">
      <div className="relative w-full max-w-sm h-[82vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-brand-border/70 flex flex-col justify-between">
        {/* Reel Video or Animated Canvas */}
        {currentReel.mediaUrl ? (
          currentReel.mediaType === 'image' ? (
            <img
              src={currentReel.mediaUrl}
              alt={currentReel.caption}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              src={currentReel.mediaUrl}
              autoPlay={isPlaying}
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onClick={() => setIsPlaying(!isPlaying)}
            />
          )
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white"
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {/* Play/Pause overlay */}
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white mb-4 animate-scale-in">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            )}

            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 max-w-xs shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent block mb-1">
                Demonstration Reel
              </span>
              <p className="font-bold text-sm drop-shadow">{currentReel.mediaPlaceholders?.[0]?.label || 'Training Clip'}</p>
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent text-white">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            FitFolk Reels
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Overlay: Author info + Caption */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
          <div className="flex items-center justify-between gap-3 mb-2">
            <Link
              to={`/profile/${author?.username || 'user'}`}
              className="flex items-center gap-2 min-w-0"
            >
              {author && <Avatar user={author} size="sm" />}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs truncate">{author?.displayName}</span>
                  {author?.isVerified && author.verificationCategory && (
                    <VerificationBadge category={author.verificationCategory} size="sm" />
                  )}
                </div>
                <span className="text-[10px] text-white/80">@{author?.username}</span>
              </div>
            </Link>

            {author?.id !== state.currentUserId && (
              <button
                onClick={() => toggleFollow(currentReel.userId)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                  isFollowing
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-brand-accent text-brand-bg hover:bg-brand-accent-hover'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <p className="text-xs text-white/95 line-clamp-2 leading-relaxed mb-2">
            {currentReel.caption}
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-brand-accent font-medium">
            <ShieldAlert className="w-3 h-3" />
            <span>Form & Safety Checked</span>
          </div>

          {/* Embedded Comment Panel Drawer if toggled */}
          {showComments && (
            <div className="mt-3 bg-brand-surface/95 rounded-xl p-3 border border-brand-border text-brand-text-primary max-h-48 overflow-y-auto">
              <CommentSection
                comments={currentReel.comments}
                postId={currentReel.id}
                isOpen={true}
              />
            </div>
          )}
        </div>

        {/* Right Floating Actions Column */}
        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-3 text-white">
          {/* Like */}
          <button
            onClick={() => toggleLike(currentReel.id)}
            className="flex flex-col items-center gap-0.5 group"
            aria-label="Like reel"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform group-active:scale-125">
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-brand-error text-brand-error' : 'text-white'}`}
              />
            </div>
            <span className="text-[10px] font-bold drop-shadow">
              {currentReel.likes + (isLiked && !currentReel.isLiked ? 1 : 0)}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-0.5"
            aria-label="Comments"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold drop-shadow">
              {currentReel.comments.length}
            </span>
          </button>

          {/* Save Bookmark */}
          <button
            onClick={() => {
              toggleSave(currentReel.id);
              showToast(isSaved ? 'Removed from saved' : 'Reel saved', 'info');
            }}
            className="flex flex-col items-center gap-0.5"
            aria-label="Save reel"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Bookmark
                className={`w-5 h-5 ${isSaved ? 'fill-brand-accent text-brand-accent' : 'text-white'}`}
              />
            </div>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="flex flex-col items-center gap-0.5"
            aria-label="Share reel"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* Vertical Reel Steppers */}
          <div className="pt-2 flex flex-col gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1 rounded-full bg-black/40 disabled:opacity-20 text-white"
              aria-label="Previous reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === reels.length - 1}
              className="p-1 rounded-full bg-black/40 disabled:opacity-20 text-white"
              aria-label="Next reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ShareDialog isOpen={showShare} onClose={() => setShowShare(false)} postId={currentReel.id} />
    </div>
  );
}
