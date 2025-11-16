import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaSpinner, FaCheck, FaRedo } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';
import { EmailVerificationData } from '@/types';

interface EmailVerificationProps {
  email: string;
  onVerify: (data: EmailVerificationData) => Promise<boolean>;
  onResendCode: (email: string) => Promise<boolean>;
  isLoading: boolean;
  onBack: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerify,
  onResendCode,
  isLoading,
  onBack,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    const success = await onVerify({ email, code: verificationCode });
    if (!success) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setError('');
    setCountdown(60);
    setCanResend(false);
    
    const success = await onResendCode(email);
    if (success) {
      // Reset form
      setVerificationCode('');
    } else {
      setError('Failed to resend verification code. Please try again.');
      setCanResend(true);
      setCountdown(0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaEnvelope className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 text-sm">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-blue-600 font-semibold text-sm mt-1 break-all">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verification Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter verification code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            placeholder="123456"
            className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 transition-all ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || verificationCode.length !== 6}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading || verificationCode.length !== 6
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <HiCheckCircle />
              <span>Verify Email</span>
            </>
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-2 mx-auto"
            >
              <FaRedo />
              <span>Resend Code</span>
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend code in {countdown}s
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          ← Back to sign up
        </button>
      </form>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Having trouble?</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Check your spam/junk folder</li>
          <li>• Make sure you entered the correct email</li>
          <li>• Wait a few minutes for delivery</li>
          <li>• Contact support if you still don't receive it</li>
        </ul>
      </div>

      {/* Demo Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-xs text-yellow-800 text-center">
          <strong>Demo Mode:</strong> Use code <code className="bg-yellow-200 px-1 rounded">123456</code> or any 6-digit code to continue
        </p>
      </div>
    </div>
  );
};