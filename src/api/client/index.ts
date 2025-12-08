// Shared HTTP client for API requests
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../utils';

const BASE_URL = API_CONFIG.BASE_URL;

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

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (fetchError: any) {
      console.error(`[ApiClient] Network error for ${url}:`, fetchError);
      // Handle network errors (connection refused, timeout, etc.)
      if (fetchError.message?.includes('Failed to fetch') ||
        fetchError.message?.includes('Network request failed') ||
        fetchError.message?.includes('timeout')) {
        throw new Error(`Cannot connect to server at ${BASE_URL}. Please check if the server is running and accessible.`);
      }
      throw fetchError;
    }

    // Try to parse the response
    let responseData: any;
    try {
      const text = await response.text();
      if (!text) {
        responseData = {};
      } else {
        responseData = JSON.parse(text);
      }
    } catch (parseError) {
      console.error(`[ApiClient] Failed to parse response from ${url}:`, parseError);
      throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
    }

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