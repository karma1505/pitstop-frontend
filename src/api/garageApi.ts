// API service for garage-related endpoints

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

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
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
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