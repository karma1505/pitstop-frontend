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
import { SPACING, FONT_SIZES } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context';
import { BackButton } from '../../components';
import { Ionicons as Icon } from '@expo/vector-icons';

interface SettingsScreenProps {
  onNavigateBack?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToEditProfile?: () => void;
}

export default function SettingsScreen({ onNavigateBack, onNavigateToChangePassword, onNavigateToEditProfile }: SettingsScreenProps) {
  const { colors, theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleChangePassword = () => {
    if (onNavigateToChangePassword) {
      onNavigateToChangePassword();
    } else {
      Alert.alert('Change Password', 'Change password functionality will be implemented later');
    }
  };

  const handleEditProfile = () => {
    if (onNavigateToEditProfile) {
      onNavigateToEditProfile();
    } else {
      Alert.alert('Edit Profile Settings', 'Edit profile settings will be implemented later');
    }
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
              <BackButton onPress={onNavigateBack} size="small" style={styles.headerBackButton} />
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
          <TouchableOpacity
            style={[styles.themeToggleContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}
            onPress={handleThemeToggle}
          >
            <View style={styles.themeToggleContent}>
              <View style={styles.themeToggleLeft}>
                <Icon 
                  name={theme === 'light' ? 'sunny' : 'moon'} 
                  size={24} 
                  color={theme === 'light' ? colors.primary : colors.primary} 
                />
                <Text style={[styles.themeToggleText, { color: colors.text }]}>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.outline, true: colors.primary }}
                thumbColor={colors.onPrimary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Settings</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile Settings</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={handleChangePassword}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Garage Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Garage Settings</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Edit Garage Settings', 'Edit garage settings will be implemented later')}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Edit Garage Settings</Text>
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
            <Text style={[styles.settingText, { color: colors.text }]}>About PitStop</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBackButton: {
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
  },
  headerBackButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  themeToggleContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
  },
  themeToggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  themeToggleText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
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