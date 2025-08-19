import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button, BackButton } from '../../components';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { FormInput } from '../../components/forms/FormInput';
import { OnboardingService } from '../../services/onboardingService';
import { StaffData, StaffRoleType } from '../../types/onboarding';
import { SPACING } from '../../utils';

interface StaffRegistrationScreenProps {
  onNavigateToNext: () => void;
  onNavigateBack: () => void;
}

const STAFF_ROLES: { value: StaffRoleType; label: string; description: string; icon: string }[] = [
  {
    value: 'MECHANIC',
    label: 'Mechanic',
    description: '',
    icon: '🔧',
  },
  {
    value: 'RECEPTIONIST',
    label: 'Receptionist',
    description: '',
    icon: '👨‍💼',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
    description: '',
    icon: '👔',
  },
];

export const StaffRegistrationScreen: React.FC<StaffRegistrationScreenProps> = ({
  onNavigateToNext,
  onNavigateBack,
}) => {
  const { colors } = useTheme();
  const { 
    stepConfigs, 
    onboardingData, 
    updateStaffData, 
    goToNextStep,
    canProceedToNextStep 
  } = useOnboarding();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStaff, setCurrentStaff] = useState<Partial<StaffData>>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    aadharNumber: '',
    role: 'MECHANIC',
  });
  const [staffList, setStaffList] = useState<StaffData[]>(onboardingData.staff);

  const validateStaffForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentStaff.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!currentStaff.mobileNumber?.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(currentStaff.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (currentStaff.aadharNumber && !/^\d{12}$/.test(currentStaff.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStaff = () => {
    if (!validateStaffForm()) {
      return;
    }

    const newStaff: StaffData = {
      id: `temp-${Date.now()}`,
      firstName: currentStaff.firstName!,
      lastName: currentStaff.lastName || '',
      mobileNumber: currentStaff.mobileNumber!,
      aadharNumber: currentStaff.aadharNumber || '',
      role: currentStaff.role!,
      isActive: true,
      jobsCompleted: 0,
    };

    const updatedStaffList = [...staffList, newStaff];
    setStaffList(updatedStaffList);
    updateStaffData(updatedStaffList);

    // Reset form
    setCurrentStaff({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      aadharNumber: '',
      role: 'MECHANIC',
    });
    setErrors({});
  };

  const handleRemoveStaff = (staffId: string) => {
    Alert.alert(
      'Remove Staff Member',
      'Are you sure you want to remove this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedStaffList = staffList.filter(staff => staff.id !== staffId);
            setStaffList(updatedStaffList);
            updateStaffData(updatedStaffList);
          },
        },
      ]
    );
  };

  const handleNext = async () => {
    if (staffList.length === 0) {
      Alert.alert('No Staff Members', 'Please add at least one staff member before proceeding.');
      return;
    }

    // No API calls here - just update context and proceed to next step
    // All data will be saved atomically at the final completion step
    console.log('Staff members to be created:', staffList);
    
    // Update context with staff data (using temporary IDs for frontend)
    const staffData = staffList.map((staff, index) => ({
      id: `temp-staff-${index}`, // Temporary ID for frontend
      ...staff,
    }));
    
    updateStaffData(staffData);
    
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
          Staff Management
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={3}
          totalSteps={stepConfigs.length}
          stepConfigs={stepConfigs}
          showLabels={false}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Add Staff Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Add Staff Member
            </Text>

            <FormInput
              label="First Name"
              value={currentStaff.firstName}
              onChangeText={(text) => setCurrentStaff(prev => ({ ...prev, firstName: text }))}
              placeholder="Enter first name"
              required
              error={errors.firstName}
            />
            <FormInput
              label="Last Name"
              value={currentStaff.lastName}
              onChangeText={(text) => setCurrentStaff(prev => ({ ...prev, lastName: text }))}
              placeholder="Enter last name (optional)"
            />

            <FormInput
              label="Mobile Number"
              value={currentStaff.mobileNumber}
              onChangeText={(text) => setCurrentStaff(prev => ({ ...prev, mobileNumber: text }))}
              placeholder="Enter 10-digit mobile number"
              required
              error={errors.mobileNumber}
              keyboardType="numeric"
              maxLength={10}
            />

            <FormInput
              label="Aadhar Number"
              value={currentStaff.aadharNumber}
              onChangeText={(text) => setCurrentStaff(prev => ({ ...prev, aadharNumber: text }))}
              placeholder="Enter 12-digit Aadhar number (optional)"
              error={errors.aadharNumber}
              keyboardType="numeric"
              maxLength={12}
            />

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={[styles.roleLabel, { color: colors.text }]}>
                Role *
              </Text>
              <View style={styles.roleOptions}>
                {STAFF_ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      {
                        borderColor: currentStaff.role === role.value ? colors.primary : colors.outline,
                        backgroundColor: currentStaff.role === role.value ? colors.primaryContainer : colors.surface,
                      },
                    ]}
                    onPress={() => setCurrentStaff(prev => ({ ...prev, role: role.value }))}
                  >
                    <Text style={styles.roleIcon}>{role.icon}</Text>
                    <Text
                      style={[
                        styles.roleText,
                        {
                          color: currentStaff.role === role.value ? colors.onPrimaryContainer : colors.text,
                          fontWeight: currentStaff.role === role.value ? '600' : '400',
                        },
                      ]}
                    >
                      {role.label}
                    </Text>
                    <Text
                      style={[
                        styles.roleDescription,
                        {
                          color: currentStaff.role === role.value ? colors.onPrimaryContainer : colors.textSecondary,
                        },
                      ]}
                    >
                      {role.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Add Staff Member"
              onPress={handleAddStaff}
              variant="primary"
              style={styles.addButton}
            />
          </View>

          {/* Staff List Section */}
          {staffList.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Staff Members ({staffList.length})
              </Text>

              {staffList.map((staff, index) => (
                <View
                  key={staff.id}
                  style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
                >
                  <View style={styles.staffInfo}>
                    <Text style={[styles.staffName, { color: colors.text }]}>
                      {staff.firstName} {staff.lastName}
                    </Text>
                    <Text style={[styles.staffRole, { color: colors.textSecondary }]}>
                      {STAFF_ROLES.find(r => r.value === staff.role)?.label}
                    </Text>
                    <Text style={[styles.staffMobile, { color: colors.textSecondary }]}>
                      {staff.mobileNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: colors.error }]}
                    onPress={() => handleRemoveStaff(staff.id!)}
                  >
                    <Text style={[styles.removeButtonText, { color: colors.onError }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Help Text */}
          <View style={[styles.helpContainer, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.helpTitle, { color: colors.onPrimaryContainer }]}>
              💡 Tip
            </Text>
            <Text style={[styles.helpText, { color: colors.onPrimaryContainer }]}>
              Add all your key staff members now. You can always add more later from the staff management section.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          disabled={staffList.length === 0}
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
  roleSection: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  roleOptions: {
    gap: 12,
  },
  roleOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
  },
  addButton: {
    height: 48,
  },
  staffCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  staffRole: {
    fontSize: 14,
    marginBottom: 2,
  },
  staffMobile: {
    fontSize: 14,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
