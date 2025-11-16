import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSpinner, FaFingerprint, FaArrowRight } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { LoginFormData } from '@/types';
import { WebAuthnHelper } from '@/utils/webauthn';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSubmit: (credentials: LoginFormData) => Promise<boolean>;
  isLoading: boolean;
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  selectedRole,
  onRoleChange,
}) => {
  const [credentials, setCredentials] = useState<LoginFormData>({
    username: '',
    password: '',
    useBiometric: false,
  });

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check if biometric is available
    WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  useEffect(() => {
    // Check if user has biometric registered
    if (credentials.username) {
      setBiometricRegistered(WebAuthnHelper.hasBiometricRegistered(credentials.username));
    } else {
      setBiometricRegistered(false);
    }
  }, [credentials.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.useBiometric) {
      await handleBiometricLogin();
    } else {
      await onSubmit(credentials);
    }
  };

  const handleBiometricLogin = async () => {
    if (!credentials.username) {
      toast.error('Please enter your username first');
      return;
    }

    setIsAuthenticating(true);
    
    try {
      const result = await WebAuthnHelper.authenticateBiometric(credentials.username);
      
      if (result.success) {
        toast.success('Biometric authentication successful!');
        // Create login credentials without password for biometric login
        await onSubmit({ ...credentials, useBiometric: true });
      } else {
        toast.error(`Biometric authentication failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('An error occurred during authentication');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-sm">
          Sign in to your {selectedRole === 'student' ? 'student' : 'restaurant'} account
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onRoleChange('student')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
              selectedRole === 'student'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FaUser className={selectedRole === 'student' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="text-sm font-medium">Student</span>
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('restaurant')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
              selectedRole === 'restaurant'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FaUser className={selectedRole === 'restaurant' ? 'text-green-600' : 'text-gray-500'} />
            <span className="text-sm font-medium">Restaurant</span>
          </button>
        </div>
      </div>

      {/* Biometric Login */}
      {biometricAvailable && biometricRegistered && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <button
            type="button"
            onClick={() => setCredentials(prev => ({ ...prev, useBiometric: true }))}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            {isAuthenticating ? (
              <>
                <FaSpinner className="text-blue-600 text-2xl animate-pulse" />
                <span className="font-semibold text-gray-700">Scanning...</span>
              </>
            ) : (
              <>
                <FaFingerprint className="text-green-600 text-2xl" />
                <span className="font-semibold text-gray-700">Quick Login with Biometric</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Or enter your credentials below
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder={
                selectedRole === 'student' ? 'Username' : 'Restaurant name'
              }
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Password (only show if not using biometric) */}
        {!credentials.useBiometric && (
          <div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                required={!credentials.useBiometric}
              />
            </div>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Student: Password is "<code className="bg-blue-200 px-1 rounded">student</code>"<br />
                Restaurant: Password is "<code className="bg-blue-200 px-1 rounded">restaurant</code>"
              </p>
            </div>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
          }`}
        >
          {isLoading || isAuthenticating ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>
                {isAuthenticating ? 'Authenticating...' : 'Signing in...'}
              </span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <FaArrowRight />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-600">
          Forgot your password?{' '}
          <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
            Reset it here
          </a>
        </p>
        
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};