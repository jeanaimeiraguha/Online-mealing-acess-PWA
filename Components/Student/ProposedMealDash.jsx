import React, { useEffect, useState, useMemo } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaLock, FaMapMarkerAlt,
  FaStar, FaShoppingCart,
  FaCreditCard, FaQrcode, FaHistory, FaUserCircle, FaTimes, FaChevronRight,
  FaInfoCircle, FaPlus, FaMinus, FaSignOutAlt, FaHeadset, FaCalendar,
  FaCheck, FaCheckSquare, FaShare, FaPhone, FaEnvelope,
  FaLeaf, FaClock, FaSpinner, FaAndroid, FaUnlock, FaExclamationTriangle,
  FaBolt, FaCopy, FaExchangeAlt, FaCheckCircle
} from "react-icons/fa";
import { FiSearch, FiBell, FiUser, FiLock, FiUnlock, FiMoreHorizontal } from "react-icons/fi";
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
  if (provider === 'mtn') return cleanPhone.startsWith('078') || cleanPhone.startsWith('079');
  if (provider === 'airtel') return cleanPhone.startsWith('073') || cleanPhone.startsWith('072');
  return false;
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==================== COMPONENTS ====================

const CardLockOverlay = ({ onUnlock }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center z-20"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-2xl"
    >
      <FaLock className="text-2xl text-white" />
    </motion.div>
    <h3 className="text-white font-bold text-lg mb-2">Card Locked</h3>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onUnlock}
      className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
    >
      <FaUnlock /> Unlock
    </motion.button>
  </motion.div>
);

const DigitalMealCard = ({ selectedCard, wallets, isLocked, onBuyCard, onTopUp, onExchange, onUnlock }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const totalBalance = wallets.meal + wallets.flexie;

  if (selectedCard === "No Card") {
    return (
      <div className="bg-[#08111d] border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center h-48 text-center">
        <FaLock className="text-4xl text-gray-600 mb-3" />
        <h3 className="text-lg font-bold text-gray-300 mb-1">No Active Card</h3>
        <button onClick={onBuyCard} className="text-sm text-blue-400 hover:text-blue-300 font-bold">Get a Card</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="relative preserve-3d cursor-pointer h-48 w-full"
        animate={isFlipped ? "flipped" : "initial"}
        variants={cardFlip}
        onClick={() => !isLocked && setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {isLocked && <CardLockOverlay onUnlock={onUnlock} />}

        {/* Front */}
        <motion.div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900 border border-gray-700 shadow-xl" style={{ backfaceVisibility: "hidden" }}>
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-blue-300 font-bold tracking-wider">IGIFU STUDENT</div>
                  <div className="text-lg font-bold text-white mt-1">Meal Card</div>
                </div>
                <img src="/favicon.ico" alt="chip" className="w-8 h-8 opacity-80 bg-yellow-500/20 rounded-md" /> 
             </div>
             
             <div className="font-mono text-xl text-white tracking-widest shadow-black drop-shadow-md">
               •••• •••• •••• 4592
             </div>

             <div className="flex justify-between items-end">
               <div>
                 <div className="text-[10px] text-gray-400 uppercase">Balance</div>
                 <div className="text-white font-bold">RWF {formatAmount(totalBalance)}</div>
               </div>
               <div className="text-xs text-gray-400">VALID THRU 12/25</div>
             </div>
          </div>
          {/* Decorative bg elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-xl flex flex-col items-center justify-center p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <FaQrcode className="text-white text-5xl mb-3" />
          <div className="flex gap-2 w-full">
             <button onClick={(e) => {e.stopPropagation(); onTopUp();}} className="flex-1 py-2 bg-green-600 rounded-lg text-xs font-bold text-white">Top Up</button>
             <button onClick={(e) => {e.stopPropagation(); onExchange();}} className="flex-1 py-2 bg-purple-600 rounded-lg text-xs font-bold text-white">Exchange</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ==================== MAIN PAGE SECTIONS ====================

const MyIgifuPage = ({ wallets, isLocked, purchasedPlans, selectedCard, onTopUp, onExchange, onBuyCard, onUnlock, onLock, onPlaceOrder }) => {
  const [activeTab, setActiveTab] = useState("Meal Wallet");
  const [platesToOrder, setPlatesToOrder] = useState(1);

  const totalMeals = purchasedPlans.reduce((acc, p) => acc + p.totalMeals, 0);
  const usedMeals = purchasedPlans.reduce((acc, p) => acc + p.usedMeals.length, 0);
  const remainingMeals = totalMeals - usedMeals;
  
  // Get active plan for grid display (simplification: showing first active plan or a generic grid)
  const activePlan = purchasedPlans.find(p => p.usedMeals.length < p.totalMeals);

  const adjustPlates = (delta) => {
    setPlatesToOrder(prev => Math.max(1, prev + delta));
  };

  const handleOrderClick = () => {
    if (activePlan && !isLocked) {
       onPlaceOrder(activePlan.id, platesToOrder);
    } else if (isLocked) {
       onUnlock();
    }
  };

  return (
    <motion.div {...pageMotion} className="min-h-screen bg-[#0f1724] text-gray-100 font-sans pb-24">
      {/* Header */}
      <header className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <div className="text-sm text-gray-300 font-medium">Good Evening 🌙</div>
              <div className="text-xl font-bold text-white">Welcome, Student</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:block bg-yellow-500/90 text-black px-3 py-1 rounded-lg text-xs font-bold shadow-lg shadow-yellow-500/20">
               New Features!
             </div>
             <div className="flex gap-2">
               <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><FiSearch className="text-lg" /></button>
               <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
                 <FiBell className="text-lg" />
                 <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0f1724]"></span>
               </button>
             </div>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-[#0b1220] rounded-xl p-2 shadow-lg border border-gray-800/50 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-max">
            <div className="flex gap-2">
              {[
                { label: "Buy Igifu", action: onBuyCard, color: "bg-blue-600 hover:bg-blue-500" },
                { label: "Top Up", action: onTopUp, color: "bg-[#1e293b] hover:bg-[#334155]" },
                { label: "Swap Wallets", action: onExchange, color: "bg-[#1e293b] hover:bg-[#334155]" },
                { label: "History", action: () => {}, color: "bg-[#1e293b] hover:bg-[#334155]" },
              ].map((btn, idx) => (
                <button key={idx} onClick={btn.action} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btn.color}`}>
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="border-l border-gray-700 pl-4">
              <select 
                value={selectedCard} 
                className="bg-[#0f1724] text-gray-300 text-sm border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                disabled
              >
                <option>{selectedCard}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Wallet & Meals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b1220] rounded-2xl p-1 shadow-xl border border-gray-800 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                {["Meal Wallet", "Flexie Wallet", "History", "Rewards"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                      activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">{activeTab === "Flexie Wallet" ? "Flexie Balance" : "Meal Balance"}</div>
                    <div className="text-4xl font-bold text-white tracking-tight">
                      <span className="text-lg text-gray-500 font-normal mr-1">RWF</span>
                      {activeTab === "Flexie Wallet" ? formatAmount(wallets.flexie) : formatAmount(wallets.meal)}
                    </div>
                  </div>
                  {activeTab === "Meal Wallet" && (
                    <div className="text-right bg-[#0f1724] px-4 py-2 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">Remaining Plates</div>
                      <div className="text-2xl font-bold text-green-400">{remainingMeals}</div>
                    </div>
                  )}
                </div>

                {activeTab === "Meal Wallet" && (
                  <>
                    {/* Plate Grid Visualization */}
                    <div className="mb-2 flex justify-between items-end">
                       <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Meal Slots</span>
                       <span className="text-xs text-blue-400">{activePlan ? activePlan.restaurantName : "No Active Plan"}</span>
                    </div>
                    <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 mb-8 bg-[#0f1724] p-4 rounded-xl border border-gray-800/50">
                      {activePlan ? (
                        Array.from({ length: activePlan.totalMeals }).map((_, i) => {
                          const isUsed = activePlan.usedMeals.includes(i);
                          return (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.1 }}
                              className={`aspect-square rounded-md border ${
                                isUsed 
                                  ? "bg-gray-800 border-gray-700 opacity-30" 
                                  : "bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                              }`}
                            />
                          );
                        })
                      ) : (
                        Array.from({ length: 30 }).map((_, i) => (
                           <div key={i} className="aspect-square rounded-md border border-gray-800 bg-gray-900/50 opacity-50" />
                        ))
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1724] p-4 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <span className="text-sm text-gray-400 whitespace-nowrap">Order Quantity</span>
                        <div className="flex items-center bg-[#0b1220] rounded-lg border border-gray-700">
                          <button onClick={() => adjustPlates(-1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-lg transition-colors"><FaMinus size={12}/></button>
                          <div className="w-12 text-center font-bold text-white">{platesToOrder}</div>
                          <button onClick={() => adjustPlates(1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-lg transition-colors"><FaPlus size={12}/></button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={isLocked ? onUnlock : onLock}
                          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            isLocked ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/50 hover:bg-green-500/20"
                          }`}
                        >
                          {isLocked ? <><FiLock /> Locked</> : <><FiUnlock /> Unlocked</>}
                        </button>

                        <button
                          onClick={handleOrderClick}
                          disabled={!activePlan}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Use Meal
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === "Flexie Wallet" && (
                   <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <FaWallet className="text-5xl mx-auto mb-3 opacity-30" />
                        <p>Flexie Wallet transactions and history will appear here.</p>
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Card Preview & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#0b1220] rounded-2xl p-5 shadow-xl border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Card Preview</h3>
              <DigitalMealCard 
                selectedCard={selectedCard}
                wallets={wallets}
                isLocked={isLocked}
                onBuyCard={onBuyCard}
                onTopUp={onTopUp}
                onExchange={onExchange}
                onUnlock={onUnlock}
              />
              
              <div className="mt-6 space-y-3">
                 <div className="flex items-center justify-between text-sm p-3 bg-[#0f1724] rounded-lg border border-gray-800">
                    <span className="text-gray-400">Status</span>
                    <span className={`flex items-center gap-1.5 font-bold ${isLocked ? "text-red-500" : "text-green-500"}`}>
                       <span className={`w-2 h-2 rounded-full ${isLocked ? "bg-red-500" : "bg-green-500"} animate-pulse`} />
                       {isLocked ? "Locked" : "Active"}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-sm p-3 bg-[#0f1724] rounded-lg border border-gray-800">
                    <span className="text-gray-400">Plan Expiry</span>
                    <span className="text-white font-medium">{activePlan ? new Date(activePlan.expiryDate).toLocaleDateString() : "N/A"}</span>
                 </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl p-5 shadow-xl border border-gray-800">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={onTopUp} className="p-3 bg-[#0f1724] hover:bg-[#1e293b] rounded-lg border border-gray-800 flex flex-col items-center gap-2 transition-colors">
                     <FaCreditCard className="text-blue-500 text-xl" />
                     <span className="text-xs font-medium text-gray-300">Top Up</span>
                  </button>
                  <button className="p-3 bg-[#0f1724] hover:bg-[#1e293b] rounded-lg border border-gray-800 flex flex-col items-center gap-2 transition-colors">
                     <FaShare className="text-purple-500 text-xl" />
                     <span className="text-xs font-medium text-gray-300">Share</span>
                  </button>
                  <button className="p-3 bg-[#0f1724] hover:bg-[#1e293b] rounded-lg border border-gray-800 flex flex-col items-center gap-2 transition-colors">
                     <FaHistory className="text-orange-500 text-xl" />
                     <span className="text-xs font-medium text-gray-300">History</span>
                  </button>
                  <button className="p-3 bg-[#0f1724] hover:bg-[#1e293b] rounded-lg border border-gray-800 flex flex-col items-center gap-2 transition-colors">
                     <FaHeadset className="text-green-500 text-xl" />
                     <span className="text-xs font-medium text-gray-300">Support</span>
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// ==================== MODALS & COMPONENTS ====================

const OrderSuccessModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-sm bg-[#0b1220] border-2 border-green-500/50 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5" />
        
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} 
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-green-500/30"
        >
          <FaCheckCircle className="text-5xl text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Order Successful!</h2>
        <p className="text-gray-400 mb-8 relative z-10">Your meal request has been processed.</p>
        
        <div className="bg-[#0f1724] rounded-2xl p-6 border border-gray-800 mb-8 relative z-10">
           <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Order ID</div>
              <div className="text-4xl font-mono font-bold text-blue-500 tracking-widest">{order.id}</div>
           </div>
           <div className="w-full h-px bg-gray-800 my-4" />
           <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Plates Ordered</div>
              <div className="text-5xl font-bold text-white">{order.plates}</div>
           </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl font-bold text-lg text-white relative z-10 hover:shadow-lg hover:shadow-green-500/20 transition-all">
           Done
        </button>
      </motion.div>
    </motion.div>
  );
};

const WalletExchangeModal = ({ wallets, onExchange, onClose }) => {
  const [fromWallet, setFromWallet] = useState("flexie");
  const [amount, setAmount] = useState("");
  const toWallet = fromWallet === "flexie" ? "meal" : "flexie";

  const handleExchange = () => {
    const val = parseInt(amount);
    if (!val || val <= 0) return alert("Please enter a valid amount");
    if (val > wallets[fromWallet]) return alert("Insufficient balance");
    onExchange(fromWallet, toWallet, val);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-[#0b1220] border border-gray-800 rounded-2xl p-6 text-white shadow-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaExchangeAlt className="text-blue-500" /> Swap Wallets</h3>
        
        <div className="flex items-center justify-between bg-[#0f1724] p-3 rounded-xl border border-gray-800 mb-4">
           <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${fromWallet === 'flexie' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                 {fromWallet === 'flexie' ? <FaWallet /> : <FaUtensils />}
              </div>
              <div>
                 <div className="text-xs text-gray-400">From</div>
                 <div className="font-bold capitalize">{fromWallet}</div>
              </div>
           </div>
           <button onClick={() => setFromWallet(toWallet)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"><FaExchangeAlt /></button>
           <div className="flex items-center gap-2 text-right justify-end">
              <div>
                 <div className="text-xs text-gray-400">To</div>
                 <div className="font-bold capitalize">{toWallet}</div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toWallet === 'flexie' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                 {toWallet === 'flexie' ? <FaWallet /> : <FaUtensils />}
              </div>
           </div>
        </div>

        <div className="mb-6">
           <label className="text-xs text-gray-400 mb-1 block">Amount to Swap (Max: {wallets[fromWallet]})</label>
           <input 
             type="number" 
             value={amount} 
             onChange={e => setAmount(e.target.value)} 
             className="w-full bg-[#0f1724] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-lg font-bold"
             placeholder="0"
           />
        </div>

        <div className="flex gap-3">
           <button onClick={onClose} className="flex-1 py-3 bg-gray-800 rounded-xl font-bold text-gray-300 hover:bg-gray-700">Cancel</button>
           <button onClick={handleExchange} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500">Confirm Swap</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TopUpModal = ({ onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("mtn");
  const [step, setStep] = useState(1); // 1: Input, 2: Processing

  const handleTopUp = async () => {
    if (!amount || !phone) return alert("Please fill all fields");
    setStep(2);
    await new Promise(r => setTimeout(r, 2000)); // Simulate delay
    onConfirm(parseInt(amount));
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-[#0b1220] border border-gray-800 rounded-2xl p-6 text-white shadow-2xl">
        {step === 1 ? (
          <>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaCreditCard className="text-green-500" /> Top Up Wallet</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
               <button onClick={() => setProvider("mtn")} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-colors ${provider === 'mtn' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-800 bg-[#0f1724]'}`}>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">MTN</div>
                  <span className="text-xs font-bold">Mobile Money</span>
               </button>
               <button onClick={() => setProvider("airtel")} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-colors ${provider === 'airtel' ? 'border-red-500 bg-red-500/10' : 'border-gray-800 bg-[#0f1724]'}`}>
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">Airtel</div>
                  <span className="text-xs font-bold">Airtel Money</span>
               </button>
            </div>

            <div className="space-y-4 mb-6">
               <div>
                  <label className="text-xs text-gray-400 mb-1 block">Amount (RWF)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#0f1724] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold" placeholder="5000" />
               </div>
               <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0f1724] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold" placeholder="078..." />
               </div>
            </div>

            <div className="flex gap-3">
               <button onClick={onClose} className="flex-1 py-3 bg-gray-800 rounded-xl font-bold text-gray-300 hover:bg-gray-700">Cancel</button>
               <button onClick={handleTopUp} className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500">Pay Now</button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
             <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
             <p className="text-gray-400 text-sm">Please check your phone to approve.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const OrderModal = ({ restaurant, onClose, onConfirm }) => {
  const [planType, setPlanType] = useState("Month");
  const [qty, setQty] = useState(1);
  const price = restaurant.priceInfo[planType];
  const total = price * qty;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-[#0b1220] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl text-white">
        <div className="h-32 relative">
           <img src={restaurant.image} className="w-full h-full object-cover opacity-40" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] to-transparent" />
           <div className="absolute bottom-4 left-6">
              <h3 className="text-2xl font-bold">{restaurant.name}</h3>
              <p className="text-gray-300 text-sm">Select Subscription Plan</p>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 rounded-full p-2"><FaTimes /></button>
        </div>

        <div className="p-6">
           <div className="flex gap-3 mb-6">
              {Object.keys(restaurant.priceInfo).map(type => (
                 <button 
                   key={type}
                   onClick={() => setPlanType(type)}
                   className={`flex-1 p-3 rounded-xl border-2 transition-all ${planType === type ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-[#0f1724]'}`}
                 >
                    <div className="text-sm font-bold mb-1">{type}</div>
                    <div className="text-blue-400 font-bold">RWF {formatAmount(restaurant.priceInfo[type])}</div>
                 </button>
              ))}
           </div>

           <div className="flex items-center justify-between bg-[#0f1724] p-4 rounded-xl border border-gray-800 mb-6">
              <span className="font-bold">Quantity</span>
              <div className="flex items-center gap-4">
                 <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700"><FaMinus size={10} /></button>
                 <span className="font-bold w-4 text-center">{qty}</span>
                 <button onClick={() => setQty(qty + 1)} className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500"><FaPlus size={10} /></button>
              </div>
           </div>

           <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-2xl font-bold text-white">RWF {formatAmount(total)}</span>
           </div>

           <button 
             onClick={() => onConfirm(restaurant, planType, qty, total)} 
             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
           >
              Confirm Purchase <FaCheckCircle />
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RestaurantDetailsModal = ({ restaurant, onClose, onSubscribe }) => {
  if (!restaurant) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-[#0b1220] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto text-white">
        <div className="relative h-64">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] to-transparent" />
          <motion.button whileTap={tapAnimation} onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-all">
            <FaTimes className="text-xl text-white" />
          </motion.button>
          <div className="absolute bottom-6 left-8 right-8">
            <h2 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-bold text-sm">{restaurant.rating || 4.5}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-white text-sm">{restaurant.campus}</span>
              </div>
               <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <FaClock className="text-green-400" />
                <span className="text-white text-sm">{restaurant.walkTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8">
           <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                 <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-400">About</h3>
                    <p className="text-gray-300 leading-relaxed">{restaurant.description}. Serving students since 2015 with high quality, affordable meals. We prioritize hygiene and taste.</p>
                 </div>
                 
                 <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-400">Menu Highlights</h3>
                    <div className="grid grid-cols-2 gap-3">
                       {["Rice & Beans", "Chips & Chicken", "Vegetable Stir Fry", "Beef Stew"].map(item => (
                          <div key={item} className="flex items-center gap-2 bg-[#0f1724] p-3 rounded-lg border border-gray-800">
                             <FaUtensils className="text-gray-500 text-xs" />
                             <span className="text-sm font-medium">{item}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#0f1724] p-6 rounded-2xl border border-gray-800 h-fit">
                 <h3 className="font-bold mb-4 text-center">Subscriptions</h3>
                 <div className="space-y-3 mb-6">
                    {Object.entries(restaurant.priceInfo).map(([plan, price]) => (
                       <div key={plan} className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">{plan}</span>
                          <span className="font-bold text-white">RWF {formatAmount(price)}</span>
                       </div>
                    ))}
                 </div>
                 <button 
                   onClick={onSubscribe}
                   className="w-full py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                 >
                   Subscribe Now
                 </button>
              </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Re-implementing RestozPage simply to ensure navigation works
const RestozPage = ({ showToast, onOrder, onViewDetails }) => {
  const [restaurants] = useState([
    {
      id: 1,
      name: "Campus Bites",
      campus: "Huye Campus",
      description: "Fresh, healthy meals prepared daily with local ingredients",
      priceInfo: { "Month": 30000, "Half-month": 16000 },
      walkTime: "3 mins",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      rating: 4.8,
    },
    {
        id: 2,
        name: "Inka Kitchen",
        campus: "Remera Campus",
        description: "Authentic Rwandan cuisine with a modern twist",
        priceInfo: { "Month": 50000, "Half-month": 28000 },
        walkTime: "10 mins",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        rating: 4.5,
      }
  ]);

  return (
    <motion.section {...pageMotion} className="pb-28 min-h-screen bg-gray-50 dark:bg-[#0b1220]">
       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">Find Your Perfect Meal Plan</h1>
          <p className="text-blue-100">Choose from verified campus restaurants</p>
       </div>
       <div className="p-4 max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map(r => (
              <motion.div onClick={() => onViewDetails(r)} key={r.id} whileHover={{y:-5}} className="bg-white dark:bg-[#0f1724] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 cursor-pointer group">
                  <div className="h-48 relative overflow-hidden">
                      <img src={r.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={r.name} />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-white border border-white/10">
                          <FaStar className="text-yellow-400" /> {r.rating}
                      </div>
                  </div>
                  <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{r.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                         <span className="flex items-center gap-1"><FaMapMarkerAlt /> {r.campus}</span>
                         <span className="flex items-center gap-1"><FaClock /> {r.walkTime}</span>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <div>
                             <span className="text-xs text-gray-400 block">Starting from</span>
                             <span className="text-blue-600 font-bold text-lg">RWF {formatAmount(r.priceInfo.Month)}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onOrder(r); }} 
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                          >
                            Subscribe
                          </button>
                      </div>
                  </div>
              </motion.div>
          ))}
       </div>
    </motion.section>
  );
};

// Placeholder pages for navigation
const EarnPage = () => <div className="p-8 text-center text-gray-500 dark:text-gray-400 pt-20">Rewards Coming Soon</div>;
const LoansPage = () => <div className="p-8 text-center text-gray-500 dark:text-gray-400 pt-20">Loans Coming Soon</div>;
const MorePage = () => <div className="p-8 text-center text-gray-500 dark:text-gray-400 pt-20">Settings & More Coming Soon</div>;


// ==================== MAIN APP COMPONENT ====================
export default function IgifuDashboardMainApp() {
  const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "Meal Card");
  const [isCardLocked, setIsCardLocked] = useState(() => localStorage.getItem("cardLocked") === "true");
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(true); // Default to dark for the new theme
  
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem("wallets");
    return saved ? JSON.parse(saved) : { meal: 60000, flexie: 2000 };
  });

  const [purchasedPlans, setPurchasedPlans] = useState(() => {
    const saved = localStorage.getItem("purchasedPlans");
    // Dummy data if empty for visualization
    if(!saved || JSON.parse(saved).length === 0) {
        return [{
            id: 1,
            restaurantName: "Campus Bites",
            planType: "Month",
            totalMeals: 30,
            usedMeals: [0, 1, 2, 3, 4],
            purchaseDate: Date.now(),
            expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            price: 30000
        }];
    }
    return JSON.parse(saved);
  });

  // Modals state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRestaurantDetails, setShowRestaurantDetails] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Persist
  useEffect(() => {
    localStorage.setItem("selectedCard", selectedCard);
    localStorage.setItem("cardLocked", isCardLocked.toString());
    localStorage.setItem("wallets", JSON.stringify(wallets));
    localStorage.setItem("purchasedPlans", JSON.stringify(purchasedPlans));
  }, [selectedCard, isCardLocked, wallets, purchasedPlans]);

  // Handlers
  const handleTopUpConfirm = (amount) => {
      setWallets(prev => ({...prev, meal: prev.meal + amount}));
      alert(`Successfully topped up RWF ${formatAmount(amount)}!`);
  };

  const handleExchangeConfirm = (from, to, amount) => {
      setWallets(prev => ({
         ...prev,
         [from]: prev[from] - amount,
         [to]: prev[to] + amount
      }));
      alert(`Successfully swapped RWF ${formatAmount(amount)} from ${from} to ${to}!`);
  };

  const handleBuyCard = () => {
      setSelectedCard("Meal Card");
      alert("Card Purchased!");
  };

  const handleOrderInit = (restaurant) => {
      setSelectedRestaurant(restaurant);
      setShowOrderModal(true);
  };

  const handleViewDetails = (restaurant) => {
      setSelectedRestaurant(restaurant);
      setShowRestaurantDetails(true);
  };

  const handleOrderConfirm = async (restaurant, planType, qty, total) => {
      if(wallets.meal < total) return alert("Insufficient funds in Meal Wallet. Please top up.");
      
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 1500)); // Sim processing
      
      const newPlans = Array.from({length: qty}).map((_, i) => ({
          id: Date.now() + i,
          restaurantName: restaurant.name,
          planType: planType,
          totalMeals: planType === "Month" ? 30 : 15,
          usedMeals: [],
          expiryDate: Date.now() + (planType === "Month" ? 30 : 15) * 24 * 60 * 60 * 1000,
          price: restaurant.priceInfo[planType]
      }));
      
      setPurchasedPlans(prev => [...prev, ...newPlans]);
      setWallets(prev => ({...prev, meal: prev.meal - total}));
      
      setIsProcessing(false);
      setShowOrderModal(false);
      setShowRestaurantDetails(false);
      setActivePage("MyIgifu");
      alert(`Successfully purchased ${qty} ${planType} plan(s)!`);
  };

  const handleUseMeal = (planId, mealIndex) => {
      setPurchasedPlans(prev => prev.map(p => {
          if(p.id === planId && !p.usedMeals.includes(mealIndex)) {
              return {...p, usedMeals: [...p.usedMeals, mealIndex]};
          }
          return p;
      }));
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-[#0f1724]' : 'bg-gray-50'}`}>
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && (
            <MyIgifuPage 
                key="home"
                wallets={wallets}
                isLocked={isCardLocked}
                purchasedPlans={purchasedPlans}
                selectedCard={selectedCard}
                onTopUp={() => setShowTopUpModal(true)}
                onExchange={() => setShowExchangeModal(true)}
                onBuyCard={handleBuyCard}
                onUnlock={() => setIsCardLocked(false)}
                onLock={() => setIsCardLocked(true)}
                onUseMeal={handleUseMeal}
            />
          )}
          {activePage === "Restoz" && (
             <RestozPage 
                key="restoz" 
                onOrder={handleOrderInit} 
                onViewDetails={handleViewDetails}
             />
          )}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showExchangeModal && (
           <WalletExchangeModal 
              wallets={wallets} 
              onExchange={handleExchangeConfirm} 
              onClose={() => setShowExchangeModal(false)} 
           />
        )}
        {showTopUpModal && (
           <TopUpModal 
              onConfirm={handleTopUpConfirm} 
              onClose={() => setShowTopUpModal(false)} 
           />
        )}
        {showOrderModal && selectedRestaurant && (
           <OrderModal 
              restaurant={selectedRestaurant} 
              onConfirm={handleOrderConfirm} 
              onClose={() => setShowOrderModal(false)} 
           />
        )}
        {showRestaurantDetails && selectedRestaurant && (
           <RestaurantDetailsModal 
              restaurant={selectedRestaurant} 
              onSubscribe={() => {
                 setShowOrderModal(true);
                 // Keep details open or close? Let's keep it open until order confirmed? 
                 // Actually order modal is on top.
              }} 
              onClose={() => setShowRestaurantDetails(false)} 
           />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#0b1220]/95 backdrop-blur-xl border-t border-gray-800 py-2 z-40">
        <div className="mx-auto w-full max-w-md flex justify-around">
          {[
            { n: "Restoz", i: <FaUtensils />, label: "Restaurants" },
            { n: "Earn", i: <FaGift />, label: "Rewards" },
            { n: "MyIgifu", i: <FaWallet />, label: "Igifu" },
            { n: "Loans", i: <FaMoneyBill />, label: "Loans" },
            { n: "More", i: <FiMoreHorizontal />, label: "More" }
          ].map(t => {
            const isActive = activePage === t.n;
            return (
              <button 
                key={t.n} 
                onClick={() => setActivePage(t.n)} 
                className={`flex flex-col items-center p-2 transition-all ${isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-300"}`}
              >
                <div className={`text-xl mb-1 ${isActive ? "-translate-y-1" : ""} transition-transform`}>{t.i}</div>
                <span className="text-[10px] font-bold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
