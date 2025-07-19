import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Animated, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
}

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  
  // Error colors
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  
  // Border and outline colors
  outline: string;
  outlineVariant: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  
  // Button colors
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  
  // Status colors
  success: string;
  warning: string;
  info: string;
}

const lightColors: ThemeColors = {
  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Primary colors
  primary: '#007AFF',
  primaryContainer: '#E3F2FD',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1A1A1A',
  
  // Secondary colors
  secondary: '#6C757D',
  secondaryContainer: '#F8F9FA',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1A1A1A',
  
  // Error colors
  error: '#DC3545',
  errorContainer: '#F8D7DA',
  onError: '#FFFFFF',
  onErrorContainer: '#721C24',
  
  // Border and outline colors
  outline: '#E0E0E0',
  outlineVariant: '#F0F0F0',
  
  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputText: '#1A1A1A',
  inputPlaceholder: '#999999',
  
  // Button colors
  buttonPrimary: '#007AFF',
  buttonSecondary: '#F8F9FA',
  buttonText: '#FFFFFF',
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  info: '#17A2B8',
};

const darkColors: ThemeColors = {
  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  
  // Primary colors
  primary: '#0A84FF',
  primaryContainer: '#1C3A5F',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#FFFFFF',
  
  // Secondary colors
  secondary: '#8E8E93',
  secondaryContainer: '#2C2C2E',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#FFFFFF',
  
  // Error colors
  error: '#FF453A',
  errorContainer: '#3B1F1F',
  onError: '#FFFFFF',
  onErrorContainer: '#FFB4AB',
  
  // Border and outline colors
  outline: '#38383A',
  outlineVariant: '#48484A',
  
  // Input colors
  inputBackground: '#1E1E1E',
  inputBorder: '#38383A',
  inputText: '#FFFFFF',
  inputPlaceholder: '#808080',
  
  // Button colors
  buttonPrimary: '#0A84FF',
  buttonSecondary: '#2C2C2E',
  buttonText: '#FFFFFF',
  
  // Status colors
  success: '#30D158',
  warning: '#FFD60A',
  info: '#64D2FF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@PitStop_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isDark, setIsDark] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Initialize theme detection
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Load saved theme preference
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType);
          setIsDark(savedTheme === 'dark');
        } else {
          // Default to light theme
          setThemeState('light');
          setIsDark(false);
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        setThemeState('light');
        setIsDark(false);
      }
    };

    initializeTheme();
  }, []);

  // Get the actual colors based on current theme
  const getColors = (): ThemeColors => {
    return isDark ? darkColors : lightColors;
  };

  // Ensure colors are always available, fallback to light theme if needed
  const colors = getColors() || lightColors;

  const setTheme = async (newTheme: ThemeType) => {
    try {
      // Animate theme transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
      setIsDark(newTheme === 'dark');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Add device info logging
  useEffect(() => {
    console.log(`Device info: ${JSON.stringify({
      platform: Platform.OS,
      version: Platform.Version,
      isTesting: __DEV__,
      currentTheme: theme,
      isDark
    }, null, 2)}`);
  }, [theme, isDark]);

  const value: ThemeContextType = {
    theme,
    isDark,
    colors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    console.warn('useTheme must be used within a ThemeProvider, returning default values');
    return {
      theme: 'light',
      isDark: false,
      colors: lightColors,
      setTheme: () => {},
    };
  }
  return context;
}; 