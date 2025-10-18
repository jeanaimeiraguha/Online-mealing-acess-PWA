import React, { useState } from "react";
import { FaLock, FaArrowRight, FaQuestionCircle, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: "",
    username: "",
    email: "",
    pin: "",
    confirmPin: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // pretend login success
      navigate("/igifu-dashboard");
    } else {
      alert("Sign Up Submitted!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative py-6 font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition flex items-center"
      >
        <span className="mr-2">←</span> Back
      </button>

      {/* Header */}
      <div className="text-center mt-12">
        <h4 className="font-bold mb-1">
          <button
            className={`mr-2 ${!isLogin ? "text-blue-600" : "text-gray-800"}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          |
          <button
            className={`ml-2 ${isLogin ? "text-blue-600" : "text-gray-800"}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
        </h4>
        <p className="text-gray-500 text-sm">
          {isLogin ? "Welcome back!" : "Sign up for Free :)"}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Other name(s)"
              name="otherNames"
              value={formData.otherNames}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 pr-10 focus:ring-2 focus:ring-blue-500"
                required
              />
              <FaQuestionCircle className="absolute top-1/2 right-3 -translate-y-1/2 text-yellow-500" />
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </>
        )}

        {isLogin && (
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div className="relative flex items-center">
          <FaLock className="absolute left-3 text-green-500" />
          <input
            type="password"
            placeholder={isLogin ? "Enter PIN" : "Create PIN"}
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          <FaQuestionCircle className="absolute right-3 text-yellow-500" />
        </div>

        {!isLogin && (
          <div className="relative flex items-center">
            <FaLock className="absolute left-3 text-green-500" />
            <input
              type="password"
              placeholder="Retype PIN"
              name="confirmPin"
              value={formData.confirmPin}
              onChange={handleChange}
              className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <FaQuestionCircle className="absolute right-3 text-yellow-500" />
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleCheckboxChange}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700 text-sm">Remember me</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold text-lg hover:bg-blue-700 transition"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        {!isLogin && (
          <p className="text-center text-gray-500 text-xs">
            By submitting, you agree to the{" "}
            <a href="/terms" className="text-blue-600 font-semibold underline">
              Terms of Use
            </a>
          </p>
        )}
      </form>

      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm mb-2">
          Want to register your restaurant? Contact us, we do all the work.
        </p>
        <button className="bg-transparent border border-blue-600 text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition flex items-center mx-auto">
          Contact Us <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
