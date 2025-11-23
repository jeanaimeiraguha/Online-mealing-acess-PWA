import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExchangeAlt, FaWallet } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const SwapWalletsModal = ({ wallets, onClose, onConfirmSwap }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setAmount(value);
      if (Number(value) > wallets.meal) {
        setError('Amount exceeds Meal Wallet balance.');
      } else {
        setError('');
      }
    }
  };

  const handleConfirm = () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > wallets.meal) {
      setError('Please enter a valid amount.');
      return;
    }
    onConfirmSwap(Number(amount));
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#1c1c22] rounded-3xl overflow-hidden shadow-2xl text-white"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-center flex-1">Swap/Exchange FRW between Meal & Flexie Wallets</h2>
              <motion.button whileTap={tapAnimation} onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                <FaTimes />
              </motion.button>
            </div>

            <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-6 border border-gray-600">
              <option>Campus Bites Card</option>
            </select>

            <div className="flex items-center justify-around mb-6">
              <div className="text-center p-4 bg-gray-800 rounded-xl w-40">
                <p className="font-semibold">Meal Wallet</p>
                <p className="text-sm text-gray-400">Bal: {formatAmount(wallets.meal)} frw</p>
              </div>
              <FaExchangeAlt className="text-yellow-500 text-2xl" />
              <div className="text-center p-4 bg-gray-800 rounded-xl w-40">
                <p className="font-semibold">Flexie Wallet</p>
                <p className="text-sm text-gray-400">Bal: {formatAmount(wallets.flexie)} frw</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount to Swap/Exchange</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <motion.button
              whileTap={tapAnimation}
              onClick={handleConfirm}
              disabled={!!error || !amount}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Swap
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Swaps/Exchanges are unlimited! Don’t worry about swapping the right amount, you can reswap later.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwapWalletsModal;