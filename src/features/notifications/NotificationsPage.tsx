import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  ShieldAlert,
  CheckCheck,
  Radio,
  Flame,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { NotificationType } from '../../types';

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useDemoContext();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = state.notifications.filter((n) =>
    filter === 'unread' ? !n.isRead : true
  );

  const getIcon = (type: NotificationType, isSafety?: boolean) => {
    if (isSafety) return <ShieldAlert className="w-4 h-4 text-brand-warning" />;
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-brand-error fill-brand-error" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'follow':
      case 'follow_request':
        return <UserPlus className="w-4 h-4 text-brand-accent" />;
      case 'challenge_reminder':
      case 'challenge_result':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'live_reminder':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'achievement':
        return <Flame className="w-4 h-4 text-brand-accent" />;
      default:
        return <Bell className="w-4 h-4 text-brand-text-secondary" />;
    }
  };

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-accent" />
            <span>Activity Notifications</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Keep up with likes, workout comments, and challenge milestones.
          </p>
        </div>

        <button
          onClick={() => {
            markAllNotificationsRead();
            showToast('All notifications marked as read', 'info');
          }}
          className="text-xs text-brand-accent hover:underline flex items-center gap-1 font-semibold"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border mb-4 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-brand-accent text-brand-accent font-bold'
              : 'border-transparent text-brand-text-secondary'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-brand-accent text-brand-accent font-bold'
              : 'border-transparent text-brand-text-secondary'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card p-8 text-center text-xs text-brand-text-secondary italic">
            You're all caught up! No notifications right now.
          </div>
        ) : (
          notifications.map((n) => {
            const sender = state.users[n.fromUserId];

            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`card p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  n.isRead
                    ? 'bg-brand-surface border-brand-border/60 hover:bg-brand-elevated'
                    : 'bg-brand-elevated border-brand-accent/30 hover:border-brand-accent/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    {sender ? (
                      <Avatar user={sender} size="md" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-border" />
                    )}
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-brand-surface border border-brand-border">
                      {getIcon(n.type, n.isSafety)}
                    </div>
                  </div>

                  <div className="min-w-0 text-xs">
                    <p className="text-brand-text-primary leading-tight">
                      <strong>{sender?.displayName || 'FitFolk Member'}</strong> {n.message}
                    </p>
                    <span className="text-[10px] text-brand-text-secondary mt-0.5 block">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
