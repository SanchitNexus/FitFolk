import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDangerous?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-sm text-brand-text-secondary mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <button onClick={onCancel} className="btn-secondary text-sm">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 active:scale-[0.98] ${
            isDangerous
              ? 'bg-brand-error text-white hover:bg-red-600'
              : 'btn-primary'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
