import React from 'react';
import { motion } from 'framer-motion';
import { FaAndroid } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';

const AndroidPromptModal = ({ onDownload, onContinue }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaAndroid className="text-white text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get the Android App</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          For the best experience, download our Android app. You can also continue with the web version.
        </p>
        <div className="flex gap-3">
          <motion.button whileTap={tapAnimation} onClick={onContinue} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold">
            Continue on Web
          </motion.button>
          <motion.a whileTap={tapAnimation} href="https://example.com/igifu.apk" onClick={onDownload} className="flex-[2] py-3 bg-green-600 text-white rounded-xl font-bold text-center">
            Download App
          </motion.a>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">You can download later from settings too.</p>
      </motion.div>
    </motion.div>
  );
};

export default AndroidPromptModal;
