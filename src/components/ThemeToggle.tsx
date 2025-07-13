import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../utils';

export default function ThemeToggle() {
  const { theme, setTheme, colors } = useTheme();

  const handleThemeChange = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={handleThemeChange}
    >
      <Text style={[styles.text, { color: colors.text }]}>
        Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </Text>
      <Text style={[styles.subtext, { color: colors.textSecondary }]}>
        Tap to cycle
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  subtext: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
}); 