import React, { useEffect, useState, useMemo } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaLock, FaFilter, FaMapMarkerAlt,
  FaHeart, FaRegHeart, FaWalking, FaCheckCircle, FaStar, FaShoppingCart,
  FaCreditCard, FaQrcode, FaHistory, FaUserCircle, FaTimes, FaChevronRight,
  FaInfoCircle, FaPlus, FaMinus, FaSignOutAlt, FaHeadset, FaCalendar,
  FaCheck, FaCheckSquare, FaExchangeAlt, FaShare, FaPhone, FaEnvelope,
  FaLeaf, FaClock, FaSpinner, FaAndroid, FaUnlock, FaExclamationTriangle,
  FaBolt, FaKey, FaCopy
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ==================== ANIMATION VARIANTS ====================
const pageMotion = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
};

const modalMotion = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const successAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 360],
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

const cardFlip = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180, transition: { duration: 0.6 } }
};

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

const tapAnimation = { scale: 0.95 };
const hoverScale = { scale: 1.05 };

// ==================== HELPER FUNCTIONS ====================
const formatAmount = (amount) => {
  const n = Number(amount) || 0;
  return n.toLocaleString();
};

const getMinutes = (walkTime = "") => {
  const m = parseInt(String(walkTime).replace(/\D/g, ""), 10);
  return isNaN(m) ? 0 : m;
};

const getMealCount = (planType) => {
  const map = { "Month": 30, "Half-month": 15 };
  return map[planType] || 30;
};

const validatePhoneNumber = (phone, provider) => {
  const cleanPhone = phone.replace(/\s/g, '');
  if (cleanPhone.length !== 10) return false;

  if (provider === 'mtn') {
    return cleanPhone.startsWith('078') || cleanPhone.startsWith('079');
  } else if (provider === 'airtel') {
    return cleanPhone.startsWith('073') || cleanPhone.startsWith('072');
  }
  return false;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== CARD LOCK OVERLAY ====================
const CardLockOverlay = ({ onUnlock }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center z-20"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-2xl"
      >
        <FaLock className="text-3xl text-white" />
      </motion.div>
      <h3 className="text-white font-bold text-lg mb-2">Card Locked</h3>
      <p className="text-white/80 text-sm mb-4 text-center px-4">
        Unlock your card to access funds
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUnlock}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
      >
        <FaUnlock /> Unlock Now
      </motion.button>
    </motion.div>
  );
};

// ==================== LOW BALANCE WARNING ====================
const LowBalanceWarning = ({ balance, onTopUp }) => {
  if (balance >= 10000) return null;
  const isCritical = balance < 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-xl border-2 ${isCritical
        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
        }`}
    >
      <div className="flex items-start gap-3">
        <FaExclamationTriangle className={`text-2xl ${isCritical ? 'text-red-500' : 'text-yellow-500'} animate-bounce`} />
        <div className="flex-1">
          <h4 className={`font-bold mb-1 ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
            {isCritical ? '🚨 Critical: Low Balance!' : '⚠️ Balance Running Low'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            You only have <strong>RWF {formatAmount(balance)}</strong> left in your Meal Wallet. Top up to continue enjoying meals.
          </p>
          <motion.button
            whileTap={tapAnimation}
            onClick={onTopUp}
            className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}
          >
            Top Up Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== MEAL PLAN CARD (IMPROVED) ====================
const MealPlanCard = ({ plan, onUseMeal, onViewDetails, onShare }) => {
  const totalMeals = plan.totalMeals;
  const usedCount = plan.usedMeals.length;
  const remaining = totalMeals - usedCount;
  const progress = (usedCount / totalMeals) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-1">
              {plan.restaurantName}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <FaCalendar className="text-xs" />
              <span>{plan.planType} Plan</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-white font-bold text-xs sm:text-sm">{remaining}/{totalMeals}</span>
          </div>
        </div>

        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-400 to-green-300"
          />
        </div>
        <div className="text-white/70 text-xs mt-1">
          {usedCount} meals used • {remaining} remaining
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-2 mb-4">
          {Array.from({ length: totalMeals }).map((_, index) => {
            const isUsed = plan.usedMeals.includes(index);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: isUsed ? 1 : 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => !isUsed && onUseMeal(plan.id, index)}
                className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all ${isUsed
                  ? 'bg-green-500 text-white shadow-md cursor-default'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                disabled={isUsed}
                title={isUsed ? `Meal ${index + 1} - Used` : `Meal ${index + 1} - Available`}
              >
                {isUsed ? <FaCheck className="text-sm sm:text-base" /> : <FaUtensils className="text-xs sm:text-sm" />}
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={tapAnimation}
            onClick={() => onShare(plan)}
            className="flex-1 py-2.5 sm:py-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <FaShare /> Share
          </motion.button>
          <motion.button
            whileTap={tapAnimation}
            onClick={() => onViewDetails(plan)}
            className="flex-1 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <FaInfoCircle /> Details
          </motion.button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 flex justify-between items-center text-xs sm:text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          Expires: {new Date(plan.expiryDate).toLocaleDateString()}
        </div>
        <div className="font-bold text-gray-900 dark:text-white">
          RWF {formatAmount(plan.price)}
        </div>
      </div>
    </motion.div>
  );
};


// ==================== DIGITAL MEAL CARD (IMPROVED) ====================
const DigitalMealCard = ({ selectedCard, wallets, isLocked, onBuyCard, onTopUp, onExchange, onUnlock }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const totalBalance = wallets.meal + wallets.flexie;

  if (selectedCard === "No Card") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl h-56 sm:h-64 flex flex-col items-center justify-center">
          <FaLock className="text-4xl sm:text-6xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-300 mb-2 text-center">
            No Active Card
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4 px-4">
            Purchase a meal card to unlock all features
          </p>
          <motion.button
            whileHover={hoverScale}
            whileTap={tapAnimation}
            onClick={onBuyCard}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
          >
            Get Your Card Now
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="relative preserve-3d cursor-pointer"
        animate={isFlipped ? "flipped" : "initial"}
        variants={cardFlip}
        onClick={() => !isLocked && setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {isLocked && <CardLockOverlay onUnlock={onUnlock} />}

        {/* Front */}
        <motion.div className="w-full h-full" style={{ backfaceVisibility: "hidden" }}>
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl h-56 sm:h-64 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white" />
              <div className="absolute -left-10 -bottom-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white/80 text-xs sm:text-sm font-medium mb-1">IGIFU MEAL CARD</h3>
                  <div className="flex items-center gap-2">
                    {isLocked ? (
                      <>
                        <FaLock className="text-yellow-400 text-sm animate-pulse" />
                        <span className="text-white text-xs">Locked</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-green-400 text-sm" />
                        <span className="text-white text-xs">Active</span>
                      </>
                    )}
                  </div>
                </div>
                <FaBolt className="text-yellow-400 text-2xl sm:text-3xl animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="text-white/70 text-xs">Card Number</div>
                <div className="text-white font-mono text-base sm:text-lg tracking-wider">•••• •••• •••• 4592</div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-white/70 text-xs mb-1">Total Balance</div>
                  <div className="text-white text-xl sm:text-2xl font-bold">
                    RWF {formatAmount(totalBalance)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/70 text-xs mb-1"></div>
                  <div className="text-white text-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl h-56 sm:h-64 flex flex-col justify-center items-center">
            <FaQrcode className="text-white text-6xl sm:text-8xl mb-4" />
            <p className="text-white/70 text-xs sm:text-sm text-center px-4">Scan to pay at restaurants</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <motion.button whileTap={tapAnimation} onClick={(e) => { e.stopPropagation(); onExchange(); }} className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-purple-700">Exchange</motion.button>
              <motion.button whileTap={tapAnimation} onClick={(e) => { e.stopPropagation(); onTopUp(); }} className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-green-700">Top Up</motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dual Wallets */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-1">
            <FaUtensils className="text-lg" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Meal</span>
          </div>
          <div className="text-xs opacity-80">Meal Wallet</div>
          <div className="text-xl font-bold">RWF {formatAmount(wallets.meal)}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-1">
            <FaWallet className="text-lg" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Flexie</span>
          </div>
          <div className="text-xs opacity-80">Flexie Wallet</div>
          <div className="text-xl font-bold">RWF {formatAmount(wallets.flexie)}</div>
        </motion.div>
      </div>
    </div>
  );
};


// ==================== RESTAURANT DETAILS MODAL ====================
const RestaurantDetailsModal = ({ restaurant, onClose }) => {
  if (!restaurant) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalMotion}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-48">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <motion.button whileTap={tapAnimation} onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
            <FaTimes className="text-xl text-white" />
          </motion.button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-bold text-sm">{restaurant.rating || 4.5}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-white text-sm">{restaurant.campus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
              <FaInfoCircle className="text-blue-500" />
              About Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {restaurant.fullDescription || restaurant.description}
            </p>
          </div>

          {restaurant.specialties && restaurant.specialties.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                <FaUtensils className="text-orange-500" />
                Our Specialties
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {restaurant.specialties.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
              <FaPhone className="text-green-500" />
              Contact & Hours
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaPhone className="text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{restaurant.phone || '+250 788 XXX XXX'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaEnvelope className="text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{restaurant.email || 'info@restaurant.rw'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaClock className="text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Mon-Fri: 7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaClock className="text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Sat-Sun: 8:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {restaurant.popularDishes && restaurant.popularDishes.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Popular Dishes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurant.popularDishes.map((dish, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white">
                        {dish.icon || <FaUtensils />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{dish.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{dish.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap ml-2">
                      RWF {formatAmount(dish.price)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {restaurant.features && restaurant.features.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {restaurant.features.map((feature, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== WALLET EXCHANGE MODAL (NEW) ====================
const WalletExchangeModal = ({ wallets, onExchange, onClose }) => {
  const [fromWallet, setFromWallet] = useState('meal');
  const [toWallet, setToWallet] = useState('flexie');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleExchange = async () => {
    const exchangeAmount = parseInt(amount);
    if (!exchangeAmount || exchangeAmount <= 0) return;
    if (wallets[fromWallet] < exchangeAmount) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onExchange(fromWallet, toWallet, exchangeAmount);
    setProcessing(false);
    onClose();
  };

  const switchWallets = () => {
    setFromWallet(toWallet);
    setToWallet(fromWallet);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Exchange Wallets</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">From</label>
            <div className={`p-3 rounded-lg ${fromWallet === 'meal' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 dark:text-white">{fromWallet === 'meal' ? 'Meal Wallet' : 'Flexie Wallet'}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">RWF {formatAmount(wallets[fromWallet])}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button whileTap={tapAnimation} onClick={switchWallets} className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600">
              <FaExchangeAlt className="transform rotate-90" />
            </motion.button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">To</label>
            <div className={`p-3 rounded-lg ${toWallet === 'meal' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 dark:text-white">{toWallet === 'meal' ? 'Meal Wallet' : 'Flexie Wallet'}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">RWF {formatAmount(wallets[toWallet])}</div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Amount (RWF)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            {amount && parseInt(amount) > wallets[fromWallet] && <p className="text-red-500 text-xs mt-1">Insufficient balance</p>}
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={tapAnimation} onClick={onClose} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold">Cancel</motion.button>
            <motion.button whileTap={tapAnimation} onClick={handleExchange} disabled={processing || !amount || parseInt(amount) > wallets[fromWallet]} className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {processing ? <FaSpinner className="animate-spin" /> : <><FaExchangeAlt /> Exchange</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== SHARE MEAL MODAL ====================
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

// ==================== PAYMENT SUCCESS MODAL ====================
const PaymentSuccessModal = ({ amount, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div variants={successAnimation} initial="initial" animate="animate" className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 1, repeat: 1, repeatType: "reverse" }} className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-white text-4xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">RWF {formatAmount(amount)} added to your Meal Wallet.</p>
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className="h-1 bg-green-500 rounded-full mt-4" />
      </motion.div>
    </motion.div>
  );
};

// ==================== QUICK STATS ====================
const QuickStats = ({ wallets, activePlans, savedAmount }) => {
  const totalBalance = wallets.meal + wallets.flexie;
  const stats = [
    { label: 'Balance', value: `${formatAmount(totalBalance)}`, icon: FaWallet, color: 'purple', unit: 'RWF' },
    { label: 'Active Plans', value: activePlans, icon: FaUtensils, color: 'green', unit: '' },
    { label: 'Saved', value: `${formatAmount(savedAmount)}`, icon: FaMoneyBill, color: 'orange', unit: 'RWF' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
            <stat.icon className="text-base sm:text-lg text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            {stat.unit && <span className="text-[9px] sm:text-[10px]">{stat.unit} </span>}{stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==================== ENHANCED FILTER BAR ====================
const EnhancedFilterBar = ({ filterState, setFilterState, resultsCount }) => {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const quickFilters = [
    { key: 'favorites', label: 'Favorites', icon: FaHeart },
    { key: 'nearMe', label: 'Near Me', icon: FaMapMarkerAlt },
    { key: 'budget', label: 'Budget', icon: FaWallet },
  ];

  const priceMin = filterState.priceMin ?? 0;
  const priceMax = filterState.priceMax ?? 100000;

  const handleMinChange = (v) => {
    const val = Math.min(Number(v), priceMax);
    setFilterState(prev => ({ ...prev, priceMin: val }));
  };
  const handleMaxChange = (v) => {
    const val = Math.max(Number(v), priceMin);
    setFilterState(prev => ({ ...prev, priceMax: val }));
  };

  return (
    <div className="bg-white dark:bg-[#0b0b12] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 text-sm" />
            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base">Filters</span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">{resultsCount}</span>
          </div>
          <motion.button whileTap={tapAnimation} onClick={() => setExpandedFilters(!expandedFilters)} className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
            {expandedFilters ? 'Less' : 'More'}
            <FaChevronRight className={`transition-transform text-xs ${expandedFilters ? 'rotate-90' : ''}`} />
          </motion.button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickFilters.map(filter => (
            <motion.button
              key={filter.key}
              whileTap={tapAnimation}
              onClick={() => setFilterState(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border whitespace-nowrap transition-all text-xs sm:text-sm ${filterState[filter.key]
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
            >
              <filter.icon className="text-xs" />
              <span>{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-3 sm:p-4 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  Price Range: RWF {formatAmount(priceMin)} - {formatAmount(priceMax)}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Min</div>
                    <input type="range" min="0" max="100000" step="500" value={priceMin} onChange={(e) => handleMinChange(e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max</div>
                    <input type="range" min="0" max="100000" step="500" value={priceMax} onChange={(e) => handleMaxChange(e.target.value)} className="w-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                <select className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" value={filterState.campus} onChange={(e) => setFilterState(prev => ({ ...prev, campus: e.target.value }))}>
                  <option value="All Campuses">All Campuses</option>
                  <option value="Huye Campus">Huye</option>
                  <option value="Remera Campus">Remera</option>
                  <option value="Nyarugenge Campus">Nyarugenge</option>
                  <option value="Tumba Campus">Tumba</option>
                  <option value="Gishushu Campus">Gishushu</option>
                  <option value="Kimironko Campus">Kimironko</option>
                  <option value="Kacyiru Campus">Kacyiru</option>
                </select>

                <select className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" value={filterState.priceSort} onChange={(e) => setFilterState(prev => ({ ...prev, priceSort: e.target.value }))}>
                  <option value="None">Sort: Price</option>
                  <option value="Low to High">Low to High</option>
                  <option value="High to Low">High to Low</option>
                </select>

                <select className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" value={filterState.walkTime} onChange={(e) => setFilterState(prev => ({ ...prev, walkTime: e.target.value }))}>
                  <option value="All Times">Distance</option>
                  <option value="< 5 mins">Under 5min</option>
                  <option value="5-10 mins">5-10min</option>
                  <option value="> 10 mins">Over 10min</option>
                </select>

                <select className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" value={filterState.selfService} onChange={(e) => setFilterState(prev => ({ ...prev, selfService: e.target.value }))}>
                  <option value="Any">Service</option>
                  <option value="Yes">Self-Service</option>
                  <option value="No">Table Service</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== RESTAURANT CARD ====================
const RestaurantCard = ({ restaurant, index, onToggleFav, onOrder }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const planEntries = Object.entries(restaurant.priceInfo || {});
  const lowest = planEntries.reduce((acc, [period, amount]) => !acc || amount < acc.amount ? { period, amount } : acc, null);
  const rating = restaurant.rating || 4.5;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -8, transition: { duration: 0.2 } }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-[#1a1a15] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden group relative">
        <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => onToggleFav(restaurant.id)} className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
          {restaurant.isFav ? <FaHeart className="text-red-500 text-lg sm:text-2xl animate-pulse" /> : <FaRegHeart className="text-gray-500 dark:text-gray-300 text-lg sm:text-2xl hover:text-red-500 transition-colors" />}
        </motion.button>

        <div className="relative h-40 sm:h-48 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10 ${!imageLoaded ? 'animate-pulse bg-gray-300 dark:bg-gray-700' : ''}`} />
          <img src={restaurant.image} alt={restaurant.name} className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImageLoaded(true)} loading="lazy" />
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-20 bg-black/70 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
            <FaStar className="text-yellow-400 text-xs sm:text-sm" />
            <span className="text-white font-bold text-xs sm:text-sm">{rating}</span>
          </div>
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-20 bg-black/70 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
            <FaWalking className="text-green-400 text-xs sm:text-sm" />
            <span className="text-white font-bold text-xs sm:text-sm">{restaurant.walkTime}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{restaurant.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{restaurant.description}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="text-blue-500 text-xs" />
              <span className="truncate">{restaurant.campus}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.features?.map((feature, idx) => (
              <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">{feature}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {planEntries.map(([period, amount]) => (
              <div key={period} className={`p-2 rounded-lg border ${lowest?.period === period ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">{period}</div>
                <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">RWF {formatAmount(amount)}</div>
                {lowest?.period === period && <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-semibold mt-1"></div>}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button whileTap={tapAnimation} onClick={() => setShowDetails(true)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
              <FaInfoCircle /> <span className="hidden sm:inline">Info</span>
            </motion.button>
            <motion.button whileTap={tapAnimation} whileHover={{ scale: 1.02 }} onClick={() => onOrder(restaurant)} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              <FaShoppingCart /><span>Order Now</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && <RestaurantDetailsModal restaurant={restaurant} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>
    </>
  );
};

// ==================== ENHANCED PAYMENT MODAL (IMPROVED) ====================
const EnhancedPaymentModal = ({ defaultAmount = 10000, onPay, onClose, processing, setProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const [feeOption, setFeeOption] = useState('no-fee');
  const [phoneError, setPhoneError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showUSSD, setShowUSSD] = useState(false);

  const fees = {
    'no-fee': 0,
    'half-month': Math.ceil(amount * 0.01),
    'monthly': Math.ceil(amount * 0.02),
  };

  const totalAmount = amount + fees[feeOption];

  const validatePhone = () => {
    const isValid = validatePhoneNumber(phoneNumber, paymentMethod);
    if (!isValid) {
      const provider = paymentMethod === 'mtn' ? 'MTN (078/079)' : 'Airtel (072/073)';
      setPhoneError(`Please enter a valid ${provider} number`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10 || !amount || amount <= 0) return;
    if (!validatePhone()) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const otp = generateOTP();
    setSentOTP(otp);
    setProcessing(false);
    setShowOTP(true);
    console.log('📱 OTP Code:', otp);
  };

  const handleOTPVerification = async () => {
    if (otpCode !== sentOTP) {
      setOtpError('Invalid OTP code. Please try again.');
      return;
    }

    setOtpError('');
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onPay(paymentMethod, phoneNumber, totalAmount);
  };

  const handleShowUSSD = () => {
    setShowUSSD(true);
  };

  const ussdCode = paymentMethod === 'mtn' ? '*182*8*1#' : '*500#';

  if (showOTP) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaKey className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter OTP Code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We sent a 6-digit code to <strong>{phoneNumber}</strong>
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Demo OTP: {sentOTP}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setOtpError('');
                }}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full h-14 text-center text-2xl font-mono tracking-widest bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 text-gray-900 dark:text-white"
                autoFocus
              />
              {otpError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-2 text-center">
                  {otpError}
                </motion.p>
              )}
            </div>

            <motion.button
              whileTap={tapAnimation}
              onClick={handleOTPVerification}
              disabled={processing || otpCode.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Verify & Pay</>}
            </motion.button>

            <div className="text-center">
              <button
                onClick={handleShowUSSD}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Didn't receive code? Use USSD
              </button>
            </div>

            {showUSSD && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FaPhone className="text-yellow-600" />
                  Alternative: Dial USSD Code
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Dial this code on your phone to approve the payment:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-gray-300 dark:border-gray-600">
                  <code className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ussdCode}</code>
                  <motion.button
                    whileTap={tapAnimation}
                    onClick={() => {
                      navigator.clipboard.writeText(ussdCode);
                      alert('USSD code copied!');
                    }}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-1"
                  >
                    <FaCopy /> Copy
                  </motion.button>
                </div>
              </motion.div>
            )}

            <motion.button
              whileTap={tapAnimation}
              onClick={() => {
                setShowOTP(false);
                setOtpCode('');
                setSentOTP('');
                setOtpError('');
                setShowUSSD(false);
              }}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Add Money to Card</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Amount (RWF)</label>
            <input type="number" min="500" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} placeholder="Enter amount e.g., 10000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Processing Fee Options</label>
            <div className="space-y-2">
              {[
                { key: 'no-fee', label: 'No Fee', desc: 'Standard processing', fee: fees['no-fee'] },
                { key: 'half-month', label: 'Half Month Fee', desc: 'Slightly faster', fee: fees['half-month'] },
                { key: 'monthly', label: 'Monthly Fee', desc: 'Priority processing', fee: fees['monthly'] },
              ].map(option => (
                <motion.button
                  key={option.key}
                  whileTap={tapAnimation}
                  onClick={() => setFeeOption(option.key)}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center ${feeOption === option.key
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">+RWF {formatAmount(option.fee)}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button whileTap={tapAnimation} onClick={() => { setPaymentMethod('mtn'); setPhoneError(''); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'mtn' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-black">MTN</span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">MTN MoMo</p>
                <p className="text-[10px] text-gray-500 text-center mt-1">078/079</p>
              </motion.button>

              <motion.button whileTap={tapAnimation} onClick={() => { setPaymentMethod('airtel'); setPhoneError(''); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'airtel' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-white">airtel</span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Airtel Money</p>
                <p className="text-[10px] text-gray-500 text-center mt-1">072/073</p>
              </motion.button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError('');
              }}
              onBlur={validatePhone}
              placeholder={paymentMethod === 'mtn' ? '078XXXXXXX' : '072XXXXXXX'}
              className={`w-full px-4 py-3 rounded-xl border ${phoneError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {phoneError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                {phoneError}
              </motion.p>
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">RWF {formatAmount(amount)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">Fee</span>
              <span className="font-bold text-gray-900 dark:text-white">RWF {formatAmount(fees[feeOption])}</span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-700 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-blue-600">RWF {formatAmount(totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={tapAnimation} onClick={onClose} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold" disabled={processing}>Cancel</motion.button>
            <motion.button whileTap={tapAnimation} onClick={handlePayment} disabled={processing || !phoneNumber || amount <= 0 || phoneError} className={`flex-[2] py-3 ${paymentMethod === 'mtn' ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'} rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2`}>
              {processing ? <FaSpinner className="animate-spin" /> : <>Continue</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== UNLOCK CARD MODAL ====================
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
            <motion.button whileTap={tapAnimation} onClick={onCancel} className="flex-1 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base">
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

// ==================== ANDROID APP PROMPT MODAL ====================
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

// ==================== RESTAURANTS PAGE ====================
const RestozPage = ({ showToast, onOrder }) => {
  const [activeTab, setActiveTab] = useState("Browse");
  const [filterState, setFilterState] = useState({
    campus: "All Campuses",
    plan: "Any",
    priceSort: "None",
    walkTime: "All Times",
    selfService: "Any",
    favorites: false,
    nearMe: false,
    budget: false,
    priceMin: 0,
    priceMax: 100000,
  });

  const restaurantsSeed = useMemo(() => ([
    {
      id: 1,
      name: "Campus Bites",
      campus: "Huye Campus",
      description: "Fresh, healthy meals prepared daily with local ingredients",
      fullDescription: "Campus Bites has served students for 10+ years. We specialize in nutritious, affordable meals for student budgets, blending traditional Rwandan dishes with international flavors.",
      priceInfo: { "Month": 30000, "Half-month": 16000 },
      walkTime: "3 mins",
      selfService: false,
      isFav: true,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      features: ["WiFi", "Study Area", "Takeaway"],
      specialties: [{ name: "Brochettes", icon: <FaLeaf className="text-green-600" /> }, { name: "Salads", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Chicken Brochette", description: "Grilled chicken skewers", price: 3500, icon: <FaLeaf className="text-white" /> },
        { name: "Veggie Bowl", description: "Fresh vegetables with rice", price: 2500, icon: <FaLeaf className="text-white" /> },
      ],
      phone: "+250 788 123 456",
      email: "info@campusbites.rw"
    },
    {
      id: 2,
      name: "Inka Kitchen",
      campus: "Remera Campus",
      description: "Authentic Rwandan cuisine with a modern twist",
      fullDescription: "Inka Kitchen brings the best of Rwandan culinary traditions with contemporary style. Fresh local ingredients, memorable dishes.",
      priceInfo: { "Month": 50000, "Half-month": 28000 },
      walkTime: "10 mins",
      selfService: true,
      isFav: false,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
      features: ["Outdoor Seating", "Vegan Options", "Delivery"],
      specialties: [{ name: "Isombe", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Isombe Special", description: "Cassava leaves with fish", price: 4500, icon: <FaLeaf className="text-white" /> },
        { name: "Tilapia Grill", description: "Lake fish with ugali", price: 5500, icon: <FaLeaf className="text-white" /> }
      ],
      phone: "+250 788 234 567",
      email: "order@inkakitchen.rw"
    },
    {
      id: 3,
      name: "UR - Nyarugenge Cafeteria",
      campus: "Nyarugenge Campus",
      description: "Affordable student meals and daily specials",
      fullDescription: "Serving classic campus favorites and hearty Rwandan staples. Daily specials and combo deals for students.",
      priceInfo: { "Month": 25000, "Half-month": 15000 },
      walkTime: "5 mins",
      selfService: true,
      isFav: false,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      features: ["Quick Service", "Budget Friendly", "Takeaway"],
      specialties: [{ name: "Beans & Rice", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Beans & Rice", description: "Classic combo", price: 1500, icon: <FaLeaf className="text-white" /> },
        { name: "Beef with Chips", description: "Popular combo", price: 3000, icon: <FaLeaf className="text-white" /> }
      ],
      phone: "+250 788 111 222",
      email: "cafeteria@ur.rw"
    },
  ]), []);

  const [restaurants, setRestaurants] = useState(restaurantsSeed);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

  useEffect(() => {
    let temp = [...restaurants];

    if (activeTab === "Favourites" || filterState.favorites) {
      temp = temp.filter(r => r.isFav);
    }
    if (filterState.budget) {
      temp = temp.filter(r => Math.min(...Object.values(r.priceInfo || {})) <= 25000);
    }
    if (filterState.nearMe) {
      temp = temp.filter(r => getMinutes(r.walkTime) <= 5);
    }
    if (filterState.campus && filterState.campus !== "All Campuses") {
      temp = temp.filter(r => r.campus === filterState.campus);
    }
    if (filterState.walkTime && filterState.walkTime !== "All Times") {
      temp = temp.filter(r => {
        const m = getMinutes(r.walkTime);
        if (filterState.walkTime === "< 5 mins") return m < 5;
        if (filterState.walkTime === "5-10 mins") return m >= 5 && m <= 10;
        if (filterState.walkTime === "> 10 mins") return m > 10;
        return true;
      });
    }
    temp = temp.filter(r => {
      const minPlan = Math.min(...Object.values(r.priceInfo || { Month: 999999 }));
      return minPlan >= filterState.priceMin && minPlan <= filterState.priceMax;
    });

    if (filterState.priceSort && filterState.priceSort !== "None") {
      temp.sort((a, b) => {
        const getPrice = (r) => Math.min(...Object.values(r.priceInfo || { Month: 999999 }));
        const pa = getPrice(a);
        const pb = getPrice(b);
        return filterState.priceSort === "Low to High" ? pa - pb : pb - pa;
      });
    }

    setFilteredRestaurants(temp);
  }, [restaurants, activeTab, filterState]);

  const toggleFav = (id) => {
    setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r)));
    showToast("Favorite updated", "info");
  };

  return (
    <motion.section {...pageMotion} className="pb-28 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Meal Plan</h1>
          <p className="text-blue-100 mb-4 text-xs sm:text-sm md:text-base">Choose from verified campus restaurants</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Browse', 'Favourites', 'Nearby', 'Deals'].map(tab => (
              <motion.button key={tab} whileTap={tapAnimation} onClick={() => setActiveTab(tab)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <EnhancedFilterBar filterState={filterState} setFilterState={setFilterState} resultsCount={filteredRestaurants.length} />

      <div className="p-3 sm:p-4">
        <div className="mx-auto w-full max-w-6xl">
          {filteredRestaurants.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <FaSearch className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No restaurants found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} onToggleFav={toggleFav} onOrder={onOrder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// ==================== PLAN DETAILS MODAL ====================
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

// ==================== MAIN APP COMPONENT ====================
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

  // ==================== PAGES ====================
  const MyIgifuPage = () => {
    const activePlansCount = purchasedPlans.filter(p => p.usedMeals.length < p.totalMeals).length;

    return (
      <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
        <div className="mx-auto w-full max-w-6xl">
          {selectedCard === "Meal Card" && <QuickStats wallets={wallets} activePlans={activePlansCount} savedAmount={15000} />}
          {selectedCard === "Meal Card" && !isCardLocked && <LowBalanceWarning balance={wallets.meal} onTopUp={handleTopUp} />}

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Your Digital Card</h2>
              <select className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs sm:text-sm" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                <option>No Card</option>
                <option>Meal Card</option>
              </select>
            </div>

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

              {purchasedPlans.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    My Meal Plans ({purchasedPlans.filter(p => p.usedMeals.length < p.totalMeals).length} Active)
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {purchasedPlans.map(plan => (
                      <MealPlanCard
                        key={plan.id}
                        plan={plan}
                        onUseMeal={handleUseMeal}
                        onViewDetails={(p) => { setSelectedPlanDetails(p); setShowPlanDetails(true); }}
                        onShare={(p) => { setSelectedSharePlan(p); setShowShareModal(true); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>
    );
  };

  const EarnPage = () => (
    <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Earn Rewards</h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-6 shadow-xl text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaGift className="text-4xl sm:text-5xl" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Coming Soon!</h3>
          <p className="text-base sm:text-lg text-white/90 mb-2">Exciting rewards program is on the way</p>
          <p className="text-sm sm:text-base text-white/80">Earn points with every meal purchase and redeem for amazing rewards, free meals, and exclusive discounts.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">🎁</div><p className="text-sm font-bold">Free Meals</p></div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">💰</div><p className="text-sm font-bold">Discounts</p></div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">⭐</div><p className="text-sm font-bold">Exclusive Perks</p></div>
          </div>
        </motion.div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-1" />
            <div><h4 className="font-bold text-gray-900 dark:text-white mb-2">Stay Tuned!</h4><p className="text-sm text-gray-600 dark:text-gray-400">We're working hard to bring you an amazing rewards experience.</p></div>
          </div>
        </div>
      </div>
    </motion.section>
  );

  const LoansPage = () => (
    <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Student Loans</h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-6 shadow-xl text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaMoneyBill className="text-4xl sm:text-5xl" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Coming Soon!</h3>
          <p className="text-base sm:text-lg text-white/90 mb-2">Quick and easy student meal loans</p>
          <p className="text-sm sm:text-base text-white/80">Get instant access to meals when you need them most. Interest-free options available for students.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><p className="text-sm font-bold">Instant Approval</p></div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">🆓</div><p className="text-sm font-bold">0% Interest</p></div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4"><div className="text-3xl mb-2">📅</div><p className="text-sm font-bold">Flexible Repayment</p></div>
          </div>
        </motion.div>
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-green-600 dark:text-green-400 text-xl flex-shrink-0 mt-1" />
            <div><h4 className="font-bold text-gray-900 dark:text-white mb-2">Financial Support for Students</h4><p className="text-sm text-gray-600 dark:text-gray-400">We understand student life can be challenging. Check back soon for launch details!</p></div>
          </div>
        </div>
      </div>
    </motion.section>
  );

  const MorePage = () => (
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

  // ==================== RETURN MAIN RENDER ====================
  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12] transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
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
          {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
          {activePage === "Restoz" && <RestozPage key="restoz" showToast={showToast} onOrder={handleOrder} />}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/10 py-2 z-40">
        <div className="mx-auto w-full max-w-6xl flex justify-around">
          {[
            { n: "Restoz", i: <FaUtensils />, label: "Restaurants" },
            { n: "MyIgifu", i: <FaWallet />, label: "Card" },
            { n: "Earn", i: <FaGift />, label: "Rewards" },
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

        {/* Order Modal (NEW) */}
        {showOrderModal && selectedRestaurant && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowOrderModal(false)}>
            <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="relative h-24 sm:h-32 bg-gradient-to-br from-blue-600 to-indigo-600">
                <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center px-4"><h3 className="text-xl sm:text-2xl font-bold text-white text-center">{selectedRestaurant.name}</h3></div>
                <motion.button whileTap={tapAnimation} onClick={() => setShowOrderModal(false)} className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"><FaTimes className="text-white text-lg sm:text-xl" /></motion.button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Select Plan Duration</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedRestaurant.priceInfo || {}).map(([plan, amount]) => {
                      const meals = getMealCount(plan);
                      return (
                        <motion.button key={plan} whileTap={tapAnimation} onClick={() => setSelectedPlan(plan)} className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedPlan === plan ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
                          <div className="text-left"><div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{plan}</div><div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{meals} meals</div></div>
                          <div className="text-right"><div className="font-bold text-base sm:text-lg text-blue-600">RWF {formatAmount(amount)}</div></div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Quantity</h4>
                  <div className="flex items-center justify-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <motion.button whileTap={tapAnimation} onClick={() => setPlanQty(q => Math.max(1, q - 1))} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl"><FaMinus className="text-sm sm:text-base" /></motion.button>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">{planQty}</span>
                    <motion.button whileTap={tapAnimation} onClick={() => setPlanQty(q => q + 1)} className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl text-white"><FaPlus className="text-sm sm:text-base" /></motion.button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2"><span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Amount</span><span className="text-xl sm:text-2xl font-bold text-blue-600">RWF {(() => { const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0; return formatAmount(price * planQty); })()}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total Meals</span><span className="font-bold text-gray-900 dark:text-white">{selectedPlan ? getMealCount(selectedPlan) * planQty : 0} meals</span></div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">Balance after: RWF {(() => { const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0; const total = price * planQty; return formatAmount(Math.max(0, wallets.meal - total)); })()}</div>
                </div>

                <motion.button whileTap={tapAnimation} onClick={handleOrderPlacement} disabled={orderProcessing || !selectedPlan} className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {orderProcessing ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Confirm Purchase</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.9 }} className={`fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl font-bold text-white flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-md ${toast.tone === 'warn' ? 'bg-gradient-to-r from-red-500 to-red-600' : toast.tone === 'info' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
            <span className="text-base sm:text-lg">{toast.tone === 'warn' ? '⚠️' : toast.tone === 'info' ? 'ℹ️' : '✅'}</span>
            <span className="text-xs sm:text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IgifuDashboardMainApp;