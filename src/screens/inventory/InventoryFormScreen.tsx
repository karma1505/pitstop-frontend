import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { InventoryService, CreateInventoryItemRequest, UpdateInventoryItemRequest, InventoryItemResponse } from '../../api';
import { FormInput } from '../../components/forms/FormInput';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface InventoryFormScreenProps {
    itemId?: string; // If provided, we're editing; otherwise, we're creating
    onNavigateBack: () => void;
    onSaveSuccess: () => void;
}

export default function InventoryFormScreen({
    itemId,
    onNavigateBack,
    onSaveSuccess,
}: InventoryFormScreenProps) {
    const { colors } = useTheme();
    const isEditing = !!itemId;
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(isEditing);

    const [formData, setFormData] = useState({
        itemCode: '',
        itemName: '',
        description: '',
        category: '',
        unit: '',
        costPrice: '',
        sellingPrice: '',
        minStockLevel: '',
        maxStockLevel: '',
        initialQuantity: '0',
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && itemId) {
            loadItem();
        }
    }, [itemId, isEditing]);

    const loadItem = async () => {
        try {
            setLoadingItem(true);
            const item = await InventoryService.getInventoryItemById(itemId!);

            setFormData({
                itemCode: item.itemCode || '',
                itemName: item.itemName || '',
                description: item.description || '',
                category: item.category || '',
                unit: item.unit || '',
                costPrice: item.costPrice.toString(),
                sellingPrice: item.sellingPrice.toString(),
                minStockLevel: item.minStockLevel.toString(),
                maxStockLevel: item.maxStockLevel?.toString() || '',
                initialQuantity: '0',
                isActive: item.isActive,
            });
        } catch (error: any) {
            console.error('Error loading item:', error);
            Alert.alert('Error', error.message || 'Failed to load item');
            onNavigateBack();
        } finally {
            setLoadingItem(false);
        }
    };

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.itemCode.trim()) {
            newErrors.itemCode = 'Item code is required';
        } else if (!/^[A-Z0-9-]+$/.test(formData.itemCode.trim())) {
            newErrors.itemCode = 'Item code must contain only uppercase letters, numbers, and hyphens';
        }

        if (!formData.itemName.trim()) {
            newErrors.itemName = 'Item name is required';
        } else if (formData.itemName.trim().length < 2) {
            newErrors.itemName = 'Item name must be at least 2 characters';
        }

        if (!formData.unit.trim()) {
            newErrors.unit = 'Unit is required';
        }

        const costPrice = parseFloat(formData.costPrice);
        if (!formData.costPrice.trim() || isNaN(costPrice) || costPrice <= 0) {
            newErrors.costPrice = 'Cost price must be greater than 0';
        }

        const sellingPrice = parseFloat(formData.sellingPrice);
        if (!formData.sellingPrice.trim() || isNaN(sellingPrice) || sellingPrice <= 0) {
            newErrors.sellingPrice = 'Selling price must be greater than 0';
        }

        const minStock = parseInt(formData.minStockLevel);
        if (formData.minStockLevel.trim() && (isNaN(minStock) || minStock < 0)) {
            newErrors.minStockLevel = 'Minimum stock level cannot be negative';
        }

        const maxStock = parseInt(formData.maxStockLevel);
        if (formData.maxStockLevel.trim() && (isNaN(maxStock) || maxStock < 0)) {
            newErrors.maxStockLevel = 'Maximum stock level cannot be negative';
        }

        if (formData.maxStockLevel.trim() && !isNaN(maxStock) && !isNaN(minStock) && maxStock < minStock) {
            newErrors.maxStockLevel = 'Maximum stock level cannot be less than minimum';
        }

        if (!isEditing) {
            const initialQty = parseInt(formData.initialQuantity);
            if (isNaN(initialQty) || initialQty < 0) {
                newErrors.initialQuantity = 'Initial quantity cannot be negative';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before saving');
            return;
        }

        try {
            setLoading(true);

            if (isEditing) {
                const requestData: UpdateInventoryItemRequest = {
                    itemName: formData.itemName.trim(),
                    description: formData.description.trim() || undefined,
                    category: formData.category.trim() || undefined,
                    unit: formData.unit.trim(),
                    costPrice: parseFloat(formData.costPrice),
                    sellingPrice: parseFloat(formData.sellingPrice),
                    minStockLevel: formData.minStockLevel.trim() ? parseInt(formData.minStockLevel) : 0,
                    maxStockLevel: formData.maxStockLevel.trim() ? parseInt(formData.maxStockLevel) : undefined,
                    isActive: formData.isActive,
                };

                await InventoryService.updateInventoryItem(itemId!, requestData);
                Alert.alert('Success', 'Item updated successfully');
            } else {
                const requestData: CreateInventoryItemRequest = {
                    itemCode: formData.itemCode.trim().toUpperCase(),
                    itemName: formData.itemName.trim(),
                    description: formData.description.trim() || undefined,
                    category: formData.category.trim() || undefined,
                    unit: formData.unit.trim(),
                    costPrice: parseFloat(formData.costPrice),
                    sellingPrice: parseFloat(formData.sellingPrice),
                    minStockLevel: formData.minStockLevel.trim() ? parseInt(formData.minStockLevel) : 0,
                    maxStockLevel: formData.maxStockLevel.trim() ? parseInt(formData.maxStockLevel) : undefined,
                    initialQuantity: parseInt(formData.initialQuantity),
                };

                await InventoryService.createInventoryItem(requestData);
                Alert.alert('Success', 'Item created successfully');
            }

            onSaveSuccess();
        } catch (error: any) {
            console.error('Error saving item:', error);
            Alert.alert('Error', error.message || 'Failed to save item');
        } finally {
            setLoading(false);
        }
    };

    if (loadingItem) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading item...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {isEditing ? 'Edit Item' : 'Add Item'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

                        <FormInput
                            label="Item Code"
                            value={formData.itemCode}
                            onChangeText={(value) => updateFormData('itemCode', value.toUpperCase())}
                            error={errors.itemCode}
                            required
                            placeholder="e.g., OIL-5W30-5L"
                            autoCapitalize="characters"
                            editable={!isEditing}
                        />

                        <FormInput
                            label="Item Name"
                            value={formData.itemName}
                            onChangeText={(value) => updateFormData('itemName', value)}
                            error={errors.itemName}
                            required
                            placeholder="e.g., Synthetic Motor Oil 5W-30 5L"
                        />

                        <FormInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(value) => updateFormData('description', value)}
                            placeholder="Enter item description (optional)"
                            multiline
                            numberOfLines={3}
                        />

                        <FormInput
                            label="Category"
                            value={formData.category}
                            onChangeText={(value) => updateFormData('category', value)}
                            placeholder="e.g., Lubricants, Filters, Brakes (optional)"
                        />

                        <FormInput
                            label="Unit"
                            value={formData.unit}
                            onChangeText={(value) => updateFormData('unit', value)}
                            error={errors.unit}
                            required
                            placeholder="e.g., liter, piece, set, kg"
                        />
                    </View>

                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing</Text>

                        <FormInput
                            label="Cost Price (₹)"
                            value={formData.costPrice}
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9.]/g, '');
                                updateFormData('costPrice', numericValue);
                            }}
                            error={errors.costPrice}
                            required
                            placeholder="Enter cost price"
                            keyboardType="decimal-pad"
                        />

                        <FormInput
                            label="Selling Price (₹)"
                            value={formData.sellingPrice}
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9.]/g, '');
                                updateFormData('sellingPrice', numericValue);
                            }}
                            error={errors.sellingPrice}
                            required
                            placeholder="Enter selling price"
                            keyboardType="decimal-pad"
                        />

                        {formData.costPrice && formData.sellingPrice && (
                            <View style={[styles.marginInfo, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                                <Text style={[styles.marginLabel, { color: colors.textSecondary }]}>Profit Margin:</Text>
                                <Text style={[styles.marginValue, { color: colors.success }]}>
                                    ₹{(parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)).toFixed(2)}
                                    {' '}({((parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice) * 100).toFixed(1)}%)
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Stock Levels</Text>

                        <FormInput
                            label="Minimum Stock Level"
                            value={formData.minStockLevel}
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9]/g, '');
                                updateFormData('minStockLevel', numericValue);
                            }}
                            error={errors.minStockLevel}
                            placeholder="e.g., 10"
                            keyboardType="numeric"
                        />

                        <FormInput
                            label="Maximum Stock Level"
                            value={formData.maxStockLevel}
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9]/g, '');
                                updateFormData('maxStockLevel', numericValue);
                            }}
                            error={errors.maxStockLevel}
                            placeholder="e.g., 100 (optional)"
                            keyboardType="numeric"
                        />

                        {!isEditing && (
                            <FormInput
                                label="Initial Quantity"
                                value={formData.initialQuantity}
                                onChangeText={(value) => {
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    updateFormData('initialQuantity', numericValue);
                                }}
                                error={errors.initialQuantity}
                                required
                                placeholder="e.g., 25"
                                keyboardType="numeric"
                            />
                        )}
                    </View>

                    {isEditing && (
                        <View style={styles.formSection}>
                            <View style={styles.activeToggle}>
                                <View>
                                    <Text style={[styles.activeLabel, { color: colors.text }]}>Active Status</Text>
                                    <Text style={[styles.activeSubtext, { color: colors.textSecondary }]}>
                                        Inactive items won't appear in default listings
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.toggleSwitch,
                                        { backgroundColor: formData.isActive ? colors.success : colors.textSecondary }
                                    ]}
                                    onPress={() => updateFormData('isActive', !formData.isActive)}
                                >
                                    <View style={[
                                        styles.toggleThumb,
                                        { transform: [{ translateX: formData.isActive ? 20 : 0 }] }
                                    ]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.primary }]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>
                                    {isEditing ? 'Update Item' : 'Create Item'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    headerRight: {
        width: 40,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    formSection: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        marginBottom: SPACING.md,
    },
    marginInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: SPACING.sm,
    },
    marginLabel: {
        fontSize: FONT_SIZES.md,
    },
    marginValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    activeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    activeSubtext: {
        fontSize: FONT_SIZES.sm,
    },
    toggleSwitch: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 2,
        justifyContent: 'center',
    },
    toggleThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    saveButton: {
        paddingVertical: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
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
});
