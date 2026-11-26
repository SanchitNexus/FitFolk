import { useState } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  Plus,
  ShieldAlert,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Challenge } from '../../types';

export default function ChallengesPage() {
  const { state, joinChallenge, updateChallengeProgress } = useDemoContext();
  const { showToast } = useToast();

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');

  const challengesList =
    activeTab === 'joined' ? state.challenges.filter((c) => c.isJoined) : state.challenges;

  const handleJoin = (challengeId: string) => {
    joinChallenge(challengeId);
    showToast('Joined fitness challenge! You got this!', 'success');
  };

  const handleCheckIn = (challenge: Challenge) => {
    const newProgress = Math.min(100, challenge.progress + 15);
    updateChallengeProgress(challenge.id, newProgress);
    showToast(`Checked in! Progress updated to ${newProgress}%.`, 'success');
  };

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-accent" />
            <span>Fitness Challenges</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Join community streaks, hit personal milestones, and unlock achievement badges.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-brand-accent text-brand-accent font-bold'
              : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
          }`}
        >
          Discover All ({state.challenges.length})
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'joined'
              ? 'border-brand-accent text-brand-accent font-bold'
              : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
          }`}
        >
          My Active Streaks ({state.challenges.filter((c) => c.isJoined).length})
        </button>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challengesList.map((ch) => (
          <div
            key={ch.id}
            className="card p-4 bg-brand-surface border border-brand-border rounded-2xl space-y-3 hover:border-brand-accent/40 transition-colors"
          >
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                    {ch.type} challenge
                  </span>
                  <span className="text-[11px] text-brand-text-secondary flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{ch.participantCount} active members</span>
                  </span>
                </div>
                <h3 className="font-bold text-base text-brand-text-primary">{ch.title}</h3>
                <p className="text-xs text-brand-text-secondary mt-1">{ch.description}</p>
              </div>

              {ch.isJoined && (
                <span className="badge-accent shrink-0 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Enrolled</span>
                </span>
              )}
            </div>

            {/* Goal & Rules Preview */}
            <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border/60 text-xs space-y-1.5">
              <div className="font-semibold text-brand-text-primary flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-brand-accent" />
                <span>Goal: {ch.goal}</span>
              </div>
              <ul className="text-[11px] text-brand-text-secondary list-disc list-inside space-y-0.5">
                {ch.rules.slice(0, 2).map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Progress Bar (if joined) */}
            {ch.isJoined && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-brand-text-secondary">Your Check-in Progress</span>
                  <span className="font-bold text-brand-accent">{ch.progress}%</span>
                </div>
                <div className="w-full bg-brand-elevated h-2 rounded-full overflow-hidden border border-brand-border/60">
                  <div
                    className="bg-brand-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${ch.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
              <button
                onClick={() => setSelectedChallenge(ch)}
                className="text-brand-text-secondary hover:text-brand-text-primary flex items-center gap-1 font-medium"
              >
                <span>View Rules & Leaderboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {ch.isJoined ? (
                  <button
                    onClick={() => handleCheckIn(ch)}
                    className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Check-in Today</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(ch.id)}
                    className="btn-primary text-xs px-4 py-1.5 font-bold"
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Detail & Leaderboard Modal */}
      {selectedChallenge && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedChallenge(null)}
          title={selectedChallenge.title}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-brand-text-secondary leading-relaxed">
              {selectedChallenge.description}
            </p>

            {/* Rules */}
            <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border/60 space-y-1.5">
              <h4 className="font-bold text-brand-text-primary text-xs">Challenge Guidelines:</h4>
              <ul className="text-[11px] text-brand-text-secondary list-disc list-inside space-y-1">
                {selectedChallenge.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Safety Guidelines */}
            <div className="p-3 bg-brand-warning/10 rounded-xl border border-brand-warning/30 text-brand-warning space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety First</span>
              </div>
              <ul className="text-[10px] list-disc list-inside space-y-0.5">
                {selectedChallenge.safetyGuidelines.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>

            {/* Leaderboard Demonstration */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-xs text-brand-text-primary flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-accent" />
                <span>Demonstration Leaderboard</span>
              </h4>
              <div className="space-y-1.5">
                {selectedChallenge.leaderboard.map((entry) => {
                  const user = state.users[entry.userId];
                  return (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated border border-brand-border/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-brand-accent w-5">#{entry.rank}</span>
                        {user && <Avatar user={user} size="xs" />}
                        <span className="font-semibold text-brand-text-primary">
                          {user?.displayName || 'Athlete'}
                        </span>
                      </div>
                      <span className="font-bold text-brand-text-primary">
                        {entry.score} pts ({entry.progress}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-brand-border">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="btn-primary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
