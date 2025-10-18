import React, { useState } from 'react';
import { FaArrowLeft, FaLock, FaEnvelope } from 'react-icons/fa';

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    pin: '',
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
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <button className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
        <p className="text-center text-gray-500 mb-6">Access your Igifu account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label htmlFor="pin" className="block text-gray-700 mb-1">
              PIN
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <input
                type="password"
                id="pin"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter PIN"
                className="w-full outline-none text-gray-700"
                required
              />
              <FaLock className="text-gray-400 ml-2" />
            </div>
          </div>

          {/* Forgot PIN */}
          <div className="text-right">
            <a href="/forgot-pin" className="text-blue-600 text-sm hover:underline">
              Forgot PIN?
            </a>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Log In
          </button>

          {/* Registration Link */}
          <p className="text-center text-gray-500 text-sm mt-2">
            Want to register your restaurant?{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact Us
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogInPage;
