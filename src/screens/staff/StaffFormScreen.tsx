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
import { StaffService, CreateStaffRequest, UpdateStaffRequest, StaffRole } from '../../api';
import { FormInput } from '../../components/forms/FormInput';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES, STAFF_ROLES } from '../../utils';

interface StaffFormScreenProps {
  staffId?: string; // If provided, we're editing; otherwise, we're creating
  onNavigateBack: () => void;
  onSaveSuccess: () => void;
}

export default function StaffFormScreen({
  staffId,
  onNavigateBack,
  onSaveSuccess,
}: StaffFormScreenProps) {
  const { colors } = useTheme();
  const isEditing = !!staffId;
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(isEditing);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    aadharNumber: '',
    role: 'MECHANIC' as StaffRole,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && staffId) {
      loadStaff();
    }
  }, [staffId, isEditing]);

  const loadStaff = async () => {
    try {
      setLoadingStaff(true);
      const staff = await StaffService.getStaffById(staffId!);
      
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        mobileNumber: staff.mobileNumber || '',
        aadharNumber: staff.aadharNumber || '',
        role: staff.role,
      });
    } catch (error: any) {
      console.error('Error loading staff:', error);
      Alert.alert('Error', error.message || 'Failed to load staff member');
      onNavigateBack();
    } finally {
      setLoadingStaff(false);
    }
  };

  const updateFormData = (field: string, value: string | StaffRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }

    if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber.trim())) {
      newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditing && staffId) {
        const updateData: UpdateStaffRequest = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim() || undefined,
          mobileNumber: formData.mobileNumber.trim(),
          aadharNumber: formData.aadharNumber.trim() || undefined,
          role: formData.role,
        };
        await StaffService.updateStaff(staffId, updateData);
        Alert.alert('Success', 'Staff member updated successfully');
      } else {
        const createData: CreateStaffRequest = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim() || undefined,
          mobileNumber: formData.mobileNumber.trim(),
          aadharNumber: formData.aadharNumber.trim() || undefined,
          role: formData.role,
        };
        await StaffService.createStaff(createData);
        Alert.alert('Success', 'Staff member added successfully');
      }

      onSaveSuccess();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      Alert.alert('Error', error.message || 'Failed to save staff member');
    } finally {
      setLoading(false);
    }
  };

  if (loadingStaff) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading staff member...
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
          {isEditing ? 'Edit Staff' : 'Add Staff'}
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
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              error={errors.firstName}
              required
              placeholder="Enter first name"
            />

            <FormInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Enter last name (optional)"
            />

            <FormInput
              label="Phone Number"
              value={formData.mobileNumber}
              onChangeText={(value) => {
                // Remove all non-numeric characters
                const numericValue = value.replace(/[^0-9]/g, '');
                // Limit to 10 digits
                const limitedValue = numericValue.slice(0, 10);
                updateFormData('mobileNumber', limitedValue);
              }}
              error={errors.mobileNumber}
              required
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <FormInput
              label="Aadhar Number"
              value={formData.aadharNumber}
              onChangeText={(value) => {
                // Remove all non-numeric characters
                const numericValue = value.replace(/[^0-9]/g, '');
                // Limit to 12 digits
                const limitedValue = numericValue.slice(0, 12);
                updateFormData('aadharNumber', limitedValue);
              }}
              error={errors.aadharNumber}
              placeholder="Enter Aadhar number (optional)"
              keyboardType="number-pad"
              maxLength={12}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Role</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Select the role for this staff member
            </Text>

            <View style={styles.roleOptions}>
              {Object.values(STAFF_ROLES).map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleOption,
                    {
                      borderColor: formData.role === role.value ? colors.primary : colors.outline,
                      backgroundColor: formData.role === role.value ? colors.primary + '20' : colors.surface,
                    },
                  ]}
                  onPress={() => updateFormData('role', role.value as StaffRole)}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <View style={styles.roleInfo}>
                    <Text
                      style={[
                        styles.roleLabel,
                        {
                          color: formData.role === role.value ? colors.primary : colors.text,
                          fontWeight: formData.role === role.value ? '600' : '500',
                        },
                      ]}
                    >
                      {role.label}
                    </Text>
                    <Text
                      style={[
                        styles.roleDescription,
                        {
                          color: formData.role === role.value ? colors.primary : colors.textSecondary,
                        },
                      ]}
                    >
                      {role.description}
                    </Text>
                  </View>
                  {formData.role === role.value && (
                    <Icon name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Staff' : 'Add Staff'}
              </Text>
            )}
          </TouchableOpacity>
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
    padding: SPACING.lg,
  },
  formSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  roleOptions: {
    gap: SPACING.md,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  roleIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  roleInfo: {
    flex: 1,
  },
  roleLabel: {
    fontSize: FONT_SIZES.md,
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: FONT_SIZES.sm,
  },
  saveButton: {
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    minHeight: 50,
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

