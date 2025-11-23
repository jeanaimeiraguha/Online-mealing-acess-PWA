import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaLeaf, 
  FaCreditCard, 
  FaMobileAlt, 
  FaCheckCircle,
  FaTimes,
  FaShoppingCart,
  FaClock,
  FaStar,
  FaWifi,
  FaUtensils,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserGraduate,
  FaTruck,
  FaShieldAlt,
  FaPercent,
  FaConciergeBell,
  FaHamburger,
  FaCoffee,
  FaIceCream,
  FaPizzaSlice,
  FaGlassMartini,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaTag,
  FaFireAlt,
  FaBolt,
  FaGift,
  FaPercent as FaPercentIcon
} from 'react-icons/fa';
import EnhancedFilterBar from '../components/EnhancedFilterBar';
import RestaurantCard from '../components/RestaurantCard';
import SubscriptionSuccessModal from '../components/SubscriptionSuccessModal';
import { pageMotion, tapAnimation } from '../utils/animations';
import { getMinutes } from '../utils/helpers';
const RestozPage = ({
  showToast,
  subscriptions = {},
  onNewSubscription = () => {},
  orderRequest,
  onOrderRequestProcessed = () => {},
  isCardLocked,
  onUnlock,
  onOrder
}) => {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    campus: "All Campuses",
    priceSort: "None",
    priceMin: 0,
    priceMax: 100000,
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [generatedOrderId, setGeneratedOrderId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUSSDModal, setShowUSSDModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false); // New state for the success modal
  const [showRestaurantInfo, setShowRestaurantInfo] = useState(false);

  // Form states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // The phone number state is already here from the previous change, which is great.
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const restaurantsSeed = useMemo(() => ([
    {
      id: 1,
      name: "Campus Bites",
      campus: "Huye Campus",
      description: "Fresh, healthy meals prepared daily with local ingredients",
      fullDescription: "Campus Bites has served students for 10+ years. We specialize in nutritious, affordable meals for student budgets, blending traditional Rwandan dishes with international flavors.",
      priceInfo: { "Basic Plan": 30000, "Exclusive Plan": 16000 },
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
      email: "info@campusbites.rw",
      workingHours: {
        monday: "7:00 AM - 9:00 PM",
        tuesday: "7:00 AM - 9:00 PM",
        wednesday: "7:00 AM - 9:00 PM",
        thursday: "7:00 AM - 9:00 PM",
        friday: "7:00 AM - 10:00 PM",
        saturday: "8:00 AM - 10:00 PM",
        sunday: "8:00 AM - 8:00 PM"
      },
      deliveryInfo: {
        available: true,
        fee: 1000,
        estimatedTime: "15-30 mins",
        areas: ["Huye Campus", "Nearby Hostels"]
      },
      specialOffers: [
        "10% student discount with ID",
        "Free delivery on orders above FRW 10,000",
        "Happy Hour: 2-4 PM (20% off)"
      ],
      plans: [
        { name: "Basic Plan", price: 30000, duration: "1 month", meals: 20, icon: <FaUtensils />, color: "blue" },
        { name: "Premium Plan", price: 50000, duration: "1 month", meals: 35, icon: <FaConciergeBell />, color: "purple" },
        { name: "Exclusive Plan", price: 80000, duration: "1 month", meals: 50, icon: <FaStar />, color: "gold" }
      ],
      menu: [
        { id: 1, name: "Chicken Brochette", price: 3500, category: "Main", icon: <FaHamburger />, available: true },
        { id: 2, name: "Veggie Bowl", price: 2500, category: "Main", icon: <FaLeaf />, available: true },
        { id: 3, name: "Fresh Juice", price: 1500, category: "Drink", icon: <FaGlassMartini />, available: true },
        { id: 4, name: "Fruit Salad", price: 2000, category: "Dessert", icon: <FaIceCream />, available: true },
        { id: 5, name: "Coffee", price: 1000, category: "Drink", icon: <FaCoffee />, available: true },
        { id: 6, name: "Pizza Slice", price: 3000, category: "Main", icon: <FaPizzaSlice />, available: true }
      ]
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
      email: "order@inkakitchen.rw",
      workingHours: {
        monday: "6:30 AM - 8:30 PM",
        tuesday: "6:30 AM - 8:30 PM",
        wednesday: "6:30 AM - 8:30 PM",
        thursday: "6:30 AM - 8:30 PM",
        friday: "6:30 AM - 9:30 PM",
        saturday: "7:00 AM - 9:30 PM",
        sunday: "7:00 AM - 7:30 PM"
      },
      deliveryInfo: {
        available: true,
        fee: 1500,
        estimatedTime: "20-35 mins",
        areas: ["Remera Campus", "Kicukiro", "Nyarugenge"]
      },
      specialOffers: [
        "15% off on weekends",
        "Buy 2 get 1 free on Wednesdays",
        "Loyalty points program"
      ],
      plans: [
        { name: "Monthly Plan", price: 45000, duration: "1 month", meals: 30, icon: <FaCalendarAlt />, color: "green" },
        { name: "Weekly Plan", price: 15000, duration: "1 week", meals: 7, icon: <FaBolt />, color: "orange" }
      ],
      menu: [
        { id: 5, name: "Isombe Special", price: 4500, category: "Main", icon: <FaUtensils />, available: true },
        { id: 6, name: "Tilapia Grill", price: 5500, category: "Main", icon: <FaUtensils />, available: true },
        { id: 7, name: "Rwandan Tea", price: 1000, category: "Drink", icon: <FaCoffee />, available: true },
        { id: 8, name: "Mukimo", price: 3000, category: "Main", icon: <FaHamburger />, available: true }
      ]
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
      email: "cafeteria@ur.rw",
      workingHours: {
        monday: "7:00 AM - 8:00 PM",
        tuesday: "7:00 AM - 8:00 PM",
        wednesday: "7:00 AM - 8:00 PM",
        thursday: "7:00 AM - 8:00 PM",
        friday: "7:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "Closed"
      },
      deliveryInfo: {
        available: false,
        fee: 0,
        estimatedTime: "N/A",
        areas: []
      },
      specialOffers: [
        "Student meal combos from FRW 2000",
        "Early bird discount: 7-8 AM",
        "Friday special: Free drink with meal"
      ],
      plans: [
        { name: "Monthly Plan", price: 25000, duration: "1 month", meals: 25, icon: <FaUserGraduate />, color: "indigo" },
        { name: "Half-month", price: 15000, duration: "2 weeks", meals: 12, icon: <FaTag />, color: "red" }
      ],
      menu: [
        { id: 8, name: "Beans & Rice", price: 1500, category: "Main", icon: <FaUtensils />, available: true },
        { id: 9, name: "Beef with Chips", price: 3000, category: "Main", icon: <FaHamburger />, available: true },
        { id: 10, name: "Mandazi", price: 500, category: "Snack", icon: <FaCoffee />, available: true },
        { id: 11, name: "Samosa", price: 800, category: "Snack", icon: <FaPizzaSlice />, available: true }
      ]
    },
  ]), []);

  const [restaurants, setRestaurants] = useState(restaurantsSeed);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

  // Check if user is subscribed to a specific restaurant
  const isSubscribedTo = (restaurantId) => {
    return subscriptions[restaurantId]?.status === 'active';
  };

  // Get subscription info for a restaurant
  const getSubscriptionInfo = (restaurantId) => {
    return subscriptions[restaurantId] || null;
  };

  // Mock API functions
  const mockAPI = {
    processPayment: async (method, amount) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, transactionId: 'TXN-' + Date.now() });
        }, 3000);
      });
    },
    createOrder: async (orderData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const random = Math.floor(100000 + Math.random() * 900000);
          resolve({ success: true, orderId: `RST-${orderData.restaurantId}-${date}-${random}` });
        }, 1000);
      });
    }
  };

  // Generate order ID
  const generateOrderId = (restaurantId) => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(100000 + Math.random() * 900000);
    return `RST-${restaurantId}-${date}-${random}`;
  };

  // Calculate expiry date (1 month from now)
  const calculateExpiryDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  // Tailwind CSS classes cannot be constructed dynamically. This mapping ensures the JIT compiler finds them.
  const planStyles = {
    blue: {
      hover: 'hover:from-blue-50 hover:to-blue-100 hover:border-blue-200',
      text: 'text-blue-600',
    },
    purple: {
      hover: 'hover:from-purple-50 hover:to-purple-100 hover:border-purple-200',
      text: 'text-purple-600',
    },
    gold: { // Using yellow as a substitute for gold
      hover: 'hover:from-yellow-50 hover:to-yellow-100 hover:border-yellow-200',
      text: 'text-yellow-600',
    },
    default: {
      hover: 'hover:from-gray-50 hover:to-gray-100 hover:border-gray-200',
      text: 'text-gray-600',
    }
  };

  // Handle subscription flow
  const handleSubscribe = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowConfirmModal(true);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmModal(false);
    setShowUSSDModal(true);
  };

  const validatePhone = (phone, method) => {
    const mtnRegex = /^(078|079)\d{7}$/;
    const airtelRegex = /^(072|073)\d{7}$/;
    const isValid = method === 'mtn' ? mtnRegex.test(phone) : airtelRegex.test(phone);
    if (!isValid) {
      const provider = method === 'mtn' ? 'MTN (078/079)' : 'Airtel (072/073)';
      setPhoneError(`Please enter a valid ${provider} number`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleProcessPayment = () => {
    // The method is already set by clicking the provider buttons.
    if (!validatePhone(phoneNumber, selectedPaymentMethod)) return;

    setPaymentStatus('pending');
    setLoading(true);
    mockAPI.processPayment(selectedPaymentMethod, selectedPlan.price).then(() => {
      setLoading(false);
      setPaymentStatus('success');
      
      // Update subscription for this specific restaurant
      const newSubscription = {
        status: 'active',
        plan: selectedPlan,
        expiryDate: calculateExpiryDate(),
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name
      };
      
      onNewSubscription(newSubscription);
      
      setTimeout(() => {
        setPaymentStatus(null); // Reset payment status
        setShowUSSDModal(false);
        setShowSubscriptionSuccess(true); // Show the new success modal
      }, 2000);
    });
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...item, quantity: 1}];
    });
    showToast(`${item.name} added to cart`, 'success');
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    const orderData = {
      restaurantId: selectedRestaurant.id,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    mockAPI.createOrder(orderData).then(response => {
      setLoading(false);
      setGeneratedOrderId(response.orderId);
      setOrderDetails(orderData);
      setShowOrderModal(false);
      setShowOrderSuccess(true);
      setCartItems([]);
    });
  };

  const handleOrderClick = (restaurant) => {
    if (isSubscribedTo(restaurant.id)) {
      setSelectedRestaurant(restaurant);
      setShowOrderModal(true);
    } else {
      showToast(`Please subscribe to ${restaurant.name} first to place orders`, 'info');
    }
  };

  const handleShowInfo = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantInfo(true);
  };

  useEffect(() => {
    let temp = [...restaurants];

    if (filterState.searchQuery) {
      temp = temp.filter(r => r.name.toLowerCase().includes(filterState.searchQuery.toLowerCase()));
    }
    if (filterState.campus && filterState.campus !== "All Campuses") {
      temp = temp.filter(r => r.campus === filterState.campus);
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
  }, [restaurants, filterState]);

  const toggleFav = (id) => {
    setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r)));
    showToast("Favorite updated", "info");
  };

  // Effect to handle external order requests
  useEffect(() => {
    if (orderRequest && orderRequest.restaurantId) {
      const restaurantToOrder = restaurants.find(r => r.id === orderRequest.restaurantId);
      if (restaurantToOrder) {
        handleOrderClick(restaurantToOrder);
      }
      // Notify parent that the request has been processed
      onOrderRequestProcessed();
    }
  }, [orderRequest, restaurants, onOrderRequestProcessed]);

  // Effect to prevent background scroll when a modal on this page is open
  useEffect(() => {
    const isModalOpen = showConfirmModal || showUSSDModal || showOrderModal || showOrderSuccess || showSubscriptionSuccess || showRestaurantInfo || paymentStatus === 'pending';

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset the style when the component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal, showUSSDModal, showOrderModal, showOrderSuccess, showSubscriptionSuccess, showRestaurantInfo, paymentStatus]);


  return (
    <motion.section {...pageMotion} className="pb-28 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            <FaUtensils />
            Find Your Perfect Meal Plan
          </h1>
          <p className="text-blue-100 mb-4 text-sm sm:text-base">Choose from verified campus restaurants</p>
          
          {/* Active subscriptions summary */}
          {Object.keys(subscriptions).length > 0 && (
            <div className="bg-green-500 bg-opacity-20 px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-2">
              <FaCheckCircle className="text-green-300" />
              <span className="text-sm font-medium">
                You have {Object.keys(subscriptions).length} active subscription{Object.keys(subscriptions).length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <EnhancedFilterBar filterState={filterState} setFilterState={setFilterState} resultsCount={filteredRestaurants.length} />

      <div id="restaurant-list-section" className="p-3 sm:p-4">
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
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  onToggleFav={toggleFav}
                  onOrder={handleOrderClick}
                  onSubscribe={handleSubscribe}
                  onShowInfo={handleShowInfo}
                  isSubscribed={isSubscribedTo(restaurant.id)}
                  isLocked={isCardLocked}
                  onUnlock={onUnlock}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Info Modal */}
      <AnimatePresence>
        {showRestaurantInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full m-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    <FaUtensils className="text-blue-600" />
                    {selectedRestaurant?.name}
                  </h2>
                  <p className="text-gray-600">{selectedRestaurant?.fullDescription}</p>
                  {/* Show subscription status in info modal */}
                  {isSubscribedTo(selectedRestaurant?.id) && (
                    <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
                    <p className="text-xs sm:text-sm text-green-800 font-medium flex items-center gap-2">
                        <FaCheckCircle />
                        You are subscribed with {getSubscriptionInfo(selectedRestaurant?.id)?.plan.name}
                      </p>
                    <p className="text-[10px] sm:text-xs text-green-600">
                        Expires: {getSubscriptionInfo(selectedRestaurant?.id)?.expiryDate}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowRestaurantInfo(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    Working Hours
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 mb-6">
                    {Object.entries(selectedRestaurant?.workingHours || {}).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{day}</span>
                        <span className={hours === "Closed" ? "text-red-600" : "text-gray-600"}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span>{selectedRestaurant?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{selectedRestaurant?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{selectedRestaurant?.campus}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaTruck className="text-blue-600" />
                    Delivery Information
                  </h3>
                  {selectedRestaurant?.deliveryInfo?.available ? (
                    <div className="bg-green-50 p-3 rounded-lg mb-6">
                      <p className="text-xs sm:text-sm text-green-800 mb-1 flex items-center gap-1">
                        <FaCheckCircle className="text-green-600" />
                        <strong>Available</strong> - FRW {selectedRestaurant.deliveryInfo.fee}
                      </p>
                      <p className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1">
                        <FaClock className="text-xs" />
                        Est. time: {selectedRestaurant.deliveryInfo.estimatedTime}
                      </p>
                      <p className="text-[10px] sm:text-xs text-green-600 mt-1">
                        Areas: {selectedRestaurant.deliveryInfo.areas.join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-3 rounded-lg mb-6">
                      <p className="text-sm text-red-800 flex items-center gap-1">
                        <FaTimes className="text-red-600" />
                        Delivery not available
                      </p>
                    </div>
                  )}

                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaGift className="text-blue-600" />
                    Special Offers
                  </h3>
                  <div className="space-y-2">
                    {selectedRestaurant?.specialOffers?.map((offer, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <FaTag className="text-green-500 mt-0.5" />
                        <span>{offer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaFireAlt className="text-blue-600" />
                  Popular Dishes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRestaurant?.popularDishes?.map((dish, index) => (
                    <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="font-medium text-sm sm:text-base">{dish.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{dish.description}</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">FRW {dish.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Subscription Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full m-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCreditCard className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Choose Your Plan</h3>
                <p className="text-gray-600">Select a subscription plan for {selectedRestaurant?.name}</p>
              </div>
              
              <div className="space-y-3">
                {selectedRestaurant?.plans.map((plan) => (
                  <motion.button
                    key={plan.name}
                    whileTap={tapAnimation}
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 text-left transition-all hover:shadow-md border-2 border-transparent ${(planStyles[plan.color] || planStyles.default).hover}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`text-xl ${(planStyles[plan.color] || planStyles.default).text}`}>
                          {plan.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">{plan.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400" />
                            {plan.duration}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <FaUtensils className="text-gray-400" />
                            {plan.meals} meals included
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-xl font-bold text-blue-600">
                          FRW {plan.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          FRW {(plan.price / plan.meals).toFixed(0)} per meal
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full mt-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USSD/Payment Modal */}
      <AnimatePresence>
        {showUSSDModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full m-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMobileAlt className="text-yellow-600 text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Complete Payment</h3>
                <p className="text-sm text-gray-600">Restaurant: {selectedRestaurant?.name}</p>
                <p className="text-gray-600">Plan: {selectedPlan?.name}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  FRW {selectedPlan?.price.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => setSelectedPaymentMethod('airtel')}
                  className={`w-full rounded-xl p-4 flex items-center justify-center gap-3 transition-all border-2 ${selectedPaymentMethod === 'airtel' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white text-xs">airtel</span>
                  </div>
                  <p className="font-semibold text-gray-800">Airtel Money</p>
                </button>
                
                <button
                  onClick={() => setSelectedPaymentMethod('mtn')}
                  className={`w-full rounded-xl p-4 flex items-center justify-center gap-3 transition-all border-2 ${selectedPaymentMethod === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="font-bold text-black text-sm">MTN</span>
                  </div>
                  <p className="font-semibold text-gray-800">MTN MoMo</p>
                </button>
              </div>

              {/* This section will now appear after a method is selected */}
              <div className="mb-4">
                <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="Enter phone number to pay"
                  className={`w-full px-4 py-3 rounded-xl border ${phoneError ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 disabled:bg-gray-100`}
                  disabled={!selectedPaymentMethod}
                />
                {phoneError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                    {phoneError}
                  </motion.p>
                )}
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={!selectedPaymentMethod || !phoneNumber || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Pay Now'}
              </button>

              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <p className="text-xs text-blue-700 text-center">
                  <strong>Important:</strong> If you don't receive a USSD prompt, dial: <strong>*182#</strong>
                </p>
              </div>
              
              <button
                onClick={() => setShowUSSDModal(false)}
                className="w-full mt-2 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-4xl w-full m-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <FaShoppingCart className="text-green-600" />
                    Order from {selectedRestaurant?.name}
                  </h3>
                  <p className="text-gray-600">Select items from menu</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FaUtensils />
                    Menu Items
                  </h4>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {selectedRestaurant?.menu.map(item => (
                      <div key={item.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-blue-600 text-lg">
                              {item.icon}
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <FaTag className="text-xs" />
                                {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600">FRW {item.price}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                              <FaShoppingCart className="text-xs" />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FaShoppingCart />
                    Your Cart ({cartItems.length} items)
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 sticky top-6">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400">Add items to get started</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-600">x{item.quantity}</p>
                              </div>
                              <span className="font-bold">FRW {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2 mb-4">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-blue-600">FRW {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={loading || cartItems.length === 0}
                          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Place Order</>}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Success Modal */}
      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full m-4"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Order Successful!</h3>
                <p className="text-gray-600 mb-4">Your order has been placed successfully</p>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono font-bold text-lg">{generatedOrderId}</p>
                </div>
                
                <div className="text-left space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-medium">{selectedRestaurant?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{orderDetails.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-blue-600">FRW {orderDetails.total?.toLocaleString() || 0}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowOrderSuccess(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Success Modal */}
      <AnimatePresence>
        {showSubscriptionSuccess && (
          <SubscriptionSuccessModal
            restaurantName={selectedRestaurant?.name}
            planName={selectedPlan?.name}
            onClose={() => setShowSubscriptionSuccess(false)}
          />
        )}
      </AnimatePresence>

      {/* Payment Status Overlay */}
      <AnimatePresence>
        {paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default RestozPage;