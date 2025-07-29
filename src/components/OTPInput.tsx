import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { useTheme } from '../context/ThemeContext';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend: () => void;
  disabled?: boolean;
}

export const OTPInput = ({ 
  length = 4, 
  onComplete, 
  onResend, 
  disabled = false 
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    // Auto-focus first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (disabled) return;

    const newOtp = [...otp];
    
    // Only allow single digit
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input if current input has value
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Clear the input when focused if it's not the first one
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearOTP = () => {
    setOtp(new Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
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
                opacity: disabled ? 0.6 : 1,
              },
            ]}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            editable={!disabled}
            selectTextOnFocus
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.lg,
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
}); 