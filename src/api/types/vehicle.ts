// Vehicle API types

export interface CreateVehicleRequest {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    vinNumber?: string;
    customerId?: string;
}

export interface UpdateVehicleRequest {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    vinNumber?: string;
    customerId?: string;
}

export interface VehicleResponse {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    vinNumber?: string;
    customerId?: string;
    customerName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleListResponse {
    content: VehicleResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface VehicleFilters {
    registrationNumber?: string;
    make?: string;
    model?: string;
    customerId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}
