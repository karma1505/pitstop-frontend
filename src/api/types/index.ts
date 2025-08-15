// API Types and Interfaces

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  state: string;
  city: string;
  pincode: string;
  mobileNumber: string;
  garageName: string;
  addressLine1: string;
  addressLine2: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface OTPVerificationRequest {
  email: string;
  otpCode: string;
  type: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  mobileNumber: string;
  garageName: string;
  addressLine1: string;
  addressLine2: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    garageName: string;
    state: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    mobileNumber: string;
    pincode: string;
    createdAt: string;
  };
  message: string;
  success: boolean;
}

// Garage Types
export interface CreateGarageRequest {
  garageName: string;
  businessRegistrationNumber: string;
  gstNumber: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours?: string;
  hasBranch: boolean;
}

export interface GarageResponse {
  id: string;
  garageName: string;
  businessRegistrationNumber: string;
  gstNumber: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours?: string;
  hasBranch: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface CreateAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UpdateAddressRequest {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface AddressResponse {
  id: string;
  garageId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Method Types
export interface CreatePaymentMethodRequest {
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
}

export interface PaymentMethodResponse {
  id: string;
  garageId: string;
  paymentMethod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Staff Types
export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  aadharNumber: string;
  role: 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';
}

export interface StaffResponse {
  id: string;
  garageId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  aadharNumber: string;
  role: string;
  isActive: boolean;
  jobsCompleted?: number;
  createdAt: string;
  updatedAt: string;
}

// Onboarding Types
export interface OnboardingStatusResponse {
  userId: string;
  hasGarage: boolean;
  hasAddress: boolean;
  hasPaymentMethods: boolean;
  hasStaff: boolean;
  completionPercentage: number;
}

export interface NextStepResponse {
  step: string;
  message: string;
  priority: number;
}

export interface CompleteOnboardingRequest {
  garageRequest: CreateGarageRequest;
  addressRequest: CreateAddressRequest;
  paymentMethodRequests: CreatePaymentMethodRequest[];
  staffRequests: CreateStaffRequest[];
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Pagination Types
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 