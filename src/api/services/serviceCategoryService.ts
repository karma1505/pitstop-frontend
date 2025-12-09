// Service Category service
import { ApiClient } from '../client';
import {
    CreateServiceCategoryRequest,
    UpdateServiceCategoryRequest,
    ServiceCategoryResponse,
    ServiceCategoryPageResponse,
    ServiceCategoryFilters,
} from '../types/service-category';

export class ServiceCategoryService {
    // Create a new service category
    static async createServiceCategory(data: CreateServiceCategoryRequest): Promise<ServiceCategoryResponse> {
        return ApiClient.post<ServiceCategoryResponse>('/admin/service-categories', data, true);
    }

    // Update an existing service category
    static async updateServiceCategory(id: string, data: UpdateServiceCategoryRequest): Promise<ServiceCategoryResponse> {
        return ApiClient.patch<ServiceCategoryResponse>(`/admin/service-categories/${id}`, data, true);
    }

    // Get service category by ID
    static async getServiceCategoryById(id: string): Promise<ServiceCategoryResponse> {
        return ApiClient.get<ServiceCategoryResponse>(`/admin/service-categories/${id}`, true);
    }

    // Get all service categories with filters and pagination
    static async getAllServiceCategories(filters?: ServiceCategoryFilters): Promise<ServiceCategoryPageResponse> {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.categoryName) params.append('categoryName', filters.categoryName);
            if (filters.categoryCode) params.append('categoryCode', filters.categoryCode);
            if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
            if (filters.page !== undefined) params.append('page', filters.page.toString());
            if (filters.size !== undefined) params.append('size', filters.size.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDir) params.append('sortDir', filters.sortDir);
        }

        const queryString = params.toString();
        const endpoint = `/admin/service-categories${queryString ? `?${queryString}` : ''}`;

        return ApiClient.get<ServiceCategoryPageResponse>(endpoint, true);
    }

    // Deactivate service category
    static async deactivateCategory(id: string): Promise<ServiceCategoryResponse> {
        return ApiClient.patch<ServiceCategoryResponse>(`/admin/service-categories/${id}/deactivate`, {}, true);
    }

    // Reactivate service category
    static async reactivateCategory(id: string): Promise<ServiceCategoryResponse> {
        return ApiClient.patch<ServiceCategoryResponse>(`/admin/service-categories/${id}/reactivate`, {}, true);
    }

    // Health check
    static async healthCheck(): Promise<string> {
        return ApiClient.get<string>('/admin/service-categories/health', true);
    }
}
