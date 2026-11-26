import { useState } from 'react';
import {
  Settings,
  Shield,
  Eye,
  Bell,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Lock,
  UserCheck,
  Check,
} from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'safety' | 'data';

export default function SettingsPage() {
  const {
    state,
    switchUser,
    toggleTheme,
    updatePrivacySettings,
    resetDemo,
  } = useDemoContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('privacy');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentUser = state.users[state.currentUserId];
  const privacy = state.privacySettings;

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fitfolk_demo_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Demo data exported successfully!', 'success');
  };

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-accent" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-brand-text-secondary">
          Configure privacy controls, content visibility, notification preferences, and demo storage.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-brand-border mb-4 text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'privacy' as SettingsTab, label: 'Privacy & Safety' },
          { id: 'account' as SettingsTab, label: 'Account & Theme' },
          { id: 'notifications' as SettingsTab, label: 'Notification Alerts' },
          { id: 'data' as SettingsTab, label: 'Demo Data Management' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. Privacy & Safety */}
      {activeTab === 'privacy' && (
        <div className="space-y-4 text-xs">
          <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-accent" />
              <span>Account Privacy</span>
            </h3>

            <label className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated cursor-pointer">
              <div>
                <span className="font-semibold text-brand-text-primary block">Private Account</span>
                <span className="text-[11px] text-brand-text-secondary">
                  Only approved followers can see your workout logs and photos.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacy.isPrivate}
                onChange={(e) => {
                  updatePrivacySettings({ isPrivate: e.target.checked });
                  showToast('Privacy preference updated', 'info');
                }}
                className="rounded text-brand-accent focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated cursor-pointer">
              <div>
                <span className="font-semibold text-brand-text-primary block">
                  Hide Engagement Counts
                </span>
                <span className="text-[11px] text-brand-text-secondary">
                  Hides the total number of likes and comments on your posts.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacy.hideEngagementCounts}
                onChange={(e) => {
                  updatePrivacySettings({ hideEngagementCounts: e.target.checked });
                  showToast('Preference updated', 'info');
                }}
                className="rounded text-brand-accent focus:ring-0"
              />
            </label>
          </div>

          <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-accent" />
              <span>Activity Log Visibility</span>
            </h3>

            <div className="space-y-2">
              <div>
                <label className="font-semibold text-brand-text-primary block mb-1">
                  Who can view your Workout Logs:
                </label>
                <select
                  value={privacy.showWorkoutLogs}
                  onChange={(e) =>
                    updatePrivacySettings({ showWorkoutLogs: e.target.value as any })
                  }
                  className="input-field text-xs bg-brand-surface"
                >
                  <option value="public">Everyone (Public)</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Only Me (Private)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-brand-text-primary block mb-1">
                  Who can view your Nutrition Logs:
                </label>
                <select
                  value={privacy.showNutritionLogs}
                  onChange={(e) =>
                    updatePrivacySettings({ showNutritionLogs: e.target.value as any })
                  }
                  className="input-field text-xs bg-brand-surface"
                >
                  <option value="public">Everyone (Public)</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Only Me (Private)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Account & Theme */}
      {activeTab === 'account' && (
        <div className="space-y-4 text-xs">
          <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary">
                  Instagram Appearance & Theme
                </h3>
                <p className="text-[11px] text-brand-text-secondary mt-0.5">
                  Choose between Instagram OLED Dark Mode and Instagram Clean Light Mode.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="btn-primary text-xs px-3.5 py-1.5 font-bold flex items-center gap-1.5"
              >
                {state.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                <span>Toggle {state.theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Visual Theme Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Dark Mode Card */}
              <div
                onClick={() => state.theme !== 'dark' && toggleTheme()}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  state.theme === 'dark'
                    ? 'border-[#0095F6] bg-black/40 ring-2 ring-[#0095F6]/30'
                    : 'border-brand-border bg-neutral-900/60 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-black border border-neutral-700 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#0095F6]" />
                    </div>
                    <span className="font-bold text-white text-xs">Instagram Dark</span>
                  </div>
                  {state.theme === 'dark' && (
                    <span className="text-[10px] bg-[#0095F6] text-white px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="bg-black border border-neutral-800 rounded-lg p-2.5 space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full ig-gradient-bg" />
                    <div className="h-2 w-16 bg-neutral-700 rounded" />
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded" />
                  <div className="h-5 w-full bg-[#0095F6] rounded flex items-center justify-center text-[9px] text-white font-bold">
                    Follow
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 mt-2 block">
                  Pure OLED #000000 black canvas with Instagram Royal Blue accents.
                </span>
              </div>

              {/* Light Mode Card */}
              <div
                onClick={() => state.theme !== 'light' && toggleTheme()}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  state.theme === 'light'
                    ? 'border-[#0095F6] bg-neutral-100/70 ring-2 ring-[#0095F6]/30'
                    : 'border-brand-border bg-neutral-800/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border border-neutral-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#0095F6]" />
                    </div>
                    <span className="font-bold text-brand-text-primary text-xs">Instagram Light</span>
                  </div>
                  {state.theme === 'light' && (
                    <span className="text-[10px] bg-[#0095F6] text-white px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg p-2.5 space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full ig-gradient-bg" />
                    <div className="h-2 w-16 bg-neutral-300 rounded" />
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded" />
                  <div className="h-5 w-full bg-[#0095F6] rounded flex items-center justify-center text-[9px] text-white font-bold">
                    Follow
                  </div>
                </div>
                <span className="text-[10px] text-brand-text-secondary mt-2 block">
                  Pure white #FFFFFF background with crisp #DBDBDB Instagram borders.
                </span>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary">
              Active Demo Persona
            </h3>
            <p className="text-[11px] text-brand-text-secondary">
              Switch between demo accounts to view FitFolk from different perspectives.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(state.users).map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    showToast(`Switched persona to @${user.username}`, 'success');
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    user.id === state.currentUserId
                      ? 'border-brand-accent bg-brand-accent/10 font-bold'
                      : 'border-brand-border bg-brand-elevated hover:bg-brand-surface'
                  }`}
                >
                  <div>
                    <div className="text-brand-text-primary text-xs">{user.displayName}</div>
                    <div className="text-[10px] text-brand-text-secondary">@{user.username}</div>
                  </div>
                  {user.id === state.currentUserId && (
                    <Check className="w-4 h-4 text-brand-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary">
            Push & Activity Notifications
          </h3>
          {[
            { label: 'Likes on your posts and workouts', desc: 'When athletes cheer your achievements' },
            { label: 'Comments & Q&A replies', desc: 'When trainers or members respond to you' },
            { label: 'New follower requests', desc: 'Requests from members to follow your private logs' },
            { label: 'Challenge daily reminders', desc: 'Timely reminders to submit daily check-ins' },
            { label: 'Live session starting alerts', desc: 'Alerts when trainers go live' },
          ].map((item, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated cursor-pointer"
            >
              <div>
                <span className="font-semibold text-brand-text-primary block">{item.label}</span>
                <span className="text-[10px] text-brand-text-secondary">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-brand-accent focus:ring-0"
              />
            </label>
          ))}
        </div>
      )}

      {/* 4. Demo Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-4 text-xs">
          <div className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary flex items-center gap-1.5">
              <Download className="w-4 h-4 text-brand-accent" />
              <span>Export Prototype State</span>
            </h3>
            <p className="text-[11px] text-brand-text-secondary leading-relaxed">
              Export all local demonstration posts, workout records, and food entries to a local JSON file.
            </p>
            <button
              onClick={handleExportData}
              className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="card p-4 bg-brand-surface border border-brand-error/40 rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-error flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-brand-error" />
              <span>Reset Demo State</span>
            </h3>
            <p className="text-[11px] text-brand-text-secondary leading-relaxed">
              Restore the original seed accounts, demonstration posts, workouts, and default comments. This clears custom logs added in the current session.
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn-danger text-xs px-4 py-2 flex items-center gap-1.5 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Prototype Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onConfirm={() => {
          resetDemo();
          setShowResetConfirm(false);
          showToast('Prototype state restored to clean seed data!', 'success');
        }}
        onCancel={() => setShowResetConfirm(false)}
        title="Reset Demo Data?"
        message="Are you sure you want to reset all data? This will restore original sample accounts, seeded workout history, and posts."
        confirmLabel="Yes, Reset Demo"
        isDangerous={true}
      />
    </div>
  );
}
