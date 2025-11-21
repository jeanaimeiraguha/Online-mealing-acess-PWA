import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUtensils, FaMoneyBill } from 'react-icons/fa';
import { formatAmount } from '../utils/helpers';

const QuickStats = ({ wallets, activePlans, savedAmount }) => {
  const totalBalance = wallets.meal + wallets.flexie;
  const stats = [
    { label: 'Balance', value: `${formatAmount(totalBalance)}`, icon: FaWallet, color: 'purple', unit: 'RWF' },
    { label: 'Active Plans', value: activePlans, icon: FaUtensils, color: 'green', unit: '' },
    { label: 'Saved', value: `${formatAmount(savedAmount)}`, icon: FaMoneyBill, color: 'orange', unit: 'RWF' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
            <stat.icon className="text-base sm:text-lg text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            {stat.unit && <span className="text-[9px] sm:text-[10px]">{stat.unit} </span>}{stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
