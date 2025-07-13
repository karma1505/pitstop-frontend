import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { SPACING, FONT_SIZES } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    // Only apply disabledText for non-primary variants to maintain consistent color
    disabled && variant !== 'primary' && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        variant === 'primary' && { backgroundColor: colors.primary, borderColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.secondary, borderColor: colors.secondary },
        variant === 'outline' && { backgroundColor: 'transparent', borderColor: colors.primary },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        buttonTextStyle,
        variant === 'primary' && { color: colors.onPrimary },
        variant === 'secondary' && { color: colors.onSecondary },
        variant === 'outline' && { color: colors.primary },
        disabled && { color: colors.textTertiary },
      ]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24, // Increased from 8 to 16 for more rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    // Colors applied dynamically
  },
  secondary: {
    // Colors applied dynamically
  },
  outline: {
    backgroundColor: 'transparent',
    // Colors applied dynamically
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    // Colors applied dynamically
  },
  secondaryText: {
    // Colors applied dynamically
  },
  outlineText: {
    // Colors applied dynamically
  },
  smallText: {
    fontSize: FONT_SIZES.sm,
  },
  mediumText: {
    fontSize: FONT_SIZES.md,
  },
  largeText: {
    fontSize: FONT_SIZES.lg,
  },
  disabledText: {
    // Colors applied dynamically
  },
}); 