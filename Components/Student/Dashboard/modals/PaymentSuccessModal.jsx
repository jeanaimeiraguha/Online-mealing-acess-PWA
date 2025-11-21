import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { successAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const PaymentSuccessModal = ({ amount, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div variants={successAnimation} initial="initial" animate="animate" className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 1, repeat: 1, repeatType: "reverse" }} className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-white text-4xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">RWF {formatAmount(amount)} added to your Meal Wallet.</p>
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className="h-1 bg-green-500 rounded-full mt-4" />
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccessModal;
