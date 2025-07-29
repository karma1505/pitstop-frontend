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