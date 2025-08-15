// API service for garage-related endpoints
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  OTPVerificationRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  OTPResponse,
  AuthResponse,
  CreateGarageRequest,
  GarageResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
  CreatePaymentMethodRequest,
  PaymentMethodResponse,
  CreateStaffRequest,
  StaffResponse,
  OnboardingStatusResponse,
  NextStepResponse,
  CompleteOnboardingRequest,
  OnboardingResponse,
  Page,
} from './types';

const BASE_URL = 'http://192.168.31.70:8080/api/v1';

export class GarageApi {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Get auth token for authenticated requests
    let authToken = null;
    if (requireAuth) {
      try {
        authToken = await AsyncStorage.getItem('auth_token');
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header for authenticated requests
    if (requireAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    
    // Parse the response first
    const responseData = await response.json();
    
    // For authentication endpoints, return the response even if it's not successful
    // so the calling code can handle success/failure based on the response data
    if (endpoint.includes('/admin/login') || endpoint.includes('/admin/register') || 
        endpoint.includes('/admin/forgot-password') || endpoint.includes('/admin/verify-otp') ||
        endpoint.includes('/admin/reset-password') || endpoint.includes('/admin/send-login-otp') ||
        endpoint.includes('/admin/login-with-otp')) {
      return responseData;
    }
    
    // For other endpoints, throw error if not successful
    if (!response.ok) {
      throw new Error(responseData.message || `API Error: ${response.status} ${response.statusText}`);
    }
    
    return responseData;
  }

  // Authentication methods
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/admin/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // OTP methods
  static async forgotPassword(request: ForgotPasswordRequest): Promise<OTPResponse> {
    return this.request<OTPResponse>('/admin/forgot-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async verifyOTP(request: OTPVerificationRequest): Promise<OTPResponse> {
    return this.request<OTPResponse>('/admin/verify-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async resetPassword(request: ResetPasswordRequest): Promise<OTPResponse> {
    return this.request<OTPResponse>('/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async sendLoginOTP(request: ForgotPasswordRequest): Promise<OTPResponse> {
    return this.request<OTPResponse>('/admin/send-login-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async loginWithOTP(request: OTPVerificationRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/admin/login-with-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async changePassword(request: ChangePasswordRequest): Promise<OTPResponse> {
    return this.request<OTPResponse>('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true); // Pass true for requireAuth
  }

  static async updateProfile(request: UpdateProfileRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/admin/update-profile', {
      method: 'PATCH',
      body: JSON.stringify(request),
    }, true); // Pass true for requireAuth
  }

  // Garage Management
  static async createGarage(data: CreateGarageRequest): Promise<GarageResponse> {
    return this.request<GarageResponse>('/admin/garage', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async getGarage(id: string): Promise<GarageResponse> {
    return this.request<GarageResponse>(`/admin/garage/${id}`, {}, true);
  }

  static async updateGarage(id: string, data: CreateGarageRequest): Promise<GarageResponse> {
    return this.request<GarageResponse>(`/admin/garage/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  // Address Management
  static async createAddress(data: CreateAddressRequest): Promise<AddressResponse> {
    return this.request<AddressResponse>('/admin/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async getMyAddresses(): Promise<AddressResponse[]> {
    return this.request<AddressResponse[]>('/admin/addresses', {}, true);
  }

  static async updateAddress(id: string, data: UpdateAddressRequest): Promise<AddressResponse> {
    return this.request<AddressResponse>(`/admin/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  static async deleteAddress(id: string): Promise<void> {
    return this.request<void>(`/admin/addresses/${id}`, {
      method: 'DELETE',
    }, true);
  }

  // Payment Methods
  static async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
    return this.request<PaymentMethodResponse>('/admin/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async getMyPaymentMethods(): Promise<PaymentMethodResponse[]> {
    return this.request<PaymentMethodResponse[]>('/admin/payment-methods', {}, true);
  }

  static async deactivatePaymentMethod(id: string): Promise<PaymentMethodResponse> {
    return this.request<PaymentMethodResponse>(`/admin/payment-methods/${id}/status?status=DEACTIVATE`, {
      method: 'PATCH',
    }, true);
  }

  static async activatePaymentMethod(id: string): Promise<PaymentMethodResponse> {
    return this.request<PaymentMethodResponse>(`/admin/payment-methods/${id}/status?status=ACTIVATE`, {
      method: 'PATCH',
    }, true);
  }

  // Staff Management
  static async createStaff(data: CreateStaffRequest): Promise<StaffResponse> {
    return this.request<StaffResponse>('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async getAllStaff(page: number = 0, size: number = 10, role?: string): Promise<Page<StaffResponse>> {
    let endpoint = `/admin/staff?page=${page}&size=${size}`;
    if (role) {
      endpoint += `&role=${role}`;
    }
    return this.request<Page<StaffResponse>>(endpoint, {}, true);
  }

  static async getStaffById(id: string): Promise<StaffResponse> {
    return this.request<StaffResponse>(`/admin/staff/${id}`, {}, true);
  }

  static async updateStaff(id: string, data: CreateStaffRequest): Promise<StaffResponse> {
    return this.request<StaffResponse>(`/admin/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  static async updateStaffStatus(id: string, status: string): Promise<StaffResponse> {
    return this.request<StaffResponse>(`/admin/staff/${id}/status?status=${status}`, {
      method: 'PATCH',
    }, true);
  }

  // Onboarding Status
  static async getOnboardingStatus(): Promise<OnboardingStatusResponse> {
    return this.request<OnboardingStatusResponse>('/admin/onboarding/status', {}, true);
  }

  static async getNextStep(): Promise<NextStepResponse> {
    return this.request<NextStepResponse>('/admin/onboarding/next-step', {}, true);
  }

  static async completeOnboarding(data: CompleteOnboardingRequest): Promise<OnboardingResponse> {
    return this.request<OnboardingResponse>('/admin/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

} 