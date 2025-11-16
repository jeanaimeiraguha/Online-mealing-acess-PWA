import React, { useState } from 'react';
import { SignUpForm } from './SignUpForm';
import { EmailVerification } from './EmailVerification';
import { BiometricPrompt } from './BiometricPrompt';
import { LoginForm } from './LoginForm';
import { RestaurantRequest } from './RestaurantRequest';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpFormData, EmailVerificationData } from '@/types';
import { AuthAPI } from '@/utils/authApi';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

type AuthStep = 'role-selection' | 'signup' | 'email-verification' | 'biometric-setup' | 'login' | 'dashboard';

export const Auth: React.FC = () => {
  const { signUp, verifyEmail, registerBiometric, login, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<AuthStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<'student' | 'restaurant'>('student');
  const [pendingUserData, setPendingUserData] = useState<any>(null);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Handle role selection
  const handleRoleSelection = (role: 'student' | 'restaurant') => {
    setSelectedRole(role);
    setCurrentStep('signup');
  };

  // Handle sign up
  const handleSignUp = async (userData: SignUpFormData) => {
    // For restaurant requests, we don't use this function
    if (selectedRole === 'restaurant') {
      return;
    }

    const success = await signUp(userData);
    if (success) {
      setPendingUserData(userData);
      setVerificationEmail(userData.email);
      
      // Send verification email
      const emailResponse = await AuthAPI.sendEmailVerificationCode(userData.email);
      if (emailResponse.success) {
        setCurrentStep('email-verification');
        toast.success('Verification code sent to your email!');
      } else {
        toast.error(emailResponse.error || 'Failed to send verification code');
      }
    }
  };

  // Handle email verification
  const handleEmailVerification = async (data: EmailVerificationData) => {
    const success = await verifyEmail(data);
    if (success) {
      setCurrentStep('biometric-setup');
    }
  };

  // Handle resend code
  const handleResendCode = async (email: string): Promise<boolean> => {
    const response = await AuthAPI.sendEmailVerificationCode(email);
    if (response.success) {
      toast.success('New verification code sent!');
      return true;
    } else {
      toast.error(response.error || 'Failed to resend code');
      return false;
    }
  };

  // Handle biometric/PIN setup
  const handleBiometricComplete = async (biometricRegistered: boolean) => {
    if (biometricRegistered && pendingUserData) {
      await registerBiometric({
        username: pendingUserData.username,
        displayName: `${selectedRole === 'student' ? 'Student' : 'Restaurant'}: ${pendingUserData.username}`,
      });
    }
    
    // Complete registration and go to login
    toast.success('Account setup complete! Please sign in.');
    setCurrentStep('login');
    setPendingUserData(null);
  };

  // Handle biometric skip
  const handleBiometricSkip = () => {
    toast.success('Account setup complete! Please sign in.');
    setCurrentStep('login');
    setPendingUserData(null);
  };

  // Handle login
  const handleLogin = async (credentials: any) => {
    const success = await login(credentials);
    if (success) {
      setCurrentStep('dashboard');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    switch (currentStep) {
      case 'signup':
        setCurrentStep('role-selection');
        setPendingUserData(null);
        break;
      case 'email-verification':
        setCurrentStep('signup');
        setVerificationEmail('');
        break;
      case 'biometric-setup':
        setCurrentStep('email-verification');
        break;
      case 'login':
        setCurrentStep('role-selection');
        break;
      default:
        setCurrentStep('role-selection');
    }
  };

  // Handle restaurant request submission completion
  const handleRestaurantRequestComplete = () => {
    // For restaurant requests, show success and redirect to role selection
    setCurrentStep('role-selection');
    toast.success('Request submitted! Our team will contact you soon.');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'role-selection':
        return <RoleSelection onRoleSelect={handleRoleSelection} />;
      
      case 'signup':
        return selectedRole === 'restaurant' ? (
          <RestaurantRequest
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            onComplete={handleRestaurantRequestComplete}
          />
        ) : (
          <SignUpForm
            onSubmit={handleSignUp}
            isLoading={isLoading}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification
            email={verificationEmail}
            onVerify={handleEmailVerification}
            onResendCode={handleResendCode}
            isLoading={isLoading}
            onBack={handleBack}
          />
        );
      
      case 'biometric-setup':
        return (
          <BiometricPrompt
            username={pendingUserData?.username || ''}
            displayName={`${selectedRole === 'student' ? 'Student' : 'Restaurant'}: ${pendingUserData?.username || ''}`}
            onComplete={handleBiometricComplete}
            onSkip={handleBiometricSkip}
          />
        );
      
      case 'login':
        return (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />
        );
      
      case 'dashboard':
        return <Dashboard userRole={selectedRole} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6">
      <Toaster position="top-center" />
      
      {/* Back Button */}
      {currentStep !== 'role-selection' && currentStep !== 'dashboard' && (
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="absolute top-4 left-4 bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center shadow-lg"
        >
          <span className="mr-2">←</span> Back
        </button>
      )}

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto px-4">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

// Role Selection Component
const RoleSelection: React.FC<{ onRoleSelect: (role: 'student' | 'restaurant') => void }> = ({ onRoleSelect }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to YouWare</h2>
        <p className="text-gray-600 text-lg">Choose how you want to join us</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onRoleSelect('student')}
          className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 transform group-hover:rotate-12">
              <svg className="text-blue-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-800">I'm a Student</h3>
              <p className="text-gray-500 text-sm">Order food from restaurants and manage your preferences</p>
            </div>
          </div>
          <svg className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => onRoleSelect('restaurant')}
          className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 transform group-hover:rotate-12">
              <svg className="text-green-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-800">I'm a Restaurant Owner</h3>
              <p className="text-gray-500 text-sm">Register your restaurant and manage orders</p>
            </div>
          </div>
          <svg className="text-gray-400 group-hover:text-green-600 transition-all transform group-hover:translate-x-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Dashboard Component (placeholder)
const Dashboard: React.FC<{ userRole: 'student' | 'restaurant' }> = ({ userRole }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl text-center">
      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="text-green-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard!</h2>
      <p className="text-gray-600 mb-6">
        You are now logged in as a {userRole}. This is where your main application would be.
      </p>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">Account Status</h3>
          <p className="text-sm text-blue-700">✅ Email verified</p>
          <p className="text-sm text-blue-700">✅ Account created</p>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
      >
        Logout
      </button>
    </div>
  );
};