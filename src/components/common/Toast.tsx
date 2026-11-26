import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItemData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastItemData;
  onClose: (id: string) => void;
}

const config = {
  success: {
    icon: CheckCircle,
    border: 'border-l-brand-accent',
    iconColor: 'text-brand-accent',
  },
  error: {
    icon: XCircle,
    border: 'border-l-brand-error',
    iconColor: 'text-brand-error',
  },
  info: {
    icon: Info,
    border: 'border-l-blue-400',
    iconColor: 'text-blue-400',
  },
};

export function ToastItem({ toast, onClose }: ToastProps) {
  const c = config[toast.type];
  const Icon = c.icon;

  return (
    <div
      role="alert"
      className={`
        flex items-center gap-3 px-4 py-3
        bg-brand-surface border border-brand-border ${c.border} border-l-4
        rounded-lg shadow-xl animate-slide-up
        min-w-[280px] max-w-sm
      `}
    >
      <Icon className={`w-5 h-5 shrink-0 ${c.iconColor}`} />
      <p className="flex-1 text-sm text-brand-text-primary">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-0.5 rounded text-brand-text-secondary hover:text-brand-text-primary transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItemData[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
