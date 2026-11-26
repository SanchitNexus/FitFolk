import { Bookmark } from 'lucide-react';
import PostCard from '../../components/posts/PostCard';
import EmptyState from '../../components/common/EmptyState';
import { useDemoContext } from '../../app/providers/DemoContext';

export default function SavedPage() {
  const { state } = useDemoContext();

  const savedPosts = state.posts.filter((p) => state.savedPostIds.includes(p.id) || p.isSaved);

  return (
    <div className="py-3 px-3 sm:px-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-brand-accent fill-brand-accent" />
          <span>Saved Collection</span>
        </h2>
        <p className="text-xs text-brand-text-secondary">
          Workouts, nutrition advice, and educational articles you have bookmarked for later.
        </p>
      </div>

      {savedPosts.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved posts yet"
          description="Click the bookmark icon on any post, workout, or recipe card to save it here for quick access."
        />
      ) : (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
