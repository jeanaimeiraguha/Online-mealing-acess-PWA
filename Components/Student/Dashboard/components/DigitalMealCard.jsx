import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaShoppingCart, FaExchangeAlt, FaHistory, FaQuestionCircle, FaShareAlt, FaTag } from 'react-icons/fa';
import { tapAnimation, hoverScale } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const ActionButton = ({ icon: Icon, label, isSoon }) => (
  <motion.button
    whileHover={hoverScale}
    whileTap={tapAnimation}
    className="bg-gray-700 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 relative"
  >
    <Icon />
    <span>{label}</span>
    {isSoon && <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-1">Soon</span>}
  </motion.button>
);

const DigitalMealCard = ({ selectedCard, wallets, isLocked, onBuyCard,  onExchange, onUnlock }) => {
  const [activeTab, setActiveTab] = useState('meal');
  const [plateCount, setPlateCount] = useState(1);

  const handlePlateChange = (amount) => {
    setPlateCount(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Your Igifu Card</h2>
      <div className="flex gap-4 mb-6">
        <ActionButton icon={FaShoppingCart} label="Buy Igifu" />
        <ActionButton icon={FaExchangeAlt} label="Swap Wallets" />
        <ActionButton icon={FaHistory} label="History" />
        <ActionButton icon={FaQuestionCircle} label="Support" />
        <ActionButton icon={FaShareAlt} label="Share Meals" isSoon />
        <ActionButton icon={FaTag} label="Sell Igifu" isSoon />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Available Igifu Cards</span>
        <select className="bg-gray-700 text-white rounded-lg px-4 py-2">
          <option>Campus Bites Card</option>
        </select>
      </div>

      <div className="bg-blue-900 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Campus Bites Card</h3>
          <div className="flex items-center gap-4">
            <button className="bg-red-600 text-white rounded-lg px-4 py-2 font-bold">Lock</button>
            <span className="text-gray-400">ID: 12J4</span>
          </div>
        </div>

        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('meal')}
            className={`flex-1 py-3 font-bold rounded-t-lg ${activeTab === 'meal' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
          >
            Meal Wallet
          </button>
          <button
            onClick={() => setActiveTab('flexie')}
            className={`flex-1 py-3 font-bold rounded-t-lg ${activeTab === 'flexie' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
          >
            Flexie Wallet
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-b-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-gray-400">Balance FRW</span>
              <div className="text-2xl font-bold">{formatAmount(wallets.meal)}</div>
            </div>
            <div>
              <span className="text-gray-400">Remaining plates</span>
              <div className="text-2xl font-bold">120</div>
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
            <button className="bg-blue-600 text-white rounded-lg px-6 py-3 font-bold">Order</button>
            <div className="w-8 h-8 bg-yellow-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMealCard;
