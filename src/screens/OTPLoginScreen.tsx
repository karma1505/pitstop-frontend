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

interface OTPLoginScreenProps {
  onNavigateBack?: () => void;
  onNavigateToOTP?: (phoneNumber: string) => void;
}

export default function OTPLoginScreen({ onNavigateBack, onNavigateToOTP }: OTPLoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const { sendLoginOTP } = useAuth();

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendLoginOTP(phoneNumber.trim());
      
      if (result.success) {
        Alert.alert(
          'OTP Sent',
          'A verification code has been sent to your phone number.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onNavigateToOTP) {
                  onNavigateToOTP(phoneNumber.trim());
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP');
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
          
          <Text style={[styles.title, { color: colors.text }]}>Login with OTP</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your phone number to receive a login code
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.inputPlaceholder}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
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
              {isLoading ? 'Sending...' : 'Send Login OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpText}>
            <Text style={[styles.helpTextContent, { color: colors.textSecondary }]}>
              We'll send a 4-digit verification code to your phone number
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