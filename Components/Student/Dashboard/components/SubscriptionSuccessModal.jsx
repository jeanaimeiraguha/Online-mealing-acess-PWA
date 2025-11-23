import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const SubscriptionSuccessModal = ({ restaurantName, planName, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>
        <h3 className="text-xl font-bold mb-2">Subscription Successful!</h3>
        <p className="text-gray-600 mb-4">
          You have successfully subscribed to the <strong>{planName}</strong> for <strong>{restaurantName}</strong>.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaCheckCircle />
          Great!
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionSuccessModal;