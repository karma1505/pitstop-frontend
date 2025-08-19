import { ApiClient } from '../api/client';
import {
  OnboardingStatus,
  NextStepResponse,
  CompleteOnboardingRequest,
  GarageRequest,
  AddressRequest,
  PaymentMethodRequest,
  StaffRequest,
  GarageData,
  AddressData,
  PaymentMethodData,
  StaffData,
} from '../types/onboarding';

export class OnboardingService {
  // Check backend connectivity
  static async checkBackendConnectivity(): Promise<{ isConnected: boolean; error?: string }> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.31.70:8080/api/v1'}/admin/onboarding/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Even if we get a 401 (unauthorized), it means the backend is running
      if (response.status === 403) {
        return { isConnected: true };
      }
      
      return { isConnected: response.ok };
    } catch (error) {
      console.error('Backend connectivity check failed:', error);
      return { isConnected: false, error: 'Backend is not accessible' };
    }
  }

  // Get onboarding status
  static async getOnboardingStatus(): Promise<OnboardingStatus> {
    return ApiClient.get<OnboardingStatus>('/admin/onboarding/status', true);
  }

  // Get next step in onboarding
  static async getNextStep(): Promise<NextStepResponse> {
    return ApiClient.get<NextStepResponse>('/admin/onboarding/next-step', true);
  }

  // Complete onboarding in single transaction
  static async completeOnboarding(data: CompleteOnboardingRequest): Promise<{
    success: boolean;
    message: string;
    data?: {
      garage: GarageData;
      address: AddressData;
      paymentMethods: PaymentMethodData[];
      staff: StaffData[];
    };
  }> {
    return ApiClient.post('/admin/onboarding/complete', data, true);
  }

  // Individual step APIs for step-by-step completion

  // Garage Registration
  static async createGarage(data: GarageRequest): Promise<GarageData> {
    return ApiClient.post<GarageData>('/admin/garage', data, true);
  }

  static async getGarage(id: string): Promise<GarageData> {
    return ApiClient.get<GarageData>(`/admin/garage/${id}`, true);
  }

  static async updateGarage(id: string, data: Partial<GarageRequest>): Promise<GarageData> {
    return ApiClient.patch<GarageData>(`/admin/garage/${id}`, data, true);
  }

  // Address Management
  static async createAddress(data: AddressRequest): Promise<AddressData> {
    return ApiClient.post<AddressData>('/admin/addresses', data, true);
  }

  static async getAddresses(): Promise<AddressData[]> {
    return ApiClient.get<AddressData[]>('/admin/addresses/my-addresses', true);
  }

  static async updateAddress(id: string, data: Partial<AddressRequest>): Promise<AddressData> {
    return ApiClient.patch<AddressData>(`/admin/addresses/${id}`, data, true);
  }

  // Payment Methods
  static async createPaymentMethod(data: PaymentMethodRequest): Promise<PaymentMethodData> {
    return ApiClient.post<PaymentMethodData>('/admin/payment-methods', data, true);
  }

  static async getPaymentMethods(): Promise<PaymentMethodData[]> {
    return ApiClient.get<PaymentMethodData[]>('/admin/payment-methods/my-payment-methods', true);
  }

  static async activatePaymentMethod(id: string): Promise<PaymentMethodData> {
    return ApiClient.patch<PaymentMethodData>(`/admin/payment-methods/${id}/activate`, {}, true);
  }

  static async deactivatePaymentMethod(id: string): Promise<PaymentMethodData> {
    return ApiClient.patch<PaymentMethodData>(`/admin/payment-methods/${id}/deactivate`, {}, true);
  }

  // Staff Management
  static async createStaff(data: StaffRequest): Promise<StaffData> {
    return ApiClient.post<StaffData>('/admin/staff', data, true);
  }

  static async getStaff(role?: string): Promise<{
    content: StaffData[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const endpoint = role ? `/admin/staff?role=${role}` : '/admin/staff';
    return ApiClient.get(endpoint, true);
  }

  static async updateStaff(id: string, data: Partial<StaffRequest>): Promise<StaffData> {
    return ApiClient.patch<StaffData>(`/admin/staff/${id}`, data, true);
  }

  static async activateStaff(id: string): Promise<StaffData> {
    return ApiClient.patch<StaffData>(`/admin/staff/${id}/status?status=ACTIVATE`, {}, true);
  }

  static async deactivateStaff(id: string): Promise<StaffData> {
    return ApiClient.patch<StaffData>(`/admin/staff/${id}/status?status=DEACTIVATE`, {}, true);
  }

  // Helper methods for onboarding flow

  // Check if user has completed onboarding
  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const status = await this.getOnboardingStatus();
      return status.completionPercentage === 100;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  // Get current onboarding progress
  static async getOnboardingProgress(): Promise<{
    currentStep: string;
    completionPercentage: number;
    nextStep?: string;
  }> {
    try {
      const [status, nextStep] = await Promise.all([
        this.getOnboardingStatus(),
        this.getNextStep(),
      ]);

      return {
        currentStep: nextStep.step,
        completionPercentage: status.completionPercentage,
        nextStep: nextStep.step === 'COMPLETED' ? undefined : nextStep.step,
      };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return {
        currentStep: 'GARAGE_REGISTRATION',
        completionPercentage: 0,
      };
    }
  }

  // Validate step completion
  static async validateStepCompletion(step: string): Promise<{
    isValid: boolean;
    message?: string;
    missingFields?: string[];
  }> {
    try {
      const status = await this.getOnboardingStatus();
      
      switch (step) {
        case 'GARAGE_REGISTRATION':
          return {
            isValid: status.hasGarage && status.hasAddress,
            message: status.hasGarage && status.hasAddress ? undefined : 'Please complete garage and address details',
            missingFields: [
              ...(status.hasGarage ? [] : ['garage']),
              ...(status.hasAddress ? [] : ['address']),
            ],
          };
        
        case 'PAYMENT_CONFIGURATION':
          return {
            isValid: status.hasPaymentMethods,
            message: status.hasPaymentMethods ? undefined : 'Please configure at least one payment method',
            missingFields: status.hasPaymentMethods ? [] : ['payment methods'],
          };
        
        case 'STAFF_REGISTRATION':
          return {
            isValid: status.hasStaff,
            message: status.hasStaff ? undefined : 'Please add at least one staff member',
            missingFields: status.hasStaff ? [] : ['staff'],
          };
        
        default:
          return { isValid: true };
      }
    } catch (error) {
      console.error('Error validating step completion:', error);
      return {
        isValid: false,
        message: 'Unable to validate step completion',
      };
    }
  }
}
