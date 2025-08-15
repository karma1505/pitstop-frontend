import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthService, 
  ProfileService, 
  OnboardingService,
  AddressService,
  PaymentMethodService,
  StaffService,
  GarageApi,
  AuthResponse, 
  ForgotPasswordRequest, 
  OTPVerificationRequest, 
  ResetPasswordRequest, 
  UpdateProfileRequest,
  OnboardingStatusResponse,
  NextStepResponse,
  CompleteOnboardingRequest,
  CreateGarageRequest,
  GarageResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
  CreatePaymentMethodRequest,
  PaymentMethodResponse,
  CreateStaffRequest,
  StaffResponse,
  Page,
} from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['userInfo'] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  // OTP methods
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, otpCode: string, type: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, otpCode: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  sendLoginOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOTP: (email: string, otpCode: string) => Promise<{ success: boolean; error?: string }>;
  // Change password method
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  // Update profile method
  updateProfile: (profileData: UpdateProfileRequest) => Promise<{ success: boolean; error?: string; userInfo?: AuthResponse['userInfo'] }>;
  
  // Onboarding state
  onboardingStatus: OnboardingStatusResponse | null;
  currentStep: string;
  completionPercentage: number;
  
  // Entity states
  garage: GarageResponse | null;
  addresses: AddressResponse[];
  paymentMethods: PaymentMethodResponse[];
  staff: StaffResponse[];
  
  // Onboarding methods
  getOnboardingStatus: () => Promise<void>;
  getNextStep: () => Promise<void>;
  completeOnboarding: (data: CompleteOnboardingRequest) => Promise<{ success: boolean; error?: string }>;
  
  // Entity methods
  createGarage: (data: CreateGarageRequest) => Promise<{ success: boolean; error?: string }>;
  createAddress: (data: CreateAddressRequest) => Promise<{ success: boolean; error?: string }>;
  createPaymentMethod: (data: CreatePaymentMethodRequest) => Promise<{ success: boolean; error?: string }>;
  createStaff: (data: CreateStaffRequest) => Promise<{ success: boolean; error?: string }>;
  
  // Update methods
  updateGarage: (id: string, data: CreateGarageRequest) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (id: string, data: UpdateAddressRequest) => Promise<{ success: boolean; error?: string }>;
  updateStaff: (id: string, data: CreateStaffRequest) => Promise<{ success: boolean; error?: string }>;
  updateStaffStatus: (id: string, status: string) => Promise<{ success: boolean; error?: string }>;
  
  // Delete methods
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  deactivatePaymentMethod: (id: string) => Promise<{ success: boolean; error?: string }>;
  activatePaymentMethod: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Fetch methods
  fetchAddresses: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchStaff: (page?: number, size?: number, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['userInfo'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Onboarding state
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatusResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  
  // Entity states
  const [garage, setGarage] = useState<GarageResponse | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [staff, setStaff] = useState<StaffResponse[]>([]);

  useEffect(() => {
    // Check for stored authentication data on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Fetch onboarding status and entities if authenticated
        await getOnboardingStatus();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
        
        // Fetch onboarding status after login
        await getOnboardingStatus();
        
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
        
        // Fetch onboarding status after registration
        await getOnboardingStatus();
        
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear onboarding and entity states
      setOnboardingStatus(null);
      setCurrentStep('');
      setCompletionPercentage(0);
      setGarage(null);
      setAddresses([]);
      setPaymentMethods([]);
      setStaff([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // OTP methods
  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AuthService.forgotPassword({ email });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otpCode: string, type: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('=== Frontend Debug ===');
      console.log('Sending email:', email);
      console.log('Sending OTP code:', otpCode);
      console.log('Sending type:', type);
      
      setLoading(true);
      const response = await AuthService.verifyOTP({ email, otpCode, type });
      
      console.log('API Response:', response);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, otpCode: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AuthService.resetPassword({ email, otpCode, newPassword, confirmPassword });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const sendLoginOTP = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AuthService.sendLoginOTP({ email });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Send login OTP error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithOTP = async (email: string, otpCode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('=== Frontend loginWithOTP Debug ===');
      console.log('Email:', email);
      console.log('OTP Code:', otpCode);
      
      setLoading(true);
      const response = await AuthService.loginWithOTP({ email, otpCode, type: 'LOGIN_OTP' });
      
      console.log('API Response:', response);
      console.log('Response success:', response.success);
      console.log('Response token:', response.token ? 'Present' : 'Null');
      console.log('Response userInfo:', response.userInfo ? 'Present' : 'Null');
      
      if (response.success) {
        console.log('Storing authentication data...');
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        console.log('Setting authentication state...');
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
        
        // Fetch onboarding status after login
        await getOnboardingStatus();
        
        console.log('Authentication successful!');
        return { success: true };
      } else {
        console.log('Authentication failed:', response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login with OTP error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Change password method
  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await ProfileService.changePassword({ currentPassword, newPassword, confirmPassword });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Update profile method
  const updateProfile = async (profileData: UpdateProfileRequest): Promise<{ success: boolean; error?: string; userInfo?: AuthResponse['userInfo'] }> => {
    try {
      setLoading(true);
      const response = await ProfileService.updateProfile(profileData);
      
      if (response.success) {
        // Update stored user info
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        setUser(response.userInfo);
        
        return { success: true, userInfo: response.userInfo };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Onboarding methods
  const getOnboardingStatus = async (): Promise<void> => {
    try {
      const status = await OnboardingService.getOnboardingStatus();
      setOnboardingStatus(status);
      setCompletionPercentage(status.completionPercentage);
      
      // Determine current step based on completion
      if (status.completionPercentage === 100) {
        setCurrentStep('COMPLETE');
      } else if (!status.hasGarage) {
        setCurrentStep('GARAGE_SETUP');
      } else if (!status.hasAddress) {
        setCurrentStep('ADDRESS_SETUP');
      } else if (!status.hasPaymentMethods) {
        setCurrentStep('PAYMENT_SETUP');
      } else if (!status.hasStaff) {
        setCurrentStep('STAFF_SETUP');
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
    }
  };

  const getNextStep = async (): Promise<void> => {
    try {
      const nextStep = await OnboardingService.getNextStep();
      setCurrentStep(nextStep.step);
    } catch (error) {
      console.error('Error fetching next step:', error);
    }
  };

  const completeOnboarding = async (data: CompleteOnboardingRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await OnboardingService.completeOnboarding(data);
      
      if (response.success) {
        await getOnboardingStatus();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Complete onboarding error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Entity methods
  const createGarage = async (data: CreateGarageRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.createGarage(data);
      setGarage(response);
      await getOnboardingStatus();
      return { success: true };
    } catch (error) {
      console.error('Create garage error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (data: CreateAddressRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AddressService.createAddress(data);
      setAddresses(prev => [...prev, response]);
      await getOnboardingStatus();
      return { success: true };
    } catch (error) {
      console.error('Create address error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const createPaymentMethod = async (data: CreatePaymentMethodRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await PaymentMethodService.createPaymentMethod(data);
      setPaymentMethods(prev => [...prev, response]);
      await getOnboardingStatus();
      return { success: true };
    } catch (error) {
      console.error('Create payment method error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (data: CreateStaffRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await StaffService.createStaff(data);
      setStaff(prev => [...prev, response]);
      await getOnboardingStatus();
      return { success: true };
    } catch (error) {
      console.error('Create staff error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Update methods
  const updateGarage = async (id: string, data: CreateGarageRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.updateGarage(id, data);
      setGarage(response);
      return { success: true };
    } catch (error) {
      console.error('Update garage error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string, data: UpdateAddressRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await AddressService.updateAddress(id, data);
      setAddresses(prev => prev.map(addr => addr.id === id ? response : addr));
      return { success: true };
    } catch (error) {
      console.error('Update address error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id: string, data: CreateStaffRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await StaffService.updateStaff(id, data);
      setStaff(prev => prev.map(s => s.id === id ? response : s));
      return { success: true };
    } catch (error) {
      console.error('Update staff error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (id: string, status: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await StaffService.updateStaffStatus(id, status);
      setStaff(prev => prev.map(s => s.id === id ? response : s));
      return { success: true };
    } catch (error) {
      console.error('Update staff status error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Delete methods
  const deleteAddress = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await AddressService.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      await getOnboardingStatus();
      return { success: true };
    } catch (error) {
      console.error('Delete address error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const deactivatePaymentMethod = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await PaymentMethodService.deactivatePaymentMethod(id);
      setPaymentMethods(prev => prev.map(pm => pm.id === id ? response : pm));
      return { success: true };
    } catch (error) {
      console.error('Deactivate payment method error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const activatePaymentMethod = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await PaymentMethodService.activatePaymentMethod(id);
      setPaymentMethods(prev => prev.map(pm => pm.id === id ? response : pm));
      return { success: true };
    } catch (error) {
      console.error('Activate payment method error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch methods
  const fetchAddresses = async (): Promise<void> => {
    try {
      const response = await AddressService.getMyAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const fetchPaymentMethods = async (): Promise<void> => {
    try {
      const response = await PaymentMethodService.getMyPaymentMethods();
      setPaymentMethods(response);
    } catch (error) {
      console.error('Fetch payment methods error:', error);
    }
  };

  const fetchStaff = async (page: number = 0, size: number = 10, role?: string): Promise<void> => {
    try {
      const response = await StaffService.getAllStaff(page, size, role);
      setStaff(response.content);
    } catch (error) {
      console.error('Fetch staff error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    loading,
    forgotPassword,
    verifyOTP,
    resetPassword,
    sendLoginOTP,
    loginWithOTP,
    changePassword,
    updateProfile,
    onboardingStatus,
    currentStep,
    completionPercentage,
    garage,
    addresses,
    paymentMethods,
    staff,
    getOnboardingStatus,
    getNextStep,
    completeOnboarding,
    createGarage,
    createAddress,
    createPaymentMethod,
    createStaff,
    updateGarage,
    updateAddress,
    updateStaff,
    updateStaffStatus,
    deleteAddress,
    deactivatePaymentMethod,
    activatePaymentMethod,
    fetchAddresses,
    fetchPaymentMethods,
    fetchStaff,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 