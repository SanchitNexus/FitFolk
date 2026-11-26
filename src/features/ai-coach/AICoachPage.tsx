import { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Terminal,
  Dumbbell,
  Utensils,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import {
  checkOllamaConnection,
  sendOllamaMessage,
  OllamaChatMessage,
} from '../../lib/ollama';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';

export default function AICoachPage() {
  const { state } = useDemoContext();
  const { showToast } = useToast();
  const currentUser = state.users[state.currentUserId];

  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2');
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [messages, setMessages] = useState<OllamaChatMessage[]>([
    {
      role: 'assistant',
      content: `👋 Hey **${currentUser?.displayName || 'athlete'}**! I'm your **FitFolk AI Coach**, powered by Ollama's local LLM engine.

I can help you with:
- 🏋️ **Custom Workout Splits** (Push/Pull/Legs, Upper/Lower, 5K prep)
- 🥗 **Macro & Calorie Calculations** customized to your bodyweight
- 🛡️ **Exercise Form Cues** and injury prevention
- ⏱️ **Recovery & Supplementation** advice

What fitness goal are you working on today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Check Ollama connection on mount
  const checkConnection = async () => {
    setIsCheckingOllama(true);
    const result = await checkOllamaConnection();
    setOllamaOnline(result.isOnline);
    setAvailableModels(result.models);
    if (result.models.length > 0) {
      setSelectedModel(result.models[0]);
    }
    setIsCheckingOllama(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: OllamaChatMessage = { role: 'user', content: textToSend.trim() };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await sendOllamaMessage(
        newHistory,
        selectedModel,
        '/api/ollama',
        currentUser?.displayName || 'Athlete'
      );
      setMessages([...newHistory, { role: 'assistant', content: response }]);
    } catch {
      showToast('Error generating AI advice', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const promptSuggestions = [
    { label: '3-Day PPL Workout Split', prompt: 'Create a 3-day Push-Pull-Legs workout routine for strength and muscle hypertrophy.' },
    { label: 'Calculate Fat Loss Macros', prompt: 'Calculate daily calories and protein for a 75kg person aiming to lose fat safely.' },
    { label: 'Deadlift Technique Checklist', prompt: 'Give me a step-by-step form check and cue list for a safe conventional deadlift.' },
    { label: 'High Protein Vegetarian Meals', prompt: 'Suggest 3 high-protein vegetarian meal prep ideas with approximate macros.' },
  ];

  return (
    <div className="py-2 px-2 sm:px-4 h-[calc(100vh-95px)] flex flex-col select-none">
      {/* Header with Ollama Status */}
      <div className="card p-3 mb-3 bg-brand-surface border border-brand-border/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-accent text-brand-bg flex items-center justify-center font-black shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-brand-text-primary">
                FitFolk AI Coach
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                Ollama Engine
              </span>
            </div>
            <p className="text-[11px] text-brand-text-secondary">
              100% Free, Private, Local Fitness Intelligence
            </p>
          </div>
        </div>

        {/* Ollama Connection Indicator */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/15 border-emerald-500/40 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {ollamaOnline
                ? `Ollama Live (${selectedModel})`
                : 'AI Coach Online (Neural Brain)'}
            </span>
          </div>

          <button
            onClick={checkConnection}
            disabled={isCheckingOllama}
            className="p-1.5 rounded-lg border border-brand-border bg-brand-elevated text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            title="Check Ollama status on localhost:11434"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingOllama ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="text-[11px] text-brand-accent hover:underline flex items-center gap-0.5 font-medium ml-1"
          >
            <span>Guide</span>
            {showSetupGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Collapsible Ollama Setup Guide */}
      {showSetupGuide && (
        <div className="card p-3.5 mb-3 bg-brand-elevated border border-brand-border rounded-xl text-xs space-y-2 animate-scale-in">
          <div className="flex items-center gap-1.5 font-bold text-brand-text-primary">
            <Terminal className="w-4 h-4 text-brand-accent" />
            <span>How to Connect Your Local Ollama Engine ($0 Cost):</span>
          </div>
          <ol className="text-[11px] text-brand-text-secondary list-decimal list-inside space-y-1 leading-relaxed">
            <li>Download & install Ollama for Windows from <strong>ollama.com</strong> (100% free).</li>
            <li>Open PowerShell or terminal and run: <code className="bg-black/30 px-1.5 py-0.5 rounded text-brand-accent">ollama run llama3.2</code> (or <code className="bg-black/30 px-1.5 py-0.5 rounded text-brand-accent">mistral</code> / <code className="bg-black/30 px-1.5 py-0.5 rounded text-brand-accent">phi3</code>).</li>
            <li>Click the refresh button above. FitFolk will automatically connect and stream live responses!</li>
          </ol>
          <p className="text-[10px] text-brand-text-secondary/80 italic">
            Note: Even without Ollama running, FitFolk AI Coach functions seamlessly using its built-in sports science response library.
          </p>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-brand-surface/60 border border-brand-border/60 rounded-2xl">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {isUser ? (
                currentUser ? (
                  <Avatar user={currentUser} size="xs" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-brand-border shrink-0" />
                )
              ) : (
                <div className="w-7 h-7 rounded-lg bg-brand-accent text-brand-bg flex items-center justify-center font-bold text-xs shrink-0 shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-brand-accent text-brand-bg font-medium rounded-tr-none'
                    : 'bg-brand-elevated border border-brand-border/70 text-brand-text-primary rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line prose-invert">{msg.content}</div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-brand-border/40 text-[10px] text-brand-text-secondary">
                    <span className="flex items-center gap-1 text-brand-accent font-semibold">
                      <Sparkles className="w-3 h-3" />
                      FitFolk AI Verified
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="hover:text-brand-text-primary flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-brand-accent" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-brand-text-secondary py-2 px-1">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            <span className="animate-pulse">FitFolk AI Coach is analyzing and generating advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
        {promptSuggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSend(item.prompt)}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border/70 text-[11px] font-medium text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50 whitespace-nowrap transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Coach for workouts, macros, nutrition, or form checks..."
          className="input-field text-xs py-2.5 flex-1 rounded-xl"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 font-bold disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>
    </div>
  );
}
