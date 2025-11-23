import React from 'react';
import { motion } from 'framer-motion';
import { FaGift } from 'react-icons/fa';
import { pageMotion } from '../utils/animations';

const EarnPage = () => (
  <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Earn Rewards</h2>
      <motion.div key="earn-coming-soon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-6 shadow-xl text-center"
      >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaGift className="text-4xl sm:text-5xl" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Rewards are Coming Soon!</h3>
          <p className="text-base sm:text-lg text-white/90">We're preparing an exciting rewards program for you.</p>
      </motion.div>
    </div>
  </motion.section>
);

export default EarnPage;
