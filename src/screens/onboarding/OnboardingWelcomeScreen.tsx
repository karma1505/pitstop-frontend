import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../../components';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { SPACING } from '../../utils';

interface OnboardingWelcomeScreenProps {
  onNavigateToNext: () => void;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onNavigateToNext,
}) => {
  const { colors } = useTheme();
  const { stepConfigs, goToNextStep } = useOnboarding();

  const handleGetStarted = () => {
    goToNextStep();
    onNavigateToNext();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <OnboardingProgress
            currentStep={0}
            totalSteps={stepConfigs.length}
            stepConfigs={stepConfigs}
            showLabels={false}
          />
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome to PitStop
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Let's get your garage set up in just a few steps
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.featureIconText, { color: colors.onPrimaryContainer }]}>🏢</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Garage Setup
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Configure your garage details and business information
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.featureIconText, { color: colors.onPrimaryContainer }]}>💳</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Payment Methods
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Set up multiple payment options for your customers
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.featureIconText, { color: colors.onPrimaryContainer }]}>👥</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Staff Management
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Add your team members and assign roles
                </Text>
              </View>
            </View>
          </View>

          {/* Estimated Time */}
          <View style={[styles.timeEstimate, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.timeEstimateText, { color: colors.textSecondary }]}>
              ⏱️ Estimated time: 5-10 minutes
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          style={styles.getStartedButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  progressContainer: {
    marginTop: SPACING.xxxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeEstimate: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeEstimateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  getStartedButton: {
    height: 48,
  },
});
