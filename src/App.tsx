import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen, LoginScreen, SignUpScreen } from './screens';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home'>('login');

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
        <SignUpScreen onNavigateToLogin={handleNavigateToLogin} onNavigateToHome={handleNavigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  if (currentScreen === 'home') {
    return (
      <>
        <HomeScreen />
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