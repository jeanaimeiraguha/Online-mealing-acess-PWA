import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaStar, FaWalking, FaMapMarkerAlt, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import { tapAnimation, hoverScale } from '../utils/animations';
import { formatAmount } from '../utils/helpers';
import RestaurantDetailsModal from '../modals/RestaurantDetailsModal';

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

export default RestaurantCard;
