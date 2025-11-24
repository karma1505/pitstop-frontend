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
import { VehicleService, VehicleResponse, VehicleFilters } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface VehicleListScreenProps {
    onNavigateBack: () => void;
    onNavigateToVehicleDetail: (vehicleId: string) => void;
    onNavigateToAddVehicle: () => void;
    onNavigateToEditVehicle: (vehicleId: string) => void;
}

export default function VehicleListScreen({
    onNavigateBack,
    onNavigateToVehicleDetail,
    onNavigateToAddVehicle,
    onNavigateToEditVehicle,
}: VehicleListScreenProps) {
    const { colors } = useTheme();
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    const loadVehicles = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
        try {
            if (reset) {
                setLoading(true);
            }

            const filters: VehicleFilters = {
                page: pageNum,
                size: 20,
                sortBy: 'createdAt',
                sortDir: 'desc',
            };

            const response = await VehicleService.getAllVehicles(filters);

            // Filter by search query if provided
            let filteredContent = response.content;
            if (searchQuery.trim()) {
                const query = searchQuery.trim().toLowerCase();
                filteredContent = response.content.filter(
                    (v) =>
                        v.registrationNumber.toLowerCase().includes(query) ||
                        v.make.toLowerCase().includes(query) ||
                        v.model.toLowerCase().includes(query) ||
                        (v.customerName && v.customerName.toLowerCase().includes(query))
                );
            }

            if (reset) {
                setVehicles(filteredContent);
            } else {
                setVehicles(prev => [...prev, ...filteredContent]);
            }

            setHasMore(!response.last);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('Error loading vehicles:', error);
            Alert.alert('Error', error.message || 'Failed to load vehicles');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        loadVehicles(0, true);
    }, [loadVehicles]);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(0);
        loadVehicles(0, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadVehicles(nextPage, false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setPage(0);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadVehicles(0, true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const renderVehicleItem = ({ item }: { item: VehicleResponse }) => (
        <TouchableOpacity
            style={[styles.vehicleCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}
            onPress={() => onNavigateToVehicleDetail(item.id)}
        >
            <View style={styles.vehicleHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {item.registrationNumber.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.vehicleInfo}>
                    <Text style={[styles.vehicleName, { color: colors.text }]}>
                        {item.registrationNumber}
                    </Text>
                    <Text style={[styles.vehicleDetails, { color: colors.textSecondary }]}>
                        {item.make} {item.model} ({item.year})
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onNavigateToEditVehicle(item.id)}
                    style={styles.editButton}
                >
                    <Icon name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {item.color && (
                <View style={styles.vehicleDetail}>
                    <Icon name="color-palette-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.vehicleDetailText, { color: colors.textSecondary }]}>
                        {item.color}
                    </Text>
                </View>
            )}

            {item.vinNumber && (
                <View style={styles.vehicleDetail}>
                    <Icon name="barcode-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.vehicleDetailText, { color: colors.textSecondary }]}>
                        VIN: {item.vinNumber}
                    </Text>
                </View>
            )}

            {item.customerName && (
                <View style={styles.vehicleDetail}>
                    <Icon name="person-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.vehicleDetailText, { color: colors.textSecondary }]}>
                        Owner: {item.customerName}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Vehicles</Text>
                <View style={styles.addButton} />
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by registration, make, model..."
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
                        {totalElements} vehicle{totalElements !== 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            {loading && vehicles.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading vehicles...
                    </Text>
                </View>
            ) : vehicles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="car-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No vehicles found
                    </Text>
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                        {searchQuery ? 'Try a different search term' : 'Vehicles can be added when creating or editing customers'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    renderItem={renderVehicleItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && vehicles.length > 0 ? (
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
    vehicleCard: {
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
        borderWidth: 1,
    },
    vehicleHeader: {
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
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginBottom: 2,
    },
    vehicleDetails: {
        fontSize: FONT_SIZES.sm,
    },
    editButton: {
        padding: SPACING.xs,
    },
    vehicleDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    vehicleDetailText: {
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
