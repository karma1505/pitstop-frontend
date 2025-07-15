import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context';

interface ResetPasswordScreenProps {
  phoneNumber: string;
  otpCode: string;
  onNavigateBack?: () => void;
  onNavigateToLogin?: () => void;
}

export default function ResetPasswordScreen({
  phoneNumber,
  otpCode,
  onNavigateBack,
  onNavigateToLogin,
}: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { colors } = useTheme();
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(phoneNumber, otpCode, newPassword, confirmPassword);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Password reset successfully. You can now login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onNavigateToLogin) {
                  onNavigateToLogin();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your new password
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                  },
                ]}
                placeholder="Enter new password"
                placeholderTextColor={colors.inputPlaceholder}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.eyeButtonText, { color: colors.textSecondary }]}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                  },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.inputPlaceholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={[styles.eyeButtonText, { color: colors.textSecondary }]}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.resetButton,
              {
                backgroundColor: isLoading ? colors.outline : colors.primary,
              },
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={[styles.resetButtonText, { color: colors.onPrimary }]}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpText}>
            <Text style={[styles.helpTextContent, { color: colors.textSecondary }]}>
              Password must be at least 8 characters long
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  eyeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  eyeButtonText: {
    fontSize: FONT_SIZES.md,
  },
  resetButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  resetButtonText: {
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