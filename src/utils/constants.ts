// App-wide constants
// Note: Colors are now managed through the theme system
// Use useTheme() hook to access theme-aware colors

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const SCREEN_NAMES = {
  HOME: 'Home',
  GARAGE_DETAILS: 'GarageDetails',
  BOOK_APPOINTMENT: 'BookAppointment',
  PROFILE: 'Profile',
  LOGIN: 'Login',
  REGISTER: 'Register',
  // Onboarding screens
  SPLASH: 'Splash',
  ONBOARDING_PROGRESS: 'OnboardingProgress',
  GARAGE_SETUP: 'GarageSetup',
  ADDRESS_SETUP: 'AddressSetup',
  PAYMENT_SETUP: 'PaymentSetup',
  STAFF_SETUP: 'StaffSetup',
} as const;

export const API_ENDPOINTS = {
  GARAGES: '/garages',
  USERS: '/users',
  APPOINTMENTS: '/appointments',
  SERVICES: '/services',
  // Onboarding endpoints
  ONBOARDING_STATUS: '/admin/onboarding/status',
  ONBOARDING_NEXT_STEP: '/admin/onboarding/next-step',
  ONBOARDING_COMPLETE: '/admin/onboarding/complete',
  ADDRESSES: '/admin/addresses',
  PAYMENT_METHODS: '/admin/payment-methods',
  STAFF: '/admin/staff',
} as const;

export const GARAGE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  BUSY: 'busy',
} as const;

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

// Onboarding constants
export const ONBOARDING_STEPS = {
  GARAGE_SETUP: 'GARAGE_SETUP',
  ADDRESS_SETUP: 'ADDRESS_SETUP',
  PAYMENT_SETUP: 'PAYMENT_SETUP',
  STAFF_SETUP: 'STAFF_SETUP',
  COMPLETE: 'COMPLETE',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  UPI: 'UPI',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;

export const STAFF_ROLES = {
  MECHANIC: 'MECHANIC',
  RECEPTIONIST: 'RECEPTIONIST',
  MANAGER: 'MANAGER',
} as const;

export const STAFF_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 255,
  MAX_CITY_LENGTH: 100,
  MAX_STATE_LENGTH: 100,
  MAX_COUNTRY_LENGTH: 100,
  PINCODE_LENGTH: 6,
  MOBILE_LENGTH: 10,
  AADHAR_LENGTH: 12,
  GST_LENGTH: 15,
  BUSINESS_REG_LENGTH: 20,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PINCODE: 'Please enter a valid 6-digit pincode',
  INVALID_AADHAR: 'Please enter a valid 12-digit Aadhar number',
  INVALID_GST: 'Please enter a valid GST number',
  INVALID_BUSINESS_REG: 'Please enter a valid business registration number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  MIN_PASSWORD_LENGTH: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const; 