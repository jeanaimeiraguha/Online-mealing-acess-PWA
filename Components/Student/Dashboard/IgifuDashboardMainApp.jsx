import React from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaUserCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { tapAnimation, hoverScale } from './utils/animations';

import MyIgifuPage from './pages/MyIgifuPage';
import RestozPage from './pages/RestozPage';
import EarnPage from './pages/EarnPage';
import LoansPage from './pages/LoansPage';
import MorePage from './pages/MorePage';
import useApp from "./useApp";
import Modals from "./Modals";

function IgifuDashboardMainApp() {
  const {
    activePage, setActivePage, greeting, showToast, toast,
    handleOrder,
    purchasedPlans, selectedCard, wallets, isCardLocked,
    handleTopUp, handleBuyCardClick, setShowUnlockModal,
    setShowExchangeModal, handleManualUnlock, handleUseMeal,
    setSelectedPlanDetails, setShowPlanDetails, setSelectedSharePlan,
    setShowShareModal, setSelectedCard, setWallets, setPurchasedPlans,
    darkMode, setDarkMode, setShowAndroidPrompt,
    ...modalProps
  } = useApp();

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12] transition-colors duration-300">
      {/* Header */}
      <header className="relative sticky top-0 z-40 shadow-lg bg-gray-900 text-white">
        <div className="absolute inset-0">
             {/* <img src="/mnt/data/gtuu.JPG" alt="header-bg" className="w-full h-full object-cover opacity-60" /> */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div> 
        <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div whileTap={tapAnimation} className="text-2xl bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-lg">🍽️</motion.div>
            <div><div className="text-xs opacity-90">{greeting}</div><div className="font-bold">Welcome, Student</div></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => setActivePage("Restoz")} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"><FaSearch className="text-sm sm:text-lg" /></motion.button>
            <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => showToast('You have 3 new notifications', 'info')} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all relative">
              <FaBell className="text-sm sm:text-lg" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>
            <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => setActivePage("More")} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"><FaUserCircle className="text-sm sm:text-lg" /></motion.button>
          </div>
        </div>
      </header>

      {/* Info Ticker */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-3 shadow-md">
        <div className="mx-auto w-full max-w-6xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse shrink-0" />
          <span className="font-bold text-base truncate">🎉 New payment options! Enjoy no-fee top-ups and instant card unlocking. Share meals with friends!</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && (
            <MyIgifuPage 
              key="home" 
              purchasedPlans={purchasedPlans}
              selectedCard={selectedCard}
              wallets={wallets}
              isCardLocked={isCardLocked}
              handleTopUp={handleTopUp}
              handleBuyCardClick={handleBuyCardClick}
              setShowUnlockModal={setShowUnlockModal}
              setShowExchangeModal={setShowExchangeModal}
              handleManualUnlock={handleManualUnlock}
              showToast={showToast}
              handleUseMeal={handleUseMeal}
              setSelectedPlanDetails={setSelectedPlanDetails}
              setShowPlanDetails={setShowPlanDetails}
              setSelectedSharePlan={setSelectedSharePlan}
              setShowShareModal={setShowShareModal}
              setSelectedCard={setSelectedCard}
            />
          )}
          {activePage === "Restoz" && <RestozPage key="restoz" showToast={showToast} onOrder={handleOrder} />}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && (
            <MorePage 
              key="more" 
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              isCardLocked={isCardLocked}
              setIsCardLocked={setIsCardLocked}
              setWallets={setWallets}
              setPurchasedPlans={setPurchasedPlans}
              showToast={showToast}
              setActivePage={setActivePage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              handleManualUnlock={handleManualUnlock}
              setShowAndroidPrompt={setShowAndroidPrompt}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/10 py-2 z-40">
        <div className="mx-auto w-full max-w-6xl flex justify-around">
          {[
            { n: "Restoz", i: <FaUtensils />, label: "Restaurants" },
            { n: "Earn", i: <FaGift />, label: "Rewards" },
            { n: "MyIgifu", i: <FaWallet />, label: "Card" },
            { n: "Loans", i: <FaMoneyBill />, label: "Loans" },
            { n: "More", i: <FaEllipsisH />, label: "More" }
          ].map(t => {
            const isActive = activePage === t.n;
            return (
              <motion.button key={t.n} onClick={() => setActivePage(t.n)} whileTap={tapAnimation} className={`flex flex-col items-center p-2 relative transition-all ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} className="text-2xl mb-1">{t.i}</motion.div>
                <span className="text-[10px] font-bold">{t.label}</span>
                {isActive && <motion.div layoutId="nav_indicator" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />}
              </motion.button>
            );
          })}
        </div>
      </nav>

      <Modals {...modalProps} />
    </div>
  );
}

export default IgifuDashboardMainApp;
