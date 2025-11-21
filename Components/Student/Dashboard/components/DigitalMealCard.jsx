import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle, FaBolt, FaQrcode, FaUtensils, FaWallet } from 'react-icons/fa';
import CardLockOverlay from './CardLockOverlay';
import { cardFlip, tapAnimation, hoverScale } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

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

export default DigitalMealCard;
