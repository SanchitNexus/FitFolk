import { useState } from 'react';
import {
  Radio,
  Users,
  Bell,
  BellOff,
  Play,
  Send,
  HelpCircle,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { LiveSession, LiveChatMessage } from '../../types';

export default function LivePage() {
  const { state, toggleReminder } = useDemoContext();
  const { showToast } = useToast();

  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [activeChatTab, setActiveChatTab] = useState<'chat' | 'qa'>('chat');
  const [simulatedChatMessages, setSimulatedChatMessages] = useState<LiveChatMessage[]>([]);

  const liveNow = state.liveSessions.filter((s) => s.isLive);
  const upcoming = state.liveSessions.filter((s) => !s.isLive);

  const handleJoin = (session: LiveSession) => {
    setActiveSession(session);
    setSimulatedChatMessages(session.chatMessages);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `lm-${Date.now()}`,
      userId: state.currentUserId,
      text: chatInput.trim(),
      timestamp: new Date().toISOString(),
      isQuestion: activeChatTab === 'qa',
    };

    setSimulatedChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    showToast(activeChatTab === 'qa' ? 'Question sent to host!' : 'Chat message sent', 'info');
  };

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-error animate-pulse" />
            <span>FitFolk Live Broadcasts</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Join live training masterclasses, Q&As, and form correction workshops.
          </p>
        </div>
      </div>

      {/* 1. Live Now Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-error animate-ping" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary">
            Broadcasting Live Now ({liveNow.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {liveNow.map((session) => {
            const host = state.users[session.hostId];
            return (
              <div
                key={session.id}
                className="card p-4 bg-brand-surface border border-brand-border rounded-2xl flex flex-col justify-between hover:border-brand-accent/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge bg-brand-error/20 text-brand-error text-[10px] font-black uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3" /> LIVE NOW
                    </span>
                    <span className="text-xs text-brand-text-secondary flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{session.viewerCount} watching</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-brand-text-primary mb-1">
                    {session.title}
                  </h4>
                  <p className="text-xs text-brand-text-secondary line-clamp-2 mb-3">
                    {session.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {host && <Avatar user={host} size="xs" />}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-brand-text-primary">
                        {host?.displayName}
                      </span>
                      {host?.isVerified && host.verificationCategory && (
                        <VerificationBadge category={host.verificationCategory} size="sm" />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(session)}
                  className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5 font-bold"
                >
                  <Play className="w-3.5 h-3.5 fill-brand-bg" />
                  <span>Join Live Stream</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Upcoming Sessions */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-brand-text-primary mb-3">
          Upcoming Schedule
        </h3>

        <div className="space-y-3">
          {upcoming.map((session) => {
            const host = state.users[session.hostId];
            return (
              <div
                key={session.id}
                className="card p-3.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {host && <Avatar user={host} size="md" />}
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-brand-text-primary truncate">
                      {session.title}
                    </h4>
                    <p className="text-[11px] text-brand-text-secondary">
                      {host?.displayName} • Scheduled for {new Date(session.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleReminder(session.id);
                    showToast(
                      session.hasReminder ? 'Reminder cancelled' : 'Reminder scheduled!',
                      'info'
                    );
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                    session.hasReminder
                      ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-semibold'
                      : 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {session.hasReminder ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{session.hasReminder ? 'Reminding' : 'Remind Me'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Simulated Live Room Modal */}
      {activeSession && (
        <Modal
          isOpen={true}
          onClose={() => setActiveSession(null)}
          title={`🔴 ${activeSession.title}`}
          size="xl"
        >
          <div className="space-y-3 text-xs">
            {/* Simulated Stream Screen */}
            <div className="w-full h-56 sm:h-72 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-brand-border flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-brand-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>SIMULATED BROADCAST</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                <Users className="w-3 h-3 text-brand-accent" />
                <span>{activeSession.viewerCount} live viewers</span>
              </div>

              <div className="w-16 h-16 rounded-full bg-brand-accent/20 border border-brand-accent text-brand-accent flex items-center justify-center mb-2 animate-pulse">
                <Radio className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-brand-text-primary">{activeSession.title}</h4>
              <p className="text-xs text-brand-text-secondary max-w-sm mt-1">
                Interactive demonstration live room. Real video broadcasting is simulated in this zero-cost prototype.
              </p>
            </div>

            {/* Chat / Q&A Tabs */}
            <div className="border-t border-brand-border pt-2">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setActiveChatTab('chat')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    activeChatTab === 'chat'
                      ? 'bg-brand-elevated text-brand-accent'
                      : 'text-brand-text-secondary'
                  }`}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveChatTab('qa')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    activeChatTab === 'qa'
                      ? 'bg-brand-elevated text-brand-accent'
                      : 'text-brand-text-secondary'
                  }`}
                >
                  Q&A Questions
                </button>
              </div>

              {/* Chat Message Scroll */}
              <div className="h-36 overflow-y-auto bg-brand-elevated/60 p-2.5 rounded-xl border border-brand-border/60 space-y-2">
                {simulatedChatMessages
                  .filter((m) => (activeChatTab === 'qa' ? m.isQuestion : true))
                  .map((m) => {
                    const sender = state.users[m.userId];
                    return (
                      <div key={m.id} className="flex items-start gap-2">
                        {sender && <Avatar user={sender} size="xs" />}
                        <div>
                          <span className="font-bold text-brand-text-primary mr-1.5">
                            {sender?.displayName || 'User'}:
                          </span>
                          <span className="text-brand-text-secondary">{m.text}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={activeChatTab === 'qa' ? 'Ask the host a question...' : 'Send message in live chat...'}
                  className="input-field text-xs py-2 flex-1"
                />
                <button type="submit" className="btn-primary text-xs px-3.5 py-2">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
