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
  Image,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../utils';
import { Button, BackButton } from '../../components';
import { validateEmail, validatePassword, isValidEmail } from '../../utils/validators';
import { Ionicons as Icon } from '@expo/vector-icons';
import loginLogo from '../../assets/images/login-logo.png';
import { useAuth } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToHome?: () => void;
}

export default function SignUpScreen({ onNavigateToLogin, onNavigateToHome }: SignUpScreenProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const { register, loading } = useAuth();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasSpecialChar: false,
    hasMinLength: false,
    hasNumeric: false,
  });

  const [errors, setErrors] = useState<Partial<SignUpData>>({});

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

  const validateForm = (): boolean => {
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

  const handleSignUp = async () => {
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
      // Only send user registration data, no garage information
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await register(userData);
      
             if (result.success) {
         // Navigate directly to onboarding instead of home to prevent flash
         // The App.tsx will handle checking onboarding status and redirecting appropriately
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

  const isFormComplete = () => {
    return (
      formData.firstName.trim() &&
      formData.email.trim() &&
      isValidEmail(formData.email) &&
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
                       <BackButton 
               onPress={() => {
                 if (onNavigateToLogin) {
                   onNavigateToLogin();
                 }
               }}
               size="small"
               style={styles.backToLoginButton}
             />
          
          <View style={styles.header}>
            <Image source={loginLogo} style={styles.logoImage} resizeMode="contain" />
            <Text style={[styles.title, { color: colors.text }]}>Welcome To PitStop</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Create your account</Text>
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
                  placeholder="First Name"
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
                  placeholder="Last Name"
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
               showPasswords,
               () => setShowPasswords(!showPasswords),
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
               showPasswords,
               () => setShowPasswords(!showPasswords),
               errors.confirmPassword,
               true
             )}
            
            {/* Password mismatch warning */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <Text style={[styles.errorText, { color: colors.error }]}>Passwords do not match</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <View style={styles.signUpButtonContainer}>
            <Button
              title={loading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignUp}
              disabled={loading || !isFormComplete()}
              style={styles.signUpButton}
            />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.xxxl,
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
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
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
  inputError: {
    borderWidth: 1,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  validationContainer: {
    marginBottom: SPACING.lg,
    marginLeft: SPACING.sm,
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
  signUpButtonContainer: {
    marginBottom: SPACING.xl,
  },
  signUpButton: {
    height: 56,
    borderRadius: 28,
  },
  backToLoginButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 10,
  },
}); 