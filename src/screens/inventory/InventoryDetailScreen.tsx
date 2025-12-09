import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { InventoryService, InventoryItemResponse, AdjustStockRequest } from '../../api';
import { SPACING, FONT_SIZES } from '../../utils';
import BackButton from '../../components/BackButton';

interface InventoryDetailScreenProps {
    itemId: string;
    onNavigateBack: () => void;
    onNavigateToEdit: (itemId: string) => void;
}

export default function InventoryDetailScreen({
    itemId,
    onNavigateBack,
    onNavigateToEdit,
}: InventoryDetailScreenProps) {
    const { colors } = useTheme();
    const [item, setItem] = useState<InventoryItemResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE' | 'SET'>('ADD');
    const [adjustQuantity, setAdjustQuantity] = useState('');
    const [adjustReason, setAdjustReason] = useState('');
    const [adjustNotes, setAdjustNotes] = useState('');
    const [adjusting, setAdjusting] = useState(false);

    useEffect(() => {
        loadItemDetails();
    }, [itemId]);

    const loadItemDetails = async () => {
        try {
            setLoading(true);
            const response = await InventoryService.getInventoryItemById(itemId);
            setItem(response);
        } catch (error: any) {
            console.error('Error loading item details:', error);
            Alert.alert('Error', error.message || 'Failed to load item details');
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustStock = async () => {
        if (!adjustQuantity || !adjustReason.trim()) {
            Alert.alert('Validation Error', 'Please enter quantity and reason');
            return;
        }

        const quantity = parseInt(adjustQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid quantity');
            return;
        }

        try {
            setAdjusting(true);
            const request: AdjustStockRequest = {
                adjustmentType,
                quantity,
                reason: adjustReason.trim(),
                notes: adjustNotes.trim() || undefined,
            };

            await InventoryService.adjustStock(itemId, request);
            setShowAdjustModal(false);
            setAdjustQuantity('');
            setAdjustReason('');
            setAdjustNotes('');
            loadItemDetails();
            Alert.alert('Success', 'Stock adjusted successfully');
        } catch (error: any) {
            console.error('Error adjusting stock:', error);
            Alert.alert('Error', error.message || 'Failed to adjust stock');
        } finally {
            setAdjusting(false);
        }
    };

    const handleToggleActive = async () => {
        if (!item) return;

        const action = item.isActive ? 'deactivate' : 'reactivate';
        Alert.alert(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Item`,
            `Are you sure you want to ${action} this item?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: action.charAt(0).toUpperCase() + action.slice(1),
                    style: item.isActive ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            if (item.isActive) {
                                await InventoryService.deactivateItem(itemId);
                            } else {
                                await InventoryService.reactivateItem(itemId);
                            }
                            loadItemDetails();
                            Alert.alert('Success', `Item ${action}d successfully`);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || `Failed to ${action} item`);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                    <BackButton onPress={onNavigateBack} size="small" />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Item Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading item details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!item) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                    <BackButton onPress={onNavigateBack} size="small" />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Item Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Icon name="cube-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        Item not found
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Item Details</Text>
                <TouchableOpacity onPress={() => onNavigateToEdit(itemId)} style={styles.editButton}>
                    <Icon name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Item Info Card */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Icon name="cube" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.itemName}</Text>
                    <Text style={[styles.itemCode, { color: colors.textSecondary }]}>{item.itemCode}</Text>

                    {item.category && (
                        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '10' }]}>
                            <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                        </View>
                    )}

                    {item.isLowStock && (
                        <View style={[styles.warningBadge, { backgroundColor: colors.error + '20' }]}>
                            <Icon name="warning" size={16} color={colors.error} />
                            <Text style={[styles.warningText, { color: colors.error }]}>Low Stock Alert</Text>
                        </View>
                    )}

                    {!item.isActive && (
                        <View style={[styles.inactiveBadge, { backgroundColor: colors.textSecondary + '20' }]}>
                            <Text style={[styles.inactiveText, { color: colors.textSecondary }]}>Inactive</Text>
                        </View>
                    )}
                </View>

                {/* Stock Info Card */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Stock Information</Text>

                    <View style={styles.stockGrid}>
                        <View style={styles.stockItem}>
                            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Current Stock</Text>
                            <Text style={[styles.stockValue, { color: colors.text }]}>
                                {item.currentQuantity} {item.unit}
                            </Text>
                        </View>
                        <View style={styles.stockItem}>
                            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Reserved</Text>
                            <Text style={[styles.stockValue, { color: colors.text }]}>
                                {item.reservedQuantity} {item.unit}
                            </Text>
                        </View>
                        <View style={styles.stockItem}>
                            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Available</Text>
                            <Text style={[styles.stockValue, { color: item.isLowStock ? colors.error : colors.success }]}>
                                {item.availableQuantity} {item.unit}
                            </Text>
                        </View>
                        <View style={styles.stockItem}>
                            <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Min Level</Text>
                            <Text style={[styles.stockValue, { color: colors.text }]}>
                                {item.minStockLevel} {item.unit}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.adjustButton, { backgroundColor: colors.primary }]}
                        onPress={() => setShowAdjustModal(true)}
                    >
                        <Icon name="swap-horizontal" size={20} color="#fff" />
                        <Text style={styles.adjustButtonText}>Adjust Stock</Text>
                    </TouchableOpacity>
                </View>

                {/* Pricing Info Card */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing</Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Cost Price</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>₹{item.costPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Selling Price</Text>
                        <Text style={[styles.infoValue, { color: colors.success }]}>₹{item.sellingPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Margin</Text>
                        <Text style={[styles.infoValue, { color: colors.success }]}>
                            ₹{(item.sellingPrice - item.costPrice).toFixed(2)} ({((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(1)}%)
                        </Text>
                    </View>
                </View>

                {/* Additional Info Card */}
                {item.description && (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
                    </View>
                )}

                {/* Actions */}
                <TouchableOpacity
                    style={[styles.actionButton, {
                        backgroundColor: item.isActive ? colors.error + '20' : colors.success + '20',
                        borderColor: item.isActive ? colors.error : colors.success,
                    }]}
                    onPress={handleToggleActive}
                >
                    <Icon
                        name={item.isActive ? "close-circle-outline" : "checkmark-circle-outline"}
                        size={20}
                        color={item.isActive ? colors.error : colors.success}
                    />
                    <Text style={[styles.actionButtonText, {
                        color: item.isActive ? colors.error : colors.success
                    }]}>
                        {item.isActive ? 'Deactivate Item' : 'Reactivate Item'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Adjust Stock Modal */}
            <Modal
                visible={showAdjustModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAdjustModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Adjust Stock</Text>
                            <TouchableOpacity onPress={() => setShowAdjustModal(false)}>
                                <Icon name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.adjustmentTypeContainer}>
                            {(['ADD', 'REMOVE', 'SET'] as const).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor: adjustmentType === type ? colors.primary : colors.background,
                                            borderColor: adjustmentType === type ? colors.primary : colors.outline,
                                        },
                                    ]}
                                    onPress={() => setAdjustmentType(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            { color: adjustmentType === type ? '#fff' : colors.text },
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.text }]}>Quantity</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                                placeholder="Enter quantity"
                                placeholderTextColor={colors.inputPlaceholder}
                                value={adjustQuantity}
                                onChangeText={setAdjustQuantity}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.text }]}>Reason *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                                placeholder="e.g., Stock replenishment, Damage, etc."
                                placeholderTextColor={colors.inputPlaceholder}
                                value={adjustReason}
                                onChangeText={setAdjustReason}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.text }]}>Notes (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                                placeholder="Additional notes..."
                                placeholderTextColor={colors.inputPlaceholder}
                                value={adjustNotes}
                                onChangeText={setAdjustNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={handleAdjustStock}
                            disabled={adjusting}
                        >
                            {adjusting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Adjust Stock</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    editButton: {
        padding: SPACING.xs,
    },
    content: {
        padding: SPACING.md,
    },
    card: {
        padding: SPACING.lg,
        borderRadius: 12,
        marginBottom: SPACING.md,
        borderWidth: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: SPACING.md,
    },
    itemName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    itemCode: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    categoryBadge: {
        alignSelf: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 16,
        marginBottom: SPACING.sm,
    },
    categoryText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    warningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 16,
        marginBottom: SPACING.sm,
    },
    warningText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        marginLeft: SPACING.xs,
    },
    inactiveBadge: {
        alignSelf: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 16,
    },
    inactiveText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        marginBottom: SPACING.md,
    },
    stockGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.md,
    },
    stockItem: {
        width: '50%',
        marginBottom: SPACING.md,
    },
    stockLabel: {
        fontSize: FONT_SIZES.sm,
        marginBottom: SPACING.xs,
    },
    stockValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
    },
    adjustButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: 8,
    },
    adjustButtonText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    infoLabel: {
        fontSize: FONT_SIZES.md,
    },
    infoValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    description: {
        fontSize: FONT_SIZES.md,
        lineHeight: 22,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: SPACING.md,
    },
    actionButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginLeft: SPACING.sm,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
    },
    adjustmentTypeContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    typeButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    typeButtonText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZES.md,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        paddingVertical: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});
