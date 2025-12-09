// Inventory API types

export interface CreateInventoryItemRequest {
    itemCode: string;
    itemName: string;
    description?: string;
    category?: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    minStockLevel?: number;
    maxStockLevel?: number;
    initialQuantity: number;
}

export interface UpdateInventoryItemRequest {
    itemName: string;
    description?: string;
    category?: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    minStockLevel?: number;
    maxStockLevel?: number;
    isActive: boolean;
}

export interface AdjustStockRequest {
    adjustmentType: 'ADD' | 'REMOVE' | 'SET';
    quantity: number;
    reason: string;
    notes?: string;
}

export interface InventoryItemResponse {
    id: string;
    itemCode: string;
    itemName: string;
    description?: string;
    category?: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplierId?: string;
    branchId: string;
    minStockLevel: number;
    maxStockLevel?: number;
    isActive: boolean;
    currentQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    isLowStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryListResponse {
    id: string;
    itemCode: string;
    itemName: string;
    category?: string;
    unit: string;
    sellingPrice: number;
    currentQuantity: number;
    availableQuantity: number;
    isLowStock: boolean;
    isActive: boolean;
}

export interface StockAdjustmentResponse {
    id: string;
    inventoryId: string;
    itemCode: string;
    itemName: string;
    adjustmentType: string;
    quantityBefore?: number;
    quantityAfter?: number;
    quantityChanged: number;
    reason: string;
    notes?: string;
    performedBy: string;
    createdAt: string;
}

export interface InventoryPageResponse {
    content: InventoryListResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface StockHistoryPageResponse {
    content: StockAdjustmentResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface InventoryFilters {
    category?: string;
    itemName?: string;
    itemCode?: string;
    lowStockOnly?: boolean;
    isActive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}
