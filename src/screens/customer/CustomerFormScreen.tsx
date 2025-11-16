import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomerService, CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse, VehicleInfo } from '../../api';
import { FormInput } from '../../components/forms/FormInput';
import AddressDropdown from '../../components/AddressDropdown';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';
import { getStates } from '../../utils/indianAddressData';

interface CustomerFormScreenProps {
  customerId?: string; // If provided, we're editing; otherwise, we're creating
  onNavigateBack: () => void;
  onSaveSuccess: () => void;
}

export default function CustomerFormScreen({
  customerId,
  onNavigateBack,
  onSaveSuccess,
}: CustomerFormScreenProps) {
  const { colors } = useTheme();
  const isEditing = !!customerId;
  const [loading, setLoading] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(isEditing);
  const [availableStates] = useState<string[]>(getStates());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
  });

  const [vehicleData, setVehicleData] = useState<VehicleInfo | null>(null);
  const [includeVehicle, setIncludeVehicle] = useState(false);
  const [yearInput, setYearInput] = useState<string>('');
  const [registrationInput, setRegistrationInput] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && customerId) {
      loadCustomer();
    }
  }, [customerId, isEditing]);

  const loadCustomer = async () => {
    try {
      setLoadingCustomer(true);
      const customer = await CustomerService.getCustomerById(customerId!);
      
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        addressLine1: customer.addressLine1 || '',
        addressLine2: customer.addressLine2 || '',
        city: customer.city || '',
        state: customer.state || '',
      });

      if (customer.vehicles && customer.vehicles.length > 0) {
        const vehicle = customer.vehicles[0];
        setVehicleData({
          registrationNumber: vehicle.registrationNumber,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
        });
        setYearInput(vehicle.year.toString());
        setRegistrationInput(vehicle.registrationNumber);
        setIncludeVehicle(true);
      }
    } catch (error: any) {
      console.error('Error loading customer:', error);
      Alert.alert('Error', error.message || 'Failed to load customer');
      onNavigateBack();
    } finally {
      setLoadingCustomer(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateVehicleData = (field: keyof VehicleInfo, value: string | number) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value,
    } as VehicleInfo));
    if (errors[`vehicle.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`vehicle.${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (includeVehicle && vehicleData) {
      if (!vehicleData.registrationNumber?.trim()) {
        newErrors['vehicle.registrationNumber'] = 'Registration number is required';
      } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(vehicleData.registrationNumber.trim())) {
        newErrors['vehicle.registrationNumber'] = 'Invalid format. Use: XX00XX0000 (e.g., MH12AB1234)';
      }
      if (!vehicleData.make?.trim()) {
        newErrors['vehicle.make'] = 'Make/Brand is required';
      }
      if (!vehicleData.model?.trim()) {
        newErrors['vehicle.model'] = 'Model is required';
      }
      if (!vehicleData.year || vehicleData.year < 1970 || vehicleData.year > 2050) {
        newErrors['vehicle.year'] = 'Year must be between 1970 and 2050';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    try {
      setLoading(true);

      const requestData: CreateCustomerRequest | UpdateCustomerRequest = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        addressLine1: formData.addressLine1.trim() || undefined,
        addressLine2: formData.addressLine2.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state || undefined,
      };

      if (includeVehicle && vehicleData) {
        requestData.vehicleInfo = vehicleData;
      }

      if (isEditing) {
        await CustomerService.updateCustomer(customerId!, requestData as UpdateCustomerRequest);
        Alert.alert('Success', 'Customer updated successfully');
      } else {
        await CustomerService.createCustomer(requestData as CreateCustomerRequest);
        Alert.alert('Success', 'Customer created successfully');
      }

      onSaveSuccess();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      Alert.alert('Error', error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCustomer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading customer...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton onPress={onNavigateBack} size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditing ? 'Edit Customer' : 'Add Customer'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

            <FormInput
              label="Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              error={errors.name}
              required
              placeholder="Enter customer name"
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => {
                // Remove all non-numeric characters and whitespace
                const numericValue = value.replace(/[^0-9]/g, '');
                // Limit to 10 digits
                const limitedValue = numericValue.slice(0, 10);
                updateFormData('phone', limitedValue);
              }}
              error={errors.phone}
              required
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              error={errors.email}
              placeholder="Enter email (optional)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Address</Text>

            <FormInput
              label="Address Line 1"
              value={formData.addressLine1}
              onChangeText={(value) => updateFormData('addressLine1', value)}
              placeholder="Enter address line 1 (optional)"
            />

            <FormInput
              label="Address Line 2"
              value={formData.addressLine2}
              onChangeText={(value) => updateFormData('addressLine2', value)}
              placeholder="Enter address line 2 (optional)"
            />

            <FormInput
              label="City"
              value={formData.city}
              onChangeText={(value) => updateFormData('city', value)}
              placeholder="Enter city (optional)"
            />

            <AddressDropdown
              label="State"
              value={formData.state}
              onSelect={(value: string) => updateFormData('state', value)}
              options={availableStates}
              placeholder="Select state (optional)"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.vehicleHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Information</Text>
              <TouchableOpacity
                onPress={() => {
                  setIncludeVehicle(!includeVehicle);
                  if (!includeVehicle && !vehicleData) {
                    const currentYear = new Date().getFullYear();
                    setVehicleData({
                      registrationNumber: '',
                      make: '',
                      model: '',
                      year: currentYear,
                    });
                    setYearInput(currentYear.toString());
                  } else if (!includeVehicle) {
                    setYearInput('');
                    setRegistrationInput('');
                  }
                }}
                style={[styles.toggleButton, { backgroundColor: includeVehicle ? colors.primary : colors.surface, borderColor: colors.outline }]}
              >
                <Text style={[styles.toggleButtonText, { color: includeVehicle ? '#fff' : colors.text }]}>
                  {includeVehicle ? 'Remove' : 'Add Vehicle'}
                </Text>
              </TouchableOpacity>
            </View>

            {includeVehicle && vehicleData && (
              <>
                <FormInput
                  label="Registration Number"
                  value={registrationInput}
                  onChangeText={(value) => {
                    // Remove all non-alphanumeric characters
                    let cleaned = value.replace(/[^A-Za-z0-9]/g, '');
                    
                    // Convert to uppercase
                    cleaned = cleaned.toUpperCase();
                    
                    // Format based on position
                    let formatted = '';
                    for (let i = 0; i < cleaned.length && i < 10; i++) {
                      const char = cleaned[i];
                      const position = i;
                      
                      // Positions 0-1: Letters only
                      if (position < 2) {
                        if (/[A-Z]/.test(char)) {
                          formatted += char;
                        }
                      }
                      // Positions 2-3: Numbers only
                      else if (position < 4) {
                        if (/[0-9]/.test(char)) {
                          formatted += char;
                        }
                      }
                      // Positions 4-5: Letters only
                      else if (position < 6) {
                        if (/[A-Z]/.test(char)) {
                          formatted += char;
                        }
                      }
                      // Positions 6-9: Numbers only
                      else {
                        if (/[0-9]/.test(char)) {
                          formatted += char;
                        }
                      }
                    }
                    
                    setRegistrationInput(formatted);
                    updateVehicleData('registrationNumber', formatted);
                    
                    // Clear error while typing
                    if (errors['vehicle.registrationNumber']) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors['vehicle.registrationNumber'];
                        return newErrors;
                      });
                    }
                  }}
                  error={errors['vehicle.registrationNumber']}
                  required
                  placeholder="e.g., MH12AB1234"
                  autoCapitalize="characters"
                  maxLength={10}
                />

                <FormInput
                  label="Make/Brand"
                  value={vehicleData.make}
                  onChangeText={(value) => updateVehicleData('make', value)}
                  error={errors['vehicle.make']}
                  required
                  placeholder="e.g., Toyota, Honda"
                />

                <FormInput
                  label="Model"
                  value={vehicleData.model}
                  onChangeText={(value) => updateVehicleData('model', value)}
                  error={errors['vehicle.model']}
                  required
                  placeholder="e.g., Camry, Civic"
                />

                <FormInput
                  label="Year"
                  value={yearInput}
                  onChangeText={(value) => {
                    // Allow empty string or numeric input
                    if (value === '') {
                      setYearInput('');
                      updateVehicleData('year', 0);
                      return;
                    }
                    
                    // Only allow digits
                    const numericValue = value.replace(/[^0-9]/g, '');
                    setYearInput(numericValue);
                    
                    // Parse and validate year
                    if (numericValue.length === 4) {
                      const year = parseInt(numericValue);
                      if (year >= 1970 && year <= 2050) {
                        updateVehicleData('year', year);
                      } else {
                        // Keep the input but mark as error
                        setErrors(prev => ({
                          ...prev,
                          'vehicle.year': 'Year must be between 1970 and 2050'
                        }));
                      }
                    } else if (numericValue.length > 0 && numericValue.length < 4) {
                      // Allow partial input while typing
                      const year = parseInt(numericValue);
                      updateVehicleData('year', year);
                      // Clear error while typing
                      if (errors['vehicle.year']) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors['vehicle.year'];
                          return newErrors;
                        });
                      }
                    }
                  }}
                  error={errors['vehicle.year']}
                  required
                  placeholder="e.g., 2020"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update Customer' : 'Create Customer'}
                </Text>
              )}
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
    paddingTop: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    marginTop: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  formSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  toggleButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  saveButton: {
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
});

