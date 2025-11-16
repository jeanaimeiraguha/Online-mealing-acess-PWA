import React, { useState, useEffect } from 'react';
import { FaFingerprint, FaShieldAlt, FaKey, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { WebAuthnHelper } from '@/utils/webauthn';
import { BiometricRegistrationData } from '@/types';
import toast from 'react-hot-toast';

interface BiometricPromptProps {
  username: string;
  displayName: string;
  onComplete: (biometricRegistered: boolean) => void;
  onSkip: () => void;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  username,
  displayName,
  onComplete,
  onSkip,
}) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'biometric' | 'pin' | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    // Check if biometric is available
    WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  const handleBiometricRegistration = async () => {
    setIsRegistering(true);
    
    try {
      const result = await WebAuthnHelper.registerBiometric(username, displayName);
      
      if (result.success) {
        toast.success('Biometric authentication enabled successfully!', {
          icon: '🔐',
          duration: 3000,
        });
        onComplete(true);
      } else {
        toast.error(`Failed to setup biometric: ${result.error}`, {
          duration: 4000,
        });
        setIsRegistering(false);
      }
    } catch (error) {
      toast.error('An error occurred during biometric registration');
      setIsRegistering(false);
    }
  };

  const handlePinSetup = () => {
    if (pin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }
    
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    
    // Store PIN for demo purposes
    const userPins = JSON.parse(localStorage.getItem('userPins') || '{}');
    userPins[username] = pin;
    localStorage.setItem('userPins', JSON.stringify(userPins));
    
    toast.success('PIN setup complete!', {
      icon: '🔑',
      duration: 2000,
    });
    
    onComplete(false); // Not biometric, but completed
  };

  if (selectedMethod === 'pin') {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKey className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a PIN</h2>
          <p className="text-gray-600 text-sm">
            Set up a secure PIN for quick access
          </p>
        </div>

        <div className="space-y-4">
          {/* PIN Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create PIN (minimum 4 digits)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(value);
                if (pinError) setPinError('');
              }}
              placeholder="Enter PIN"
              className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 ${
                pinError ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={6}
              autoFocus
            />
          </div>

          {/* Confirm PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm PIN
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setConfirmPin(value);
                if (pinError) setPinError('');
              }}
              placeholder="Confirm PIN"
              className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 ${
                pinError ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={6}
            />
            {pinError && (
              <p className="text-red-500 text-xs mt-1">{pinError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedMethod(null)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handlePinSetup}
              disabled={pin.length < 4 || confirmPin.length < 4}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                pin.length < 4 || confirmPin.length < 4
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              <FaCheck />
              <span>Complete Setup</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaShieldAlt className="text-purple-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Your Account</h2>
        <p className="text-gray-600 text-sm">
          Choose your preferred authentication method
        </p>
      </div>

      {/* Biometric Option */}
      {biometricAvailable && (
        <div 
          onClick={() => setSelectedMethod('biometric')}
          className="mb-4 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
              <FaFingerprint className="text-purple-600 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Biometric Authentication</h3>
              <p className="text-sm text-gray-600">
                Use your fingerprint, Face ID, or Windows Hello
              </p>
            </div>
            <div className="text-purple-600">
              <FaCheck className="opacity-60" />
            </div>
          </div>
        </div>
      )}

      {/* PIN Option */}
      <div 
        onClick={() => setSelectedMethod('pin')}
        className="mb-6 p-4 rounded-xl border-2 border-green-200 hover:border-green-300 cursor-pointer transition-all group"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
            <FaKey className="text-green-600 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">PIN Authentication</h3>
            <p className="text-sm text-gray-600">
              Create a secure 4-6 digit PIN
            </p>
          </div>
          <div className="text-green-600">
            <FaCheck className="opacity-60" />
          </div>
        </div>
      </div>

      {/* Selected Method Display */}
      {selectedMethod === 'biometric' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaFingerprint className="text-purple-600" />
              <span className="font-medium text-purple-800">Biometric Setup</span>
            </div>
            <button
              onClick={() => setSelectedMethod(null)}
              className="text-purple-600 hover:text-purple-800"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Click the button below to set up biometric authentication using your device's built-in security features.
          </p>
          <button
            onClick={handleBiometricRegistration}
            disabled={isRegistering}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              isRegistering
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            }`}
          >
            {isRegistering ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <FaFingerprint />
                <span>Enable Biometric Authentication</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Skip Option */}
      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          Skip for now
        </button>
        <p className="text-xs text-gray-400 mt-1">
          You can enable security features later in settings
        </p>
      </div>

      {/* Security Info */}
      {!biometricAvailable && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> Biometric authentication requires HTTPS and a supported device (iOS, Android, or Windows with Hello enabled).
          </p>
        </div>
      )}
    </div>
  );
};