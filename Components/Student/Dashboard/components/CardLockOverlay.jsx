import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUnlock } from 'react-icons/fa';

const CardLockOverlay = ({ onUnlock }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center z-20"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-2xl"
      >
        <FaLock className="text-3xl text-white" />
      </motion.div>
      <h3 className="text-white font-bold text-lg mb-2">Card Locked</h3>
      <p className="text-white/80 text-sm mb-4 text-center px-4">
        Unlock your card to access funds
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUnlock}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
      >
        <FaUnlock /> Unlock Now
      </motion.button>
    </motion.div>
  );
};

export default CardLockOverlay;
