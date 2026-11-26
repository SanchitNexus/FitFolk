import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import type { User } from '../../types';

interface AvatarProps {
  user: User;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
}

const sizeMap = {
  xs: { px: 24, text: 'text-[8px]', badge: 10, ring: 1.5 },
  sm: { px: 32, text: 'text-[10px]', badge: 12, ring: 2 },
  md: { px: 40, text: 'text-xs', badge: 14, ring: 2 },
  lg: { px: 56, text: 'text-sm', badge: 16, ring: 2.5 },
  xl: { px: 80, text: 'text-lg', badge: 20, ring: 3 },
};

export default function Avatar({ user, size, hasStory }: AvatarProps) {
  const s = sizeMap[size];
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative inline-flex shrink-0 select-none" aria-label={user.displayName}>
      {/* Story ring */}
      {hasStory && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            padding: s.ring,
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <div className="w-full h-full rounded-full bg-brand-bg" />
        </div>
      )}

      {/* Avatar circle */}
      <div
        className="rounded-full flex items-center justify-center font-bold text-white overflow-hidden"
        style={{
          width: s.px,
          height: s.px,
          minWidth: s.px,
          background: `linear-gradient(135deg, ${user.avatarGradient[0]}, ${user.avatarGradient[1]})`,
          border: hasStory ? `${s.ring + 1}px solid transparent` : undefined,
        }}
      >
        {user.avatarUrl && !hasError ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-full h-full object-cover rounded-full"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className={s.text}>{user.avatarInitials}</span>
        )}
      </div>

      {/* Verification badge */}
      {user.isVerified && size !== 'xs' && (
        <div
          className="absolute bg-brand-bg dark:bg-brand-bg rounded-full flex items-center justify-center"
          style={{
            width: s.badge,
            height: s.badge,
            bottom: 0,
            right: 0,
          }}
        >
          <BadgeCheck
            className="text-[#0095F6] fill-[#0095F6] text-white"
            style={{ width: s.badge, height: s.badge }}
          />
        </div>
      )}
    </div>
  );
}
