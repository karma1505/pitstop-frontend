import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, BackButton } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES, SCREEN_NAMES, VALIDATION, ERROR_MESSAGES } from '../../utils/constants';

const StaffSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { createStaff, loading } = useAuth();

  const [staffMembers, setStaffMembers] = useState<Array<{
    firstName: string;
    lastName: string;
    mobileNumber: string;
    aadharNumber: string;
    role: 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';
  }>>([]);

  const [currentStaff, setCurrentStaff] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    aadharNumber: '',
    role: 'MECHANIC' as 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { id: 'MECHANIC', title: 'Mechanic', description: 'Vehicle repair and maintenance', icon: 'construct' },
    { id: 'RECEPTIONIST', title: 'Receptionist', description: 'Customer service and bookings', icon: 'person' },
    { id: 'MANAGER', title: 'Manager', description: 'Garage operations management', icon: 'business' },
  ];

  const validateStaffMember = (staff: typeof currentStaff) => {
    const newErrors: Record<string, string> = {};

    if (!staff.firstName.trim()) {
      newErrors.firstName = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!staff.lastName.trim()) {
      newErrors.lastName = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!staff.mobileNumber.trim()) {
      newErrors.mobileNumber = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.PHONE.test(staff.mobileNumber)) {
      newErrors.mobileNumber = ERROR_MESSAGES.INVALID_PHONE;
    }

    if (!staff.aadharNumber.trim()) {
      newErrors.aadharNumber = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.AADHAR.test(staff.aadharNumber)) {
      newErrors.aadharNumber = ERROR_MESSAGES.INVALID_AADHAR;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addStaffMember = () => {
    if (!validateStaffMember(currentStaff)) {
      return;
    }

    setStaffMembers(prev => [...prev, { ...currentStaff }]);
    setCurrentStaff({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      aadharNumber: '',
      role: 'MECHANIC',
    });
    setErrors({});
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (staffMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one staff member');
      return;
    }

    try {
      let successCount = 0;
      for (const staff of staffMembers) {
        const result = await createStaff(staff);
        if (result.success) {
          successCount++;
        }
      }

      if (successCount === staffMembers.length) {
        Alert.alert(
          'Success',
          'Staff members added successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
            },
          ]
        );
      } else {
        Alert.alert('Partial Success', 'Some staff members were added successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Staff Setup',
      'Are you sure you want to skip adding staff members? You can add them later from settings.',
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Add Your Team Members
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Add staff members who will work at your garage
          </Text>

          {/* Add Staff Form */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Staff Member</Text>
            
            {/* Name Fields */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                <Text style={[styles.label, { color: colors.text }]}>First Name *</Text>
                <View style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.outline },
                  errors.firstName && { borderColor: colors.error }
                ]}>
                  <Text style={[styles.input, { color: colors.text }]}>
                    {currentStaff.firstName || 'Enter first name'}
                  </Text>
                </View>
                {errors.firstName && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.firstName}
                  </Text>
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
                <Text style={[styles.label, { color: colors.text }]}>Last Name *</Text>
                <View style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.outline },
                  errors.lastName && { borderColor: colors.error }
                ]}>
                  <Text style={[styles.input, { color: colors.text }]}>
                    {currentStaff.lastName || 'Enter last name'}
                  </Text>
                </View>
                {errors.lastName && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            {/* Contact Fields */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                <Text style={[styles.label, { color: colors.text }]}>Mobile Number *</Text>
                <View style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.outline },
                  errors.mobileNumber && { borderColor: colors.error }
                ]}>
                  <Text style={[styles.input, { color: colors.text }]}>
                    {currentStaff.mobileNumber || 'Enter mobile number'}
                  </Text>
                </View>
                {errors.mobileNumber && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.mobileNumber}
                  </Text>
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
                <Text style={[styles.label, { color: colors.text }]}>Aadhar Number *</Text>
                <View style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.outline },
                  errors.aadharNumber && { borderColor: colors.error }
                ]}>
                  <Text style={[styles.input, { color: colors.text }]}>
                    {currentStaff.aadharNumber || 'Enter Aadhar number'}
                  </Text>
                </View>
                {errors.aadharNumber && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.aadharNumber}
                  </Text>
                )}
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Role *</Text>
              <View style={styles.roleContainer}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleCard,
                      { backgroundColor: colors.background, borderColor: colors.outline },
                      currentStaff.role === role.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                    ]}
                    onPress={() => setCurrentStaff(prev => ({ ...prev, role: role.id as any }))}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={20}
                      color={currentStaff.role === role.id ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                      styles.roleTitle,
                      { color: currentStaff.role === role.id ? colors.primary : colors.text }
                    ]}>
                      {role.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Add Staff Member"
              onPress={addStaffMember}
              disabled={loading}
              style={styles.addButton}
            />
          </View>

          {/* Staff List */}
          {staffMembers.length > 0 && (
            <View style={styles.staffList}>
              <Text style={[styles.listTitle, { color: colors.text }]}>
                Added Staff Members ({staffMembers.length})
              </Text>
              {staffMembers.map((staff, index) => (
                <View key={index} style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                  <View style={styles.staffInfo}>
                    <Text style={[styles.staffName, { color: colors.text }]}>
                      {staff.firstName} {staff.lastName}
                    </Text>
                    <Text style={[styles.staffDetails, { color: colors.textSecondary }]}>
                      {staff.role} • {staff.mobileNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeStaffMember(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button
              title="Complete Setup"
              onPress={handleSubmit}
              disabled={loading || staffMembers.length === 0}
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
              You can manage staff members later from your profile settings
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
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
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
  roleContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  roleTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  addButton: {
    marginTop: SPACING.md,
  },
  staffList: {
    marginBottom: SPACING.xl,
  },
  listTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  staffDetails: {
    fontSize: FONT_SIZES.sm,
  },
  removeButton: {
    padding: SPACING.xs,
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

export default StaffSetupScreen;
