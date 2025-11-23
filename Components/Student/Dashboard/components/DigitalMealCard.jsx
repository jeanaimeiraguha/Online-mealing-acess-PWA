import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaExchangeAlt, FaQuestionCircle, FaShareAlt, FaTag, FaMoneyBillWave, FaLock, FaCheckCircle, FaUnlock, FaFingerprint, FaKeyboard } from 'react-icons/fa';
import { tapAnimation, hoverScale } from '../utils/animations';
import { formatAmount } from '../utils/helpers';
import SwapWalletsModal from '../modals/SwapWalletsModal';

const ActionButton = ({ icon: Icon, label, isSoon, onClick, disabled, isPrimary, isPurchased }) => (
  <motion.button
    whileHover={!disabled ? hoverScale : {}}
    whileTap={tapAnimation}
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 relative rounded-lg shadow-md transition-all duration-300
      ${isPurchased
        ? 'bg-green-600 text-white cursor-default'
        : isPrimary 
        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}
      ${disabled 
        ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500' 
        : ''}
    `}
  >
    {isPurchased ? <FaCheckCircle /> : (disabled ? <FaLock /> : <Icon />)}
    <span>{isPurchased ? 'Purchased' : label}</span>
    {isSoon && <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-1">Soon</span>}
  </motion.button>
);

const DigitalMealCard = ({ subscriptions = [], onOrder }) => {
  // State to track if the user has completed the "Buy Igifu" action
  const [isLocked, setIsLocked] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'fingerprint' or 'passcode'
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [igifuPurchased, setIgifuPurchased] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [wallets, setWallets] = useState({ meal: 60000, flexie: 0 });
  const [activeTab, setActiveTab] = useState('meal');
  const [plateCount, setPlateCount] = useState(1);

  // Dummy function to simulate buying Igifu
  const handleBuyIgifu = () => {
    if (!igifuPurchased) {
      setIgifuPurchased(true);
    }
  };

  const handleConfirmSwap = (swapAmount) => {
    setWallets(prev => ({
      meal: prev.meal - swapAmount,
      flexie: prev.flexie + swapAmount
    }));
    // You could show a success toast here
  };

  const handlePlateChange = (amount) => {
    setPlateCount(prev => Math.max(1, prev + amount));
  };

  const handleOrderOrSubscribe = () => {
    if (activeSubscription) {
      onOrder(activeSubscription.restaurantId);
    } else {
      // Smoothly scroll to the restaurant list
      document.getElementById('restaurant-list-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUnlock = (method) => {
    if (isLocked && !isAuthenticating) {
      setPasscodeError('');
      setPasscode('');
      setAuthMethod(method);
      setIsAuthenticating(true);
      // For fingerprint, simulate automatic success
      if (method === 'fingerprint') {
        setTimeout(() => {
          setIsLocked(false);
          setIsAuthenticating(false);
          setAuthMethod(null);
        }, 1500);
      }
    }
  };

  const handlePasscodeSubmit = () => {
    if (passcode === '1234') { // Dummy passcode for simulation
      setIsLocked(false);
      setIsAuthenticating(false);
      setAuthMethod(null);
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  // Find the first active subscription to display as the card
  const activeSubscription = subscriptions.length > 0 ? subscriptions[0] : null;

  return (
    <>
      <div className="p-4 bg-[#0b0b12] text-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Igifu Card</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        <ActionButton 
          icon={FaShoppingCart} 
          label="Buy Igifu" 
          onClick={handleBuyIgifu} 
          isPrimary 
          isPurchased={igifuPurchased}
          disabled={igifuPurchased}
        />
        <ActionButton icon={FaExchangeAlt} label="Swap Wallets" disabled={!igifuPurchased} onClick={() => setShowSwapModal(true)} />
        <ActionButton icon={FaQuestionCircle} label="Support" />
        <ActionButton icon={FaShareAlt} label="Share Meals" isSoon disabled />
        <ActionButton icon={FaTag} label="Sell Igifu" isSoon disabled />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-300">Available Igifu Cards</span>
        <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2">
          <option>{activeSubscription ? activeSubscription.restaurantName : 'No Active Card'}</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 shadow-2xl">
        {/* Lock/Unlock Button */}
        <motion.button whileTap={tapAnimation} onClick={() => setIsLocked(!isLocked)} className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center z-20">
          {isLocked ? <FaLock className="text-yellow-400" /> : <FaUnlock className="text-green-400" />}
        </motion.button>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{activeSubscription ? activeSubscription.restaurantName : 'Igifu Card'}</h3>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">ID: {activeSubscription ? activeSubscription.restaurantId : 'N/A'}</span>
          </div>
        </div>

        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('meal')}
            className={`flex-1 py-3 font-bold rounded-t-lg transition-colors ${activeTab === 'meal' ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Meal Wallet
          </button>
          <button
            onClick={() => setActiveTab('flexie')}
            className={`flex-1 py-3 font-bold rounded-t-lg transition-colors ${activeTab === 'flexie' ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Flexie Wallet
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-b-lg relative">
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-b-lg p-4"
              >
                {isAuthenticating && authMethod === 'fingerprint' ? (
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <FaFingerprint className="text-6xl text-white/70 mb-4 mx-auto" />
                    </motion.div>
                    <p className="font-bold text-white/90">Use fingerprint or passcode</p>
                  </div>
                ) : isAuthenticating && authMethod === 'passcode' ? (
                  <div className="text-center">
                    <FaKeyboard className="text-5xl text-white/70 mb-4 mx-auto" />
                    <p className="font-bold text-white/90 mb-2">Enter your passcode</p>
                    <input
                      type="password"
                      maxLength="4"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value.replace(/[^0-9]/g, ''));
                        setPasscodeError('');
                      }}
                      className="w-40 bg-gray-900 text-white text-center text-2xl tracking-[1em] rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {passcodeError && <p className="text-red-500 text-xs mt-2">{passcodeError}</p>}
                    <motion.button whileTap={tapAnimation} onClick={handlePasscodeSubmit} className="w-full bg-blue-600 text-white font-bold py-2 mt-4 rounded-lg">
                      Confirm
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-white/90">Card is Locked</h4>
                    <p className="text-sm text-white/60 mb-4">Choose a method to unlock your card.</p>
                    <div className="flex gap-4">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={tapAnimation} onClick={() => handleUnlock('fingerprint')} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg">
                        <FaFingerprint />
                        Use Fingerprint
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={tapAnimation} onClick={() => handleUnlock('passcode')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg">
                        <FaKeyboard />
                        Use Passcode
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`transition-filter duration-300 ${isLocked ? 'blur-md' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-400" />
                  <span className="text-gray-400">Balance</span>
                </div>
                <div className="text-2xl font-bold">{formatAmount(wallets.meal)}</div>
              </div>
              <div>
                <span className="text-gray-400">Remaining plates</span>
                <div className="text-2xl font-bold">{activeSubscription ? (wallets.meal / (activeSubscription.plan.price / activeSubscription.plan.meals)).toFixed(0) : 'N/A'}</div>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 mb-6">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="w-full h-8 border-2 border-gray-600 rounded"></div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold">Adjust Plate(s) No.</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePlateChange(-1)} className="bg-gray-700 w-8 h-8 rounded font-bold">-</button>
                <span className="bg-gray-900 w-12 h-8 rounded flex items-center justify-center font-bold">{plateCount}</span>
                <button onClick={() => handlePlateChange(1)} className="bg-gray-700 w-8 h-8 rounded font-bold">+</button>
              </div>
              <motion.button
                whileTap={tapAnimation}
                onClick={handleOrderOrSubscribe}
                disabled={isLocked && activeSubscription}
                className={`
                  text-white rounded-lg px-6 py-3 font-bold transition-all
                  ${activeSubscription ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
                  ${isLocked && activeSubscription ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                Order
              </motion.button>
              <div className="w-8 h-8 bg-yellow-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showSwapModal && (
      <SwapWalletsModal 
        wallets={wallets}
        onClose={() => setShowSwapModal(false)}
        onConfirmSwap={handleConfirmSwap}
      />
    )}
    </>
  );
};

export default DigitalMealCard;