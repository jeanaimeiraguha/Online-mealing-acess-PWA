import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaChevronRight, FaLock, FaUnlock, FaAndroid, FaHeadset, FaSignOutAlt } from 'react-icons/fa';
import { pageMotion, tapAnimation } from '../utils/animations';

const MorePage = ({
  selectedCard,
  setSelectedCard,
  isCardLocked,
  setIsCardLocked,
  setWallets,
  setPurchasedPlans,
  showToast,
  setActivePage,
  darkMode,
  setDarkMode,
  handleManualUnlock,
  setShowAndroidPrompt
}) => (
  <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Settings & More</h2>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"><FaUserCircle className="text-4xl" /></div>
          <div><h3 className="text-xl font-bold">Student Name</h3><p className="text-blue-100 text-sm">ID: STU2024001</p><p className="text-blue-100 text-sm">Campus: Huye</p></div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={tapAnimation} onClick={() => showToast('Profile settings coming soon!', 'info')} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3"><FaUserCircle className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Edit Profile</span></div>
          <FaChevronRight className="text-gray-400" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="text-xl sm:text-2xl">🌙</div><span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Dark Mode</span></div>
          <motion.button whileTap={tapAnimation} onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
            <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm" style={{ marginLeft: darkMode ? '20px' : '0px' }} />
          </motion.button>
        </motion.div>

        {selectedCard === "Meal Card" && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={tapAnimation} onClick={isCardLocked ? handleManualUnlock : () => setIsCardLocked(true)} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">{isCardLocked ? <FaLock className="text-xl sm:text-2xl text-red-600 dark:text-red-400" /> : <FaUnlock className="text-xl sm:text-2xl text-green-600 dark:text-green-400" />}<span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Card {isCardLocked ? 'Locked' : 'Unlocked'}</span></div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCardLocked ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>{isCardLocked ? 'Tap to Unlock' : 'Tap to Lock'}</span>
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={tapAnimation} onClick={() => setShowAndroidPrompt(true)} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3"><FaAndroid className="text-xl sm:text-2xl text-green-600 dark:text-green-400" /><span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Download Android App</span></div>
          <FaChevronRight className="text-gray-400" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={tapAnimation} onClick={() => showToast('Help & Support coming soon!', 'info')} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3"><FaHeadset className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Help & Support</span></div>
          <FaChevronRight className="text-gray-400" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={tapAnimation} onClick={() => { setSelectedCard("No Card"); setIsCardLocked(false); setWallets({ meal: 0, flexie: 0 }); setPurchasedPlans([]); showToast('Logged out successfully', 'info'); setActivePage("Restoz"); }} className="bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl p-4 border border-red-200 dark:border-red-700 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3"><FaSignOutAlt className="text-xl sm:text-2xl text-red-600 dark:text-red-400" /><span className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">Sign Out</span></div>
          <FaChevronRight className="text-red-400" />
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default MorePage;
