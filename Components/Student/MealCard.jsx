import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaLock, FaQuestionCircle, FaFilter, FaMapMarkerAlt,
  FaHeart, FaRegHeart, FaCaretDown, FaRegClock, FaWalking,
  FaCheckCircle, FaStar, FaShoppingCart, FaCreditCard, FaQrcode,
  FaHistory, FaUserCircle, FaTimes, FaChevronRight, FaInfoCircle,
  FaArrowLeft, FaPlus, FaMinus, FaCog, FaSignOutAlt, FaHeadset,
  FaCalendar, FaCheck, FaSquare, FaCheckSquare
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
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

const cardFlip = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180, transition: { duration: 0.6 } }
};

const tapAnimation = { scale: 0.95 };
const hoverScale = { scale: 1.05 };

// Helper functions
const formatK = (amount) => {
  if (amount >= 1000 && amount % 1000 === 0) return `${amount / 1000}k`;
  return amount.toLocaleString();
};

const getMinutes = (walkTime = "") => {
  const m = parseInt(String(walkTime).replace(/\D/g, ""), 10);
  return isNaN(m) ? 0 : m;
};

// Calculate meals based on plan type
const getMealCount = (planType) => {
  const planMap = {
    "Month": 30,
    "Half-month": 15,
    "Week": 7,
    "2 Weeks": 14
  };
  return planMap[planType] || 30;
};

// --- Meal Card with Checkboxes Component ---
const MealPlanCard = ({ plan, onUseMeal, onViewDetails }) => {
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
      {/* Header */}
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
            <span className="text-white font-bold text-xs sm:text-sm">
              {remaining}/{totalMeals}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
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

      {/* Meal Boxes Grid */}
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
                className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all ${
                  isUsed
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

        {/* Action Button */}
        <motion.button
          whileTap={tapAnimation}
          onClick={() => onViewDetails(plan)}
          className="w-full py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <FaInfoCircle />
          View Details
        </motion.button>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 flex justify-between items-center text-xs sm:text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          Expires: {new Date(plan.expiryDate).toLocaleDateString()}
        </div>
        <div className="font-bold text-gray-900 dark:text-white">
          RWF {plan.price.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};

// --- Plan Details Modal ---
const PlanDetailsModal = ({ plan, onClose, onUseMeal }) => {
  if (!plan) return null;

  const usedCount = plan.usedMeals.length;
  const remaining = plan.totalMeals - usedCount;
  const nextMealIndex = Array.from({ length: plan.totalMeals }).findIndex((_, i) => !plan.usedMeals.includes(i));

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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white relative">
          <motion.button
            whileTap={tapAnimation}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <FaTimes className="text-xl" />
          </motion.button>

          <h2 className="text-2xl sm:text-3xl font-bold mb-2 pr-12">{plan.restaurantName}</h2>
          <p className="text-blue-100 text-sm sm:text-base">{plan.planType} Meal Plan</p>
        </div>

        {/* Stats */}
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

        {/* Meal Grid */}
        <div className="px-6 pb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Meal Tracker</h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 mb-6">
            {Array.from({ length: plan.totalMeals }).map((_, index) => {
              const isUsed = plan.usedMeals.includes(index);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: isUsed ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !isUsed && onUseMeal(plan.id, index)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                    isUsed
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 border-2 border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isUsed}
                >
                  {isUsed ? (
                    <FaCheckSquare className="text-xl sm:text-2xl" />
                  ) : (
                    <>
                      <FaUtensils className="text-base sm:text-lg mb-1" />
                      <span className="text-[10px] font-bold">{index + 1}</span>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Quick Action */}
          {nextMealIndex !== -1 && (
            <motion.button
              whileTap={tapAnimation}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onUseMeal(plan.id, nextMealIndex);
              }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <FaCheckCircle />
              Use Next Meal (Meal {nextMealIndex + 1})
            </motion.button>
          )}

          {remaining === 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center">
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Plan Completed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You've used all meals in this plan. Purchase a new one to continue.
              </p>
            </div>
          )}
        </div>

        {/* Plan Info */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Purchase Date</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Date(plan.purchaseDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Expiry Date</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Date(plan.expiryDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
            <span className="font-bold text-lg text-blue-600">
              RWF {plan.price.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Digital Meal Card Component ---
const DigitalMealCard = ({ selectedCard, balance, onBuyCard, onTopUp, onHistory }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (selectedCard === "No Card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBuyCard();
            }}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
          >
            Get Your Card Now
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative preserve-3d cursor-pointer"
      animate={isFlipped ? "flipped" : "initial"}
      variants={cardFlip}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Card Front */}
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
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
                  <FaCheckCircle className="text-green-400 text-sm" />
                  <span className="text-white text-xs">Active</span>
                </div>
              </div>
              <FaUtensils className="text-white/30 text-2xl sm:text-3xl" />
            </div>

            <div className="space-y-2">
              <div className="text-white/70 text-xs">Card Number</div>
              <div className="text-white font-mono text-base sm:text-lg tracking-wider">
                •••• •••• •••• 4592
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/70 text-xs mb-1">Balance</div>
                <div className="text-white text-xl sm:text-2xl font-bold">
                  RWF {balance.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs mb-1">Valid Until</div>
                <div className="text-white text-sm">12/25</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card Back */}
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl h-56 sm:h-64 flex flex-col justify-center items-center">
          <FaQrcode className="text-white text-6xl sm:text-8xl mb-4" />
          <p className="text-white/70 text-xs sm:text-sm text-center px-4">Scan to pay at restaurants</p>
          <div className="mt-4 flex gap-2">
            <motion.button
              whileTap={tapAnimation}
              onClick={(e) => { 
                e.stopPropagation(); 
                onTopUp();
              }}
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-green-700"
            >
              Top Up
            </motion.button>
            <motion.button
              whileTap={tapAnimation}
              onClick={(e) => { 
                e.stopPropagation(); 
                onHistory();
              }}
              className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-gray-600"
            >
              History
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Restaurant Card Component ---
const RestaurantCard = ({ restaurant, index, onToggleFav, onOrder, showToast }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleOrderClick = () => {
    onOrder(restaurant);
  };

  const planEntries = Object.entries(restaurant.priceInfo || {});
  const lowest = planEntries.reduce((acc, [period, amount]) => {
    if (!acc) return { period, amount };
    return amount < acc.amount ? { period, amount } : acc;
  }, null);

  const rating = restaurant.rating || 4.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#1a1a15] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden group relative"
    >
      {restaurant.verified && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
          <FaCheckCircle className="text-xs" /> Verified
        </div>
      )}

      <motion.button
        whileTap={tapAnimation}
        whileHover={hoverScale}
        onClick={() => onToggleFav(restaurant.id)}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
      >
        {restaurant.isFav ? (
          <FaHeart className="text-red-500 text-lg sm:text-2xl animate-pulse" />
        ) : (
          <FaRegHeart className="text-gray-500 dark:text-gray-300 text-lg sm:text-2xl hover:text-red-500 transition-colors" />
        )}
      </motion.button>

      <div className="relative h-40 sm:h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10 ${!imageLoaded ? 'animate-pulse bg-gray-300 dark:bg-gray-700' : ''}`} />
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy" 
        />
        
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
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt className="text-blue-500 text-xs" />
            <span className="truncate">{restaurant.campus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {planEntries.map(([period, amount]) => (
            <div 
              key={period} 
              className={`p-2 rounded-lg border ${
                lowest?.period === period 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">{period}</div>
              <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                RWF {formatK(amount)}
              </div>
              {lowest?.period === period && (
                <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                  Best Value
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${restaurant.selfService ? 'bg-blue-500' : 'bg-green-500'}`} />
            <span className="text-gray-600 dark:text-gray-400 truncate">
              {restaurant.selfService ? 'Self-Service' : 'Table Service'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <FaCreditCard className="text-xs" />
            <span className="hidden sm:inline">Card Ready</span>
          </div>
        </div>

        <motion.button
          whileTap={tapAnimation}
          whileHover={{ scale: 1.02 }}
          onClick={handleOrderClick}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <FaShoppingCart />
          <span className="hidden sm:inline">View Plans & Order</span>
          <span className="sm:hidden">Order Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Quick Stats Dashboard ---
const QuickStats = ({ balance, activePlans, savedAmount }) => {
  const stats = [
    { label: 'Wallet', value: `${formatK(balance)}`, icon: FaWallet, color: 'blue', unit: 'RWF' },
    { label: 'Active Plans', value: activePlans, icon: FaUtensils, color: 'green', unit: '' },
    { label: 'Saved', value: `${formatK(savedAmount)}`, icon: FaMoneyBill, color: 'purple', unit: 'RWF' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-2`}>
            <stat.icon className={`text-base sm:text-lg text-${stat.color}-600 dark:text-${stat.color}-400`} />
          </div>
          <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {stat.value}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            {stat.unit && <span className="text-[9px] sm:text-[10px]">{stat.unit} </span>}
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Enhanced Filter Bar ---
const EnhancedFilterBar = ({ filterState, setFilterState, resultsCount }) => {
  const [expandedFilters, setExpandedFilters] = useState(false);

  const quickFilters = [
    { key: 'verified', label: 'Verified', icon: FaCheckCircle },
    { key: 'favorites', label: 'Favorites', icon: FaHeart },
    { key: 'nearMe', label: 'Near Me', icon: FaMapMarkerAlt },
    { key: 'budget', label: 'Budget', icon: FaWallet },
  ];

  return (
    <div className="bg-white dark:bg-[#0b0b12] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 text-sm" />
            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Filters
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
              {resultsCount}
            </span>
          </div>
          <motion.button
            whileTap={tapAnimation}
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"
          >
            {expandedFilters ? 'Less' : 'More'}
            <FaChevronRight className={`transition-transform text-xs ${expandedFilters ? 'rotate-90' : ''}`} />
          </motion.button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickFilters.map(filter => (
            <motion.button
              key={filter.key}
              whileTap={tapAnimation}
              onClick={() => setFilterState(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border whitespace-nowrap transition-all text-xs sm:text-sm ${
                filterState[filter.key]
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <filter.icon className="text-xs" />
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <select 
                className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                value={filterState.campus}
                onChange={(e) => setFilterState(prev => ({ ...prev, campus: e.target.value }))}
              >
                <option value="All Campuses">All Campuses</option>
                <option value="Huye Campus">Huye</option>
                <option value="Remera Campus">Remera</option>
                <option value="Nyarugaenge Campus">Nyarugaenge</option>
                <option value="Tumba Campus">Tumba</option>
                <option value="Gishushu Campus">Gishushu</option>
              </select>

              <select 
                className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                value={filterState.priceSort}
                onChange={(e) => setFilterState(prev => ({ ...prev, priceSort: e.target.value }))}
              >
                <option value="None">Sort: Price</option>
                <option value="Low to High">Low to High</option>
                <option value="High to Low">High to Low</option>
              </select>

              <select 
                className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                value={filterState.walkTime}
                onChange={(e) => setFilterState(prev => ({ ...prev, walkTime: e.target.value }))}
              >
                <option value="All Times">Distance</option>
                <option value="< 5 mins">Under 5min</option>
                <option value="5-10 mins">5-10min</option>
                <option value="> 10 mins">Over 10min</option>
              </select>

              <select 
                className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                value={filterState.selfService}
                onChange={(e) => setFilterState(prev => ({ ...prev, selfService: e.target.value }))}
              >
                <option value="Any">Service</option>
                <option value="Yes">Self-Service</option>
                <option value="No">Table Service</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Restoz Page ---
const RestozPage = ({ showToast, onOrder }) => {
  const [activeTab, setActiveTab] = useState("Browse");
  const [filterState, setFilterState] = useState({
    campus: "All Campuses",
    plan: "Any",
    priceSort: "None",
    walkTime: "All Times",
    selfService: "Any",
    verified: false,
    favorites: false,
    nearMe: false,
    budget: false,
  });

  const restaurantsSeed = useMemo(() => ([
    {
      id: 1, name: "Campus Bites", campus: "Huye Campus",
      priceInfo: { "Month": 30000, "Half-month": 16000 }, walkTime: "3 mins",
      selfService: false, isFav: true, verified: true, rating: 4.8,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    },
    {
      id: 2, name: "Inka Kitchen", campus: "Remera Campus",
      priceInfo: { "Month": 50000, "Half-month": 28000 }, walkTime: "10 mins",
      selfService: true, isFav: false, verified: true, rating: 4.5,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80",
    },
    {
      id: 3, name: "UR - Nyarugaenge Cafeteria", campus: "Nyarugaenge Campus",
      priceInfo: { "Month": 25000, "Half-month": 15000 }, walkTime: "5 mins",
      selfService: true, isFav: false, verified: false, rating: 4.2,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    },
    {
      id: 4, name: "RP - Tumba Bistro", campus: "Tumba Campus",
      priceInfo: { "Month": 20000, "Half-month": 12000 }, walkTime: "7 mins",
      selfService: false, isFav: true, verified: false, rating: 4.6,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    },
    {
      id: 5, name: "Campus Canteen - Gishushu", campus: "Gishushu Campus",
      priceInfo: { "Month": 18000, "Half-month": 10000 }, walkTime: "15 mins",
      selfService: true, isFav: false, verified: true, rating: 4.3,
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80",
    },
    {
      id: 6, name: "Student's Choice", campus: "Huye Campus",
      priceInfo: { "Month": 22000, "Half-month": 12000 }, walkTime: "2 mins",
      selfService: false, isFav: false, verified: true, rating: 4.7,
      image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80",
    }
  ]), []);

  const [restaurants, setRestaurants] = useState(restaurantsSeed);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

  useEffect(() => {
    let temp = [...restaurants];

    if (activeTab === "Favourites" || filterState.favorites) {
      temp = temp.filter(r => r.isFav);
    }

    if (filterState.verified) {
      temp = temp.filter(r => r.verified);
    }

    if (filterState.budget) {
      temp = temp.filter(r => {
        const minPrice = Math.min(...Object.values(r.priceInfo || {}));
        return minPrice <= 25000;
      });
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

    if (filterState.selfService && filterState.selfService !== "Any") {
      const want = filterState.selfService === "Yes";
      temp = temp.filter(r => !!r.selfService === want);
    }

    if (filterState.priceSort && filterState.priceSort !== "None") {
      temp.sort((a, b) => {
        const getPrice = (r) => {
          if (!r.priceInfo) return Number.MAX_SAFE_INTEGER;
          return Math.min(...Object.values(r.priceInfo));
        };
        const pa = getPrice(a);
        const pb = getPrice(b);
        return filterState.priceSort === "Low to High" ? pa - pb : pb - pa;
      });
    }

    setFilteredRestaurants(temp);
  }, [restaurants, activeTab, filterState]);

  const toggleFav = (id) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r))
    );
    showToast("Favorite updated", "info");
  };

  return (
    <motion.section {...pageMotion} className="pb-28 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Meal Plan</h1>
          <p className="text-blue-100 mb-4 text-xs sm:text-sm md:text-base">Choose from verified campus restaurants</p>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Browse', 'Favourites', 'Nearby', 'Deals'].map(tab => (
              <motion.button
                key={tab}
                whileTap={tapAnimation}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <EnhancedFilterBar 
        filterState={filterState} 
        setFilterState={setFilterState}
        resultsCount={filteredRestaurants.length}
      />

      <div className="p-3 sm:p-4">
        <div className="mx-auto w-full max-w-6xl">
          {filteredRestaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaSearch className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No restaurants found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your filters
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  index={index}
                  onToggleFav={toggleFav}
                  onOrder={onOrder}
                  showToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// --- Main App Component ---
function IgifuDashboardMainApp() {
  const [selectedCard, setSelectedCard] = useState(() => 
    localStorage.getItem("selectedCard") || "No Card"
  );
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem("theme") === "dark"
  );
  const [greeting, setGreeting] = useState("Hello");
  const [toast, setToast] = useState(null);
  const [balance, setBalance] = useState(() => 
    parseInt(localStorage.getItem("balance")) || 0
  );

  // Purchased Plans State
  const [purchasedPlans, setPurchasedPlans] = useState(() => {
    const saved = localStorage.getItem("purchasedPlans");
    return saved ? JSON.parse(saved) : [];
  });

  // Payment Modal States
  const [showPayment, setShowPayment] = useState(false);
  const [subMonths, setSubMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Unlock Modal States
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [unlockProcessing, setUnlockProcessing] = useState(false);

  // Order Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planQty, setPlanQty] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Top Up Modal
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10000);
  const [topUpProcessing, setTopUpProcessing] = useState(false);

  // Plan Details Modal
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const PRICE_PER_MONTH = 32000;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("selectedCard", selectedCard);
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("purchasedPlans", JSON.stringify(purchasedPlans));
  }, [selectedCard, balance, purchasedPlans]);

  // Set greeting based on time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning ☀️");
    else if (hours < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toast function
  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle Buy Card Click
  const handleBuyCardClick = () => {
    setShowPayment(true);
  };

  // Handle Payment
  const handlePay = async () => {
    if (!paymentPhone || paymentPhone.length < 10) {
      showToast("Please enter a valid phone number", "warn");
      return;
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const amount = subMonths * PRICE_PER_MONTH;
    setBalance(prevBalance => prevBalance + amount);
    
    setProcessing(false);
    setShowPayment(false);
    setPaymentPhone("");
    showToast("Payment successful! 🎉", "success");
    
    setTimeout(() => {
      setShowUnlockModal(true);
    }, 500);
  };

  // Handle Card Unlock
  const handleUnlock = async () => {
    if (pin.length < 4) {
      showToast("Please enter a 4-digit PIN", "warn");
      return;
    }

    setUnlockProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (pin === "1234") {
      setSelectedCard("Meal Card");
      setShowUnlockModal(false);
      setPin("");
      setPinAttempts(0);
      setUnlockProcessing(false);
      showToast("Card unlocked successfully! 🎉", "success");
      
      setTimeout(() => {
        setActivePage("Restoz");
      }, 500);
    } else {
      setUnlockProcessing(false);
      setPinAttempts(prev => prev + 1);
      setPin("");
      showToast(`Wrong PIN. Try 1234 (${3 - pinAttempts} attempts left)`, "warn");
    }
  };

  // Handle Restaurant Order
  const handleOrder = (restaurant) => {
    if (selectedCard !== "Meal Card") {
      showToast("Please unlock a Meal Card first", "warn");
      return;
    }
    
    setSelectedRestaurant(restaurant);
    const firstPlan = Object.keys(restaurant.priceInfo || {})[0];
    setSelectedPlan(firstPlan);
    setPlanQty(1);
    setShowOrderModal(true);
  };

  // Handle Order Placement
  const handleOrderPlacement = async () => {
    if (!selectedRestaurant || !selectedPlan) {
      showToast("Please select a plan", "warn");
      return;
    }

    const price = selectedRestaurant.priceInfo[selectedPlan] || 0;
    const total = price * planQty;

    if (balance < total) {
      showToast("Insufficient balance. Please top up.", "warn");
      return;
    }

    setOrderProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Deduct balance
    setBalance(prevBalance => prevBalance - total);

    // Create purchased plan(s)
    const newPlans = Array.from({ length: planQty }).map((_, i) => ({
      id: Date.now() + i,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      planType: selectedPlan,
      totalMeals: getMealCount(selectedPlan),
      usedMeals: [],
      purchaseDate: Date.now(),
      expiryDate: Date.now() + (selectedPlan === "Month" ? 30 : 15) * 24 * 60 * 60 * 1000,
      price: price
    }));

    setPurchasedPlans(prev => [...prev, ...newPlans]);
    
    setOrderProcessing(false);
    setShowOrderModal(false);
    
    showToast(
      `Successfully purchased ${planQty} × ${selectedPlan} plan! 🍽️`, 
      "success"
    );

    // Navigate to MyIgifu to see plans
    setTimeout(() => {
      setActivePage("MyIgifu");
    }, 1000);
  };

  // Handle Use Meal
  const handleUseMeal = (planId, mealIndex) => {
    setPurchasedPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === planId && !plan.usedMeals.includes(mealIndex)) {
          return {
            ...plan,
            usedMeals: [...plan.usedMeals, mealIndex].sort((a, b) => a - b)
          };
        }
        return plan;
      })
    );
    showToast(`Meal ${mealIndex + 1} marked as used! 🍽️`, "success");
  };

  // Handle Top Up
  const handleTopUp = async () => {
    if (topUpAmount <= 0) {
      showToast("Please enter a valid amount", "warn");
      return;
    }

    setTopUpProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBalance(prevBalance => prevBalance + topUpAmount);
    setTopUpProcessing(false);
    setShowTopUpModal(false);
    setTopUpAmount(10000);
    
    showToast(`Successfully added RWF ${topUpAmount.toLocaleString()}!`, "success");
  };

  // MyIgifu Page Component
  const MyIgifuPage = () => {
    const activePlansCount = purchasedPlans.filter(p => p.usedMeals.length < p.totalMeals).length;

    return (
      <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
        <div className="mx-auto w-full max-w-6xl">
          {selectedCard === "Meal Card" && (
            <QuickStats 
              balance={balance}
              activePlans={activePlansCount}
              savedAmount={15000}
            />
          )}

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Your Digital Card</h2>
              <select 
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs sm:text-sm"
                value={selectedCard} 
                onChange={(e) => setSelectedCard(e.target.value)}
              >
                <option>No Card</option>
                <option>Meal Card</option>
              </select>
            </div>
            
            <DigitalMealCard 
              selectedCard={selectedCard}
              balance={balance}
              onBuyCard={handleBuyCardClick}
              onTopUp={() => setShowTopUpModal(true)}
              onHistory={() => showToast('Transaction history coming soon!', 'info')}
            />
          </div>

          {selectedCard === "Meal Card" && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
                {[
                  { icon: FaQrcode, label: 'Scan & Pay', color: 'blue', action: () => showToast('Scan & Pay coming soon!', 'info') },
                  { icon: FaHistory, label: 'History', color: 'purple', action: () => showToast('History coming soon!', 'info') },
                  { icon: FaCreditCard, label: 'Top Up', color: 'green', action: () => setShowTopUpModal(true) },
                  { icon: FaGift, label: 'Rewards', color: 'yellow', action: () => showToast('Rewards coming soon!', 'info') },
                ].map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={hoverScale}
                    whileTap={tapAnimation}
                    onClick={action.action}
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <action.icon className={`text-xl sm:text-2xl text-${action.color}-500 mb-1 sm:mb-2 mx-auto`} />
                    <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                      {action.label}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* My Active Plans */}
              {purchasedPlans.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    My Meal Plans ({activePlansCount} Active)
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {purchasedPlans.map(plan => (
                      <MealPlanCard
                        key={plan.id}
                        plan={plan}
                        onUseMeal={handleUseMeal}
                        onViewDetails={(p) => {
                          setSelectedPlanDetails(p);
                          setShowPlanDetails(true);
                        }}
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
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-6 text-white mb-6">
          <FaGift className="text-4xl sm:text-5xl mb-4" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">Coming Soon!</h3>
          <p className="text-sm sm:text-base">Earn points with every meal purchase and redeem for free meals.</p>
        </div>
      </div>
    </motion.section>
  );

  const LoansPage = () => (
    <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Student Loans</h2>
        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl sm:rounded-3xl p-6 text-white">
          <FaMoneyBill className="text-4xl sm:text-5xl mb-4" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">Quick Student Loans</h3>
          <p className="text-sm sm:text-base">Get instant meal loans when you need them most. Coming soon!</p>
        </div>
      </div>
    </motion.section>
  );

  const MorePage = () => (
    <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Settings & More</h2>
        
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={tapAnimation}
            onClick={() => showToast('Profile settings coming soon!', 'info')}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Profile</span>
            </div>
            <FaChevronRight className="text-gray-400" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl sm:text-2xl">🌙</div>
              <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Dark Mode</span>
            </div>
            <motion.button
              whileTap={tapAnimation}
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <motion.div
                layout
                className="w-5 h-5 bg-white rounded-full shadow-sm"
                style={{ marginLeft: darkMode ? '20px' : '0px' }}
              />
            </motion.button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={tapAnimation}
            onClick={() => showToast('Help & Support coming soon!', 'info')}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FaHeadset className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Help & Support</span>
            </div>
            <FaChevronRight className="text-gray-400" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={tapAnimation}
            onClick={() => {
              setSelectedCard("No Card");
              setBalance(0);
              setPurchasedPlans([]);
              showToast('Logged out successfully', 'info');
              setActivePage("MyIgifu");
            }}
            className="bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl p-4 border border-red-200 dark:border-red-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FaSignOutAlt className="text-xl sm:text-2xl text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">Sign Out</span>
            </div>
            <FaChevronRight className="text-red-400" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12] transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              whileTap={tapAnimation}
              className="text-2xl sm:text-3xl bg-white/20 backdrop-blur-md p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg"
            >
              🍽️
            </motion.div>
            <div>
              <div className="text-[10px] sm:text-xs opacity-90">{greeting}</div>
              <div className="text-sm sm:text-base font-bold">Welcome, Student</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileTap={tapAnimation}
              whileHover={hoverScale}
              onClick={() => showToast('Search coming soon!', 'info')}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <FaSearch className="text-sm sm:text-lg" />
            </motion.button>
            <motion.button
              whileTap={tapAnimation}
              whileHover={hoverScale}
              onClick={() => showToast('You have 3 new notifications', 'info')}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all relative"
            >
              <FaBell className="text-sm sm:text-lg" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>
            <motion.button
              whileTap={tapAnimation}
              whileHover={hoverScale}
              onClick={() => setActivePage("More")}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <FaUserCircle className="text-sm sm:text-lg" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
        <div className="mx-auto w-full max-w-6xl flex items-center gap-2 sm:gap-3">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black animate-pulse shrink-0" />
          <span className="font-bold text-xs sm:text-sm truncate">
            🎉 New restaurants added! Check out exclusive student discounts
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
          {activePage === "Restoz" && (
            <RestozPage
              key="restoz"
              showToast={showToast}
              onOrder={handleOrder}
            />
          )}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/10 py-2 z-40">
        <div className="mx-auto w-full max-w-6xl flex justify-around">
          {[
            { n: "MyIgifu", i: <FaWallet />, label: "Card" },
            { n: "Restoz", i: <FaUtensils />, label: "Restaurants" },
            { n: "Earn", i: <FaGift />, label: "Rewards" },
            { n: "Loans", i: <FaMoneyBill />, label: "Loans" },
            { n: "More", i: <FaEllipsisH />, label: "More" }
          ].map(t => {
            const isActive = activePage === t.n;
            return (
              <motion.button
                key={t.n}
                onClick={() => setActivePage(t.n)}
                whileTap={tapAnimation}
                className={`flex flex-col items-center p-2 relative transition-all ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className="text-xl sm:text-2xl mb-0.5 sm:mb-1"
                >
                  {t.i}
                </motion.div>
                <span className="text-[9px] sm:text-[10px] font-bold">{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav_indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {/* Payment Modal */}
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !processing && setShowPayment(false)}
          >
            <motion.div
              variants={modalMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Purchase Meal Card
              </h3>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 block text-gray-700 dark:text-gray-300">
                  Select Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.5, 1, 2].map(months => (
                    <motion.button
                      key={months}
                      whileTap={tapAnimation}
                      onClick={() => setSubMonths(months)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
                        subMonths === months
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {months === 0.5 ? 'Half' : months}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        {formatK(months * PRICE_PER_MONTH)}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    RWF {(subMonths * PRICE_PER_MONTH).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Total</span>
                    <span className="font-bold text-lg sm:text-xl text-blue-600">
                      RWF {(subMonths * PRICE_PER_MONTH).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold mb-2 block text-gray-700 dark:text-gray-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2 text-sm sm:text-base"
                >
                  <option>MTN Mobile Money</option>
                  <option>Airtel Money</option>
                </select>
                <input
                  type="tel"
                  value={paymentPhone}
                  onChange={e => setPaymentPhone(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Phone number (e.g., 0788123456)"
                />
              </div>

              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  whileTap={tapAnimation}
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm sm:text-base"
                  disabled={processing}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={tapAnimation}
                  onClick={handlePay}
                  disabled={processing}
                  className="flex-[2] py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 text-sm sm:text-base"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ${formatK(subMonths * PRICE_PER_MONTH)}`
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Unlock Modal */}
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaLock className="text-2xl sm:text-3xl text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Secure Your Card
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Create a 4-digit PIN to protect your card
                <br />
                <span className="text-xs sm:text-sm text-blue-600">(Hint: Use 1234 for demo)</span>
              </p>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="w-full h-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono tracking-widest bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-gray-900 dark:text-white"
                placeholder="••••"
                autoFocus
              />
              {pinAttempts > 0 && (
                <p className="text-red-500 text-xs sm:text-sm mb-4">
                  Wrong PIN. {3 - pinAttempts} attempts remaining
                </p>
              )}
              <motion.button
                whileTap={tapAnimation}
                onClick={handleUnlock}
                disabled={unlockProcessing || pin.length < 4}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base"
              >
                {unlockProcessing ? "Unlocking..." : "Set PIN & Continue"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Top Up Modal */}
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !topUpProcessing && setShowTopUpModal(false)}
          >
            <motion.div
              variants={modalMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Top Up Balance
              </h3>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 block text-gray-700 dark:text-gray-300">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 20000].map(amount => (
                    <motion.button
                      key={amount}
                      whileTap={tapAnimation}
                      onClick={() => setTopUpAmount(amount)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
                        topUpAmount === amount
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {formatK(amount)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        RWF
                      </div>
                    </motion.button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(parseInt(e.target.value) || 0)}
                  className="w-full mt-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Or enter custom amount"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Top Up Amount</span>
                  <span className="font-bold text-lg sm:text-xl text-green-600">
                    RWF {topUpAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  whileTap={tapAnimation}
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm sm:text-base"
                  disabled={topUpProcessing}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={tapAnimation}
                  onClick={handleTopUp}
                  disabled={topUpProcessing || topUpAmount <= 0}
                  className="flex-[2] py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold disabled:opacity-50 text-sm sm:text-base"
                >
                  {topUpProcessing ? "Processing..." : `Add ${formatK(topUpAmount)}`}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedRestaurant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              variants={modalMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-24 sm:h-32 bg-gradient-to-br from-blue-600 to-indigo-600">
                <img 
                  src={selectedRestaurant.image} 
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white text-center">
                    {selectedRestaurant.name}
                  </h3>
                </div>
                <motion.button
                  whileTap={tapAnimation}
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                >
                  <FaTimes className="text-white text-lg sm:text-xl" />
                </motion.button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                    Select Plan Duration
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(selectedRestaurant.priceInfo || {}).map(([plan, amount]) => (
                      <motion.button
                        key={plan}
                        whileTap={tapAnimation}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                          selectedPlan === plan
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                            {plan}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {getMealCount(plan)} meals
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-base sm:text-lg text-blue-600">
                            RWF {formatK(amount)}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                    Quantity
                  </h4>
                  <div className="flex items-center justify-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <motion.button
                      whileTap={tapAnimation}
                      onClick={() => setPlanQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl"
                    >
                      <FaMinus className="text-sm sm:text-base" />
                    </motion.button>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                      {planQty}
                    </span>
                    <motion.button
                      whileTap={tapAnimation}
                      onClick={() => setPlanQty(q => q + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl text-white"
                    >
                      <FaPlus className="text-sm sm:text-base" />
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      RWF {(() => {
                        const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0;
                        return (price * planQty).toLocaleString();
                      })()}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    Balance after: RWF {(() => {
                      const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0;
                      return Math.max(0, balance - (price * planQty)).toLocaleString();
                    })()}
                  </div>
                </div>

                <motion.button
                  whileTap={tapAnimation}
                  onClick={handleOrderPlacement}
                  disabled={orderProcessing || !selectedPlan}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {orderProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm Purchase
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Plan Details Modal */}
        {showPlanDetails && selectedPlanDetails && (
          <PlanDetailsModal
            plan={selectedPlanDetails}
            onClose={() => {
              setShowPlanDetails(false);
              setSelectedPlanDetails(null);
            }}
            onUseMeal={handleUseMeal}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className={`fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl font-bold text-white flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-md ${
              toast.tone === 'warn' 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : toast.tone === 'info'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
          >
            <span className="text-base sm:text-lg">{toast.tone === 'warn' ? '⚠️' : toast.tone === 'info' ? 'ℹ️' : '✅'}</span>
            <span className="text-xs sm:text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IgifuDashboardMainApp;





















































//












// import React, { useEffect, useState, useMemo } from "react";
// import {
//   FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
//   FaEllipsisH, FaLock, FaQuestionCircle, FaFilter, FaMapMarkerAlt,
//   FaHeart, FaRegHeart, FaRegClock, FaWalking,
//   FaCheckCircle, FaStar, FaShoppingCart, FaCreditCard, FaQrcode,
//   FaHistory, FaUserCircle, FaTimes, FaChevronRight, FaInfoCircle,
//   FaArrowLeft, FaPlus, FaMinus, FaCog, FaSignOutAlt, FaHeadset,
//   FaStoreAlt
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// // --- Animation Variants ---
// const pageMotion = {
//   initial: { opacity: 0, y: 15, filter: "blur(4px)" },
//   animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
//   exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
// };

// const modalMotion = {
//   initial: { opacity: 0, scale: 0.95, y: 20 },
//   animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
//   exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
// };

// const cardFlip = {
//   initial: { rotateY: 0 },
//   flipped: { rotateY: 180, transition: { duration: 0.6 } }
// };

// const tapAnimation = { scale: 0.95 };
// const hoverScale = { scale: 1.05 };

// // --- Helper functions ---
// const formatNumber = (amount) => {
//   if (typeof amount !== 'number' || isNaN(amount)) return "0";
//   return amount.toLocaleString();
// };

// const getMinutes = (walkTime = "") => {
//   const m = parseInt(String(walkTime).replace(/\D/g, ""), 10);
//   return isNaN(m) ? 0 : m;
// };

// // --- Digital Meal Card Component (Unified Card) ---
// const DigitalMealCard = ({ selectedCard, mealWallet, onBuyCard, onTopUp, onHistory }) => {
//   const [isFlipped, setIsFlipped] = useState(false);

//   if (selectedCard === "No Card") {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="relative"
//       >
//         <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl h-56 sm:h-64 flex flex-col items-center justify-center">
//           <FaLock className="text-4xl sm:text-6xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
//           <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-300 mb-2 text-center">
//             No Active Card
//           </h3>
//           <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4 px-4">
//             Get an Igifu Card to start ordering from restaurants.
//           </p>
//           <motion.button
//             whileHover={hoverScale}
//             whileTap={tapAnimation}
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBuyCard(); }}
//             className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
//           >
//             Get Your Card Now
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       className="relative preserve-3d cursor-pointer"
//       animate={isFlipped ? "flipped" : "initial"}
//       variants={cardFlip}
//       onClick={() => setIsFlipped(!isFlipped)}
//       style={{ transformStyle: "preserve-3d" }}
//     >
//       {/* Card Front */}
//       <motion.div
//         className="absolute inset-0 w-full h-full backface-hidden"
//         style={{ backfaceVisibility: "hidden" }}
//       >
//         <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl h-56 sm:h-64 relative overflow-hidden">
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute -right-10 -top-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white" />
//             <div className="absolute -left-10 -bottom-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white" />
//           </div>
//           <div className="relative z-10 h-full flex flex-col justify-between">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-white/80 text-xs sm:text-sm font-medium mb-1">IGIFU MEAL CARD</h3>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-400 text-sm" />
//                   <span className="text-white text-xs">Active</span>
//                 </div>
//               </div>
//               <FaUtensils className="text-white/30 text-2xl sm:text-3xl" />
//             </div>
//             <div className="space-y-2">
//               <div className="text-white/70 text-xs">Card Number</div>
//               <div className="text-white font-mono text-base sm:text-lg tracking-wider">
//                 •••• •••• •••• 4592
//               </div>
//             </div>
//             <div className="flex justify-between items-end">
//               <div>
//                 <div className="text-white/70 text-xs mb-1">Meal Wallet Balance</div>
//                 <div className="text-white text-xl sm:text-2xl font-bold">
//                   RWF {formatNumber(mealWallet)}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-white/70 text-xs mb-1">Valid Until</div>
//                 <div className="text-white text-sm">12/25</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//       {/* Card Back */}
//       <motion.div
//         className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
//         style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
//       >
//         <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl h-56 sm:h-64 flex flex-col justify-between">
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <FaQrcode className="text-white text-6xl sm:text-7xl" />
//             <p className="text-white/70 text-xs sm:text-sm text-center mt-2">
//               Scan to pay at restaurants
//             </p>
//           </div>
//           <div className="flex gap-2 w-full">
//             <motion.button
//               whileTap={tapAnimation}
//               onClick={(e) => { e.stopPropagation(); onTopUp(); }}
//               className="flex-1 px-3 sm:px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700"
//             >
//               Top Up Wallet
//             </motion.button>
//             <motion.button
//               whileTap={tapAnimation}
//               onClick={(e) => { e.stopPropagation(); onHistory(); }}
//               className="flex-1 px-3 sm:px-4 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-bold hover:bg-gray-600"
//             >
//               History
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };


// // --- Restaurant Card Component ---
// const RestaurantCard = ({ restaurant, index, onToggleFav, onViewDetails }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -8, transition: { duration: 0.2 } }}
//       transition={{ delay: index * 0.05 }}
//       onClick={() => onViewDetails(restaurant)} // <-- This is key for opening details modal
//       className="bg-white dark:bg-[#1a1a15] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden group relative cursor-pointer"
//     >
//       {restaurant.verified && (
//         <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
//           <FaCheckCircle className="text-xs" /> Verified
//         </div>
//       )}
//       <motion.button
//         whileTap={tapAnimation}
//         whileHover={hoverScale}
//         onClick={(e) => {
//           e.stopPropagation(); // Prevent card click when clicking the heart
//           onToggleFav(restaurant.id);
//         }}
//         className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
//       >
//         {restaurant.isFav ? (
//           <FaHeart className="text-red-500 text-lg sm:text-2xl animate-pulse" />
//         ) : (
//           <FaRegHeart className="text-gray-500 dark:text-gray-300 text-lg sm:text-2xl hover:text-red-500 transition-colors" />
//         )}
//       </motion.button>
//       <div className="relative h-40 sm:h-48 overflow-hidden">
//         <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10 ${!imageLoaded ? 'animate-pulse bg-gray-300 dark:bg-gray-700' : ''}`} />
//         <img
//           src={restaurant.image}
//           alt={restaurant.name}
//           className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
//           onLoad={() => setImageLoaded(true)}
//           loading="lazy"
//         />
//         <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-20 bg-black/70 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
//           <FaStar className="text-yellow-400 text-xs sm:text-sm" />
//           <span className="text-white font-bold text-xs sm:text-sm">{restaurant.rating}</span>
//         </div>
//         <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-20 bg-black/70 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
//           <FaWalking className="text-green-400 text-xs sm:text-sm" />
//           <span className="text-white font-bold text-xs sm:text-sm">{restaurant.walkTime}</span>
//         </div>
//       </div>
//       <div className="p-4 sm:p-5">
//         <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
//           {restaurant.name}
//         </h3>
//         <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
//           <FaMapMarkerAlt className="text-blue-500 text-xs" />
//           <span className="truncate">{restaurant.campus}</span>
//         </div>
//         {/* Short description on card */}
//         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8 sm:h-10">
//           {restaurant.description}
//         </p>
//         <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm">
//           <span>View Details & Menu</span>
//           <FaChevronRight />
//         </div>
//       </div>
//     </motion.div>
//   );
// };


// // --- NEW: Restaurant Details Modal ---
// const RestaurantDetailsModal = ({ restaurant, onClose, onProceedToOrder }) => {
//   if (!restaurant) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         variants={modalMotion}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//         onClick={e => e.stopPropagation()}
//         className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
//       >
//         {/* Header with Image */}
//         <div className="relative h-48 sm:h-64">
//           <img src={restaurant.image} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//           <motion.button
//             whileTap={tapAnimation}
//             onClick={onClose}
//             className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-10"
//           >
//             <FaTimes className="text-xl" />
//           </motion.button>
//           <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
//             <h2 className="text-2xl sm:text-4xl font-bold mb-1">{restaurant.name}</h2>
//             <div className="flex items-center gap-2 text-white/90 text-sm">
//               <FaMapMarkerAlt />
//               <span>{restaurant.campus}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-3 gap-4 text-center mb-6">
//             <div>
//               <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"><FaStar className="text-yellow-400"/> {restaurant.rating}</div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
//             </div>
//             <div>
//               <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"><FaWalking className="text-green-500"/> {getMinutes(restaurant.walkTime)}</div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">min walk</div>
//             </div>
//             <div>
//               <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"><FaStoreAlt className="text-blue-500"/></div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">{restaurant.selfService ? 'Self-Service' : 'Table Service'}</div>
//             </div>
//           </div>
          
//           {/* Description */}
//           <div className="mb-6">
//             <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">About {restaurant.name}</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//               {restaurant.description}
//             </p>
//           </div>
          
//           {/* Menu Highlights */}
//           <div className="mb-6">
//             <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Menu Highlights</h3>
//             <div className="flex flex-wrap gap-2">
//               {restaurant.menuHighlights.map(item => (
//                 <span key={item} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
//                   {item}
//                 </span>
//               ))}
//             </div>
//           </div>
          
//           {/* Operating Hours */}
//           <div>
//             <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Operating Hours</h3>
//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
//               <FaRegClock />
//               <span>{restaurant.hours}</span>
//             </div>
//           </div>
//         </div>
        
//         {/* Action Button */}
//         <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
//           <motion.button
//             whileTap={tapAnimation}
//             whileHover={{ scale: 1.02 }}
//             onClick={() => onProceedToOrder(restaurant)}
//             className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg"
//           >
//             <FaShoppingCart />
//             Purchase a Meal
//           </motion.button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };


// // --- Quick Stats Dashboard ---
// const QuickStats = ({ mealWallet, flexiWallet, transactionsCount }) => {
//   const stats = [
//     { label: 'Meal Wallet', value: `${formatNumber(mealWallet)}`, icon: FaWallet, color: 'blue', unit: 'RWF' },
//     { label: 'Flexi Wallet', value: `${formatNumber(flexiWallet)}`, icon: FaMoneyBill, color: 'purple', unit: 'RWF' },
//     { label: 'Transactions', value: transactionsCount, icon: FaHistory, color: 'green', unit: '' },
//     { label: 'Saved', value: `${formatNumber(15000)}`, icon: FaGift, color: 'yellow', unit: 'RWF' },
//   ];

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
//       {stats.map((stat, index) => (
//         <motion.div
//           key={stat.label}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1 }}
//           className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
//         >
//           <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-2`}>
//             <stat.icon className={`text-base sm:text-lg text-${stat.color}-600 dark:text-${stat.color}-400`} />
//           </div>
//           <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
//             {stat.value}
//           </div>
//           <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
//             {stat.unit && <span className="text-[9px] sm:text-[10px]">{stat.unit} </span>}
//             {stat.label}
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// // --- Enhanced Filter Bar ---
// const EnhancedFilterBar = ({ filterState, setFilterState, resultsCount }) => {
//   const [expandedFilters, setExpandedFilters] = useState(false);

//   const quickFilters = [
//     { key: 'verified', label: 'Verified', icon: FaCheckCircle },
//     { key: 'favorites', label: 'Favorites', icon: FaHeart },
//     { key: 'nearMe', label: 'Near Me', icon: FaMapMarkerAlt },
//     { key: 'budget', label: 'Budget', icon: FaWallet },
//   ];

//   return (
//     <div className="bg-white dark:bg-[#0b0b12] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
//       <div className="px-3 sm:px-4 py-3">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2">
//             <FaFilter className="text-gray-500 text-sm" />
//             <span className="font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
//               Filters
//             </span>
//             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
//               {resultsCount}
//             </span>
//           </div>
//           <motion.button
//             whileTap={tapAnimation}
//             onClick={() => setExpandedFilters(!expandedFilters)}
//             className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"
//           >
//             {expandedFilters ? 'Less' : 'More'}
//             <FaChevronRight className={`transition-transform text-xs ${expandedFilters ? 'rotate-90' : ''}`} />
//           </motion.button>
//         </div>

//         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//           {quickFilters.map(filter => (
//             <motion.button
//               key={filter.key}
//               whileTap={tapAnimation}
//               onClick={() => setFilterState(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
//               className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border whitespace-nowrap transition-all text-xs sm:text-sm ${
//                 filterState[filter.key]
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
//               }`}
//             >
//               <filter.icon className="text-xs" />
//               <span className="hidden sm:inline">{filter.label}</span>
//               <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       <AnimatePresence>
//         {expandedFilters && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="border-t border-gray-200 dark:border-white/10 overflow-hidden"
//           >
//             <div className="p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
//               <select 
//                 className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
//                 value={filterState.campus}
//                 onChange={(e) => setFilterState(prev => ({ ...prev, campus: e.target.value }))}
//               >
//                 <option value="All Campuses">All Campuses</option>
//                 <option value="Huye Campus">Huye</option>
//                 <option value="Remera Campus">Remera</option>
//                 <option value="Nyarugaenge Campus">Nyarugaenge</option>
//               </select>

//               <select 
//                 className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
//                 value={filterState.priceSort}
//                 onChange={(e) => setFilterState(prev => ({ ...prev, priceSort: e.target.value }))}
//               >
//                 <option value="None">Sort: Price</option>
//                 <option value="Low to High">Low to High</option>
//                 <option value="High to Low">High to Low</option>
//               </select>

//               <select 
//                 className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
//                 value={filterState.walkTime}
//                 onChange={(e) => setFilterState(prev => ({ ...prev, walkTime: e.target.value }))}
//               >
//                 <option value="All Times">Distance</option>
//                 <option value="< 5 mins">Under 5min</option>
//                 <option value="5-10 mins">5-10min</option>
//                 <option value="> 10 mins">Over 10min</option>
//               </select>

//               <select 
//                 className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
//                 value={filterState.selfService}
//                 onChange={(e) => setFilterState(prev => ({ ...prev, selfService: e.target.value }))}
//               >
//                 <option value="Any">Service</option>
//                 <option value="Yes">Self-Service</option>
//                 <option value="No">Table Service</option>
//               </select>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };


// // --- Restoz Page ---
// const RestozPage = ({ showToast, onViewDetails }) => {
//   const [activeTab, setActiveTab] = useState("Browse");
//   const [filterState, setFilterState] = useState({
//     campus: "All Campuses",
//     priceSort: "None",
//     walkTime: "All Times",
//     selfService: "Any",
//     verified: false,
//     favorites: false,
//     nearMe: false,
//     budget: false,
//   });

//   // UPDATED SEED DATA with description and menu items
//   const restaurantsSeed = useMemo(() => ([
//     {
//       id: 1, name: "Campus Bites", campus: "Huye Campus",
//       priceInfo: { "Daily Plate": 1500, "Weekly": 10000 }, walkTime: "3 mins",
//       selfService: false, isFav: true, verified: true, rating: 4.8,
//       image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
//       description: "A cozy spot near the main library known for its hearty traditional Rwandan buffet. Perfect for a quick, filling, and delicious lunch between classes.",
//       menuHighlights: ["Rwandan Buffet", "Grilled Tilapia", "Fresh Juice", "Isombe"],
//       hours: "7:00 AM - 9:00 PM"
//     },
//     {
//       id: 2, name: "Inka Kitchen", campus: "Remera Campus",
//       priceInfo: { "Daily Plate": 1800, "Weekly": 12000 }, walkTime: "10 mins",
//       selfService: true, isFav: false, verified: true, rating: 4.5,
//       image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80",
//       description: "Modern and clean, Inka Kitchen offers a self-service model with a wide variety of international and local dishes. Great for groups.",
//       menuHighlights: ["Pasta", "Chicken & Chips", "Rolex", "Pizza Slices", "Salad Bar"],
//       hours: "8:00 AM - 10:00 PM"
//     },
//     {
//       id: 3, name: "Nyarugenge Cafeteria", campus: "Nyarugaenge Campus",
//       priceInfo: { "Daily Plate": 1200, "Weekly": 8000 }, walkTime: "5 mins",
//       selfService: true, isFav: false, verified: false, rating: 4.2,
//       image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
//       description: "The official campus cafeteria. Budget-friendly and reliable, serving large portions of student-favorite meals. The best value for money on campus.",
//       menuHighlights: ["Beans & Rice", "Ugali", "Goat Stew", "Chapati"],
//       hours: "6:30 AM - 8:00 PM"
//     },
//     {
//       id: 4, name: "Gishushu Grill", campus: "Huye Campus",
//       priceInfo: { "Daily Plate": 1400, "Weekly": 9500 }, walkTime: "2 mins",
//       selfService: false, isFav: false, verified: true, rating: 4.7,
//       image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80",
//       description: "Famous for its grilled meats and evening vibes. A popular hangout spot after 5 PM with great music and a lively atmosphere.",
//       menuHighlights: ["Nyama Choma", "Brochettes", "Mishkaki", "Cold Beers"],
//       hours: "11:00 AM - 11:00 PM"
//     }
//   ]), []);

//   const [restaurants, setRestaurants] = useState(restaurantsSeed);
//   const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

//   useEffect(() => {
//     let temp = [...restaurants];
    
//     if (activeTab === "Favourites" || filterState.favorites) {
//       temp = temp.filter(r => r.isFav);
//     }
//     if (filterState.verified) temp = temp.filter(r => r.verified);
//     if (filterState.budget) {
//       temp = temp.filter(r => Math.min(...Object.values(r.priceInfo)) <= 1500);
//     }
//     if (filterState.nearMe) temp = temp.filter(r => getMinutes(r.walkTime) <= 5);
//     if (filterState.campus !== "All Campuses") temp = temp.filter(r => r.campus === filterState.campus);

//     // Filter logic remains the same
    
//     setFilteredRestaurants(temp);
//   }, [restaurants, activeTab, filterState]);

//   const toggleFav = (id) => {
//     setRestaurants(prev =>
//       prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r))
//     );
//     showToast("Favorite updated", "info");
//   };

//   return (
//     <motion.section {...pageMotion} className="pb-28 min-h-screen">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-4 sm:py-6">
//         <div className="mx-auto w-full max-w-6xl">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Meal</h1>
//           <p className="text-blue-100 mb-4 text-xs sm:text-sm md:text-base">Choose from verified campus restaurants</p>
//           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//             {['Browse', 'Favourites', 'Nearby', 'Deals'].map(tab => (
//               <motion.button
//                 key={tab}
//                 whileTap={tapAnimation}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
//                   activeTab === tab
//                     ? 'bg-white text-blue-700 shadow-lg'
//                     : 'bg-white/20 text-white hover:bg-white/30'
//                 }`}
//               >
//                 {tab}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <EnhancedFilterBar
//         filterState={filterState}
//         setFilterState={setFilterState}
//         resultsCount={filteredRestaurants.length}
//       />

//       <div className="p-3 sm:p-4">
//         <div className="mx-auto w-full max-w-6xl">
//           {filteredRestaurants.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12"
//             >
//               <FaSearch className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
//                 No restaurants found
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-500">
//                 Try adjusting your filters
//               </p>
//             </motion.div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {filteredRestaurants.map((restaurant, index) => (
//                 <RestaurantCard
//                   key={restaurant.id}
//                   restaurant={restaurant}
//                   index={index}
//                   onToggleFav={toggleFav}
//                   onViewDetails={onViewDetails}
//                   showToast={showToast}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.section>
//   );
// };


// // --- Main App Component ---
// function IgifuDashboardMainApp() {
//   const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "No Card");
//   const [activePage, setActivePage] = useState("Restoz");
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
//   const [greeting, setGreeting] = useState("Hello");
//   const [toast, setToast] = useState(null);

//   // --- UNIFIED WALLET SYSTEM ---
//   const [mealWallet, setMealWallet] = useState(() => parseInt(localStorage.getItem("mealWallet")) || 0);
//   const [flexiWallet, setFlexiWallet] = useState(() => parseInt(localStorage.getItem("flexiWallet")) || 0);
//   const [transactionHistory, setTransactionHistory] = useState(() => {
//     const saved = localStorage.getItem("transactionHistory");
//     return saved ? JSON.parse(saved) : [];
//   });
  
//   // REMOVED `purchasedPlans` state.

//   // --- Modal States ---
//   const [showPayment, setShowPayment] = useState(false);
//   const [subMonths, setSubMonths] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
//   const [paymentPhone, setPaymentPhone] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [showUnlockModal, setShowUnlockModal] = useState(false);
//   const [pin, setPin] = useState("");
//   const [pinAttempts, setPinAttempts] = useState(0);
//   const [unlockProcessing, setUnlockProcessing] = useState(false);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null); // This now refers to a "meal package"
//   const [planQty, setPlanQty] = useState(1);
//   const [orderProcessing, setOrderProcessing] = useState(false);
//   const [showTopUpModal, setShowTopUpModal] = useState(false);
//   const [topUpAmount, setTopUpAmount] = useState(10000);
//   const [topUpProcessing, setTopUpProcessing] = useState(false);
//   const [topUpTargetWallet, setTopUpTargetWallet] = useState('meal');
  
//   // NEW state for restaurant details modal
//   const [showRestaurantDetails, setShowRestaurantDetails] = useState(false);


//   const PRICE_PER_MONTH = 32000;

//   useEffect(() => {
//     localStorage.setItem("selectedCard", selectedCard);
//     localStorage.setItem("mealWallet", mealWallet.toString());
//     localStorage.setItem("flexiWallet", flexiWallet.toString());
//     localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));
//   }, [selectedCard, mealWallet, flexiWallet, transactionHistory]);

//   useEffect(() => {
//     const hours = new Date().getHours();
//     if (hours < 12) setGreeting("Good Morning ☀️");
//     else if (hours < 18) setGreeting("Good Afternoon 🌤️");
//     else setGreeting("Good Evening 🌙");
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   const showToast = (message, tone = "success") => {
//     setToast({ message, tone });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleBuyCardClick = () => setShowPayment(true);
  
//   const handlePay = async () => {
//     if (!paymentPhone || paymentPhone.length < 10) {
//       showToast("Please enter a valid phone number", "warn"); return;
//     }
//     setProcessing(true);
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     const amount = subMonths * PRICE_PER_MONTH;
//     setMealWallet(prev => prev + amount);
//     setProcessing(false);
//     setShowPayment(false);
//     setPaymentPhone("");
//     showToast("Payment successful! 🎉", "success");
//     setTimeout(() => setShowUnlockModal(true), 500);
//   };

//   const handleUnlock = async () => {
//     if (pin.length < 4) {
//       showToast("Please enter a 4-digit PIN", "warn"); return;
//     }
//     setUnlockProcessing(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     if (pin === "1234") {
//       setSelectedCard("Meal Card");
//       setShowUnlockModal(false);
//       setPin("");
//       setPinAttempts(0);
//       setUnlockProcessing(false);
//       showToast("Card unlocked successfully! 🎉", "success");
//       setTimeout(() => setActivePage("Restoz"), 500);
//     } else {
//       setUnlockProcessing(false);
//       setPinAttempts(prev => prev + 1);
//       setPin("");
//       showToast(`Wrong PIN. Try 1234 (${3 - pinAttempts} attempts left)`, "warn");
//     }
//   };
  
//   // --- NEW FLOW FUNCTIONS ---
//   const handleViewDetails = (restaurant) => {
//     setSelectedRestaurant(restaurant);
//     setShowRestaurantDetails(true);
//   };
  
//   const handleProceedToOrder = (restaurant) => {
//     if (selectedCard !== "Meal Card") {
//       showToast("Please get an Igifu Card first", "warn");
//       handleBuyCardClick();
//       return;
//     }
//     setShowRestaurantDetails(false);
//     const firstPlan = Object.keys(restaurant.priceInfo || {})[0];
//     setSelectedPlan(firstPlan);
//     setPlanQty(1);
//     setShowOrderModal(true); // selectedRestaurant is already set
//   };
  
//   // REWORKED order placement to use unified wallet and history
//   const handleOrderPlacement = async () => {
//     if (!selectedRestaurant || !selectedPlan) {
//       showToast("Please select a meal package", "warn"); return;
//     }
//     const price = selectedRestaurant.priceInfo[selectedPlan] || 0;
//     const total = price * planQty;

//     if (mealWallet < total) {
//       showToast("Insufficient Meal Wallet balance. Please top up.", "warn"); return;
//     }

//     setOrderProcessing(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     setMealWallet(prev => prev - total);
    
//     // Add to transaction history
//     const newTransaction = {
//       id: Date.now(),
//       restaurantName: selectedRestaurant.name,
//       description: `${planQty} × ${selectedPlan}`,
//       amount: total,
//       date: Date.now(),
//     };
//     setTransactionHistory(prev => [newTransaction, ...prev]);

//     setOrderProcessing(false);
//     setShowOrderModal(false);
//     showToast(`Successfully purchased from ${selectedRestaurant.name}! 🍽️`, "success");
//     setTimeout(() => setActivePage("MyIgifu"), 1000);
//   };

//   const handleShowTopUpModal = (walletType = 'meal') => {
//     setTopUpTargetWallet(walletType);
//     setShowTopUpModal(true);
//   };
  
//   const handleTopUp = async () => {
//     if (topUpAmount <= 0) {
//       showToast("Please enter a valid amount", "warn"); return;
//     }
//     setTopUpProcessing(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     if (topUpTargetWallet === 'meal') setMealWallet(prev => prev + topUpAmount);
//     else if (topUpTargetWallet === 'flexi') setFlexiWallet(prev => prev + topUpAmount);
    
//     setTopUpProcessing(false);
//     setShowTopUpModal(false);
//     const walletName = topUpTargetWallet === 'meal' ? 'Meal' : 'Flexi';
//     showToast(`Successfully added RWF ${formatNumber(topUpAmount)} to ${walletName} Wallet!`, "success");
//     setTopUpAmount(10000);
//   };


//   // --- MyIgifu Page (Simplified) ---
//   const MyIgifuPage = () => {
//     return (
//       <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
//         <div className="mx-auto w-full max-w-6xl">
//           {selectedCard === "Meal Card" && (
//             <QuickStats 
//               mealWallet={mealWallet}
//               flexiWallet={flexiWallet}
//               transactionsCount={transactionHistory.length}
//             />
//           )}

//           <div className="mb-4 sm:mb-6">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Your Digital Card</h2>
//             <DigitalMealCard 
//               selectedCard={selectedCard}
//               mealWallet={mealWallet}
//               onBuyCard={handleBuyCardClick}
//               onTopUp={handleShowTopUpModal}
//               onHistory={() => showToast('Full history coming soon!', 'info')}
//             />
//           </div>

//           {/* NEW: Transaction History Section */}
//           {selectedCard === "Meal Card" && transactionHistory.length > 0 && (
//             <div>
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
//                 Recent Transactions
//               </h2>
//               <div className="space-y-3">
//                 {transactionHistory.slice(0, 5).map(tx => (
//                   <motion.div 
//                     key={tx.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                         <FaUtensils className="text-red-600 dark:text-red-400"/>
//                       </div>
//                       <div>
//                         <p className="font-bold text-gray-800 dark:text-gray-100">{tx.restaurantName}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                        <p className="font-bold text-red-600">- RWF {formatNumber(tx.amount)}</p>
//                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.description}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.section>
//     );
//   };
  
//   // --- Other Pages (Unchanged) ---
//   const EarnPage = () => (
//     <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
//       <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 max-w-6xl mx-auto">Earn Rewards</h2>
//     </motion.section>
//   );

//   const LoansPage = () => (
//     <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
//       <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 max-w-6xl mx-auto">Student Loans</h2>
//     </motion.section>
//   );

//   const MorePage = () => (
//     <motion.section {...pageMotion} className="px-3 sm:px-4 py-4 sm:py-6 pb-28">
//        <div className="mx-auto w-full max-w-6xl">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Settings & More</h2>
//         <div className="space-y-3">
//             <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
//             >
//                 <div className="flex items-center gap-3">
//                 <div className="text-xl sm:text-2xl">🌙</div>
//                 <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Dark Mode</span>
//                 </div>
//                 <motion.button
//                     whileTap={tapAnimation}
//                     onClick={() => setDarkMode(!darkMode)}
//                     className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
//                 >
//                 <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm" style={{ marginLeft: darkMode ? '20px' : '0px' }} />
//                 </motion.button>
//             </motion.div>
//             <motion.div
//             whileHover={{ scale: 1.02 }}
//             whileTap={tapAnimation}
//             onClick={() => {
//               localStorage.clear();
//               setSelectedCard("No Card");
//               setMealWallet(0);
//               setFlexiWallet(0);
//               setTransactionHistory([]);
//               showToast('Logged out successfully', 'info');
//               setActivePage("Restoz");
//             }}
//             className="bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl p-4 border border-red-200 dark:border-red-700 flex items-center justify-between cursor-pointer"
//           >
//             <div className="flex items-center gap-3">
//               <FaSignOutAlt className="text-xl sm:text-2xl text-red-600 dark:text-red-400" />
//               <span className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">Sign Out & Clear Data</span>
//             </div>
//             <FaChevronRight className="text-red-400" />
//           </motion.div>
//         </div>
//       </div>
//     </motion.section>
//   );

//   return (
//     <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12] transition-colors duration-300">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-40 shadow-lg">
//         <div className="flex items-center justify-between max-w-6xl mx-auto">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <motion.div whileTap={tapAnimation} className="text-2xl sm:text-3xl bg-white/20 backdrop-blur-md p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
//               🍽️
//             </motion.div>
//             <div>
//               <div className="text-[10px] sm:text-xs opacity-90">{greeting}</div>
//               <div className="text-sm sm:text-base font-bold">Welcome, Student</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3">
//             <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => showToast('Search coming soon!', 'info')} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all">
//               <FaSearch className="text-sm sm:text-lg" />
//             </motion.button>
//             <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => showToast('You have 3 new notifications', 'info')} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all relative">
//               <FaBell className="text-sm sm:text-lg" />
//               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
//             </motion.button>
//             <motion.button whileTap={tapAnimation} whileHover={hoverScale} onClick={() => setActivePage("More")} className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all">
//               <FaUserCircle className="text-sm sm:text-lg" />
//             </motion.button>
//           </div>
//         </div>
//       </header>
      
//       {/* Main Content */}
//       <main className="flex-1">
//         <AnimatePresence mode="wait">
//           {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
//           {activePage === "Restoz" && <RestozPage key="restoz" showToast={showToast} onViewDetails={handleViewDetails} />}
//           {activePage === "Earn" && <EarnPage key="earn" />}
//           {activePage === "Loans" && <LoansPage key="loans" />}
//           {activePage === "More" && <MorePage key="more" />}
//         </AnimatePresence>
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/10 py-2 z-40">
//         <div className="mx-auto w-full max-w-6xl flex justify-around">
//           {[
//             { n: "Restoz", i: <FaUtensils />, label: "Restaurants" },
//             { n: "MyIgifu", i: <FaWallet />, label: "Card" },
//             { n: "Earn", i: <FaGift />, label: "Rewards" },
//             { n: "Loans", i: <FaMoneyBill />, label: "Loans" },
//             { n: "More", i: <FaEllipsisH />, label: "More" }
//           ].map(t => {
//             const isActive = activePage === t.n;
//             return (
//               <motion.button
//                 key={t.n}
//                 onClick={() => setActivePage(t.n)}
//                 whileTap={tapAnimation}
//                 className={`flex flex-col items-center p-2 relative transition-all ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
//               >
//                 <motion.div animate={{ scale: isActive ? 1.1 : 1 }} className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{t.i}</motion.div>
//                 <span className="text-[9px] sm:text-[10px] font-bold">{t.label}</span>
//                 {isActive && (
//                   <motion.div layoutId="nav_indicator" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Modals */}
//       <AnimatePresence>
//         {/* Restaurant Details Modal */}
//         {showRestaurantDetails && (
//             <RestaurantDetailsModal 
//                 restaurant={selectedRestaurant}
//                 onClose={() => setShowRestaurantDetails(false)}
//                 onProceedToOrder={handleProceedToOrder}
//             />
//         )}
        
//         {/* Order Modal */}
//         {showOrderModal && selectedRestaurant && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowOrderModal(false)}>
//             <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
//               {/* ... (rest of the modal code is mostly the same, just re-label "plan" to "package") */}
//               <div className="p-5 sm:p-6">
//                  <h3 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">Order from {selectedRestaurant.name}</h3>
//                  <div className="mb-4 sm:mb-6">
//                   <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
//                     Select Meal Package
//                   </h4>
//                   <div className="space-y-2">
//                     {Object.entries(selectedRestaurant.priceInfo || {}).map(([plan, amount]) => (
//                       <motion.button key={plan} whileTap={tapAnimation} onClick={() => setSelectedPlan(plan)} className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedPlan === plan ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
//                         <div className="text-left font-bold text-gray-900 dark:text-white text-sm sm:text-base">{plan}</div>
//                         <div className="text-right font-bold text-base sm:text-lg text-blue-600">RWF {formatNumber(amount)}</div>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>
//                 {/* ... Quantity and Total sections ... */}
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
//                   <div className="flex justify-between items-center mb-1 sm:mb-2">
//                     <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Amount</span>
//                     <span className="text-xl sm:text-2xl font-bold text-blue-600">
//                       RWF {(() => {
//                         const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0;
//                         return formatNumber(price * planQty);
//                       })()}
//                     </span>
//                   </div>
//                   <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
//                     Balance after: RWF {(() => {
//                       const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0;
//                       return formatNumber(Math.max(0, mealWallet - (price * planQty)));
//                     })()}
//                   </div>
//                 </div>

//                 <motion.button whileTap={tapAnimation} onClick={handleOrderPlacement} disabled={orderProcessing || !selectedPlan} className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50">
//                   {orderProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FaCheckCircle /> Confirm Purchase</>}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
        
//         {/* Top Up and other modals remain the same */}
//         {showTopUpModal && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !topUpProcessing && setShowTopUpModal(false)}>
//                 <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl">
//                     <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">Top Up Meal Wallet</h3>
//                      <div className="mb-4 sm:mb-6">
//                         <label className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 block text-gray-700 dark:text-gray-300">Select Amount</label>
//                         <div className="grid grid-cols-3 gap-2">
//                         {[5000, 10000, 20000].map(amount => (
//                             <motion.button key={amount} whileTap={tapAnimation} onClick={() => setTopUpAmount(amount)} className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${topUpAmount === amount ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
//                                 <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{formatNumber(amount)}</div>
//                                 <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">RWF</div>
//                             </motion.button>
//                         ))}
//                         </div>
//                         <input type="number" value={topUpAmount} onChange={e => setTopUpAmount(parseInt(e.target.value) || 0)} className="w-full mt-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base" placeholder="Or enter custom amount" />
//                     </div>
//                      <div className="flex gap-2 sm:gap-3">
//                         <motion.button whileTap={tapAnimation} onClick={() => setShowTopUpModal(false)} className="flex-1 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm sm:text-base" disabled={topUpProcessing}>Cancel</motion.button>
//                         <motion.button whileTap={tapAnimation} onClick={handleTopUp} disabled={topUpProcessing || topUpAmount <= 0} className="flex-[2] py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold disabled:opacity-50 text-sm sm:text-base">
//                         {topUpProcessing ? "Processing..." : `Add RWF ${formatNumber(topUpAmount)}`}
//                         </motion.button>
//                     </div>
//                 </motion.div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toast Notifications */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             initial={{ y: 100, opacity: 0, scale: 0.9 }}
//             animate={{ y: 0, opacity: 1, scale: 1 }}
//             exit={{ y: 50, opacity: 0, scale: 0.9 }}
//             className={`fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl font-bold text-white flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-md ${
//               toast.tone === 'warn' 
//                 ? 'bg-gradient-to-r from-red-500 to-red-600' 
//                 : toast.tone === 'info'
//                 ? 'bg-gradient-to-r from-blue-500 to-blue-600'
//                 : 'bg-gradient-to-r from-green-500 to-green-600'
//             }`}
//           >
//             <span className="text-base sm:text-lg">{toast.tone === 'warn' ? '⚠️' : toast.tone === 'info' ? 'ℹ️' : '✅'}</span>
//             <span className="text-xs sm:text-sm">{toast.message}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default IgifuDashboardMainApp;



















































































