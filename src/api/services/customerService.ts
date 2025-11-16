// Customer service
import { ApiClient } from '../client';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse,
  CustomerListResponse,
  CustomerFilters,
} from '../types/customer';

export class CustomerService {
  // Create a new customer
  static async createCustomer(data: CreateCustomerRequest): Promise<CustomerResponse> {
    return ApiClient.post<CustomerResponse>('/admin/customers', data, true);
  }

  // Update an existing customer
  static async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<CustomerResponse> {
    return ApiClient.patch<CustomerResponse>(`/admin/customers/${id}`, data, true);
  }

  // Get customer by ID
  static async getCustomerById(id: string): Promise<CustomerResponse> {
    return ApiClient.get<CustomerResponse>(`/admin/customers/${id}`, true);
  }

  // Get all customers with filters and pagination
  static async getAllCustomers(filters?: CustomerFilters): Promise<CustomerListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.customerName) params.append('customerName', filters.customerName);
      if (filters.vehicleRegistrationNumber) params.append('vehicleRegistrationNumber', filters.vehicleRegistrationNumber);
      if (filters.vehicleBrand) params.append('vehicleBrand', filters.vehicleBrand);
      if (filters.date) params.append('date', filters.date);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDir) params.append('sortDir', filters.sortDir);
    }

    const queryString = params.toString();
    const endpoint = `/admin/customers${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.get<CustomerListResponse>(endpoint, true);
  }

  // Health check
  static async healthCheck(): Promise<string> {
    return ApiClient.get<string>('/admin/customers/health', true);
  }
}

