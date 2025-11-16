import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, SignUpFormData, LoginFormData, EmailVerificationData } from '@/types';
import { AuthAPI } from '@/utils/authApi';
import { WebAuthnHelper } from '@/utils/webauthn';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const signUp = async (userData: SignUpFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Register user
      const response = await AuthAPI.registerUser(userData);
      if (!response.success) {
        toast.error(response.error || 'Registration failed');
        return false;
      }

      toast.success('Account created! Please verify your email.');
      return true;
    } catch (error) {
      toast.error('An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (data: EmailVerificationData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await AuthAPI.verifyEmailCode(data.email, data.code);
      if (!response.success) {
        toast.error(response.error || 'Email verification failed');
        return false;
      }

      // Update user email verification status
      const currentUser = AuthAPI.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, emailVerified: true };
        AuthAPI.setCurrentUser(updatedUser);
        setUser(updatedUser);
      }

      toast.success('Email verified successfully!');
      return true;
    } catch (error) {
      toast.error('An error occurred during email verification');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerBiometric = async (data: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await WebAuthnHelper.registerBiometric(data.username, data.displayName);
      if (!result.success) {
        toast.error(result.error || 'Biometric registration failed');
        return false;
      }

      // Update user biometric registration status
      const currentUser = AuthAPI.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, biometricRegistered: true };
        AuthAPI.setCurrentUser(updatedUser);
        setUser(updatedUser);
      }

      toast.success('Biometric authentication enabled!');
      return true;
    } catch (error) {
      toast.error('An error occurred during biometric registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For biometric login, we need to extract username from stored credentials
      if (credentials.useBiometric) {
        const response = await AuthAPI.loginUser({ 
          username: credentials.username, 
          useBiometric: true 
        });
        
        if (!response.success) {
          toast.error(response.error || 'Login failed');
          return false;
        }

        const userData = response.data;
        if (userData) {
          AuthAPI.setCurrentUser(userData);
          setUser(userData);
          setIsAuthenticated(true);
          toast.success('Welcome back!');
        }
        return true;
      }

      // Regular login
      const response = await AuthAPI.loginUser(credentials);
      if (!response.success) {
        toast.error(response.error || 'Login failed');
        return false;
      }

      const userData = response.data;
      if (userData) {
        AuthAPI.setCurrentUser(userData);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Welcome back!');
      }
      return true;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthAPI.clearCurrentUser();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      AuthAPI.setCurrentUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signUp,
    verifyEmail,
    registerBiometric,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};