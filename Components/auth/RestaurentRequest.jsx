import React, { useState } from 'react';
import { FaBuilding, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner, FaCheck, FaPhoneAlt, FaHeadphones } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

interface RestaurantRequestProps {
  selectedRole: 'student' | 'restaurant';
  onRoleChange: (role: 'student' | 'restaurant') => void;
  onComplete?: () => void;
}

export const RestaurantRequest: React.FC<RestaurantRequestProps> = ({
  selectedRole,
  onRoleChange,
  onComplete,
}) => {
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
  const [errors, setErrors] = useState<any>({});

  const businessTypes = [
    'Restaurant', 'Cafe', 'Fast Food', 'Fine Dining', 'Food Truck',
    'Bar & Grill', 'Bakery', 'Catering', 'Delivery Only', 'Takeout Only'
  ];

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      
      // Call completion handler after a short delay
      setTimeout(() => {
        onComplete?.();
      }, 3000);
      
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-3xl text-white" />
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
                <FaHeadphones className="text-blue-600 text-2xl mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Team Review</h4>
                <p className="text-sm text-gray-600">We verify your business information</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <FaPhoneAlt className="text-green-600 text-2xl mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Personal Contact</h4>
                <p className="text-sm text-gray-600">We call you to discuss registration</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <FaCheck className="text-purple-600 text-2xl mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Account Setup</h4>
                <p className="text-sm text-gray-600">We help create your restaurant account</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <FaClock className="text-yellow-600 text-xl mt-1" />
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Request Restaurant Registration</h2>
            <p className="text-blue-100 text-lg mb-4">
              Our team will help you set up your restaurant account
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <HiChatBubbleLeftRight className="text-blue-200" />
                <span>Personal assistance</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHeadphones className="text-blue-200" />
                <span>Expert guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheck className="text-blue-200" />
                <span>Quick setup</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/src/assets/restaurant-request-design.jpeg" 
              alt="Restaurant Registration Request" 
              className="w-32 h-32 rounded-xl object-cover border-4 border-white/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Role Selection */}
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
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HiChatBubbleLeftRight className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">How It Works</h3>
              <p className="text-blue-700 mb-3">
                Instead of filling out complex forms, simply share your basic information with our team. 
                We'll contact you personally to guide you through the entire registration process.
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Save time with personalized assistance</li>
                <li>• Get expert help with business verification</li>
                <li>• Quick setup process (24-48 hours)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant/Business Name *
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Restaurant Name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.ownerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.ownerName && (
                <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
          </div>

          {/* Preferred Contact Method */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Contact Method
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="preferredContact"
                  value="email"
                  checked={formData.preferredContact === 'email'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <FaEnvelope className="text-gray-400" />
                <span>Email</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="preferredContact"
                  value="phone"
                  checked={formData.preferredContact === 'phone'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <FaPhone className="text-gray-400" />
                <span>Phone Call</span>
              </label>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div>
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Business Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Address *
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.businessAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>
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

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 appearance-none ${
                  errors.businessType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
              )}
            </div>

            {/* Establishment Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Established
              </label>
              <input
                type="number"
                name="establishmentYear"
                value={formData.establishmentYear}
                onChange={handleInputChange}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <div className="flex items-center mb-6">
            <HiChatBubbleLeftRight className="text-blue-600 text-xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
          </div>
          
          <div className="space-y-6">
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your restaurant and any specific requirements
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Cuisine type, operating hours, special services, etc."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Urgent Request */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleInputChange}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <div>
                <label className="text-sm font-medium text-gray-700">
                  This is an urgent request
                </label>
                <p className="text-xs text-gray-500">
                  Check this if you need to start taking orders immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Sending Request...</span>
            </>
          ) : (
            <>
              <FaPaperPlane />
              <span>Submit Registration Request</span>
            </>
          )}
        </button>

        {/* Support Info */}
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">Need Immediate Help?</h4>
          <p className="text-gray-600 text-sm mb-3">
            Our support team is available to assist you right now
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="tel:+1-555-123-4567" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <FaPhone className="text-xs" />
              <span>Call: (555) 123-4567</span>
            </a>
            <a href="mailto:support@youware.com" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <FaEnvelope className="text-xs" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};