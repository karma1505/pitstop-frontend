import { ApiClient } from '../client';
import {
  CreatePaymentMethodRequest,
  PaymentMethodResponse,
} from '../types';

export class PaymentMethodService {
  static async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
    return ApiClient.post<PaymentMethodResponse>('/admin/payment-methods', data, true);
  }

  static async getMyPaymentMethods(): Promise<PaymentMethodResponse[]> {
    return ApiClient.get<PaymentMethodResponse[]>('/admin/payment-methods', true);
  }

  static async deactivatePaymentMethod(id: string): Promise<PaymentMethodResponse> {
    return ApiClient.patch<PaymentMethodResponse>(`/admin/payment-methods/${id}/status?status=DEACTIVATE`, {}, true);
  }

  static async activatePaymentMethod(id: string): Promise<PaymentMethodResponse> {
    return ApiClient.patch<PaymentMethodResponse>(`/admin/payment-methods/${id}/status?status=ACTIVATE`, {}, true);
  }
}
