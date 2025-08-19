import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PaymentMethodType } from '../../types/onboarding';

interface PaymentMethodCardProps {
  method: PaymentMethodType;
  isSelected: boolean;
  onToggle: (method: PaymentMethodType) => void;
  disabled?: boolean;
}

const PAYMENT_METHOD_CONFIG = {
  CASH: {
    title: 'Cash',
    description: '   payments',
    icon: '💵',
  },
  UPI: {
    title: 'UPI',
    description: 'Unified Payment Interface',
    icon: '📱',
  },
  CARD: {
    title: 'Card',
    description: 'Credit/Debit cards',
    icon: '💳',
  },
  BANK_TRANSFER: {
    title: 'Bank Transfer',
    description: 'Direct bank transfers',
    icon: '🏦',
  },
};

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const config = PAYMENT_METHOD_CONFIG[method];

  const handlePress = () => {
    if (!disabled) {
      onToggle(method);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: isSelected ? colors.primary : colors.outline,
          backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
        },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: isSelected ? colors.onPrimaryContainer : colors.text,
                fontWeight: isSelected ? '600' : '500',
              },
            ]}
          >
            {config.title}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: isSelected ? colors.onPrimaryContainer : colors.textSecondary,
              },
            ]}
          >
            {config.description}
          </Text>
        </View>

        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected ? colors.primary : colors.outline,
              backgroundColor: isSelected ? colors.primary : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <Text style={[styles.checkmark, { color: colors.onPrimary }]}>✓</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
