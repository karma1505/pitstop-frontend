// API service for garage-related endpoints

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.29.104:8080/api/v1';

export interface LoginRequest {
  email: string;
  password: string;
}

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
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    garageName: string;
    state: string;
    city: string;
    createdAt: string;
  };
  message: string;
  success: boolean;
}

export class GarageApi {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Parse the response first
    const responseData = await response.json();
    
    // For authentication endpoints, return the response even if it's not successful
    // so the calling code can handle success/failure based on the response data
    if (endpoint.includes('/admin/login') || endpoint.includes('/admin/register')) {
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

  // Example API methods
  static async getGarages() {
    return this.request('/garages');
  }

  static async getGarage(id: string) {
    return this.request(`/garages/${id}`);
  }

  static async createGarage(data: any) {
    return this.request('/garages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateGarage(id: string, data: any) {
    return this.request(`/garages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteGarage(id: string) {
    return this.request(`/garages/${id}`, {
      method: 'DELETE',
    });
  }
} 