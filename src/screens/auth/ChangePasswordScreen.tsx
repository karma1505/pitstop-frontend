import React, { useState, useEffect } from 'react';
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
import { SPACING, FONT_SIZES } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context';
import Icon from 'react-native-vector-icons/Ionicons';
import { BackButton } from '../../components';

interface ChangePasswordScreenProps {
  onNavigateBack?: () => void;
}

export default function ChangePasswordScreen({ onNavigateBack }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { colors } = useTheme();
  const { changePassword } = useAuth();

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasSpecialChar: false,
    hasNumeric: false,
    matchesConfirm: false,
  });

  // Password validation effect
  useEffect(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasNumeric = /\d/.test(newPassword);
    const matchesConfirm = newPassword === confirmPassword && confirmPassword.length > 0;
    
    setPasswordValidation({
      hasMinLength,
      hasSpecialChar,
      hasNumeric,
      matchesConfirm,
    });
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword, confirmPassword);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Password changed successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onNavigateBack) {
                  onNavigateBack();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to change password');
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
          <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Update your password to keep your account secure
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
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
                placeholder="Enter current password"
                placeholderTextColor={colors.inputPlaceholder}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon
                  name={showCurrentPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

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
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon
                  name={showNewPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            
            {/* Password Validation */}
            {newPassword.length > 0 && (
              <View style={styles.validationContainer}>
                <View style={styles.validationItem}>
                  <View style={[
                    styles.validationDot,
                    { backgroundColor: passwordValidation.hasMinLength ? colors.success : colors.textTertiary }
                  ]} />
                  <Text style={[
                    styles.validationText,
                    { color: passwordValidation.hasMinLength ? colors.success : colors.textSecondary }
                  ]}>
                    Minimum 8 characters
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <View style={[
                    styles.validationDot,
                    { backgroundColor: passwordValidation.hasSpecialChar ? colors.success : colors.textTertiary }
                  ]} />
                  <Text style={[
                    styles.validationText,
                    { color: passwordValidation.hasSpecialChar ? colors.success : colors.textSecondary }
                  ]}>
                    Must contain a special character
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <View style={[
                    styles.validationDot,
                    { backgroundColor: passwordValidation.hasNumeric ? colors.success : colors.textTertiary }
                  ]} />
                  <Text style={[
                    styles.validationText,
                    { color: passwordValidation.hasNumeric ? colors.success : colors.textSecondary }
                  ]}>
                    Must contain a number
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
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
                <Icon
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            
            {/* Confirm Password Validation */}
            {confirmPassword.length > 0 && (
              <View style={styles.validationContainer}>
                <View style={styles.validationItem}>
                  <View style={[
                    styles.validationDot,
                    { backgroundColor: passwordValidation.matchesConfirm ? colors.success : colors.textTertiary }
                  ]} />
                  <Text style={[
                    styles.validationText,
                    { color: passwordValidation.matchesConfirm ? colors.success : colors.textSecondary }
                  ]}>
                    Passwords match
                  </Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.changeButton,
              {
                backgroundColor: isLoading ? colors.outline : colors.primary,
              },
            ]}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            <Text style={[styles.changeButtonText, { color: colors.onPrimary }]}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Back Button positioned at bottom left */}
      <View style={styles.backButtonContainer}>
        <BackButton onPress={onNavigateBack || (() => {})} size="medium" />
      </View>
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
    paddingTop: SPACING.xxl + SPACING.lg, // Added more top margin
    paddingBottom: SPACING.xxl,
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
    paddingRight: 50, // Space for eye icon
    borderRadius: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjusted for better centering
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  changeButtonText: {
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
  validationContainer: {
    marginTop: SPACING.sm,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  validationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  validationText: {
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
  },
}); 