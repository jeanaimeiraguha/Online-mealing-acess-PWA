import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBill, FaInfoCircle } from 'react-icons/fa';
import { pageMotion } from '../utils/animations';

const LoansPage = () => (
  <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Student Loans</h2>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-6 shadow-xl text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FaMoneyBill className="text-4xl sm:text-5xl" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Coming Soon!</h3>
        <p className="text-base sm:text-lg text-white/90 mb-2">Quick and easy student meal loans</p>
        <p className="text-sm sm:text-base text-white/80">Get instant access to meals when you need them most. Interest-free options available for students.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><p className="text-sm font-bold">Instant Approval</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">🆓</div><p className="text-sm font-bold">0% Interest</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">📅</div><p className="text-sm font-bold">Flexible Repayment</p></div>
        </div>
      </motion.div>
      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-green-600 dark:text-green-400 text-xl flex-shrink-0 mt-1" />
          <div><h4 className="font-bold text-gray-900 dark:text-white mb-2">Financial Support for Students</h4><p className="text-sm text-gray-600 dark:text-gray-400">We understand student life can be challenging. Check back soon for launch details!</p></div>
        </div>
      </div>
    </div>
  </motion.section>
);

export default LoansPage;
