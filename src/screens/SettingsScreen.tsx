import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context';

interface SettingsScreenProps {
  onNavigateBack?: () => void;
}

export default function SettingsScreen({ onNavigateBack }: SettingsScreenProps) {
  const { colors, theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
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
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const renderThemeOption = (optionTheme: 'light' | 'dark', label: string) => {
    const isSelected = theme === optionTheme;
    return (
      <TouchableOpacity
        style={[
          styles.themeOption,
          {
            backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
            borderColor: isSelected ? colors.primary : colors.outline,
          },
        ]}
        onPress={() => handleThemeChange(optionTheme)}
      >
        <View style={styles.themeOptionContent}>
          <Text
            style={[
              styles.themeOptionText,
              {
                color: isSelected ? colors.onPrimaryContainer : colors.text,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}
          >
            {label}
          </Text>
          {isSelected && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {onNavigateBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onNavigateBack}
              >
                <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Customize your app experience
            </Text>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.themeContainer}>
            {renderThemeOption('light', 'Light')}
            {renderThemeOption('dark', 'Dark')}
          </View>
        </View>

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Profile', 'Profile settings will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Password', 'Change password will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={true}
              onValueChange={() => Alert.alert('Notifications', 'Notification settings will be implemented later')}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor={colors.onPrimary}
            />
          </View>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Email Notifications</Text>
            <Switch
              value={false}
              onValueChange={() => Alert.alert('Email', 'Email settings will be implemented later')}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor={colors.onPrimary}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('About', 'About screen will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>About iGarage</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Privacy', 'Privacy policy will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Terms', 'Terms of service will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: colors.onError }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  headerTop: {
    marginBottom: SPACING.md,
  },
  backButton: {
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  themeContainer: {
    gap: SPACING.sm,
  },
  themeOption: {
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
  },
  themeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: FONT_SIZES.md,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  settingText: {
    fontSize: FONT_SIZES.md,
  },
  settingArrow: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '300',
  },
  logoutButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  versionText: {
    fontSize: FONT_SIZES.sm,
  },
}); 