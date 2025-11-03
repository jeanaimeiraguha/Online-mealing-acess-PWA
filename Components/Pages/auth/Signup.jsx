import React, { useState, useEffect } from "react";
import {
  FaLock,
  FaArrowRight,
  FaQuestionCircle,
  FaUser,
  FaUtensils,
  FaSpinner,
  FaCheck,
  FaEnvelope,
  FaFingerprint,
  FaShieldAlt,
  FaUserCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { BiScan } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// import confetti from 'canvas-confetti';

// WebAuthn Helper Functions
const WebAuthnHelper = {
  // Check if WebAuthn is supported
  isSupported: () => {
    return !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get);
  },

  // Convert string to ArrayBuffer
  stringToArrayBuffer: (str) => {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  },

  // Convert ArrayBuffer to Base64
  arrayBufferToBase64: (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  },

  // Convert Base64 to ArrayBuffer
  base64ToArrayBuffer: (base64) => {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },

  // Generate random challenge
  generateChallenge: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return array;
  },

  // Register biometric credential
  registerBiometric: async (username, userDisplayName) => {
    try {
      const challenge = WebAuthnHelper.generateChallenge();
      const userId = WebAuthnHelper.stringToArrayBuffer(username);

      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "Igifu Food App",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: username,
          displayName: userDisplayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "required",
          requireResidentKey: true,
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      // Store credential data
      const credentialData = {
        credentialId: WebAuthnHelper.arrayBufferToBase64(credential.rawId),
        publicKey: WebAuthnHelper.arrayBufferToBase64(credential.response.publicKey),
        username: username,
        createdAt: new Date().toISOString()
      };

      // Store in localStorage (in production, send to server)
      const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
      storedCredentials[username] = credentialData;
      localStorage.setItem('biometricCredentials', JSON.stringify(storedCredentials));

      return { success: true, credential: credentialData };
    } catch (error) {
      console.error('Biometric registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Authenticate with biometric
  authenticateBiometric: async (username) => {
    try {
      const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
      const userCredential = storedCredentials[username];

      if (!userCredential) {
        throw new Error('No biometric credential found for this user');
      }

      const challenge = WebAuthnHelper.generateChallenge();
      
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        allowCredentials: [{
          id: WebAuthnHelper.base64ToArrayBuffer(userCredential.credentialId),
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: "required",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      // In production, verify this on the server
      if (assertion) {
        return { success: true, assertion };
      }
      
      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user has registered biometric
  hasBiometricRegistered: (username) => {
    const storedCredentials = JSON.parse(localStorage.getItem('biometricCredentials') || '{}');
    return !!storedCredentials[username];
  }
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("roleSelection");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    pin: "",
    confirmPin: "",
    rememberMe: false,
    enableBiometric: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isRegisteringBiometric, setIsRegisteringBiometric] = useState(false);
  const [isAuthenticatingBiometric, setIsAuthenticatingBiometric] = useState(false);
  
  const [fieldStatus, setFieldStatus] = useState({
    username: false,
    email: false,
    pin: false,
    confirmPin: false,
  });

  // Check biometric availability on component mount
  useEffect(() => {
    const checkBiometric = async () => {
      if (WebAuthnHelper.isSupported()) {
        try {
          // Check if platform authenticator is available
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
    if (isLogin && formData.username) {
      const hasRegistered = WebAuthnHelper.hasBiometricRegistered(formData.username);
      setBiometricRegistered(hasRegistered);
    }
  }, [formData.username, isLogin]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
    });
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep("form");
    setTimeout(() => {
      document.querySelector('.form-container')?.classList.add('slide-in');
    }, 100);
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("roleSelection");
    setSelectedRole("");
    setFormData({
      username: "",
      email: "",
      pin: "",
      confirmPin: "",
      rememberMe: false,
      enableBiometric: false,
    });
    setIsLogin(false);
    setRegistrationSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    if (name === 'email' && value) {
      setFieldStatus(prev => ({ ...prev, email: /\S+@\S+\.\S+/.test(value) }));
    }
    if (name === 'username' && value) {
      setFieldStatus(prev => ({ ...prev, username: value.length >= 3 }));
    }
    if (name === 'pin' && value) {
      setFieldStatus(prev => ({ ...prev, pin: value.length >= 4 }));
    }
    if (name === 'confirmPin' && value) {
      setFieldStatus(prev => ({ ...prev, confirmPin: value === formData.pin }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Handle biometric registration during signup
  const handleBiometricRegistration = async () => {
    setIsRegisteringBiometric(true);
    
    toast.loading("Setting up biometric authentication...", { id: "biometric-setup" });
    
    const result = await WebAuthnHelper.registerBiometric(
      formData.username,
      `${selectedRole === 'student' ? 'Student' : 'Restaurant'}: ${formData.username}`
    );
    
    setIsRegisteringBiometric(false);
    
    if (result.success) {
      toast.success("Biometric authentication enabled successfully!", { id: "biometric-setup" });
      setBiometricRegistered(true);
      return true;
    } else {
      toast.error(`Failed to setup biometric: ${result.error}`, { id: "biometric-setup" });
      return false;
    }
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
      if (isLogin) {
        // LOGIN FLOW
        let isSuccess = false;
        let path = "/";

        // Try biometric authentication first if available and registered
        if (biometricRegistered && biometricAvailable) {
          const biometricSuccess = await handleBiometricLogin();
          if (biometricSuccess) {
            isSuccess = true;
            path = selectedRole === "student" ? "/igifu-dashboard" : "/restaurentdashboard";
          }
        } 
        
        // Fall back to PIN authentication
        if (!isSuccess) {
          // Simulate PIN check (replace with actual API call)
          if (selectedRole === "student" && formData.pin === "student") {
            isSuccess = true;
            path = "/igifu-dashboard";
          } else if (selectedRole === "restaurant" && formData.pin === "restaurent") {
            isSuccess = true;
            path = "/restaurentdashboard";
          } else {
            toast.error("Invalid credentials. Please try again.");
          }
        }

        if (isSuccess) {
          setLoginSuccess(true);
          toast.success("Welcome back! Redirecting to your dashboard...");
          setTimeout(() => {
            navigate(path);
          }, 2000);
        }
      } else {
        // SIGNUP FLOW
        if (formData.pin !== formData.confirmPin) {
          toast.error("PINs do not match! Please re-enter.");
          setIsLoading(false);
          return;
        }

        if (!fieldStatus.email) {
          toast.error("Please enter a valid email address.");
          setIsLoading(false);
          return;
        }

        // Save user data (in production, send to server)
        const userData = {
          username: formData.username,
          email: formData.email,
          role: selectedRole,
          createdAt: new Date().toISOString()
        };
        
        // Store in localStorage (replace with API call)
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        users[formData.username] = userData;
        localStorage.setItem('users', JSON.stringify(users));

        // Setup biometric if enabled
        if (formData.enableBiometric && biometricAvailable) {
          const biometricSuccess = await handleBiometricRegistration();
          if (!biometricSuccess) {
            toast.warning("Account created but biometric setup failed. You can enable it later in settings.");
          }
        }

        // Show success animation
        setRegistrationSuccess(true);
        triggerConfetti();
        toast.success("🎉 Registration successful! Please login to continue.");
        
        // Switch to login after animation
        setTimeout(() => {
          setIsLogin(true);
          setRegistrationSuccess(false);
          setFormData({
            ...formData,
            pin: "",
            confirmPin: "",
            enableBiometric: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
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
      const path = selectedRole === "student" ? "/igifu-dashboard" : "/restaurentdashboard";
      toast.success("Authentication successful! Redirecting...");
      setTimeout(() => {
        navigate(path);
      }, 1500);
    }
  };

  // Role Selection Screen
  if (currentStep === "roleSelection") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
        >
          <span className="mr-2">←</span> Back
        </button>

        {/* Animated Header */}
        <div className="text-center mt-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-slide-down">
            Welcome to Igifu
          </h2>
          <p className="text-gray-600 text-lg animate-slide-up">
            Choose how you want to join us
          </p>
          {biometricAvailable && (
            <div className="mt-3 flex items-center justify-center text-green-600 animate-pulse">
              <FaFingerprint className="mr-2" />
              <span className="text-sm">Biometric authentication available</span>
            </div>
          )}
        </div>

        {/* Role Selection Cards */}
        <div className="w-full max-w-md mt-8 space-y-4 px-4">
          <button
            onClick={() => handleRoleSelection("student")}
            className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 transform group-hover:rotate-12">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  I'm a Student
                </h3>
                <p className="text-gray-500 text-sm">
                  Join to order food from restaurants
                </p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-2" />
          </button>

          <button
            onClick={() => handleRoleSelection("restaurant")}
            className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 transform group-hover:rotate-12">
                <FaUtensils className="text-green-600 text-2xl" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  I'm a Restaurant Owner
                </h3>
                <p className="text-gray-500 text-sm">
                  Register your restaurant with us
                </p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-green-600 transition-all transform group-hover:translate-x-2" />
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center text-gray-600">
          <MdSecurity className="mr-2 text-xl" />
          <span className="text-sm">Secured with end-to-end encryption</span>
        </div>
      </div>
    );
  }

  // Form Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={handleBackToRoleSelection}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
      >
        <span className="mr-2">←</span> Back to role selection
      </button>

      {/* Animated Header */}
      <div className="text-center mt-12 form-container">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full animate-bounce-slow">
            {selectedRole === "student" ? (
              <FaUser className="text-blue-600 text-3xl" />
            ) : (
              <FaUtensils className="text-green-600 text-3xl" />
            )}
          </div>
        </div>
        <h4 className="text-2xl font-bold mb-2">
          <button
            className={`mr-3 transition-all ${
              !isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <span className="text-gray-400">|</span>
          <button
            className={`ml-3 transition-all ${
              isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
        </h4>
        <p className="text-gray-600 text-sm">
          {isLogin
            ? `Welcome back, ${selectedRole === "student" ? "Student" : "Restaurant Owner"}!`
            : `Create your ${selectedRole === "student" ? "Student" : "Restaurant"} account`}
        </p>
      </div>

      {/* Enhanced Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mt-6 bg-white p-8 rounded-2xl shadow-2xl space-y-5 form-container"
      >
        {/* Registration Success Animation */}
        {registrationSuccess && (
          <div className="text-center py-8">
            <div className="success-checkmark mx-auto mb-4">
              <HiCheckCircle className="text-green-500 text-6xl animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        )}

        {!registrationSuccess && (
          <>
            {/* Username Field */}
            <div className="relative group">
              <MdPerson className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                fieldStatus.username && !isLogin ? 'text-green-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder={
                  isLogin 
                    ? (selectedRole === 'student' ? 'Username' : 'Restaurant Name')
                    : (selectedRole === 'student' ? 'Choose a username' : 'Restaurant Name')
                }
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  fieldStatus.username && !isLogin ? 'border-green-500' : 'border-gray-300'
                }`}
                required
              />
              {fieldStatus.username && !isLogin && (
                <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in" />
              )}
            </div>

            {/* Email Field (Sign up only) */}
            {!isLogin && (
              <div className="relative group">
                <MdEmail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  fieldStatus.email ? 'text-green-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    fieldStatus.email ? 'border-green-500' : 'border-gray-300'
                  }`}
                  required
                />
                {fieldStatus.email && (
                  <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in" />
                )}
              </div>
            )}

            {/* Biometric Quick Login (Login only) */}
            {isLogin && biometricRegistered && biometricAvailable && (
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
              <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                fieldStatus.pin && !isLogin ? 'text-green-500' : 'text-gray-400'
              }`} />
              <input
                type="password"
                placeholder={isLogin ? "Enter your PIN" : "Create a secure PIN (min 4 digits)"}
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  fieldStatus.pin && !isLogin ? 'border-green-500' : 'border-gray-300'
                }`}
                required={!isLogin || !biometricRegistered}
              />
              <div className="group relative inline-block">
                <FaQuestionCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 cursor-help" />
                <div className="invisible group-hover:visible absolute right-0 top-8 bg-gray-800 text-white text-xs rounded-lg p-2 w-48 z-10">
                  PIN must be at least 4 characters
                </div>
              </div>
            </div>

            {/* Confirm PIN Field (Sign up only) */}
            {!isLogin && (
              <div className="relative group">
                <FaShieldAlt className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  fieldStatus.confirmPin ? 'text-green-500' : 'text-gray-400'
                }`} />
                <input
                  type="password"
                  placeholder="Confirm your PIN"
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={handleChange}
                  className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    fieldStatus.confirmPin ? 'border-green-500' : 'border-gray-300'
                  }`}
                  required
                />
                {fieldStatus.confirmPin && (
                  <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in" />
                )}
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>

              {/* Biometric Setup Option (Sign up only) */}
              {!isLogin && biometricAvailable && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="enableBiometric"
                      checked={formData.enableBiometric}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                    />
                    <FaFingerprint className="text-green-600 text-xl" />
                    <div className="flex-1">
                      <span className="text-gray-700 font-semibold block">
                        Enable Biometric Login
                      </span>
                      <span className="text-gray-500 text-xs">
                        Use fingerprint, Face ID, or Windows Hello for quick access
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* No biometric message */}
              {!biometricAvailable && (
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 flex items-center space-x-2">
                  <FaExclamationTriangle className="text-yellow-600" />
                  <span className="text-sm text-gray-700">
                    Biometric authentication not available on this device
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loginSuccess || isRegisteringBiometric || isAuthenticatingBiometric}
              className={`w-full py-3 rounded-full font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg
                ${loginSuccess ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"} 
                ${!isLoading && !loginSuccess && !isRegisteringBiometric && !isAuthenticatingBiometric ? "hover:from-blue-600 hover:to-indigo-700" : ""}
                ${isLoading || loginSuccess || isRegisteringBiometric || isAuthenticatingBiometric ? "cursor-not-allowed opacity-90" : ""}`}
            >
              {isLoading || isRegisteringBiometric || isAuthenticatingBiometric ? (
                <>
                  <FaSpinner className="animate-spin text-xl mr-2" />
                  <span>
                    {isRegisteringBiometric ? "Setting up biometric..." : 
                     isAuthenticatingBiometric ? "Authenticating..." : 
                     "Processing..."}
                  </span>
                </>
              ) : loginSuccess ? (
                <>
                  <FaCheck className="text-xl mr-2 animate-bounce" />
                  <span>Success! Redirecting...</span>
                </>
              ) : (
                <span className="flex items-center">
                  {isLogin ? (
                    <>
                      <FaUserCheck className="mr-2" />
                      Log In as {selectedRole === "student" ? "Student" : "Restaurant Owner"}
                    </>
                  ) : (
                    <>
                      <FaShieldAlt className="mr-2" />
                      Create {selectedRole === "student" ? "Student" : "Restaurant"} Account
                    </>
                  )}
                </span>
              )}
            </button>

            {/* Terms and Conditions */}
            {!isLogin && (
              <p className="text-center text-gray-500 text-xs">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-blue-600 font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 font-semibold hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}

            {/* Forgot PIN */}
            {isLogin && (
              <div className="text-center">
                <a href="/forgot-pin" className="text-blue-600 text-sm hover:underline">
                  Forgot your PIN?
                </a>
              </div>
            )}

            {/* Security Info */}
            <div className="flex items-center justify-center text-gray-500 text-xs mt-4">
              <MdSecurity className="mr-1" />
              <span>Your data is encrypted and secure</span>
            </div>
          </>
        )}
      </form>

      {/* Role Switch Option */}
      <div className="text-center mt-6 animate-fade-in">
        {selectedRole === "student" ? (
          <p className="text-gray-600 text-sm">
            Are you a restaurant owner?{" "}
            <button
              onClick={() => handleRoleSelection("restaurant")}
              className="text-blue-600 font-semibold hover:underline transition-colors"
            >
              Switch to restaurant registration
            </button>
          </p>
        ) : (
          <div>
            <p className="text-gray-600 text-sm mb-3">
              Need help with restaurant registration?
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center mx-auto shadow-lg">
              Get Support <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        .form-container {
          animation: slide-up 0.4s ease-out;
        }

        .slide-in {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;