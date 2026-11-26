import { useState } from 'react';
import { Flag, CheckCircle2, ShieldAlert } from 'lucide-react';
import Modal from '../common/Modal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { ReportCategory } from '../../types';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'comment' | 'user' | 'message' | 'question' | 'answer';
  targetId: string;
}

const CATEGORIES: { id: ReportCategory; label: string; desc: string }[] = [
  { id: 'misleading_health', label: 'Misleading Health or Exercise Claim', desc: 'Promotes dangerous workout techniques, unsafe rapid weight loss, or pseudo-scientific advice.' },
  { id: 'harassment', label: 'Harassment or Bullying', desc: 'Targeted hostility, body-shaming, or abusive language toward creators or community members.' },
  { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Unsolicited product links, repetitive bot comments, or misleading affiliate promotions.' },
  { id: 'misinformation', label: 'False or Unverified Information', desc: 'Inaccurate facts or fabricated professional credentials.' },
  { id: 'inappropriate', label: 'Inappropriate Content', desc: 'Nudity, extreme violence, or sexually suggestive imagery.' },
  { id: 'impersonation', label: 'Impersonation', desc: 'Pretending to be another fitness creator, brand, or licensed professional.' },
  { id: 'other', label: 'Other Issue', desc: 'Other concerns violating platform community standards.' },
];

export default function ReportDialog({ isOpen, onClose, targetType, targetId }: ReportDialogProps) {
  const { submitReport } = useDemoContext();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('misleading_health');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      category: selectedCategory,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      status: 'submitted',
    });
    setSubmitted(true);
    showToast('Report submitted for review', 'success');
  };

  const handleClose = () => {
    setSubmitted(false);
    setDescription('');
    setSelectedCategory('misleading_health');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={submitted ? '' : 'Report Content'}>
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-brand-success/15 text-brand-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-text-primary">Thank you for reporting</h3>
            <p className="text-xs text-brand-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
              Your feedback helps keep the FitFolk community safe and credible. Our demonstration moderation log has recorded your report.
            </p>
          </div>
          <button onClick={handleClose} className="btn-primary text-xs px-6 py-2 mt-2">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-brand-elevated border border-brand-border/60">
            <ShieldAlert className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-text-secondary leading-relaxed">
              Help us maintain credibility in fitness. Reports are treated confidentially and do not automatically penalize accounts without manual review.
            </p>
          </div>

          <div>
            <label className="font-semibold text-brand-text-primary block mb-2">
              Select a reason:
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-brand-accent/10 border-brand-accent/60 text-brand-text-primary'
                      : 'border-brand-border bg-brand-surface hover:bg-brand-elevated text-brand-text-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportCategory"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="mt-0.5 text-brand-accent focus:ring-0"
                  />
                  <div>
                    <div className="font-semibold text-brand-text-primary">{cat.label}</div>
                    <div className="text-[10px] text-brand-text-secondary/80 mt-0.5">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reportNotes" className="font-semibold text-brand-text-primary block mb-1.5">
              Additional context (optional):
            </label>
            <textarea
              id="reportNotes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any helpful timestamps, citations, or context..."
              rows={3}
              className="input-field text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
            <button type="button" onClick={handleClose} className="btn-secondary text-xs px-3 py-2">
              Cancel
            </button>
            <button type="submit" className="btn-danger flex items-center gap-1.5 text-xs px-4 py-2">
              <Flag className="w-3.5 h-3.5" />
              Submit Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
