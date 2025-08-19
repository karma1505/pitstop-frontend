import React, { useState, useEffect } from 'react';
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
  EditProfileSettings,
  // Onboarding screens
  OnboardingWelcomeScreen,
  GarageRegistrationScreen,
  PaymentConfigurationScreen,
  StaffRegistrationScreen,
  OnboardingCompleteScreen,
} from './screens';
import { AuthProvider, useAuth } from './context';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { OnboardingService } from './services/onboardingService';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home' | 'settings' | 'forgotPassword' | 'otpVerification' | 'resetPassword' | 'otpLogin' | 'changePassword' | 'editProfile' | 'onboarding'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState<'FORGOT_PASSWORD' | 'LOGIN_OTP'>('FORGOT_PASSWORD');
  const { isAuthenticated, loading, validateToken } = useAuth();
  const { isDark } = useTheme();
  const { currentStep, goToPreviousStep } = useOnboarding();

  // Check onboarding status when user is authenticated
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated && currentScreen === 'home') {
        try {
          // First validate the token to ensure backend is accessible
          const tokenValidation = await validateToken();
          
          if (!tokenValidation.isValid) {
            console.log('Token validation failed:', tokenValidation.error);
            // If token is invalid or backend is not accessible, redirect to login
            setCurrentScreen('login');
            return;
          }

          // Now check onboarding status
          const hasCompletedOnboarding = await OnboardingService.hasCompletedOnboarding();
          if (!hasCompletedOnboarding) {
            setCurrentScreen('onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // If we can't check onboarding status, redirect to login
          setCurrentScreen('login');
        }
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, currentScreen, validateToken]);

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

  // Onboarding navigation handlers
  const handleNavigateToOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const handleNavigateToNextOnboardingStep = () => {
    // The onboarding context will handle step progression
    // This is just for screen navigation
  };

  const handleNavigateBackInOnboarding = () => {
    // Use the onboarding context to go to the previous step
    goToPreviousStep();
  };

  const handleOnboardingComplete = () => {
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

  // If authenticated, show home screen, settings, or onboarding
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

    if (currentScreen === 'onboarding') {
      // Render onboarding flow based on current step
      switch (currentStep) {
        case 'WELCOME':
          return (
            <>
              <OnboardingWelcomeScreen onNavigateToNext={handleNavigateToNextOnboardingStep} />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
        case 'GARAGE_REGISTRATION':
          return (
            <>
              <GarageRegistrationScreen 
                onNavigateToNext={handleNavigateToNextOnboardingStep}
                onNavigateBack={handleNavigateBackInOnboarding}
              />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
        case 'PAYMENT_CONFIGURATION':
          return (
            <>
              <PaymentConfigurationScreen 
                onNavigateToNext={handleNavigateToNextOnboardingStep}
                onNavigateBack={handleNavigateBackInOnboarding}
              />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
        case 'STAFF_REGISTRATION':
          return (
            <>
              <StaffRegistrationScreen 
                onNavigateToNext={handleNavigateToNextOnboardingStep}
                onNavigateBack={handleNavigateBackInOnboarding}
              />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
        case 'COMPLETE':
          return (
            <>
              <OnboardingCompleteScreen 
                onNavigateToHome={handleOnboardingComplete} 
                onNavigateBack={handleNavigateBackInOnboarding}
              />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
        default:
          return (
            <>
              <OnboardingWelcomeScreen onNavigateToNext={handleNavigateToNextOnboardingStep} />
              <StatusBar style={isDark ? "light" : "dark"} />
            </>
          );
      }
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
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 