import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../utils';
import { Button } from '../../components';
import { useAuth } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import loginLogo from '../../assets/images/login-logo.png';
import { Ionicons as Icon } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface LoginScreenProps {
  onNavigateToSignUp?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToOTPLogin?: () => void;
}

export default function LoginScreen({ 
  onNavigateToSignUp, 
  onNavigateToHome, 
  onNavigateToForgotPassword,
  onNavigateToOTPLogin 
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, loading } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Clear previous error
    setLoginError('');

    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // Navigate immediately on successful login
        if (onNavigateToHome) {
          onNavigateToHome();
        }
      } else {
        // Trigger haptic feedback for login failure
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setLoginError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      // Trigger haptic feedback for network error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoginError('Login failed. Please check your connection and try again.');
    }
  };

  const handleSignUp = () => {
    if (onNavigateToSignUp) {
      onNavigateToSignUp();
    } else {
      Alert.alert('Sign Up', 'Sign up screen will be created later');
    }
  };

  const handleForgotPassword = () => {
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword();
    } else {
      Alert.alert('Forgot Password', 'Forgot password functionality will be implemented later');
    }
  };

  const handleOTPLogin = () => {
    if (onNavigateToOTPLogin) {
      onNavigateToOTPLogin();
    } else {
      Alert.alert('OTP Login', 'OTP login functionality will be implemented later');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEnabled={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image source={loginLogo} style={styles.logoImage} resizeMode="contain" />
            <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
              Don't forget to sign in
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <View style={[styles.passwordContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.inputText }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              
              {loginError && <Text style={[styles.errorText, { color: colors.error }]}>{loginError}</Text>}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title={loading ? 'Signing in...' : 'Sign In'}
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.outline }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.outline }]} />
            </View>

            {/* OTP Login Button */}
            <TouchableOpacity
              style={[styles.otpLoginButton, { backgroundColor: colors.surface, borderColor: colors.outline }]}
              onPress={handleOTPLogin}
              disabled={loading}
            >
              <Text style={[styles.otpLoginText, { color: colors.text }]}>
                Login with OTP
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton, 
                { 
                  backgroundColor: colors.primary,
                  borderWidth: 2,
                  borderColor: colors.primary 
                }
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={[styles.signUpButtonText, { color: colors.onPrimary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 20, // Reduced from +40 to move content higher
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl, // Reduced from xxl to move form higher
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  subtitleText: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: SPACING.xxl, // Increased to ensure Sign Up button is visible
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingRight: 50, // Space for eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjusted for better centering
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: SPACING.md,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  otpLoginButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md, // Reduced from lg to accommodate sign up button
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  otpLoginText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: SPACING.md, // Reduced from lg since OTP button now has bottom margin
  },
  signUpText: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  signUpLink: {
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: SPACING.md,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
}); 