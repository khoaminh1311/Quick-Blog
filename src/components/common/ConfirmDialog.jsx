import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-300">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? 'danger' : 'primary'} 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
