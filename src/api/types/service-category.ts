// Service Category API types

export interface CreateServiceCategoryRequest {
    categoryName: string;
    categoryCode: string;
    description?: string;
    estimatedTime?: number; // in minutes
}

export interface UpdateServiceCategoryRequest {
    categoryName: string;
    description?: string;
    estimatedTime?: number; // in minutes
    isActive: boolean;
}

export interface ServiceCategoryResponse {
    id: string;
    categoryName: string;
    categoryCode: string;
    description?: string;
    estimatedTime?: number; // in minutes
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceCategoryListResponse {
    id: string;
    categoryName: string;
    categoryCode: string;
    estimatedTime?: number; // in minutes
    isActive: boolean;
}

export interface ServiceCategoryPageResponse {
    content: ServiceCategoryListResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface ServiceCategoryFilters {
    categoryName?: string;
    categoryCode?: string;
    isActive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}
