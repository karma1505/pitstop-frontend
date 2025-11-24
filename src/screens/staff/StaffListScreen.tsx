import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { StaffService, StaffResponse, StaffFilters } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface StaffListScreenProps {
  onNavigateBack: () => void;
  onNavigateToStaffDetail: (staffId: string) => void;
  onNavigateToAddStaff: () => void;
  onNavigateToEditStaff: (staffId: string) => void;
}

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'MECHANIC':
      return 'Mechanic';
    case 'RECEPTIONIST':
      return 'Receptionist';
    case 'MANAGER':
      return 'Manager';
    default:
      return role;
  }
};

const getRoleColor = (role: string, colors: any): string => {
  switch (role) {
    case 'MECHANIC':
      return colors.primary;
    case 'RECEPTIONIST':
      return colors.success;
    case 'MANAGER':
      return colors.warning;
    default:
      return colors.textSecondary;
  }
};

export default function StaffListScreen({
  onNavigateBack,
  onNavigateToStaffDetail,
  onNavigateToAddStaff,
  onNavigateToEditStaff,
}: StaffListScreenProps) {
  const { colors } = useTheme();
  const [staff, setStaff] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const loadStaff = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      }

      const filters: StaffFilters = {
        page: pageNum,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (searchQuery.trim()) {
        // Search by name (we'll filter client-side for now)
      }

      const response = await StaffService.getAllStaff(filters);
      
      // Filter by search query if provided
      let filteredContent = response.content;
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filteredContent = response.content.filter(
          (s) =>
            s.firstName.toLowerCase().includes(query) ||
            (s.lastName && s.lastName.toLowerCase().includes(query)) ||
            s.mobileNumber.includes(query) ||
            getRoleLabel(s.role).toLowerCase().includes(query)
        );
      }
      
      if (reset) {
        setStaff(filteredContent);
      } else {
        setStaff(prev => [...prev, ...filteredContent]);
      }

      setHasMore(!response.last);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Error loading staff:', error);
      Alert.alert('Error', error.message || 'Failed to load staff');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadStaff(0, true);
  }, [loadStaff]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    loadStaff(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadStaff(nextPage, false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setPage(0);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadStaff(0, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderStaffItem = ({ item }: { item: StaffResponse }) => (
    <TouchableOpacity
      style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
      onPress={() => onNavigateToStaffDetail(item.id)}
    >
      <View style={styles.staffHeader}>
        <View style={[styles.avatar, { backgroundColor: getRoleColor(item.role, colors) + '20' }]}>
          <Text style={[styles.avatarText, { color: getRoleColor(item.role, colors) }]}>
            {item.firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.staffInfo}>
          <View style={styles.staffNameRow}>
            <Text style={[styles.staffName, { color: colors.text }]}>
              {item.firstName} {item.lastName || ''}
            </Text>
            {!item.isActive && (
              <View style={[styles.inactiveBadge, { backgroundColor: colors.error + '20' }]}>
                <Text style={[styles.inactiveBadgeText, { color: colors.error }]}>Inactive</Text>
              </View>
            )}
          </View>
          <View style={styles.roleRow}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role, colors) + '20' }]}>
              <Text style={[styles.roleText, { color: getRoleColor(item.role, colors) }]}>
                {getRoleLabel(item.role)}
              </Text>
            </View>
            {item.jobsCompleted !== undefined && item.jobsCompleted > 0 && (
              <Text style={[styles.jobsText, { color: colors.textSecondary }]}>
                {item.jobsCompleted} job{item.jobsCompleted !== 1 ? 's' : ''} completed
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onNavigateToEditStaff(item.id)}
          style={styles.editButton}
        >
          <Icon name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.staffDetail}>
        <Icon name="call-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.staffDetailText, { color: colors.textSecondary }]}>
          {item.mobileNumber}
        </Text>
      </View>

      {item.aadharNumber && (
        <View style={styles.staffDetail}>
          <Icon name="card-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.staffDetailText, { color: colors.textSecondary }]}>
            Aadhar: {item.aadharNumber}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton onPress={onNavigateBack} size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff</Text>
        <TouchableOpacity onPress={onNavigateToAddStaff} style={styles.addButton}>
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name, role, or phone..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {totalElements > 0 && (
        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {totalElements} staff member{totalElements !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {loading && staff.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading staff...
          </Text>
        </View>
      ) : staff.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No staff found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {searchQuery ? 'Try a different search term' : 'Add your first staff member to get started'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
              onPress={onNavigateToAddStaff}
            >
              <Text style={[styles.addFirstButtonText, { color: '#fff' }]}>Add Staff</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={staff}
          renderItem={renderStaffItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && staff.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
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
  addButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
  },
  statsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  statsText: {
    fontSize: FONT_SIZES.sm,
  },
  listContent: {
    padding: SPACING.md,
  },
  staffCard: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  staffInfo: {
    flex: 1,
  },
  staffNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  staffName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  inactiveBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactiveBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: SPACING.sm,
  },
  roleText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  jobsText: {
    fontSize: FONT_SIZES.xs,
  },
  editButton: {
    padding: SPACING.xs,
  },
  staffDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  staffDetailText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  addFirstButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  addFirstButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
});

