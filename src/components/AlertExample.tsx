import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCustomAlert } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../utils';

const AlertExample: React.FC = () => {
  const { colors } = useTheme();
  const {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showConfirmAlert,
  } = useCustomAlert();

  const handleSuccessAlert = () => {
    showSuccessAlert(
      'Success!',
      'Your action was completed successfully.'
    );
  };

  const handleErrorAlert = () => {
    showErrorAlert(
      'Error!',
      'Something went wrong. Please try again.'
    );
  };

  const handleWarningAlert = () => {
    showWarningAlert(
      'Warning!',
      'Please be careful with this action.'
    );
  };

  const handleInfoAlert = () => {
    showInfoAlert(
      'Information',
      'This is an informational message.'
    );
  };

  const handleConfirmAlert = () => {
    showConfirmAlert(
      'Confirm Action',
      'Are you sure you want to proceed with this action?',
      () => console.log('User confirmed'),
      () => console.log('User cancelled'),
      'Yes, Proceed',
      'No, Cancel'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Custom Alert Examples
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.success }]}
        onPress={handleSuccessAlert}
      >
        <Text style={[styles.buttonText, { color: colors.onSuccess }]}>
          Show Success Alert
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={handleErrorAlert}
      >
        <Text style={[styles.buttonText, { color: colors.onError }]}>
          Show Error Alert
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.warning }]}
        onPress={handleWarningAlert}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          Show Warning Alert
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleInfoAlert}
      >
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
          Show Info Alert
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={handleConfirmAlert}
      >
        <Text style={[styles.buttonText, { color: colors.onSecondary }]}>
          Show Confirm Alert
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default AlertExample;
