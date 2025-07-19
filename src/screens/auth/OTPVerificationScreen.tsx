import React, { useState, useEffect, useRef } from 'react';
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

interface OTPVerificationScreenProps {
  phoneNumber: string;
  type: 'FORGOT_PASSWORD' | 'LOGIN_OTP';
  onNavigateBack?: () => void;
  onNavigateToReset?: (phoneNumber: string, otpCode: string) => void;
  onNavigateToHome?: () => void;
  onResendOTP?: () => void;
}

export default function OTPVerificationScreen({
  phoneNumber,
  type,
  onNavigateBack,
  onNavigateToReset,
  onNavigateToHome,
  onResendOTP,
}: OTPVerificationScreenProps) {
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);
  const { colors } = useTheme();
  const { verifyOTP, forgotPassword, sendLoginOTP } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otpCode.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(phoneNumber, otpString, type);
      
      if (result.success) {
        if (type === 'FORGOT_PASSWORD' && onNavigateToReset) {
          onNavigateToReset(phoneNumber, otpString);
        } else if (type === 'LOGIN_OTP' && onNavigateToHome) {
          onNavigateToHome();
        }
      } else {
        Alert.alert('Error', result.error || 'Invalid OTP code');
        setOtpCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCount >= 4) {
      Alert.alert('Error', 'Maximum resend attempts reached. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (type === 'FORGOT_PASSWORD') {
        result = await forgotPassword(phoneNumber);
      } else {
        result = await sendLoginOTP(phoneNumber);
      }

      if (result.success) {
        setResendCount(prev => prev + 1);
        setTimeLeft(60);
        setCanResend(false);
        setOtpCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          
          <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter the 4-digit code sent to {phoneNumber}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: digit ? colors.primary : colors.inputBorder,
                    color: colors.inputText,
                  },
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: isLoading ? colors.outline : colors.primary,
              },
            ]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={[styles.verifyButtonText, { color: colors.onPrimary }]}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            {!canResend ? (
              <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                Resend code in {formatTime(timeLeft)}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={isLoading}
              >
                <Text style={[styles.resendButtonText, { color: colors.primary }]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {resendCount > 0 && (
            <Text style={[styles.resendCountText, { color: colors.textTertiary }]}>
              Resend attempts: {resendCount}/5
            </Text>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  otpInput: {
    width: 60,
    height: 60,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
  },
  verifyButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  verifyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timerText: {
    fontSize: FONT_SIZES.sm,
  },
  resendButton: {
    paddingVertical: SPACING.sm,
  },
  resendButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  resendCountText: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
}); 