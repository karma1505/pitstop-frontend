// Garage management service
import { ApiClient } from '../client';

export interface Garage {
  id: string;
  name: string;
  address: string;
  services: Service[];
  rating: number;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export class GarageService {
  // Get all garages
  static async getGarages(): Promise<Garage[]> {
    return ApiClient.get<Garage[]>('/garages', true);
  }

  // Get specific garage by ID
  static async getGarage(id: string): Promise<Garage> {
    return ApiClient.get<Garage>(`/garages/${id}`, true);
  }

  // Create new garage
  static async createGarage(data: Partial<Garage>): Promise<Garage> {
    return ApiClient.post<Garage>('/garages', data, true);
  }

  // Update garage
  static async updateGarage(id: string, data: Partial<Garage>): Promise<Garage> {
    return ApiClient.put<Garage>(`/garages/${id}`, data, true);
  }

  // Delete garage
  static async deleteGarage(id: string): Promise<void> {
    return ApiClient.delete<void>(`/garages/${id}`, true);
  }
} 