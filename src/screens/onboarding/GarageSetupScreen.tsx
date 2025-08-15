import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, BackButton } from '../../components';
import { SPACING, FONT_SIZES, SCREEN_NAMES, VALIDATION, ERROR_MESSAGES } from '../../utils/constants';
import { CreateGarageRequest } from '../../api/types';

const GarageSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { createGarage, garage, loading } = useAuth();

  const [formData, setFormData] = useState<CreateGarageRequest>({
    garageName: '',
    businessRegistrationNumber: '',
    gstNumber: '',
    logoUrl: '',
    websiteUrl: '',
    businessHours: '',
    hasBranch: false,
  });

  const [errors, setErrors] = useState<Partial<CreateGarageRequest>>({});

  useEffect(() => {
    // Pre-fill form if garage data exists
    if (garage) {
      setFormData({
        garageName: garage.garageName || '',
        businessRegistrationNumber: garage.businessRegistrationNumber || '',
        gstNumber: garage.gstNumber || '',
        logoUrl: garage.logoUrl || '',
        websiteUrl: garage.websiteUrl || '',
        businessHours: garage.businessHours || '',
        hasBranch: garage.hasBranch || false,
      });
    }
  }, [garage]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateGarageRequest> = {};

    if (!formData.garageName.trim()) {
      newErrors.garageName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.garageName.length > VALIDATION.MAX_NAME_LENGTH) {
      newErrors.garageName = `Garage name must not exceed ${VALIDATION.MAX_NAME_LENGTH} characters`;
    }

    if (!formData.businessRegistrationNumber.trim()) {
      newErrors.businessRegistrationNumber = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.businessRegistrationNumber.length > VALIDATION.BUSINESS_REG_LENGTH) {
      newErrors.businessRegistrationNumber = ERROR_MESSAGES.INVALID_BUSINESS_REG;
    }

    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.gstNumber.length !== VALIDATION.GST_LENGTH) {
      newErrors.gstNumber = ERROR_MESSAGES.INVALID_GST;
    }

    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof CreateGarageRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createGarage(formData);
      if (result.success) {
        Alert.alert(
          'Success',
          'Garage setup completed successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create garage');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Garage Setup
        </Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introContainer}>
          <Text style={[styles.introTitle, { color: colors.text }]}>
            Tell us about your garage
          </Text>
          <Text style={[styles.introSubtitle, { color: colors.textSecondary }]}>
            This information will help customers find and trust your business
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Garage Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Garage Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.garageName ? colors.error : colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter your garage name"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.garageName}
              onChangeText={(value) => handleInputChange('garageName', value)}
              maxLength={VALIDATION.MAX_NAME_LENGTH}
            />
            {errors.garageName && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.garageName}
              </Text>
            )}
          </View>

          {/* Business Registration Number */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Registration Number *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.businessRegistrationNumber ? colors.error : colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter business registration number"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.businessRegistrationNumber}
              onChangeText={(value) => handleInputChange('businessRegistrationNumber', value)}
              maxLength={VALIDATION.BUSINESS_REG_LENGTH}
            />
            {errors.businessRegistrationNumber && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.businessRegistrationNumber}
              </Text>
            )}
          </View>

          {/* GST Number */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              GST Number *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.gstNumber ? colors.error : colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter GST number"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.gstNumber}
              onChangeText={(value) => handleInputChange('gstNumber', value)}
              maxLength={VALIDATION.GST_LENGTH}
            />
            {errors.gstNumber && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.gstNumber}
              </Text>
            )}
          </View>

          {/* Website URL */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Website URL (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.websiteUrl ? colors.error : colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="https://yourgarage.com"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.websiteUrl}
              onChangeText={(value) => handleInputChange('websiteUrl', value)}
              keyboardType="url"
              autoCapitalize="none"
            />
            {errors.websiteUrl && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.websiteUrl}
              </Text>
            )}
          </View>

          {/* Business Hours */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Hours (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="e.g., Monday to Saturday: 8:00 AM - 8:00 PM"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.businessHours}
              onChangeText={(value) => handleInputChange('businessHours', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Has Branch */}
          <View style={styles.switchContainer}>
            <View style={styles.switchContent}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                Do you have multiple branches?
              </Text>
              <Text style={[styles.switchDescription, { color: colors.textSecondary }]}>
                Enable this if you operate multiple garage locations
              </Text>
            </View>
            <Switch
              value={formData.hasBranch}
              onValueChange={(value) => handleInputChange('hasBranch', value)}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor={colors.onPrimary}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Save & Continue"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  introContainer: {
    marginBottom: SPACING.xl,
  },
  introTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  introSubtitle: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  formContainer: {
    gap: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    minHeight: 52,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  switchContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  switchDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: SPACING.xl,
  },
  submitButton: {
    marginBottom: SPACING.md,
  },
});

export default GarageSetupScreen;
