import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context';
import { OTPTimer, OTPInput, BackButton } from '../../components';

interface OTPVerificationScreenProps {
  userEmail: string;
  type: 'FORGOT_PASSWORD' | 'LOGIN_OTP';
  onNavigateBack?: () => void;
  onNavigateToReset?: (email: string, otpCode: string) => void;
  onNavigateToHome?: () => void;
  onResendOTP?: () => void;
}

export default function OTPVerificationScreen({
  userEmail,
  type,
  onNavigateBack,
  onNavigateToReset,
  onNavigateToHome,
  onResendOTP,
}: OTPVerificationScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const { verifyOTP, forgotPassword, sendLoginOTP, loginWithOTP } = useAuth();

  const handleVerifyOTP = async (otpString: string) => {
    console.log('=== OTP Verification Screen Debug ===');
    console.log('Received OTP string:', otpString);
    console.log('OTP string length:', otpString.length);
    console.log('User email:', userEmail);
    console.log('Type:', type);
    
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'LOGIN_OTP') {
        // For login OTP, call loginWithOTP directly
        const result = await loginWithOTP(userEmail, otpString);
        console.log('Login with OTP result:', result);
      
      if (result.success) {
          // User is now authenticated, navigate to home
          if (onNavigateToHome) {
          onNavigateToHome();
        }
        } else {
          Alert.alert('Error', result.error || 'Login failed');
        }
      } else {
        // For forgot password, verify OTP first
        const result = await verifyOTP(userEmail, otpString, type);
        console.log('Verification result:', result);
        
        if (result.success) {
          if (type === 'FORGOT_PASSWORD' && onNavigateToReset) {
            onNavigateToReset(userEmail, otpString);
          }
      } else {
        Alert.alert('Error', result.error || 'Invalid OTP code');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      let result;
      if (type === 'FORGOT_PASSWORD') {
        result = await forgotPassword(userEmail);
      } else {
        result = await sendLoginOTP(userEmail);
      }

      if (result.success) {
        Alert.alert('Success', 'New OTP sent successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP');
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
          {onNavigateBack && (
            <BackButton onPress={onNavigateBack} size="small" style={styles.headerBackButton} />
          )}
          
          <Text style={[styles.title, { color: colors.text }]}>
            {type === 'LOGIN_OTP' ? 'Login with OTP' : 'Verify OTP'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your 4-digit OTP has been sent to {userEmail}
          </Text>
        </View>

        <View style={styles.form}>
          <OTPInput
            length={4}
            onComplete={handleVerifyOTP}
            onResend={handleResendOTP}
            disabled={isLoading}
          />

          <OTPTimer
            onResend={handleResendOTP}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Verifying...
              </Text>
          </View>
          )}
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
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
}); 