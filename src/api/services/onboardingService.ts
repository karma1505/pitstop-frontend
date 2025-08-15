import { ApiClient } from '../client';
import {
  OnboardingStatusResponse,
  NextStepResponse,
  CompleteOnboardingRequest,
  OnboardingResponse,
} from '../types';

export class OnboardingService {
  static async getOnboardingStatus(): Promise<OnboardingStatusResponse> {
    return ApiClient.get<OnboardingStatusResponse>('/admin/onboarding/status', true);
  }

  static async getNextStep(): Promise<NextStepResponse> {
    return ApiClient.get<NextStepResponse>('/admin/onboarding/next-step', true);
  }

  static async completeOnboarding(data: CompleteOnboardingRequest): Promise<OnboardingResponse> {
    return ApiClient.post<OnboardingResponse>('/admin/onboarding/complete', data, true);
  }
}
