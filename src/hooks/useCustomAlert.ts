import { useState, useCallback } from 'react';

export interface AlertConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsVisible(false);
    setAlertConfig(null);
  }, []);

  const showSuccessAlert = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => {
        hideAlert();
        onConfirm?.();
      },
    });
  }, [showAlert, hideAlert]);

  const showErrorAlert = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => {
        hideAlert();
        onConfirm?.();
      },
    });
  }, [showAlert, hideAlert]);

  const showWarningAlert = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'warning',
      confirmText: 'OK',
      onConfirm: () => {
        hideAlert();
        onConfirm?.();
      },
    });
  }, [showAlert, hideAlert]);

  const showInfoAlert = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'info',
      confirmText: 'OK',
      onConfirm: () => {
        hideAlert();
        onConfirm?.();
      },
    });
  }, [showAlert, hideAlert]);

  const showConfirmAlert = useCallback((
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showAlert({
      title,
      message,
      type: 'info',
      showCancelButton: true,
      confirmText,
      cancelText,
      onConfirm: () => {
        hideAlert();
        onConfirm?.();
      },
      onCancel: () => {
        hideAlert();
        onCancel?.();
      },
    });
  }, [showAlert, hideAlert]);

  return {
    alertConfig,
    isVisible,
    showAlert,
    hideAlert,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showConfirmAlert,
  };
};
