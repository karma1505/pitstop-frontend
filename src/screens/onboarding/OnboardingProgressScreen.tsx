import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, OnboardingProgress } from '../../components';
import { SPACING, FONT_SIZES, ONBOARDING_STEPS, SCREEN_NAMES } from '../../utils/constants';

const OnboardingProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const {
    onboardingStatus,
    completionPercentage,
    currentStep,
    getOnboardingStatus,
    loading,
  } = useAuth();

  const [steps, setSteps] = useState([
    {
      id: ONBOARDING_STEPS.GARAGE_SETUP,
      title: 'Garage Setup',
      description: 'Configure your garage details and business information',
      icon: 'business',
      completed: false,
      current: false,
    },
    {
      id: ONBOARDING_STEPS.ADDRESS_SETUP,
      title: 'Address Setup',
      description: 'Add your garage location and contact information',
      icon: 'location',
      completed: false,
      current: false,
    },
    {
      id: ONBOARDING_STEPS.PAYMENT_SETUP,
      title: 'Payment Methods',
      description: 'Set up payment options for your customers',
      icon: 'card',
      completed: false,
      current: false,
    },
    {
      id: ONBOARDING_STEPS.STAFF_SETUP,
      title: 'Staff Management',
      description: 'Add your team members and assign roles',
      icon: 'people',
      completed: false,
      current: false,
    },
  ]);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  useEffect(() => {
    updateSteps();
  }, [onboardingStatus, currentStep]);

  const loadOnboardingStatus = async () => {
    try {
      await getOnboardingStatus();
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      Alert.alert('Error', 'Failed to load onboarding status');
    }
  };

  const updateSteps = () => {
    if (!onboardingStatus) return;

    setSteps(prevSteps =>
      prevSteps.map(step => {
        let completed = false;
        let current = false;

        switch (step.id) {
          case ONBOARDING_STEPS.GARAGE_SETUP:
            completed = onboardingStatus.hasGarage;
            current = currentStep === ONBOARDING_STEPS.GARAGE_SETUP;
            break;
          case ONBOARDING_STEPS.ADDRESS_SETUP:
            completed = onboardingStatus.hasAddress;
            current = currentStep === ONBOARDING_STEPS.ADDRESS_SETUP;
            break;
          case ONBOARDING_STEPS.PAYMENT_SETUP:
            completed = onboardingStatus.hasPaymentMethods;
            current = currentStep === ONBOARDING_STEPS.PAYMENT_SETUP;
            break;
          case ONBOARDING_STEPS.STAFF_SETUP:
            completed = onboardingStatus.hasStaff;
            current = currentStep === ONBOARDING_STEPS.STAFF_SETUP;
            break;
        }

        return { ...step, completed, current };
      })
    );
  };

  const handleStepPress = (stepId: string) => {
    // Navigate to the appropriate screen based on step
    switch (stepId) {
      case ONBOARDING_STEPS.GARAGE_SETUP:
        navigation.navigate(SCREEN_NAMES.GARAGE_SETUP as never);
        break;
      case ONBOARDING_STEPS.ADDRESS_SETUP:
        navigation.navigate(SCREEN_NAMES.ADDRESS_SETUP as never);
        break;
      case ONBOARDING_STEPS.PAYMENT_SETUP:
        navigation.navigate(SCREEN_NAMES.PAYMENT_SETUP as never);
        break;
      case ONBOARDING_STEPS.STAFF_SETUP:
        navigation.navigate(SCREEN_NAMES.STAFF_SETUP as never);
        break;
    }
  };

  const handleContinue = () => {
    // Navigate to the next incomplete step or home if all complete
    if (completionPercentage === 100) {
      navigation.navigate(SCREEN_NAMES.HOME as never);
    } else {
      const nextStep = steps.find(step => !step.completed);
      if (nextStep) {
        handleStepPress(nextStep.id);
      }
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Onboarding',
      'Are you sure you want to skip the onboarding process? You can complete it later from the settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => navigation.navigate(SCREEN_NAMES.HOME as never),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to PitStop!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Let's get your garage set up in just a few steps
          </Text>
        </View>

        {/* Progress Component */}
        <OnboardingProgress
          steps={steps}
          completionPercentage={completionPercentage}
          onStepPress={handleStepPress}
        />

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={completionPercentage === 100 ? 'Go to Dashboard' : 'Continue Setup'}
            onPress={handleContinue}
            disabled={loading}
            style={styles.continueButton}
          />
          
          {completionPercentage < 100 && (
            <Button
              title="Skip for Now"
              onPress={handleSkip}
              variant="outline"
              disabled={loading}
              style={styles.skipButton}
            />
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            You can complete these steps at any time from your profile settings
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  continueButton: {
    marginBottom: SPACING.sm,
  },
  skipButton: {
    marginBottom: SPACING.sm,
  },
  helpContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OnboardingProgressScreen;
