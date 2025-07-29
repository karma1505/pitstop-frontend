import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { useTheme } from '../context/ThemeContext';

interface OTPTimerProps {
  onResend: () => void;
  disabled?: boolean;
}

export const OTPTimer = ({ onResend, disabled = false }: OTPTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 60) {
          setCanResend(true); // Enable after 1 minute
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResend = () => {
    if (canResend && !disabled) {
      setTimeLeft(120);
      setCanResend(false);
      onResend();
    }
  };

  return (
    <View style={styles.container}>
      {!canResend ? (
        <Text style={[styles.timerText, { color: colors.textSecondary }]}>
          Resend OTP in {formatTime(timeLeft)}
        </Text>
      ) : (
        <TouchableOpacity
          style={[
            styles.resendButton,
            { opacity: disabled ? 0.5 : 1 }
          ]}
          onPress={handleResend}
          disabled={disabled}
        >
          <Text style={[styles.resendButtonText, { color: colors.primary }]}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  timerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  resendButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  resendButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
}); 