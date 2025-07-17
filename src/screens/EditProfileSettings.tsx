import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context';
import { BackButton } from '../components';
import { AddressDropdown } from '../components';
import { getStates } from '../utils/indianAddressData';
import { isValidEmail } from '../utils/validators';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  mobileNumber: string;
  garageName: string;
  addressLine1: string;
  addressLine2: string;
}

interface EditProfileSettingsProps {
  onNavigateBack?: () => void;
}

export default function EditProfileSettings({ onNavigateBack }: EditProfileSettingsProps) {
  const { colors } = useTheme();
  const { user, updateProfile, loading } = useAuth();
  const [availableStates] = useState<string[]>(getStates());

  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    garageName: '',
    addressLine1: '',
    addressLine2: '',
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  // Initialize form data with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        state: user.state || '',
        city: user.city || '',
        pincode: user.pincode || '',
        mobileNumber: user.mobileNumber || '',
        garageName: user.garageName || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
      });
    }
  }, [user]);

  const updateFormData = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStateSelect = (selectedState: string) => {
    updateFormData('state', selectedState);
  };

  const handlePincodeChange = (pincode: string) => {
    updateFormData('pincode', pincode);
  };

  const getInputStyle = (field: keyof ProfileData) => {
    return [
      styles.textInput,
      errors[field] && styles.inputError,
      { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }
    ];
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Garage Name validation
    if (!formData.garageName.trim()) {
      newErrors.garageName = 'Garage name is required';
    }

    // Address validation
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Mobile number validation (optional but if provided, validate format)
    if (formData.mobileNumber.trim()) {
      const mobile = formData.mobileNumber.trim();
      if (mobile.startsWith('0')) {
        if (!/^\d{11}$/.test(mobile)) {
          newErrors.mobileNumber = 'Mobile number must be exactly 11 digits when starting with 0';
        }
      } else {
        if (!/^\d{10}$/.test(mobile)) {
          newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
        }
      }
    }

    // Pincode validation (optional but if provided, validate format)
    if (formData.pincode.trim()) {
      if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be exactly 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      // Trigger haptic feedback for validation errors
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Show a summary of validation errors
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        Alert.alert(
          'Validation Error',
          `Please fix the following issues:\n\n${errorMessages.join('\n')}`,
          [{ text: 'OK' }]
        );
      }
      return;
    }

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        // Trigger haptic feedback for success
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onNavigateBack) {
                  onNavigateBack();
                }
              },
            },
          ]
        );
      } else {
        // Trigger haptic feedback for error
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      // Trigger haptic feedback for network error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const renderInput = (
    label: string,
    field: keyof ProfileData,
    placeholder: string,
    required: boolean = false,
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad',
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {label}
        {required && <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>}
      </Text>
      <TextInput
        style={getInputStyle(field)}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
        autoCorrect={false}
      />
      {errors[field] && <Text style={[styles.errorText, { color: colors.error }]}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {onNavigateBack && (
                <BackButton onPress={onNavigateBack} size="small" style={styles.headerBackButton} />
              )}
              <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Update your profile information
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Fields */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  First Name
                  <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
                </Text>
                <TextInput
                  style={getInputStyle('firstName')}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                  autoCapitalize="words"
                />
                {errors.firstName && <Text style={[styles.errorText, { color: colors.error }]}>{errors.firstName}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Last Name
                  <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
                </Text>
                <TextInput
                  style={getInputStyle('lastName')}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                  autoCapitalize="words"
                />
                {errors.lastName && <Text style={[styles.errorText, { color: colors.error }]}>{errors.lastName}</Text>}
              </View>
            </View>

            {/* Email Field */}
            {renderInput(
              'Email',
              'email',
              'Enter your email',
              true,
              'email-address',
              'none'
            )}

            {/* Garage Name Field */}
            {renderInput(
              'Garage Name',
              'garageName',
              'Enter your garage name',
              true
            )}

            {/* Address Fields */}
            {renderInput(
              'Address Line 1',
              'addressLine1',
              'Enter your address',
              true
            )}

            {renderInput(
              'Address Line 2',
              'addressLine2',
              'Enter additional address details (optional)',
              false
            )}

            {/* State and City Row */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <AddressDropdown
                  label="State"
                  value={formData.state}
                  options={availableStates}
                  onSelect={handleStateSelect}
                  placeholder="Select state"
                  required={true}
                  error={errors.state}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  City
                  <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
                </Text>
                <TextInput
                  style={getInputStyle('city')}
                  placeholder="Enter city"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.city}
                  onChangeText={(value) => updateFormData('city', value)}
                  autoCapitalize="words"
                />
                {errors.city && <Text style={[styles.errorText, { color: colors.error }]}>{errors.city}</Text>}
              </View>
            </View>

            {/* Mobile Number and Pincode Row */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Mobile Number</Text>
                <TextInput
                  style={getInputStyle('mobileNumber')}
                  placeholder="Enter mobile number"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.mobileNumber}
                  onChangeText={(value) => updateFormData('mobileNumber', value)}
                  keyboardType="phone-pad"
                />
                {errors.mobileNumber && <Text style={[styles.errorText, { color: colors.error }]}>{errors.mobileNumber}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Pincode</Text>
                <TextInput
                  style={getInputStyle('pincode')}
                  placeholder="Enter pincode"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.pincode}
                  onChangeText={handlePincodeChange}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {errors.pincode && <Text style={[styles.errorText, { color: colors.error }]}>{errors.pincode}</Text>}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl * 2,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerBackButton: {
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  form: {
    paddingHorizontal: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
    flex: 1,
  },
  halfWidth: {
    flex: 0.48,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  requiredAsterisk: {
    fontWeight: 'bold',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
}); 