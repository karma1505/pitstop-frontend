// Vehicle service
import { ApiClient } from '../client';
import {
    CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleResponse,
    VehicleListResponse,
    VehicleFilters,
} from '../types/vehicle';

export class VehicleService {
    // Create a new vehicle
    static async createVehicle(data: CreateVehicleRequest): Promise<VehicleResponse> {
        return ApiClient.post<VehicleResponse>('/admin/vehicles', data, true);
    }

    // Update an existing vehicle
    static async updateVehicle(id: string, data: UpdateVehicleRequest): Promise<VehicleResponse> {
        return ApiClient.patch<VehicleResponse>(`/admin/vehicles/${id}`, data, true);
    }

    // Get vehicle by ID
    static async getVehicleById(id: string): Promise<VehicleResponse> {
        return ApiClient.get<VehicleResponse>(`/admin/vehicles/${id}`, true);
    }

    // Get all vehicles with filters and pagination
    static async getAllVehicles(filters?: VehicleFilters): Promise<VehicleListResponse> {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.registrationNumber) params.append('registrationNumber', filters.registrationNumber);
            if (filters.make) params.append('make', filters.make);
            if (filters.model) params.append('model', filters.model);
            if (filters.customerId) params.append('customerId', filters.customerId);
            if (filters.page !== undefined) params.append('page', filters.page.toString());
            if (filters.size !== undefined) params.append('size', filters.size.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDir) params.append('sortDir', filters.sortDir);
        }

        const queryString = params.toString();
        const endpoint = `/admin/vehicles${queryString ? `?${queryString}` : ''}`;

        return ApiClient.get<VehicleListResponse>(endpoint, true);
    }

    // Delete vehicle
    static async deleteVehicle(id: string): Promise<void> {
        return ApiClient.delete<void>(`/admin/vehicles/${id}`, true);
    }

    // Health check
    static async healthCheck(): Promise<string> {
        return ApiClient.get<string>('/admin/vehicles/health', true);
    }
}
