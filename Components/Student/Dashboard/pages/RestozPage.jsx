import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaLeaf } from 'react-icons/fa';
import EnhancedFilterBar from '../components/EnhancedFilterBar';
import RestaurantCard from '../components/RestaurantCard';
import { pageMotion, tapAnimation } from '../utils/animations';
import { getMinutes } from '../utils/helpers';

const RestozPage = ({ showToast, onOrder }) => {
  const [activeTab, setActiveTab] = useState("Browse");
  const [filterState, setFilterState] = useState({
    campus: "All Campuses",
    plan: "Any",
    priceSort: "None",
    walkTime: "All Times",
    selfService: "Any",
    favorites: false,
    nearMe: false,
    budget: false,
    priceMin: 0,
    priceMax: 100000,
  });

  const restaurantsSeed = useMemo(() => ([
    {
      id: 1,
      name: "Campus Bites",
      campus: "Huye Campus",
      description: "Fresh, healthy meals prepared daily with local ingredients",
      fullDescription: "Campus Bites has served students for 10+ years. We specialize in nutritious, affordable meals for student budgets, blending traditional Rwandan dishes with international flavors.",
      priceInfo: { "Month": 30000, "Half-month": 16000 },
      walkTime: "3 mins",
      selfService: false,
      isFav: true,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      features: ["WiFi", "Study Area", "Takeaway"],
      specialties: [{ name: "Brochettes", icon: <FaLeaf className="text-green-600" /> }, { name: "Salads", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Chicken Brochette", description: "Grilled chicken skewers", price: 3500, icon: <FaLeaf className="text-white" /> },
        { name: "Veggie Bowl", description: "Fresh vegetables with rice", price: 2500, icon: <FaLeaf className="text-white" /> },
      ],
      phone: "+250 788 123 456",
      email: "info@campusbites.rw"
    },
    {
      id: 2,
      name: "Inka Kitchen",
      campus: "Remera Campus",
      description: "Authentic Rwandan cuisine with a modern twist",
      fullDescription: "Inka Kitchen brings the best of Rwandan culinary traditions with contemporary style. Fresh local ingredients, memorable dishes.",
      priceInfo: { "Month": 50000, "Half-month": 28000 },
      walkTime: "10 mins",
      selfService: true,
      isFav: false,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
      features: ["Outdoor Seating", "Vegan Options", "Delivery"],
      specialties: [{ name: "Isombe", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Isombe Special", description: "Cassava leaves with fish", price: 4500, icon: <FaLeaf className="text-white" /> },
        { name: "Tilapia Grill", description: "Lake fish with ugali", price: 5500, icon: <FaLeaf className="text-white" /> }
      ],
      phone: "+250 788 234 567",
      email: "order@inkakitchen.rw"
    },
    {
      id: 3,
      name: "UR - Nyarugenge Cafeteria",
      campus: "Nyarugenge Campus",
      description: "Affordable student meals and daily specials",
      fullDescription: "Serving classic campus favorites and hearty Rwandan staples. Daily specials and combo deals for students.",
      priceInfo: { "Month": 25000, "Half-month": 15000 },
      walkTime: "5 mins",
      selfService: true,
      isFav: false,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      features: ["Quick Service", "Budget Friendly", "Takeaway"],
      specialties: [{ name: "Beans & Rice", icon: <FaLeaf className="text-green-600" /> }],
      popularDishes: [
        { name: "Beans & Rice", description: "Classic combo", price: 1500, icon: <FaLeaf className="text-white" /> },
        { name: "Beef with Chips", description: "Popular combo", price: 3000, icon: <FaLeaf className="text-white" /> }
      ],
      phone: "+250 788 111 222",
      email: "cafeteria@ur.rw"
    },
  ]), []);

  const [restaurants, setRestaurants] = useState(restaurantsSeed);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

  useEffect(() => {
    let temp = [...restaurants];

    if (activeTab === "Favourites" || filterState.favorites) {
      temp = temp.filter(r => r.isFav);
    }
    if (filterState.budget) {
      temp = temp.filter(r => Math.min(...Object.values(r.priceInfo || {})) <= 25000);
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
    temp = temp.filter(r => {
      const minPlan = Math.min(...Object.values(r.priceInfo || { Month: 999999 }));
      return minPlan >= filterState.priceMin && minPlan <= filterState.priceMax;
    });

    if (filterState.priceSort && filterState.priceSort !== "None") {
      temp.sort((a, b) => {
        const getPrice = (r) => Math.min(...Object.values(r.priceInfo || { Month: 999999 }));
        const pa = getPrice(a);
        const pb = getPrice(b);
        return filterState.priceSort === "Low to High" ? pa - pb : pb - pa;
      });
    }

    setFilteredRestaurants(temp);
  }, [restaurants, activeTab, filterState]);

  const toggleFav = (id) => {
    setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r)));
    showToast("Favorite updated", "info");
  };

  return (
    <motion.section {...pageMotion} className="pb-28 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Meal Plan</h1>
          <p className="text-blue-100 mb-4 text-xs sm:text-sm md:text-base">Choose from verified campus restaurants</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Browse', 'Favourites', 'Nearby', 'Deals'].map(tab => (
              <motion.button key={tab} whileTap={tapAnimation} onClick={() => setActiveTab(tab)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <EnhancedFilterBar filterState={filterState} setFilterState={setFilterState} resultsCount={filteredRestaurants.length} />

      <div className="p-3 sm:p-4">
        <div className="mx-auto w-full max-w-6xl">
          {filteredRestaurants.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <FaSearch className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No restaurants found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} onToggleFav={toggleFav} onOrder={onOrder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default RestozPage;
