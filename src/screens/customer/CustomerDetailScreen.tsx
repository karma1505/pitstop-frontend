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
  Platform,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomerService, CustomerResponse } from '../../api';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface CustomerDetailScreenProps {
  customerId: string;
  onNavigateBack: () => void;
  onNavigateToEdit: (customerId: string) => void;
}

export default function CustomerDetailScreen({
  customerId,
  onNavigateBack,
  onNavigateToEdit,
}: CustomerDetailScreenProps) {
  const { colors } = useTheme();
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const data = await CustomerService.getCustomerById(customerId);
      setCustomer(data);
    } catch (error: any) {
      console.error('Error loading customer:', error);
      Alert.alert('Error', error.message || 'Failed to load customer');
      onNavigateBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = async () => {
    if (!customer?.phone) return;
    
    const phoneNumber = `tel:${customer.phone}`;
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

  const handleEmailPress = async () => {
    if (!customer?.email) return;
    
    const emailUrl = `mailto:${customer.email}`;
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Error', 'Unable to open email app');
      }
    } catch (error) {
      console.error('Error opening email app:', error);
      Alert.alert('Error', 'Unable to send email');
    }
  };

  if (loading) {
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

  if (!customer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Customer not found
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Customer Details</Text>
        <TouchableOpacity
          onPress={() => onNavigateToEdit(customerId)}
          style={styles.editButton}
        >
          <Icon name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileSection, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.customerName, { color: colors.text }]}>{customer.name}</Text>
          {customer.isRegularCustomer && (
            <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.success }]}>Regular Customer</Text>
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
                <Text style={[styles.infoValue, { color: colors.text }]}>{customer.phone}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {customer.email && (
            <TouchableOpacity
              style={[styles.infoCard, styles.clickableCard, { backgroundColor: colors.surface, borderColor: colors.outline, marginTop: SPACING.md }]}
              onPress={handleEmailPress}
              activeOpacity={0.7}
            >
              <View style={styles.infoRow}>
                <Icon name="mail-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{customer.email}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {(customer.addressLine1 || customer.city || customer.state) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Address</Text>
            
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  {customer.addressLine1 && (
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {customer.addressLine1}
                    </Text>
                  )}
                  {customer.addressLine2 && (
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {customer.addressLine2}
                    </Text>
                  )}
                  {(customer.city || customer.state) && (
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {[customer.city, customer.state].filter(Boolean).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {customer.vehicles && customer.vehicles.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Vehicles ({customer.vehicles.length})
            </Text>
            
            {customer.vehicles.map((vehicle, index) => (
              <View
                key={vehicle.id}
                style={[
                  styles.infoCard,
                  { backgroundColor: colors.surface, borderColor: colors.outline },
                  index > 0 && styles.cardSpacing,
                ]}
              >
                <View style={styles.infoRow}>
                  <Icon name="car-outline" size={20} color={colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoValue, { color: colors.text, fontWeight: '600' }]}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </Text>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary, marginTop: 4 }]}>
                      Registration: {vehicle.registrationNumber}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>First Visit On</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(customer.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
              <View style={[styles.infoRow, styles.infoRowSpacing]}>
                <Icon name="time-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Updated</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(customer.updatedAt).toLocaleDateString('en-US', {
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
    padding: SPACING.md,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
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
  customerName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
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
    // Add subtle visual feedback for clickable cards
  },
  cardSpacing: {
    marginTop: SPACING.md,
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
    fontSize: FONT_SIZES.sm,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
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

