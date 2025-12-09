import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ServiceCategoryService, CreateServiceCategoryRequest, UpdateServiceCategoryRequest } from '../../api';
import { FormInput } from '../../components/forms/FormInput';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface ServiceCategoryFormScreenProps {
    categoryId?: string;
    onNavigateBack: () => void;
    onSaveSuccess: () => void;
}

export default function ServiceCategoryFormScreen({ categoryId, onNavigateBack, onSaveSuccess }: ServiceCategoryFormScreenProps) {
    const { colors } = useTheme();
    const isEditing = !!categoryId;
    const [loading, setLoading] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(isEditing);
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryCode: '',
        description: '',
        estimatedTime: '',
        isActive: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!categoryId) {
            setFormData({ categoryName: '', categoryCode: '', description: '', estimatedTime: '', isActive: true });
            setErrors({});
        }
    }, [categoryId]);

    useEffect(() => {
        if (isEditing && categoryId) loadCategory();
    }, [categoryId, isEditing]);

    const loadCategory = async () => {
        try {
            setLoadingCategory(true);
            const category = await ServiceCategoryService.getServiceCategoryById(categoryId!);
            setFormData({
                categoryName: category.categoryName || '',
                categoryCode: category.categoryCode || '',
                description: category.description || '',
                estimatedTime: category.estimatedTime?.toString() || '',
                isActive: category.isActive,
            });
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to load category');
            onNavigateBack();
        } finally {
            setLoadingCategory(false);
        }
    };

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.categoryName.trim()) newErrors.categoryName = 'Service name is required';
        else if (formData.categoryName.trim().length < 2) newErrors.categoryName = 'Service name must be at least 2 characters';

        if (!formData.categoryCode.trim()) newErrors.categoryCode = 'Service code is required';
        else if (!/^[A-Z0-9-]+$/.test(formData.categoryCode.trim())) newErrors.categoryCode = 'Code must contain only uppercase letters, numbers, and hyphens';

        const time = parseInt(formData.estimatedTime);
        if (formData.estimatedTime.trim() && (isNaN(time) || time < 0 || time > 1440)) {
            newErrors.estimatedTime = 'Time must be between 0 and 1440 minutes';
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
                const requestData: UpdateServiceCategoryRequest = {
                    categoryName: formData.categoryName.trim(),
                    description: formData.description.trim() || undefined,
                    estimatedTime: formData.estimatedTime.trim() ? parseInt(formData.estimatedTime) : undefined,
                    isActive: formData.isActive,
                };
                await ServiceCategoryService.updateServiceCategory(categoryId!, requestData);
                Alert.alert('Success', 'Service updated successfully');
            } else {
                const requestData: CreateServiceCategoryRequest = {
                    categoryName: formData.categoryName.trim(),
                    categoryCode: formData.categoryCode.trim().toUpperCase(),
                    description: formData.description.trim() || undefined,
                    estimatedTime: formData.estimatedTime.trim() ? parseInt(formData.estimatedTime) : undefined,
                };
                await ServiceCategoryService.createServiceCategory(requestData);
                Alert.alert('Success', 'Service created successfully');
            }
            onSaveSuccess();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategory) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Edit Service' : 'Add Service'}</Text>
                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

                        <FormInput
                            label="Service Name"
                            value={formData.categoryName}
                            onChangeText={(value) => updateFormData('categoryName', value)}
                            error={errors.categoryName}
                            required
                            placeholder="e.g., Oil Change"
                        />

                        <FormInput
                            label="Service Code"
                            value={formData.categoryCode}
                            onChangeText={(value) => updateFormData('categoryCode', value.toUpperCase())}
                            error={errors.categoryCode}
                            required
                            placeholder="e.g., OIL-CHANGE"
                            autoCapitalize="characters"
                            editable={!isEditing}
                        />

                        <FormInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(value) => updateFormData('description', value)}
                            placeholder="What's included in this service? (optional)"
                            multiline
                            numberOfLines={3}
                        />

                        <FormInput
                            label="Estimated Time (minutes)"
                            value={formData.estimatedTime}
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9]/g, '');
                                updateFormData('estimatedTime', numericValue);
                            }}
                            error={errors.estimatedTime}
                            placeholder="e.g., 30"
                            keyboardType="numeric"
                        />
                    </View>

                    {isEditing && (
                        <View style={styles.formSection}>
                            <View style={styles.activeToggle}>
                                <View>
                                    <Text style={[styles.activeLabel, { color: colors.text }]}>Active Status</Text>
                                    <Text style={[styles.activeSubtext, { color: colors.textSecondary }]}>Inactive services won't appear in listings</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.toggleSwitch, { backgroundColor: formData.isActive ? colors.success : colors.textSecondary }]}
                                    onPress={() => updateFormData('isActive', !formData.isActive)}
                                >
                                    <View style={[styles.toggleThumb, { transform: [{ translateX: formData.isActive ? 20 : 0 }] }]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{isEditing ? 'Update Service' : 'Create Service'}</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: SPACING.lg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, marginTop: SPACING.md },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', flex: 1, textAlign: 'center' },
    headerRight: { width: 40 },
    keyboardView: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.md },
    formSection: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.md },
    activeToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    activeLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: 4 },
    activeSubtext: { fontSize: FONT_SIZES.sm },
    toggleSwitch: { width: 50, height: 30, borderRadius: 15, padding: 2, justifyContent: 'center' },
    toggleThumb: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' },
    buttonContainer: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
    saveButton: { paddingVertical: SPACING.md, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    saveButtonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '600' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZES.md },
});
