import { useState } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Dumbbell,
  Mic,
  Shield,
  Users,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

export default function MessagesPage() {
  const { state, sendMessage } = useDemoContext();
  const { showToast } = useToast();

  const [activeConvId, setActiveConvId] = useState<string>(
    state.conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'primary' | 'requests'>('primary');

  const filteredConversations = state.conversations
    .filter((c) => (filterType === 'requests' ? c.isRequest : !c.isRequest))
    .filter((c) => {
      if (!search.trim()) return true;
      const otherUserIds = c.participantIds.filter((id) => id !== state.currentUserId);
      return otherUserIds.some((id) => {
        const u = state.users[id];
        return (
          u?.displayName.toLowerCase().includes(search.toLowerCase()) ||
          u?.username.toLowerCase().includes(search.toLowerCase())
        );
      });
    });

  const activeConversation = state.conversations.find((c) => c.id === activeConvId);

  // Other participant in 1-on-1 chat
  const otherParticipantId = activeConversation?.participantIds.find(
    (id) => id !== state.currentUserId
  );
  const otherUser = otherParticipantId ? state.users[otherParticipantId] : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="py-2 px-2 sm:px-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-brand-border/60">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-accent" />
            <span>Direct Messages</span>
          </h2>
          <p className="text-[11px] text-brand-text-secondary">
            Simulated local conversation interface. No external network transmission.
          </p>
        </div>
      </div>

      <div className="flex-1 flex border border-brand-border rounded-2xl bg-brand-surface overflow-hidden shadow-sm">
        {/* Left: Conversations List */}
        <div className="w-full sm:w-72 border-r border-brand-border flex flex-col bg-brand-bg/40">
          {/* Tabs: Primary vs Requests */}
          <div className="flex border-b border-brand-border text-xs font-semibold">
            <button
              onClick={() => setFilterType('primary')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                filterType === 'primary'
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-brand-text-secondary'
              }`}
            >
              Primary
            </button>
            <button
              onClick={() => setFilterType('requests')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                filterType === 'requests'
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-brand-text-secondary'
              }`}
            >
              Requests
            </button>
          </div>

          {/* Search */}
          <div className="p-2 border-b border-brand-border">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-brand-text-secondary absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
                className="input-field pl-8 text-xs py-1.5"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="p-4 text-center text-xs text-brand-text-secondary/60 italic">
                No chats found
              </p>
            ) : (
              filteredConversations.map((conv) => {
                const partnerId = conv.participantIds.find((id) => id !== state.currentUserId);
                const partner = partnerId ? state.users[partnerId] : null;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isSelected = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-3 flex items-center gap-2.5 text-left transition-colors border-b border-brand-border/30 ${
                      isSelected
                        ? 'bg-brand-elevated'
                        : 'hover:bg-brand-elevated/50'
                    }`}
                  >
                    {conv.isGroup ? (
                      <div className="w-10 h-10 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-xs shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                    ) : partner ? (
                      <Avatar user={partner} size="md" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-border shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-brand-text-primary truncate">
                          {conv.isGroup ? conv.groupName : partner?.displayName}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-brand-accent" />
                        )}
                      </div>
                      <p className="text-[11px] text-brand-text-secondary truncate mt-0.5">
                        {lastMsg?.text || 'Started a conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="hidden sm:flex flex-1 flex-col bg-brand-surface">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-brand-border flex items-center justify-between bg-brand-elevated/40">
                <div className="flex items-center gap-2.5">
                  {otherUser ? (
                    <Avatar user={otherUser} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-brand-text-primary">
                      <span>{activeConversation.isGroup ? activeConversation.groupName : otherUser?.displayName}</span>
                      {otherUser?.isVerified && otherUser.verificationCategory && (
                        <VerificationBadge category={otherUser.verificationCategory} size="sm" />
                      )}
                    </div>
                    <span className="text-[10px] text-brand-text-secondary">
                      {activeConversation.isGroup ? 'Group Chat' : `@${otherUser?.username}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId === state.currentUserId;
                  const sender = state.users[msg.senderId];

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-brand-accent text-brand-bg font-medium rounded-br-none'
                            : 'bg-brand-elevated border border-brand-border text-brand-text-primary rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-brand-text-secondary/70 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-brand-border flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Voice note recorded (demonstration)', 'info')}
                  className="p-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                  aria-label="Send voice memo"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write a message..."
                  className="input-field text-xs py-2 flex-1"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-primary text-xs p-2 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-brand-text-secondary italic">
              Select a chat to begin messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
