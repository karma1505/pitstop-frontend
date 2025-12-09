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
import { ServiceCategoryService, ServiceCategoryListResponse, ServiceCategoryFilters } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface ServiceCategoryListScreenProps {
    onNavigateBack: () => void;
    onNavigateToDetail: (categoryId: string) => void;
    onNavigateToAdd: () => void;
    onNavigateToEdit: (categoryId: string) => void;
}

export default function ServiceCategoryListScreen({
    onNavigateBack,
    onNavigateToDetail,
    onNavigateToAdd,
    onNavigateToEdit,
}: ServiceCategoryListScreenProps) {
    const { colors } = useTheme();
    const [categories, setCategories] = useState<ServiceCategoryListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    const loadCategories = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
        try {
            if (reset) setLoading(true);

            const filters: ServiceCategoryFilters = {
                page: pageNum,
                size: 20,
                sortBy: 'categoryName',
                sortDir: 'asc',
                isActive: true,
            };

            if (searchQuery.trim()) {
                filters.categoryName = searchQuery.trim();
            }

            const response = await ServiceCategoryService.getAllServiceCategories(filters);

            if (reset) {
                setCategories(response.content);
            } else {
                setCategories(prev => [...prev, ...response.content]);
            }

            setHasMore(!response.last);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('Error loading categories:', error);
            Alert.alert('Error', error.message || 'Failed to load service categories');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        loadCategories(0, true);
    }, [loadCategories]);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(0);
        loadCategories(0, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadCategories(nextPage, false);
        }
    };

    const formatTime = (minutes?: number) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    const renderCategoryItem = ({ item }: { item: ServiceCategoryListResponse }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}
            onPress={() => onNavigateToDetail(item.id)}
        >
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Icon name="construct-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.categoryName}</Text>
                    <Text style={[styles.code, { color: colors.textSecondary }]}>{item.categoryCode}</Text>
                </View>
                <TouchableOpacity onPress={() => onNavigateToEdit(item.id)} style={styles.editButton}>
                    <Icon name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {item.estimatedTime && (
                <View style={styles.timeRow}>
                    <Icon name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        Est. Time: {formatTime(item.estimatedTime)}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.headerBar, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Service Catalogue</Text>
                <TouchableOpacity onPress={onNavigateToAdd} style={styles.addButton}>
                    <Icon name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search services..."
                    placeholderTextColor={colors.inputPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close-circle" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {totalElements > 0 && (
                <View style={styles.statsContainer}>
                    <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                        {totalElements} service{totalElements !== 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            {loading && categories.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading services...</Text>
                </View>
            ) : categories.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="construct-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No services found</Text>
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                        {searchQuery ? 'Try a different search term' : 'Add your first service to get started'}
                    </Text>
                    {!searchQuery && (
                        <TouchableOpacity
                            style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
                            onPress={onNavigateToAdd}
                        >
                            <Text style={styles.addFirstButtonText}>Add Service</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && categories.length > 0 ? (
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
    container: { flex: 1, paddingTop: SPACING.lg },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, marginTop: SPACING.md },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', flex: 1, textAlign: 'center' },
    addButton: { padding: SPACING.xs },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.md, marginTop: SPACING.md, marginBottom: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 8, borderWidth: 1 },
    searchIcon: { marginRight: SPACING.sm },
    searchInput: { flex: 1, fontSize: FONT_SIZES.md },
    statsContainer: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
    statsText: { fontSize: FONT_SIZES.sm },
    listContent: { padding: SPACING.md },
    card: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, borderWidth: 1 },
    header: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
    info: { flex: 1 },
    name: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: 2 },
    code: { fontSize: FONT_SIZES.sm },
    editButton: { padding: SPACING.xs },
    timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
    timeText: { fontSize: FONT_SIZES.sm, marginLeft: SPACING.xs },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZES.md },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyText: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginTop: SPACING.md },
    emptySubtext: { fontSize: FONT_SIZES.sm, marginTop: SPACING.xs, textAlign: 'center' },
    addFirstButton: { marginTop: SPACING.lg, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: 8 },
    addFirstButtonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '600' },
    footerLoader: { paddingVertical: SPACING.md, alignItems: 'center' },
});
