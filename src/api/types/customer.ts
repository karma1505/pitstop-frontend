// Customer API types

export interface VehicleInfo {
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface VehicleSummary {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  vehicleInfo?: VehicleInfo;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  vehicleInfo?: VehicleInfo;
}

export interface CustomerResponse {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  isRegularCustomer: boolean;
  vehicles: VehicleSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListResponse {
  content: CustomerResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CustomerFilters {
  customerName?: string;
  vehicleRegistrationNumber?: string;
  vehicleBrand?: string;
  date?: string; // YYYY-MM-DD
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

