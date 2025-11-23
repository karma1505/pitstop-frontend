import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTabNavigation, TabType } from '../context/TabNavigationContext';
import { SPACING, FONT_SIZES } from '../utils';

interface BottomTabProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomTab({ activeTab, onTabPress }: BottomTabProps) {
  const { colors } = useTheme();
  const { setActiveTab } = useTabNavigation();

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    onTabPress(tab);
  };

  return (
    <View style={[styles.bottomTab, { backgroundColor: colors.surface, borderTopColor: colors.outline }]}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('home')}
      >
        <Icon
          name="home"
          size={24}
          color={activeTab === 'home' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'home' ? colors.primary : colors.textSecondary },
            activeTab === 'home' && styles.activeTabText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('myGarage')}
      >
        <Icon
          name="construct"
          size={24}
          color={activeTab === 'myGarage' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'myGarage' ? colors.primary : colors.textSecondary },
            activeTab === 'myGarage' && styles.activeTabText,
          ]}
        >
          My Garage
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('marketplace')}
      >
        <Icon
          name="cart"
          size={24}
          color={activeTab === 'marketplace' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'marketplace' ? colors.primary : colors.textSecondary },
            activeTab === 'marketplace' && styles.activeTabText,
          ]}
        >
          Marketplace
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('settings')}
      >
        <Icon
          name="settings"
          size={24}
          color={activeTab === 'settings' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'settings' ? colors.primary : colors.textSecondary },
            activeTab === 'settings' && styles.activeTabText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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

