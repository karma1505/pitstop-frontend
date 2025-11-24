// Staff Management Service
import { ApiClient } from '../client';
import {
  StaffResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  StaffFilters,
  StaffListResponse,
} from '../types/staff';

export class StaffService {
  // Get all staff with pagination and optional filters
  static async getAllStaff(filters?: StaffFilters): Promise<StaffListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) {
      params.append('page', filters.page.toString());
    }
    if (filters?.size !== undefined) {
      params.append('size', filters.size.toString());
    }
    if (filters?.role) {
      params.append('role', filters.role);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/staff?${queryString}` : '/admin/staff';
    
    return ApiClient.get<StaffListResponse>(endpoint, true);
  }

  // Get staff by ID
  static async getStaffById(id: string): Promise<StaffResponse> {
    return ApiClient.get<StaffResponse>(`/admin/staff/${id}`, true);
  }

  // Create new staff member
  static async createStaff(data: CreateStaffRequest): Promise<StaffResponse> {
    return ApiClient.post<StaffResponse>('/admin/staff', data, true);
  }

  // Update staff member
  static async updateStaff(id: string, data: UpdateStaffRequest): Promise<StaffResponse> {
    return ApiClient.patch<StaffResponse>(`/admin/staff/${id}`, data, true);
  }

  // Activate staff member
  static async activateStaff(id: string): Promise<StaffResponse> {
    return ApiClient.patch<StaffResponse>(`/admin/staff/${id}/status?status=ACTIVATE`, {}, true);
  }

  // Deactivate staff member
  static async deactivateStaff(id: string): Promise<StaffResponse> {
    return ApiClient.patch<StaffResponse>(`/admin/staff/${id}/status?status=DEACTIVATE`, {}, true);
  }

  // Get all active staff
  static async getActiveStaff(): Promise<StaffResponse[]> {
    return ApiClient.get<StaffResponse[]>('/admin/staff/active', true);
  }

  // Get current user's staff
  static async getMyStaff(): Promise<StaffResponse[]> {
    return ApiClient.get<StaffResponse[]>('/admin/staff/my-staff', true);
  }
}

