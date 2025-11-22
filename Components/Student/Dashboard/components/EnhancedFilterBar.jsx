import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaChevronRight, FaSearch, FaWallet, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { tapAnimation } from '../utils/animations';
import { formatAmount } from '../utils/helpers';

const EnhancedFilterBar = ({ filterState, setFilterState, resultsCount }) => {
  const [expandedFilters, setExpandedFilters] = useState(false);

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

  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split('-').map(Number);
    setFilterState(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const priceRanges = [
    { label: 'All', min: 0, max: 100000 },
    { label: '< 25000', min: 0, max: 25000 },
    { label: '25000-50000', min: 25000, max: 50000 },
    { label: '> 50000', min: 50000, max: 100000 },
  ];
  return (
    <div className="bg-white dark:bg-[#0b0b12] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
      <div className="px-3 sm:px-4 py-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={filterState.searchQuery}
              onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            />
          </div>

          {/* Campus and Price Sort */}
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select className="w-full pl-9 pr-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" value={filterState.campus} onChange={(e) => setFilterState(prev => ({ ...prev, campus: e.target.value }))}>
                <option value="All Campuses">All Campuses</option>
                <option value="Huye Campus">Huye</option>
                <option value="Remera Campus">Remera</option>
                <option value="Nyarugenge Campus">Nyarugenge</option>
                <option value="Tumba Campus">Tumba</option>
                <option value="Gishushu Campus">Gishushu</option>
                <option value="Kimironko Campus">Kimironko</option>
                <option value="Kacyiru Campus">Kacyiru</option>
              </select>
            </div>

            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select 
                className="w-full pl-9 pr-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm" 
                value={`${filterState.priceMin}-${filterState.priceMax}`} 
                onChange={handlePriceRangeChange}
              >
                {priceRanges.map(range => <option key={range.label} value={`${range.min}-${range.max}`}>{range.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-3 sm:p-4 space-y-4">
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FaWallet className="text-gray-400" />
                    Price Range
                  </label>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    RWF {formatAmount(priceMin)} - {formatAmount(priceMax)}
                  </span>
                </div>
                <input type="range" min="0" max="100000" step="500" value={priceMax} onChange={(e) => handleMaxChange(e.target.value)} className="w-full" />
                {/* Kept for reference if you want two sliders
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                  <FaWallet className="text-gray-400" /> 
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
                </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 sm:px-4 pb-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 text-sm" />
            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base">Filters</span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">{resultsCount} Results</span>
        </div>
        <motion.button whileTap={tapAnimation} onClick={() => setExpandedFilters(!expandedFilters)} className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
            {expandedFilters ? 'Less' : 'More'}
            <FaChevronRight className={`transition-transform text-xs ${expandedFilters ? 'rotate-90' : ''}`} />
        </motion.button>
      </div>
    </div>
  );
};

export default EnhancedFilterBar;
