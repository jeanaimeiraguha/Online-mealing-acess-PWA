import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMinus, FaPlus, FaShare, FaSpinner } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';

const ShareMealModal = ({ plan, onShare, onClose }) => {
  const [studentId, setStudentId] = useState('');
  const [mealsToShare, setMealsToShare] = useState(1);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const remainingMeals = plan.totalMeals - plan.usedMeals.length;

  const handleShare = async () => {
    if (!studentId || mealsToShare <= 0) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onShare(plan.id, studentId, mealsToShare, message);
    setProcessing(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Share Meals</h3>
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sharing from</p>
            <p className="font-bold text-gray-900 dark:text-white">{plan.restaurantName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{remainingMeals} meals remaining</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Friend's Student ID</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter student ID" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Number of Meals</label>
            <div className="flex items-center justify-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <motion.button whileTap={tapAnimation} onClick={() => setMealsToShare(m => Math.max(1, m - 1))} className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center font-bold">
                <FaMinus />
              </motion.button>
              <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">{mealsToShare}</span>
              <motion.button whileTap={tapAnimation} onClick={() => setMealsToShare(m => Math.min(remainingMeals, m + 1))} className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold">
                <FaPlus />
              </motion.button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Message (Optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a message..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={tapAnimation} onClick={onClose} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold">Cancel</motion.button>
            <motion.button whileTap={tapAnimation} onClick={handleShare} disabled={processing || !studentId} className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {processing ? <FaSpinner className="animate-spin" /> : <><FaShare /> Share {mealsToShare} Meal{mealsToShare > 1 ? 's' : ''}</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareMealModal;
