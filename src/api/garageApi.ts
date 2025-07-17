// API service for garage-related endpoints
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.31.235:8080/api/v1';

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
  phoneNumber: string;
}

export interface OTPVerificationRequest {
  phoneNumber: string;
  otpCode: string;
  type: string;
}

export interface ResetPasswordRequest {
  phoneNumber: string;
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
    id: string; // Changed from number to string for UUID
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

  // Example API methods
  static async getGarages() {
    return this.request('/garages', {}, true);
  }

  static async getGarage(id: string) {
    return this.request(`/garages/${id}`, {}, true);
  }

  static async createGarage(data: any) {
    return this.request('/garages', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async updateGarage(id: string, data: any) {
    return this.request(`/garages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true);
  }

  static async deleteGarage(id: string) {
    return this.request(`/garages/${id}`, {
      method: 'DELETE',
    }, true);
  }
} 