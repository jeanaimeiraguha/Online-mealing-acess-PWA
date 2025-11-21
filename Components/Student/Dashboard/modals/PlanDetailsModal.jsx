import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheckSquare, FaUtensils, FaCheckCircle } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const PlanDetailsModal = ({ plan, onClose, onUseMeal }) => {
  if (!plan) return null;

  const usedCount = plan.usedMeals.length;
  const remaining = plan.totalMeals - usedCount;
  const nextMealIndex = Array.from({ length: plan.totalMeals }).findIndex((_, i) => !plan.usedMeals.includes(i));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white relative">
          <motion.button whileTap={tapAnimation} onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
            <FaTimes className="text-xl" />
          </motion.button>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 pr-12">{plan.restaurantName}</h2>
          <p className="text-blue-100 text-sm sm:text-base">{plan.planType} Meal Plan</p>
        </div>

        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{plan.totalMeals}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Meals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{usedCount}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Used</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">{remaining}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Remaining</div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Meal Tracker</h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 mb-6">
            {Array.from({ length: plan.totalMeals }).map((_, index) => {
              const isUsed = plan.usedMeals.includes(index);
              return (
                <motion.button key={index} whileHover={{ scale: isUsed ? 1 : 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => !isUsed && onUseMeal(plan.id, index)} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${isUsed ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 border-2 border-dashed border-gray-300 dark:border-gray-600'}`} disabled={isUsed}>
                  {isUsed ? <FaCheckSquare className="text-xl sm:text-2xl" /> : <><FaUtensils className="text-base sm:text-lg mb-1" /><span className="text-[10px] font-bold">{index + 1}</span></>}
                </motion.button>
              );
            })}
          </div>

          {nextMealIndex !== -1 && (
            <motion.button whileTap={tapAnimation} whileHover={{ scale: 1.02 }} onClick={() => onUseMeal(plan.id, nextMealIndex)} className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
              <FaCheckCircle /> Use Next Meal (Meal {nextMealIndex + 1})
            </motion.button>
          )}

          {remaining === 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center">
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Plan Completed!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">You've used all meals in this plan. Purchase a new one to continue.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Purchase Date</span>
            <span className="font-semibold text-gray-900 dark:text-white">{new Date(plan.purchaseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Expiry Date</span>
            <span className="font-semibold text-gray-900 dark:text-white">{new Date(plan.expiryDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
            <span className="font-bold text-lg text-blue-600">RWF {formatAmount(plan.price)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanDetailsModal;
