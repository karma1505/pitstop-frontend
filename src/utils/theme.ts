import { ThemeColors } from '../context/ThemeContext';

// Theme utility functions
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in a real app, you might want a more sophisticated algorithm
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const getOpacityColor = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const alpha = Math.round(opacity * 255);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Theme spacing and sizing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
} as const;

export const shadows = {
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// Animation durations for theme transitions
export const animationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Theme-aware shadow helper
export const getThemeShadow = (colors: ThemeColors, shadowType: keyof typeof shadows = 'light') => {
  const shadow = shadows[shadowType];
  return {
    ...shadow,
    shadowColor: '#000000', // Always use black for shadow
  };
}; 