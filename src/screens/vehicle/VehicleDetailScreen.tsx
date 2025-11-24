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
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { VehicleService, VehicleResponse } from '../../api';
import BackButton from '../../components/BackButton';
import { SPACING, FONT_SIZES } from '../../utils';

interface VehicleDetailScreenProps {
    vehicleId: string;
    onNavigateBack: () => void;
    onNavigateToEdit: (vehicleId: string) => void;
}

export default function VehicleDetailScreen({
    vehicleId,
    onNavigateBack,
    onNavigateToEdit,
}: VehicleDetailScreenProps) {
    const { colors } = useTheme();
    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicle();
    }, [vehicleId]);

    const loadVehicle = async () => {
        try {
            setLoading(true);
            const data = await VehicleService.getVehicleById(vehicleId);
            setVehicle(data);
        } catch (error: any) {
            console.error('Error loading vehicle:', error);
            Alert.alert('Error', error.message || 'Failed to load vehicle');
            onNavigateBack();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!vehicle) return;

        Alert.alert(
            'Delete Vehicle',
            `Are you sure you want to delete ${vehicle.registrationNumber}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await VehicleService.deleteVehicle(vehicle.id);
                            Alert.alert('Success', 'Vehicle deleted successfully');
                            onNavigateBack();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete vehicle');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
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

    if (!vehicle) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        Vehicle not found
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButtonAction, { backgroundColor: colors.primary }]}
                        onPress={onNavigateBack}
                    >
                        <Text style={styles.backButtonActionText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <BackButton onPress={onNavigateBack} size="small" />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Vehicle Details</Text>
                <TouchableOpacity
                    onPress={() => onNavigateToEdit(vehicleId)}
                    style={styles.editButton}
                >
                    <Icon name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.profileSection, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                        <Icon name="car" size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.vehicleName, { color: colors.text }]}>
                        {vehicle.registrationNumber}
                    </Text>
                    <Text style={[styles.vehicleSubtitle, { color: colors.textSecondary }]}>
                        {vehicle.make} {vehicle.model}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Information</Text>

                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                        <View style={styles.infoRow}>
                            <Icon name="car-outline" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Make</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.make}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.infoRowSpacing]}>
                            <Icon name="car-sport-outline" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Model</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.model}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.infoRowSpacing]}>
                            <Icon name="calendar-outline" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Year</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.year}</Text>
                            </View>
                        </View>

                        {vehicle.color && (
                            <View style={[styles.infoRow, styles.infoRowSpacing]}>
                                <Icon name="color-palette-outline" size={20} color={colors.primary} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Color</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.color}</Text>
                                </View>
                            </View>
                        )}

                        {vehicle.vinNumber && (
                            <View style={[styles.infoRow, styles.infoRowSpacing]}>
                                <Icon name="barcode-outline" size={20} color={colors.primary} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>VIN Number</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.vinNumber}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {vehicle.customerName && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Owner Information</Text>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                            <View style={styles.infoRow}>
                                <Icon name="person-outline" size={20} color={colors.primary} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Owner</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.customerName}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Record Information</Text>

                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                        <View style={styles.infoRow}>
                            <Icon name="time-outline" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Added On</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </View>
                        </View>

                        {vehicle.updatedAt && vehicle.updatedAt !== vehicle.createdAt && (
                            <View style={[styles.infoRow, styles.infoRowSpacing]}>
                                <Icon name="refresh-outline" size={20} color={colors.primary} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Updated</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>
                                        {new Date(vehicle.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.deleteButton,
                        {
                            backgroundColor: colors.error + '20',
                            borderColor: colors.error,
                        },
                    ]}
                    onPress={handleDelete}
                >
                    <Icon name="trash-outline" size={20} color={colors.error} />
                    <Text style={[styles.deleteButtonText, { color: colors.error }]}>
                        Delete Vehicle
                    </Text>
                </TouchableOpacity>
            </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    profileSection: {
        alignItems: 'center',
        padding: SPACING.xl,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    vehicleName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    vehicleSubtitle: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        marginBottom: SPACING.md,
    },
    infoCard: {
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRowSpacing: {
        marginTop: SPACING.md,
    },
    infoContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    infoLabel: {
        fontSize: FONT_SIZES.xs,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: SPACING.lg,
    },
    deleteButtonText: {
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
        marginBottom: SPACING.lg,
    },
    backButtonAction: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 8,
    },
    backButtonActionText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});
