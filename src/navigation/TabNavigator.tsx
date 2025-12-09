import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTabNavigation, TabType } from '../context/TabNavigationContext';
import HomeScreen from '../screens/main/HomeScreen';
import MyGarageNavigator from './MyGarageNavigator';
import MarketplaceComingSoon from '../screens/marketplace/MarketplaceComingSoon';
import BottomTab from '../components/BottomTab';

interface TabNavigatorProps {
  selectedCustomerId?: string | null;
  onSetSelectedCustomerId?: (id: string | null) => void;
  selectedStaffId?: string | null;
  onSetSelectedStaffId?: (id: string | null) => void;
  selectedVehicleId?: string | null;
  onSetSelectedVehicleId?: (id: string | null) => void;
  selectedInventoryId?: string | null;
  onSetSelectedInventoryId?: (id: string | null) => void;
  onNavigateToSettings?: () => void;
}

export default function TabNavigator({
  selectedCustomerId,
  onSetSelectedCustomerId,
  selectedStaffId,
  onSetSelectedStaffId,
  selectedVehicleId,
  onSetSelectedVehicleId,
  selectedInventoryId,
  onSetSelectedInventoryId,
  onNavigateToSettings,
}: TabNavigatorProps) {
  const { activeTab, setActiveTab, navigateInMyGarage } = useTabNavigation();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as TabType);
    if (tab === 'settings' && onNavigateToSettings) {
      onNavigateToSettings();
    }
  };

  const handleNavigateToCustomers = () => {
    setActiveTab('myGarage');
    navigateInMyGarage('customers');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToSettings={onNavigateToSettings}
            onNavigateToCustomers={handleNavigateToCustomers}
          />
        );
      case 'myGarage':
        return (
          <MyGarageNavigator
            selectedCustomerId={selectedCustomerId}
            onSetSelectedCustomerId={onSetSelectedCustomerId}
            selectedStaffId={selectedStaffId}
            onSetSelectedStaffId={onSetSelectedStaffId}
            selectedVehicleId={selectedVehicleId}
            onSetSelectedVehicleId={onSetSelectedVehicleId}
            selectedInventoryId={selectedInventoryId}
            onSetSelectedInventoryId={onSetSelectedInventoryId}
          />
        );
      case 'marketplace':
        return <MarketplaceComingSoon />;
      case 'settings':
        // Settings is handled separately in App.tsx
        return null;
      default:
        return (
          <HomeScreen
            onNavigateToSettings={onNavigateToSettings}
            onNavigateToCustomers={handleNavigateToCustomers}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderTabContent()}
      {activeTab !== 'settings' && (
        <BottomTab activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
});

