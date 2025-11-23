import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaStar, FaMapMarkerAlt, FaInfoCircle, FaPhone, FaEnvelope, FaClock, FaUtensils, FaShoppingCart } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const RestaurantDetailsModal = ({ restaurant, onOrder, onClose }) => {
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
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl m-4"
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

        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 mt-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(restaurant.priceInfo || {}).map(([period, amount]) => (
              <motion.button
                key={period}
                whileTap={tapAnimation}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  onOrder(restaurant, period);
                  if (onClose) onClose();
                }}
                className="p-4 rounded-xl bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 text-left transition-all hover:shadow-lg hover:border-blue-500"
              >
                <div className="font-bold text-gray-800 dark:text-white text-lg">RWF {formatAmount(amount)}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">for {period}</div>
                <div className="mt-3 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-2">
                  Subscribe Now <FaShoppingCart/>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RestaurantDetailsModal;
