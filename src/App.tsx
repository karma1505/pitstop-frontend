import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen, LoginScreen, SignUpScreen } from './screens';
import { AuthProvider, useAuth } from './context';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home'>('login');
  const { isAuthenticated, loading } = useAuth();

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

  // Show splash screen initially
  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  // Show loading while checking authentication status
  if (loading) {
    return (
      <>
        <SplashScreen onFinish={() => {}} />
        <StatusBar style="light" />
      </>
    );
  }

  // If authenticated, show home screen
  if (isAuthenticated) {
    return (
      <>
        <HomeScreen />
        <StatusBar style="light" />
      </>
    );
  }

  // If not authenticated, show login/signup screens
  if (currentScreen === 'signup') {
    return (
      <>
        <SignUpScreen onNavigateToLogin={handleNavigateToLogin} onNavigateToHome={handleNavigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <LoginScreen onNavigateToSignUp={handleNavigateToSignUp} onNavigateToHome={handleNavigateToHome} />
      <StatusBar style="light" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
} 