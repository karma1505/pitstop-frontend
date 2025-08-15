import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, BackButton } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES, SCREEN_NAMES } from '../../utils/constants';

const PaymentSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { createPaymentMethod, loading } = useAuth();

  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  const paymentMethods = [
    {
      id: 'CASH',
      title: 'Cash',
      description: 'Accept cash payments',
      icon: 'cash',
    },
    {
      id: 'UPI',
      title: 'UPI',
      description: 'Unified Payment Interface',
      icon: 'phone-portrait',
    },
    {
      id: 'CARD',
      title: 'Card',
      description: 'Credit/Debit cards',
      icon: 'card',
    },
    {
      id: 'BANK_TRANSFER',
      title: 'Bank Transfer',
      description: 'Direct bank transfers',
      icon: 'business',
    },
  ];

  const togglePaymentMethod = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = async () => {
    if (selectedMethods.length === 0) {
      Alert.alert('Error', 'Please select at least one payment method');
      return;
    }

    try {
      let successCount = 0;
      for (const methodId of selectedMethods) {
        const result = await createPaymentMethod({ paymentMethod: methodId as any });
        if (result.success) {
          successCount++;
        }
      }

      if (successCount === selectedMethods.length) {
        Alert.alert(
          'Success',
          'Payment methods added successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
            },
          ]
        );
      } else {
        Alert.alert('Partial Success', 'Some payment methods were added successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Payment Setup',
      'Are you sure you want to skip setting up payment methods? You can add them later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING_PROGRESS as never),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Set Up Payment Methods
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose the payment methods you want to accept from customers
          </Text>

          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => {
              const isSelected = selectedMethods.includes(method.id);
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    { backgroundColor: colors.surface, borderColor: colors.outline },
                    isSelected && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                  ]}
                  onPress={() => togglePaymentMethod(method.id)}
                >
                  <View style={styles.methodHeader}>
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: isSelected ? colors.primary : colors.surface }
                    ]}>
                      <Ionicons
                        name={method.icon as any}
                        size={24}
                        color={isSelected ? colors.background : colors.primary}
                      />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodTitle, { color: colors.text }]}>
                        {method.title}
                      </Text>
                      <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>
                        {method.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      { borderColor: colors.outline },
                      isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={colors.background} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Button
              title="Add Payment Methods"
              onPress={handleSubmit}
              disabled={loading || selectedMethods.length === 0}
              style={styles.submitButton}
            />
            
            <Button
              title="Skip for Now"
              onPress={handleSkip}
              variant="outline"
              disabled={loading}
              style={styles.skipButton}
            />
          </View>

          <View style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              You can manage payment methods later from your profile settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  methodsContainer: {
    marginBottom: SPACING.xl,
  },
  methodCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  methodDescription: {
    fontSize: FONT_SIZES.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginBottom: SPACING.sm,
  },
  skipButton: {
    marginBottom: SPACING.sm,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PaymentSetupScreen;
