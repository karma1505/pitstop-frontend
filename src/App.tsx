import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, SplashScreen } from './screens';

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
      <HomeScreen />
      <StatusBar style="light" />
    </>
  );
} 