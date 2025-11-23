import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useAuth } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import { useTabNavigation } from '../../context/TabNavigationContext';
import { SPACING, FONT_SIZES } from '../../utils';
import MenuItemCard from '../../components/myGarage/MenuItemCard';
import BackButton from '../../components/BackButton';

interface MyGarageDashboardScreenProps {
  onNavigateBack?: () => void;
}

export default function MyGarageDashboardScreen({ onNavigateBack }: MyGarageDashboardScreenProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { navigateInMyGarage, setActiveTab } = useTabNavigation();

  const menuItems = [
    {
      id: 'customers',
      title: 'Customer Management',
      icon: 'people' as const,
      description: 'Manage customers and their information',
      onPress: () => navigateInMyGarage('customers'),
      enabled: true,
    },
    {
      id: 'vehicles',
      title: 'Vehicle Management',
      icon: 'car' as const,
      description: 'Track and manage vehicles',
      onPress: () => navigateInMyGarage('vehicles'),
      enabled: false, // To be implemented
    },
    {
      id: 'jobcards',
      title: 'Job Cards',
      icon: 'document-text' as const,
      description: 'Create and manage job cards',
      onPress: () => navigateInMyGarage('jobcards'),
      enabled: false, // To be implemented
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: 'cube' as const,
      description: 'Manage parts and stock',
      onPress: () => navigateInMyGarage('inventory'),
      enabled: false, // To be implemented
    },
    {
      id: 'financial',
      title: 'Financial Transactions',
      icon: 'cash' as const,
      description: 'Track payments and expenses',
      onPress: () => navigateInMyGarage('financial'),
      enabled: false, // To be implemented
    },
    {
      id: 'revenue',
      title: 'Revenue Analytics',
      icon: 'trending-up' as const,
      description: 'View revenue reports and analytics',
      onPress: () => navigateInMyGarage('revenue'),
      enabled: false, // To be implemented
    },
    {
      id: 'staff',
      title: 'Staff Management',
      icon: 'people-circle' as const,
      description: 'Manage staff members',
      onPress: () => navigateInMyGarage('staff'),
      enabled: false, // To be implemented
    },
    {
      id: 'appointments',
      title: 'Appointments',
      icon: 'calendar' as const,
      description: 'Schedule and manage appointments',
      onPress: () => navigateInMyGarage('appointments'),
      enabled: false, // To be implemented
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'bar-chart' as const,
      description: 'Generate and view reports',
      onPress: () => navigateInMyGarage('reports'),
      enabled: false, // To be implemented
    },
  ];

  const handleBackPress = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      // Default: switch to home tab
      setActiveTab('home');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton onPress={handleBackPress} />
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Garage</Text>
            {user?.garageName && (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {user.garageName}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <MenuItemCard
                title={item.title}
                icon={item.icon}
                description={item.description}
                onPress={item.onPress}
                disabled={!item.enabled}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  menuItem: {
    width: '48%',
    marginBottom: SPACING.md,
  },
});

