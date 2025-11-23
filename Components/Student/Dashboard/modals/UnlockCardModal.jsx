import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner, FaUnlock } from 'react-icons/fa';
import { modalMotion, shakeAnimation, tapAnimation } from '../utils/animations';

const UnlockCardModal = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    if (pin.length < 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setProcessing(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));

    if (pin === '1234') {
      onSuccess();
    } else {
      setAttempts(a => a + 1);
      setError('Wrong PIN. Try again.');
      setPin('');
    }
    setProcessing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
        <motion.div animate={error ? shakeAnimation : {}} className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FaLock className="text-2xl sm:text-3xl text-white" />
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Your Card</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          Enter your 4-digit PIN to unlock (Use 1234 for demo)
        </p>
        <input
          type="password"
          value={pin}
          onChange={e => {
            setError('');
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
          }}
          maxLength={4}
          className="w-full h-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono tracking-widest bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl mb-2 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500"
          placeholder="••••"
          autoFocus
        />
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs sm:text-sm mb-4">
            {error} {attempts > 0 && `(${3 - attempts} attempts remaining)`}
          </motion.p>
        )}
        <div className="flex gap-3 mt-6">
          {onCancel && (
            <motion.button whileTap={tapAnimation} onClick={onCancel} className="flex-1 py-3 sm:py-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base">
              Cancel
            </motion.button>
          )}
          <motion.button whileTap={tapAnimation} onClick={handleUnlock} disabled={processing || pin.length < 4} className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base flex items-center justify-center gap-2">
            {processing ? <><FaSpinner className="animate-spin" /> Unlocking...</> : <><FaUnlock /> Unlock</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnlockCardModal;
