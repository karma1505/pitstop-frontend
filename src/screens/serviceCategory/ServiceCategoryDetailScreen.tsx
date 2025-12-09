import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ServiceCategoryService, ServiceCategoryResponse } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface ServiceCategoryDetailScreenProps {
    categoryId: string;
    onNavigateBack: () => void;
    onNavigateToEdit: (categoryId: string) => void;
}

export default function ServiceCategoryDetailScreen({ categoryId, onNavigateBack, onNavigateToEdit }: ServiceCategoryDetailScreenProps) {
    const { colors } = useTheme();
    const [category, setCategory] = useState<ServiceCategoryResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategoryDetails();
    }, [categoryId]);

    const loadCategoryDetails = async () => {
        try {
            setLoading(true);
            const response = await ServiceCategoryService.getServiceCategoryById(categoryId);
            setCategory(response);
        } catch (error: any) {
            console.error('Error loading category:', error);
            Alert.alert('Error', error.message || 'Failed to load category');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async () => {
        if (!category) return;
        const action = category.isActive ? 'deactivate' : 'reactivate';
        Alert.alert(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Service`,
            `Are you sure you want to ${action} this service?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: action.charAt(0).toUpperCase() + action.slice(1),
                    style: category.isActive ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            if (category.isActive) {
                                await ServiceCategoryService.deactivateCategory(categoryId);
                            } else {
                                await ServiceCategoryService.reactivateCategory(categoryId);
                            }
                            loadCategoryDetails();
                            Alert.alert('Success', `Service ${action}d successfully`);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || `Failed to ${action} service`);
                        }
                    },
                },
            ]
        );
    };

    const formatTime = (minutes?: number) => {
        if (!minutes) return 'Not set';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${mins} minute${mins > 1 ? 's' : ''}`;
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                    <BackButton onPress={onNavigateBack} size="small" />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Service Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!category) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                    <BackButton onPress={onNavigateBack} size="small" />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Service Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Icon name="construct-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Service not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Service Details</Text>
                <TouchableOpacity onPress={() => onNavigateToEdit(categoryId)} style={styles.editButton}>
                    <Icon name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Icon name="construct" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>{category.categoryName}</Text>
                    <Text style={[styles.code, { color: colors.textSecondary }]}>{category.categoryCode}</Text>

                    {!category.isActive && (
                        <View style={[styles.inactiveBadge, { backgroundColor: colors.textSecondary + '20' }]}>
                            <Text style={[styles.inactiveText, { color: colors.textSecondary }]}>Inactive</Text>
                        </View>
                    )}
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>

                    {category.description && (
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Description</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{category.description}</Text>
                        </View>
                    )}

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Estimated Time</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{formatTime(category.estimatedTime)}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.actionButton, {
                        backgroundColor: category.isActive ? colors.error + '20' : colors.success + '20',
                        borderColor: category.isActive ? colors.error : colors.success,
                    }]}
                    onPress={handleToggleActive}
                >
                    <Icon
                        name={category.isActive ? "close-circle-outline" : "checkmark-circle-outline"}
                        size={20}
                        color={category.isActive ? colors.error : colors.success}
                    />
                    <Text style={[styles.actionButtonText, {
                        color: category.isActive ? colors.error : colors.success
                    }]}>
                        {category.isActive ? 'Deactivate Service' : 'Reactivate Service'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: SPACING.lg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, marginTop: SPACING.md },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', flex: 1, textAlign: 'center' },
    editButton: { padding: SPACING.xs },
    content: { padding: SPACING.md },
    card: { padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.md, borderWidth: 1 },
    iconContainer: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: SPACING.md },
    name: { fontSize: FONT_SIZES.xl, fontWeight: '600', textAlign: 'center', marginBottom: SPACING.xs },
    code: { fontSize: FONT_SIZES.md, textAlign: 'center', marginBottom: SPACING.md },
    inactiveBadge: { alignSelf: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 16 },
    inactiveText: { fontSize: FONT_SIZES.sm, fontWeight: '600' },
    sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.md },
    infoRow: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    infoLabel: { fontSize: FONT_SIZES.sm, marginBottom: 4 },
    infoValue: { fontSize: FONT_SIZES.md, fontWeight: '500' },
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md, borderRadius: 8, borderWidth: 1, marginBottom: SPACING.md },
    actionButtonText: { fontSize: FONT_SIZES.md, fontWeight: '600', marginLeft: SPACING.sm },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZES.md },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyText: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginTop: SPACING.md },
});
