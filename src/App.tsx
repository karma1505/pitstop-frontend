import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  HomeScreen, 
  SplashScreen, 
  LoginScreen, 
  SignUpScreen, 
  SettingsScreen,
  ForgotPasswordScreen,
  OTPVerificationScreen,
  ResetPasswordScreen,
  OTPLoginScreen,
  ChangePasswordScreen,
  EditProfileSettings
} from './screens';
import { AuthProvider, useAuth } from './context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home' | 'settings' | 'forgotPassword' | 'otpVerification' | 'resetPassword' | 'otpLogin' | 'changePassword' | 'editProfile'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState<'FORGOT_PASSWORD' | 'LOGIN_OTP'>('FORGOT_PASSWORD');
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

  const handleNavigateToForgotPassword = () => {
    setCurrentScreen('forgotPassword');
  };

  const handleNavigateToOTPLogin = () => {
    setCurrentScreen('otpLogin');
  };

  const handleNavigateToOTPVerification = (email: string, type: 'FORGOT_PASSWORD' | 'LOGIN_OTP' = 'FORGOT_PASSWORD') => {
    setUserEmail(email);
    setOtpType(type);
    setCurrentScreen('otpVerification');
  };

  const handleNavigateToResetPassword = (email: string, otp: string) => {
    setUserEmail(email);
    setOtpCode(otp);
    setCurrentScreen('resetPassword');
  };

  const handleNavigateToChangePassword = () => {
    setCurrentScreen('changePassword');
  };

  const handleNavigateToEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const handleNavigateBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateBackToLogin = () => {
    setCurrentScreen('login');
    setUserEmail('');
    setOtpCode('');
  };

  const handleNavigateBackToSettings = () => {
    setCurrentScreen('settings');
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
          <SettingsScreen 
            onNavigateBack={handleNavigateBackToHome} 
            onNavigateToChangePassword={handleNavigateToChangePassword}
            onNavigateToEditProfile={handleNavigateToEditProfile}
          />
          <StatusBar style={isDark ? "light" : "dark"} />
        </>
      );
    }
    
    if (currentScreen === 'changePassword') {
      return (
        <>
          <ChangePasswordScreen onNavigateBack={handleNavigateBackToSettings} />
          <StatusBar style={isDark ? "light" : "dark"} />
        </>
      );
    }

    if (currentScreen === 'editProfile') {
      return (
        <>
          <EditProfileSettings onNavigateBack={handleNavigateBackToSettings} />
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

  // If not authenticated, show login/signup/OTP screens
  if (currentScreen === 'signup') {
    return (
      <>
        <SignUpScreen onNavigateToLogin={handleNavigateToLogin} onNavigateToHome={handleNavigateToHome} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  if (currentScreen === 'forgotPassword') {
    return (
      <>
        <ForgotPasswordScreen onNavigateBack={handleNavigateBackToLogin} onNavigateToOTP={handleNavigateToOTPVerification} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  if (currentScreen === 'otpVerification') {
    return (
      <>
        <OTPVerificationScreen 
          userEmail={userEmail}
          type={otpType}
          onNavigateBack={handleNavigateBackToLogin} 
          onNavigateToReset={handleNavigateToResetPassword}
          onNavigateToHome={handleNavigateToHome}
        />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  if (currentScreen === 'resetPassword') {
    return (
      <>
        <ResetPasswordScreen 
          email={userEmail}
          otpCode={otpCode}
          onNavigateBack={handleNavigateBackToLogin} 
          onNavigateToLogin={handleNavigateBackToLogin} 
        />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  if (currentScreen === 'otpLogin') {
    return (
      <>
        <OTPLoginScreen onNavigateBack={handleNavigateBackToLogin} onNavigateToOTP={handleNavigateToOTPVerification} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </>
    );
  }

  return (
    <>
      <LoginScreen 
        onNavigateToSignUp={handleNavigateToSignUp} 
        onNavigateToHome={handleNavigateToHome}
        onNavigateToForgotPassword={handleNavigateToForgotPassword}
        onNavigateToOTPLogin={handleNavigateToOTPLogin}
      />
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