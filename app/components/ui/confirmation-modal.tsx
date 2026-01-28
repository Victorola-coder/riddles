"use client";

import { AlertDialog } from "./alert";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "warning" | "error" | "success";
  loading?: boolean;
}

/**
 * Reusable confirmation modal component
 * Replaces browser confirm() dialogs with a styled modal
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  loading = false,
}: ConfirmationModalProps) {
  return (
    <AlertDialog
      open={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      variant={variant}
      loading={loading}
    />
  );
}
