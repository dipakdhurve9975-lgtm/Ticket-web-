import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const confirmVariant = variant === 'danger' ? 'danger' : 'primary';

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isLoading}>
        {cancelLabel}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} title={title} footer={footer}>
      <p className="text-surface-700">{message}</p>
    </Dialog>
  );
};
