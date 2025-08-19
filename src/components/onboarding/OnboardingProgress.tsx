import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { OnboardingStepConfig } from '../../types/onboarding';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepConfigs: OnboardingStepConfig[];
  showLabels?: boolean;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  stepConfigs,
  showLabels = true,
}) => {
  const { colors } = useTheme();

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Step Indicators */}
      <View style={styles.stepsContainer}>
        {stepConfigs.map((step, index) => {
          const isCompleted = step.isCompleted;
          const isCurrent = index === currentStep;
          const isActive = isCurrent || isCompleted;

          return (
            <View key={step.step} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepIndicator,
                  {
                    backgroundColor: isCompleted
                      ? colors.success
                      : isCurrent
                        ? colors.primary
                        : colors.outlineVariant,
                    borderColor: isActive ? colors.primary : colors.outline,
                  },
                ]}
              >
                {isCompleted ? (
                  <Text style={[styles.stepText, { color: colors.onSuccess }]}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepText,
                      {
                        color: isCurrent ? colors.onPrimary : colors.textSecondary,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {showLabels && (
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isCurrent ? colors.primary : colors.textSecondary,
                      fontWeight: isCurrent ? '600' : '400',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {step.title}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Progress Text */}
      <View style={styles.progressTextContainer}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Step {currentStep + 1} of {totalSteps}
        </Text>
        <Text style={[styles.progressPercentage, { color: colors.primary }]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
});
