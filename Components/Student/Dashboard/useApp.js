import { useState, useEffect } from 'react';
import { getMealCount, formatAmount } from './utils/helpers';

const useApp = () => {
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
      setIsCardLocked(true);
      showToast("Card purchased! Please unlock it to use.", "info");
      setTimeout(() => setShowUnlockModal(true), 500);
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

  return {
    selectedCard, setSelectedCard, isCardLocked, setIsCardLocked, activePage, setActivePage, darkMode, setDarkMode, greeting, toast, showToast, wallets, setWallets, purchasedPlans, setPurchasedPlans, showEnhancedPayment, setShowEnhancedPayment, paymentProcessing, setPaymentProcessing, paymentDefaultAmount, showPaymentSuccess, lastPaymentAmount, showUnlockModal, setShowUnlockModal, showExchangeModal, setShowExchangeModal, showShareModal, setShowShareModal, selectedSharePlan, setSelectedSharePlan, showOrderModal, setShowOrderModal, selectedRestaurant, setSelectedRestaurant, selectedPlan, setSelectedPlan, planQty, setPlanQty, orderProcessing, setOrderProcessing, showPlanDetails, setShowPlanDetails, selectedPlanDetails, setSelectedPlanDetails, showAndroidPrompt, setShowAndroidPrompt, handleBuyCardClick, handleTopUp, handlePaymentComplete, handlePaymentSuccessClose, handleUnlockSuccess, handleUnlockCancel, handleManualUnlock, handleWalletExchange, handleShareMeal, handleOrder, handleUseMeal, handleDownloadApp, handleContinueWeb
  };
};

export default useApp;