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
import { SPACING, FONT_SIZES } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface DataCardProps {
  title: string;
  data: Array<{ label: string; value: string; color?: string }>;
  icon: string;
  onPress: () => void;
}

const DataCard: React.FC<DataCardProps> = ({ title, data, icon, onPress }) => {
  const { colors } = useTheme();
    return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Icon name={icon} size={24} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.cardContent}>
        {data.map((item, index) => (
          <View key={index} style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            <Text style={[styles.dataValue, { color: colors.text }, item.color && { color: item.color }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.moreInfoButton} onPress={onPress}>
        <Text style={[styles.moreInfoText, { color: colors.primary }]}>More Info.</Text>
        <Icon name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

interface BottomTabProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomTab: React.FC<BottomTabProps> = ({ activeTab, onTabPress }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.bottomTab, { backgroundColor: colors.surface, borderTopColor: colors.outline }]}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabPress('home')}
      >
        <Icon 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? colors.primary : colors.textSecondary} 
        />
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'home' ? colors.primary : colors.textSecondary },
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
          color={activeTab === 'myGarage' ? colors.primary : colors.textSecondary} 
        />
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'myGarage' ? colors.primary : colors.textSecondary },
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
          color={activeTab === 'myMarketplace' ? colors.primary : colors.textSecondary} 
        />
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'myMarketplace' ? colors.primary : colors.textSecondary },
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
          color={activeTab === 'settings' ? colors.primary : colors.textSecondary} 
        />
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'settings' ? colors.primary : colors.textSecondary },
          activeTab === 'settings' && styles.activeTabText
        ]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface HomeScreenProps {
  onNavigateToSettings?: () => void;
}

export default function HomeScreen({ onNavigateToSettings }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'settings' && onNavigateToSettings) {
      onNavigateToSettings();
    }
    // TODO: Navigate to respective screens
    console.log(`Navigating to ${tab}`);
  };

  const handleCardPress = (cardType: string) => {
    console.log(`Card pressed: ${cardType}`);
    // TODO: Navigate to expanded view and switch to myGarage
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Welcome back, {user?.firstName || 'Garage Owner'}!
            </Text>
          </View>
        </View>
        
        {user && (
          <View style={[styles.userInfo, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <Text style={[styles.userInfoText, { color: colors.textSecondary }]}>
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
            { label: 'Amount To Be Collected', value: '₹45,250', color: colors.primary },
            { label: 'Received Today', value: '₹12,800', color: colors.success },
            { label: 'Spent Today', value: '₹8,450', color: colors.error },
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
            { label: 'Low Stock', value: '3 items', color: colors.warning },
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
            { label: 'This Week', value: '₹89,450', color: colors.success },
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
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
  },
  userInfo: {
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
  },
  userInfoText: {
    fontSize: FONT_SIZES.sm,
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
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
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
    flex: 1,
  },
  dataValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
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
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
  bottomTab: {
    flexDirection: 'row',
    borderTopWidth: 1,
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
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: '600',
  },
}); 