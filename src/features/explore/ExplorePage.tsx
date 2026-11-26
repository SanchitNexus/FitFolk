import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Users,
  Dumbbell,
  Utensils,
  BookOpen,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import EmptyState from '../../components/common/EmptyState';
import { useDemoContext } from '../../app/providers/DemoContext';

type CategoryFilter = 'all' | 'people' | 'workouts' | 'nutrition' | 'exercises' | 'topics';

export default function ExplorePage() {
  const { state, addRecentSearch, clearRecentSearches, toggleFollow } = useDemoContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const followingList = state.following[state.currentUserId] || [];

  // Update query if URL param changes
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      setSearchParams({ q: query.trim() });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  // Autocomplete / Search filtering
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedUsers = Object.values(state.users).filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.fitnessInterests.some((i) => i.toLowerCase().includes(q))
    );

    const matchedPosts = state.posts.filter(
      (p) =>
        !p.isArchived &&
        !state.archivedPostIds?.includes(p.id) &&
        (p.caption.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q)) ||
          p.workoutData?.title.toLowerCase().includes(q) ||
          p.nutritionData?.mealName.toLowerCase().includes(q))
    );

    const matchedExercises = state.exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroup.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );

    return {
      users: matchedUsers,
      posts: matchedPosts,
      exercises: matchedExercises,
    };
  }, [query, state.users, state.posts, state.exercises]);

  const trendingTags = [
    { tag: '#FullBodyHIIT', count: '1.4k posts', desc: 'High intensity interval training' },
    { tag: '#PushUpChallenge', count: '1.1k posts', desc: '30-day progressive pushups' },
    { tag: '#HighProteinMeal', count: '940 posts', desc: 'Muscle-building nutrition ideas' },
    { tag: '#FormCheck', count: '520 posts', desc: 'Community technique reviews' },
    { tag: '#MorningRunner', count: '410 posts', desc: 'Early sunrise running sessions' },
  ];

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* 1. Search Bar */}
      <div className="relative mb-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-brand-text-secondary absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) setSearchParams({});
            }}
            placeholder="Search creators, workouts, exercises, or #hashtags..."
            className="input-field pl-10 pr-9 text-xs py-2.5 rounded-xl bg-brand-surface border-brand-border"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 text-brand-text-secondary hover:text-brand-text-primary"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none">
        {[
          { id: 'all' as CategoryFilter, label: 'All' },
          { id: 'people' as CategoryFilter, label: 'People & Creators' },
          { id: 'workouts' as CategoryFilter, label: 'Workouts' },
          { id: 'exercises' as CategoryFilter, label: 'Exercises' },
          { id: 'nutrition' as CategoryFilter, label: 'Nutrition' },
          { id: 'topics' as CategoryFilter, label: 'Topics & Tags' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === id
                ? 'bg-brand-accent text-brand-bg font-semibold'
                : 'bg-brand-surface text-brand-text-secondary border border-brand-border/60 hover:text-brand-text-primary hover:bg-brand-elevated'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3. Search Results State */}
      {searchResults ? (
        <div className="space-y-6">
          {/* Matched Creators */}
          {(activeCategory === 'all' || activeCategory === 'people') && (
            <div>
              <h3 className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-accent" />
                Creators ({searchResults.users.length})
              </h3>
              {searchResults.users.length === 0 ? (
                <p className="text-xs text-brand-text-secondary/70 italic py-1">No creators matched</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.users.map((user) => {
                    const isFollowing = followingList.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        className="card p-3 flex items-center justify-between gap-3 bg-brand-surface hover:bg-brand-elevated transition-colors"
                      >
                        <Link
                          to={`/profile/${user.username}`}
                          className="flex items-center gap-3 min-w-0"
                        >
                          <Avatar user={user} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-brand-text-primary truncate">
                                {user.displayName}
                              </span>
                              {user.isVerified && user.verificationCategory && (
                                <VerificationBadge
                                  category={user.verificationCategory}
                                  size="sm"
                                />
                              )}
                            </div>
                            <p className="text-[11px] text-brand-text-secondary truncate">
                              @{user.username}
                            </p>
                            <p className="text-[10px] text-brand-text-secondary/80 truncate mt-0.5">
                              {user.bio}
                            </p>
                          </div>
                        </Link>
                        {user.id !== state.currentUserId && (
                          <button
                            onClick={() => toggleFollow(user.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                              isFollowing
                                ? 'bg-brand-elevated border border-brand-border text-brand-text-secondary'
                                : 'bg-brand-accent text-brand-bg font-semibold hover:bg-brand-accent-hover'
                            }`}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Matched Exercises */}
          {(activeCategory === 'all' || activeCategory === 'exercises') && (
            <div>
              <h3 className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-brand-accent" />
                Exercise Database ({searchResults.exercises.length})
              </h3>
              {searchResults.exercises.length === 0 ? (
                <p className="text-xs text-brand-text-secondary/70 italic py-1">No exercises matched</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchResults.exercises.map((ex) => (
                    <Link
                      key={ex.id}
                      to="/workouts"
                      className="card p-3 bg-brand-surface hover:bg-brand-elevated transition-colors border border-brand-border/70"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-brand-text-primary">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-brand-accent uppercase font-bold">
                          {ex.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-text-secondary mt-1">
                        Target: {ex.muscleGroup} • Equipment: {ex.equipment}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Matched Posts */}
          {(activeCategory === 'all' || activeCategory === 'workouts' || activeCategory === 'nutrition') && (
            <div>
              <h3 className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-accent" />
                Relevant Posts ({searchResults.posts.length})
              </h3>
              {searchResults.posts.length === 0 ? (
                <p className="text-xs text-brand-text-secondary/70 italic py-1">No posts matched</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.posts.map((post) => (
                    <div
                      key={post.id}
                      className="card p-3 bg-brand-surface hover:bg-brand-elevated transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-brand-text-secondary mb-1">
                        <span className="uppercase font-bold text-brand-accent text-[10px]">
                          {post.type}
                        </span>
                        <span>{post.likes} likes</span>
                      </div>
                      <p className="text-xs text-brand-text-primary line-clamp-2">{post.caption}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Default Explore Grid: Trending Topics & Discover Grid */
        <div className="space-y-6">
          {/* Recent Searches */}
          {state.recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand-text-secondary">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] text-brand-accent hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-text-primary hover:bg-brand-elevated transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discover FitFolk Athletes & Creators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-accent" />
                FitFolk Athletes ({Object.keys(state.users).length})
              </h3>
              <span className="text-[10px] text-brand-text-secondary">Tap to view profile & follow</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(state.users)
                .filter((u) => u.id !== state.currentUserId)
                .slice(0, 8)
                .map((u) => {
                  const isFollowing = followingList.includes(u.id);
                  const userPostsCount = state.posts.filter((p) => p.userId === u.id).length;
                  return (
                    <div
                      key={u.id}
                      className="card p-3 flex items-center justify-between gap-3 bg-brand-surface hover:bg-brand-elevated border border-brand-border/70 rounded-xl transition-all"
                    >
                      <Link to={`/profile/${u.username}`} className="flex items-center gap-2.5 min-w-0">
                        <Avatar user={u} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs text-brand-text-primary truncate">
                              {u.displayName}
                            </span>
                            {u.isVerified && u.verificationCategory && (
                              <VerificationBadge category={u.verificationCategory} size="sm" />
                            )}
                          </div>
                          <p className="text-[11px] text-brand-text-secondary truncate">@{u.username}</p>
                          <p className="text-[10px] text-brand-text-secondary/80 truncate">
                            {userPostsCount} posts • {(state.followers[u.id] || []).length} followers
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={() => toggleFollow(u.id)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                          isFollowing
                            ? 'bg-brand-elevated border border-brand-border text-brand-text-secondary hover:text-brand-error'
                            : 'bg-brand-accent text-brand-bg hover:bg-brand-accent-hover'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Trending Fitness Topics */}
          <div>
            <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              Trending in Community
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {trendingTags.map((item) => (
                <div
                  key={item.tag}
                  onClick={() => {
                    setQuery(item.tag);
                    setSearchParams({ q: item.tag });
                  }}
                  className="card p-3 bg-brand-surface hover:bg-brand-elevated border border-brand-border/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-brand-accent">{item.tag}</span>
                    <span className="text-[10px] text-brand-text-secondary">{item.count}</span>
                  </div>
                  <p className="text-[11px] text-brand-text-secondary mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Discovery Tiles */}
          <div>
            <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-accent" />
              Explore Workouts & Inspiration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {state.posts
                .filter((p) => !p.isArchived && !state.archivedPostIds?.includes(p.id))
                .slice(0, 9)
                .map((post, idx) => {
                const gradient =
                  post.mediaPlaceholders?.[0]?.gradient ||
                  (idx % 2 === 0
                    ? (['#10B981', '#064E3B'] as [string, string])
                    : (['#6366F1', '#312E81'] as [string, string]));

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      setQuery(post.caption.slice(0, 20));
                      setSearchParams({ q: post.caption.slice(0, 20) });
                    }}
                    className="aspect-square rounded-xl p-3 flex flex-col justify-between text-white cursor-pointer select-none hover:opacity-90 transition-opacity shadow-sm"
                    style={{
                      background: post.mediaUrl
                        ? `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url(${post.mediaUrl}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded self-start">
                      {post.type}
                    </span>
                    <p className="text-xs font-semibold line-clamp-3 drop-shadow">
                      {post.caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
