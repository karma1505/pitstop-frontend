import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { StaffService, StaffResponse } from '../../api';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface StaffDetailScreenProps {
  staffId: string;
  onNavigateBack: () => void;
  onNavigateToEdit: (staffId: string) => void;
}

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'MECHANIC':
      return 'Mechanic';
    case 'RECEPTIONIST':
      return 'Receptionist';
    case 'MANAGER':
      return 'Manager';
    default:
      return role;
  }
};

const getRoleColor = (role: string, colors: any): string => {
  switch (role) {
    case 'MECHANIC':
      return colors.primary;
    case 'RECEPTIONIST':
      return colors.success;
    case 'MANAGER':
      return colors.warning;
    default:
      return colors.textSecondary;
  }
};

export default function StaffDetailScreen({
  staffId,
  onNavigateBack,
  onNavigateToEdit,
}: StaffDetailScreenProps) {
  const { colors } = useTheme();
  const [staff, setStaff] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, [staffId]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await StaffService.getStaffById(staffId);
      setStaff(data);
    } catch (error: any) {
      console.error('Error loading staff:', error);
      Alert.alert('Error', error.message || 'Failed to load staff member');
      onNavigateBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = async () => {
    if (!staff?.mobileNumber) return;
    
    const phoneNumber = `tel:${staff.mobileNumber}`;
    try {
      const canOpen = await Linking.canOpenURL(phoneNumber);
      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert('Error', 'Unable to open phone dialer');
      }
    } catch (error) {
      console.error('Error opening phone dialer:', error);
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleToggleStatus = async () => {
    if (!staff) return;

    const action = staff.isActive ? 'deactivate' : 'activate';
    const confirmMessage = staff.isActive
      ? 'Are you sure you want to deactivate this staff member?'
      : 'Are you sure you want to activate this staff member?';

    Alert.alert(
      'Confirm Action',
      confirmMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'activate' ? 'Activate' : 'Deactivate',
          style: action === 'deactivate' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              if (staff.isActive) {
                await StaffService.deactivateStaff(staff.id);
              } else {
                await StaffService.activateStaff(staff.id);
              }
              loadStaff(); // Reload to get updated status
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update staff status');
            }
          },
        },
      ]
    );
  };

  if (loading) {
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

  if (!staff) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Staff member not found
          </Text>
          <TouchableOpacity
            style={[styles.backButtonAction, { backgroundColor: colors.primary }]}
            onPress={onNavigateBack}
          >
            <Text style={styles.backButtonActionText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton onPress={onNavigateBack} size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Details</Text>
        <TouchableOpacity
          onPress={() => onNavigateToEdit(staffId)}
          style={styles.editButton}
        >
          <Icon name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileSection, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <View style={[styles.avatar, { backgroundColor: getRoleColor(staff.role, colors) + '20' }]}>
            <Text style={[styles.avatarText, { color: getRoleColor(staff.role, colors) }]}>
              {staff.firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.staffName, { color: colors.text }]}>
            {staff.firstName} {staff.lastName || ''}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(staff.role, colors) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(staff.role, colors) }]}>
              {getRoleLabel(staff.role)}
            </Text>
          </View>
          {!staff.isActive && (
            <View style={[styles.inactiveBadge, { backgroundColor: colors.error + '20', marginTop: SPACING.xs }]}>
              <Text style={[styles.inactiveBadgeText, { color: colors.error }]}>Inactive</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          
          <TouchableOpacity
            style={[styles.infoCard, styles.clickableCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <View style={styles.infoRow}>
              <Icon name="call-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{staff.mobileNumber}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Staff Information</Text>
          
          {staff.aadharNumber && (
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <View style={styles.infoRow}>
                <Icon name="card-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Aadhar Number</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{staff.aadharNumber}</Text>
                </View>
              </View>
            </View>
          )}

          {staff.jobsCompleted !== undefined && staff.jobsCompleted > 0 && (
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline, marginTop: SPACING.md }]}>
              <View style={styles.infoRow}>
                <Icon name="checkmark-circle-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Jobs Completed</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {staff.jobsCompleted} job{staff.jobsCompleted !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline, marginTop: SPACING.md }]}>
            <View style={styles.infoRow}>
              <Icon name="information-circle-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
                <Text style={[styles.infoValue, { color: staff.isActive ? colors.success : colors.error }]}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Joined On</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(staff.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            {staff.updatedAt && staff.updatedAt !== staff.createdAt && (
              <View style={[styles.infoRow, styles.infoRowSpacing]}>
                <Icon name="time-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Updated</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(staff.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.statusButton,
            {
              backgroundColor: staff.isActive ? colors.error + '20' : colors.success + '20',
              borderColor: staff.isActive ? colors.error : colors.success,
            },
          ]}
          onPress={handleToggleStatus}
        >
          <Icon
            name={staff.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
            size={20}
            color={staff.isActive ? colors.error : colors.success}
          />
          <Text
            style={[
              styles.statusButtonText,
              { color: staff.isActive ? colors.error : colors.success },
            ]}
          >
            {staff.isActive ? 'Deactivate Staff' : 'Activate Staff'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  editButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
  },
  staffName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  roleText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  inactiveBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  infoCard: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  clickableCard: {
    // Additional styles for clickable cards if needed
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRowSpacing: {
    marginTop: SPACING.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: SPACING.lg,
  },
  statusButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.lg,
  },
  backButtonAction: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonActionText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

