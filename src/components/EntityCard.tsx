import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../utils/constants';

interface EntityCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: string;
  iconColor?: string;
  status?: 'active' | 'inactive' | 'pending';
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  children?: React.ReactNode;
}

const EntityCard: React.FC<EntityCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  iconColor,
  status,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
  children,
}) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconColor || colors.primary,
              },
            ]}
          >
                            <Ionicons name={icon as any} size={20} color={colors.onPrimary} />
          </View>
          <View style={styles.titleContent}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {status && (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor() },
              ]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}

      {/* Custom Content */}
      {children && <View style={styles.childrenContainer}>{children}</View>}

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={onEdit}
            >
                              <Ionicons name="pencil" size={16} color={colors.onPrimary} />
              <Text style={[styles.actionText, { color: colors.onPrimary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={onDelete}
            >
                              <Ionicons name="trash" size={16} color={colors.onPrimary} />
              <Text style={[styles.actionText, { color: colors.onPrimary }]}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  titleContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  childrenContainer: {
    marginBottom: SPACING.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
});

export default EntityCard;
