import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { Button } from '../components';
import { validateEmail, validatePassword, isValidEmail } from '../utils/validators';
import AddressDropdown from '../components/AddressDropdown';
import { 
  getStates
} from '../utils/indianAddressData';
import Icon from 'react-native-vector-icons/Ionicons';
import loginLogo from '../assets/images/login-logo.png';
import { useAuth } from '../context';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  garageName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  mobileNumber: string;
}

interface SignUpScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToHome?: () => void;
}

export default function SignUpScreen({ onNavigateToLogin, onNavigateToHome }: SignUpScreenProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    garageName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    mobileNumber: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasSpecialChar: false,
    hasMinLength: false,
    hasNumeric: false,
  });

  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  
  // Address dropdown states
  const [availableStates] = useState<string[]>(getStates());

  // Progress bar animation
  const progressAnim = new Animated.Value(currentPage === 1 ? 0 : 1);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentPage === 1 ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentPage]);

  // Password validation
  useEffect(() => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    const hasMinLength = formData.password.length >= 8;
    const hasNumeric = /\d/.test(formData.password);
    
    setPasswordValidation({
      hasSpecialChar,
      hasMinLength,
      hasNumeric,
    });
  }, [formData.password]);

  const updateFormData = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle state selection
  const handleStateSelect = (selectedState: string) => {
    updateFormData('state', selectedState);
  };

  // Handle pincode input - simplified without auto-fetch
  const handlePincodeChange = (pincode: string) => {
    updateFormData('pincode', pincode);
  };

  // Add visual feedback for validation errors
  const getInputStyle = (field: keyof SignUpData) => {
    return [
      styles.textInput,
      errors[field] && styles.inputError
    ];
  };

  const getPasswordInputStyle = (error?: string) => {
    return [
      styles.passwordInput,
      error && styles.inputError
    ];
  };

  const validatePage1 = (): boolean => {
    const newErrors: Partial<SignUpData> = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@domain.com)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.hasMinLength || !passwordValidation.hasSpecialChar || !passwordValidation.hasNumeric) {
      newErrors.password = 'Password must be at least 8 characters and contain a special character and a number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      // Trigger haptic feedback for password mismatch
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = (): boolean => {
    const newErrors: Partial<SignUpData> = {};

    if (!formData.garageName.trim()) newErrors.garageName = 'Garage name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    // Mobile number validation
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
    
    // Pincode validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (validatePage1()) {
      setCurrentPage(2);
    } else {
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
    }
  };

  const handleBackPage = () => {
    setCurrentPage(1);
  };

    const handleSignUp = async () => {
    if (!validatePage2()) return;

    try {
      const result = await register(formData);
      
      if (result.success) {
        // Navigate directly to home screen without showing alert
        if (onNavigateToHome) {
          onNavigateToHome();
        }
      } else {
        // Trigger haptic feedback for registration failure
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      // Trigger haptic feedback for network error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Registration failed. Please check your connection and try again.');
    }
  };

  const isPage1Complete = () => {
    return (
      formData.firstName.trim() &&
      formData.email.trim() &&
      isValidEmail(formData.email) && // Use isValidEmail which returns boolean
      formData.password &&
      passwordValidation.hasMinLength &&
      passwordValidation.hasSpecialChar &&
      passwordValidation.hasNumeric &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    showPassword: boolean,
    onTogglePassword: () => void,
    error?: string,
    required?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {label}
        {required && <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>}
      </Text>
      <View style={[styles.passwordContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
        <TextInput
          style={[getPasswordInputStyle(error), { color: colors.inputText }]}
          placeholder={`Enter your ${label.toLowerCase()}`}
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={onTogglePassword}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );

  const renderInput = (
    label: string,
    field: keyof SignUpData,
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
        style={[
          styles.textInput, 
          errors[field] && styles.inputError,
          { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }
        ]}
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

  const renderPage1 = () => (
    <View style={styles.page}>
      <TouchableOpacity
        style={styles.backToLoginButton}
        onPress={() => {
          // Navigate back to login page
          // This will be handled by the parent component
          if (onNavigateToLogin) {
            onNavigateToLogin();
          }
        }}
      >
        <Icon
          name="arrow-back"
          size={24}
          color={colors.textTertiary}
        />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Image source={loginLogo} style={styles.logoImage} resizeMode="contain" />
        <Text style={[styles.title, { color: colors.text }]}>Welcome To PitStop</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Start managing your garage</Text>
      </View>

      <View style={styles.form}>
        {/* Name Fields */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              First Name
              <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
            </Text>
            <TextInput
              style={[getInputStyle('firstName'), { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }]}
              placeholder="Enter first name"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              autoCapitalize="words"
            />
            {errors.firstName && <Text style={[styles.errorText, { color: colors.error }]}>{errors.firstName}</Text>}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Last Name</Text>
            <TextInput
              style={[getInputStyle('lastName'), { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }]}
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

        {/* Password Field */}
        {renderPasswordInput(
          'Password',
          formData.password,
          (value) => updateFormData('password', value),
          showPassword,
          () => setShowPassword(!showPassword),
          errors.password,
          true
        )}

        {/* Password Validation Checklist */}
        <View style={styles.validationContainer}>
          <View style={styles.validationItem}>
            <View style={[
              styles.validationDot,
              { backgroundColor: passwordValidation.hasMinLength ? colors.success : colors.textTertiary }
            ]} />
            <Text style={[
              styles.validationText,
              { color: passwordValidation.hasMinLength ? colors.success : colors.textSecondary }
            ]}>
              Minimum 8 characters
            </Text>
          </View>
          <View style={styles.validationItem}>
            <View style={[
              styles.validationDot,
              { backgroundColor: passwordValidation.hasSpecialChar ? colors.success : colors.textTertiary }
            ]} />
            <Text style={[
              styles.validationText,
              { color: passwordValidation.hasSpecialChar ? colors.success : colors.textSecondary }
            ]}>
              Must contain a special character
            </Text>
          </View>
          <View style={styles.validationItem}>
            <View style={[
              styles.validationDot,
              { backgroundColor: passwordValidation.hasNumeric ? colors.success : colors.textTertiary }
            ]} />
            <Text style={[
              styles.validationText,
              { color: passwordValidation.hasNumeric ? colors.success : colors.textSecondary }
            ]}>
              Must contain a number
            </Text>
          </View>
        </View>

        {/* Confirm Password Field */}
        {renderPasswordInput(
          'Confirm Password',
          formData.confirmPassword,
          (value) => updateFormData('confirmPassword', value),
          showConfirmPassword,
          () => setShowConfirmPassword(!showConfirmPassword),
          errors.confirmPassword,
          true
        )}
        
        {/* Password mismatch warning */}
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <Text style={[styles.errorText, { color: colors.error }]}>Passwords do not match</Text>
        )}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          isPage1Complete() ? { backgroundColor: colors.primary } : { backgroundColor: colors.outline }
        ]}
        onPress={handleNextPage}
        disabled={!isPage1Complete()}
      >
        <Icon
          name="chevron-forward"
          size={24}
          color={isPage1Complete() ? colors.onPrimary : colors.textTertiary}
          style={{ marginLeft: 2 }} // Slight adjustment to center
        />
      </TouchableOpacity>
    </View>
  );

  const renderPage2 = () => (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Garage Details</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tell us about your garage</Text>
      </View>

      <View style={styles.form}>
        {/* Garage Name */}
        {renderInput(
          'Garage Name',
          'garageName',
          'Enter garage name',
          true
        )}

        {/* Address Fields */}
        {renderInput(
          'Garage Address Line 1',
          'addressLine1',
          'Enter address line 1',
          true
        )}

        {renderInput(
          'Garage Address Line 2',
          'addressLine2',
          'Enter address line 2 (optional)',
          false
        )}

        {/* State and City */}
        <View>
          <View style={[styles.inputContainer, styles.twoThirdsWidth]}>
            <AddressDropdown
              label="State"
              value={formData.state}
              placeholder="Select state"
              options={availableStates}
              onSelect={handleStateSelect}
              error={errors.state}
              required={true}
              disableSearch={true}
            />
          </View>

          <View style={[styles.inputContainer, styles.oneThirdWidth]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              City
              <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput, 
                errors.city && styles.inputError,
                { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }
              ]}
              placeholder="City Name"
              placeholderTextColor={colors.inputPlaceholder}
              value={formData.city}
              onChangeText={(value) => {
                // Only allow letters, spaces, and hyphens
                const filteredValue = value.replace(/[^a-zA-Z\s\-]/g, '');
                updateFormData('city', filteredValue);
              }}
              autoCapitalize="words"
            />
            {errors.city && <Text style={[styles.errorText, { color: colors.error }]}>{errors.city}</Text>}
          </View>
        </View>

        {/* Mobile Number and Pincode */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.twoThirdsWidth]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Mobile Number</Text>
            <View style={[styles.mobileInputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
              <TextInput
                style={[
                  styles.mobileTextInput, 
                  errors.mobileNumber && styles.inputError,
                  { color: colors.inputText }
                ]}
                placeholderTextColor={colors.inputPlaceholder}
                value={formData.mobileNumber}
                onChangeText={(value) => {
                  // Restrict input based on first character
                  if (value.startsWith('0')) {
                    // If starts with 0, allow max 11 digits
                    if (value.length <= 11 && /^\d*$/.test(value)) {
                      updateFormData('mobileNumber', value);
                    }
                  } else {
                    // If starts with 1-9, allow max 10 digits
                    if (value.length <= 10 && /^\d*$/.test(value)) {
                      updateFormData('mobileNumber', value);
                    }
                  }
                }}
                keyboardType="phone-pad"
              />
              <Icon
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
                style={styles.mobileChevron}
              />
            </View>
            {errors.mobileNumber && <Text style={[styles.errorText, { color: colors.error }]}>{errors.mobileNumber}</Text>}
          </View>

          <View style={[styles.inputContainer, styles.oneThirdWidth]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Pincode
              <Text style={[styles.requiredAsterisk, { color: colors.error }]}> *</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput, 
                errors.pincode && styles.inputError,
                { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }
              ]}
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
      <View style={styles.page2Buttons}>
        <TouchableOpacity
          style={{ 
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.outline,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={handleBackPage}
        >
          <Icon
            name="chevron-back"
            size={24}
            color={colors.textTertiary}
            style={{ marginRight: 2 }} // Slight adjustment to center
          />
        </TouchableOpacity>

        <View style={styles.signUpButtonContainer}>
          <Button
            title={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignUp}
            disabled={loading}
            style={styles.signUpButton}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Progress Bar - Moved lower */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.outline }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary },
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['50%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>{currentPage}/2</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentPage === 1 ? renderPage1() : renderPage2()}
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl, // Increased from SPACING.md
    paddingBottom: SPACING.lg, // Increased from SPACING.sm
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  page: {
    flex: 1,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: SPACING.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
    flex: 1,
  },
  halfWidth: {
    flex: 0.5,
  },
  twoThirdsWidth: {
    flex: 0.6667, // 2/3
  },
  oneThirdWidth: {
    flex: 0.3333, // 1/3
  },
  quarterWidth: {
    flex: 0.25, // 1/4
  },
  mobileInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 52,
  },
  mobileTextInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  mobileChevron: {
    marginLeft: 8,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  requiredAsterisk: {
    fontWeight: 'bold',
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
    borderRadius: 12,
    borderWidth: 1,
  },
  passwordInput: {
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingRight: 50, // Space for eye icon
    fontSize: FONT_SIZES.md,
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjusted for better centering
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconText: {
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderWidth: 1,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  validationContainer: {
    marginBottom: SPACING.lg,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  validationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  validationText: {
    fontSize: FONT_SIZES.sm,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonActive: {},
  nextButtonInactive: {},
  nextButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  nextButtonTextActive: {},
  nextButtonTextInactive: {},
  page2Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  signUpButtonContainer: {
    flex: 1,
    height: 56,
  },
  signUpButton: {
    height: 56,
    borderRadius: 28,
  },
  backToLoginButton: {
    position: 'absolute',
    top: 5,
    left: 1,
    zIndex: 10,
    padding: 8,
  },
}); 