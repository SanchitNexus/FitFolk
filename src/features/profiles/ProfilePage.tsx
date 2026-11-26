import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Award,
  Dumbbell,
  Film,
  Grid,
  Lock,
  UserPlus,
  UserCheck,
  Edit3,
  ExternalLink,
  Flame,
  ShieldCheck,
  MessageCircle,
  Play,
  Camera,
  Archive,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import PostCard from '../../components/posts/PostCard';
import EditProfileDialog from './EditProfileDialog';
import FollowersDialog from './FollowersDialog';
import EmptyState from '../../components/common/EmptyState';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

type ProfileTab = 'posts' | 'reels' | 'workouts' | 'achievements' | 'archive';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { state, toggleFollow } = useDemoContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);

  // Look up user by username or id (or fallback to current user)
  const user =
    Object.values(state.users).find((u) => u.username === username || u.id === username) ||
    state.users[state.currentUserId];
  const isSelf = user.id === state.currentUserId;
  const isFollowing = (state.following[state.currentUserId] || []).includes(user.id);

  // User posts, reels, workouts, and archives
  const allUserPosts = state.posts.filter((p) => p.userId === user.id);
  const activeUserPosts = allUserPosts.filter(
    (p) => !p.isArchived && !state.archivedPostIds?.includes(p.id)
  );
  const userArchivedPosts = allUserPosts.filter(
    (p) => p.isArchived || state.archivedPostIds?.includes(p.id)
  );
  const userReels = activeUserPosts.filter(
    (p) => p.type === 'video' || p.isReel || p.mediaType === 'video' || p.mediaPlaceholders?.some((m) => m.type === 'video')
  );
  const userGridPosts = activeUserPosts.filter((p) => !p.isReel && p.type !== 'video');
  const userWorkouts = state.workouts.filter((w) => w.userId === user.id);

  const followersCount = (state.followers[user.id] || []).length;
  const followingCount = (state.following[user.id] || []).length;

  return (
    <div className="py-4 px-3 sm:px-4">
      {/* 1. Profile Header */}
      <div className="card p-4 sm:p-6 mb-4 bg-brand-surface border border-brand-border/80 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
          <div
            className={isSelf ? 'cursor-pointer hover:opacity-95 transition-opacity relative group' : ''}
            onClick={isSelf ? () => setIsEditOpen(true) : undefined}
            title={isSelf ? 'Change profile picture' : undefined}
          >
            <Avatar user={user} size="xl" />
            {isSelf && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white drop-shadow" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-brand-text-primary truncate">
                {user.displayName}
              </h2>
              {user.isVerified && user.verificationCategory && (
                <VerificationBadge category={user.verificationCategory} size="md" />
              )}
            </div>
            <p className="text-xs text-brand-text-secondary mb-3">@{user.username}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelf ? (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="btn-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`text-xs px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-brand-elevated border border-brand-border text-brand-text-secondary hover:text-brand-error'
                        : 'bg-brand-accent text-brand-bg hover:bg-brand-accent-hover'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/messages"
                    className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-brand-text-primary/95 leading-relaxed mb-4 whitespace-pre-line">
          {user.bio}
        </p>

        {/* Professional Credential Spotlight (if verified) */}
        {user.isVerified && user.credentials && user.credentials.length > 0 && (
          <div className="p-3 bg-brand-elevated/70 rounded-xl border border-brand-border/60 mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Professional Credentials</span>
            </div>
            <div className="space-y-1">
              {user.credentials.map((cred, idx) => (
                <div key={idx} className="text-[11px] text-brand-text-secondary">
                  <strong>{cred.title}</strong> • {cred.issuer} ({cred.year})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-around sm:justify-start sm:gap-8 py-3 border-y border-brand-border/50 text-center text-xs">
          <div>
            <div className="font-bold text-sm text-brand-text-primary">{userGridPosts.length}</div>
            <div className="text-[10px] text-brand-text-secondary">Posts</div>
          </div>
          <div>
            <div className="font-bold text-sm text-brand-text-primary">{userReels.length}</div>
            <div className="text-[10px] text-brand-text-secondary">Reels</div>
          </div>
          <button
            onClick={() => setFollowModalType('followers')}
            className="hover:opacity-80 transition-opacity"
          >
            <div className="font-bold text-sm text-brand-text-primary">{followersCount}</div>
            <div className="text-[10px] text-brand-text-secondary">Followers</div>
          </button>
          <button
            onClick={() => setFollowModalType('following')}
            className="hover:opacity-80 transition-opacity"
          >
            <div className="font-bold text-sm text-brand-text-primary">{followingCount}</div>
            <div className="text-[10px] text-brand-text-secondary">Following</div>
          </button>
          <div>
            <div className="font-bold text-sm text-brand-text-primary">{userWorkouts.length}</div>
            <div className="text-[10px] text-brand-text-secondary">Workouts</div>
          </div>
        </div>

        {/* Fitness Interests & Goals Tags */}
        <div className="pt-3 space-y-2">
          {user.fitnessInterests.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-brand-text-secondary">
                Interests:
              </span>
              {user.fitnessInterests.map((interest) => (
                <span
                  key={interest}
                  className="badge bg-brand-elevated text-brand-text-secondary border border-brand-border/60 text-[10px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          {user.fitnessGoals.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-brand-accent">Goals:</span>
              {user.fitnessGoals.map((goal) => (
                <span
                  key={goal}
                  className="badge bg-brand-accent/10 text-brand-accent border border-brand-accent/30 text-[10px]"
                >
                  {goal}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Personal Records Spotlight (if any) */}
      {user.personalRecords && user.personalRecords.length > 0 && (
        <div className="card p-3.5 mb-4 bg-brand-surface border border-brand-border/70 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text-primary uppercase tracking-wider mb-2.5">
            <Flame className="w-4 h-4 text-brand-accent" />
            <span>Personal Bests & Records</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {user.personalRecords.map((pr, i) => (
              <div key={i} className="bg-brand-elevated p-2.5 rounded-xl border border-brand-border/50">
                <div className="text-[10px] text-brand-text-secondary truncate">{pr.exercise}</div>
                <div className="text-xs font-bold text-brand-accent mt-0.5">{pr.value}</div>
                <div className="text-[9px] text-brand-text-secondary/70 mt-0.5">{pr.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Section Tabs */}
      <div className="flex items-center justify-around border-b border-brand-border mb-4 text-xs font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'posts' as ProfileTab, label: 'Posts', icon: Grid, count: userGridPosts.length },
          { id: 'reels' as ProfileTab, label: 'Reels', icon: Film, count: userReels.length },
          { id: 'workouts' as ProfileTab, label: 'Workouts', icon: Dumbbell, count: userWorkouts.length },
          {
            id: 'achievements' as ProfileTab,
            label: 'Awards',
            icon: Award,
            count: user.achievements?.length || 0,
          },
          ...(isSelf
            ? [
                {
                  id: 'archive' as ProfileTab,
                  label: 'Archive',
                  icon: Archive,
                  count: userArchivedPosts.length,
                },
              ]
            : []),
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-2.5 pt-1 px-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            <span className="text-[10px] opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* 4. Tab Panels */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userGridPosts.length === 0 ? (
            <EmptyState
              icon={Grid}
              title="No posts published yet"
              description="Posts shared by this creator will appear here."
            />
          ) : (
            userGridPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {userReels.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Film}
                title="No Reels uploaded"
                description="Short-form workout demonstrations and tips will show up here."
              />
            </div>
          ) : (
            userReels.map((reel) => {
              const gradient = reel.mediaPlaceholders?.[0]?.gradient || ['#6366F1', '#312E81'];
              return (
                <Link
                  key={reel.id}
                  to="/reels"
                  className="aspect-[9/16] rounded-xl p-3 flex flex-col justify-between text-white shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform bg-black"
                  style={{
                    background: reel.mediaUrl ? '#000000' : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                  }}
                >
                  {reel.mediaUrl && (
                    reel.mediaType === 'image' ? (
                      <img src={reel.mediaUrl} alt={reel.caption} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <video src={reel.mediaUrl} muted playsInline loop className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )
                  )}
                  <div className="flex items-center justify-between w-full relative z-10">
                    <span className="text-[10px] font-bold uppercase bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                      Reel
                    </span>
                    <Play className="w-4 h-4 text-white fill-white opacity-90 group-hover:opacity-100 transition-opacity drop-shadow" />
                  </div>
                  <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent -mx-3 -mb-3 p-3 pt-6 rounded-b-xl">
                    <p className="text-xs font-semibold line-clamp-2 drop-shadow mb-1">{reel.caption}</p>
                    <div className="flex items-center gap-2 text-[10px] text-white/90">
                      <span>❤️ {reel.likes}</span>
                      <span>💬 {reel.comments.length}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="space-y-2.5">
          {userWorkouts.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title="No logged workouts"
              description="Completed workout routines will be logged here."
            />
          ) : (
            userWorkouts.map((wk) => (
              <div
                key={wk.id}
                className="card p-3 bg-brand-surface border border-brand-border/70 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-brand-text-primary">{wk.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-brand-text-secondary mt-0.5">
                    <span>{wk.date}</span>
                    <span>•</span>
                    <span>{wk.duration} mins</span>
                    {wk.calories && (
                      <>
                        <span>•</span>
                        <span className="text-brand-accent">{wk.calories} kcal</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(user.achievements || []).length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Award}
                title="No achievements yet"
                description="Complete community challenges and consistent workout streaks to earn badges."
              />
            </div>
          ) : (
            user.achievements?.map((ach) => (
              <div
                key={ach.id}
                className="card p-3 bg-brand-surface border border-brand-border/70 rounded-xl flex items-center gap-3"
              >
                <div className="text-2xl">{ach.icon}</div>
                <div>
                  <h4 className="font-bold text-xs text-brand-text-primary">{ach.title}</h4>
                  <p className="text-[11px] text-brand-text-secondary">{ach.description}</p>
                  <span className="text-[9px] text-brand-text-secondary/70">
                    Earned {ach.earnedDate}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'archive' && isSelf && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <Archive className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Only you can see posts in your archive. Click options (...) on any post to restore it to your profile or delete it.</span>
          </div>
          {userArchivedPosts.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="No archived posts"
              description="Posts you archive will be stored here privately and hidden from your public profile."
            />
          ) : (
            userArchivedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />

      {/* Followers / Following Dialog */}
      {followModalType && (
        <FollowersDialog
          isOpen={true}
          onClose={() => setFollowModalType(null)}
          type={followModalType}
          userId={user.id}
        />
      )}
    </div>
  );
}
