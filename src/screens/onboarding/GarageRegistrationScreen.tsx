import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button, BackButton } from '../../components';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { FormInput } from '../../components/forms/FormInput';
import { OnboardingService } from '../../services/onboardingService';
import { SPACING } from '../../utils';

interface GarageRegistrationScreenProps {
  onNavigateToNext: () => void;
  onNavigateBack: () => void;
}

export const GarageRegistrationScreen: React.FC<GarageRegistrationScreenProps> = ({
  onNavigateToNext,
  onNavigateBack,
}) => {
  const { colors } = useTheme();
  const { 
    stepConfigs, 
    onboardingData, 
    updateGarageData, 
    updateAddressData, 
    goToNextStep,
    canProceedToNextStep 
  } = useOnboarding();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Garage validation
    if (!onboardingData.garage.garageName.trim()) {
      newErrors.garageName = 'Garage name is required';
    }

    if (!onboardingData.garage.businessHours.trim()) {
      newErrors.businessHours = 'Business hours are required';
    }

    // Address validation
    if (!onboardingData.address.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!onboardingData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!onboardingData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!onboardingData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(onboardingData.address.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    console.log('=== GARAGE REGISTRATION DEBUG ===');
    console.log('Current onboarding data:', JSON.stringify(onboardingData, null, 2));
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    if (!canProceedToNextStep()) {
      console.log('Cannot proceed to next step');
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
      return;
    }

    // No API calls here - just validate and proceed to next step
    // All data will be saved atomically at the final completion step
    console.log('Validation passed, proceeding to next step without API calls');
    
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
          Garage Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={1}
          totalSteps={stepConfigs.length}
          stepConfigs={stepConfigs}
          showLabels={false}
        />

        {/* Form Content */}
        <View style={styles.content}>
          {/* Garage Information Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Garage Information
            </Text>

            <FormInput
              label="Garage Name"
              value={onboardingData.garage.garageName}
              onChangeText={(text) => updateGarageData({ garageName: text })}
              placeholder="Enter your garage name"
              required
              error={errors.garageName}
            />

            <FormInput
              label="Business Registration Number"
              value={onboardingData.garage.businessRegistrationNumber}
              onChangeText={(text) => updateGarageData({ businessRegistrationNumber: text })}
              placeholder="Enter business registration number"
              helperText="Optional - for business verification"
            />

            <FormInput
              label="GST Number"
              value={onboardingData.garage.gstNumber}
              onChangeText={(text) => updateGarageData({ gstNumber: text })}
              placeholder="Enter GST number"
              helperText="Optional - for tax purposes"
            />

            <FormInput
              label="Logo URL"
              value={onboardingData.garage.logoUrl}
              onChangeText={(text) => updateGarageData({ logoUrl: text })}
              placeholder="Enter logo URL"
              helperText="Optional - your garage logo"
            />

            <FormInput
              label="Website URL"
              value={onboardingData.garage.websiteUrl}
              onChangeText={(text) => updateGarageData({ websiteUrl: text })}
              placeholder="Enter website URL"
              helperText="Optional - your garage website"
            />

            <FormInput
              label="Business Hours"
              value={onboardingData.garage.businessHours}
              onChangeText={(text) => updateGarageData({ businessHours: text })}
              placeholder="e.g., Monday to Saturday: 9:00 AM - 7:00 PM"
              required
              error={errors.businessHours}
              multiline
              numberOfLines={3}
            />

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                Has Multiple Branches
              </Text>
              <Switch
                value={onboardingData.garage.hasBranch}
                onValueChange={(value) => updateGarageData({ hasBranch: value })}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryContainer }}
                thumbColor={onboardingData.garage.hasBranch ? colors.primary : colors.outline}
              />
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Address Information
            </Text>

            <FormInput
              label="Address Line 1"
              value={onboardingData.address.addressLine1}
              onChangeText={(text) => updateAddressData({ addressLine1: text })}
              placeholder="Enter street address"
              required
              error={errors.addressLine1}
            />

            <FormInput
              label="Address Line 2"
              value={onboardingData.address.addressLine2}
              onChangeText={(text) => updateAddressData({ addressLine2: text })}
              placeholder="Enter apartment, suite, etc. (optional)"
            />

            <FormInput
              label="City"
              value={onboardingData.address.city}
              onChangeText={(text) => updateAddressData({ city: text })}
              placeholder="Enter city"
              required
              error={errors.city}
            />

            <FormInput
              label="State"
              value={onboardingData.address.state}
              onChangeText={(text) => updateAddressData({ state: text })}
              placeholder="Enter state"
              required
              error={errors.state}
            />

            <FormInput
              label="Pincode"
              value={onboardingData.address.pincode}
              onChangeText={(text) => updateAddressData({ pincode: text })}
              placeholder="Enter 6-digit pincode"
              required
              error={errors.pincode}
              keyboardType="numeric"
              maxLength={6}
            />

            <FormInput
              label="Country"
              value={onboardingData.address.country}
              onChangeText={(text) => updateAddressData({ country: text })}
              placeholder="Enter country"
              required
              editable={false}
              helperText="Default: India"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          disabled={!canProceedToNextStep() || loading}
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
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
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
