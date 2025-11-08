import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell, FaClipboardCheck, FaUtensils, FaMoneyBill, FaChartLine, FaUserFriends,
  FaExclamationTriangle, FaPlus, FaBan, FaPlay, FaCheck, FaCheckDouble, FaEdit,
  FaFileCsv, FaSearch, FaBoxOpen, FaCheckCircle, FaTimes, FaCashRegister, FaCog,
  FaShoppingCart, FaClock, FaUsers, FaWarehouse, FaChartBar, FaCalendarAlt,
  FaReceipt, FaPercentage, FaArrowUp, FaArrowDown, FaSave, FaTrash, FaEye,
  FaUserCog, FaClipboardList, FaFilter, FaDownload, FaUpload, FaPrint,
  FaSync, FaHistory, FaCalendarCheck, FaUserTie, FaStore, FaBars, FaHome
} from "react-icons/fa";

// ==================== CONSTANTS & UTILITIES ====================

const pageMotion = { 
  initial: { opacity: 0, y: 20 }, 
  animate: { opacity: 1, y: 0 }, 
  exit: { opacity: 0, y: -20 } 
};

const formatAmount = (v) => (Number(v || 0)).toLocaleString();
const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
const deepClone = (x) => JSON.parse(JSON.stringify(x));
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const sameDay = (a, b) => startOfDay(a) === startOfDay(b);

// ==================== CUSTOM HOOKS ====================

const useLocalStorage = (key, initialValue) => {
  const [stored, setStored] = useState(() => {
    try { 
      const raw = localStorage.getItem(key); 
      return raw ? JSON.parse(raw) : initialValue; 
    } catch { 
      return initialValue; 
    }
  });
  
  useEffect(() => { 
    try { 
      localStorage.setItem(key, JSON.stringify(stored)); 
    } catch {} 
  }, [key, stored]);
  
  return [stored, setStored];
};

// ==================== HELPER FUNCTIONS ====================

const exportCSV = (rows, filename = "export.csv") => {
  if (!rows?.length) return;
  const keys = Array.from(rows.reduce((s, r) => { 
    Object.keys(r).forEach(k => s.add(k)); 
    return s; 
  }, new Set()));
  const header = keys.join(",");
  const body = rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(",")).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); 
  const a = document.createElement("a");
  a.href = url; 
  a.download = filename; 
  a.click(); 
  URL.revokeObjectURL(url);
};

// ==================== TOAST COMPONENT ====================

function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  }[type] || "bg-gray-500";

  const icon = {
    success: <FaCheckCircle />,
    error: <FaTimes />,
    warning: <FaExclamationTriangle />,
    info: <FaBell />
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
    >
      {icon}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <FaTimes />
      </button>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function RestaurantPortalDashboard() {
  // ==================== SEED DATA ====================
  const seedMenu = [
    { id: uid("menu"), name: "Beans & Rice", price: 1500, category: "Main", available: true, preparationTime: 20, calories: 450, allergens: [], popular: true },
    { id: uid("menu"), name: "Tilapia Grill", price: 5500, category: "Main", available: true, preparationTime: 30, calories: 350, allergens: ["fish"], popular: true },
    { id: uid("menu"), name: "Veggie Bowl", price: 2500, category: "Main", available: true, preparationTime: 15, calories: 250, allergens: [], popular: false },
    { id: uid("menu"), name: "Chicken Wings", price: 4500, category: "Starter", available: true, preparationTime: 25, calories: 550, allergens: [], popular: true },
    { id: uid("menu"), name: "Fresh Juice", price: 1000, category: "Beverage", available: true, preparationTime: 5, calories: 120, allergens: [], popular: false },
    { id: uid("menu"), name: "Beef Stew", price: 3500, category: "Main", available: true, preparationTime: 35, calories: 480, allergens: [], popular: false },
    { id: uid("menu"), name: "Salad", price: 1800, category: "Starter", available: true, preparationTime: 10, calories: 150, allergens: [], popular: false },
  ];

  const seedIngredients = [
    { id: uid("ing"), name: "Beans", unit: "kg", qty: 30, reorderLevel: 5, unitCost: 1800, supplier: "Local Market", lastRestocked: Date.now() - 86400000 * 3 },
    { id: uid("ing"), name: "Rice", unit: "kg", qty: 50, reorderLevel: 10, unitCost: 1200, supplier: "Rice Distributors", lastRestocked: Date.now() - 86400000 * 2 },
    { id: uid("ing"), name: "Tilapia", unit: "kg", qty: 20, reorderLevel: 5, unitCost: 8000, supplier: "Fish Market", lastRestocked: Date.now() - 86400000 },
    { id: uid("ing"), name: "Vegetables", unit: "kg", qty: 25, reorderLevel: 8, unitCost: 2000, supplier: "Fresh Farms", lastRestocked: Date.now() },
    { id: uid("ing"), name: "Chicken", unit: "kg", qty: 15, reorderLevel: 5, unitCost: 5000, supplier: "Poultry Farm", lastRestocked: Date.now() - 86400000 * 4 },
    { id: uid("ing"), name: "Beef", unit: "kg", qty: 10, reorderLevel: 3, unitCost: 12000, supplier: "Meat Market", lastRestocked: Date.now() - 86400000 * 2 },
  ];

  const seedRecipes = [
    { id: uid("rec"), menuItemName: "Beans & Rice", ing: { Beans: 0.2, Rice: 0.25 } },
    { id: uid("rec"), menuItemName: "Tilapia Grill", ing: { Tilapia: 0.35, Rice: 0.2 } },
    { id: uid("rec"), menuItemName: "Veggie Bowl", ing: { Vegetables: 0.3, Rice: 0.2 } },
    { id: uid("rec"), menuItemName: "Chicken Wings", ing: { Chicken: 0.4 } },
    { id: uid("rec"), menuItemName: "Beef Stew", ing: { Beef: 0.3, Vegetables: 0.2, Rice: 0.15 } },
    { id: uid("rec"), menuItemName: "Salad", ing: { Vegetables: 0.4 } },
  ];

  const seedStaff = [
    { id: uid("staff"), name: "John Manager", email: "john@restaurant.com", role: "manager", phone: "0788123456", active: true, joinDate: Date.now() - 86400000 * 365, salary: 500000 },
    { id: uid("staff"), name: "Sarah Chef", email: "sarah@restaurant.com", role: "chef", phone: "0788123457", active: true, joinDate: Date.now() - 86400000 * 180, salary: 350000 },
    { id: uid("staff"), name: "Mike Cashier", email: "mike@restaurant.com", role: "cashier", phone: "0788123458", active: true, joinDate: Date.now() - 86400000 * 90, salary: 250000 },
    { id: uid("staff"), name: "Anna Waiter", email: "anna@restaurant.com", role: "waiter", phone: "0788123459", active: true, joinDate: Date.now() - 86400000 * 60, salary: 200000 },
  ];

  const now = new Date();
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 10);
  const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 10);

  // ==================== STATE MANAGEMENT ====================
  const [menu, setMenu] = useLocalStorage("rp_menu", seedMenu);
  const [ingredients, setIngredients] = useLocalStorage("rp_ingredients", seedIngredients);
  const [recipes, setRecipes] = useLocalStorage("rp_recipes", seedRecipes);
  const [stockLedger, setStockLedger] = useLocalStorage("rp_stock_ledger", []);
  const [notifications, setNotifications] = useLocalStorage("rp_notifications", []);
  const [toasts, setToasts] = useState([]);
  const [staff, setStaff] = useLocalStorage("rp_staff", seedStaff);
  const [currentUser, setCurrentUser] = useState(seedStaff[0]);
  
  const [customers, setCustomers] = useLocalStorage("rp_customers", [
    { id: uid("c"), name: "Alice Martin", phone: "0788123456", email: "alice@email.com", active: true, joinDate: Date.now() - 86400000 * 60, totalSpent: 105000 },
    { id: uid("c"), name: "Bob Williams", phone: "0788123457", email: "bob@email.com", active: true, joinDate: Date.now() - 86400000 * 45, totalSpent: 87500 },
    { id: uid("c"), name: "Diana Prince", phone: "0788123458", email: "diana@email.com", active: false, joinDate: Date.now() - 86400000 * 30, totalSpent: 45000 }
  ]);
  
  const [subscriptions, setSubscriptions] = useLocalStorage("rp_subscriptions", [
    { 
      id: uid("sub"), 
      customerId: customers[0]?.id, 
      customerName: "Alice Martin", 
      startDate: thisMonthDate.getTime(), 
      endDate: thisMonthDate.getTime() + 30 * 86400000, 
      status: "active",
      amount: 35000,
      mealsPlan: 30,
      mealsUsed: 12
    },
  ]);
  
  const [orders, setOrders] = useLocalStorage("rp_orders", [
    { 
      id: uid("ord"), 
      orderNumber: "ORD-001",
      customerName: "John Doe", 
      customerPhone: "0788123450",
      tableNumber: 5,
      orderType: "dine-in",
      status: "pending", 
      paid: false, 
      paymentMethod: null,
      createdAt: Date.now() - 3600000, 
      items: [{ name: "Beans & Rice", menuItemId: seedMenu[0].id, qty: 2, unitPrice: 1500, notes: "" }],
      notes: "Extra spicy",
      assignedTo: null
    },
    { 
      id: uid("ord"), 
      orderNumber: "ORD-002",
      customerName: "Jane Smith", 
      customerPhone: "0788123451",
      tableNumber: 3,
      orderType: "dine-in",
      status: "cooking", 
      paid: false, 
      paymentMethod: null,
      createdAt: Date.now() - 7200000, 
      items: [{ name: "Tilapia Grill", menuItemId: seedMenu[1].id, qty: 1, unitPrice: 5500, notes: "No salt" }],
      notes: "",
      assignedTo: seedStaff[1].id
    },
  ]);
  
  const [transactions, setTransactions] = useLocalStorage("rp_transactions", []);
  const [consumptionLog, setConsumptionLog] = useLocalStorage("rp_consumption", []);
  const [auditLog, setAuditLog] = useLocalStorage("rp_audit", []);

  // ==================== UI STATE ====================
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [role, setRole] = useState("manager");
  const [showNotifs, setShowNotifs] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState({ start: todayISO(), end: todayISO() });

  // ==================== TOAST MANAGEMENT ====================
  const showToast = useCallback((message, type = "info") => {
    const id = uid("toast");
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ==================== AUDIT LOGGING ====================
  const logAudit = useCallback((action, details, userId = currentUser?.id) => {
    setAuditLog(prev => [{
      id: uid("audit"),
      action,
      details,
      userId,
      timestamp: Date.now()
    }, ...prev]);
  }, [currentUser, setAuditLog]);

  // ==================== HELPERS ====================
  const calcOrderTotal = useCallback((order) => 
    order.items?.reduce((s, it) => s + Number(it.unitPrice || 0) * Number(it.qty || 0), 0) || 0
  , []);

  const monthFilterRange = useMemo(() => {
    const start = new Date(selectedYear, selectedMonth, 1).getTime();
    const end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).getTime();
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevStart = new Date(prevYear, prevMonth, 1).getTime();
    const prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59).getTime();
    return { start, end, prevStart, prevEnd };
  }, [selectedMonth, selectedYear]);

  // ==================== ANALYTICS ====================
  
  // Daily Analytics
  const dailyOrders = useMemo(() =>
    orders.filter(o => sameDay(new Date(o.createdAt), new Date(selectedDate)))
  , [orders, selectedDate]);

  const dailyServedOrders = useMemo(() =>
    dailyOrders.filter(o => ["served", "completed"].includes(o.status))
  , [dailyOrders]);

  const dailyPlatesServed = useMemo(() =>
    dailyServedOrders.reduce((s, o) => s + o.items.reduce((x, i) => x + i.qty, 0), 0)
  , [dailyServedOrders]);

  const dailyWorth = useMemo(() =>
    dailyServedOrders.reduce((s, o) => s + calcOrderTotal(o), 0)
  , [dailyServedOrders, calcOrderTotal]);

  const dailyConsumption = useMemo(() =>
    consumptionLog.filter(c => c.date === selectedDate)
  , [consumptionLog, selectedDate]);

  // Monthly Analytics
  const monthlyOrders = useMemo(() =>
    orders.filter(o => o.createdAt >= monthFilterRange.start && o.createdAt <= monthFilterRange.end)
  , [orders, monthFilterRange]);

  const monthlyTx = useMemo(() =>
    transactions.filter(t => t.createdAt >= monthFilterRange.start && t.createdAt <= monthFilterRange.end)
  , [transactions, monthFilterRange]);

  const prevMonthlyTx = useMemo(() =>
    transactions.filter(t => t.createdAt >= monthFilterRange.prevStart && t.createdAt <= monthFilterRange.prevEnd)
  , [transactions, monthFilterRange]);

  const monthlySales = useMemo(() =>
    monthlyTx.filter(t => t.type === "sale").reduce((s, t) => s + Number(t.amount || 0), 0)
  , [monthlyTx]);

  const monthlySubRevenue = useMemo(() =>
    monthlyTx.filter(t => t.type === "subscription").reduce((s, t) => s + Number(t.amount || 0), 0)
  , [monthlyTx]);

  const monthlyTotalRevenue = monthlySales + monthlySubRevenue;
  
  const prevMonthlyTotal = useMemo(() =>
    prevMonthlyTx.reduce((s, t) => s + Number(t.amount || 0), 0)
  , [prevMonthlyTx]);

  const revenueGrowthPct = useMemo(() => {
    if (prevMonthlyTotal === 0 && monthlyTotalRevenue > 0) return 100;
    if (prevMonthlyTotal === 0) return 0;
    return Math.round(((monthlyTotalRevenue - prevMonthlyTotal) / prevMonthlyTotal) * 100);
  }, [monthlyTotalRevenue, prevMonthlyTotal]);

  // Subscription Analytics
  const activeSubscribers = useMemo(() =>
    subscriptions.filter(s => s.status === "active" && s.endDate > Date.now()).length
  , [subscriptions]);

  const monthlyNewSubs = useMemo(() =>
    subscriptions.filter(s => s.startDate >= monthFilterRange.start && s.startDate <= monthFilterRange.end).length
  , [subscriptions, monthFilterRange]);

  const prevMonthlyNewSubs = useMemo(() =>
    subscriptions.filter(s => s.startDate >= monthFilterRange.prevStart && s.startDate <= monthFilterRange.prevEnd).length
  , [subscriptions, monthFilterRange]);

  const subGrowthPct = useMemo(() => {
    if (prevMonthlyNewSubs === 0 && monthlyNewSubs > 0) return 100;
    if (prevMonthlyNewSubs === 0) return 0;
    return Math.round(((monthlyNewSubs - prevMonthlyNewSubs) / prevMonthlyNewSubs) * 100);
  }, [monthlyNewSubs, prevMonthlyNewSubs]);

  // Inventory Analytics
  const lowStock = useMemo(() => 
    ingredients.filter(i => Number(i.qty) <= Number(i.reorderLevel))
  , [ingredients]);

  const inventoryValue = useMemo(() =>
    ingredients.reduce((sum, ing) => sum + (Number(ing.qty) * Number(ing.unitCost || 0)), 0)
  , [ingredients]);

  // Performance Metrics
  const averageOrderValue = useMemo(() => {
    if (monthlyOrders.length === 0) return 0;
    const total = monthlyOrders.reduce((s, o) => s + calcOrderTotal(o), 0);
    return Math.round(total / monthlyOrders.length);
  }, [monthlyOrders, calcOrderTotal]);

  const topSellingItems = useMemo(() => {
    const itemCounts = {};
    monthlyOrders.forEach(order => {
      order.items?.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    });
    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [monthlyOrders]);

  // ==================== ROLE PERMISSIONS ====================
  const can = {
    // Order Management
    confirm: ["waiter", "manager"].includes(role),
    serve: ["chef", "manager"].includes(role),
    complete: ["manager", "waiter", "chef"].includes(role),
    receivePayment: ["cashier", "manager"].includes(role),
    deleteOrder: ["manager"].includes(role),
    viewOrder: true,
    
    // Menu & Inventory
    editMenu: ["manager", "chef"].includes(role),
    stockIn: ["manager"].includes(role),
    manageRecipes: ["chef", "manager"].includes(role),
    
    // Financial & Analytics
    viewAnalytics: ["manager", "cashier"].includes(role),
    exportReports: ["manager", "cashier"].includes(role),
    viewFinancials: ["manager", "cashier"].includes(role),
    
    // Customer & Subscription
    manageSubscriptions: ["manager", "cashier"].includes(role),
    manageCustomers: ["manager", "cashier", "waiter"].includes(role),
    
    // Staff Management
    manageStaff: ["manager"].includes(role),
    viewStaff: ["manager", "chef"].includes(role),
    
    // System
    viewAuditLog: ["manager"].includes(role),
    systemSettings: ["manager"].includes(role),
  };

  // ==================== NOTIFICATIONS ====================
  const pushNotif = (title, message, tone = "info", priority = "normal") => {
    const notif = { 
      id: uid("notif"), 
      title, 
      message, 
      tone, 
      priority,
      createdAt: Date.now(),
      read: false 
    };
    
    setNotifications(prev => [notif, ...prev].slice(0, 100));
    
    // Show toast for high priority notifications
    if (priority === "high") {
      showToast(message, tone === "warn" ? "warning" : tone);
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("All notifications cleared", "info");
  };

  // ==================== ORDER OPERATIONS ====================

  const createOrder = (orderData) => {
    const newOrder = {
      id: uid("ord"),
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: "pending",
      paid: false,
      createdAt: Date.now(),
      assignedTo: null
    };
    
    setOrders(prev => [newOrder, ...prev]);
    pushNotif("New Order", `Order ${newOrder.orderNumber} created`, "info");
    logAudit("CREATE_ORDER", `Created order ${newOrder.orderNumber}`);
    showToast("Order created successfully", "success");
    
    return newOrder;
  };

  const startCooking = (orderId) => {
    if (!can.confirm) {
      showToast("You don't have permission to confirm orders", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: "cooking", assignedTo: currentUser?.id } 
        : o
    ));
    
    pushNotif("Order Confirmed", `Order ${order.orderNumber} sent to kitchen`, "info");
    logAudit("CONFIRM_ORDER", `Confirmed order ${order.orderNumber}`);
    showToast("Order confirmed and sent to kitchen", "success");
  };

  const markServed = (orderId) => {
    if (!can.serve) {
      showToast("You don't have permission to serve orders", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Deduct inventory
    deductInventoryByOrder(order);
    
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      // Update consumption log
      const platesCount = o.items.reduce((s, i) => s + i.qty, 0);
      const worth = calcOrderTotal(o);
      
      setConsumptionLog(prevLog => [...prevLog, {
        id: uid("cons"),
        date: todayISO(),
        orderId: o.id,
        orderNumber: o.orderNumber,
        plates: platesCount,
        worth,
        items: o.items
      }]);
      
      return { ...o, status: "served", servedAt: Date.now() };
    }));
    
    pushNotif("Order Served", `Order ${order.orderNumber} has been served`, "success");
    logAudit("SERVE_ORDER", `Served order ${order.orderNumber}`);
    showToast("Order marked as served", "success");
  };

  const markCompleted = (orderId) => {
    if (!can.complete) {
      showToast("You don't have permission to complete orders", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: "completed", completedAt: Date.now() } 
        : o
    ));
    
    pushNotif("Order Completed", `Order ${order.orderNumber} completed`, "success");
    logAudit("COMPLETE_ORDER", `Completed order ${order.orderNumber}`);
    showToast("Order completed successfully", "success");
  };

  const cancelOrder = (orderId, reason = "") => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: "canceled", cancelReason: reason, canceledAt: Date.now() } 
        : o
    ));
    
    pushNotif("Order Canceled", `Order ${order.orderNumber} has been canceled`, "warn");
    logAudit("CANCEL_ORDER", `Canceled order ${order.orderNumber}: ${reason}`);
    showToast("Order canceled", "warning");
  };

  const deleteOrder = (orderId) => {
    if (!can.deleteOrder) {
      showToast("You don't have permission to delete orders", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setConfirmDialog({
      title: "Delete Order",
      message: `Are you sure you want to delete order ${order.orderNumber}? This action cannot be undone.`,
      onConfirm: () => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        pushNotif("Order Deleted", `Order ${order.orderNumber} has been deleted`, "info");
        logAudit("DELETE_ORDER", `Deleted order ${order.orderNumber}`);
        showToast("Order deleted successfully", "success");
        setConfirmDialog(null);
        setViewingOrder(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const receivePayment = (orderId, method = "cash", amount = null) => {
    if (!can.receivePayment) {
      showToast("You don't have permission to receive payments", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      showToast("Order not found", "error");
      return;
    }
    
    const paymentAmount = amount || calcOrderTotal(order);
    
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, paid: true, paymentMethod: method, paidAt: Date.now() } 
        : o
    ));
    
    setTransactions(prev => [{ 
      id: uid("tx"), 
      type: "sale", 
      amount: paymentAmount, 
      orderId,
      orderNumber: order.orderNumber, 
      method, 
      createdAt: Date.now(),
      recordedBy: currentUser?.id
    }, ...prev]);
    
    // Update customer total spent
    if (order.customerPhone) {
      setCustomers(prev => prev.map(c => 
        c.phone === order.customerPhone 
          ? { ...c, totalSpent: (c.totalSpent || 0) + paymentAmount } 
          : c
      ));
    }
    
    pushNotif("Payment Received", `Payment of RWF ${formatAmount(paymentAmount)} received for Order ${order.orderNumber}`, "success", "high");
    logAudit("RECEIVE_PAYMENT", `Received payment of RWF ${formatAmount(paymentAmount)} for order ${order.orderNumber}`);
    showToast(`Payment of RWF ${formatAmount(paymentAmount)} received`, "success");
  };

  // ==================== INVENTORY OPERATIONS ====================

  const deductInventoryByOrder = (order) => {
    try {
      const recipeByName = Object.fromEntries(recipes.map(r => [r.menuItemName, r.ing]));
      const ingClone = deepClone(ingredients);
      const ledger = [];

      order.items.forEach(item => {
        const recipe = recipeByName[item.name];
        if (!recipe) {
          console.warn(`No recipe found for ${item.name}`);
          return;
        }
        
        Object.entries(recipe).forEach(([ingName, qtyPerPlate]) => {
          const total = qtyPerPlate * item.qty;
          const ing = ingClone.find(x => x.name === ingName);
          if (!ing) {
            console.warn(`Ingredient ${ingName} not found`);
            return;
          }
          
          if (ing.qty < total) {
            pushNotif("Low Stock Warning", `Insufficient ${ingName} stock. Required: ${total} ${ing.unit}`, "warn", "high");
            return;
          }
          
          ing.qty = Math.max(0, Number(ing.qty) - total);
          ledger.push({ 
            id: uid("stockout"), 
            ingredient: ingName, 
            type: "out", 
            quantity: total, 
            unitCost: ing.unitCost,
            refType: "order", 
            refId: order.id,
            orderNumber: order.orderNumber,
            createdAt: Date.now(),
            recordedBy: currentUser?.id 
          });
        });
      });

      setIngredients(ingClone);
      setStockLedger(prev => [...ledger, ...prev]);
      checkLowStock(ingClone);
      
      logAudit("DEDUCT_INVENTORY", `Deducted inventory for order ${order.orderNumber}`);
    } catch (e) {
      console.error("deductInventoryByOrder error", e);
      showToast("Error updating inventory", "error");
    }
  };

  const checkLowStock = (currentIngredients) => {
    const low = currentIngredients.filter(i => Number(i.qty) <= Number(i.reorderLevel));
    low.forEach(ing => {
      pushNotif(
        "Low Stock Alert",
        `${ing.name} is running low (${ing.qty} ${ing.unit} remaining). Reorder level: ${ing.reorderLevel} ${ing.unit}`,
        "warn",
        "high"
      );
    });
  };

  const recordDelivery = (ingredient, quantity, unitCost, supplier = "") => {
    if (!can.stockIn) {
      showToast("You don't have permission to manage stock", "error");
      return;
    }
    
    setIngredients(prev => prev.map(i => 
      i.name === ingredient 
        ? { ...i, qty: Number(i.qty) + quantity, lastRestocked: Date.now() } 
        : i
    ));
    
    setStockLedger(prev => [{ 
      id: uid("stockin"), 
      ingredient, 
      type: "in", 
      quantity, 
      unitCost, 
      supplier,
      refType: "delivery", 
      refId: uid("del"), 
      createdAt: Date.now(),
      recordedBy: currentUser?.id
    }, ...prev]);
    
    pushNotif("Stock In", `${ingredient} +${quantity}kg delivery recorded`, "info");
    logAudit("STOCK_IN", `Recorded delivery of ${quantity}kg ${ingredient} from ${supplier || 'Unknown supplier'}`);
    showToast(`Stock updated: ${ingredient} +${quantity}kg`, "success");
  };

  // ==================== SUBSCRIPTION OPERATIONS ====================

  const createSubscription = (customerData, amount = 35000, mealsPlan = 30) => {
    if (!can.manageSubscriptions) {
      showToast("Permission denied", "error");
      return;
    }
    
    const subscription = { 
      id: uid("sub"), 
      customerId: customerData.id, 
      customerName: customerData.name,
      customerPhone: customerData.phone,
      startDate: Date.now(), 
      endDate: Date.now() + 30 * 86400000, 
      status: "active",
      amount,
      mealsPlan,
      mealsUsed: 0
    };
    
    setSubscriptions(prev => [subscription, ...prev]);
    
    setTransactions(prev => [{ 
      id: uid("tx"), 
      type: "subscription", 
      amount, 
      subscriptionId: subscription.id,
      customerName: customerData.name,
      method: "momo", 
      createdAt: Date.now(),
      recordedBy: currentUser?.id
    }, ...prev]);
    
    pushNotif("Subscription Created", `New subscription for ${customerData.name} (RWF ${formatAmount(amount)})`, "success", "high");
    logAudit("CREATE_SUBSCRIPTION", `Created subscription for ${customerData.name}`);
    showToast("Subscription created successfully", "success");
    
    return subscription;
  };

  const renewSubscription = (subscriptionId) => {
    if (!can.manageSubscriptions) {
      showToast("Permission denied", "error");
      return;
    }
    
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        const renewed = {
          ...s,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 86400000,
          status: "active",
          mealsUsed: 0
        };
        
        setTransactions(prev => [{ 
          id: uid("tx"), 
          type: "subscription", 
          amount: s.amount, 
          subscriptionId: s.id,
          customerName: s.customerName,
          method: "momo", 
          createdAt: Date.now(),
          recordedBy: currentUser?.id
        }, ...prev]);
        
        pushNotif("Subscription Renewed", `Subscription for ${s.customerName} renewed`, "success");
        logAudit("RENEW_SUBSCRIPTION", `Renewed subscription for ${s.customerName}`);
        
        return renewed;
      }
      return s;
    }));
    
    showToast("Subscription renewed successfully", "success");
  };

  // ==================== MENU OPERATIONS ====================

  const toggleMenuAvailability = (id) => {
    if (!can.editMenu) {
      showToast("Permission denied", "error");
      return;
    }
    
    const item = menu.find(m => m.id === id);
    if (!item) return;
    
    setMenu(prev => prev.map(m => 
      m.id === id ? { ...m, available: !m.available } : m
    ));
    
    const action = item.available ? "disabled" : "enabled";
    pushNotif("Menu Updated", `${item.name} ${action}`, "info");
    logAudit("UPDATE_MENU", `${action} menu item: ${item.name}`);
    showToast(`${item.name} ${action}`, "success");
  };

  const updateMenuPrice = (id, price) => {
    if (!can.editMenu) {
      showToast("Permission denied", "error");
      return;
    }
    
    const p = Number(price || 0);
    if (p < 0) {
      showToast("Price cannot be negative", "error");
      return;
    }
    
    const item = menu.find(m => m.id === id);
    if (!item) return;
    
    setMenu(prev => prev.map(m => 
      m.id === id ? { ...m, price: p } : m
    ));
    
    pushNotif("Price Updated", `${item.name} price changed to RWF ${formatAmount(p)}`, "info");
    logAudit("UPDATE_PRICE", `Updated ${item.name} price from RWF ${formatAmount(item.price)} to RWF ${formatAmount(p)}`);
    showToast("Price updated successfully", "success");
  };

  const addMenuItem = (menuItem) => {
    if (!can.editMenu) {
      showToast("Permission denied", "error");
      return;
    }
    
    const newItem = {
      id: uid("menu"),
      ...menuItem,
      available: true
    };
    
    setMenu(prev => [...prev, newItem]);
    pushNotif("Menu Item Added", `${newItem.name} added to menu`, "success");
    logAudit("ADD_MENU_ITEM", `Added ${newItem.name} to menu`);
    showToast("Menu item added successfully", "success");
    
    return newItem;
  };

  // ==================== REPORTS & EXPORTS ====================

  const generatePerformanceReport = () => {
    const report = {
      reportId: uid("report"),
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser?.name || "System",
      period: `${monthNames[selectedMonth]} ${selectedYear}`,
      
      // Daily Metrics
      daily: {
        date: selectedDate,
        platesServed: dailyPlatesServed,
        worth: dailyWorth,
        ordersCount: dailyOrders.length,
        completedOrders: dailyServedOrders.length,
      },
      
      // Monthly Metrics
      monthly: {
        totalRevenue: monthlyTotalRevenue,
        salesRevenue: monthlySales,
        subscriptionRevenue: monthlySubRevenue,
        revenueGrowth: revenueGrowthPct,
        ordersCount: monthlyOrders.length,
        averageOrderValue,
        newSubscriptions: monthlyNewSubs,
        subscriptionGrowth: subGrowthPct,
      },
      
      // Inventory
      inventory: {
        totalValue: inventoryValue,
        lowStockItems: lowStock.map(i => ({ name: i.name, qty: i.qty, unit: i.unit })),
        stockMovements: stockLedger.filter(s => 
          s.createdAt >= monthFilterRange.start && 
          s.createdAt <= monthFilterRange.end
        ).length,
      },
      
      // Customers
      customers: {
        total: customers.length,
        active: customers.filter(c => c.active).length,
        activeSubscribers,
      },
      
      // Top Items
      topSellingItems: topSellingItems.map(([name, qty]) => ({ name, quantity: qty })),
    };
    
    logAudit("GENERATE_REPORT", `Generated performance report for ${report.period}`);
    return report;
  };

  const exportPerformanceReport = () => {
    const report = generatePerformanceReport();
    const rows = [
      { category: "Report Info", metric: "Generated At", value: report.generatedAt },
      { category: "Report Info", metric: "Generated By", value: report.generatedBy },
      { category: "Report Info", metric: "Period", value: report.period },
      
      { category: "Daily Metrics", metric: "Date", value: report.daily.date },
      { category: "Daily Metrics", metric: "Plates Served", value: report.daily.platesServed },
      { category: "Daily Metrics", metric: "Daily Worth", value: `RWF ${formatAmount(report.daily.worth)}` },
      { category: "Daily Metrics", metric: "Orders Count", value: report.daily.ordersCount },
      
      { category: "Monthly Revenue", metric: "Total Revenue", value: `RWF ${formatAmount(report.monthly.totalRevenue)}` },
      { category: "Monthly Revenue", metric: "Sales Revenue", value: `RWF ${formatAmount(report.monthly.salesRevenue)}` },
      { category: "Monthly Revenue", metric: "Subscription Revenue", value: `RWF ${formatAmount(report.monthly.subscriptionRevenue)}` },
      { category: "Monthly Revenue", metric: "Revenue Growth", value: `${report.monthly.revenueGrowth}%` },
      { category: "Monthly Revenue", metric: "Average Order Value", value: `RWF ${formatAmount(report.monthly.averageOrderValue)}` },
      
      { category: "Subscriptions", metric: "New Subscriptions", value: report.monthly.newSubscriptions },
      { category: "Subscriptions", metric: "Growth Rate", value: `${report.monthly.subscriptionGrowth}%` },
      { category: "Subscriptions", metric: "Active Subscribers", value: report.customers.activeSubscribers },
      
      { category: "Inventory", metric: "Total Value", value: `RWF ${formatAmount(report.inventory.totalValue)}` },
      { category: "Inventory", metric: "Low Stock Items", value: report.inventory.lowStockItems.length },
      { category: "Inventory", metric: "Stock Movements", value: report.inventory.stockMovements },
      
      { category: "Customers", metric: "Total Customers", value: report.customers.total },
      { category: "Customers", metric: "Active Customers", value: report.customers.active },
    ];
    
    // Add top selling items
    report.topSellingItems.forEach((item, idx) => {
      rows.push({ 
        category: "Top Selling Items", 
        metric: `#${idx + 1} ${item.name}`, 
        value: `${item.quantity} orders` 
      });
    });
    
    exportCSV(rows, `performance_report_${report.period.replace(/\s+/g, '_')}.csv`);
    showToast("Performance report exported successfully", "success");
  };

  const exportDailyConsumption = () => {
    const rows = dailyConsumption.map(c => ({
      date: c.date,
      orderNumber: c.orderNumber,
      plates: c.plates,
      worth: c.worth,
      items: c.items?.map(i => `${i.name} x${i.qty}`).join(", ")
    }));
    
    exportCSV(rows, `consumption_${selectedDate}.csv`);
    showToast("Daily consumption exported", "success");
  };

  // ==================== FILTERS ====================
  
  const visibleOrders = useMemo(() => 
    orders
      .filter(o => {
        if (statusFilter === "all") return true;
        return o.status === statusFilter;
      })
      .filter(o => {
        if (!orderSearch.trim()) return true;
        const searchLower = orderSearch.toLowerCase();
        const orderText = `${o.id} ${o.orderNumber} ${o.customerName} ${o.items?.map(i => i.name).join(" ")}`.toLowerCase();
        return orderText.includes(searchLower);
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  , [orders, statusFilter, orderSearch]);

  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  const highPriorityNotifications = useMemo(() =>
    notifications.filter(n => n.priority === "high" && !n.read)
  , [notifications]);

  // ==================== RENDER ====================
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Toast Container */}
      <AnimatePresence>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="font-bold text-lg mb-2">{confirmDialog.title}</h3>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={confirmDialog.onCancel}
                className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 bg-white shadow-lg fixed left-0 top-0 bottom-0 z-20 overflow-y-auto"
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FaStore className="text-3xl" />
                <div>
                  <h2 className="font-bold text-lg">Restaurant Portal</h2>
                  <p className="text-xs opacity-90">Management System</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-xs">Logged in as:</p>
                <p className="font-semibold">{currentUser?.name}</p>
                <p className="text-xs capitalize">{role}</p>
              </div>
            </div>

            <nav className="p-4">
              {[
                { id: "dashboard", label: "Dashboard", icon: FaHome, show: true },
                { id: "orders", label: "Orders", icon: FaClipboardList, show: true },
                { id: "menu", label: "Menu", icon: FaUtensils, show: can.editMenu },
                { id: "inventory", label: "Inventory", icon: FaWarehouse, show: can.stockIn || can.editMenu },
                { id: "customers", label: "Customers", icon: FaUsers, show: can.manageCustomers },
                { id: "subscriptions", label: "Subscriptions", icon: FaCalendarCheck, show: can.manageSubscriptions },
                { id: "analytics", label: "Analytics", icon: FaChartBar, show: can.viewAnalytics },
                { id: "staff", label: "Staff", icon: FaUserTie, show: can.viewStaff },
                { id: "reports", label: "Reports", icon: FaFileCsv, show: can.exportReports },
              ]
                .filter(item => item.show)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : ''} transition-all`}>
        {/* Header */}
        <header className="bg-white shadow-sm px-4 lg:px-6 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaBars />
              </button>
              <h1 className="text-xl font-bold capitalize">
                {activeTab === "dashboard" ? "Dashboard Overview" : activeTab}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <FaClock className="text-sm text-gray-500" />
                <span className="text-sm">{new Date().toLocaleString()}</span>
              </div>
              
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="px-3 py-2 rounded-lg text-sm border"
              >
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
              </select>
              
              <button 
                onClick={() => setShowNotifs(v => !v)} 
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaBell className="text-xl" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
                {highPriorityNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" {...pageMotion}>
                <DashboardView
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  createOrder={createOrder}
                  dailyPlatesServed={dailyPlatesServed}
                  dailyWorth={dailyWorth}
                  dailyConsumption={dailyConsumption}
                  activeSubscribers={activeSubscribers}
                  monthlyTotalRevenue={monthlyTotalRevenue}
                  revenueGrowthPct={revenueGrowthPct}
                  monthNames={monthNames}
                  orders={orders}
                  monthlyOrders={monthlyOrders}
                  lowStock={lowStock}
                  inventoryValue={inventoryValue}
                  topSellingItems={topSellingItems}
                  averageOrderValue={averageOrderValue}
                  exportPerformanceReport={exportPerformanceReport}
                  exportDailyConsumption={exportDailyConsumption}
                  can={can}
                />
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div key="orders" {...pageMotion}>
                <OrdersView
                  orders={visibleOrders}
                  orderSearch={orderSearch}
                  setOrderSearch={setOrderSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  calcOrderTotal={calcOrderTotal}
                  createOrder={createOrder}
                  startCooking={startCooking}
                  markServed={markServed}
                  markCompleted={markCompleted}
                  cancelOrder={cancelOrder}
                  receivePayment={receivePayment}
                  deleteOrder={deleteOrder}
                  can={can}
                  viewingOrder={viewingOrder}
                  setViewingOrder={setViewingOrder}
                  menu={menu}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "menu" && (
              <motion.div key="menu" {...pageMotion}>
                <MenuView
                  menu={menu}
                  setMenu={setMenu}
                  recipes={recipes}
                  setRecipes={setRecipes}
                  toggleMenuAvailability={toggleMenuAvailability}
                  updateMenuPrice={updateMenuPrice}
                  addMenuItem={addMenuItem}
                  can={can}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "inventory" && (
              <motion.div key="inventory" {...pageMotion}>
                <InventoryView
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  stockLedger={stockLedger}
                  recordDelivery={recordDelivery}
                  lowStock={lowStock}
                  inventoryValue={inventoryValue}
                  can={can}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "customers" && (
              <motion.div key="customers" {...pageMotion}>
                <CustomersView
                  customers={customers}
                  setCustomers={setCustomers}
                  subscriptions={subscriptions}
                  orders={orders}
                  can={can}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "subscriptions" && (
              <motion.div key="subscriptions" {...pageMotion}>
                <SubscriptionsView
                  subscriptions={subscriptions}
                  customers={customers}
                  createSubscription={createSubscription}
                  renewSubscription={renewSubscription}
                  activeSubscribers={activeSubscribers}
                  monthlyNewSubs={monthlyNewSubs}
                  subGrowthPct={subGrowthPct}
                  can={can}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div key="analytics" {...pageMotion}>
                <AnalyticsView
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  monthlyTotalRevenue={monthlyTotalRevenue}
                  monthlySales={monthlySales}
                  monthlySubRevenue={monthlySubRevenue}
                  revenueGrowthPct={revenueGrowthPct}
                  activeSubscribers={activeSubscribers}
                  monthlyNewSubs={monthlyNewSubs}
                  subGrowthPct={subGrowthPct}
                  monthlyOrders={monthlyOrders}
                  topSellingItems={topSellingItems}
                  averageOrderValue={averageOrderValue}
                  transactions={transactions}
                  consumptionLog={consumptionLog}
                  monthNames={monthNames}
                  can={can}
                />
              </motion.div>
            )}

            {activeTab === "staff" && (
              <motion.div key="staff" {...pageMotion}>
                <StaffView
                  staff={staff}
                  setStaff={setStaff}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  can={can}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div key="reports" {...pageMotion}>
                <ReportsView
                  generatePerformanceReport={generatePerformanceReport}
                  exportPerformanceReport={exportPerformanceReport}
                  exportDailyConsumption={exportDailyConsumption}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  monthNames={monthNames}
                  orders={orders}
                  transactions={transactions}
                  consumptionLog={consumptionLog}
                  stockLedger={stockLedger}
                  auditLog={auditLog}
                  can={can}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowNotifs(false)} 
            className="fixed inset-0 bg-black/30 z-40"
          >
            <motion.div 
              initial={{ x: 400 }} 
              animate={{ x: 0 }} 
              exit={{ x: 400 }} 
              onClick={e => e.stopPropagation()} 
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-sm text-gray-500">{unreadNotifications} unread</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                  <button 
                    onClick={() => setShowNotifs(false)} 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="p-3 space-y-2 max-h-[85vh] overflow-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBell className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <motion.div 
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markNotificationRead(n.id)}
                      className={`border rounded-xl p-3 cursor-pointer transition-all ${
                        n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      } ${n.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                            <span className="font-semibold">{n.title}</span>
                            {n.priority === 'high' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">High</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== VIEW COMPONENTS ====================

// Continue with all view components...
// Due to length limits, I'll provide the key structure and you can expand as needed

function DashboardView(props) {
  const {
    selectedDate, setSelectedDate, selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear, createOrder, dailyPlatesServed,
    dailyWorth, dailyConsumption, activeSubscribers, monthlyTotalRevenue,
    revenueGrowthPct, monthNames, orders, monthlyOrders, lowStock,
    inventoryValue, topSellingItems, averageOrderValue,
    exportPerformanceReport, exportDailyConsumption, can
  } = props;

  return (
    <div className="space-y-6">
      {/* Date Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="2020"
              max="2030"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Quick Actions</label>
            <button
              onClick={() => {
                createOrder({
                  customerName: "Walk-in",
                  tableNumber: 1,
                  orderType: "dine-in",
                  items: []
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="inline mr-2" />New Order
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={FaUtensils}
          label="Plates Served Today"
          value={dailyPlatesServed}
          subtitle={`${dailyConsumption.length} orders`}
          color="blue"
        />
        <KPICard
          icon={FaMoneyBill}
          label="Daily Worth"
          value={`RWF ${formatAmount(dailyWorth)}`}
          subtitle="Revenue from served meals"
          color="green"
        />
        <KPICard
          icon={FaUserFriends}
          label="Active Subscribers"
          value={activeSubscribers}
          subtitle={`${props.monthlyNewSubs || 0} new this month`}
          color="purple"
        />
        <KPICard
          icon={FaChartLine}
          label="Monthly Revenue"
          value={`RWF ${formatAmount(monthlyTotalRevenue)}`}
          subtitle={`${revenueGrowthPct >= 0 ? '+' : ''}${revenueGrowthPct}% growth`}
          color={revenueGrowthPct >= 0 ? "green" : "red"}
          growth={revenueGrowthPct}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Today's Orders */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <FaClipboardList className="text-blue-500" />
            Today's Orders
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold">{orders.filter(o => sameDay(new Date(o.createdAt), new Date())).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-bold text-yellow-600">
                {orders.filter(o => o.status === "pending" && sameDay(new Date(o.createdAt), new Date())).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">
                {orders.filter(o => o.status === "completed" && sameDay(new Date(o.createdAt), new Date())).length}
              </span>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <FaWarehouse className="text-purple-500" />
            Inventory Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value</span>
              <span className="font-bold">RWF {formatAmount(inventoryValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Stock Items</span>
              <span className={`font-bold ${lowStock.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {lowStock.length}
              </span>
            </div>
            {lowStock.length > 0 && (
              <div className="text-sm text-red-600 mt-2">
                {lowStock.slice(0, 2).map(item => (
                  <div key={item.id}>• {item.name} ({item.qty} {item.unit})</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <FaChartBar className="text-green-500" />
            Top Selling Items
          </h3>
          <div className="space-y-2">
            {topSellingItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              topSellingItems.slice(0, 3).map(([name, qty], idx) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="font-bold text-gray-400">#{idx + 1}</span> {name}
                  </span>
                  <span className="font-bold">{qty}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      {can.exportReports && (
        <div className="flex gap-3">
          <button
            onClick={exportPerformanceReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaFileCsv />
            Export Performance Report
          </button>
          <button
            onClick={exportDailyConsumption}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FaDownload />
            Export Daily Consumption
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components
function KPICard({ icon: Icon, label, value, subtitle, color = "blue", growth }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${colorClasses[color]}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`text-2xl text-${color}-500`} />
          {typeof growth === "number" && (
            <span className={`text-sm font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
              {Math.abs(growth)}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Add remaining view components (OrdersView, MenuView, InventoryView, etc.)
// Due to space constraints, these would follow the same pattern as above