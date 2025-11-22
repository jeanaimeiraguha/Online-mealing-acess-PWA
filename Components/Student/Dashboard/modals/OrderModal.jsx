import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const OrderModal = ({ isOpen, onRequestClose, restaurant, plan, qty, setQty, totalPrice, onSubmit, processing }) => {
  if (!isOpen || !restaurant) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaShoppingCart className="text-blue-500" />
            Confirm Subscription
          </h2>
          <motion.button whileTap={tapAnimation} onClick={onRequestClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <FaTimes className="text-gray-500" />
          </motion.button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <img src={restaurant.image} alt={restaurant.name} className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">You are subscribing to:</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">{plan}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">Quantity</span>
              <div className="flex items-center gap-3">
                <motion.button whileTap={tapAnimation} onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <FaMinus />
                </motion.button>
                <span className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center">{qty}</span>
                <motion.button whileTap={tapAnimation} onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <FaPlus />
                </motion.button>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
              <span className="font-bold text-gray-900 dark:text-white">RWF {formatAmount(totalPrice)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              This subscription will be paid from your Meal Wallet.
            </p>
          </div>

          <motion.button
            whileTap={tapAnimation}
            onClick={onSubmit}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaShoppingCart />
                Confirm & Pay
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderModal;
