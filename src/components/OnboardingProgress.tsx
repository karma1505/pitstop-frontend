import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES, ONBOARDING_STEPS } from '../utils/constants';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  completionPercentage: number;
  onStepPress?: (stepId: string) => void;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  steps,
  completionPercentage,
  onStepPress,
}) => {
  const { colors } = useTheme();

  const getStepIcon = (step: OnboardingStep) => {
    if (step.completed) {
      return 'checkmark-circle';
    } else if (step.current) {
      return 'ellipse';
    } else {
      return 'ellipse-outline';
    }
  };

  const getStepIconColor = (step: OnboardingStep) => {
    if (step.completed) {
      return colors.success;
    } else if (step.current) {
      return colors.primary;
    } else {
      return colors.textTertiary;
    }
  };

  const getStepTextColor = (step: OnboardingStep) => {
    if (step.completed) {
      return colors.text;
    } else if (step.current) {
      return colors.primary;
    } else {
      return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Setup Progress
        </Text>
        <Text style={[styles.percentage, { color: colors.primary }]}>
          {completionPercentage}% Complete
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${completionPercentage}%`,
            },
          ]}
        />
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepContainer}>
            {/* Step Icon */}
            <View style={styles.stepIconContainer}>
              <Ionicons
                name={getStepIcon(step)}
                size={24}
                color={getStepIconColor(step)}
              />
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor: step.completed ? colors.success : colors.outline,
                    },
                  ]}
                />
              )}
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: getStepTextColor(step) }]}>
                {step.title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  percentage: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: SPACING.xl,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsContainer: {
    gap: SPACING.lg,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: SPACING.md,
    position: 'relative',
  },
  connector: {
    width: 2,
    height: 40,
    marginTop: SPACING.sm,
  },
  stepContent: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  stepTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});

export default OnboardingProgress;
