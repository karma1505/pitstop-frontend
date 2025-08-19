import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../utils';

interface BackButtonProps {
  onPress: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function BackButton({ onPress, style, size = 'medium' }: BackButtonProps) {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, borderRadius: 20 };
      case 'large':
        return { width: 64, height: 64, borderRadius: 32 };
      default: // medium
        return { width: 56, height: 56, borderRadius: 28 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.backButton,
        getSizeStyles(),
        { backgroundColor: colors.primary },
        style
      ]}
      onPress={onPress}
    >
      <Icon
        name="chevron-back"
        size={size === 'small' ? 18 : size === 'large' ? 28 : 24}
        color={colors.onPrimary}
        style={{ marginRight: 2 }} // Slight adjustment to center
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 