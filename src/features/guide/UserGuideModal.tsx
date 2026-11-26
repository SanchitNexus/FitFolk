import { useState } from 'react';
import {
  BookOpen,
  Dumbbell,
  Utensils,
  Bot,
  QrCode,
  Users,
  Key,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { isOwnerDevice } from '../../lib/deviceAuth';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'overview' | 'workouts' | 'nutrition' | 'ai-coach' | 'qr-code' | 'accounts';

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const { state, login } = useDemoContext();
  const [activeTab, setActiveTab] = useState<GuideTab>('overview');
  const isOwner = isOwnerDevice();

  const DEMO_CREDENTIALS = [
    {
      name: 'Priya Sharma',
      username: 'priya_fitstart',
      role: 'Beginner Athlete',
      badge: 'Beginner',
      focus: 'Starting weight loss journey, basic form',
      password: 'fitfolk123',
    },
    {
      name: 'Marcus Chen',
      username: 'iron_marcus',
      role: 'Gym & Strength Enthusiast',
      badge: 'Powerbuilder',
      focus: 'PRs (140kg bench, 210kg DL), heavy lifts',
      password: 'fitfolk123',
    },
    {
      name: 'Dr. Sarah Williams',
      username: 'coach_sarah',
      role: 'Certified Coach (CSCS / ACE)',
      badge: 'Verified Trainer',
      focus: 'Evidence-based programming & technique',
      password: 'fitfolk123',
    },
    {
      name: 'Dr. Raj Patel',
      username: 'nutrition_raj',
      role: 'Registered Dietitian (RDN, PhD)',
      badge: 'Verified Dietitian',
      focus: 'Sports nutrition, macro science, fueling',
      password: 'fitfolk123',
    },
    {
      name: 'Zoe Martinez',
      username: 'zoe_moves',
      role: 'Fitness Creator & Dancer',
      badge: 'Creator',
      focus: 'HIIT reels, dance fitness, community energy',
      password: 'fitfolk123',
    },
    {
      name: 'Aisha Mohammed',
      username: 'running_aisha',
      role: 'Marathon Runner & Yogi',
      badge: 'Endurance',
      focus: 'Boston marathon prep (3:28 PR), yoga flows',
      password: 'fitfolk123',
    },
    {
      name: 'Coach Mike',
      username: 'coachmike_pro',
      role: 'D1 Strength & Conditioning Coach',
      badge: 'Verified Coach',
      focus: 'Athletic power, clean & jerk, injury rehab',
      password: 'fitfolk123',
    },
    {
      name: 'Luna Kim',
      username: 'luna_lifts',
      role: 'Competitive Powerlifter (63kg)',
      badge: 'IPF Athlete',
      focus: 'Squat 142.5kg, Bench 80kg, Deadlift 170kg',
      password: 'fitfolk123',
    },
    {
      name: 'Alex Rivera',
      username: 'alex_wellness',
      role: 'Holistic Yoga Teacher (RYT-200)',
      badge: 'Wellness Pro',
      focus: 'Mindfulness, plant-based nutrition, mobility',
      password: 'fitfolk123',
    },
    {
      name: 'Jake Thompson',
      username: 'curious_jake',
      role: 'Tech Worker / Fitness Novice',
      badge: 'Community',
      focus: 'Learning from verified pros in Community Q&A',
      password: 'fitfolk123',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FitFolk Platform & User Guide" size="lg">
      <div className="space-y-4 text-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-brand-border pb-1 overflow-x-auto scrollbar-none font-semibold">
          {[
            { id: 'overview' as GuideTab, label: 'Overview', icon: Compass },
            { id: 'workouts' as GuideTab, label: 'Workouts', icon: Dumbbell },
            { id: 'nutrition' as GuideTab, label: 'Nutrition', icon: Utensils },
            { id: 'ai-coach' as GuideTab, label: 'AI Coach', icon: Bot },
            { id: 'qr-code' as GuideTab, label: 'Mobile QR', icon: QrCode },
            ...(isOwner ? [{ id: 'accounts' as GuideTab, label: 'Accounts Directory', icon: Key }] : []),
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'bg-[#0095F6] text-white font-bold'
                  : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-elevated'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-brand-surface to-brand-elevated border border-brand-border space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex items-center justify-center shrink-0 border border-brand-border/60">
                  <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center">
                  <span className="font-black text-2xl tracking-tight text-brand-text-primary">Fit</span>
                  <span className="font-black text-2xl tracking-tight text-[#99FF00]">folk</span>
                </div>
              </div>
              <p className="text-brand-text-primary font-semibold text-sm">
                Your Fitness. Your People. Your Progress.
              </p>
              <p className="text-brand-text-secondary leading-relaxed">
                FitFolk is an Instagram-style fitness community platform built without paid servers or databases. It combines social reels, 24h stories, set-by-set workout tracking, scientific nutrition macros, community Q&A, and a local AI Fitness Coach.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="card p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-text-primary">
                  <Shield className="w-4 h-4 text-[#0095F6]" />
                  <span>Verified Credentials</span>
                </div>
                <p className="text-[11px] text-brand-text-secondary">
                  Certified coaches and dietitians display verified badges so you learn from qualified specialists.
                </p>
              </div>

              <div className="card p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-text-primary">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Zero Cost ($0)</span>
                </div>
                <p className="text-[11px] text-brand-text-secondary">
                  Runs with browser localStorage persistence. No monthly cloud bills, no paid APIs, no hidden costs.
                </p>
              </div>

              <div className="card p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-text-primary">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>Instant Mobile Join</span>
                </div>
                <p className="text-[11px] text-brand-text-secondary">
                  Scan the QR code with any smartphone camera to open the web app and register in seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Workouts */}
        {activeTab === 'workouts' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border space-y-2">
              <h4 className="font-bold text-brand-text-primary text-sm flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#0095F6]" />
                <span>How the Workout Tracker Works</span>
              </h4>
              <p className="text-brand-text-secondary leading-relaxed">
                Navigate to the <strong>Workouts</strong> tab (`/workouts`) in the sidebar to track routines, log individual sets, and view Personal Records (PRs).
              </p>
              <ul className="space-y-1.5 text-brand-text-secondary pt-1 list-disc list-inside">
                <li><strong className="text-brand-text-primary">Set-by-Set Logging:</strong> Record exact reps and weight for each exercise.</li>
                <li><strong className="text-brand-text-primary">Rest Timer:</strong> An interactive countdown timer counts down between sets to keep training intensity on point.</li>
                <li><strong className="text-brand-text-primary">1-Click Templates:</strong> Start with ready-made routines like Push-Pull-Legs or Upper/Lower split.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Nutrition */}
        {activeTab === 'nutrition' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border space-y-2">
              <h4 className="font-bold text-brand-text-primary text-sm flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Nutrition & Macro Tracker</span>
              </h4>
              <p className="text-brand-text-secondary leading-relaxed">
                Click <strong>Nutrition</strong> (`/nutrition`) to view daily caloric balance, macronutrient targets, and hydration logs.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-brand-elevated border border-brand-border">
                  <span className="font-bold text-[#0095F6] block">Protein</span>
                  <span className="text-[10px] text-brand-text-secondary">Muscle repair & growth</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-elevated border border-brand-border">
                  <span className="font-bold text-amber-400 block">Carbohydrates</span>
                  <span className="text-[10px] text-brand-text-secondary">High-intensity energy</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-elevated border border-brand-border">
                  <span className="font-bold text-emerald-400 block">Healthy Fats</span>
                  <span className="text-[10px] text-brand-text-secondary">Hormonal health</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: AI Coach */}
        {activeTab === 'ai-coach' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border space-y-2">
              <h4 className="font-bold text-brand-text-primary text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Ollama AI Fitness Coach (`/ai-coach`)</span>
              </h4>
              <p className="text-brand-text-secondary leading-relaxed">
                FitFolk connects directly to local open-source LLMs like `llama3.2` or `mistral` via Ollama without sending personal health data to third-party clouds.
              </p>
              <div className="p-3 rounded-lg bg-brand-elevated border border-brand-border font-mono text-[11px] text-brand-text-primary space-y-1">
                <span className="text-neutral-400 block font-sans font-semibold">To activate live Ollama on your PC:</span>
                <code>ollama run llama3.2</code>
              </div>
              <p className="text-[11px] text-brand-text-secondary">
                *When Ollama is offline or when viewing on mobile, FitFolk automatically falls back to an intelligent built-in sports science recommendation engine.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Mobile QR Code & Global Access */}
        {activeTab === 'qr-code' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border space-y-2">
              <h4 className="font-bold text-brand-text-primary text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0095F6]" />
                <span>Inviting Others via Phone Camera (Local & Worldwide)</span>
              </h4>
              <p className="text-brand-text-secondary leading-relaxed">
                FitFolk supports creating and synchronizing profiles from any phone, whether on the <strong>same Wi-Fi</strong> or <strong>from anywhere in the world on 4G/5G cellular data</strong>:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-brand-elevated border border-brand-border/60">
                  <strong className="text-brand-accent block mb-0.5">1. Same Wi-Fi Network Mode:</strong>
                  <p className="text-[11px] text-brand-text-secondary">
                    Point your camera at the QR code. It opens <code className="text-brand-text-primary">http://10.104.252.221:5173/join</code> directly over your local classroom or home router.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-brand-elevated border border-brand-border/60">
                  <strong className="text-blue-400 block mb-0.5">2. Worldwide (Any Network / 4G / 5G / Remote Friends):</strong>
                  <p className="text-[11px] text-brand-text-secondary mb-1">
                    To let someone on mobile data or in another city join, run the free zero-cost tunnel on your laptop:
                  </p>
                  <code className="bg-brand-surface px-2 py-1 rounded text-brand-accent text-[11px] font-mono block w-fit border border-brand-border">
                    npm run tunnel
                  </code>
                  <p className="text-[10px] text-brand-text-secondary mt-1">
                    The QR code automatically routes through Cloudflare's encrypted public network directly to your server, syncing profiles in real time!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Pre-made Accounts Directory */}
        {activeTab === 'accounts' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h4 className="font-bold text-brand-text-primary text-sm">Pre-made Profiles Directory</h4>
                <p className="text-[11px] text-brand-text-secondary">
                  Password for all profiles: <span className="font-mono text-[#0095F6] font-bold select-all">fitfolk123</span>
                </p>
              </div>
              <span className="badge bg-[#0095F6]/15 text-[#0095F6] font-bold">10 Profiles Available</span>
            </div>

            <div className="border border-brand-border rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-brand-elevated border-b border-brand-border text-brand-text-secondary uppercase text-[10px]">
                    <th className="p-2.5">User</th>
                    <th className="p-2.5">Username</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Password</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {DEMO_CREDENTIALS.map((acc) => (
                    <tr key={acc.username} className="hover:bg-brand-elevated/50 transition-colors">
                      <td className="p-2.5 font-bold text-brand-text-primary flex items-center gap-2">
                        <span>{acc.name}</span>
                      </td>
                      <td className="p-2.5 font-mono text-[#0095F6]">@{acc.username}</td>
                      <td className="p-2.5 text-brand-text-secondary">{acc.role}</td>
                      <td className="p-2.5 font-mono text-neutral-400">{acc.password}</td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => {
                            login(acc.username, acc.password);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold text-[10px]"
                        >
                          Log in
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <span className="text-[11px] text-brand-text-secondary">
            FitFolk Fitness Community Platform
          </span>
          <button
            onClick={onClose}
            className="btn-primary text-xs px-4 py-1.5 font-bold"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </Modal>
  );
}
