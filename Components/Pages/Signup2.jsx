// import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// import toast, { Toaster } from 'react-hot-toast';

// // ===== TYPES =====

// // Auth Types
// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'student' | 'restaurant';
//   emailVerified: boolean;
//   biometricRegistered: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface SignUpFormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: 'student' | 'restaurant';
//   agreeToTerms: boolean;
// }

// export interface EmailVerificationData {
//   email: string;
//   code: string;
// }

// export interface BiometricRegistrationData {
//   username: string;
//   displayName: string;
// }

// export interface LoginFormData {
//   username: string;
//   password?: string;
//   useBiometric?: boolean;
// }

// // API Response Types
// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }

// export interface EmailVerificationResponse extends ApiResponse {
//   data?: {
//     codeSent: boolean;
//     email: string;
//     expiresAt: string;
//   };
// }

// export interface UserRegistrationResponse extends ApiResponse {
//   data?: User;
// }

// // WebAuthn Types
// export interface WebAuthnCredential {
//   credentialId: string;
//   username: string;
//   createdAt: string;
// }

// // ===== AUTH CONTEXT =====

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (credentials: LoginFormData) => Promise<boolean>;
//   logout: () => void;
//   signUp: (userData: SignUpFormData) => Promise<boolean>;
//   verifyEmail: (data: EmailVerificationData) => Promise<boolean>;
//   registerBiometric: (data: BiometricRegistrationData) => Promise<boolean>;
//   updateUser: (updates: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize auth state on mount
//   useEffect(() => {
//     const currentUser = AuthAPI.getCurrentUser();
//     if (currentUser) {
//       setUser(currentUser);
//       setIsAuthenticated(true);
//     }
//     setIsLoading(false);
//   }, []);

//   const signUp = async (userData: SignUpFormData): Promise<boolean> => {
//     try {
//       setIsLoading(true);
      
//       // Register user
//       const response = await AuthAPI.registerUser(userData);
//       if (!response.success) {
//         toast.error(response.error || 'Registration failed');
//         return false;
//       }

//       toast.success('Account created! Please verify your email.');
//       return true;
//     } catch (error) {
//       toast.error('An error occurred during registration');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyEmail = async (data: EmailVerificationData): Promise<boolean> => {
//     try {
//       setIsLoading(true);
      
//       const response = await AuthAPI.verifyEmailCode(data.email, data.code);
//       if (!response.success) {
//         toast.error(response.error || 'Email verification failed');
//         return false;
//       }

//       // Update user email verification status
//       const currentUser = AuthAPI.getCurrentUser();
//       if (currentUser) {
//         const updatedUser = { ...currentUser, emailVerified: true };
//         AuthAPI.setCurrentUser(updatedUser);
//         setUser(updatedUser);
//       }

//       toast.success('Email verified successfully!');
//       return true;
//     } catch (error) {
//       toast.error('An error occurred during email verification');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const registerBiometric = async (data: any): Promise<boolean> => {
//     try {
//       setIsLoading(true);
      
//       const result = await WebAuthnHelper.registerBiometric(data.username, data.displayName);
//       if (!result.success) {
//         toast.error(result.error || 'Biometric registration failed');
//         return false;
//       }

//       // Update user biometric registration status
//       const currentUser = AuthAPI.getCurrentUser();
//       if (currentUser) {
//         const updatedUser = { ...currentUser, biometricRegistered: true };
//         AuthAPI.setCurrentUser(updatedUser);
//         setUser(updatedUser);
//       }

//       toast.success('Biometric authentication enabled!');
//       return true;
//     } catch (error) {
//       toast.error('An error occurred during biometric registration');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (credentials: LoginFormData): Promise<boolean> => {
//     try {
//       setIsLoading(true);
      
//       // For biometric login, we need to extract username from stored credentials
//       if (credentials.useBiometric) {
//         const response = await AuthAPI.loginUser({ 
//           username: credentials.username, 
//           useBiometric: true 
//         });
        
//         if (!response.success) {
//           toast.error(response.error || 'Login failed');
//           return false;
//         }

//         const userData = response.data;
//         if (userData) {
//           AuthAPI.setCurrentUser(userData);
//           setUser(userData);
//           setIsAuthenticated(true);
//           toast.success('Welcome back!');
//         }
//         return true;
//       }

//       // Regular login
//       const response = await AuthAPI.loginUser(credentials);
//       if (!response.success) {
//         toast.error(response.error || 'Login failed');
//         return false;
//       }

//       const userData = response.data;
//       if (userData) {
//         AuthAPI.setCurrentUser(userData);
//         setUser(userData);
//         setIsAuthenticated(true);
//         toast.success('Welcome back!');
//       }
//       return true;
//     } catch (error) {
//       toast.error('An error occurred during login');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     AuthAPI.clearCurrentUser();
//     setUser(null);
//     setIsAuthenticated(false);
//     toast.success('Logged out successfully');
//   };

//   const updateUser = (updates: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...updates };
//       AuthAPI.setCurrentUser(updatedUser);
//       setUser(updatedUser);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     logout,
//     signUp,
//     verifyEmail,
//     registerBiometric,
//     updateUser,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // ===== WEB AUTHN HELPER =====

// class WebAuthnHelper {
//   // Check if WebAuthn is supported
//   static isSupported = (): boolean =>
//     typeof window !== "undefined" &&
//     window.isSecureContext && // HTTPS or localhost
//     "PublicKeyCredential" in window &&
//     navigator.credentials &&
//     typeof navigator.credentials.create === "function" &&
//     typeof navigator.credentials.get === "function";

//   // Convert ArrayBuffer to base64url
//   static toBase64Url = (buffer: ArrayBuffer): string => {
//     const bytes = new Uint8Array(buffer);
//     let binary = "";
//     for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//     return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
//   };

//   // Convert base64url to ArrayBuffer
//   static fromBase64Url = (base64url: string): ArrayBuffer => {
//     const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (base64url.length % 4)) % 4);
//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
//     return bytes.buffer;
//   };

//   // Generate random bytes
//   static randomBytes = (len: number = 32): Uint8Array => {
//     const arr = new Uint8Array(len);
//     crypto.getRandomValues(arr);
//     return arr;
//   };

//   // Get RP ID (effective domain)
//   static rpId = (): string => window.location.hostname;

//   // Check if biometric is available
//   static async isBiometricAvailable(): Promise<boolean> {
//     if (!this.isSupported()) return false;
//     try {
//       const available = await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
//       return !!available;
//     } catch {
//       return false;
//     }
//   }

//   // Preflight checks
//   static async preflight() {
//     if (!window.isSecureContext) {
//       return { ok: false, reason: "Not secure context. Use HTTPS or http://localhost." };
//     }
//     if (!("PublicKeyCredential" in window)) {
//       return { ok: false, reason: "WebAuthn not supported by this browser." };
//     }
//     try {
//       const available = await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
//       if (!available) {
//         return { ok: false, reason: "No platform authenticator available (setup Touch ID / Face ID / Windows Hello)." };
//       }
//     } catch {
//       // some browsers may throw here – we continue anyway
//     }
//     return { ok: true };
//   }

//   // Register biometric credentials
//   static async registerBiometric(username: string, displayName: string): Promise<{ success: boolean; error?: string; credentialId?: string }> {
//     try {
//       const pre = await this.preflight();
//       if (!pre.ok) return { success: false, error: pre.reason };

//       // Get or create user handle
//       const userHandles = JSON.parse(localStorage.getItem("webauthnUserHandles") || "{}");
//       let userIdB64 = userHandles[username];
//       if (!userIdB64) {
//         userIdB64 = this.toBase64Url(this.randomBytes(32));
//         userHandles[username] = userIdB64;
//         localStorage.setItem("webauthnUserHandles", JSON.stringify(userHandles));
//       }
//       const userId = this.fromBase64Url(userIdB64);

//       const publicKey = {
//         challenge: this.randomBytes(32),
//         rp: { name: "YouWare Food App", id: this.rpId() },
//         user: { id: userId, name: username, displayName },
//         pubKeyCredParams: [
//           { type: "public-key", alg: -7 },   // ES256
//           { type: "public-key", alg: -257 }, // RS256
//         ],
//         authenticatorSelection: {
//           authenticatorAttachment: "platform",
//           userVerification: "required",
//           residentKey: "preferred",
//         },
//         timeout: 120000,
//         attestation: "none",
//       };

//       // Must be called from a user gesture (button click)
//       const cred = await navigator.credentials.create({ publicKey });
//       if (!cred) return { success: false, error: "No credential returned (cancelled?)." };

//       const credentialId = this.toBase64Url(cred.rawId);
//       const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
//       stored[username] = { credentialId, username, createdAt: new Date().toISOString() };
//       localStorage.setItem("biometricCredentials", JSON.stringify(stored));

//       return { success: true, credentialId };
//     } catch (err: any) {
//       if (err && err.name === "NotAllowedError") {
//         return {
//           success: false,
//           error:
//             "Not allowed or timed out. Ensure you accept the OS prompt, use HTTPS/localhost, and have Face/Touch ID or Windows Hello set up.",
//         };
//       }
//       return { success: false, error: err?.message || "Registration failed." };
//     }
//   }

//   // Authenticate with biometric
//   static async authenticateBiometric(username: string): Promise<{ success: boolean; error?: string }> {
//     try {
//       const pre = await this.preflight();
//       if (!pre.ok) return { success: false, error: pre.reason };

//       const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
//       const userCred = stored[username];

//       const publicKey = {
//         challenge: this.randomBytes(32),
//         rpId: this.rpId(),
//         userVerification: "required",
//         timeout: 120000,
//       };

//       if (userCred?.credentialId) {
//         publicKey.allowCredentials = [
//           {
//             id: this.fromBase64Url(userCred.credentialId),
//             type: "public-key",
//             transports: ["internal"],
//           },
//         ];
//       }

//       const assertion = await navigator.credentials.get({ publicKey });
//       if (assertion) return { success: true };
//       return { success: false, error: "Authentication failed." };
//     } catch (err: any) {
//       if (err && err.name === "NotAllowedError") {
//         return {
//           success: false,
//           error:
//             "Operation was blocked or timed out. Make sure you didn't dismiss the prompt and that biometrics/Windows Hello are configured.",
//         };
//       }
//       return { success: false, error: err?.message || "Authentication failed." };
//     }
//   }

//   // Check if biometric is registered for user
//   static hasBiometricRegistered = (username: string): boolean => {
//     const stored = JSON.parse(localStorage.getItem("biometricCredentials") || "{}");
//     return !!stored[username];
//   };
// }

// // ===== AUTH API =====

// class AuthAPI {
//   // Mock API endpoints for development - will be replaced with real backend
//   static API_BASE_URL = 'http://localhost:8787'; // Cloudflare Worker dev URL

//   // Mock delay to simulate network requests
//   static mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

//   // Send email verification code
//   static async sendEmailVerificationCode(email: string): Promise<EmailVerificationResponse> {
//     // Mock implementation - will call real backend in production
//     try {
//       await this.mockDelay(1500);
      
//       // Simulate sending email code
//       const response = await fetch(`${this.API_BASE_URL}/api/auth/send-verification-code`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // For development, simulate successful email send
//       console.log('Mock: Email verification code sent to', email);
//       await this.mockDelay(800);
      
//       return {
//         success: true,
//         data: {
//           codeSent: true,
//           email,
//           expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
//         },
//         message: 'Verification code sent to your email',
//       };
//     }
//   }

//   // Verify email code
//   static async verifyEmailCode(email: string, code: string): Promise<ApiResponse> {
//     try {
//       await this.mockDelay(1000);
      
//       const response = await fetch(`${this.API_BASE_URL}/api/auth/verify-email-code`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, code }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // Mock implementation - validate against common codes or mock success
//       console.log('Mock: Verifying code', code, 'for email', email);
      
//       // For demo purposes, accept any 6-digit code or specific test codes
//       if (code === '123456' || /^\d{6}$/.test(code)) {
//         await this.mockDelay(800);
//         return {
//           success: true,
//           message: 'Email verified successfully',
//         };
//       } else {
//         return {
//           success: false,
//           error: 'Invalid verification code. Please try again.',
//         };
//       }
//     }
//   }

//   // Register new user
//   static async registerUser(userData: any): Promise<UserRegistrationResponse> {
//     try {
//       await this.mockDelay(1200);
      
//       const response = await fetch(`${this.API_BASE_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // Mock implementation - create user object
//       console.log('Mock: Registering user', userData.username);
      
//       const newUser: User = {
//         id: `user_${Date.now()}`,
//         username: userData.username,
//         email: userData.email,
//         role: userData.role,
//         emailVerified: false,
//         biometricRegistered: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       // Store in localStorage for demo
//       const users = JSON.parse(localStorage.getItem('users') || '{}');
//       users[userData.username] = newUser;
//       localStorage.setItem('users', JSON.stringify(users));

//       await this.mockDelay(800);
//       return {
//         success: true,
//         data: newUser,
//         message: 'User registered successfully',
//       };
//     }
//   }

//   // Login user
//   static async loginUser(credentials: any): Promise<ApiResponse> {
//     try {
//       await this.mockDelay(1000);
      
//       const response = await fetch(`${this.API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // Mock implementation - validate against stored users
//       console.log('Mock: Logging in user', credentials.username);
      
//       const users = JSON.parse(localStorage.getItem('users') || '{}');
//       const user = users[credentials.username];
      
//       if (!user) {
//         return {
//           success: false,
//           error: 'User not found. Please check your username or sign up first.',
//         };
//       }

//       // Mock authentication logic
//       if (user.role === 'student' && credentials.password === 'student') {
//         return {
//           success: true,
//           data: user,
//           message: 'Login successful',
//         };
//       } else if (user.role === 'restaurant' && credentials.password === 'restaurant') {
//         return {
//           success: true,
//           data: user,
//           message: 'Login successful',
//         };
//       } else {
//         return {
//           success: false,
//           error: 'Invalid credentials. Please try again.',
//         };
//       }
//     }
//   }

//   // Get current user session
//   static getCurrentUser(): User | null {
//     const session = localStorage.getItem('sessionUser');
//     return session ? JSON.parse(session) : null;
//   }

//   // Set user session
//   static setCurrentUser(user: User): void {
//     localStorage.setItem('sessionUser', JSON.stringify(user));
//   }

//   // Clear user session
//   static clearCurrentUser(): void {
//     localStorage.removeItem('sessionUser');
//   }

//   // Update user data
//   static updateUser(userId: string, updates: Partial<User>): User | null {
//     const users = JSON.parse(localStorage.getItem('users') || '{}');
//     const userKeys = Object.keys(users);
//     const userKey = userKeys.find(key => users[key].id === userId);
    
//     if (userKey) {
//       users[userKey] = { ...users[userKey], ...updates, updatedAt: new Date().toISOString() };
//       localStorage.setItem('users', JSON.stringify(users));
      
//       // Update session if it's the current user
//       const currentUser = this.getCurrentUser();
//       if (currentUser && currentUser.id === userId) {
//         this.setCurrentUser(users[userKey]);
//       }
      
//       return users[userKey];
//     }
    
//     return null;
//   }
// }

// // ===== MAIN SIGNUP COMPONENT =====

// type AuthStep = 'role-selection' | 'signup' | 'email-verification' | 'biometric-setup' | 'login' | 'dashboard';

// const Signup: React.FC = () => {
//   const { signUp, verifyEmail, registerBiometric, login, isLoading } = useAuth();
//   const [currentStep, setCurrentStep] = useState<AuthStep>('role-selection');
//   const [selectedRole, setSelectedRole] = useState<'student' | 'restaurant'>('student');
//   const [pendingUserData, setPendingUserData] = useState<any>(null);
//   const [verificationEmail, setVerificationEmail] = useState('');

//   // Handle role selection
//   const handleRoleSelection = (role: 'student' | 'restaurant') => {
//     setSelectedRole(role);
//     setCurrentStep('signup');
//   };

//   // Handle sign up
//   const handleSignUp = async (userData: SignUpFormData) => {
//     // For restaurant requests, we don't use this function
//     if (selectedRole === 'restaurant') {
//       return;
//     }

//     const success = await signUp(userData);
//     if (success) {
//       setPendingUserData(userData);
//       setVerificationEmail(userData.email);
      
//       // Send verification email
//       const emailResponse = await AuthAPI.sendEmailVerificationCode(userData.email);
//       if (emailResponse.success) {
//         setCurrentStep('email-verification');
//         toast.success('Verification code sent to your email!');
//       } else {
//         toast.error(emailResponse.error || 'Failed to send verification code');
//       }
//     }
//   };

//   // Handle email verification
//   const handleEmailVerification = async (data: EmailVerificationData) => {
//     const success = await verifyEmail(data);
//     if (success) {
//       setCurrentStep('biometric-setup');
//     }
//   };

//   // Handle resend code
//   const handleResendCode = async (email: string): Promise<boolean> => {
//     const response = await AuthAPI.sendEmailVerificationCode(email);
//     if (response.success) {
//       toast.success('New verification code sent!');
//       return true;
//     } else {
//       toast.error(response.error || 'Failed to resend code');
//       return false;
//     }
//   };

//   // Handle biometric/PIN setup
//   const handleBiometricComplete = async (biometricRegistered: boolean) => {
//     if (biometricRegistered && pendingUserData) {
//       await registerBiometric({
//         username: pendingUserData.username,
//         displayName: `${selectedRole === 'student' ? 'Student' : 'Restaurant'}: ${pendingUserData.username}`,
//       });
//     }
    
//     // Complete registration and go to login
//     toast.success('Account setup complete! Please sign in.');
//     setCurrentStep('login');
//     setPendingUserData(null);
//   };

//   // Handle biometric skip
//   const handleBiometricSkip = () => {
//     toast.success('Account setup complete! Please sign in.');
//     setCurrentStep('login');
//     setPendingUserData(null);
//   };

//   // Handle login
//   const handleLogin = async (credentials: any) => {
//     const success = await login(credentials);
//     if (success) {
//       setCurrentStep('dashboard');
//     }
//   };

//   // Handle restaurant request submission
//   const handleRestaurantRequestComplete = () => {
//     // For restaurant requests, show success and redirect to role selection
//     setCurrentStep('role-selection');
//     toast.success('Request submitted! Our team will contact you soon.');
//   };

//   // Handle back navigation
//   const handleBack = () => {
//     switch (currentStep) {
//       case 'signup':
//         setCurrentStep('role-selection');
//         setPendingUserData(null);
//         break;
//       case 'email-verification':
//         setCurrentStep('signup');
//         setVerificationEmail('');
//         break;
//       case 'biometric-setup':
//         setCurrentStep('email-verification');
//         break;
//       case 'login':
//         setCurrentStep('role-selection');
//         break;
//       default:
//         setCurrentStep('role-selection');
//     }
//   };

//   // Render current step
//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 'role-selection':
//         return <RoleSelection onRoleSelect={handleRoleSelection} />;
      
//       case 'signup':
//         return selectedRole === 'restaurant' ? (
//           <RestaurantRequest
//             selectedRole={selectedRole}
//             onRoleChange={setSelectedRole}
//             onComplete={handleRestaurantRequestComplete}
//           />
//         ) : (
//           <SignUpForm
//             onSubmit={handleSignUp}
//             isLoading={isLoading}
//             selectedRole={selectedRole}
//             onRoleChange={setSelectedRole}
//           />
//         );
      
//       case 'email-verification':
//         return (
//           <EmailVerification
//             email={verificationEmail}
//             onVerify={handleEmailVerification}
//             onResendCode={handleResendCode}
//             isLoading={isLoading}
//             onBack={handleBack}
//           />
//         );
      
//       case 'biometric-setup':
//         return (
//           <BiometricPrompt
//             username={pendingUserData?.username || ''}
//             displayName={`${selectedRole === 'student' ? 'Student' : 'Restaurant'}: ${pendingUserData?.username || ''}`}
//             onComplete={handleBiometricComplete}
//             onSkip={handleBiometricSkip}
//           />
//         );
      
//       case 'login':
//         return (
//           <LoginForm
//             onSubmit={handleLogin}
//             isLoading={isLoading}
//             selectedRole={selectedRole}
//             onRoleChange={setSelectedRole}
//           />
//         );
      
//       case 'dashboard':
//         return <Dashboard userRole={selectedRole} />;
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative py-6">
//       <Toaster position="top-center" />
      
//       {/* Back Button */}
//       {currentStep !== 'role-selection' && currentStep !== 'dashboard' && (
//         <button
//           onClick={handleBack}
//           disabled={isLoading}
//           className="absolute top-4 left-4 bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center shadow-lg"
//         >
//           <span className="mr-2">←</span> Back
//         </button>
//       )}

//       {/* Main Content */}
//       <div className="w-full max-w-md mx-auto px-4">
//         {renderCurrentStep()}
//       </div>
//     </div>
//   );
// };

// // ===== ROLE SELECTION COMPONENT =====

// const RoleSelection: React.FC<{ onRoleSelect: (role: 'student' | 'restaurant') => void }> = ({ onRoleSelect }) => {
//   return (
//     <div className="w-full max-w-md mx-auto text-center">
//       <div className="mb-8">
//         <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to YouWare</h2>
//         <p className="text-gray-600 text-lg">Choose how you want to join us</p>
//       </div>

//       <div className="space-y-4">
//         <button
//           onClick={() => onRoleSelect('student')}
//           className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 transform group-hover:rotate-12">
//               <svg className="text-blue-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="text-left">
//               <h3 className="text-xl font-semibold text-gray-800">I'm a Student</h3>
//               <p className="text-gray-500 text-sm">Order food from restaurants and manage your preferences</p>
//             </div>
//           </div>
//           <svg className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button>

//         <button
//           onClick={() => onRoleSelect('restaurant')}
//           className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 transform group-hover:rotate-12">
//               <svg className="text-green-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//               </svg>
//             </div>
//             <div className="text-left">
//               <h3 className="text-xl font-semibold text-gray-800">I'm a Restaurant Owner</h3>
//               <p className="text-gray-500 text-sm">Register your restaurant and manage orders</p>
//             </div>
//           </div>
//           <svg className="text-gray-400 group-hover:text-green-600 transition-all transform group-hover:translate-x-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// // ===== SIGN UP FORM COMPONENT =====

// const SignUpForm: React.FC<{
//   onSubmit: (data: SignUpFormData) => void;
//   isLoading: boolean;
//   selectedRole: 'student' | 'restaurant';
//   onRoleChange: (role: 'student' | 'restaurant') => void;
// }> = ({ onSubmit, isLoading, selectedRole, onRoleChange }) => {
//   const [formData, setFormData] = useState<SignUpFormData>({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: selectedRole,
//     agreeToTerms: false,
//   });

//   const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Partial<SignUpFormData> = {};

//     if (!formData.username || formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }

//     if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password || formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (!formData.agreeToTerms) {
//       newErrors.agreeToTerms = 'You must agree to the terms and conditions';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit({ ...formData, role: selectedRole });
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name as keyof SignUpFormData]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
//         <p className="text-gray-600 text-sm">
//           Join {selectedRole === 'student' ? 'our food delivery platform' : 'our restaurant network'}
//         </p>
//       </div>

//       {/* Role Selection */}
//       <div className="mb-6">
//         <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             type="button"
//             onClick={() => onRoleChange('student')}
//             className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
//               selectedRole === 'student'
//                 ? 'border-blue-500 bg-blue-50 text-blue-700'
//                 : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-sm font-medium">Student</span>
//           </button>
//           <button
//             type="button"
//             onClick={() => onRoleChange('restaurant')}
//             className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
//               selectedRole === 'restaurant'
//                 ? 'border-green-500 bg-green-50 text-green-700'
//                 : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//             </svg>
//             <span className="text-sm font-medium">Restaurant</span>
//           </button>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Username */}
//         <div>
//           <input
//             type="text"
//             name="username"
//             placeholder={selectedRole === 'student' ? 'Choose a username' : 'Restaurant name'}
//             value={formData.username}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
//               errors.username ? 'border-red-500' : 'border-gray-300'
//             }`}
//             required
//           />
//           {errors.username && (
//             <p className="text-red-500 text-xs mt-1">{errors.username}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email address"
//             value={formData.email}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
//               errors.email ? 'border-red-500' : 'border-gray-300'
//             }`}
//             required
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Create a secure password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
//               errors.password ? 'border-red-500' : 'border-gray-300'
//             }`}
//             required
//           />
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//           )}
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm your password"
//             value={formData.confirmPassword}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
//               errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//             }`}
//             required
//           />
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
//           )}
//         </div>

//         {/* Terms Agreement */}
//         <div className="flex items-start space-x-3">
//           <input
//             type="checkbox"
//             name="agreeToTerms"
//             checked={formData.agreeToTerms}
//             onChange={handleInputChange}
//             className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label className="text-sm text-gray-600">
//             I agree to the Terms of Service and Privacy Policy
//           </label>
//         </div>
//         {errors.agreeToTerms && (
//           <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//             isLoading
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
//           }`}
//         >
//           {isLoading ? (
//             <>
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span>Creating Account...</span>
//             </>
//           ) : (
//             <>
//               <span>Create Account</span>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </>
//           )}
//         </button>
//       </form>

//       <div className="mt-6 text-center">
//         <p className="text-sm text-gray-600">
//           Already have an account?{' '}
//           <button
//             onClick={() => window.location.reload()}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign in
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// // ===== EMAIL VERIFICATION COMPONENT =====

// const EmailVerification: React.FC<{
//   email: string;
//   onVerify: (data: EmailVerificationData) => Promise<boolean>;
//   onResendCode: (email: string) => Promise<boolean>;
//   isLoading: boolean;
//   onBack: () => void;
// }> = ({ email, onVerify, onResendCode, isLoading, onBack }) => {
//   const [verificationCode, setVerificationCode] = useState('');
//   const [error, setError] = useState('');
//   const [countdown, setCountdown] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [countdown]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
//       setError('Please enter a valid 6-digit verification code');
//       return;
//     }

//     const success = await onVerify({ email, code: verificationCode });
//     if (!success) {
//       setError('Invalid verification code. Please try again.');
//     }
//   };

//   const handleResendCode = async () => {
//     setError('');
//     setCountdown(60);
//     setCanResend(false);
    
//     const success = await onResendCode(email);
//     if (success) {
//       setVerificationCode('');
//     } else {
//       setError('Failed to resend verification code. Please try again.');
//       setCanResend(true);
//       setCountdown(0);
//     }
//   };

//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//     setVerificationCode(value);
    
//     if (error) setError('');
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//       <div className="text-center mb-6">
//         <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="text-blue-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//             <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
//         <p className="text-gray-600 text-sm">We've sent a 6-digit verification code to</p>
//         <p className="text-blue-600 font-semibold text-sm mt-1 break-all">{email}</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Enter verification code</label>
//           <input
//             type="text"
//             value={verificationCode}
//             onChange={handleCodeChange}
//             placeholder="123456"
//             className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 transition-all ${
//               error ? 'border-red-500' : 'border-gray-300'
//             }`}
//             maxLength={6}
//             autoComplete="one-time-code"
//             autoFocus
//           />
//           {error && (
//             <p className="text-red-500 text-xs mt-1">{error}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading || verificationCode.length !== 6}
//           className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//             isLoading || verificationCode.length !== 6
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
//           }`}
//         >
//           {isLoading ? (
//             <>
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span>Verifying...</span>
//             </>
//           ) : (
//             <>
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Verify Email</span>
//             </>
//           )}
//         </button>

//         <div className="text-center space-y-3">
//           <p className="text-sm text-gray-600">Didn't receive the code?</p>
          
//           {canResend ? (
//             <button
//               type="button"
//               onClick={handleResendCode}
//               disabled={isLoading}
//               className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-2 mx-auto"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               <span>Resend Code</span>
//             </button>
//           ) : (
//             <p className="text-gray-500 text-sm">Resend code in {countdown}s</p>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={onBack}
//           disabled={isLoading}
//           className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
//         >
//           ← Back to sign up
//         </button>
//       </form>

//       <div className="mt-6 p-4 bg-blue-50 rounded-xl">
//         <h4 className="text-sm font-medium text-blue-800 mb-2">Having trouble?</h4>
//         <ul className="text-xs text-blue-700 space-y-1">
//           <li>• Check your spam/junk folder</li>
//           <li>• Make sure you entered the correct email</li>
//           <li>• Wait a few minutes for delivery</li>
//           <li>• Contact support if you still don't receive it</li>
//         </ul>
//       </div>

//       <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
//         <p className="text-xs text-yellow-800 text-center">
//           <strong>Demo Mode:</strong> Use code <code className="bg-yellow-200 px-1 rounded">123456</code> or any 6-digit code to continue
//         </p>
//       </div>
//     </div>
//   );
// };

// // ===== BIOMETRIC PROMPT COMPONENT =====

// const BiometricPrompt: React.FC<{
//   username: string;
//   displayName: string;
//   onComplete: (biometricRegistered: boolean) => void;
//   onSkip: () => void;
// }> = ({ username, displayName, onComplete, onSkip }) => {
//   const [biometricAvailable, setBiometricAvailable] = useState(false);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState<'biometric' | 'pin' | null>(null);
//   const [pin, setPin] = useState('');
//   const [confirmPin, setConfirmPin] = useState('');
//   const [pinError, setPinError] = useState('');

//   useEffect(() => {
//     WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
//   }, []);

//   const handleBiometricRegistration = async () => {
//     setIsRegistering(true);
    
//     try {
//       const result = await WebAuthnHelper.registerBiometric(username, displayName);
      
//       if (result.success) {
//         toast.success('Biometric authentication enabled successfully!', {
//           icon: '🔐',
//           duration: 3000,
//         });
//         onComplete(true);
//       } else {
//         toast.error(`Failed to setup biometric: ${result.error}`, {
//           duration: 4000,
//         });
//         setIsRegistering(false);
//       }
//     } catch (error) {
//       toast.error('An error occurred during biometric registration');
//       setIsRegistering(false);
//     }
//   };

//   const handlePinSetup = () => {
//     if (pin.length < 4) {
//       setPinError('PIN must be at least 4 digits');
//       return;
//     }
    
//     if (pin !== confirmPin) {
//       setPinError('PINs do not match');
//       return;
//     }
    
//     // Store PIN for demo purposes
//     const userPins = JSON.parse(localStorage.getItem('userPins') || '{}');
//     userPins[username] = pin;
//     localStorage.setItem('userPins', JSON.stringify(userPins));
    
//     toast.success('PIN setup complete!', {
//       icon: '🔑',
//       duration: 2000,
//     });
    
//     onComplete(false); // Not biometric, but completed
//   };

//   if (selectedMethod === 'pin') {
//     return (
//       <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//         <div className="text-center mb-6">
//           <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="text-green-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a PIN</h2>
//           <p className="text-gray-600 text-sm">Set up a secure PIN for quick access</p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Create PIN (minimum 4 digits)</label>
//             <input
//               type="password"
//               value={pin}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                 setPin(value);
//                 if (pinError) setPinError('');
//               }}
//               placeholder="Enter PIN"
//               className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 ${
//                 pinError ? 'border-red-500' : 'border-gray-300'
//               }`}
//               maxLength={6}
//               autoFocus
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Confirm PIN</label>
//             <input
//               type="password"
//               value={confirmPin}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                 setConfirmPin(value);
//                 if (pinError) setPinError('');
//               }}
//               placeholder="Confirm PIN"
//               className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 ${
//                 pinError ? 'border-red-500' : 'border-gray-300'
//               }`}
//               maxLength={6}
//             />
//             {pinError && (
//               <p className="text-red-500 text-xs mt-1">{pinError}</p>
//             )}
//           </div>

//           <div className="flex space-x-3">
//             <button
//               onClick={() => setSelectedMethod(null)}
//               className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//             >
//               Back
//             </button>
//             <button
//               onClick={handlePinSetup}
//               disabled={pin.length < 4 || confirmPin.length < 4}
//               className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//                 pin.length < 4 || confirmPin.length < 4
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
//               }`}
//             >
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//               <span>Complete Setup</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//       <div className="text-center mb-6">
//         <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="text-purple-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Your Account</h2>
//         <p className="text-gray-600 text-sm">Choose your preferred authentication method</p>
//       </div>

//       {biometricAvailable && (
//         <div 
//           onClick={() => setSelectedMethod('biometric')}
//           className="mb-4 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-300 cursor-pointer transition-all group"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
//               <svg className="text-purple-600 text-xl" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-800">Biometric Authentication</h3>
//               <p className="text-sm text-gray-600">Use your fingerprint, Face ID, or Windows Hello</p>
//             </div>
//             <div className="text-purple-600">
//               <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       )}

//       <div 
//         onClick={() => setSelectedMethod('pin')}
//         className="mb-6 p-4 rounded-xl border-2 border-green-200 hover:border-green-300 cursor-pointer transition-all group"
//       >
//         <div className="flex items-center space-x-4">
//           <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
//             <svg className="text-green-600 text-xl" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-gray-800">PIN Authentication</h3>
//             <p className="text-sm text-gray-600">Create a secure 4-6 digit PIN</p>
//           </div>
//           <div className="text-green-600">
//             <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {selectedMethod === 'biometric' && (
//         <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center space-x-2">
//               <svg className="text-purple-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//               </svg>
//               <span className="font-medium text-purple-800">Biometric Setup</span>
//             </div>
//             <button
//               onClick={() => setSelectedMethod(null)}
//               className="text-purple-600 hover:text-purple-800"
//             >
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//           <p className="text-sm text-purple-700 mb-3">
//             Click the button below to set up biometric authentication using your device's built-in security features.
//           </p>
//           <button
//             onClick={handleBiometricRegistration}
//             disabled={isRegistering}
//             className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//               isRegistering
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
//             }`}
//           >
//             {isRegistering ? (
//               <>
//                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Setting up...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Enable Biometric Authentication</span>
//               </>
//             )}
//           </button>
//         </div>
//       )}

//       <div className="text-center">
//         <button
//           onClick={onSkip}
//           className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
//         >
//           Skip for now
//         </button>
//         <p className="text-xs text-gray-400 mt-1">
//           You can enable security features later in settings
//         </p>
//       </div>

//       {!biometricAvailable && (
//         <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
//           <p className="text-xs text-amber-800">
//             <strong>Note:</strong> Biometric authentication requires HTTPS and a supported device (iOS, Android, or Windows with Hello enabled).
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // ===== LOGIN FORM COMPONENT =====

// const LoginForm: React.FC<{
//   onSubmit: (credentials: LoginFormData) => Promise<boolean>;
//   isLoading: boolean;
//   selectedRole: 'student' | 'restaurant';
//   onRoleChange: (role: 'student' | 'restaurant') => void;
// }> = ({ onSubmit, isLoading, selectedRole, onRoleChange }) => {
//   const [credentials, setCredentials] = useState<LoginFormData>({
//     username: '',
//     password: '',
//     useBiometric: false,
//   });

//   const [biometricAvailable, setBiometricAvailable] = useState(false);
//   const [biometricRegistered, setBiometricRegistered] = useState(false);
//   const [isAuthenticating, setIsAuthenticating] = useState(false);

//   useEffect(() => {
//     WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
//   }, []);

//   useEffect(() => {
//     if (credentials.username) {
//       setBiometricRegistered(WebAuthnHelper.hasBiometricRegistered(credentials.username));
//     } else {
//       setBiometricRegistered(false);
//     }
//   }, [credentials.username]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (credentials.useBiometric) {
//       await handleBiometricLogin();
//     } else {
//       await onSubmit(credentials);
//     }
//   };

//   const handleBiometricLogin = async () => {
//     if (!credentials.username) {
//       toast.error('Please enter your username first');
//       return;
//     }

//     setIsAuthenticating(true);
    
//     try {
//       const result = await WebAuthnHelper.authenticateBiometric(credentials.username);
      
//       if (result.success) {
//         toast.success('Biometric authentication successful!');
//         await onSubmit({ ...credentials, useBiometric: true });
//       } else {
//         toast.error(`Biometric authentication failed: ${result.error}`);
//       }
//     } catch (error) {
//       toast.error('An error occurred during authentication');
//     } finally {
//       setIsAuthenticating(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
//         <p className="text-gray-600 text-sm">Sign in to your {selectedRole === 'student' ? 'student' : 'restaurant'} account</p>
//       </div>

//       <div className="mb-6">
//         <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             type="button"
//             onClick={() => onRoleChange('student')}
//             className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
//               selectedRole === 'student'
//                 ? 'border-blue-500 bg-blue-50 text-blue-700'
//                 : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-sm font-medium">Student</span>
//           </button>
//           <button
//             type="button"
//             onClick={() => onRoleChange('restaurant')}
//             className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
//               selectedRole === 'restaurant'
//                 ? 'border-green-500 bg-green-50 text-green-700'
//                 : 'border-gray-200 hover:border-gray-300'
//             }`}
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//             </svg>
//             <span className="text-sm font-medium">Restaurant</span>
//           </button>
//         </div>
//       </div>

//       {biometricAvailable && biometricRegistered && (
//         <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
//           <button
//             type="button"
//             onClick={() => setCredentials(prev => ({ ...prev, useBiometric: true }))}
//             className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
//           >
//             {isAuthenticating ? (
//               <>
//                 <svg className="text-blue-600 text-2xl animate-pulse" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="font-semibold text-gray-700">Scanning...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="text-green-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span className="font-semibold text-gray-700">Quick Login with Biometric</span>
//               </>
//             )}
//           </button>
//           <p className="text-center text-xs text-gray-500 mt-2">
//             Or enter your credentials below
//           </p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="username"
//           placeholder={selectedRole === 'student' ? 'Username' : 'Restaurant name'}
//           value={credentials.username}
//           onChange={handleInputChange}
//           className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
//           required
//         />

//         {!credentials.useBiometric && (
//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={credentials.password}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
//               required={!credentials.useBiometric}
//             />
//             <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-xs text-blue-800">
//                 <strong>Demo Credentials:</strong><br />
//                 Student: Password is "<code className="bg-blue-200 px-1 rounded">student</code>"<br />
//                 Restaurant: Password is "<code className="bg-blue-200 px-1 rounded">restaurant</code>"
//               </p>
//             </div>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)}
//           className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//             isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
//           }`}
//         >
//           {isLoading || isAuthenticating ? (
//             <>
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span>{isAuthenticating ? 'Authenticating...' : 'Signing in...'}</span>
//             </>
//           ) : (
//             <>
//               <span>Sign In</span>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </>
//           )}
//         </button>
//       </form>

//       <div className="mt-6 text-center space-y-3">
//         <p className="text-sm text-gray-600">
//           Forgot your password?{' '}
//           <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
//             Reset it here
//           </a>
//         </p>
        
//         <p className="text-sm text-gray-600">
//           Don't have an account?{' '}
//           <button
//             onClick={() => window.location.reload()}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// // ===== RESTAURANT REQUEST COMPONENT =====

// const RestaurantRequest: React.FC<{
//   selectedRole: 'student' | 'restaurant';
//   onRoleChange: (role: 'student' | 'restaurant') => void;
//   onComplete?: () => void;
// }> = ({ selectedRole, onRoleChange, onComplete }) => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     ownerName: '',
//     email: '',
//     phone: '',
//     businessAddress: '',
//     city: '',
//     state: '',
//     businessType: '',
//     establishmentYear: '',
//     message: '',
//     preferredContact: 'email',
//     urgent: false,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   const businessTypes = [
//     'Restaurant', 'Cafe', 'Fast Food', 'Fine Dining', 'Food Truck',
//     'Bar & Grill', 'Bakery', 'Catering', 'Delivery Only', 'Takeout Only'
//   ];

//   const validateForm = (): boolean => {
//     const newErrors: any = {};

//     if (!formData.businessName.trim()) {
//       newErrors.businessName = 'Business name is required';
//     }

//     if (!formData.ownerName.trim()) {
//       newErrors.ownerName = 'Owner name is required';
//     }

//     if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Valid email address is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     }

//     if (!formData.businessAddress.trim()) {
//       newErrors.businessAddress = 'Business address is required';
//     }

//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     }

//     if (!formData.state.trim()) {
//       newErrors.state = 'State is required';
//     }

//     if (!formData.businessType) {
//       newErrors.businessType = 'Business type is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setIsSubmitted(true);
      
//       setTimeout(() => {
//         onComplete?.();
//       }, 3000);
      
//     } catch (error) {
//       console.error('Error submitting request:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//     }));
    
//     if (errors[name]) {
//       setErrors((prev: any) => ({ ...prev, [name]: '' }));
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white text-center">
//           <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="text-3xl text-white" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-bold mb-4">Request Submitted Successfully!</h2>
//           <p className="text-green-100 text-lg">
//             Thank you for your interest in joining our platform.
//           </p>
//         </div>
        
//         <div className="p-8">
//           <div className="space-y-6">
//             <div className="text-center">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">What happens next?</h3>
//               <p className="text-gray-600">
//                 Our team will review your request and contact you within <strong>24 hours</strong> to assist with your restaurant registration.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="text-center p-4 bg-blue-50 rounded-xl">
//                 <svg className="text-blue-600 text-2xl mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <h4 className="font-semibold text-gray-800 mb-1">Team Review</h4>
//                 <p className="text-sm text-gray-600">We verify your business information</p>
//               </div>
              
//               <div className="text-center p-4 bg-green-50 rounded-xl">
//                 <svg className="text-green-600 text-2xl mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                 </svg>
//                 <h4 className="font-semibold text-gray-800 mb-1">Personal Contact</h4>
//                 <p className="text-sm text-gray-600">We call you to discuss registration</p>
//               </div>
              
//               <div className="text-center p-4 bg-purple-50 rounded-xl">
//                 <svg className="text-purple-600 text-2xl mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 <h4 className="font-semibold text-gray-800 mb-1">Account Setup</h4>
//                 <p className="text-sm text-gray-600">We help create your restaurant account</p>
//               </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//               <div className="flex items-start space-x-3">
//                 <svg className="text-yellow-600 text-xl mt-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                 </svg>
//                 <div>
//                   <h4 className="font-semibold text-yellow-800 mb-2">Expected Response Time</h4>
//                   <ul className="text-sm text-yellow-700 space-y-1">
//                     <li>• Initial confirmation email: Within 1 hour</li>
//                     <li>• Personal contact attempt: Within 24 hours</li>
//                     <li>• Complete setup process: 2-3 business days</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="text-center space-y-4">
//               <p className="text-gray-600">
//                 Need to reach us immediately? Call us at{' '}
//                 <a href="tel:+1-555-123-4567" className="text-blue-600 font-semibold hover:underline">
//                   +1 (555) 123-4567
//                 </a>
//               </p>
              
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
//               >
//                 Back to Home
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-4">Request Restaurant Registration</h2>
//             <p className="text-blue-100 text-lg mb-4">
//               Our team will help you set up your restaurant account
//             </p>
//             <div className="flex items-center space-x-6 text-sm">
//               <div className="flex items-center space-x-2">
//                 <svg className="text-blue-200" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
//                 </svg>
//                 <span>Personal assistance</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <svg className="text-blue-200" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
//                 </svg>
//                 <span>Expert guidance</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <svg className="text-blue-200" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 <span>Quick setup</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-4 mt-6">
//           <button
//             type="button"
//             onClick={() => onRoleChange('student')}
//             className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//               selectedRole === 'student'
//                 ? 'bg-white text-blue-600'
//                 : 'bg-blue-500 text-white hover:bg-blue-400'
//             }`}
//           >
//             Student
//           </button>
//           <button
//             type="button"
//             onClick={() => onRoleChange('restaurant')}
//             className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//               selectedRole === 'restaurant'
//                 ? 'bg-white text-blue-600'
//                 : 'bg-blue-500 text-white hover:bg-blue-400'
//             }`}
//           >
//             Restaurant Owner
//           </button>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="p-8 space-y-8">
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
//             <input
//               type="text"
//               name="businessName"
//               value={formData.businessName}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.businessName ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Your restaurant name"
//               required
//             />
//             {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={formData.ownerName}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.ownerName ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Your full name"
//               required
//             />
//             {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.email ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="contact@yourrestaurant.com"
//               required
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.phone ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="+1 (555) 123-4567"
//               required
//             />
//             {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
//           <input
//             type="text"
//             name="businessAddress"
//             value={formData.businessAddress}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//               errors.businessAddress ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="123 Main Street"
//             required
//           />
//           {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.city ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Your city"
//               required
//             />
//             {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
//             <input
//               type="text"
//               name="state"
//               value={formData.state}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.state ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Your state"
//               required
//             />
//             {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
//             <select
//               name="businessType"
//               value={formData.businessType}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${
//                 errors.businessType ? 'border-red-500' : 'border-gray-300'
//               }`}
//               required
//             >
//               <option value="">Select business type</option>
//               {businessTypes.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//             {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
//             <input
//               type="number"
//               name="establishmentYear"
//               value={formData.establishmentYear}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
//               placeholder="2020"
//               min="1800"
//               max={new Date().getFullYear()}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
//           <textarea
//             name="message"
//             value={formData.message}
//             onChange={handleInputChange}
//             rows={4}
//             className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
//             placeholder="Tell us more about your restaurant, menu, services, or any special requirements..."
//           />
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
//             <select
//               name="preferredContact"
//               value={formData.preferredContact}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="email">Email</option>
//               <option value="phone">Phone Call</option>
//             </select>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="urgent"
//               checked={formData.urgent}
//               onChange={handleInputChange}
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label className="ml-2 text-sm text-gray-600">
//               This request is urgent (within 24 hours)
//             </label>
//           </div>
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
//               isSubmitting
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Submitting Request...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 <span>Submit Registration Request</span>
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // ===== DASHBOARD COMPONENT =====

// const Dashboard: React.FC<{ userRole: 'student' | 'restaurant' }> = ({ userRole }) => {
//   const { user, logout } = useAuth();
  
//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
//       <div className="text-center mb-6">
//         <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
//           userRole === 'student' ? 'bg-blue-100' : 'bg-green-100'
//         }`}>
//           <svg className={`text-2xl ${userRole === 'student' ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
//             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           Welcome {userRole === 'student' ? 'Student' : 'Restaurant Owner'}!
//         </h2>
//         <p className="text-gray-600">
//           {user?.username} - Your account is ready to use
//         </p>
//       </div>

//       <div className="space-y-4">
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//           <h3 className="font-semibold text-blue-800 mb-2">Account Status</h3>
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-blue-700">Email Verified:</span>
//               <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
//                 {user?.emailVerified ? '✅ Verified' : '❌ Not Verified'}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-blue-700">Biometric Setup:</span>
//               <span className={`font-medium ${user?.biometricRegistered ? 'text-green-600' : 'text-amber-600'}`}>
//                 {user?.biometricRegistered ? '✅ Enabled' : '⚠️ Not Set'}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-blue-700">Account Type:</span>
//               <span className={`font-medium capitalize ${userRole === 'student' ? 'text-blue-600' : 'text-green-600'}`}>
//                 {user?.role}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="text-center space-y-3">
//           <p className="text-gray-600 text-sm">
//             🎉 Your account is successfully created and ready to use!
//           </p>
          
//           <button
//             onClick={logout}
//             className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             <span>Sign Out</span>
//           </button>

//           <button
//             onClick={() => window.location.reload()}
//             className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//           >
//             Start Over
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Export all components and providers
// export { Signup, AuthProvider, RoleSelection, SignUpForm, EmailVerification, BiometricPrompt, LoginForm, RestaurantRequest, Dashboard };
// export default Signup;


























import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback, ErrorInfo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// ===== TYPES =====

// Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'restaurant';
  emailVerified: boolean;
  biometricRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profilePicture?: string;
  phone?: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'restaurant';
  agreeToTerms: boolean;
  rememberMe?: boolean;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

export interface BiometricRegistrationData {
  username: string;
  displayName: string;
}

export interface LoginFormData {
  username: string;
  password?: string;
  useBiometric?: boolean;
  rememberMe?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface EmailVerificationResponse extends ApiResponse {
  data?: {
    codeSent: boolean;
    email: string;
    expiresAt: string;
  };
}

export interface UserRegistrationResponse extends ApiResponse {
  data?: User;
  token?: string;
  refreshToken?: string;
}

export interface LoginResponse extends ApiResponse {
  data?: User;
  token?: string;
  refreshToken?: string;
}

// WebAuthn Types
export interface WebAuthnCredential {
  credentialId: string;
  username: string;
  createdAt: string;
}

// Session Types
export interface Session {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresAt: number;
  rememberMe: boolean;
}

// ===== ERROR BOUNDARY =====

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends React.Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught:', error, errorInfo);
    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="text-red-600 text-2xl" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'Something went wrong with authentication. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== UTILITIES =====

// Password strength validator
class PasswordValidator {
  static getStrength(password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters required');
    }

    if (password.length >= 12) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }

    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add special characters');
    }

    // Check for common patterns
    if (/^[a-zA-Z]+$/.test(password) || /^\d+$/.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid using only letters or numbers');
    }

    // Check for sequential characters
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid sequential characters');
    }

    return {
      score: Math.min(score, 5),
      feedback,
      isValid: score >= 4 && password.length >= 8
    };
  }

  static getStrengthColor(score: number): string {
    if (score <= 1) return 'red';
    if (score <= 2) return 'orange';
    if (score <= 3) return 'yellow';
    if (score <= 4) return 'lime';
    return 'green';
  }

  static getStrengthLabel(score: number): string {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  }
}

// Rate limiter
class RateLimiter {
  private attempts: Map<string, { count: number; resetAt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  checkLimit(identifier: string): { allowed: boolean; remainingAttempts: number; resetAt?: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetAt) {
      this.attempts.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs
      });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    if (record.count >= this.maxAttempts) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetAt: record.resetAt
      };
    }

    record.count++;
    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - record.count
    };
  }

  reset(identifier: string) {
    this.attempts.delete(identifier);
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetAt - Date.now());
  }
}

// Session Manager
class SessionManager {
  private static readonly SESSION_KEY = 'auth_session';
  private static readonly REFRESH_KEY = 'refresh_token';

  static setSession(
    user: User,
    token?: string,
    refreshToken?: string,
    rememberMe: boolean = false
  ): void {
    const session: Session = {
      user,
      token,
      refreshToken,
      expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
      rememberMe
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    if (refreshToken) {
      storage.setItem(this.REFRESH_KEY, refreshToken);
    }
  }

  static getSession(): Session | null {
    const stored = 
      localStorage.getItem(this.SESSION_KEY) || 
      sessionStorage.getItem(this.SESSION_KEY);
    
    if (!stored) return null;

    try {
      const session: Session = JSON.parse(stored);
      
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to parse session:', error);
      this.clearSession();
      return null;
    }
  }

  static updateSession(updates: Partial<Session>): void {
    const current = this.getSession();
    if (!current) return;

    const updated = { ...current, ...updates };
    const storage = current.rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.SESSION_KEY, JSON.stringify(updated));
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
  }

  static getToken(): string | null {
    const session = this.getSession();
    return session?.token || null;
  }

  static getRefreshToken(): string | null {
    return (
      localStorage.getItem(this.REFRESH_KEY) ||
      sessionStorage.getItem(this.REFRESH_KEY)
    );
  }

  static async refreshSession(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await AuthAPI.refreshToken(refreshToken);
      if (response.success && response.data && response.token) {
        const session = this.getSession();
        if (session) {
          this.setSession(
            response.data,
            response.token,
            response.refreshToken,
            session.rememberMe
          );
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  }
}

// Custom hooks
const useAsyncAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, execute, reset };
};

// ===== AUTH CONTEXT =====

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => void;
  signUp: (userData: SignUpFormData) => Promise<boolean>;
  verifyEmail: (data: EmailVerificationData) => Promise<boolean>;
  registerBiometric: (data: BiometricRegistrationData) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const rateLimiter = new RateLimiter();

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const session = SessionManager.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);

        // Check if token needs refresh
        const timeUntilExpiry = session.expiresAt - Date.now();
        if (timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes
          await SessionManager.refreshSession();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    const interval = setInterval(async () => {
      const session = SessionManager.getSession();
      if (session) {
        const timeUntilExpiry = session.expiresAt - Date.now();
        if (timeUntilExpiry < 5 * 60 * 1000) {
          const refreshed = await SessionManager.refreshSession();
          if (!refreshed) {
            logout();
            toast.error('Session expired. Please log in again.');
          }
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const signUp = async (userData: SignUpFormData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validate password strength
      const passwordStrength = PasswordValidator.getStrength(userData.password);
      if (!passwordStrength.isValid) {
        toast.error('Password is too weak. ' + passwordStrength.feedback.join(', '));
        return false;
      }

      // Rate limiting check
      const limitCheck = rateLimiter.checkLimit(`signup_${userData.email}`);
      if (!limitCheck.allowed) {
        const waitTime = Math.ceil(rateLimiter.getRemainingTime(`signup_${userData.email}`) / 1000);
        toast.error(`Too many attempts. Please wait ${waitTime} seconds.`);
        return false;
      }

      // Register user
      const response = await AuthAPI.registerUser(userData);
      if (!response.success) {
        toast.error(response.error || 'Registration failed');
        return false;
      }

      // Store session if token is provided
      if (response.data && response.token) {
        SessionManager.setSession(
          response.data,
          response.token,
          response.refreshToken,
          userData.rememberMe
        );
      }

      toast.success('Account created! Please verify your email.');
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error?.message || 'An error occurred during registration');
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
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        SessionManager.updateSession({ user: updatedUser });
      }

      toast.success('Email verified successfully!');
      return true;
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast.error(error?.message || 'An error occurred during email verification');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerBiometric = async (data: BiometricRegistrationData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const result = await WebAuthnHelper.registerBiometric(data.username, data.displayName);
      if (!result.success) {
        toast.error(result.error || 'Biometric registration failed');
        return false;
      }

      // Update user biometric registration status
      if (user) {
        const updatedUser = { ...user, biometricRegistered: true };
        setUser(updatedUser);
        SessionManager.updateSession({ user: updatedUser });

        // Send to backend
        await AuthAPI.updateUserBiometric(user.id, result.credentialId!);
      }

      toast.success('Biometric authentication enabled!');
      return true;
    } catch (error: any) {
      console.error('Biometric registration error:', error);
      toast.error(error?.message || 'An error occurred during biometric registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Rate limiting check
      const limitCheck = rateLimiter.checkLimit(`login_${credentials.username}`);
      if (!limitCheck.allowed) {
        const waitTime = Math.ceil(rateLimiter.getRemainingTime(`login_${credentials.username}`) / 1000);
        toast.error(`Too many login attempts. Please wait ${waitTime} seconds.`);
        return false;
      }

      // Biometric authentication
      if (credentials.useBiometric) {
        const biometricResult = await WebAuthnHelper.authenticateBiometric(credentials.username);
        if (!biometricResult.success) {
          toast.error(biometricResult.error || 'Biometric authentication failed');
          return false;
        }
      }

      // API login
      const response = await AuthAPI.loginUser(credentials);
      if (!response.success) {
        toast.error(response.error || 'Login failed');
        return false;
      }

      const userData = response.data;
      if (userData) {
        SessionManager.setSession(
          userData,
          response.token,
          response.refreshToken,
          credentials.rememberMe
        );
        setUser(userData);
        setIsAuthenticated(true);
        
        // Reset rate limiter on successful login
        rateLimiter.reset(`login_${credentials.username}`);
        
        toast.success('Welcome back!');
      }
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    SessionManager.clearSession();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      SessionManager.updateSession({ user: updatedUser });
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshed = await SessionManager.refreshSession();
      if (refreshed) {
        const session = SessionManager.getSession();
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      }
      return refreshed;
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      return false;
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
    refreshAuth,
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

// ===== WEB AUTHN HELPER =====

class WebAuthnHelper {
  // Check if WebAuthn is supported
  static isSupported = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return !!(
      window.isSecureContext &&
      'PublicKeyCredential' in window &&
      navigator?.credentials &&
      typeof navigator.credentials.create === 'function' &&
      typeof navigator.credentials.get === 'function'
    );
  };

  // Convert ArrayBuffer to base64url
  static toBase64Url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  };

  // Convert base64url to ArrayBuffer
  static fromBase64Url = (base64url: string): ArrayBuffer => {
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/') +
      '=='.slice(0, (4 - (base64url.length % 4)) % 4);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Generate random bytes
  static randomBytes = (len: number = 32): Uint8Array => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  };

  // Get RP ID (effective domain)
  static rpId = (): string => {
    // In production, this should match your domain
    const hostname = window.location.hostname;
    // Remove www. prefix if present
    return hostname.replace(/^www\./, '');
  };

  // Check if biometric is available
  static async isBiometricAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const available = await (window as any).PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();
      return !!available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  // Preflight checks
  static async preflight(): Promise<{ ok: boolean; reason?: string }> {
    if (!window.isSecureContext) {
      return {
        ok: false,
        reason: 'Not secure context. Use HTTPS or http://localhost.'
      };
    }
    
    if (!('PublicKeyCredential' in window)) {
      return {
        ok: false,
        reason: 'WebAuthn not supported by this browser.'
      };
    }
    
    try {
      const available = await (window as any).PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        return {
          ok: false,
          reason: 'No platform authenticator available. Please set up Touch ID, Face ID, or Windows Hello.'
        };
      }
    } catch (error) {
      // Some browsers may throw here – we continue anyway
      console.warn('Platform authenticator check failed:', error);
    }
    
    return { ok: true };
  }

  // Register biometric credentials
  static async registerBiometric(
    username: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string; credentialId?: string }> {
    try {
      const pre = await this.preflight();
      if (!pre.ok) {
        return { success: false, error: pre.reason };
      }

      // Get or create user handle
      const userHandles = JSON.parse(
        localStorage.getItem('webauthnUserHandles') || '{}'
      );
      let userIdB64 = userHandles[username];
      if (!userIdB64) {
        userIdB64 = this.toBase64Url(this.randomBytes(32));
        userHandles[username] = userIdB64;
        localStorage.setItem('webauthnUserHandles', JSON.stringify(userHandles));
      }
      const userId = this.fromBase64Url(userIdB64);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: this.randomBytes(32),
        rp: {
          name: 'YouWare Food App',
          id: this.rpId()
        },
        user: {
          id: userId,
          name: username,
          displayName
        },
        pubKeyCredParams: [
          { type: 'public-key' as PublicKeyCredentialType, alg: -7 },   // ES256
          { type: 'public-key' as PublicKeyCredentialType, alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
          requireResidentKey: false
        },
        timeout: 120000,
        attestation: 'none'
      };

      // Must be called from a user gesture (button click)
      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      if (!credential) {
        return { success: false, error: 'No credential returned (cancelled?).' };
      }

      const credentialId = this.toBase64Url(credential.rawId);
      const stored = JSON.parse(
        localStorage.getItem('biometricCredentials') || '{}'
      );
      stored[username] = {
        credentialId,
        username,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('biometricCredentials', JSON.stringify(stored));

      return { success: true, credentialId };
    } catch (err: any) {
      console.error('Biometric registration error:', err);
      
      if (err?.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Permission denied or timeout. Please ensure you accept the OS prompt and have biometrics configured.'
        };
      }
      
      if (err?.name === 'InvalidStateError') {
        return {
          success: false,
          error: 'This authenticator may already be registered. Try signing in instead.'
        };
      }
      
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  }

  // Authenticate with biometric
  static async authenticateBiometric(
    username: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const pre = await this.preflight();
      if (!pre.ok) {
        return { success: false, error: pre.reason };
      }

      const stored = JSON.parse(
        localStorage.getItem('biometricCredentials') || '{}'
      );
      const userCred = stored[username];

      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: this.randomBytes(32),
        rpId: this.rpId(),
        userVerification: 'required',
        timeout: 120000
      };

      if (userCred?.credentialId) {
        publicKey.allowCredentials = [
          {
            id: this.fromBase64Url(userCred.credentialId),
            type: 'public-key',
            transports: ['internal'] as AuthenticatorTransport[]
          }
        ];
      }

      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) {
        return { success: true };
      }
      
      return { success: false, error: 'Authentication failed.' };
    } catch (err: any) {
      console.error('Biometric authentication error:', err);
      
      if (err?.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Authentication was blocked or timed out. Please try again.'
        };
      }
      
      return { success: false, error: err?.message || 'Authentication failed.' };
    }
  }

  // Check if biometric is registered for user
  static hasBiometricRegistered = (username: string): boolean => {
    const stored = JSON.parse(
      localStorage.getItem('biometricCredentials') || '{}'
    );
    return !!stored[username];
  };

  // Remove biometric registration
  static removeBiometric = (username: string): void => {
    const stored = JSON.parse(
      localStorage.getItem('biometricCredentials') || '{}'
    );
    delete stored[username];
    localStorage.setItem('biometricCredentials', JSON.stringify(stored));
  };
}

// ===== AUTH API =====

class AuthAPI {
  static API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8787';
  static IS_MOCK = process.env.REACT_APP_USE_MOCK_API === 'true' || !process.env.REACT_APP_API_URL;

  // Generic request handler
  static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Use mock implementation if configured
    if (this.IS_MOCK) {
      return this.mockRequest<T>(endpoint, options);
    }

    try {
      const token = SessionManager.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for CSRF protection
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          const refreshed = await SessionManager.refreshSession();
          if (refreshed) {
            // Retry the request with new token
            return this.makeRequest<T>(endpoint, options);
          } else {
            SessionManager.clearSession();
            window.location.href = '/login';
          }
        }

        return {
          success: false,
          error: data.error || data.message || 'Request failed',
          statusCode: response.status
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      
      return {
        success: false,
        error: error?.message || 'Network error. Please check your connection.',
        statusCode: 0
      };
    }
  }

  // Mock request handler for development
  static async mockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Parse request body if present
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Mock implementations based on endpoint
    if (endpoint.includes('/auth/register')) {
      return this.mockRegister(body);
    } else if (endpoint.includes('/auth/login')) {
      return this.mockLogin(body);
    } else if (endpoint.includes('/auth/verify-email')) {
      return this.mockVerifyEmail(body);
    } else if (endpoint.includes('/auth/send-verification')) {
      return this.mockSendVerification(body);
    } else if (endpoint.includes('/auth/refresh')) {
      return this.mockRefreshToken();
    } else {
      return {
        success: false,
        error: 'Endpoint not implemented in mock mode',
        statusCode: 404
      };
    }
  }

  // Mock implementations
  private static mockRegister(data: any): ApiResponse<User> {
    const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
    
    if (users[data.username]) {
      return {
        success: false,
        error: 'Username already exists',
        statusCode: 409
      };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      role: data.role,
      emailVerified: false,
      biometricRegistered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users[data.username] = { ...newUser, password: data.password };
    localStorage.setItem('mock_users', JSON.stringify(users));

    return {
      success: true,
      data: newUser,
      message: 'User registered successfully',
      statusCode: 201
    };
  }

  private static mockLogin(data: any): LoginResponse {
    const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
    const user = users[data.username];

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
        statusCode: 401
      };
    }

    if (!data.useBiometric && user.password !== data.password) {
      return {
        success: false,
        error: 'Invalid credentials',
        statusCode: 401
      };
    }

    const { password, ...userData } = user;
    userData.lastLoginAt = new Date().toISOString();

    return {
      success: true,
      data: userData,
      token: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      message: 'Login successful',
      statusCode: 200
    };
  }

  private static mockVerifyEmail(data: any): ApiResponse {
    // Accept any 6-digit code in mock mode
    if (/^\d{6}$/.test(data.code)) {
      return {
        success: true,
        message: 'Email verified successfully',
        statusCode: 200
      };
    }

    return {
      success: false,
      error: 'Invalid verification code',
      statusCode: 400
    };
  }

  private static mockSendVerification(data: any): EmailVerificationResponse {
    return {
      success: true,
      data: {
        codeSent: true,
        email: data.email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
      message: 'Verification code sent',
      statusCode: 200
    };
  }

  private static mockRefreshToken(): LoginResponse {
    const session = SessionManager.getSession();
    if (!session) {
      return {
        success: false,
        error: 'No valid session',
        statusCode: 401
      };
    }

    return {
      success: true,
      data: session.user,
      token: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      message: 'Token refreshed',
      statusCode: 200
    };
  }

  // API Methods
  static async sendEmailVerificationCode(email: string): Promise<EmailVerificationResponse> {
    return this.makeRequest<EmailVerificationResponse['data']>(
      '/api/auth/send-verification-code',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  }

  static async verifyEmailCode(email: string, code: string): Promise<ApiResponse> {
    return this.makeRequest('/api/auth/verify-email-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  static async registerUser(userData: SignUpFormData): Promise<UserRegistrationResponse> {
    return this.makeRequest<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async loginUser(credentials: LoginFormData): Promise<LoginResponse> {
    return this.makeRequest<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.makeRequest<User>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async updateUserBiometric(userId: string, credentialId: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/users/${userId}/biometric`, {
      method: 'PUT',
      body: JSON.stringify({ credentialId }),
    });
  }

  static async requestPasswordReset(email: string): Promise<ApiResponse> {
    return this.makeRequest('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.makeRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  static async logoutUser(): Promise<ApiResponse> {
    return this.makeRequest('/api/auth/logout', {
      method: 'POST',
    });
  }
}

// ===== MAIN SIGNUP COMPONENT =====

type AuthStep = 'role-selection' | 'signup' | 'email-verification' | 'biometric-setup' | 'login' | 'dashboard';

const Signup: React.FC = () => {
  const { signUp, verifyEmail, registerBiometric, login, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<AuthStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<'student' | 'restaurant'>('student');
  const [pendingUserData, setPendingUserData] = useState<SignUpFormData | null>(null);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Handle role selection
  const handleRoleSelection = (role: 'student' | 'restaurant') => {
    setSelectedRole(role);
    setCurrentStep('signup');
  };

  // Handle sign up
  const handleSignUp = async (userData: SignUpFormData) => {
    if (selectedRole === 'restaurant') {
      return; // Restaurant flow handled separately
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
  const handleLogin = async (credentials: LoginFormData) => {
    const success = await login(credentials);
    if (success) {
      setCurrentStep('dashboard');
    }
  };

  // Handle restaurant request completion
  const handleRestaurantRequestComplete = () => {
    setCurrentStep('role-selection');
    toast.success('Request submitted! Our team will contact you soon.');
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
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
      
      {/* Back Button */}
      {currentStep !== 'role-selection' && currentStep !== 'dashboard' && (
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="absolute top-4 left-4 bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

// ===== ROLE SELECTION COMPONENT =====

const RoleSelection: React.FC<{ onRoleSelect: (role: 'student' | 'restaurant') => void }> = ({ onRoleSelect }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center animate-fadeIn">
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
              <svg className="text-blue-600 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-800">I'm a Student</h3>
              <p className="text-gray-500 text-sm">Order food from restaurants and manage your preferences</p>
            </div>
          </div>
          <svg className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => onRoleSelect('restaurant')}
          className="w-full p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 transform group-hover:rotate-12">
              <svg className="text-green-600 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-800">I'm a Restaurant Owner</h3>
              <p className="text-gray-500 text-sm">Register your restaurant and manage orders</p>
            </div>
          </div>
          <svg className="text-gray-400 group-hover:text-green-600 transition-all transform group-hover:translate-x-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ===== SIGN UP FORM COMPONENT =====

const SignUpForm: React.FC<{
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
}> = ({ onSubmit, isLoading, selectedRole, onRoleChange }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole,
    agreeToTerms: false,
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof PasswordValidator.getStrength> | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!passwordStrength?.isValid) {
      newErrors.password = 'Password is too weak';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, role: selectedRole });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(PasswordValidator.getStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-gray-600 text-sm">
          Join {selectedRole === 'student' ? 'our food delivery platform' : 'our restaurant network'}
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-sm font-medium">Restaurant</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <input
            type="text"
            name="username"
            placeholder={selectedRole === 'student' ? 'Choose a username' : 'Restaurant name'}
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password strength:</span>
                <span className={`text-xs font-medium text-${PasswordValidator.getStrengthColor(passwordStrength.score)}-600`}>
                  {PasswordValidator.getStrengthLabel(passwordStrength.score)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 bg-${PasswordValidator.getStrengthColor(passwordStrength.score)}-500`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="text-xs text-gray-600">• {feedback}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showConfirmPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Agreement & Remember Me */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
          )}
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">
              Remember me for 30 days
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// Continue with remaining components in next message due to length...

// ===== EMAIL VERIFICATION COMPONENT =====

const EmailVerification: React.FC<{
  email: string;
  onVerify: (data: EmailVerificationData) => Promise<boolean>;
  onResendCode: (email: string) => Promise<boolean>;
  isLoading: boolean;
  onBack: () => void;
}> = ({ email, onVerify, onResendCode, isLoading, onBack }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
    setIsResending(true);
    setCountdown(60);
    setCanResend(false);
    
    try {
      const success = await onResendCode(email);
      if (success) {
        setVerificationCode('');
      } else {
        setError('Failed to resend verification code. Please try again.');
        setCanResend(true);
        setCountdown(0);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="text-blue-600 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 text-sm">We've sent a 6-digit verification code to</p>
        <p className="text-blue-600 font-semibold text-sm mt-1 break-all">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter verification code</label>
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
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verify Email</span>
            </>
          )}
        </button>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          
          {canResend ? (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading || isResending}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Resend Code</span>
                </>
              )}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">Resend code in {countdown}s</p>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back to sign up
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Having trouble?</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Check your spam/junk folder</li>
          <li>• Make sure you entered the correct email</li>
          <li>• Wait a few minutes for delivery</li>
          <li>• Contact support if you still don't receive it</li>
        </ul>
      </div>

      {AuthAPI.IS_MOCK && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Demo Mode:</strong> Use code <code className="bg-yellow-200 px-1 rounded">123456</code> or any 6-digit code to continue
          </p>
        </div>
      )}
    </div>
  );
};

// ===== BIOMETRIC PROMPT COMPONENT =====

const BiometricPrompt: React.FC<{
  username: string;
  displayName: string;
  onComplete: (biometricRegistered: boolean) => void;
  onSkip: () => void;
}> = ({ username, displayName, onComplete, onSkip }) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'biometric' | 'pin' | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const { execute: executeAsync } = useAsyncAuth();

  useEffect(() => {
    WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  const handleBiometricRegistration = async () => {
    setIsRegistering(true);
    
    const result = await executeAsync(async () => {
      const response = await WebAuthnHelper.registerBiometric(username, displayName);
      
      if (response.success) {
        toast.success('Biometric authentication enabled successfully!', {
          icon: '🔐',
          duration: 3000,
        });
        onComplete(true);
        return true;
      } else {
        toast.error(`Failed to setup biometric: ${response.error}`, {
          duration: 4000,
        });
        setIsRegistering(false);
        return false;
      }
    });
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
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="text-green-600 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a PIN</h2>
          <p className="text-gray-600 text-sm">Set up a secure PIN for quick access</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Create PIN (minimum 4 digits)</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm PIN</label>
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Complete Setup</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-6">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="text-purple-600 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Your Account</h2>
        <p className="text-gray-600 text-sm">Choose your preferred authentication method</p>
      </div>

      {biometricAvailable && (
        <div 
          onClick={() => setSelectedMethod('biometric')}
          className="mb-4 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
              <svg 
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Biometric Authentication</h3>
              <p className="text-sm text-gray-600">Use your fingerprint, Face ID, or Windows Hello</p>
            </div>
            <div className="text-purple-600">
              <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div 
        onClick={() => setSelectedMethod('pin')}
        className="mb-6 p-4 rounded-xl border-2 border-green-200 hover:border-green-300 cursor-pointer transition-all group"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
            <svg className="text-green-600 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">PIN Authentication</h3>
            <p className="text-sm text-gray-600">Create a secure 4-6 digit PIN</p>
          </div>
          <div className="text-green-600">
            <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {selectedMethod === 'biometric' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <svg className="text-purple-600 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-purple-800">Biometric Setup</span>
            </div>
            <button
              onClick={() => setSelectedMethod(null)}
              className="text-purple-600 hover:text-purple-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
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
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                <span>Enable Biometric Authentication</span>
              </>
            )}
          </button>
        </div>
      )}

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

// ===== LOGIN FORM COMPONENT =====

const LoginForm: React.FC<{
  onSubmit: (credentials: LoginFormData) => Promise<boolean>;
  isLoading: boolean;
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
}> = ({ onSubmit, isLoading, selectedRole, onRoleChange }) => {
  const [credentials, setCredentials] = useState<LoginFormData>({
    username: '',
    password: '',
    useBiometric: false,
    rememberMe: true,
  });

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    WebAuthnHelper.isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  useEffect(() => {
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
        await onSubmit({ ...credentials, useBiometric: true });
      } else {
        toast.error(result.error || 'Biometric authentication failed');
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
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-sm">Sign in to your {selectedRole === 'student' ? 'student' : 'restaurant'} account</p>
      </div>

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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-sm font-medium">Restaurant</span>
          </button>
        </div>
      </div>

      {biometricAvailable && biometricRegistered && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <>
                <svg className="text-blue-600 w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span className="font-semibold text-gray-700">Authenticating…</span>
              </>
            ) : (
              <>
                <svg className="text-green-600 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
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
        <input
          type="text"
          name="username"
          placeholder={selectedRole === 'student' ? 'Username' : 'Restaurant name'}
          value={credentials.username}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />

        {!credentials.useBiometric && (
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
              required={!credentials.useBiometric}
            />
            {AuthAPI.IS_MOCK && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Demo Credentials:</strong><br />
                  Student: Password is "<code className="bg-blue-200 px-1 rounded">student</code>"<br />
                  Restaurant: Password is "<code className="bg-blue-200 px-1 rounded">restaurant</code>"
                </p>
              </div>
            )}
          </div>
        )}

        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="rememberMe"
            checked={!!credentials.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>Remember me</span>
        </label>

        <button
          type="submit"
          disabled={isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading || isAuthenticating || (!credentials.password && !credentials.useBiometric)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
          }`}
        >
          {(isLoading || isAuthenticating) ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{isAuthenticating ? 'Authenticating...' : 'Signing in...'}</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
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

// ===== RESTAURANT REQUEST COMPONENT =====

const RestaurantRequest: React.FC<{
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
  onComplete?: () => void;
}> = ({ selectedRole, onRoleChange, onComplete }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessAddress: '',
    city: '',
    state: '',
    businessType: '',
    establishmentYear: '',
    message: '',
    preferredContact: 'email',
    urgent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    'Restaurant', 'Cafe', 'Fast Food', 'Fine Dining', 'Food Truck',
    'Bar & Grill', 'Bakery', 'Catering', 'Delivery Only', 'Takeout Only'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);

      setTimeout(() => {
        onComplete?.();
      }, 2500);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="text-3xl text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted Successfully!</h2>
          <p className="text-green-100 text-lg">
            Thank you for your interest in joining our platform.
          </p>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What happens next?</h3>
              <p className="text-gray-600">
                Our team will review your request and contact you within <strong>24 hours</strong> to assist with your restaurant registration.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <svg className="text-blue-600 w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-1">Team Review</h4>
                <p className="text-sm text-gray-600">We verify your business information</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <svg className="text-green-600 w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-1">Personal Contact</h4>
                <p className="text-sm text-gray-600">We call you to discuss registration</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <svg className="text-purple-600 w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-1">Account Setup</h4>
                <p className="text-sm text-gray-600">We help create your restaurant account</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <svg className="text-yellow-600 w-5 h-5 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Expected Response Time</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Initial confirmation email: Within 1 hour</li>
                    <li>• Personal contact attempt: Within 24 hours</li>
                    <li>• Complete setup process: 2-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Need to reach us immediately? Call us at{' '}
                <a href="tel:+1-555-123-4567" className="text-blue-600 font-semibold hover:underline">
                  +1 (555) 123-4567
                </a>
              </p>
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Request Restaurant Registration</h2>
            <p className="text-blue-100 text-lg mb-4">
              Our team will help you set up your restaurant account
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="text-blue-200 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
                </svg>
                <span>Personal assistance</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="text-blue-200 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                </svg>
                <span>Expert guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="text-blue-200 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Quick setup</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={() => onRoleChange('student')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedRole === 'student'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('restaurant')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedRole === 'restaurant'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            Restaurant Owner
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your restaurant name"
              required
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your full name"
              required
            />
            {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="contact@yourrestaurant.com"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="+1 (555) 123-4567"
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
          <input
            type="text"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="123 Main Street"
            required
          />
          {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your city"
              required
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your state"
              required
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 ${errors.businessType ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
            <input
              type="number"
              name="establishmentYear"
              value={formData.establishmentYear}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us more about your restaurant, menu, services, or any special requirements..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
            <select
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="urgent"
              checked={formData.urgent}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              This request is urgent (within 24 hours)
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting Request...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Submit Registration Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ===== DASHBOARD COMPONENT =====

const Dashboard: React.FC<{ userRole: 'student' | 'restaurant' }> = ({ userRole }) => {
  const { user, logout, updateUser, refreshAuth } = useAuth();

  const handleRemoveBiometric = () => {
    if (!user) return;
    WebAuthnHelper.removeBiometric(user.username);
    updateUser({ biometricRegistered: false });
    toast.success('Biometric credentials removed for this device.');
  };

  const handleRefreshSession = async () => {
    const ok = await refreshAuth();
    if (ok) {
      toast.success('Session refreshed');
    } else {
      toast.error('Could not refresh session');
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          userRole === 'student' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <svg className={`w-10 h-10 ${userRole === 'student' ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome {userRole === 'student' ? 'Student' : 'Restaurant Owner'}!
        </h2>
        <p className="text-gray-600">
          {user?.username} - Your account is ready to use
        </p>
        {user?.lastLoginAt && (
          <p className="text-xs text-gray-500 mt-1">Last login: {new Date(user.lastLoginAt).toLocaleString()}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Account Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Email Verified:</span>
              <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                {user?.emailVerified ? '✅ Verified' : '❌ Not Verified'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Biometric Setup:</span>
              <span className={`font-medium ${user?.biometricRegistered ? 'text-green-600' : 'text-amber-600'}`}>
                {user?.biometricRegistered ? '✅ Enabled' : '⚠️ Not Set'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Account Type:</span>
              <span className={`font-medium capitalize ${userRole === 'student' ? 'text-blue-600' : 'text-green-600'}`}>
                {user?.role}
              </span>
            </div>
            {user?.phone && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Phone:</span>
                <span className="font-medium text-gray-700">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleRefreshSession}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Session</span>
          </button>

          {user?.biometricRegistered && (
            <button
              onClick={handleRemoveBiometric}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 8a4 4 0 118 0v2a2 2 0 012 2v4H4v-4a2 2 0 012-2V8zm8-2a6 6 0 10-12 0v2H2v6a2 2 0 002 2h12a2 2 0 002-2v-6h-2V6z" clipRule="evenodd" />
              </svg>
              <span>Remove Biometric</span>
            </button>
          )}
        </div>

        <div className="text-center space-y-3">
          <p className="text-gray-600 text-sm">
            🎉 Your account is successfully created and ready to use!
          </p>
          
          <button
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== EXPORTS =====

export {
  Signup,
  AuthProvider,
  RoleSelection,
  SignUpForm,
  EmailVerification,
  BiometricPrompt,
  LoginForm,
  RestaurantRequest,
  Dashboard,
  AuthErrorBoundary,
};

export default Signup;
