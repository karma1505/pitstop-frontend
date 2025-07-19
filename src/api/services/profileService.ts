// Profile management service
import { ApiClient } from '../client';
import { UpdateProfileRequest, AuthResponse, ChangePasswordRequest, OTPResponse } from '../types';

export class ProfileService {
  // Update user profile (requires authentication)
  static async updateProfile(request: UpdateProfileRequest): Promise<AuthResponse> {
    return ApiClient.patch<AuthResponse>('/admin/update-profile', request, true);
  }

  // Change password (requires authentication)
  static async changePassword(request: ChangePasswordRequest): Promise<OTPResponse> {
    return ApiClient.post<OTPResponse>('/admin/change-password', request, true);
  }
} 