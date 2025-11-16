const WebAuthnHelper = {
  isSupported: () =>
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
  randomBytes: (len = 32) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  },

  rpId: () => window.location.hostname,

  async registerBiometric(username) {
    // For demo, store in localStorage; normally, send to server
    const challenge = WebAuthnHelper.randomBytes(32);
    const userId = WebAuthnHelper.randomBytes(32);
    const publicKey = {
      challenge,
      rp: { name: "Igifu App", id: WebAuthnHelper.rpId() },
      user: {
        id: userId,
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "none",
    };
    try {
      const cred = await navigator.credentials.create({ publicKey });
      if (!cred) return { success: false, error: "No credential returned." };
      const credentialId = WebAuthnHelper.toBase64Url(cred.rawId);
      localStorage.setItem("biometric_" + username, credentialId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Registration failed." };
    }
  },

  async authenticateBiometric(username) {
    const credentialId = localStorage.getItem("biometric_" + username);
    if (!credentialId) return { success: false, error: "No biometric registered." };

    const publicKey = {
      challenge: WebAuthnHelper.randomBytes(32),
      rpId: WebAuthnHelper.rpId(),
      allowCredentials: [
        {
          id: WebAuthnHelper.fromBase64Url(credentialId),
          type: "public-key",
          transports: ["internal"],
        },
      ],
      userVerification: "required",
      timeout: 60000,
    };
    try {
      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) return { success: true };
      return { success: false, error: "Auth failed." };
    } catch (err) {
      return { success: false, error: err.message || "Auth failed." };
    }
  },

  isBiometricRegistered(username) {
    return !!localStorage.getItem("biometric_" + username);
  },
};

export default WebAuthnHelper;
