/* global PublicKeyCredential */
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
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { BiScan } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// ==================== Email Verification Helper ====================
const EmailVerificationHelper = {
  generateVerificationCode: () => {
    // Demo code - will be replaced with backend integration
    return "123456"; // Fixed demo code for testing
  },

  sendVerificationCode: async (email, code) => {
    // Simulate email sending - will integrate with backend later
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Demo verification code ${code} sent to ${email}`);
        console.log(`For demo purposes, use code: ${code}`);
        
        // Store in localStorage for verification
        localStorage.setItem(`verification_${email}`, JSON.stringify({
          code,
          expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        }));
        resolve(true);
      }, 1500);
    });
  },

  verifyCode: (email, code) => {
    const stored = localStorage.getItem(`verification_${email}`);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(`verification_${email}`);
      return false;
    }
    
    return data.code === code;
  },

  resendCode: async (email) => {
    const newCode = EmailVerificationHelper.generateVerificationCode();
    return await EmailVerificationHelper.sendVerificationCode(email, newCode);
  }
};

// ==================== WebAuthn Helper ====================
const WebAuthnHelper = {
  isSupported: () =>
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "PublicKeyCredential" in window &&
    navigator.credentials &&
    typeof navigator.credentials.create === "function" &&
    typeof navigator.credentials.get === "function",

  toBase64Url: (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  },
  fromBase64Url: (base64url) => {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (base64url.length % 4)) % 4);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  },

  utf8: (str) => new TextEncoder().encode(str),
  randomBytes: (len = 32) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  },

  rpId: () => {
    const host = window.location.hostname;
    return host;
  },

  async preflight() {
    if (!window.isSecureContext) {
      return { ok: false, reason: "Not secure context. Use HTTPS or http://localhost." };
    }
    if (!("PublicKeyCredential" in window)) {
      return { ok: false, reason: "WebAuthn not supported by this browser." };
    }
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        return { ok: false, reason: "No platform authenticator available (setup Touch ID / Face ID / Windows Hello)." };
      }
    } catch (e) {
      // some browsers may throw here – we continue anyway
    }
    return { ok: true };
  },

  async registerBiometric(username, displayName) {
    try {
      const pre = await WebAuthnHelper.preflight();
      if (!pre.ok) return { success: false, error: pre.reason };

      // Stable user handle for username (<= 64 bytes)
      const userHandles = JSON.parse(localStorage.getItem("webauthnUserHandles") || "{}");
      let userIdB64 = userHandles[username];
      if (!userIdB64) {
        userIdB64 = WebAuthnHelper.toBase64Url(WebAuthnHelper.randomBytes(32));
        userHandles[username] = userIdB64;
        localStorage.setItem("webauthnUserHandles", JSON.stringify(userHandles));
      }
      const userId = WebAuthnHelper.fromBase64Url(userIdB64);

      const publicKey = {
        challenge: WebAuthnHelper.randomBytes(32),
        rp: { name: "Igifu Food App", id: WebAuthnHelper.rpId() },
        user: { id: userId, name: username, displayName },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 120000,
        attestation: "none", // simpler for client-only demo
      };

      // Must be called from a user gesture (button click)
      const cred = await navigator.credentials.create({ publicKey });
      if (!cred) return { success: false, error: "No credential returned (cancelled?)." };

      const credentialId = WebAuthnHelper.toBase64Url(cred.rawId);
      const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
      stored[username] = { credentialId, username, createdAt: new Date().toISOString() };
      localStorage.setItem("biometricCredentials", JSON.stringify(stored));

      return { success: true, credentialId };
    } catch (err) {
      if (err && err.name === "NotAllowedError") {
        return {
          success: false,
          error: "Not allowed or timed out. Ensure you accept the OS prompt, use HTTPS/localhost, and have Face/Touch ID or Windows Hello set up.",
        };
      }
      return { success: false, error: err?.message || "Registration failed." };
    }
  },

  async authenticateBiometric(username) {
    try {
      const pre = await WebAuthnHelper.preflight();
      if (!pre.ok) return { success: false, error: pre.reason };

      const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
      const userCred = stored[username];

      const publicKey = {
        challenge: WebAuthnHelper.randomBytes(32),
        rpId: WebAuthnHelper.rpId(),
        userVerification: "required",
        timeout: 120000,
      };

      if (userCred?.credentialId) {
        publicKey.allowCredentials = [
          {
            id: WebAuthnHelper.fromBase64Url(userCred.credentialId),
            type: "public-key",
            transports: ["internal"],
          },
        ];
      }

      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) return { success: true, assertion };
      return { success: false, error: "Authentication failed." };
    } catch (err) {
      if (err && err.name === "NotAllowedError") {
        return {
          success: false,
          error: "Operation was blocked or timed out. Make sure you didn't dismiss the prompt and that biometrics/Windows Hello are configured.",
        };
      }
      return { success: false, error: err?.message || "Authentication failed." };
    }
  },

  hasBiometricRegistered: (username) => {
    const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
    return !!stored[username];
  },
};

// ==================== Restaurant Registration Assistance Page ====================
const RestaurantRegistrationAssistance = ({ onBack }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+1234567890"; // Replace with actual support number
    const message = "Hello! I need assistance with restaurant registration on Igifu.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp for assistance...");
  };

  const handlePhoneCall = () => {
    const phoneNumber = "+1234567890"; // Replace with actual support number
    window.open(`tel:${phoneNumber}`, '_self');
    toast.success("Initiating phone call...");
  };

  const handleEmailSupport = () => {
    const email = "support@igifu.com"; // Replace with actual support email
    const subject = "Restaurant Registration Assistance";
    const body = "Hello Igifu Support Team,\n\nI would like assistance with registering my restaurant on your platform.\n\nBest regards,";
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    toast.success("Opening email client...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 relative py-6 font-sans">
      <Toaster position="top-center" />
      
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
      >
        <span className="mr-2">←</span> Back
      </button>

      <div className="text-center mt-12 mb-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full inline-block mb-4">
          <FaUtensils className="text-green-600 text-4xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Restaurant Registration Assistance</h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          We're here to help you register your restaurant quickly and easily. 
          Choose your preferred contact method below and our team will guide you through the entire process.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-green-500 transition-all duration-300 transform hover:scale-105">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <FaWhatsapp className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp Assistance</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help via WhatsApp. Our team is available to answer your questions in real-time.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition-all flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2" />
              Message Us
            </button>
          </div>
        </div>

        {/* Phone Call Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
              <FaPhone className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct Call</h3>
            <p className="text-gray-600 text-sm mb-4">
              Speak directly with our registration specialist for personalized assistance.
            </p>
            <button
              onClick={handlePhoneCall}
              className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-all flex items-center justify-center"
            >
              <FaPhone className="mr-2" />
              Call Now
            </button>
          </div>
        </div>

        {/* Email Support Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
              <FaEnvelope className="text-purple-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Send us your details and we'll get back to you with complete registration guidance.
            </p>
            <button
              onClick={handleEmailSupport}
              className="w-full bg-purple-500 text-white py-3 rounded-full font-semibold hover:bg-purple-600 transition-all flex items-center justify-center"
            >
              <FaEnvelope className="mr-2" />
              Email Us
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Information Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 max-w-2xl w-full text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick & Easy Registration</h3>
        <p className="text-gray-600 mb-4">
          Our team will guide you through the entire registration process and help with:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center justify-center">
            <FaCheck className="text-green-500 mr-2" />
            <span>Account setup</span>
          </div>
          <div className="flex items-center justify-center">
            <FaCheck className="text-green-500 mr-2" />
            <span>Menu configuration</span>
          </div>
          <div className="flex items-center justify-center">
            <FaCheck className="text-green-500 mr-2" />
            <span>Payment setup</span>
          </div>
          <div className="flex items-center justify-center">
            <FaCheck className="text-green-500 mr-2" />
            <span>Profile optimization</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Our support team is available Monday to Friday, 9 AM to 6 PM</p>
        <p className="mt-1">Average response time: Under 5 minutes</p>
      </div>
    </div>
  );
};

// ==================== Page Component ====================
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
    rememberMe: true,
    enableBiometric: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isRegisteringBiometric, setIsRegisteringBiometric] = useState(false);
  const [isAuthenticatingBiometric, setIsAuthenticatingBiometric] = useState(false);
  
  // New states for email verification
  const [emailVerificationStep, setEmailVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [fieldStatus, setFieldStatus] = useState({
    username: false,
    email: false,
    pin: false,
    confirmPin: false,
  });

  useEffect(() => {
    (async () => {
      if (!window.isSecureContext) {
        setBiometricAvailable(false);
        return;
      }
      if (!WebAuthnHelper.isSupported()) {
        setBiometricAvailable(false);
        return;
      }
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricAvailable(!!available);
      } catch {
        setBiometricAvailable(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLogin && formData.username) {
      setBiometricRegistered(WebAuthnHelper.hasBiometricRegistered(formData.username));
    } else {
      setBiometricRegistered(false);
    }
  }, [formData.username, isLogin]);

  const triggerConfetti = async () => {
    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      });
    } catch {}
  };

  const handleRoleSelection = (role) => {
    if (role === "restaurant") {
      // Redirect to restaurant assistance page
      setCurrentStep("restaurantAssistance");
      return;
    }
    setSelectedRole(role);
    setCurrentStep("form");
    setTimeout(() => document.querySelector(".form-container")?.classList.add("slide-in"), 100);
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
    setEmailVerificationStep(false);
    setVerificationCode(["", "", "", "", "", ""]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === "pin" || name === "confirmPin" ? value.replace(/\D/g, "") : value;
    setFormData({ ...formData, [name]: v });

    if (name === "email") setFieldStatus((prev) => ({ ...prev, email: /\S+@\S+\.\S+/.test(v) }));
    if (name === "username") setFieldStatus((prev) => ({ ...prev, username: v.length >= 3 }));
    if (name === "pin") setFieldStatus((prev) => ({ ...prev, pin: v.length >= 4 }));
    if (name === "confirmPin") setFieldStatus((prev) => ({ ...prev, confirmPin: v === formData.pin }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const dashboardPath = () => (selectedRole === "student" ? "/igifu-dashboard" : "/restaurentdashboard");

  // Email Verification Functions
  const handleSendVerificationCode = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingCode(true);
    const code = EmailVerificationHelper.generateVerificationCode();
    
    try {
      await EmailVerificationHelper.sendVerificationCode(formData.email, code);
      toast.success("Demo verification code sent! Use: 123456");
      setEmailVerificationStep(true);
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifyingCode(true);
    
    try {
      const isValid = EmailVerificationHelper.verifyCode(formData.email, code);
      if (isValid) {
        toast.success("Email verified successfully!");
        // Proceed to biometric setup
        await handlePostVerification();
      } else {
        toast.error("Invalid verification code. Please use: 123456");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    try {
      await EmailVerificationHelper.resendCode(formData.email);
      toast.success("New demo code sent! Use: 123456");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handlePostVerification = async () => {
    // Save user data
    const userData = {
      username: formData.username,
      email: formData.email,
      role: selectedRole,
      createdAt: new Date().toISOString(),
      rememberMe: formData.rememberMe,
      emailVerified: true,
    };
    
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[formData.username] = userData;
    localStorage.setItem("users", JSON.stringify(users));

    // Set session
    localStorage.setItem(
      "sessionUser",
      JSON.stringify({ username: formData.username, role: selectedRole, email: formData.email })
    );

    // Show biometric setup option
    if (biometricAvailable && formData.enableBiometric) {
      const ok = await handleBiometricRegistration();
      if (!ok) {
        toast("You can enable biometric authentication later in settings.", { icon: "ℹ️" });
      }
    }

    // Redirect to dashboard
    setRegistrationSuccess(true);
    await triggerConfetti();
    toast.success("🎉 Registration complete! Redirecting to dashboard...");

    setTimeout(() => {
      navigate(dashboardPath());
    }, 2000);
  };

  // Biometric Functions
  const handleBiometricRegistration = async () => {
    setIsRegisteringBiometric(true);
    toast.loading("Setting up biometric authentication...", { id: "biometric-setup" });

    const result = await WebAuthnHelper.registerBiometric(
      formData.username,
      `${selectedRole === "student" ? "Student" : "Restaurant"}: ${formData.username}`
    );

    setIsRegisteringBiometric(false);

    if (result.success) {
      toast.success("Biometric authentication enabled!", { id: "biometric-setup" });
      setBiometricRegistered(true);
      return true;
    } else {
      toast.error(`Failed to setup biometric: ${result.error}`, { id: "biometric-setup" });
      return false;
    }
  };

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
    
    if (!isLogin && selectedRole === "student") {
      // For student registration, start email verification flow
      await handleSendVerificationCode();
      return;
    }

    // Existing login logic for other cases
    setIsLoading(true);
    setLoginSuccess(false);

    try {
      if (isLogin) {
        let isSuccess = false;
        const path = dashboardPath();

        if (biometricAvailable && biometricRegistered) {
          const ok = await handleBiometricLogin();
          if (ok) isSuccess = true;
        }

        if (!isSuccess) {
          const pinOk =
            (selectedRole === "student" && formData.pin === "student") ||
            (selectedRole === "restaurant" && formData.pin === "restaurent");
          if (pinOk) {
            isSuccess = true;
          } else {
            toast.error("Invalid credentials. Please try again.");
          }
        }

        if (isSuccess) {
          localStorage.setItem(
            "sessionUser",
            JSON.stringify({ username: formData.username, role: selectedRole })
          );
          setLoginSuccess(true);
          toast.success("Welcome back! Redirecting...");
          setTimeout(() => navigate(path), 1200);
        }
      } else {
        // Restaurant registration - this shouldn't happen with the new flow
        toast.error("Please use the assistance options for restaurant registration.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBiometricLogin = async () => {
    if (!formData.username) {
      toast.error("Please enter your username first");
      return;
    }
    const ok = await handleBiometricLogin();
    if (ok) {
      localStorage.setItem(
        "sessionUser",
        JSON.stringify({ username: formData.username, role: selectedRole })
      );
      setLoginSuccess(true);
      const path = dashboardPath();
      toast.success("Authentication successful! Redirecting...");
      setTimeout(() => navigate(path), 1000);
    }
  };

  // Show Restaurant Assistance Page
  if (currentStep === "restaurantAssistance") {
    return <RestaurantRegistrationAssistance onBack={handleBackToRoleSelection} />;
  }

  // Email Verification Step
  if (emailVerificationStep) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
        <Toaster position="top-center" />

        <button
          onClick={() => setEmailVerificationStep(false)}
          className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full inline-block mb-4">
            <MdEmail className="text-blue-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit verification code to:
          </p>
          <p className="text-blue-600 font-semibold mb-2">{formData.email}</p>
          <p className="text-green-600 font-semibold text-sm mb-6">
            Demo Code: <span className="bg-green-100 px-2 py-1 rounded">123456</span>
          </p>
        </div>

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-center space-x-2 mb-6">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`verification-code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyCode}
            disabled={isVerifyingCode || verificationCode.join('').length !== 6}
            className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isVerifyingCode ? (
              <>
                <FaSpinner className="animate-spin inline mr-2" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={isSendingCode}
              className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
            >
              {isSendingCode ? "Sending..." : "Didn't receive code? Resend"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role Selection Screen
  if (currentStep === "roleSelection") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
        <Toaster position="top-center" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="text-center mt-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Igifu</h2>
          <p className="text-gray-600 text-lg">Choose how you want to join us</p>
          {biometricAvailable && (
            <div className="mt-3 flex items-center justify-center text-green-600 animate-pulse">
              <FaFingerprint className="mr-2" />
              <span className="text-sm">Biometric authentication available</span>
            </div>
          )}
          {!window.isSecureContext && (
            <div className="mt-3 text-xs text-red-600">
              WebAuthn requires HTTPS or http://localhost
            </div>
          )}
        </div>

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
                <h3 className="text-xl font-semibold text-gray-800">I'm a Student</h3>
                <p className="text-gray-500 text-sm">Join to order food from restaurants</p>
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
                <h3 className="text-xl font-semibold text-gray-800">I'm a Restaurant Owner</h3>
                <p className="text-gray-500 text-sm">Register your restaurant with us</p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-green-600 transition-all transform group-hover:translate-x-2" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center text-gray-600">
          <MdSecurity className="mr-2 text-xl" />
          <span className="text-sm">Secured with end-to-end encryption</span>
        </div>
      </div>
    );
  }

  // Form Screen - Continue with your existing form screen code...
  // [Your existing form screen code remains the same]
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6 font-sans">
      <Toaster position="top-center" />

      <button
        onClick={handleBackToRoleSelection}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center shadow-lg"
      >
        <span className="mr-2">←</span> Back to role selection      </button>

      <div className="text-center mt-12 form-container">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full animate-bounce">
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

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 bg-white p-8 rounded-2xl shadow-2xl space-y-5 form-container">
        {registrationSuccess ? (
          <div className="text-center py-8">
            <div className="success-checkmark mx-auto mb-4">
              <HiCheckCircle className="text-green-500 text-6xl animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">Logging you into your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Username */}
            <div className="relative group">
              <MdPerson
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  fieldStatus.username && !isLogin ? "text-green-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder={
                  isLogin
                    ? selectedRole === "student"
                      ? "Username"
                      : "Restaurant Name"
                    : selectedRole === "student"
                    ? "Choose a username"
                    : "Restaurant Name"
                }
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  fieldStatus.username && !isLogin ? "border-green-500" : "border-gray-300"
                }`}
                required
              />
              {fieldStatus.username && !isLogin && (
                <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>

            {/* Email (Signup only) */}
            {!isLogin && (
              <div className="relative group">
                <MdEmail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    fieldStatus.email ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    fieldStatus.email ? "border-green-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldStatus.email && (
                  <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            )}

            {/* Biometric Area (Login) */}
            {isLogin && (
              <>
                {biometricAvailable && biometricRegistered && (
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
                    <p className="text-center text-xs text-gray-500 mt-2">Or enter your PIN below</p>
                  </div>
                )}

                {/* Offer enabling biometric on login if not registered */}
                {biometricAvailable && !biometricRegistered && formData.username && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FaFingerprint className="text-blue-600 text-xl" />
                      <div>
                        <div className="font-semibold text-gray-800">Enable Biometric on this device</div>
                        <div className="text-xs text-gray-600">Use fingerprint/Face ID for future logins</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleBiometricRegistration}
                      disabled={isRegisteringBiometric}
                      className="mt-3 w-full py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                      {isRegisteringBiometric ? "Setting up..." : "Enable Biometric"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* PIN */}
            <div className="relative group">
              <FaLock
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  fieldStatus.pin && !isLogin ? "text-green-500" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                inputMode="numeric"
                placeholder={isLogin ? "Enter your PIN" : "Create a secure PIN (min 4 digits)"}
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  fieldStatus.pin && !isLogin ? "border-green-500" : "border-gray-300"
                }`}
                required={!isLogin || !biometricRegistered}
              />
              <div className="group relative inline-block">
                <FaQuestionCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 cursor-help" />
                <div className="invisible group-hover:visible absolute right-0 top-8 bg-gray-800 text-white text-xs rounded-lg p-2 w-48 z-10">
                  PIN must be at least 4 digits
                </div>
              </div>
            </div>

            {/* Confirm PIN (Signup only) */}
            {!isLogin && (
              <div className="relative group">
                <FaShieldAlt
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    fieldStatus.confirmPin ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="Confirm your PIN"
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={handleChange}
                  className={`w-full px-10 py-3 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    fieldStatus.confirmPin ? "border-green-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldStatus.confirmPin && (
                  <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
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
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
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
                      <span className="text-gray-700 font-semibold block">Enable Biometric Login</span>
                      <span className="text-gray-500 text-xs">Use fingerprint, Face ID, or Windows Hello</span>
                    </div>
                  </label>
                </div>
              )}

              {!biometricAvailable && (
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 flex items-center space-x-2">
                  <FaExclamationTriangle className="text-yellow-600" />
                  <span className="text-sm text-gray-700">
                    Biometric authentication not available on this device (requires HTTPS and a configured platform authenticator).
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
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
                    {isRegisteringBiometric
                      ? "Setting up biometric..."
                      : isAuthenticatingBiometric
                      ? "Authenticating..."
                      : "Processing..."}
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

            {isLogin && (
              <div className="text-center">
                <a href="/forgot-pin" className="text-blue-600 text-sm hover:underline">
                  Forgot your PIN?
                </a>
              </div>
            )}

            <div className="flex items-center justify-center text-gray-500 text-xs mt-4">
              <MdSecurity className="mr-1" />
              <span>Your data is encrypted and secure</span>
            </div>
          </>
        )}
      </form>

      <div className="text-center mt-6">
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
            <p className="text-gray-600 text-sm mb-3">Need help with restaurant registration?</p>
            <button 
              onClick={() => handleRoleSelection("restaurant")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center mx-auto shadow-lg"
            >
              Get Support <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .form-container { animation: slide-up 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default SignUpPage;