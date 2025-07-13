import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen, LoginScreen, SignUpScreen, SettingsScreen } from './screens';
import { AuthProvider, useAuth } from './context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home' | 'settings'>('login');
  const { isAuthenticated, loading } = useAuth();
  const { isDark } = useTheme();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const handleNavigateBackToHome = () => {
    setCurrentScreen('home');
  };

  // Show splash screen initially
  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  // Show loading while checking authentication status
  if (loading) {
    return (
      <>
        <SplashScreen onFinish={() => {}} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  // If authenticated, show home screen or settings
  if (isAuthenticated) {
    if (currentScreen === 'settings') {
      return (
        <>
          <SettingsScreen onNavigateBack={handleNavigateBackToHome} />
          <StatusBar style={isDark ? "light" : "dark"} />
        </>
      );
    }
    return (
      <>
        <HomeScreen onNavigateToSettings={handleNavigateToSettings} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  // If not authenticated, show login/signup screens
  if (currentScreen === 'signup') {
    return (
      <>
        <SignUpScreen onNavigateToLogin={handleNavigateToLogin} onNavigateToHome={handleNavigateToHome} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  return (
    <>
      <LoginScreen onNavigateToSignUp={handleNavigateToSignUp} onNavigateToHome={handleNavigateToHome} />
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
} 