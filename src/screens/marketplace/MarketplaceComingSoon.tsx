import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../utils';

const comingSoonImage = require('../../assets/images/coming-soon.png');

const { width, height } = Dimensions.get('window');

export default function MarketplaceComingSoon() {
    const { colors, isDark } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Gradient Background */}
            <LinearGradient
                colors={
                    isDark
                        ? [colors.background, colors.surface, colors.surfaceVariant]
                        : [colors.background, colors.surface, colors.surfaceVariant]
                }
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Animated Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* 3D Image */}
                    <View style={styles.imagePlaceholder}>
                        <Image
                            source={comingSoonImage}
                            style={styles.comingSoonImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Main Heading */}
                    <View style={styles.headingContainer}>
                        <LinearGradient
                            colors={isDark ? ['#0A84FF', '#0066CC'] : ['#007AFF', '#0051D5']}
                            style={styles.headingButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.heading}>
                                Marketplace
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Subheading */}
                    <View style={styles.subheadingContainer}>
                        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
                            We're building something special for you
                        </Text>
                    </View>

                    {/* Description */}
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Soon, you'll have access to a curated marketplace of quality spare parts and accessories to elevate your garage experience.
                    </Text>

                    {/* Feature Pills */}
                    <View style={styles.featureContainer}>
                        {['Spares', 'Accessories', 'Tools'].map((feature, index) => (
                            <Animated.View
                                key={feature}
                                style={[
                                    styles.featurePill,
                                    {
                                        backgroundColor: isDark ? '#2c2c2e' : '#f8f9fa',
                                        borderColor: isDark ? '#38383a' : '#e0e0e0',
                                        opacity: fadeAnim,
                                        transform: [
                                            {
                                                translateY: fadeAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [20 * (index + 1), 0],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Icon
                                    name={
                                        feature === 'Spares'
                                            ? 'construct'
                                            : feature === 'Accessories'
                                                ? 'sparkles'
                                                : 'build'
                                    }
                                    size={16}
                                    color={colors.primary}
                                />
                                <Text style={[styles.featureText, { color: colors.text }]}>
                                    {feature}
                                </Text>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Coming Soon Badge */}
                    <View style={styles.badgeContainer}>
                        <LinearGradient
                            colors={
                                isDark
                                    ? ['#FF453A', '#FF6B6B']
                                    : ['#FF3B30', '#FF6B6B']
                            }
                            style={styles.badge}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Icon name="time-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.badgeText}>Coming Soon</Text>
                        </LinearGradient>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: SPACING.xl,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },

    imagePlaceholder: {
        marginBottom: SPACING.lg,
        width: width * 1.0,
        height: width * 1.0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: -width * 0.15,
    },
    comingSoonImage: {
        width: '150%',
        height: '150%',
    },
    headingContainer: {
        marginBottom: SPACING.md,
        alignItems: 'center',
    },
    headingButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.5,
        color: '#FFFFFF',
    },
    subheadingContainer: {
        marginBottom: SPACING.sm,
    },
    subheading: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        textAlign: 'center',
        color: '#666666',
    },
    description: {
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: SPACING.lg,
        maxWidth: width * 0.8,
    },
    featureContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        borderWidth: 1,
        gap: SPACING.xs,
    },
    featureText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    badgeContainer: {
        marginTop: SPACING.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: 24,
        gap: SPACING.xs,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
});
