// Authentication service
import { ApiClient } from '../client';
import { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  OTPVerificationRequest, 
  ResetPasswordRequest, 
  ChangePasswordRequest, 
  AuthResponse, 
  OTPResponse 
} from '../types';

export class AuthService {
  // Login with email and password
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/admin/login', credentials);
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/admin/register', userData);
  }

  // Send OTP for forgot password
  static async forgotPassword(request: ForgotPasswordRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/forgot-password', request);
  }

  // Verify OTP
  static async verifyOTP(request: OTPVerificationRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/verify-otp', request);
  }

  // Reset password with OTP
  static async resetPassword(request: ResetPasswordRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/reset-password', request);
  }

  // Send OTP for login
  static async sendLoginOTP(request: ForgotPasswordRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/send-login-otp', request);
  }

  // Login with OTP
  static async loginWithOTP(request: OTPVerificationRequest): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/admin/login-with-otp', request);
  }

  // Change password (requires authentication)
  static async changePassword(request: ChangePasswordRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/change-password', request, true);
  }
} 