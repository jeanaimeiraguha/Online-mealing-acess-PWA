import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell, FaChartBar, FaClipboardCheck, FaUtensils, FaEdit, FaArrowLeft, FaUsers,
  FaSearch, FaFilter, FaDownload, FaSync, FaClock, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaPlus, FaMinus, FaTrash, FaCamera, FaCog, FaSignOutAlt,
  FaHome, FaBox, FaMoneyBillWave, FaSquare, FaCheckSquare, FaInfoCircle, FaShareAlt,
  FaTicketAlt, FaPhone
} from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";

// =================================================================================
// HELPER HOOK & UTILITIES
// =================================================================================

// NEW: Custom hook to keep state in sync with localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// ENHANCED: Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount).replace('RWF', '') + ' RWF';
};

// =================================================================================
// MODAL COMPONENTS
// =================================================================================

// ENHANCED: Payment Modal with USSD dial button
const PaymentModal = ({ state, onRetry, onClose, onComplete }) => {
  const USSD_CODE = "*182*1*1*078XXXXXXX#"; // Replace with your actual merchant code

  useEffect(() => {
    if (state.status === 'success') {
      const timer = setTimeout(() => onComplete(state.orderId), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.orderId, onComplete]);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
            <AnimatePresence mode="wait">
              {state.status === 'processing' && (
                <motion.div key="processing" exit={{ opacity: 0 }}>
                  <FaSync className="text-5xl text-blue-500 mx-auto animate-spin mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Processing Payment...</h3>
                  <p className="text-gray-500 mt-2">Please approve the payment on your phone.</p>
                </motion.div>
              )}
              {state.status === 'success' && (
                <motion.div key="success">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                    <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
                  <p className="text-gray-500 mt-2">Order completed. The customer will be notified.</p>
                </motion.div>
              )}
              {state.status === 'failed' && (
                <motion.div key="failed">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }}>
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-red-600">Payment Failed</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4 text-left">
                    <p className="text-sm text-red-800 font-medium">The payment was not approved or timed out.</p>
                    <p className="text-sm text-red-700 mt-2">If you haven't already, dial the code below to approve.</p>
                    <a href={`tel:${USSD_CODE.replace(/#/g, '%23')}`} className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 text-yellow-900 rounded-lg font-bold hover:bg-yellow-500 transition-all">
                      <FaPhone /> Dial {USSD_CODE}
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button onClick={onClose} className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">Close</button>
                    <button onClick={onRetry} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                      I have approved, Retry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// NEW: Modals for customer actions (Add Tickets, Share Meals)
const AddTicketModal = ({ customer, onSave, onCancel }) => {
  const [quantity, setQuantity] = useState(5);
  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-800">Buy More Tickets for {customer.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Current tickets: {customer.ticketQty}</p>
        <div className="my-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of new tickets to add:</label>
          <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
          <button onClick={() => onSave(customer.id, quantity)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Add Tickets</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ShareMealModal = ({ sender, customers, onShare, onCancel }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState(1);
  const availableToShare = sender.ticketQty - sender.redeemed;

  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-800">Share Meals from {sender.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Available to share: {availableToShare} meals</p>
        <div className="my-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Share with:</label>
            <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a customer...</option>
              {customers.filter(c => c.id !== sender.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of meals to share:</label>
            <input type="number" value={amount} onChange={e => setAmount(Math.min(parseInt(e.target.value, 10) || 0, availableToShare))} max={availableToShare} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
          <button onClick={() => onShare(sender.id, recipientId, amount)} disabled={!recipientId || amount <= 0 || amount > availableToShare} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300">Share Meals</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// NEW: Restaurant Details Modal
const RestaurantDetailsModal = ({ restaurant, onClose }) => {
  if (!restaurant) return null;
  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
            <p className="text-sm text-gray-500">{restaurant.tagline}</p>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Today's Specials</h3>
          <p className="text-gray-600 italic">"{restaurant.details}"</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Close</button>
      </motion.div>
    </motion.div>
  );
};


// =================================================================================
// MAIN DASHBOARD COMPONENT
// =================================================================================

const RestaurantDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [paymentState, setPaymentState] = useState({ isOpen: false, status: 'idle', orderId: null });
  const [modal, setModal] = useState({ type: null, data: null }); // For AddTicket, ShareMeal

  // --- DATA USING LOCALSTORAGE HOOK ---
  const [restaurants, setRestaurants] = useLocalStorage('restaurants', [
    { id: 1, name: "Inka Kitchen", tagline: "Taste of Rwanda", logo: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=IK", details: "Uyu munsi dufite Isombe, Inyama z'ihene, n'Ibijumba. Murakaza neza!" },
    { id: 2, name: "Kigali Bites", tagline: "Modern & Fast", logo: "https://via.placeholder.com/150/F5A623/FFFFFF?text=KB", details: "Today's special: Gourmet Burgers, Loaded Fries, and fresh Tropical Smoothies." },
  ]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useLocalStorage('selectedRestaurant', 1);
  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  const [orders, setOrders] = useLocalStorage('orders', [
    { id: "001", customer: "John Doe", items: "Beef & Rice", status: "pending", amount: 15000, time: "2 mins ago", paid: false },
    { id: "002", customer: "Jane Smith", items: "Chicken & Chips", status: "ready", amount: 12000, time: "5 mins ago", paid: false },
    { id: "003", customer: "Mike Wilson", items: "Pizza", status: "preparing", amount: 18000, time: "10 mins ago", paid: true },
    { id: "004", customer: "Sarah Johnson", items: "Burger & Fries", status: "completed", amount: 16000, time: "15 mins ago", paid: true },
  ]);

  const [customers, setCustomers] = useLocalStorage('customers', [
    { id: 1, name: "Alice Martin", avatar: "AM", ticketQty: 5, redeemed: 2 },
    { id: 2, name: "Bob Williams", avatar: "BW", ticketQty: 10, redeemed: 10 },
    { id: 3, name: "Charlie Brown", avatar: "CB", ticketQty: 3, redeemed: 0 },
    { id: 4, name: "Diana Prince", avatar: "DP", ticketQty: 8, redeemed: 5 },
  ]);

  // --- CALCULATED STATS ---
  const totalAvailableMeals = customers.reduce((acc, curr) => acc + (curr.ticketQty - curr.redeemed), 0);
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

  // --- HANDLER FUNCTIONS ---
  const handleRedeemToggle = (customerId, index) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const alreadyRedeemed = index < c.redeemed;
        // To untick, you must click the last redeemed box
        if (alreadyRedeemed && index !== c.redeemed - 1) return c;
        return { ...c, redeemed: alreadyRedeemed ? c.redeemed - 1 : c.redeemed + 1 };
      }
      return c;
    }));
  };

  const handleServeOne = (customerId) => {
    setCustomers(prev => prev.map(c => (c.id === customerId && c.redeemed < c.ticketQty) ? { ...c, redeemed: c.redeemed + 1 } : c));
  };

  const handleUndoLast = (customerId) => {
    setCustomers(prev => prev.map(c => (c.id === customerId && c.redeemed > 0) ? { ...c, redeemed: c.redeemed - 1 } : c));
  };

  const handleAddTickets = (customerId, quantity) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ticketQty: c.ticketQty + quantity } : c));
    setModal({ type: null, data: null });
  };

  const handleShareMeals = (senderId, recipientId, amount) => {
    if (!senderId || !recipientId || !amount) return;
    setCustomers(prev => {
      const sender = prev.find(c => c.id === senderId);
      const available = sender.ticketQty - sender.redeemed;
      if (amount > available) return prev; // Don't allow sharing more than available

      return prev.map(c => {
        if (c.id === senderId) return { ...c, ticketQty: c.ticketQty - amount };
        if (c.id === parseInt(recipientId)) return { ...c, ticketQty: c.ticketQty + amount };
        return c;
      });
    });
    setModal({ type: null, data: null });
  };

  const handleInitiatePayment = (orderId) => {
    setPaymentState({ isOpen: true, status: 'processing', orderId });
    setTimeout(() => {
      const isSuccess = Math.random() > 0.4; // 60% success chance
      setPaymentState(prev => ({ ...prev, status: isSuccess ? 'success' : 'failed' }));
      if (isSuccess) {
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, paid: true } : o));
      }
    }, 2500);
  };

  const handleCompleteOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    setPaymentState({ isOpen: false, status: 'idle', orderId: null });
  };

  const handleOrderConfirm = (orderId) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId && order.paid ? { ...order, status: "preparing" } : order
    ));
  };

  // ENHANCED: Search functionality
  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = searchTerm === '' ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pageTransition = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

  const sidebarItems = [
    { icon: <FaHome />, name: "Dashboard", page: "dashboard" },
    { icon: <FaClipboardCheck />, name: "Orders", page: "orders" },
    { icon: <FaUsers />, name: "Customers", page: "customers" },
    { icon: <FaUtensils />, name: "Menu", page: "stock" },
    { icon: <FaChartBar />, name: "Analytics", page: "report" },
    { icon: <FaCog />, name: "Settings", page: "settings" },
  ];

  return (
    <>
      <PaymentModal state={paymentState} onRetry={() => handleInitiatePayment(paymentState.orderId)} onClose={() => setPaymentState({ ...paymentState, isOpen: false })} onComplete={handleCompleteOrder} />
      <AnimatePresence>
        {modal.type === 'add-ticket' && <AddTicketModal customer={modal.data} onSave={handleAddTickets} onCancel={() => setModal({ type: null, data: null })} />}
        {modal.type === 'share-meal' && <ShareMealModal sender={modal.data} customers={customers} onShare={handleShareMeals} onCancel={() => setModal({ type: null, data: null })} />}
        {modal.type === 'restaurant-details' && <RestaurantDetailsModal restaurant={selectedRestaurant} onClose={() => setModal({ type: null, data: null })} />}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-xl flex-shrink-0">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <img src={selectedRestaurant.logo} alt="logo" className="w-10 h-10 rounded-lg" />
              <h1 className="text-xl font-bold text-gray-800">{selectedRestaurant.name}</h1>
              <button onClick={() => setModal({ type: 'restaurant-details' })} className="text-gray-400 hover:text-blue-500"><FaInfoCircle /></button>
            </div>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => (
              <button key={item.page} onClick={() => setActivePage(item.page)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 ${activePage === item.page ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}>
                {item.icon} <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-4 lg:p-6 flex-shrink-0">
            {/* ... Header content ... */}
          </header>

          <div className="p-4 lg:p-6 overflow-y-auto flex-1">
            <AnimatePresence mode="wait">
              {activePage === "dashboard" && (
                <motion.div key="dashboard" {...pageTransition}>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* ... other cards */}
                    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <FaClipboardCheck className="text-yellow-500" />
                      </div>
                      <h3 className="text-3xl font-bold">{pendingOrdersCount}</h3>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Flexible Meal Wallet</p>
                        <FaTicketAlt className="text-purple-500" />
                      </div>
                      <h3 className="text-3xl font-bold">{totalAvailableMeals} <span className="text-lg font-normal text-gray-500">Meals</span></h3>
                      <p className="text-xs text-gray-500 mt-2">Total available across all customers</p>
                    </motion.div>
                  </div>
                  {/* ... rest of dashboard */}
                </motion.div>
              )}

              {activePage === "orders" && (
                <motion.div key="orders" {...pageTransition}>
                  {/* ... Page header ... */}
                  <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                    <input type="text" placeholder="Search by ID, Customer, or Items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {/* Orders List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                      <motion.div key={order.id} className="bg-white rounded-xl shadow-sm border p-5">
                        {/* ... Order details ... */}
                        <div className="flex justify-between text-sm font-bold"><span>Total:</span><span>{formatCurrency(order.amount)}</span></div>
                        <div className="border-t my-3"></div>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => handleOrderConfirm(order.id)} disabled={!order.paid} className="flex-1 bg-green-600 text-white py-2 rounded-lg enabled:hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Confirm</button>
                              {!order.paid && <button onClick={() => handleInitiatePayment(order.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Pay Now</button>}
                            </>
                          )}
                          {order.status === 'ready' && !order.paid && (
                            <button onClick={() => handleInitiatePayment(order.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Pay to Complete</button>
                          )}
                          {order.status === 'ready' && order.paid && (
                            <button onClick={() => handleCompleteOrder(order.id)} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold">Mark as Completed</button>
                          )}
                        </div>
                        {!order.paid && <p className="text-center text-xs text-red-500 mt-2 font-semibold">Payment Required</p>}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activePage === "customers" && (
                <motion.div key="customers" {...pageTransition}>
                  <h2 className="text-2xl font-bold mb-4">Customer Meal Tickets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {customers.map(customer => (
                      <motion.div key={customer.id} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">{customer.avatar}</div>
                            <div>
                              <h3 className="font-semibold text-lg">{customer.name}</h3>
                              <p className="text-sm text-gray-500">{customer.redeemed} / {customer.ticketQty} Meals</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setModal({ type: 'share-meal', data: customer })} className="p-2 text-gray-500 hover:text-purple-600"><FaShareAlt /></button>
                            <button onClick={() => setModal({ type: 'add-ticket', data: customer })} className="p-2 text-gray-500 hover:text-blue-600"><FaTicketAlt /></button>
                          </div>
                        </div>
                        <div className="my-4">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Meal Progress</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: customer.ticketQty }).map((_, i) => (
                              <motion.button key={i} whileTap={{ scale: 0.8 }} onClick={() => handleRedeemToggle(customer.id, i)} disabled={i > customer.redeemed} className="disabled:cursor-not-allowed">
                                {i < customer.redeemed ? <FaCheckSquare className="text-green-500 text-3xl" /> : <FaSquare className="text-gray-300 text-3xl" />}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleUndoLast(customer.id)} disabled={customer.redeemed === 0} className="flex-1 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400">Undo</button>
                          <button onClick={() => handleServeOne(customer.id)} disabled={customer.redeemed >= customer.ticketQty} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300">Serve one</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};

export default RestaurantDashboard;