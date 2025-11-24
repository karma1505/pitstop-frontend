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
      enabled: true,
    },
    {
      id: 'jobcards',
      title: 'Job Cards',
      icon: 'document-text' as const,
      description: 'Create and manage job cards',
      onPress: () => navigateInMyGarage('jobcards'),
      enabled: true, // To be implemented
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: 'cube' as const,
      description: 'Manage parts and stock',
      onPress: () => navigateInMyGarage('inventory'),
      enabled: true, // To be implemented
    },
    {
      id: 'financial',
      title: 'Financial Transactions',
      icon: 'cash' as const,
      description: 'Track payments and expenses',
      onPress: () => navigateInMyGarage('financial'),
      enabled: true, // To be implemented
    },
    {
      id: 'revenue',
      title: 'Revenue Analytics',
      icon: 'trending-up' as const,
      description: 'View revenue reports and analytics',
      onPress: () => navigateInMyGarage('revenue'),
      enabled: true, // To be implemented
    },
    {
      id: 'staff',
      title: 'Staff Management',
      icon: 'people-circle' as const,
      description: 'Manage staff members',
      onPress: () => navigateInMyGarage('staff'),
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Report Engine',
      icon: 'bar-chart' as const,
      description: 'Generate garage reports in Excel',
      onPress: () => navigateInMyGarage('reports'),
      enabled: true, // To be implemented
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
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton onPress={handleBackPress} size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Garage</Text>
        <View style={styles.headerRight} />
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

