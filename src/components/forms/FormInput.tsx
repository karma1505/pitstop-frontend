import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: any;
  inputStyle?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.(null as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.(null as any);
  };

  const borderColor = error 
    ? colors.error 
    : isFocused 
      ? colors.primary 
      : colors.inputBorder;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <Text style={[styles.required, { color: colors.error }]}> *</Text>}
        </Text>
      </View>

      <View style={[
        styles.inputContainer,
        {
          borderColor,
          backgroundColor: colors.inputBackground,
        },
        inputStyle
      ]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.inputText,
              paddingLeft: leftIcon ? 40 : 16,
              paddingRight: rightIcon ? 40 : 16,
            },
            style
          ]}
          placeholderTextColor={colors.inputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          { color: error ? colors.error : colors.textSecondary }
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  required: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
