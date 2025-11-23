import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTabNavigation, TabType } from '../context/TabNavigationContext';
import HomeScreen from '../screens/main/HomeScreen';
import MyGarageNavigator from './MyGarageNavigator';
import BottomTab from '../components/BottomTab';

interface TabNavigatorProps {
  selectedCustomerId?: string | null;
  onSetSelectedCustomerId?: (id: string | null) => void;
  onNavigateToSettings?: () => void;
}

export default function TabNavigator({
  selectedCustomerId,
  onSetSelectedCustomerId,
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
          />
        );
      case 'marketplace':
        // Placeholder for marketplace
        return (
          <View style={styles.placeholder}>
            {/* Marketplace screen to be implemented */}
          </View>
        );
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

