import React from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaHistory, FaQrcode, FaGift } from 'react-icons/fa';
import QuickStats from '../components/QuickStats';
import LowBalanceWarning from '../components/LowBalanceWarning';
import DigitalMealCard from '../components/DigitalMealCard';
import MealPlanCard from '../components/MealPlanCard';
import { pageMotion, tapAnimation, hoverScale } from '../utils/animations';

const MyIgifuPage = ({
  purchasedPlans,
  selectedCard,
  wallets,
  isCardLocked,
  handleTopUp,
  handleBuyCardClick,
  setShowUnlockModal,
  setShowExchangeModal,
  handleManualUnlock,
  showToast,
  handleUseMeal,
  setSelectedPlanDetails,
  setShowPlanDetails,
  setSelectedSharePlan,
  setShowShareModal,
  setSelectedCard
}) => {
  const activePlansCount = purchasedPlans.filter(p => p.usedMeals.length < p.totalMeals).length;

  return (
    <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <DigitalMealCard
            selectedCard={selectedCard}
            wallets={wallets}
            isLocked={isCardLocked}
            onBuyCard={handleBuyCardClick}
            onTopUp={handleTopUp}
            onExchange={() => {
              if (isCardLocked) {
                showToast("Please unlock your card first", "warn");
                setShowUnlockModal(true);
                return;
              }
              setShowExchangeModal(true);
            }}
            onUnlock={handleManualUnlock}
          />
        </div>

        {selectedCard === "Meal Card" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
              <motion.button key="TopUp" whileHover={hoverScale} whileTap={tapAnimation} onClick={handleTopUp} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <FaCreditCard className="text-xl sm:text-2xl text-blue-500 mb-1 sm:mb-2 mx-auto" />
                <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Top Up</div>
              </motion.button>
              <motion.button key="History" whileHover={hoverScale} whileTap={tapAnimation} onClick={() => showToast('History coming soon!', 'info')} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <FaHistory className="text-xl sm:text-2xl text-purple-500 mb-1 sm:mb-2 mx-auto" />
                <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">History</div>
              </motion.button>
              <motion.button key="Scan" whileHover={hoverScale} whileTap={tapAnimation} onClick={() => showToast('Scan & Pay coming soon!', 'info')} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <FaQrcode className="text-xl sm:text-2xl text-green-500 mb-1 sm:mb-2 mx-auto" />
                <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Scan & Pay</div>
              </motion.button>
              <motion.button key="Rewards" whileHover={hoverScale} whileTap={tapAnimation} onClick={() => showToast('Rewards coming soon!', 'info')} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <FaGift className="text-xl sm:text-2xl text-yellow-500 mb-1 sm:mb-2 mx-auto" />
                <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Rewards</div>
              </motion.button>
            </div>

          </>
        )}
      </div>
    </motion.section>
  );
};

export default MyIgifuPage;
