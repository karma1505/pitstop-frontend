import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button, BackButton } from '../../components';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { OnboardingService } from '../../services/onboardingService';
import { SPACING } from '../../utils';

interface OnboardingCompleteScreenProps {
  onNavigateToHome: () => void;
  onNavigateBack: () => void;
}

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  onNavigateToHome,
  onNavigateBack,
}) => {
  const { colors } = useTheme();
  const { stepConfigs, onboardingData, completeOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = async () => {
    setIsSubmitting(true);
    try {
      console.log('=== COMPLETING ONBOARDING ATOMICALLY ===');
      console.log('Submitting all onboarding data:', JSON.stringify(onboardingData, null, 2));

      // First check if backend is accessible
      const connectivityCheck = await OnboardingService.checkBackendConnectivity();
      if (!connectivityCheck.isConnected) {
        throw new Error('Backend server is not accessible. Please ensure the server is running and try again.');
      }

      // Prepare the complete onboarding request
      const completeOnboardingRequest = {
        garageRequest: {
          garageName: onboardingData.garage.garageName,
          businessRegistrationNumber: onboardingData.garage.businessRegistrationNumber || '',
          gstNumber: onboardingData.garage.gstNumber || '',
          logoUrl: onboardingData.garage.logoUrl || '',
          websiteUrl: onboardingData.garage.websiteUrl || '',
          businessHours: onboardingData.garage.businessHours,
          hasBranch: onboardingData.garage.hasBranch,
        },
        addressRequest: {
          addressLine1: onboardingData.address.addressLine1,
          addressLine2: onboardingData.address.addressLine2 || '',
          city: onboardingData.address.city,
          state: onboardingData.address.state,
          pincode: onboardingData.address.pincode,
          country: onboardingData.address.country,
        },
        paymentMethodRequests: onboardingData.paymentMethods.map(pm => ({
          paymentMethod: pm.paymentMethod,
        })),
        staffRequests: onboardingData.staff.map(staff => ({
          firstName: staff.firstName,
          lastName: staff.lastName,
          mobileNumber: staff.mobileNumber,
          aadharNumber: staff.aadharNumber,
          role: staff.role,
        })),
      };

      console.log('Complete onboarding request:', JSON.stringify(completeOnboardingRequest, null, 2));

      // Submit all data atomically
      const response = await OnboardingService.completeOnboarding(completeOnboardingRequest);

      if (response.success) {
        console.log('Onboarding completed successfully:', response);
        completeOnboarding();
        onNavigateToHome();
      } else {
        throw new Error(response.message || 'Onboarding failed');
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      Alert.alert(
        'Onboarding Failed',
        error?.message || 'Failed to complete onboarding. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setIsSubmitting(false),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton 
          onPress={() => {
            console.log('Back button pressed');
            onNavigateBack();
          }} 
          size="small" 
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Setup Complete
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={4}
          totalSteps={stepConfigs.length}
          stepConfigs={stepConfigs}
          showLabels={false}
        />

        {/* Success Content */}
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
            <Text style={[styles.successIconText, { color: colors.onSuccess }]}>✓</Text>
          </View>

          {/* Success Message */}
          <View style={styles.successMessage}>
            <Text style={[styles.title, { color: colors.text }]}>
              Setup Complete!
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Your garage is now ready to serve customers
            </Text>
          </View>

          {/* Summary */}
          <View style={[styles.summaryContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              What's been set up:
            </Text>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.summaryIconText, { color: colors.onPrimaryContainer }]}>🏢</Text>
              </View>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryItemTitle, { color: colors.text }]}>
                  Garage Details
                </Text>
                <Text style={[styles.summaryItemDescription, { color: colors.textSecondary }]}>
                  {onboardingData.garage.garageName}
                </Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.summaryIconText, { color: colors.onPrimaryContainer }]}>📍</Text>
              </View>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryItemTitle, { color: colors.text }]}>
                  Address
                </Text>
                <Text style={[styles.summaryItemDescription, { color: colors.textSecondary }]}>
                  {onboardingData.address.addressLine1}, {onboardingData.address.city}
                </Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.summaryIconText, { color: colors.onPrimaryContainer }]}>💳</Text>
              </View>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryItemTitle, { color: colors.text }]}>
                  Payment Methods
                </Text>
                <Text style={[styles.summaryItemDescription, { color: colors.textSecondary }]}>
                  {onboardingData.paymentMethods.length} method(s) configured
                </Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.primaryContainer }]}>
                <Text style={[styles.summaryIconText, { color: colors.onPrimaryContainer }]}>👥</Text>
              </View>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryItemTitle, { color: colors.text }]}>
                  Staff Members
                </Text>
                <Text style={[styles.summaryItemDescription, { color: colors.textSecondary }]}>
                  {onboardingData.staff.length} member(s) added
                </Text>
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View style={[styles.nextStepsContainer, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.nextStepsTitle, { color: colors.onPrimaryContainer }]}>
              🚀 Next Steps
            </Text>
            <View>
              <Text style={[styles.nextStepsText, { color: colors.onPrimaryContainer }]}>
                • Start managing your garage operations
              </Text>
              <Text style={[styles.nextStepsText, { color: colors.onPrimaryContainer }]}>
                • Add more staff members as needed
              </Text>
              <Text style={[styles.nextStepsText, { color: colors.onPrimaryContainer }]}>
                • Configure additional settings
              </Text>
              <Text style={[styles.nextStepsText, { color: colors.onPrimaryContainer }]}>
                • Begin serving customers
              </Text>
            </View>
          </View>

          {/* Help Section */}
          <View style={[styles.helpContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>
              Need Help?
            </Text>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              You can always access the help section from the settings menu to learn more about using PitStop effectively.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <Button
          title={isSubmitting ? "Setting up..." : "Get Started"}
          onPress={handleGetStarted}
          variant="primary"
          disabled={isSubmitting}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: SPACING.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  successMessage: {
    alignItems: 'center',
    marginBottom: 32,
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
  summaryContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryIconText: {
    fontSize: 16,
  },
  summaryText: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  summaryItemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  nextStepsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  getStartedButton: {
    height: 48,
  },
});
