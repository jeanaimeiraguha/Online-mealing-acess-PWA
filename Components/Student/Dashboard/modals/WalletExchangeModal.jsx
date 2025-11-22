import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaSpinner, FaArrowLeft, FaIdCard, FaQuestionCircle, FaShareAlt, FaStore, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const WalletExchangeModal = ({ wallets, onExchange, onClose, onBuyIgifu }) => {
  const [fromWallet, setFromWallet] = useState('meal');
  const [toWallet, setToWallet] = useState('flexie');
  const [view, setView] = useState('menu'); // 'menu' or 'swap'
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

  const menuItems = [
    { title: 'Buy Igifu', icon: <FaShoppingCart />, action: onBuyIgifu, soon: false },
    { title: 'Your Igifu Card', icon: <FaIdCard />, action: () => {}, soon: false },
    { title: 'Swap Wallets', icon: <FaExchangeAlt />, action: () => setView('swap'), soon: false },
    { title: 'Support', icon: <FaQuestionCircle />, action: () => {}, soon: false },
    { title: 'Share Meals', icon: <FaShareAlt />, action: () => {}, soon: true },
    { title: 'Sell Igifu', icon: <FaStore />, action: () => {}, soon: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
        {view === 'menu' && (
          <>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Wallet & Actions</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileTap={tapAnimation}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-3 text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 ${index < menuItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500 dark:text-gray-400 text-base">{item.icon}</div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.soon && <span className="text-xs font-bold text-purple-500 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">Soon</span>}
                    <FaChevronRight className="text-gray-400 dark:text-gray-500" />
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {view === 'swap' && (
          <>
            <div className="flex items-center mb-6">
              <motion.button whileTap={tapAnimation} onClick={() => setView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </motion.button>
              <h3 className="text-2xl font-bold text-center flex-grow text-gray-900 dark:text-white -ml-8">Swap Wallets</h3>
            </div>
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WalletExchangeModal;
