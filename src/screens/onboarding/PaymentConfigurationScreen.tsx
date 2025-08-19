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
import { PaymentMethodCard } from '../../components/onboarding/PaymentMethodCard';
import { OnboardingService } from '../../services/onboardingService';
import { PaymentMethodType } from '../../types/onboarding';
import { SPACING } from '../../utils';

interface PaymentConfigurationScreenProps {
  onNavigateToNext: () => void;
  onNavigateBack: () => void;
}

export const PaymentConfigurationScreen: React.FC<PaymentConfigurationScreenProps> = ({
  onNavigateToNext,
  onNavigateBack,
}) => {
  const { colors } = useTheme();
  const { 
    stepConfigs, 
    onboardingData, 
    updatePaymentMethods, 
    goToNextStep,
    canProceedToNextStep 
  } = useOnboarding();

  const [selectedMethods, setSelectedMethods] = useState<PaymentMethodType[]>(
    onboardingData.paymentMethods.map(pm => pm.paymentMethod)
  );

  const availablePaymentMethods: PaymentMethodType[] = [
    'CASH',
    'UPI',
    'CARD',
    'BANK_TRANSFER',
  ];

  const handleTogglePaymentMethod = (method: PaymentMethodType) => {
    setSelectedMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const handleNext = async () => {
    if (selectedMethods.length === 0) {
      Alert.alert('No Payment Methods', 'Please select at least one payment method before proceeding.');
      return;
    }

    // No API calls here - just update context and proceed to next step
    // All data will be saved atomically at the final completion step
    console.log('Payment methods selected:', selectedMethods);
    
    // Update context with selected payment methods
    const paymentMethodData = selectedMethods.map(method => ({
      id: `temp-${method}`, // Temporary ID for frontend
      paymentMethod: method,
    }));
    
    updatePaymentMethods(paymentMethodData);
    
    goToNextStep();
    onNavigateToNext();
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
          Payment Methods
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={2}
          totalSteps={stepConfigs.length}
          stepConfigs={stepConfigs}
          showLabels={false}
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Payment Methods
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Choose the payment methods you want to accept from your customers. You can always change these later.
            </Text>

            {/* Payment Method Cards */}
            <View style={styles.paymentMethodsContainer}>
              {availablePaymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method}
                  method={method}
                  isSelected={selectedMethods.includes(method)}
                  onToggle={handleTogglePaymentMethod}
                />
              ))}
            </View>

            {/* Selected Methods Summary */}
            {selectedMethods.length > 0 && (
              <View style={[styles.summaryContainer, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.summaryTitle, { color: colors.text }]}>
                  Selected Payment Methods ({selectedMethods.length})
                </Text>
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  {selectedMethods.join(', ')}
                </Text>
              </View>
            )}

            {/* Help Text */}
            <View style={[styles.helpContainer, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[styles.helpTitle, { color: colors.onPrimaryContainer }]}>
                💡 Tip
              </Text>
              <Text style={[styles.helpText, { color: colors.onPrimaryContainer }]}>
                Offering multiple payment options can increase customer satisfaction and improve your business efficiency.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          disabled={selectedMethods.length === 0}
          style={styles.nextButton}
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpContainer: {
    padding: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  nextButton: {
    height: 48,
  },
});
