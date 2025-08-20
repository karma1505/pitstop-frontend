import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context';
import { BackButton } from '../../components';
import CustomAlert from '../../components/CustomAlert';
import { useCustomAlert } from '../../hooks';

interface ForgotPasswordScreenProps {
  onNavigateBack?: () => void;
  onNavigateToOTP?: (email: string, type?: 'FORGOT_PASSWORD' | 'LOGIN_OTP') => void;
}

export default function ForgotPasswordScreen({ onNavigateBack, onNavigateToOTP }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const { forgotPassword } = useAuth();
  const { alertConfig, isVisible, showSuccessAlert, showErrorAlert } = useCustomAlert();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      showErrorAlert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      showErrorAlert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email.trim());
      
      if (result.success) {
        showSuccessAlert(
          'OTP Sent',
          'A verification code has been sent to your email address.',
          () => {
            if (onNavigateToOTP) {
              onNavigateToOTP(email.trim(), 'FORGOT_PASSWORD');
            }
          }
        );
      } else {
        showErrorAlert('Error', result.error || 'Failed to send OTP');
      }
    } catch (error) {
      showErrorAlert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          {onNavigateBack && (
            <BackButton onPress={onNavigateBack} size="small" style={styles.headerBackButton} />
          )}
          
          <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email address to receive a verification code
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter your email address"
              placeholderTextColor={colors.inputPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: isLoading ? colors.outline : colors.primary,
              },
            ]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={[styles.sendButtonText, { color: colors.onPrimary }]}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpText}>
            <Text style={[styles.helpTextContent, { color: colors.textSecondary }]}>
              We'll send a 4-digit verification code to your email address
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          visible={isVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          showCancelButton={alertConfig.showCancelButton}
          cancelText={alertConfig.cancelText}
          confirmText={alertConfig.confirmText}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
          onDismiss={() => {}}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  headerBackButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  form: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  input: {
    fontSize: FONT_SIZES.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  sendButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sendButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  helpText: {
    alignItems: 'center',
  },
  helpTextContent: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 