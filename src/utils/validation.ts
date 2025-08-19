// Validation utilities for forms

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: string, rules: ValidationRule, fieldName: string): string | undefined => {
  const trimmedValue = value?.trim() || '';

  // Required validation
  if (rules.required && !trimmedValue) {
    return `${fieldName} is required`;
  }

  // Skip other validations if value is empty and not required
  if (!trimmedValue) {
    return undefined;
  }

  // Min length validation
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return `${fieldName} must be no more than ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return `${fieldName} format is invalid`;
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(trimmedValue);
  }

  return undefined;
};

export const validateForm = (data: Record<string, string>, rules: Record<string, ValidationRule>): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(fieldName => {
    const fieldValue = data[fieldName] || '';
    const fieldRules = rules[fieldName];
    const error = validateField(fieldValue, fieldRules, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  PINCODE: /^\d{6}$/,
  AADHAR: /^\d{12}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
};

// Common validation rules
export const VALIDATION_RULES = {
  REQUIRED: { required: true },
  EMAIL: { required: true, pattern: VALIDATION_PATTERNS.EMAIL },
  PHONE: { required: true, pattern: VALIDATION_PATTERNS.PHONE },
  PINCODE: { required: true, pattern: VALIDATION_PATTERNS.PINCODE },
  AADHAR: { pattern: VALIDATION_PATTERNS.AADHAR },
  GST: { pattern: VALIDATION_PATTERNS.GST },
  NAME: { required: true, minLength: 2, maxLength: 50 },
  ADDRESS: { required: true, minLength: 5, maxLength: 200 },
  BUSINESS_HOURS: { required: true, minLength: 10, maxLength: 500 },
};

// Specific validation functions
export const validateEmail = (email: string): string | undefined => {
  return validateField(email, VALIDATION_RULES.EMAIL, 'Email');
};

export const validatePhone = (phone: string): string | undefined => {
  return validateField(phone, VALIDATION_RULES.PHONE, 'Phone number');
};

export const validatePincode = (pincode: string): string | undefined => {
  return validateField(pincode, VALIDATION_RULES.PINCODE, 'Pincode');
};

export const validateAadhar = (aadhar: string): string | undefined => {
  return validateField(aadhar, VALIDATION_RULES.AADHAR, 'Aadhar number');
};

export const validateGST = (gst: string): string | undefined => {
  return validateField(gst, VALIDATION_RULES.GST, 'GST number');
};

export const validateName = (name: string): string | undefined => {
  return validateField(name, VALIDATION_RULES.NAME, 'Name');
};

export const validateAddress = (address: string): string | undefined => {
  return validateField(address, VALIDATION_RULES.ADDRESS, 'Address');
};

export const validateBusinessHours = (hours: string): string | undefined => {
  return validateField(hours, VALIDATION_RULES.BUSINESS_HOURS, 'Business hours');
};
