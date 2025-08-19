import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, ProfileService, AuthResponse, ForgotPasswordRequest, OTPVerificationRequest, ResetPasswordRequest, UpdateProfileRequest } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['userInfo'] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  // Add token validation method
  validateToken: () => Promise<{ isValid: boolean; error?: string }>;
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
        // Validate the token with the backend
        const validation = await validateTokenWithBackend(storedToken);
        
        if (validation.isValid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear stored data
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('auth_user');
          console.log('Invalid token found, cleared stored auth data');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // If there's an error, clear stored data to be safe
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
    } finally {
      setLoading(false);
    }
  };

  // Validate token with backend
  const validateTokenWithBackend = async (token: string): Promise<{ isValid: boolean; error?: string }> => {
    try {
      // Use a simple authenticated endpoint to validate the token
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.31.70:8080/api/v1'}/admin/onboarding/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { isValid: true };
      } else if (response.status === 401) {
        return { isValid: false, error: 'Token is invalid or expired' };
      } else {
        return { isValid: false, error: `Backend error: ${response.status}` };
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return { isValid: false, error: 'Backend is not accessible' };
    }
  };

  // Public method to validate current token
  const validateToken = async (): Promise<{ isValid: boolean; error?: string }> => {
    if (!token) {
      return { isValid: false, error: 'No token available' };
    }
    return validateTokenWithBackend(token);
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

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    loading,
    validateToken,
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