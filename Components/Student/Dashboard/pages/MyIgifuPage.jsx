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
            onExchange={() => setShowExchangeModal(true)}
            onUnlock={handleManualUnlock}
          />
        </div>

      </div>
    </motion.section>
  );
};

export default MyIgifuPage;
