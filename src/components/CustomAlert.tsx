import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../utils';

const { width: screenWidth } = Dimensions.get('window');

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  showCancelButton = false,
  cancelText = 'Cancel',
  confirmText = 'OK',
  onConfirm,
  onCancel,
  onDismiss,
}) => {
  const { colors } = useTheme();

  const getAlertColors = () => {
    switch (type) {
      case 'success':
        return {
          background: colors.success,
          icon: 'checkmark-circle',
          iconColor: colors.onSuccess,
        };
      case 'error':
        return {
          background: colors.error,
          icon: 'close-circle',
          iconColor: colors.onError,
        };
      case 'warning':
        return {
          background: colors.warning,
          icon: 'warning',
          iconColor: colors.text,
        };
      case 'info':
      default:
        return {
          background: colors.primary,
          icon: 'information-circle',
          iconColor: colors.onPrimary,
        };
    }
  };

  const alertColors = getAlertColors();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleDismiss}
        />
        <View style={[styles.alertContainer, { backgroundColor: colors.surface }]}>
          {/* Header with icon */}
          <View style={[styles.header, { backgroundColor: alertColors.background }]}>
            <Icon
              name={alertColors.icon as any}
              size={32}
              color={alertColors.iconColor}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showCancelButton && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: colors.outline }
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: colors.primary },
                showCancelButton && styles.confirmButtonWithCancel
              ]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: screenWidth * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 0.5,
  },
  confirmButton: {
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
  },
  confirmButtonWithCancel: {
    flex: 1,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default CustomAlert;
