import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import { tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const LowBalanceWarning = ({ balance, onTopUp }) => {
  if (balance >= 10000) return null;
  const isCritical = balance < 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-xl border-2 ${isCritical
        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
        }`}
    >
      <div className="flex items-start gap-3">
        <FaExclamationTriangle className={`text-2xl ${isCritical ? 'text-red-500' : 'text-yellow-500'} animate-bounce`} />
        <div className="flex-1">
          <h4 className={`font-bold mb-1 ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
            {isCritical ? '🚨 Critical: Low Balance!' : '⚠️ Balance Running Low'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            You only have <strong>RWF {formatAmount(balance)}</strong> left in your Meal Wallet. Top up to continue enjoying meals.
          </p>
          <motion.button
            whileTap={tapAnimation}
            onClick={onTopUp}
            className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}
          >
            Top Up Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LowBalanceWarning;
