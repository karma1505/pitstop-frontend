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
import { useTheme } from '../../context/ThemeContext';
import { VehicleService, CreateVehicleRequest, UpdateVehicleRequest } from '../../api';
import { FormInput } from '../../components/forms/FormInput';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface VehicleFormScreenProps {
    vehicleId?: string; // If provided, we're editing; otherwise, we're creating
    onNavigateBack: () => void;
    onSaveSuccess: () => void;
}

export default function VehicleFormScreen({
    vehicleId,
    onNavigateBack,
    onSaveSuccess,
}: VehicleFormScreenProps) {
    const { colors } = useTheme();
    const isEditing = !!vehicleId;
    const [loading, setLoading] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(isEditing);

    const [formData, setFormData] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        year: '',
        color: '',
        vinNumber: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && vehicleId) {
            loadVehicle();
        }
    }, [vehicleId, isEditing]);

    const loadVehicle = async () => {
        try {
            setLoadingVehicle(true);
            const vehicle = await VehicleService.getVehicleById(vehicleId!);

            setFormData({
                registrationNumber: vehicle.registrationNumber || '',
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: vehicle.year?.toString() || '',
                color: vehicle.color || '',
                vinNumber: vehicle.vinNumber || '',
            });
        } catch (error: any) {
            console.error('Error loading vehicle:', error);
            Alert.alert('Error', error.message || 'Failed to load vehicle');
            onNavigateBack();
        } finally {
            setLoadingVehicle(false);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.registrationNumber.trim()) {
            newErrors.registrationNumber = 'Registration number is required';
        }

        if (!formData.make.trim()) {
            newErrors.make = 'Make is required';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model is required';
        }

        if (!formData.year.trim()) {
            newErrors.year = 'Year is required';
        } else {
            const yearNum = parseInt(formData.year.trim());
            const currentYear = new Date().getFullYear();
            if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
                newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            if (isEditing && vehicleId) {
                const updateData: UpdateVehicleRequest = {
                    registrationNumber: formData.registrationNumber.trim(),
                    make: formData.make.trim(),
                    model: formData.model.trim(),
                    year: parseInt(formData.year.trim()),
                    color: formData.color.trim() || undefined,
                    vinNumber: formData.vinNumber.trim() || undefined,
                };
                await VehicleService.updateVehicle(vehicleId, updateData);
                Alert.alert('Success', 'Vehicle updated successfully');
            } else {
                const createData: CreateVehicleRequest = {
                    registrationNumber: formData.registrationNumber.trim(),
                    make: formData.make.trim(),
                    model: formData.model.trim(),
                    year: parseInt(formData.year.trim()),
                    color: formData.color.trim() || undefined,
                    vinNumber: formData.vinNumber.trim() || undefined,
                };
                await VehicleService.createVehicle(createData);
                Alert.alert('Success', 'Vehicle added successfully');
            }

            onSaveSuccess();
        } catch (error: any) {
            console.error('Error saving vehicle:', error);
            Alert.alert('Error', error.message || 'Failed to save vehicle');
        } finally {
            setLoading(false);
        }
    };

    if (loadingVehicle) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading vehicle...
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
                    {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
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
                            label="Registration Number"
                            value={formData.registrationNumber}
                            onChangeText={(value) => updateFormData('registrationNumber', value.toUpperCase())}
                            error={errors.registrationNumber}
                            required
                            placeholder="Enter registration number"
                            autoCapitalize="characters"
                        />

                        <FormInput
                            label="Make"
                            value={formData.make}
                            onChangeText={(value) => updateFormData('make', value)}
                            error={errors.make}
                            required
                            placeholder="Enter vehicle make (e.g., Toyota, Honda)"
                        />

                        <FormInput
                            label="Model"
                            value={formData.model}
                            onChangeText={(value) => updateFormData('model', value)}
                            error={errors.model}
                            required
                            placeholder="Enter vehicle model (e.g., Camry, Civic)"
                        />

                        <FormInput
                            label="Year"
                            value={formData.year}
                            onChangeText={(value) => {
                                // Remove all non-numeric characters
                                const numericValue = value.replace(/[^0-9]/g, '');
                                // Limit to 4 digits
                                const limitedValue = numericValue.slice(0, 4);
                                updateFormData('year', limitedValue);
                            }}
                            error={errors.year}
                            required
                            placeholder="Enter year (e.g., 2020)"
                            keyboardType="number-pad"
                            maxLength={4}
                        />
                    </View>

                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Details</Text>

                        <FormInput
                            label="Color"
                            value={formData.color}
                            onChangeText={(value) => updateFormData('color', value)}
                            placeholder="Enter vehicle color (optional)"
                        />

                        <FormInput
                            label="VIN Number"
                            value={formData.vinNumber}
                            onChangeText={(value) => updateFormData('vinNumber', value.toUpperCase())}
                            placeholder="Enter VIN number (optional)"
                            autoCapitalize="characters"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                            </Text>
                        )}
                    </TouchableOpacity>
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
        padding: SPACING.lg,
    },
    formSection: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        marginBottom: SPACING.sm,
    },
    saveButton: {
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.lg,
        minHeight: 50,
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
