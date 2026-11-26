import { useState, useMemo } from 'react';
import { PlusSquare, Compass, Sparkles, Users } from 'lucide-react';
import StoryBar from './StoryBar';
import PostCard from '../../components/posts/PostCard';
import CreatePostDialog from '../../components/posts/CreatePostDialog';
import EmptyState from '../../components/common/EmptyState';
import { useDemoContext } from '../../app/providers/DemoContext';

type FeedTab = 'following' | 'recommended' | 'foryou';

export default function FeedPage() {
  const { state } = useDemoContext();
  const [activeTab, setActiveTab] = useState<FeedTab>('foryou');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const followingList = state.following[state.currentUserId] || [];

  // Filter and sort posts based on the active tab (excluding archived posts)
  const filteredPosts = useMemo(() => {
    const allPosts = state.posts.filter(
      (p) => !p.isArchived && !state.archivedPostIds?.includes(p.id)
    );

    if (activeTab === 'following') {
      return allPosts.filter(
        (p) => followingList.includes(p.userId) || p.userId === state.currentUserId
      );
    }

    if (activeTab === 'recommended') {
      // Posts from creators not yet followed, sorted by likes & engagement
      return allPosts
        .filter((p) => !followingList.includes(p.userId) && p.userId !== state.currentUserId)
        .sort((a, b) => b.likes - a.likes);
    }

    // 'foryou' is a curated balanced mix
    return allPosts;
  }, [state.posts, activeTab, followingList, state.currentUserId]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="py-2 px-3 sm:px-4">
      {/* 1. 24h Stories Bar */}
      <div className="mb-3">
        <StoryBar />
      </div>

      {/* 2. Feed Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-brand-bg/95 backdrop-blur-md pt-2 pb-3 mb-3 border-b border-brand-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('foryou');
              setVisibleCount(10);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'foryou'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface'
            }`}
          >
            For You
          </button>

          <button
            onClick={() => {
              setActiveTab('following');
              setVisibleCount(10);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'following'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
            <span className="text-[10px] opacity-80">({followingList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('recommended');
              setVisibleCount(10);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'recommended'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recommended</span>
          </button>
        </div>

        {/* Quick Post Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors px-2.5 py-1 rounded-lg hover:bg-brand-surface"
        >
          <PlusSquare className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* 3. Post Feed Stream */}
      {displayedPosts.length === 0 ? (
        <EmptyState
          icon={activeTab === 'following' ? Users : Sparkles}
          title={
            activeTab === 'following'
              ? 'No posts from followed accounts yet'
              : 'No matching posts found'
          }
          description={
            activeTab === 'following'
              ? 'Switch to the "For You" or "Recommended" tab to discover and follow more fitness enthusiasts and certified trainers.'
              : 'Try exploring other categories or create the first post in this feed!'
          }
          action={{
            label: activeTab === 'following' ? 'Explore Creators' : 'Create Post',
            onClick: () => {
              if (activeTab === 'following') {
                setActiveTab('recommended');
              } else {
                setIsCreateOpen(true);
              }
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Load More Button */}
          {visibleCount < filteredPosts.length && (
            <div className="py-4 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="btn-secondary text-xs px-6 py-2.5 hover:border-brand-accent/50"
              >
                Load More Posts ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
