import React, { useState, useEffect } from "react";
import {
  FaLock,
  FaArrowRight,
  FaQuestionCircle,
  FaUser,
  FaUtensils,
  FaSpinner,
  FaCheck,
  FaFingerprint,
  FaShieldAlt,
  FaUserCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdSecurity, MdPerson } from "react-icons/md";
import { BiScan } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// WebAuthn Helper Functions (Unchanged)
const WebAuthnHelper = {
  isSupported: () => !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get),
  stringToArrayBuffer: (str) => new TextEncoder().encode(str),
  arrayBufferToBase64: (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  },
  base64ToArrayBuffer: (base64) => {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  },
  generateChallenge: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return array;
  },
  registerBiometric: async (username, userDisplayName) => {
    try {
      const challenge = WebAuthnHelper.generateChallenge();
      const userId = WebAuthnHelper.stringToArrayBuffer(username);
      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "Igifu Food App", id: window.location.hostname },
        user: { id: userId, name: username, displayName: userDisplayName },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "required", requireResidentKey: true },
        timeout: 60000,
        attestation: "direct"
      };
      const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
      const credentialData = {
        credentialId: WebAuthnHelper.arrayBufferToBase64(credential.rawId),
        publicKey: WebAuthnHelper.arrayBufferToBase64(credential.response.publicKey),
        username,
        createdAt: new Date().toISOString()
      };
      const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
      storedCredentials[username] = credentialData;
      localStorage.setItem('biometricCredentials', JSON.stringify(storedCredentials));
      return { success: true, credential: credentialData };
    } catch (error) {
      console.error('Biometric registration error:', error);
      return { success: false, error: error.message };
    }
  },
  authenticateBiometric: async (username) => {
    try {
      const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
      const userCredential = storedCredentials[username];
      if (!userCredential) throw new Error('No biometric credential found for this user');
      const challenge = WebAuthnHelper.generateChallenge();
      const publicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: WebAuthnHelper.base64ToArrayBuffer(userCredential.credentialId),
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: "required",
        timeout: 60000,
      };
      const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });
      if (assertion) return { success: true, assertion };
      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, error: error.message };
    }
  },
  hasBiometricRegistered: (username) => {
    const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
    return !!storedCredentials[username];
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    pin: "",
    rememberMe: false,
    role: "student", // Default role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isAuthenticatingBiometric, setIsAuthenticatingBiometric] = useState(false);

  // Check biometric availability on component mount
  useEffect(() => {
    const checkBiometric = async () => {
      if (WebAuthnHelper.isSupported()) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricAvailable(false);
        }
      }
    };
    checkBiometric();
  }, []);

  // Check if user has biometric registered when username changes
  useEffect(() => {
    if (formData.username) {
      const hasRegistered = WebAuthnHelper.hasBiometricRegistered(formData.username);
      setBiometricRegistered(hasRegistered);
    } else {
      setBiometricRegistered(false);
    }
  }, [formData.username]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    setIsAuthenticatingBiometric(true);
    toast.loading("Authenticating with biometric...", { id: "biometric-auth" });

    const result = await WebAuthnHelper.authenticateBiometric(formData.username);
    setIsAuthenticatingBiometric(false);
    
    if (result.success) {
      toast.success("Biometric authentication successful!", { id: "biometric-auth" });
      return true;
    } else {
      toast.error(`Biometric authentication failed: ${result.error}`, { id: "biometric-auth" });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginSuccess(false);

    try {
        let isSuccess = false;
        let path = "/";

        // Fallback to PIN authentication
        // Simulate PIN check (replace with actual API call)
        if (formData.role === "student" && formData.pin === "student") {
            isSuccess = true;
            path = "/igifu-dashboard";
        } else if (formData.role === "restaurant" && formData.pin === "restaurent") {
            isSuccess = true;
            path = "/restaurentdashboard";
        } else {
            toast.error("Invalid credentials. Please try again.");
        }

        if (isSuccess) {
            setLoginSuccess(true);
            toast.success("Welcome back! Redirecting to your dashboard...");
            setTimeout(() => {
                navigate(path);
            }, 2000);
        }
    } catch (error) {
        console.error('Login error:', error);
        toast.error("An error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  // Quick biometric login button
  const handleQuickBiometricLogin = async () => {
    if (!formData.username) {
      toast.error("Please enter your username first");
      return;
    }

    const success = await handleBiometricLogin();
    if (success) {
      setLoginSuccess(true);
      const path = formData.role === "student" ? "/igifu-dashboard" : "/restaurentdashboard";
      toast.success("Authentication successful! Redirecting...");
      setTimeout(() => {
        navigate(path);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
      >
        <span className="mr-2">←</span> Back to Home
      </button>

      {/* Animated Header */}
      <div className="text-center mt-12 form-container">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full animate-bounce-slow">
            <FaUserCheck className="text-blue-600 text-3xl" />
          </div>
        </div>
        <h4 className="text-3xl font-bold mb-2 text-gray-800">
          Welcome Back!
        </h4>
        <p className="text-gray-600 text-sm">
          Please log in to access your account.
        </p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mt-6 bg-white p-8 rounded-2xl shadow-2xl space-y-5 form-container"
      >
        {/* Role Selector */}
        <div className="relative">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="flex rounded-full border-2 border-gray-300 p-1">
                <button type="button" onClick={() => setFormData({...formData, role: 'student'})} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${formData.role === 'student' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'}`}>
                    <FaUser /> Student
                </button>
                <button type="button" onClick={() => setFormData({...formData, role: 'restaurant'})} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${formData.role === 'restaurant' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600'}`}>
                    <FaUtensils /> Restaurant
                </button>
            </div>
        </div>

        {/* Username Field */}
        <div className="relative group">
            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder={formData.role === 'student' ? 'Username' : 'Restaurant Name'}
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-10 py-3 rounded-full border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        {/* Biometric Quick Login */}
        {biometricRegistered && biometricAvailable && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl border-2 border-green-200">
            <button
              type="button"
              onClick={handleQuickBiometricLogin}
              disabled={isAuthenticatingBiometric}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              {isAuthenticatingBiometric ? (
                <>
                  <BiScan className="text-blue-600 text-2xl animate-pulse" />
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
              Or enter your PIN below
            </p>
          </div>
        )}

        {/* PIN Field */}
        <div className="relative group">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Enter your PIN"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-10 py-3 rounded-full border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
            required={!biometricRegistered}
          />
          <div className="group relative inline-block">
            <FaQuestionCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 cursor-help" />
            <div className="invisible group-hover:visible absolute right-0 top-8 bg-gray-800 text-white text-xs rounded-lg p-2 w-48 z-10">
              Enter the PIN you created during signup.
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              Remember me
            </span>
          </label>
          <a href="/forgot-pin" className="text-blue-600 text-sm hover:underline">
            Forgot PIN?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || loginSuccess || isAuthenticatingBiometric}
          className={`w-full py-3 rounded-full font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg
            ${loginSuccess ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"} 
            ${!isLoading && !loginSuccess && !isAuthenticatingBiometric ? "hover:from-blue-600 hover:to-indigo-700" : ""}
            ${isLoading || loginSuccess || isAuthenticatingBiometric ? "cursor-not-allowed opacity-90" : ""}`}
        >
          {isLoading || isAuthenticatingBiometric ? (
            <>
              <FaSpinner className="animate-spin text-xl mr-2" />
              <span>{isAuthenticatingBiometric ? "Authenticating..." : "Processing..."}</span>
            </>
          ) : loginSuccess ? (
            <>
              <FaCheck className="text-xl mr-2 animate-bounce" />
              <span>Success! Redirecting...</span>
            </>
          ) : (
            <span className="flex items-center">
              <FaUserCheck className="mr-2" /> Log In
            </span>
          )}
        </button>

        {/* Security Info */}
        <div className="flex items-center justify-center text-gray-500 text-xs pt-2">
          <MdSecurity className="mr-1" />
          <span>Your connection is secure</span>
        </div>
      </form>

      {/* Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        .form-container { animation: slide-up 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default LoginPage;