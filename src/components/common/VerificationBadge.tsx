import { BadgeCheck } from 'lucide-react';
import type { VerificationCategory } from '../../types';

interface VerificationBadgeProps {
  category: VerificationCategory;
  size: 'sm' | 'md';
}

const categoryLabels: Record<VerificationCategory, string> = {
  personal_trainer: 'Personal Trainer',
  dietitian: 'Dietitian',
  doctor: 'Healthcare Pro',
  sports_coach: 'Sports Coach',
  yoga_instructor: 'Yoga Instructor',
  fitness_researcher: 'Fitness Researcher',
  fitness_influencer: 'Fitness Influencer',
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

export default function VerificationBadge({ category, size }: VerificationBadgeProps) {
  return (
    <span
      className="inline-flex items-center"
      title={categoryLabels[category]}
      aria-label={`Verified ${categoryLabels[category]}`}
    >
      <BadgeCheck
        className={`${sizeClasses[size]} text-white fill-[#0095F6]`}
      />
    </span>
  );
}
