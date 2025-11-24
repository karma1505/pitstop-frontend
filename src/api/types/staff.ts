// Staff Management Types

export type StaffRole = 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';

export interface StaffResponse {
  id: string;
  garageId?: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  aadharNumber?: string;
  role: StaffRole;
  isActive: boolean;
  jobsCompleted?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  aadharNumber?: string;
  role: StaffRole;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {}

export interface StaffFilters {
  page?: number;
  size?: number;
  role?: StaffRole;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface StaffListResponse {
  content: StaffResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

