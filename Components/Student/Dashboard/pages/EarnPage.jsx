import React from 'react';
import { motion } from 'framer-motion';
import { FaGift, FaInfoCircle } from 'react-icons/fa';
import { pageMotion } from '../utils/animations';

const EarnPage = () => (
  <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Earn Rewards</h2>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-6 shadow-xl text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FaGift className="text-4xl sm:text-5xl" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Coming Soon!</h3>
        <p className="text-base sm:text-lg text-white/90 mb-2">Exciting rewards program is on the way</p>
        <p className="text-sm sm:text-base text-white/80">Earn points with every meal purchase and redeem for amazing rewards, free meals, and exclusive discounts.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">🎁</div><p className="text-sm font-bold">Free Meals</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">💰</div><p className="text-sm font-bold">Discounts</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">⭐</div><p className="text-sm font-bold">Exclusive Perks</p></div>
        </div>
      </motion.div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-1" />
          <div><h4 className="font-bold text-gray-900 dark:text-white mb-2">Stay Tuned!</h4><p className="text-sm text-gray-600 dark:text-gray-400">We're working hard to bring you an amazing rewards experience.</p></div>
        </div>
      </div>
    </div>
  </motion.section>
);

export default EarnPage;
