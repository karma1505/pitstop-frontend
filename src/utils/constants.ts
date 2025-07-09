// App-wide constants

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#0f0f0f',
  surface: '#1C1C1E',
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    disabled: '#636366',
  },
  border: '#3A3A3C',
} as const;

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
} as const;

export const API_ENDPOINTS = {
  GARAGES: '/garages',
  USERS: '/users',
  APPOINTMENTS: '/appointments',
  SERVICES: '/services',
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