import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen, LoginScreen, SignUpScreen } from './screens';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <>
        <SignUpScreen onNavigateToLogin={handleNavigateToLogin} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <LoginScreen onNavigateToSignUp={handleNavigateToSignUp} />
      <StatusBar style="light" />
    </>
  );
} 