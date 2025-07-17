import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GarageApi, AuthResponse, ForgotPasswordRequest, OTPVerificationRequest, ResetPasswordRequest, UpdateProfileRequest } from '../api/garageApi';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['userInfo'] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  // OTP methods
  forgotPassword: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (phoneNumber: string, otpCode: string, type: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (phoneNumber: string, otpCode: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  sendLoginOTP: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOTP: (phoneNumber: string, otpCode: string) => Promise<{ success: boolean; error?: string }>;
  // Change password method
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  // Update profile method
  updateProfile: (profileData: UpdateProfileRequest) => Promise<{ success: boolean; error?: string; userInfo?: AuthResponse['userInfo'] }>;
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
      const response = await GarageApi.login({ email, password });
      
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
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
      const response = await GarageApi.register(userData);
      
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
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
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // OTP methods
  const forgotPassword = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.forgotPassword({ phoneNumber });
      
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

  const verifyOTP = async (phoneNumber: string, otpCode: string, type: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.verifyOTP({ phoneNumber, otpCode, type });
      
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

  const resetPassword = async (phoneNumber: string, otpCode: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.resetPassword({ phoneNumber, otpCode, newPassword, confirmPassword });
      
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

  const sendLoginOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.sendLoginOTP({ phoneNumber });
      
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

  const loginWithOTP = async (phoneNumber: string, otpCode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await GarageApi.loginWithOTP({ phoneNumber, otpCode, type: 'LOGIN_OTP' });
      
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.userInfo));
        
        setToken(response.token);
        setUser(response.userInfo);
        setIsAuthenticated(true);
        return { success: true };
      } else {
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
      const response = await GarageApi.changePassword({ currentPassword, newPassword, confirmPassword });
      
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
      const response = await GarageApi.updateProfile(profileData);
      
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 