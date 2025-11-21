import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaChevronRight, FaHeart, FaMapMarkerAlt, FaWallet } from 'react-icons/fa';
import { tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

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

export default EnhancedFilterBar;
