import type { ElementType } from 'react';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-elevated flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-brand-text-primary mb-1">{title}</h3>
      <p className="text-sm text-brand-text-secondary max-w-xs mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
