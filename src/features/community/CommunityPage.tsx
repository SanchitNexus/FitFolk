import { useState } from 'react';
import {
  HelpCircle,
  Plus,
  ThumbsUp,
  CheckCircle,
  MessageSquare,
  Search,
  Sparkles,
  ShieldCheck,
  User,
  Filter,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Question, Answer } from '../../types';

export default function CommunityPage() {
  const { state, addQuestion, addAnswer, upvoteQuestion, upvoteAnswer } = useDemoContext();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Ask question form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Strength');
  const [tags, setTags] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const categories = ['All', 'Nutrition', 'Strength', 'Health & Safety', 'Supplements', 'Mindset', 'Programming'];

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('Please provide both a title and description', 'error');
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      userId: state.currentUserId,
      title: title.trim(),
      body: body.trim(),
      category,
      tags: tags
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t.slice(1) : t)),
      isAnonymous,
      answers: [],
      upvotes: 1,
      isUpvoted: true,
      views: 1,
      createdAt: new Date().toISOString(),
    };

    addQuestion(newQuestion);
    showToast('Question posted to community!', 'success');
    setTitle('');
    setBody('');
    setTags('');
    setIsAnonymous(false);
    setIsAskModalOpen(false);
  };

  const handleAnswerSubmit = (questionId: string) => {
    if (!replyText.trim()) return;
    const currentUser = state.users[state.currentUserId];

    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      userId: state.currentUserId,
      body: replyText.trim(),
      upvotes: 0,
      isUpvoted: false,
      isAccepted: false,
      isVerifiedProfessional: currentUser?.isVerified || false,
      createdAt: new Date().toISOString(),
    };

    addAnswer(questionId, newAnswer);
    showToast('Answer submitted!', 'success');
    setReplyText('');
  };

  // Filter & sort questions
  const filteredQuestions = state.questions
    .filter((q) => {
      const matchSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.body.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'unanswered') return a.answers.length - b.answers.length;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-accent" />
            <span>Community Fitness Q&A</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Get advice from athletes, certified trainers, and qualified dietitians.
          </p>
        </div>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-text-secondary absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fitness questions & topics..."
              className="input-field pl-9 text-xs py-2"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field text-xs py-2 w-32 bg-brand-surface"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Upvoted</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-accent text-brand-bg font-bold'
                  : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="card p-8 text-center text-xs text-brand-text-secondary italic">
            No questions found in this category. Be the first to ask!
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const author = state.users[q.userId];
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3 hover:border-brand-border transition-colors"
              >
                {/* Header / Author */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {q.isAnonymous ? (
                      <div className="w-6 h-6 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-[10px] text-brand-text-secondary">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    ) : author ? (
                      <Avatar user={author} size="xs" />
                    ) : null}
                    <span className="font-semibold text-brand-text-primary">
                      {q.isAnonymous ? 'Anonymous Member' : author?.displayName}
                    </span>
                    <span className="text-[10px] text-brand-text-secondary">
                      in <strong className="text-brand-accent">{q.category}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-text-secondary">
                    {new Date(q.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Question Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-brand-text-primary hover:text-brand-accent transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed mt-1">
                    {q.body}
                  </p>
                </div>

                {/* Tags */}
                {q.tags && q.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-brand-elevated text-brand-text-secondary text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        upvoteQuestion(q.id);
                        showToast('Upvoted question!', 'success');
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                        q.isUpvoted
                          ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-bold'
                          : 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>

                    <button
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{q.answers.length} Answers</span>
                    </button>
                  </div>

                  {q.acceptedAnswerId && (
                    <span className="flex items-center gap-1 text-[11px] text-brand-success font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accepted Answer</span>
                    </span>
                  )}
                </div>

                {/* Expanded Answers Panel */}
                {isExpanded && (
                  <div className="pt-3 border-t border-brand-border/60 space-y-3 animate-fade-in">
                    <h4 className="font-bold text-xs text-brand-text-primary">Community Answers:</h4>

                    {q.answers.length === 0 ? (
                      <p className="text-xs text-brand-text-secondary/70 italic py-1">
                        No answers yet. Share your experience!
                      </p>
                    ) : (
                      q.answers.map((ans) => {
                        const ansAuthor = state.users[ans.userId];

                        return (
                          <div
                            key={ans.id}
                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                              ans.isAccepted
                                ? 'bg-brand-success/5 border-brand-success/40'
                                : 'bg-brand-elevated border-brand-border/60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {ansAuthor && <Avatar user={ansAuthor} size="xs" />}
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-brand-text-primary">
                                    {ansAuthor?.displayName}
                                  </span>
                                  {ans.isVerifiedProfessional && ansAuthor?.verificationCategory && (
                                    <VerificationBadge
                                      category={ansAuthor.verificationCategory}
                                      size="sm"
                                    />
                                  )}
                                </div>
                              </div>
                              {ans.isAccepted && (
                                <span className="badge bg-brand-success/15 text-brand-success text-[10px] font-bold">
                                  Accepted
                                </span>
                              )}
                            </div>

                            <p className="text-brand-text-primary/95 leading-relaxed">{ans.body}</p>

                            {/* Citations if any */}
                            {ans.references && ans.references.length > 0 && (
                              <div className="p-2 rounded bg-black/20 text-[10px] text-brand-text-secondary">
                                <span className="font-semibold text-brand-text-primary block mb-0.5">
                                  References:
                                </span>
                                {ans.references.join(', ')}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 text-[11px] text-brand-text-secondary">
                              <button
                                onClick={() => {
                                  upvoteAnswer(q.id, ans.id);
                                  showToast('Upvoted answer!', 'success');
                                }}
                                className="flex items-center gap-1 hover:text-brand-accent transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{ans.upvotes} helpful</span>
                              </button>
                              <span>
                                {new Date(ans.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Submit Answer Field */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Contribute your answer or professional advice..."
                        className="input-field text-xs py-2 flex-1"
                      />
                      <button
                        onClick={() => handleAnswerSubmit(q.id)}
                        disabled={!replyText.trim()}
                        className="btn-primary text-xs px-3 py-2 disabled:opacity-40"
                      >
                        Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ask Question Modal */}
      <Modal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} title="Ask the Community">
        <form onSubmit={handleAskSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Question Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Is 1.6g/kg protein enough for powerlifting?"
              className="input-field text-xs"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">
              Detailed Context
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide context regarding your training history, current routine, or specific goals..."
              rows={3}
              className="input-field text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-brand-text-primary block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field text-xs bg-brand-surface"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-brand-text-primary block mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="protein, recovery"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-brand-accent focus:ring-0"
              />
              <div>
                <span className="font-semibold text-brand-text-primary">Ask Anonymously</span>
                <span className="text-[10px] text-brand-text-secondary block">
                  Hides your username & avatar on this question for privacy.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setIsAskModalOpen(false)}
              className="btn-secondary text-xs px-3 py-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs px-4 py-2">
              Post Question
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
