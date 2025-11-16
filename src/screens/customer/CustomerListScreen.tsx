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
import { CustomerService, CustomerResponse, CustomerFilters } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface CustomerListScreenProps {
  onNavigateBack: () => void;
  onNavigateToCustomerDetail: (customerId: string) => void;
  onNavigateToAddCustomer: () => void;
  onNavigateToEditCustomer: (customerId: string) => void;
}

export default function CustomerListScreen({
  onNavigateBack,
  onNavigateToCustomerDetail,
  onNavigateToAddCustomer,
  onNavigateToEditCustomer,
}: CustomerListScreenProps) {
  const { colors } = useTheme();
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const loadCustomers = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      }

      const filters: CustomerFilters = {
        page: pageNum,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (searchQuery.trim()) {
        filters.customerName = searchQuery.trim();
      }

      const response = await CustomerService.getAllCustomers(filters);
      
      if (reset) {
        setCustomers(response.content);
      } else {
        setCustomers(prev => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Error loading customers:', error);
      Alert.alert('Error', error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadCustomers(0, true);
  }, [loadCustomers]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    loadCustomers(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCustomers(nextPage, false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setPage(0);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCustomers(0, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderCustomerItem = ({ item }: { item: CustomerResponse }) => (
    <TouchableOpacity
      style={[styles.customerCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
      onPress={() => onNavigateToCustomerDetail(item.id)}
    >
      <View style={styles.customerHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={[styles.customerName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>
            {item.phone}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigateToEditCustomer(item.id)}
          style={styles.editButton}
        >
          <Icon name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {item.email && (
        <View style={styles.customerDetail}>
          <Icon name="mail-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.customerDetailText, { color: colors.textSecondary }]}>
            {item.email}
          </Text>
        </View>
      )}

      {(item.addressLine1 || item.city) && (
        <View style={styles.customerDetail}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.customerDetailText, { color: colors.textSecondary }]}>
            {[item.addressLine1, item.city, item.state].filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      {item.vehicles && item.vehicles.length > 0 && (
        <View style={styles.customerDetail}>
          <Icon name="car-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.customerDetailText, { color: colors.textSecondary }]}>
            {item.vehicles.length} vehicle{item.vehicles.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {item.isRegularCustomer && (
        <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
          <Text style={[styles.badgeText, { color: colors.success }]}>Regular Customer</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <BackButton onPress={onNavigateBack} size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Customers</Text>
        <TouchableOpacity onPress={onNavigateToAddCustomer} style={styles.addButton}>
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name..."
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
            {totalElements} customer{totalElements !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {loading && customers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading customers...
          </Text>
        </View>
      ) : customers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No customers found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {searchQuery ? 'Try a different search term' : 'Add your first customer to get started'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
              onPress={onNavigateToAddCustomer}
            >
              <Text style={[styles.addFirstButtonText, { color: '#fff' }]}>Add Customer</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && customers.length > 0 ? (
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
  customerCard: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  customerHeader: {
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
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: FONT_SIZES.sm,
  },
  editButton: {
    padding: SPACING.xs,
  },
  customerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  customerDetailText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
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

