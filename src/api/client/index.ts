// Shared HTTP client for API requests
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.31.70:8080/api/v1';

export class ApiClient {
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

  static async get<T>(endpoint: string, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, requireAuth);
  }

  static async post<T>(endpoint: string, data: any, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  static async put<T>(endpoint: string, data: any, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  static async patch<T>(endpoint: string, data: any, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  static async delete<T>(endpoint: string, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requireAuth);
  }
} 