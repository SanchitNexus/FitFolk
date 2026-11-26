// ============================================================
// FitFolk Toast Context – Toast notification system
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// ---- Types ----

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 3000;
const EXIT_ANIMATION_MS = 300;

// ---- Toast icon helper ----

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 shrink-0 text-[#A3FF12]" aria-hidden="true" />;
    case 'error':
      return <XCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />;
    case 'info':
      return <Info className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />;
  }
}

// ---- Provider ----

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );

    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setToasts((prev) => {
        const updated = [...prev, { id, message, type, exiting: false }];
        // Trim to max toasts (remove oldest)
        if (updated.length > MAX_TOASTS) {
          const removed = updated.shift();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(removed.id);
            }
          }
        }
        return updated;
      });

      // Auto-dismiss
      const timer = setTimeout(() => {
        dismissToast(id);
        timersRef.current.delete(id);
      }, AUTO_DISMISS_MS);

      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  const bgForType: Record<ToastType, string> = {
    success: 'bg-[#191919] border-[#A3FF12]/30',
    error: 'bg-[#191919] border-red-500/30',
    info: 'bg-[#191919] border-blue-500/30',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2
                   max-sm:left-4 max-sm:right-4 max-sm:items-center
                   sm:min-w-[320px] sm:max-w-[400px]"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`
              flex items-center gap-3 rounded-lg border px-4 py-3
              shadow-lg backdrop-blur-sm transition-all duration-300
              ${bgForType[toast.type]}
              ${
                toast.exiting
                  ? 'translate-x-full opacity-0 max-sm:translate-x-0 max-sm:translate-y-4'
                  : 'translate-x-0 opacity-100 animate-in slide-in-from-right-5 max-sm:slide-in-from-bottom-5'
              }
            `}
          >
            <ToastIcon type={toast.type} />
            <span className="flex-1 text-sm text-[#F5F5F5]">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded p-1 text-[#A3A3A3] transition-colors hover:text-[#F5F5F5]"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Show toast notifications. Must be used within a ToastProvider.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

export default ToastProvider;
