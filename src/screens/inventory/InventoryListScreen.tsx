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
import { InventoryService, InventoryListResponse, InventoryFilters } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface InventoryListScreenProps {
    onNavigateBack: () => void;
    onNavigateToInventoryDetail: (itemId: string) => void;
    onNavigateToAddInventory: () => void;
    onNavigateToEditInventory: (itemId: string) => void;
}

export default function InventoryListScreen({
    onNavigateBack,
    onNavigateToInventoryDetail,
    onNavigateToAddInventory,
    onNavigateToEditInventory,
}: InventoryListScreenProps) {
    const { colors } = useTheme();
    const [items, setItems] = useState<InventoryListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    const loadInventory = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
        try {
            if (reset) {
                setLoading(true);
            }

            const filters: InventoryFilters = {
                page: pageNum,
                size: 20,
                sortBy: 'itemName',
                sortDir: 'asc',
                isActive: true,
            };

            if (searchQuery.trim()) {
                filters.itemName = searchQuery.trim();
            }

            if (showLowStockOnly) {
                filters.lowStockOnly = true;
            }

            const response = await InventoryService.getAllInventoryItems(filters);

            if (reset) {
                setItems(response.content);
            } else {
                setItems(prev => [...prev, ...response.content]);
            }

            setHasMore(!response.last);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('Error loading inventory:', error);
            Alert.alert('Error', error.message || 'Failed to load inventory');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery, showLowStockOnly]);

    useEffect(() => {
        loadInventory(0, true);
    }, [loadInventory]);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(0);
        loadInventory(0, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadInventory(nextPage, false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setPage(0);
    };

    const toggleLowStockFilter = () => {
        setShowLowStockOnly(!showLowStockOnly);
        setPage(0);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadInventory(0, true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, showLowStockOnly]);

    const renderInventoryItem = ({ item }: { item: InventoryListResponse }) => (
        <TouchableOpacity
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
            onPress={() => onNavigateToInventoryDetail(item.id)}
        >
            <View style={styles.itemHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Icon name="cube-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.itemName}</Text>
                    <Text style={[styles.itemCode, { color: colors.textSecondary }]}>
                        {item.itemCode}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onNavigateToEditInventory(item.id)}
                    style={styles.editButton}
                >
                    <Icon name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.itemDetails}>
                {item.category && (
                    <View style={styles.detailRow}>
                        <Icon name="pricetag-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            {item.category}
                        </Text>
                    </View>
                )}

                <View style={styles.detailRow}>
                    <Icon name="cash-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        ₹{item.sellingPrice.toFixed(2)} / {item.unit}
                    </Text>
                </View>
            </View>

            <View style={styles.stockInfo}>
                <View style={styles.stockRow}>
                    <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>In Stock:</Text>
                    <Text style={[styles.stockValue, { color: colors.text }]}>
                        {item.currentQuantity} {item.unit}
                    </Text>
                </View>
                <View style={styles.stockRow}>
                    <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Available:</Text>
                    <Text style={[styles.stockValue, { color: item.isLowStock ? colors.error : colors.success }]}>
                        {item.availableQuantity} {item.unit}
                    </Text>
                </View>
            </View>

            {item.isLowStock && (
                <View style={[styles.badge, { backgroundColor: colors.error + '20' }]}>
                    <Icon name="warning-outline" size={14} color={colors.error} />
                    <Text style={[styles.badgeText, { color: colors.error }]}>Low Stock</Text>
                </View>
            )}

            {!item.isActive && (
                <View style={[styles.badge, { backgroundColor: colors.textSecondary + '20' }]}>
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Inactive</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Inventory</Text>
                <TouchableOpacity onPress={onNavigateToAddInventory} style={styles.addButton}>
                    <Icon name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or code..."
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

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        {
                            backgroundColor: showLowStockOnly ? colors.error + '20' : colors.surface,
                            borderColor: showLowStockOnly ? colors.error : colors.outline,
                        }
                    ]}
                    onPress={toggleLowStockFilter}
                >
                    <Icon
                        name={showLowStockOnly ? "warning" : "warning-outline"}
                        size={16}
                        color={showLowStockOnly ? colors.error : colors.textSecondary}
                    />
                    <Text style={[
                        styles.filterChipText,
                        { color: showLowStockOnly ? colors.error : colors.textSecondary }
                    ]}>
                        Low Stock
                    </Text>
                </TouchableOpacity>
            </View>

            {totalElements > 0 && (
                <View style={styles.statsContainer}>
                    <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                        {totalElements} item{totalElements !== 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            {loading && items.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading inventory...
                    </Text>
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="cube-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No items found
                    </Text>
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                        {searchQuery || showLowStockOnly ? 'Try adjusting your filters' : 'Add your first item to get started'}
                    </Text>
                    {!searchQuery && !showLowStockOnly && (
                        <TouchableOpacity
                            style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
                            onPress={onNavigateToAddInventory}
                        >
                            <Text style={[styles.addFirstButtonText, { color: '#fff' }]}>Add Item</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderInventoryItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && items.length > 0 ? (
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
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: SPACING.sm,
    },
    filterChipText: {
        fontSize: FONT_SIZES.sm,
        marginLeft: SPACING.xs,
        fontWeight: '500',
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
    itemCard: {
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
        borderWidth: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginBottom: 2,
    },
    itemCode: {
        fontSize: FONT_SIZES.sm,
    },
    editButton: {
        padding: SPACING.xs,
    },
    itemDetails: {
        marginBottom: SPACING.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    detailText: {
        fontSize: FONT_SIZES.sm,
        marginLeft: SPACING.xs,
    },
    stockInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockLabel: {
        fontSize: FONT_SIZES.sm,
        marginRight: SPACING.xs,
    },
    stockValue: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: SPACING.sm,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        marginLeft: 4,
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
