import React, { useState } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUpload, FaSpinner, FaCheck, FaUser } from 'react-icons/fa';
import { MdBusiness, MdStore, MdAccessTime, MdAttachMoney } from 'react-icons/md';
import { SignUpFormData } from '@/types';

interface RestaurantRegistrationProps {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
}

export const RestaurantRegistration: React.FC<RestaurantRegistrationProps> = ({
  onSubmit,
  isLoading,
  selectedRole,
  onRoleChange,
}) => {
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    website: '',
    
    // Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Business Details
    description: '',
    cuisineType: '',
    priceRange: '',
    establishedYear: '',
    
    // Owner Info
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    
    // Additional
    logo: null as File | null,
    agreeToTerms: false,
    newsletter: false,
  });

  const [errors, setErrors] = useState<any>({});

  const cuisineTypes = [
    'American', 'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese',
    'Thai', 'French', 'Mediterranean', 'Korean', 'Vietnamese', 'Spanish',
    'Greek', 'Turkish', 'Lebanese', 'Brazilian', 'Other'
  ];

  const businessTypes = [
    'Restaurant', 'Cafe', 'Fast Food', 'Fine Dining', 'Food Truck',
    'Bar & Grill', 'Bakery', 'Catering', 'Delivery Only', 'Takeout Only'
  ];

  const priceRanges = [
    '$ - Budget Friendly',
    '$$ - Moderate',
    '$$$ - Expensive',
    '$$$$ - Very Expensive'
  ];

  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Business Name
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    // Business Type
    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    // Email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Address
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    // Owner Info
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Transform form data to match SignUpFormData interface
      const signUpData: SignUpFormData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'restaurant',
        agreeToTerms: formData.agreeToTerms,
      };
      onSubmit(signUpData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, logo: file }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Register Your Restaurant</h2>
            <p className="text-blue-100">Join our network and start serving customers today</p>
          </div>
          <div className="hidden md:block">
            <img 
              src="/src/assets/restaurant-ui-design.jpeg" 
              alt="Restaurant Registration" 
              className="w-32 h-32 rounded-xl object-cover border-4 border-white/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="flex space-x-4">
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

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Business Information Section */}
        <div>
          <div className="flex items-center mb-4">
            <MdBusiness className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Business Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your restaurant name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <div className="relative">
                <MdStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 appearance-none ${
                    errors.businessType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.businessType && (
                <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="restaurant@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <div className="relative">
                <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourrestaurant.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select cuisine type</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="relative">
                <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select price range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <div className="relative">
                <MdAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your restaurant..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div>
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Business Address</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.streetAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="NY"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="10001"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Owner Information Section */}
        <div>
          <div className="flex items-center mb-4">
            <FaUser className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Owner Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Smith"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johnsmith123"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Logo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.logo ? formData.logo.name : 'Click to upload logo'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
            )}

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Subscribe to our newsletter for updates and promotional offers
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Registering Restaurant...</span>
            </>
          ) : (
            <>
              <FaCheck />
              <span>Register Restaurant</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};