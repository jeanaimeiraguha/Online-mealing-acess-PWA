import React, { useEffect, useState } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaUserCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { tapAnimation, hoverScale } from './utils/animations';
import { getMealCount, formatAmount } from './utils/helpers';

import AndroidPromptModal from './modals/AndroidPromptModal';
import EnhancedPaymentModal from './modals/EnhancedPaymentModal';
import PaymentSuccessModal from './modals/PaymentSuccessModal';
import UnlockCardModal from './modals/UnlockCardModal';
import WalletExchangeModal from './modals/WalletExchangeModal';
import ShareMealModal from './modals/ShareMealModal';
import PlanDetailsModal from './modals/PlanDetailsModal';

import MyIgifuPage from './pages/MyIgifuPage';
import RestozPage from './pages/RestozPage';
import EarnPage from './pages/EarnPage';
import LoansPage from './pages/LoansPage';
import MorePage from './pages/MorePage';

function IgifuDashboardMainApp() {
  const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "No Card");
  const [isCardLocked, setIsCardLocked] = useState(() => localStorage.getItem("cardLocked") === "true");
  const [activePage, setActivePage] = useState("Restoz");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [greeting, setGreeting] = useState("Hello");
  const [toast, setToast] = useState(null);

  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem("wallets");
    return saved ? JSON.parse(saved) : { meal: 5000, flexie: 2000 };
  });

  const [purchasedPlans, setPurchasedPlans] = useState(() => {
    const saved = localStorage.getItem("purchasedPlans");
    return saved ? JSON.parse(saved) : [];
  });

  const [showEnhancedPayment, setShowEnhancedPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentDefaultAmount, setPaymentDefaultAmount] = useState(10000);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [lastPaymentAmount, setLastPaymentAmount] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSharePlan, setSelectedSharePlan] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planQty, setPlanQty] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning ☀️");
    else if (hours < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("selectedCard", selectedCard);
    localStorage.setItem("cardLocked", isCardLocked.toString());
    localStorage.setItem("wallets", JSON.stringify(wallets));
    localStorage.setItem("purchasedPlans", JSON.stringify(purchasedPlans));
  }, [selectedCard, isCardLocked, wallets, purchasedPlans]);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent || "");
    const dismissed = localStorage.getItem("androidPromptDismissed") === "1";
    if (isAndroid && !dismissed) setShowAndroidPrompt(true);
  }, []);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuyCardClick = () => {
    setPaymentDefaultAmount(10000);
    setShowEnhancedPayment(true);
  };

  const handleTopUp = () => {
    if (isCardLocked) {
      showToast("Please unlock your card first", "warn");
      setShowUnlockModal(true);
      return;
    }
    setPaymentDefaultAmount(10000);
    setShowEnhancedPayment(true);
  };

  const handlePaymentComplete = (method, phone, amount) => {
    setWallets(prev => ({ ...prev, meal: prev.meal + amount }));
    setLastPaymentAmount(amount);
    setShowEnhancedPayment(false);
    setPaymentProcessing(false);
    setShowPaymentSuccess(true);
    showToast(`RWF ${formatAmount(amount)} has been added to your meal wallet.`, "success");
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccess(false);
    if (selectedCard === "No Card") {
      setSelectedCard("Meal Card");
      setIsCardLocked(true); // Lock the card on first purchase for security demo
      showToast("Card purchased! Please unlock it to use.", "info");
      setTimeout(() => setShowUnlockModal(true), 500); // Prompt unlock
    }
  };

  const handleUnlockSuccess = () => {
    setIsCardLocked(false);
    setShowUnlockModal(false);
    showToast("Card unlocked successfully! 🎉", "success");
  };

  const handleUnlockCancel = () => {
    setShowUnlockModal(false);
  };

  const handleManualUnlock = () => {
    setShowUnlockModal(true);
  };

  const handleWalletExchange = (from, to, amount) => {
    if (isCardLocked) {
      showToast("Please unlock your card first", "warn");
      setShowUnlockModal(true);
      return;
    }
    setWallets(prev => ({ ...prev, [from]: prev[from] - amount, [to]: prev[to] + amount }));
    showToast(`Exchanged RWF ${formatAmount(amount)} from ${from} to ${to}`, "success");
  };

  const handleShareMeal = (planId, studentId, meals, message) => {
    setPurchasedPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId) {
        const newUsed = [...plan.usedMeals];
        let cnt = 0;
        for (let i = 0; i < plan.totalMeals && cnt < meals; i++) {
          if (!newUsed.includes(i)) {
            newUsed.push(i);
            cnt++;
          }
        }
        return { ...plan, usedMeals: newUsed };
      }
      return plan;
    }));
    showToast(`Shared ${meals} meal${meals > 1 ? 's' : ''} with ${studentId}`, "success");
  };

  const handleOrder = (restaurant) => {
    if (selectedCard !== "Meal Card") {
      showToast("Please purchase a Meal Card first", "warn");
      setShowEnhancedPayment(true);
      return;
    }

    if (isCardLocked) {
      showToast("Please unlock your card to make purchases", "warn");
      setShowUnlockModal(true);
      return;
    }

    setSelectedRestaurant(restaurant);
    const firstPlan = Object.keys(restaurant.priceInfo || {})[0];
    setSelectedPlan(firstPlan);
    setPlanQty(1);
    setShowOrderModal(true);
  };

  const handleOrderPlacement = async () => {
    if (!selectedRestaurant || !selectedPlan) {
      showToast("Please select a plan", "warn");
      return;
    }

    const price = selectedRestaurant.priceInfo[selectedPlan] || 0;
    const total = price * planQty;

    if (wallets.meal < total) {
      showToast("Insufficient meal wallet balance. Please top up.", "warn");
      handleTopUp();
      return;
    }

    setOrderProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setWallets(prev => ({ ...prev, meal: prev.meal - total }));

    const newPlans = Array.from({ length: planQty }).map((_, i) => ({
      id: Date.now() + i,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      planType: selectedPlan,
      totalMeals: getMealCount(selectedPlan),
      usedMeals: [],
      purchaseDate: Date.now(),
      expiryDate: Date.now() + (selectedPlan === "Month" ? 30 : 15) * 24 * 60 * 60 * 1000,
      price
    }));
    setPurchasedPlans(prev => [...prev, ...newPlans]);

    setOrderProcessing(false);
    setShowOrderModal(false);

    const totalMeals = getMealCount(selectedPlan) * planQty;
    showToast(`Successfully purchased! ${totalMeals} meals added.`, "success");

    setTimeout(() => setActivePage("MyIgifu"), 500);
  };

  const handleUseMeal = (planId, mealIndex) => {
    setPurchasedPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId && !plan.usedMeals.includes(mealIndex)) {
        return { ...plan, usedMeals: [...plan.usedMeals, mealIndex].sort((a, b) => a - b) };
      }
      return plan;
    }));
    showToast(`Meal ${mealIndex + 1} used ✅`, "success");
  };

  const handleDownloadApp = () => {
    localStorage.setItem("androidPromptDismissed", "1");
    setShowAndroidPrompt(false);
  };

  const handleContinueWeb = () => {
    localStorage.setItem("androidPromptDismissed", "1");
    setShowAndroidPrompt(false);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12] transition-colors duration-300">
      {/* Header */}
      <header className="relative sticky top-0 z-40 shadow-lg bg-gray-900 text-white">
        <div className="absolute inset-0">
             <img src="/mnt/data/gtuu.JPG" alt="header-bg" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div whileTap={tapAnimation} className="text-2xl sm:text-3xl bg-white/20 backdrop-blur-md p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">🍽️</motion.div>
            <div><div className="text-[10px] sm:text-xs opacity-90">{greeting}</div><div className="text-sm sm:text-base font-bold">Welcome, Student</div></div>
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
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
        <div className="mx-auto w-full max-w-6xl flex items-center gap-2 sm:gap-3">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black animate-pulse shrink-0" />
          <span className="font-bold text-xs sm:text-sm truncate">🎉 New payment options! Enjoy no-fee top-ups and instant card unlocking. Share meals with friends!</span>
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
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{t.i}</motion.div>
                <span className="text-[9px] sm:text-[10px] font-bold">{t.label}</span>
                {isActive && <motion.div layoutId="nav_indicator" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {showAndroidPrompt && <AndroidPromptModal onDownload={handleDownloadApp} onContinue={handleContinueWeb} />}
        {showEnhancedPayment && <EnhancedPaymentModal defaultAmount={paymentDefaultAmount} onPay={handlePaymentComplete} onClose={() => setShowEnhancedPayment(false)} processing={paymentProcessing} setProcessing={setPaymentProcessing} />}
        {showPaymentSuccess && <PaymentSuccessModal amount={lastPaymentAmount} onClose={handlePaymentSuccessClose} />}
        {showUnlockModal && <UnlockCardModal onSuccess={handleUnlockSuccess} onCancel={handleUnlockCancel} />}
        {showExchangeModal && <WalletExchangeModal wallets={wallets} onExchange={handleWalletExchange} onClose={() => setShowExchangeModal(false)} />}
        {showShareModal && selectedSharePlan && <ShareMealModal plan={selectedSharePlan} onShare={handleShareMeal} onClose={() => { setShowShareModal(false); setSelectedSharePlan(null); }} />}
        {showPlanDetails && selectedPlanDetails && <PlanDetailsModal plan={selectedPlanDetails} onClose={() => { setShowPlanDetails(false); setSelectedPlanDetails(null); }} onUseMeal={handleUseMeal} />}
      </AnimatePresence>
    </div>
  );
}

export default IgifuDashboardMainApp;
