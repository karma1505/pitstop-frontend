import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { SCREEN_NAMES } from '../utils/constants';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingProgressScreen from '../screens/onboarding/OnboardingProgressScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import EditProfileSettings from '../screens/settings/EditProfileSettings';

// Placeholder screens for onboarding (to be created)
import GarageSetupScreen from '../screens/onboarding/GarageSetupScreen';
import AddressSetupScreen from '../screens/onboarding/AddressSetupScreen';
import PaymentSetupScreen from '../screens/onboarding/PaymentSetupScreen';
import StaffSetupScreen from '../screens/onboarding/StaffSetupScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, onboardingStatus, completionPercentage, loading } = useAuth();

  // Don't render navigation until loading is complete
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name={SCREEN_NAMES.SPLASH} component={SplashScreen} />
            <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={SCREEN_NAMES.REGISTER} component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : onboardingStatus && completionPercentage < 100 ? (
          // Onboarding Stack
          <>
            <Stack.Screen name={SCREEN_NAMES.ONBOARDING_PROGRESS} component={OnboardingProgressScreen} />
            <Stack.Screen name={SCREEN_NAMES.GARAGE_SETUP} component={GarageSetupScreen} />
            <Stack.Screen name={SCREEN_NAMES.ADDRESS_SETUP} component={AddressSetupScreen} />
            <Stack.Screen name={SCREEN_NAMES.PAYMENT_SETUP} component={PaymentSetupScreen} />
            <Stack.Screen name={SCREEN_NAMES.STAFF_SETUP} component={StaffSetupScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
            <Stack.Screen name={SCREEN_NAMES.PROFILE} component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileSettings} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 