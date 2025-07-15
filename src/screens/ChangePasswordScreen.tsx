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

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          
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
                <Text style={[styles.eyeButtonText, { color: colors.textSecondary }]}>
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
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
                <Text style={[styles.eyeButtonText, { color: colors.textSecondary }]}>
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
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
                <Text style={[styles.eyeButtonText, { color: colors.textSecondary }]}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
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
}); 