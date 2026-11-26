import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, X } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';

interface FollowersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  userId: string;
}

export default function FollowersDialog({ isOpen, onClose, type, userId }: FollowersDialogProps) {
  const { state, toggleFollow } = useDemoContext();
  const [search, setSearch] = useState('');

  const targetUser = state.users[userId];
  const listIds =
    type === 'followers'
      ? state.followers[userId] || []
      : state.following[userId] || [];

  const currentUserFollowing = state.following[state.currentUserId] || [];

  const usersList = listIds
    .map((id) => state.users[id])
    .filter(Boolean)
    .filter(
      (u) =>
        u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'followers' ? 'Followers' : 'Following'}
    >
      <div className="space-y-3 text-xs">
        {/* Search filter */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter accounts..."
          className="input-field text-xs py-2"
        />

        {/* User list */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {usersList.length === 0 ? (
            <p className="text-center py-6 text-brand-text-secondary/70 italic text-xs">
              No {type} found.
            </p>
          ) : (
            usersList.map((u) => {
              const isFollowing = currentUserFollowing.includes(u.id);
              const isSelf = u.id === state.currentUserId;

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-elevated transition-colors"
                >
                  <Link
                    to={`/profile/${u.username}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <Avatar user={u} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-brand-text-primary truncate">
                          {u.displayName}
                        </span>
                        {u.isVerified && u.verificationCategory && (
                          <VerificationBadge category={u.verificationCategory} size="sm" />
                        )}
                      </div>
                      <span className="text-[10px] text-brand-text-secondary">@{u.username}</span>
                    </div>
                  </Link>

                  {!isSelf && (
                    <button
                      onClick={() => toggleFollow(u.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
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
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
