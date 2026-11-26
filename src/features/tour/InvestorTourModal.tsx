import { useState } from 'react';
import {
  Compass,
  GraduationCap,
  Activity,
  MessageSquare,
  Trophy,
  TrendingUp,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
} from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Compass;
  badge: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Discover Fitness That Fits You',
    subtitle: 'A dedicated, algorithm-free fitness social experience',
    description:
      'Unlike generic social media, FitFolk is designed exclusively for health, strength, and movement. Explore user transformations, workout routines, and high-energy Reels without noise or non-fitness distraction.',
    icon: Compass,
    badge: '1. Discover',
    highlights: [
      'Tailored "Following", "Recommended", and "For You" feeds',
      'Interactive workout cards with one-click routine saving',
      'Media placeholders and local video demonstrations',
    ],
  },
  {
    title: 'Learn From Verified Professionals',
    subtitle: 'Evidence-based guidance with category verification',
    description:
      'Combat fitness misinformation. Certified personal trainers, registered dietitians, and sports coaches carry distinct tiered badges and cite references on educational posts.',
    icon: GraduationCap,
    badge: '2. Learn',
    highlights: [
      'Tiered verification: Trainers, Dietitians, Doctors, Coaches',
      'Scientific references and citation previews on articles',
      'Community reporting tools for misleading health claims',
    ],
  },
  {
    title: 'Track Workouts & Daily Nutrition',
    subtitle: 'Full-featured logging built directly into the social flow',
    description:
      'Log full workout routines with set-by-set weight and rest timers. Track daily macronutrients, calories, and hydration with a built-in searchable food library.',
    icon: Activity,
    badge: '3. Track',
    highlights: [
      'Interactive workout logger with active rest timer',
      'Food database with calories, protein, carbs, and fat metrics',
      'Water intake tracking and custom meal recipe creation',
    ],
  },
  {
    title: 'Connect Through Community Q&A & Chat',
    subtitle: 'Real camaraderie without intimidation',
    description:
      'Ask questions openly or anonymously. Get community advice and upvoted answers from verified fitness pros. Connect directly with creators via direct messages.',
    icon: MessageSquare,
    badge: '4. Connect',
    highlights: [
      'Community Q&A with accepted answers and pro badges',
      'Simulated direct messaging with sample conversation history',
      'Anonymous posting option for beginner questions',
    ],
  },
  {
    title: 'Participate in Challenges & Live Streams',
    subtitle: 'Healthy competition and shared milestones',
    description:
      'Join daily and weekly fitness challenges, check in on your progress, and view live interactive sessions hosted by trainers and creators.',
    icon: Trophy,
    badge: '5. Participate',
    highlights: [
      '30-Day Push-Up and Hydration challenges with leaderboards',
      'Simulated live broadcast rooms with real-time viewer chat',
      'Milestone reward badges and achievement unlocking',
    ],
  },
  {
    title: 'Grow Your Sustainable Habits',
    subtitle: 'Your fitness. Your people. Your progress.',
    description:
      'FitFolk bridges the gap between solitary tracking apps and superficial social networks. This prototype demonstrates the complete vision—running 100% locally with zero server cost.',
    icon: TrendingUp,
    badge: '6. Grow',
    highlights: [
      'Switch between 10 demo personas anytime to test perspectives',
      '100% free, static, client-side localStorage persistence',
      'One-click Demo Reset to restore fresh demonstration data',
    ],
  },
];

interface InvestorTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestorTourModal({ isOpen, onClose }: InvestorTourModalProps) {
  const { setTourCompleted } = useDemoContext();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleFinish = () => {
    setTourCompleted(true);
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-brand-border">
          <div
            className="h-full bg-brand-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="badge-accent font-semibold">{step.badge}</span>
            <span className="text-xs text-brand-text-secondary">
              Investor Walkthrough ({currentStep + 1} of {TOUR_STEPS.length})
            </span>
          </div>
          <button
            onClick={handleFinish}
            className="p-1 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-elevated transition-colors"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="px-6 py-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center shrink-0 text-brand-accent">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-text-primary">{step.title}</h3>
              <p className="text-xs text-brand-accent font-medium mt-0.5">{step.subtitle}</p>
            </div>
          </div>

          <p className="text-sm text-brand-text-secondary leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Highlights */}
          <div className="bg-brand-elevated border border-brand-border/60 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              Key Platform Highlights
            </h4>
            <ul className="space-y-2">
              {step.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-brand-text-primary">
                  <div className="w-4 h-4 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-brand-accent'
                    : 'w-2 bg-brand-border hover:bg-brand-text-secondary/50'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-brand-elevated/50 border-t border-brand-border">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-xs font-medium text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary px-3 py-1.5 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2"
            >
              <span>{isLast ? 'Explore FitFolk' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
