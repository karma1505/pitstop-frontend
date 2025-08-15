import { ApiClient } from '../client';
import {
  CreateStaffRequest,
  StaffResponse,
  Page,
} from '../types';

export class StaffService {
  static async createStaff(data: CreateStaffRequest): Promise<StaffResponse> {
    return ApiClient.post<StaffResponse>('/admin/staff', data, true);
  }

  static async getAllStaff(page: number = 0, size: number = 10, role?: string): Promise<Page<StaffResponse>> {
    let endpoint = `/admin/staff?page=${page}&size=${size}`;
    if (role) {
      endpoint += `&role=${role}`;
    }
    return ApiClient.get<Page<StaffResponse>>(endpoint, true);
  }

  static async getStaffById(id: string): Promise<StaffResponse> {
    return ApiClient.get<StaffResponse>(`/admin/staff/${id}`, true);
  }

  static async updateStaff(id: string, data: CreateStaffRequest): Promise<StaffResponse> {
    return ApiClient.patch<StaffResponse>(`/admin/staff/${id}`, data, true);
  }

  static async updateStaffStatus(id: string, status: string): Promise<StaffResponse> {
    return ApiClient.patch<StaffResponse>(`/admin/staff/${id}/status?status=${status}`, {}, true);
  }
}
