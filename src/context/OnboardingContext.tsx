import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  OnboardingData, 
  OnboardingStep, 
  OnboardingStepConfig,
  UserData,
  GarageData,
  AddressData,
  PaymentMethodData,
  StaffData
} from '../types/onboarding';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  totalSteps: number;
  onboardingData: OnboardingData;
  isComplete: boolean;
  stepConfigs: OnboardingStepConfig[];
  setCurrentStep: (step: OnboardingStep) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  updateUserData: (userData: Partial<UserData>) => void;
  updateGarageData: (garageData: Partial<GarageData>) => void;
  updateAddressData: (addressData: Partial<AddressData>) => void;
  updatePaymentMethods: (paymentMethods: PaymentMethodData[]) => void;
  updateStaffData: (staffData: StaffData[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canProceedToNextStep: () => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const INITIAL_ONBOARDING_DATA: OnboardingData = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
  },
  garage: {
    garageName: '',
    businessRegistrationNumber: '',
    gstNumber: '',
    logoUrl: '',
    websiteUrl: '',
    businessHours: '',
    hasBranch: false,
  },
  address: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  paymentMethods: [],
  staff: [],
};

const STEP_CONFIGS: OnboardingStepConfig[] = [
  {
    step: 'WELCOME',
    title: 'Welcome to PitStop',
    description: 'Let\'s get your garage set up',
    isRequired: true,
    isCompleted: false,
  },
  {
    step: 'GARAGE_REGISTRATION',
    title: 'Garage Details',
    description: 'Tell us about your garage',
    isRequired: true,
    isCompleted: false,
  },
  {
    step: 'PAYMENT_CONFIGURATION',
    title: 'Payment Methods',
    description: 'Set up payment options',
    isRequired: true,
    isCompleted: false,
  },
  {
    step: 'STAFF_REGISTRATION',
    title: 'Staff Management',
    description: 'Add your team members',
    isRequired: true,
    isCompleted: false,
  },
  {
    step: 'COMPLETE',
    title: 'Setup Complete',
    description: 'You\'re all set!',
    isRequired: true,
    isCompleted: false,
  },
];

const STEP_ORDER: OnboardingStep[] = [
  'WELCOME',
  'GARAGE_REGISTRATION',
  'PAYMENT_CONFIGURATION',
  'STAFF_REGISTRATION',
  'COMPLETE',
];

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStepState] = useState<OnboardingStep>('WELCOME');
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = STEP_ORDER.length;

  const updateStepConfig = useCallback((step: OnboardingStep, updates: Partial<OnboardingStepConfig>) => {
    // This would update the step configuration if needed
    // For now, we'll handle completion logic in the step functions
  }, []);

  const setCurrentStep = useCallback((step: OnboardingStep) => {
    setCurrentStepState(step);
  }, []);

  const updateOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setOnboardingDataState(prev => ({ ...prev, ...data }));
  }, []);

  const updateUserData = useCallback((userData: Partial<UserData>) => {
    setOnboardingDataState(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
  }, []);

  const updateGarageData = useCallback((garageData: Partial<GarageData>) => {
    setOnboardingDataState(prev => ({
      ...prev,
      garage: { ...prev.garage, ...garageData }
    }));
  }, []);

  const updateAddressData = useCallback((addressData: Partial<AddressData>) => {
    setOnboardingDataState(prev => ({
      ...prev,
      address: { ...prev.address, ...addressData }
    }));
  }, []);

  const updatePaymentMethods = useCallback((paymentMethods: PaymentMethodData[]) => {
    setOnboardingDataState(prev => ({
      ...prev,
      paymentMethods
    }));
  }, []);

  const updateStaffData = useCallback((staffData: StaffData[]) => {
    setOnboardingDataState(prev => ({
      ...prev,
      staff: staffData
    }));
  }, []);

  const canProceedToNextStep = useCallback(() => {
    switch (currentStep) {
      case 'WELCOME':
        return true;
      case 'GARAGE_REGISTRATION':
        return !!(
          onboardingData.garage.garageName &&
          onboardingData.garage.businessHours &&
          onboardingData.address.addressLine1 &&
          onboardingData.address.city &&
          onboardingData.address.state &&
          onboardingData.address.pincode
        );
      case 'PAYMENT_CONFIGURATION':
        return onboardingData.paymentMethods.length > 0;
      case 'STAFF_REGISTRATION':
        return onboardingData.staff.length > 0;
      case 'COMPLETE':
        return true;
      default:
        return false;
    }
  }, [currentStep, onboardingData]);

  const goToNextStep = useCallback(() => {
    if (!canProceedToNextStep()) return;

    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      setCurrentStepState(nextStep);
    }
  }, [currentStep, canProceedToNextStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = STEP_ORDER[currentIndex - 1];
      setCurrentStepState(previousStep);
    }
  }, [currentStep]);

  const completeOnboarding = useCallback(() => {
    setIsComplete(true);
    setCurrentStepState('COMPLETE');
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentStepState('WELCOME');
    setOnboardingDataState(INITIAL_ONBOARDING_DATA);
    setIsComplete(false);
  }, []);

  const stepConfigs = STEP_CONFIGS.map(config => ({
    ...config,
    isCompleted: STEP_ORDER.indexOf(config.step) < STEP_ORDER.indexOf(currentStep),
  }));

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    onboardingData,
    isComplete,
    stepConfigs,
    setCurrentStep,
    updateOnboardingData,
    updateUserData,
    updateGarageData,
    updateAddressData,
    updatePaymentMethods,
    updateStaffData,
    completeOnboarding,
    resetOnboarding,
    goToNextStep,
    goToPreviousStep,
    canProceedToNextStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
