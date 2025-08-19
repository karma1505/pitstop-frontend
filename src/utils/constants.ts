// App constants and configuration

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.31.235:8080/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Onboarding Configuration
export const ONBOARDING_CONFIG = {
  STEPS: {
    WELCOME: 'WELCOME',
    GARAGE_REGISTRATION: 'GARAGE_REGISTRATION',
    PAYMENT_CONFIGURATION: 'PAYMENT_CONFIGURATION',
    STAFF_REGISTRATION: 'STAFF_REGISTRATION',
    COMPLETE: 'COMPLETE',
  },
  STEP_ORDER: [
    'WELCOME',
    'GARAGE_REGISTRATION',
    'PAYMENT_CONFIGURATION',
    'STAFF_REGISTRATION',
    'COMPLETE',
  ],
  STEP_TITLES: {
    WELCOME: 'Welcome to PitStop',
    GARAGE_REGISTRATION: 'Garage Details',
    PAYMENT_CONFIGURATION: 'Payment Methods',
    STAFF_REGISTRATION: 'Staff Management',
    COMPLETE: 'Setup Complete',
  },
  STEP_DESCRIPTIONS: {
    WELCOME: 'Let\'s get your garage set up',
    GARAGE_REGISTRATION: 'Tell us about your garage',
    PAYMENT_CONFIGURATION: 'Set up payment options',
    STAFF_REGISTRATION: 'Add your team members',
    COMPLETE: 'You\'re all set!',
  },
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: {
    value: 'CASH',
    label: 'Cash',
    description: 'Accept cash payments',
    icon: '💵',
  },
  UPI: {
    value: 'UPI',
    label: 'UPI',
    description: 'Unified Payment Interface',
    icon: '📱',
  },
  CARD: {
    value: 'CARD',
    label: 'Card',
    description: 'Credit/Debit cards',
    icon: '💳',
  },
  BANK_TRANSFER: {
    value: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Direct bank transfers',
    icon: '🏦',
  },
} as const;

// Staff Roles
export const STAFF_ROLES = {
  MECHANIC: {
    value: 'MECHANIC',
    label: 'Mechanic',
    description: 'Vehicle repair and maintenance',
    icon: '🔧',
  },
  RECEPTIONIST: {
    value: 'RECEPTIONIST',
    label: 'Receptionist',
    description: 'Customer service and bookings',
    icon: '👨‍💼',
  },
  MANAGER: {
    value: 'MANAGER',
    label: 'Manager',
    description: 'Business operations and oversight',
    icon: '👔',
  },
} as const;

// Form Validation
export const FORM_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 200,
  MIN_BUSINESS_HOURS_LENGTH: 10,
  MAX_BUSINESS_HOURS_LENGTH: 500,
  PHONE_LENGTH: 10,
  PINCODE_LENGTH: 6,
  AADHAR_LENGTH: 12,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ONBOARDING_DATA: 'onboarding_data',
  THEME: '@PitStop_theme',
  LANGUAGE: '@PitStop_language',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  GARAGE_CREATED: 'Garage created successfully!',
  ADDRESS_CREATED: 'Address added successfully!',
  PAYMENT_METHODS_CONFIGURED: 'Payment methods configured successfully!',
  STAFF_ADDED: 'Staff member added successfully!',
  ONBOARDING_COMPLETE: 'Onboarding completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
};

// UI Constants
export const UI_CONSTANTS = {
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    XLARGE: 16,
    ROUND: 24,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
    XXXL: 64,
  },
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    TITLE: 28,
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
};

// Export spacing and font sizes for backward compatibility with lowercase keys
export const SPACING = {
  xs: UI_CONSTANTS.SPACING.XS,
  sm: UI_CONSTANTS.SPACING.SM,
  md: UI_CONSTANTS.SPACING.MD,
  lg: UI_CONSTANTS.SPACING.LG,
  xl: UI_CONSTANTS.SPACING.XL,
  xxl: UI_CONSTANTS.SPACING.XXL,
  xxxl: UI_CONSTANTS.SPACING.XXXL, // Alias for backward compatibility
};

export const FONT_SIZES = {
  xs: UI_CONSTANTS.FONT_SIZE.XS,
  sm: UI_CONSTANTS.FONT_SIZE.SM,
  md: UI_CONSTANTS.FONT_SIZE.MD,
  lg: UI_CONSTANTS.FONT_SIZE.LG,
  xl: UI_CONSTANTS.FONT_SIZE.XL,
  xxl: UI_CONSTANTS.FONT_SIZE.XXL,
  title: UI_CONSTANTS.FONT_SIZE.TITLE,
  xxxl: UI_CONSTANTS.FONT_SIZE.XXL, // Alias for backward compatibility
};

// Feature Flags
export const FEATURE_FLAGS = {
  ONBOARDING_ENABLED: true,
  PAYMENT_METHODS_ENABLED: true,
  STAFF_MANAGEMENT_ENABLED: true,
  DARK_MODE_ENABLED: true,
  MULTI_LANGUAGE_ENABLED: false,
  PUSH_NOTIFICATIONS_ENABLED: false,
};

// App Information
export const APP_INFO = {
  NAME: 'PitStop',
  VERSION: '1.0.0',
  DESCRIPTION: 'Garage Management System',
  AUTHOR: 'PitStop Team',
  SUPPORT_EMAIL: 'support@pitstopdms.com',
  WEBSITE: 'https://pitstopdms.com',
}; 