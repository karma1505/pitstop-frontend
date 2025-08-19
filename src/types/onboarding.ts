// Onboarding Types and Interfaces

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
}

export interface GarageData {
  id?: string;
  garageName: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours: string;
  hasBranch: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressData {
  id?: string;
  garageId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethodData {
  id?: string;
  garageId?: string;
  paymentMethod: PaymentMethodType;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffData {
  id?: string;
  garageId?: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  aadharNumber?: string;
  role: StaffRoleType;
  isActive?: boolean;
  jobsCompleted?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethodType = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';

export type StaffRoleType = 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';

export interface OnboardingData {
  user: UserData;
  garage: GarageData;
  address: AddressData;
  paymentMethods: PaymentMethodData[];
  staff: StaffData[];
}

export interface OnboardingStatus {
  userId: string;
  hasGarage: boolean;
  hasAddress: boolean;
  hasPaymentMethods: boolean;
  hasStaff: boolean;
  completionPercentage: number;
}

export interface NextStepResponse {
  step: 'GARAGE_REGISTRATION' | 'PAYMENT_CONFIGURATION' | 'STAFF_REGISTRATION' | 'COMPLETED';
  message: string;
  priority: number;
}

export interface CompleteOnboardingRequest {
  garageRequest: GarageData;
  addressRequest: AddressData;
  paymentMethodRequests: { paymentMethod: PaymentMethodType }[];
  staffRequests: StaffData[];
}

// API Request/Response Types
export interface GarageRequest {
  garageName: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours: string;
  hasBranch: boolean;
}

export interface AddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface PaymentMethodRequest {
  paymentMethod: PaymentMethodType;
}

export interface StaffRequest {
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  aadharNumber?: string;
  role: StaffRoleType;
}

// Onboarding Step Types
export type OnboardingStep = 
  | 'WELCOME'
  | 'GARAGE_REGISTRATION'
  | 'PAYMENT_CONFIGURATION'
  | 'STAFF_REGISTRATION'
  | 'COMPLETE';

export interface OnboardingStepConfig {
  step: OnboardingStep;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
}
