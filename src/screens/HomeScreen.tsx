import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context';

const { width: screenWidth } = Dimensions.get('window');

interface DataCardProps {
  title: string;
  data: Array<{ label: string; value: string; color?: string }>;
  icon: string;
  onPress: () => void;
}

const DataCard: React.FC<DataCardProps> = ({ title, data, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Icon name={icon} size={24} color={COLORS.primary} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    
    <View style={styles.cardContent}>
      {data.map((item, index) => (
        <View key={index} style={styles.dataRow}>
          <Text style={styles.dataLabel}>{item.label}</Text>
          <Text style={[styles.dataValue, item.color && { color: item.color }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity style={styles.moreInfoButton} onPress={onPress}>
      <Text style={styles.moreInfoText}>More Info.</Text>
      <Icon name="chevron-forward" size={16} color={COLORS.primary} />
    </TouchableOpacity>
  </TouchableOpacity>
);

interface BottomTabProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomTab: React.FC<BottomTabProps> = ({ activeTab, onTabPress }) => (
  <View style={styles.bottomTab}>
    <TouchableOpacity 
      style={styles.tabItem} 
      onPress={() => onTabPress('home')}
    >
      <Icon 
        name="home" 
        size={24} 
        color={activeTab === 'home' ? COLORS.primary : COLORS.text.secondary} 
      />
      <Text style={[
        styles.tabText, 
        activeTab === 'home' && styles.activeTabText
      ]}>
        Home
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.tabItem} 
      onPress={() => onTabPress('myGarage')}
    >
      <Icon 
        name="construct" 
        size={24} 
        color={activeTab === 'myGarage' ? COLORS.primary : COLORS.text.secondary} 
      />
      <Text style={[
        styles.tabText, 
        activeTab === 'myGarage' && styles.activeTabText
      ]}>
        My Garage
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.tabItem} 
      onPress={() => onTabPress('myMarketplace')}
    >
      <Icon 
        name="cart" 
        size={24} 
        color={activeTab === 'myMarketplace' ? COLORS.primary : COLORS.text.secondary} 
      />
      <Text style={[
        styles.tabText, 
        activeTab === 'myMarketplace' && styles.activeTabText
      ]}>
        Marketplace
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.tabItem} 
      onPress={() => onTabPress('settings')}
    >
      <Icon 
        name="settings" 
        size={24} 
        color={activeTab === 'settings' ? COLORS.primary : COLORS.text.secondary} 
      />
      <Text style={[
        styles.tabText, 
        activeTab === 'settings' && styles.activeTabText
      ]}>
        Settings
      </Text>
    </TouchableOpacity>
  </View>
);

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuth();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // TODO: Navigate to respective screens
    console.log(`Navigating to ${tab}`);
  };

  const handleCardPress = (cardType: string) => {
    console.log(`Card pressed: ${cardType}`);
    // TODO: Navigate to expanded view and switch to myGarage
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Welcome back, {user?.firstName || 'Garage Owner'}!
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>
              {user.garageName} • {user.city}, {user.state}
            </Text>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DataCard
          title="Money Data"
          icon="cash"
          data={[
            { label: 'Amount To Be Collected', value: '₹45,250', color: COLORS.primary },
            { label: 'Received Today', value: '₹12,800', color: COLORS.success },
            { label: 'Spent Today', value: '₹8,450', color: COLORS.error },
          ]}
          onPress={() => handleCardPress('money')}
        />

        <DataCard
          title="Garage Data"
          icon="construct"
          data={[
            { label: 'Total Vehicles', value: '12' },
            { label: 'Total Workers Present', value: '8' },
            { label: 'Parts Received Today', value: '15' },
            { label: 'Total Appointments Today', value: '6' },
          ]}
          onPress={() => handleCardPress('garage')}
        />

        <DataCard
          title="Inventory Data"
          icon="cube"
          data={[
            { label: 'Stock Received Today', value: '25 items' },
            { label: 'Stock Purchased Today', value: '₹3,200' },
            { label: 'Low Stock', value: '3 items', color: COLORS.warning },
            { label: 'Orders Placed Today', value: '2' },
          ]}
          onPress={() => handleCardPress('inventory')}
        />

        <DataCard
          title="Jobcard Data"
          icon="document-text"
          data={[
            { label: 'MH-12-AB-1234', value: 'In Progress' },
            { label: 'DL-01-CD-5678', value: 'Completed' },
            { label: 'KA-02-EF-9012', value: 'Pending' },
          ]}
          onPress={() => handleCardPress('jobcard')}
        />

        <DataCard
          title="Revenue Analytics"
          icon="trending-up"
          data={[
            { label: 'This Week', value: '₹89,450', color: COLORS.success },
            { label: 'Last Week', value: '₹76,200' },
            { label: 'Monthly Target', value: '₹3,50,000' },
            { label: 'Achieved', value: '85%' },
          ]}
          onPress={() => handleCardPress('revenue')}
        />

        <DataCard
          title="Customer Data"
          icon="people"
          data={[
            { label: 'New Customers', value: '5' },
            { label: 'Returning Customers', value: '18' },
            { label: 'Customer Satisfaction', value: '4.8/5' },
            { label: 'Reviews Today', value: '3' },
          ]}
          onPress={() => handleCardPress('customer')}
        />
      </ScrollView>

      <BottomTab activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  userInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dataLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    flex: 1,
  },
  dataValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'right',
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  moreInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

}); 