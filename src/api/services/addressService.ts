import { ApiClient } from '../client';
import {
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
} from '../types';

export class AddressService {
  static async createAddress(data: CreateAddressRequest): Promise<AddressResponse> {
    return ApiClient.post<AddressResponse>('/admin/addresses', data, true);
  }

  static async getMyAddresses(): Promise<AddressResponse[]> {
    return ApiClient.get<AddressResponse[]>('/admin/addresses', true);
  }

  static async updateAddress(id: string, data: UpdateAddressRequest): Promise<AddressResponse> {
    return ApiClient.patch<AddressResponse>(`/admin/addresses/${id}`, data, true);
  }

  static async deleteAddress(id: string): Promise<void> {
    return ApiClient.delete<void>(`/admin/addresses/${id}`, true);
  }
}
