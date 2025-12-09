// Inventory service
import { ApiClient } from '../client';
import {
    CreateInventoryItemRequest,
    UpdateInventoryItemRequest,
    AdjustStockRequest,
    InventoryItemResponse,
    InventoryPageResponse,
    StockHistoryPageResponse,
    InventoryFilters,
} from '../types/inventory';

export class InventoryService {
    // Create a new inventory item
    static async createInventoryItem(data: CreateInventoryItemRequest): Promise<InventoryItemResponse> {
        return ApiClient.post<InventoryItemResponse>('/admin/inventory', data, true);
    }

    // Update an existing inventory item
    static async updateInventoryItem(id: string, data: UpdateInventoryItemRequest): Promise<InventoryItemResponse> {
        return ApiClient.patch<InventoryItemResponse>(`/admin/inventory/${id}`, data, true);
    }

    // Get inventory item by ID
    static async getInventoryItemById(id: string): Promise<InventoryItemResponse> {
        return ApiClient.get<InventoryItemResponse>(`/admin/inventory/${id}`, true);
    }

    // Get all inventory items with filters and pagination
    static async getAllInventoryItems(filters?: InventoryFilters): Promise<InventoryPageResponse> {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.category) params.append('category', filters.category);
            if (filters.itemName) params.append('itemName', filters.itemName);
            if (filters.itemCode) params.append('itemCode', filters.itemCode);
            if (filters.lowStockOnly !== undefined) params.append('lowStockOnly', filters.lowStockOnly.toString());
            if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
            if (filters.page !== undefined) params.append('page', filters.page.toString());
            if (filters.size !== undefined) params.append('size', filters.size.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDir) params.append('sortDir', filters.sortDir);
        }

        const queryString = params.toString();
        const endpoint = `/admin/inventory${queryString ? `?${queryString}` : ''}`;

        return ApiClient.get<InventoryPageResponse>(endpoint, true);
    }

    // Adjust stock levels
    static async adjustStock(id: string, data: AdjustStockRequest): Promise<InventoryItemResponse> {
        return ApiClient.post<InventoryItemResponse>(`/admin/inventory/${id}/adjust-stock`, data, true);
    }

    // Get low stock items
    static async getLowStockItems(page: number = 0, size: number = 20): Promise<InventoryPageResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        return ApiClient.get<InventoryPageResponse>(`/admin/inventory/low-stock?${params.toString()}`, true);
    }

    // Get stock adjustment history
    static async getStockHistory(id: string, page: number = 0, size: number = 20): Promise<StockHistoryPageResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        return ApiClient.get<StockHistoryPageResponse>(`/admin/inventory/${id}/history?${params.toString()}`, true);
    }

    // Deactivate inventory item
    static async deactivateItem(id: string): Promise<InventoryItemResponse> {
        return ApiClient.patch<InventoryItemResponse>(`/admin/inventory/${id}/deactivate`, {}, true);
    }

    // Reactivate inventory item
    static async reactivateItem(id: string): Promise<InventoryItemResponse> {
        return ApiClient.patch<InventoryItemResponse>(`/admin/inventory/${id}/reactivate`, {}, true);
    }

    // Health check
    static async healthCheck(): Promise<string> {
        return ApiClient.get<string>('/admin/inventory/health', true);
    }
}
