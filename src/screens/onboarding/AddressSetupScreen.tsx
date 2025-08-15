import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, BackButton } from '../../components';
import { SPACING, FONT_SIZES, SCREEN_NAMES, VALIDATION, ERROR_MESSAGES } from '../../utils/constants';

const AddressSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { createAddress, loading } = useAuth();

  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!formData.city.trim()) {
      newErrors.city = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!formData.state.trim()) {
      newErrors.state = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.PINCODE.test(formData.pincode)) {
      newErrors.pincode = ERROR_MESSAGES.INVALID_PINCODE;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createAddress(formData);
      if (result.success) {
        Alert.alert(
          'Success',
          'Address added successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to add address');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Address Setup',
      'Are you sure you want to skip adding an address? You can add it later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Address Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Add Your Garage Address
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            This will be used for customer location and delivery purposes
          </Text>

          <View style={styles.form}>
            {/* Address Line 1 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Address Line 1 *
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface, borderColor: colors.outline },
                errors.addressLine1 && { borderColor: colors.error }
              ]}>
                <Text style={[styles.input, { color: colors.text }]}>
                  {formData.addressLine1 || 'Enter your street address'}
                </Text>
              </View>
              {errors.addressLine1 && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.addressLine1}
                </Text>
              )}
            </View>

            {/* Address Line 2 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Address Line 2 (Optional)
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface, borderColor: colors.outline }
              ]}>
                <Text style={[styles.input, { color: colors.text }]}>
                  {formData.addressLine2 || 'Apartment, suite, etc.'}
                </Text>
              </View>
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                City *
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface, borderColor: colors.outline },
                errors.city && { borderColor: colors.error }
              ]}>
                <Text style={[styles.input, { color: colors.text }]}>
                  {formData.city || 'Enter your city'}
                </Text>
              </View>
              {errors.city && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.city}
                </Text>
              )}
            </View>

            {/* State */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                State *
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface, borderColor: colors.outline },
                errors.state && { borderColor: colors.error }
              ]}>
                <Text style={[styles.input, { color: colors.text }]}>
                  {formData.state || 'Enter your state'}
                </Text>
              </View>
              {errors.state && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.state}
                </Text>
              )}
            </View>

            {/* Pincode */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Pincode *
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface, borderColor: colors.outline },
                errors.pincode && { borderColor: colors.error }
              ]}>
                <Text style={[styles.input, { color: colors.text }]}>
                  {formData.pincode || 'Enter 6-digit pincode'}
                </Text>
              </View>
              {errors.pincode && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.pincode}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Add Address"
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            />
            
            <Button
              title="Skip for Now"
              onPress={handleSkip}
              variant="outline"
              disabled={loading}
              style={styles.skipButton}
            />
          </View>

          <View style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              You can add multiple addresses later from your profile settings
            </Text>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: FONT_SIZES.md,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginBottom: SPACING.sm,
  },
  skipButton: {
    marginBottom: SPACING.sm,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AddressSetupScreen;
