import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen, LoginScreen } from './screens';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <LoginScreen />
      <StatusBar style="light" />
    </>
  );
} 