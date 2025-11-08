import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell, FaClipboardCheck, FaUtensils, FaMoneyBill, FaChartLine, FaUserFriends,
  FaExclamationTriangle, FaPlus, FaBan, FaPlay, FaCheck, FaCheckDouble, FaEdit,
  FaFileCsv, FaSearch, FaBoxOpen, FaCheckCircle, FaTimes, FaCashRegister, FaCog,
  FaShoppingCart, FaClock, FaUsers, FaWarehouse, FaChartBar, FaCalendarAlt,
  FaReceipt, FaPercentage, FaArrowUp, FaArrowDown, FaSave, FaTrash
} from "react-icons/fa";

// ==================== CONSTANTS & UTILITIES ====================

const tap = { scale: 0.97 };
const pageMotion = { 
  initial: { opacity: 0, y: 16 }, 
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } }, 
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } 
};

const formatAmount = (v) => (Number(v || 0)).toLocaleString();
const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
const deepClone = (x) => JSON.parse(JSON.stringify(x));
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

// ==================== SEED DATA ====================

const seedMenu = [
  { id: uid("menu"), name: "Beans & Rice", price: 1500, category: "Main", available: true },
  { id: uid("menu"), name: "Tilapia Grill", price: 5500, category: "Main", available: true },
  { id: uid("menu"), name: "Veggie Bowl", price: 2500, category: "Main", available: true },
  { id: uid("menu"), name: "Chicken Wings", price: 4500, category: "Starter", available: true },
  { id: uid("menu"), name: "Fresh Juice", price: 1000, category: "Beverage", available: true },
];

const seedIngredients = [
  { id: uid("ing"), name: "Beans", unit: "kg", qty: 30, reorderLevel: 5, unitCost: 1800 },
  { id: uid("ing"), name: "Rice", unit: "kg", qty: 50, reorderLevel: 10, unitCost: 1200 },
  { id: uid("ing"), name: "Tilapia", unit: "kg", qty: 20, reorderLevel: 5, unitCost: 8000 },
  { id: uid("ing"), name: "Vegetables", unit: "kg", qty: 25, reorderLevel: 8, unitCost: 2000 },
  { id: uid("ing"), name: "Chicken", unit: "kg", qty: 15, reorderLevel: 5, unitCost: 5000 },
];

const seedRecipes = [
  { id: uid("rec"), menuItemName: "Beans & Rice", ing: { Beans: 0.2, Rice: 0.25 } },
  { id: uid("rec"), menuItemName: "Tilapia Grill", ing: { Tilapia: 0.35, Rice: 0.2 } },
  { id: uid("rec"), menuItemName: "Veggie Bowl", ing: { Vegetables: 0.3, Rice: 0.2 } },
  { id: uid("rec"), menuItemName: "Chicken Wings", ing: { Chicken: 0.4 } },
];

// ==================== TOAST NOTIFICATION SYSTEM ====================

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
    >
      {type === "success" && <FaCheckCircle />}
      {type === "error" && <FaTimes />}
      {type === "warning" && <FaExclamationTriangle />}
      <span>{message}</span>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function RestaurantPortalDashboard() {
  const now = new Date();
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 10);
  const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 10);

  // Core data states
  const [menu, setMenu] = useLocalStorage("rp_menu", seedMenu);
  const [ingredients, setIngredients] = useLocalStorage("rp_ingredients", seedIngredients);
  const [recipes, setRecipes] = useLocalStorage("rp_recipes", seedRecipes);
  const [stockLedger, setStockLedger] = useLocalStorage("rp_stock_ledger", []);
  const [notifications, setNotifications] = useLocalStorage("rp_notifications", []);
  const [toasts, setToasts] = useState([]);
  
  const [customers, setCustomers] = useLocalStorage("rp_customers", [
    { id: uid("c"), name: "Alice Martin", phone: "0788123456", active: true },
    { id: uid("c"), name: "Bob Williams", phone: "0788123457", active: true },
    { id: uid("c"), name: "Diana Prince", phone: "0788123458", active: false }
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
      mealsPlan: 30
    },
    { 
      id: uid("sub"), 
      customerId: customers[1]?.id, 
      customerName: "Bob Williams", 
      startDate: prevMonthDate.getTime(), 
      endDate: prevMonthDate.getTime() + 30 * 86400000, 
      status: "expired",
      amount: 35000,
      mealsPlan: 30
    },
  ]);
  
  const [orders, setOrders] = useLocalStorage("rp_orders", [
    { 
      id: uid("ord"), 
      customerName: "John Doe", 
      tableNumber: 5,
      status: "pending", 
      paid: false, 
      createdAt: Date.now() - 3600000, 
      items: [{ name: "Beans & Rice", menuItemId: null, qty: 2, unitPrice: 1500 }] 
    },
    { 
      id: uid("ord"), 
      customerName: "Jane Smith", 
      tableNumber: 3,
      status: "cooking", 
      paid: false, 
      createdAt: Date.now() - 7200000, 
      items: [{ name: "Tilapia Grill", menuItemId: null, qty: 1, unitPrice: 5500 }] 
    },
  ]);
  
  const [transactions, setTransactions] = useLocalStorage("rp_transactions", [
    { id: uid("tx"), type: "sale", amount: 1500, orderId: "seed", method: "cash", createdAt: prevMonthDate.getTime() },
    { id: uid("tx"), type: "subscription", amount: 35000, subscriptionId: "seed-sub-prev", method: "momo", createdAt: prevMonthDate.getTime() },
    { id: uid("tx"), type: "subscription", amount: 35000, subscriptionId: "seed-sub-this", method: "momo", createdAt: thisMonthDate.getTime() },
  ]);
  
  const [consumptionLog, setConsumptionLog] = useLocalStorage("rp_consumption", []);

  // UI state
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [role, setRole] = useState("manager");
  const [showNotifs, setShowNotifs] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingOrder, setEditingOrder] = useState(null);

  // Toast management
  const showToast = useCallback((message, type = "info") => {
    const id = uid("toast");
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helpers
  const calcOrderTotal = useCallback((order) => 
    order.items?.reduce((s, it) => s + Number(it.unitPrice || 0) * Number(it.qty || 0), 0) || 0
  , []);

  const monthFilterRange = useMemo(() => {
    const y = new Date().getFullYear();
    const start = new Date(y, selectedMonth, 1).getTime();
    const end = new Date(y, selectedMonth + 1, 0, 23, 59, 59).getTime();
    const prevStart = new Date(y, (selectedMonth + 11) % 12, 1);
    if (selectedMonth === 0) prevStart.setFullYear(y - 1);
    const prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 0, 23, 59, 59);
    return { start, end, prevStart: prevStart.getTime(), prevEnd: prevEnd.getTime() };
  }, [selectedMonth]);

  // Daily analytics
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

  // Monthly analytics
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

  // Subscription analytics
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

  // Inventory
  const lowStock = useMemo(() => 
    ingredients.filter(i => Number(i.qty) <= Number(i.reorderLevel))
  , [ingredients]);

  const inventoryValue = useMemo(() =>
    ingredients.reduce((sum, ing) => sum + (Number(ing.qty) * Number(ing.unitCost || 0)), 0)
  , [ingredients]);

  // Role-based permissions
  const can = {
    confirm: ["waiter", "manager"].includes(role),
    serve: ["chef", "manager"].includes(role),
    complete: ["manager", "waiter", "chef"].includes(role),
    receivePayment: ["cashier", "manager"].includes(role),
    editMenu: ["manager", "chef"].includes(role),
    stockIn: ["manager"].includes(role),
    viewAnalytics: ["manager", "cashier"].includes(role),
    manageSubscriptions: ["manager", "cashier"].includes(role),
  };

  // Order operations
  const linkMenuIds = (order) => {
    const idByName = Object.fromEntries(menu.map(m => [m.name, m.id]));
    return {
      ...order,
      items: order.items.map(it => ({ ...it, menuItemId: it.menuItemId || idByName[it.name] || null }))
    };
  };

  const deductInventoryByOrder = (order) => {
    try {
      const recipeByName = Object.fromEntries(recipes.map(r => [r.menuItemName, r.ing]));
      const ingClone = deepClone(ingredients);
      const ledger = [];

      order.items.forEach(it => {
        const rec = recipeByName[it.name];
        if (!rec) return;
        Object.entries(rec).forEach(([ingName, qtyPerPlate]) => {
          const total = qtyPerPlate * it.qty;
          const ing = ingClone.find(x => x.name === ingName);
          if (!ing) return;
          
          if (ing.qty < total) {
            showToast(`Insufficient ${ingName} stock. Required: ${total} ${ing.unit}`, "warning");
            return;
          }
          
          ing.qty = Math.max(0, Number(ing.qty) - total);
          ledger.push({ 
            id: uid("stockout"), 
            ingredient: ingName, 
            type: "out", 
            quantity: total, 
            refType: "order", 
            refId: order.id, 
            createdAt: Date.now() 
          });
        });
      });

      setIngredients(ingClone);
      setStockLedger(prev => [...ledger, ...prev]);
      checkLowStock(ingClone);
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
        `${ing.name} is running low (${ing.qty} ${ing.unit} remaining)`,
        "warning"
      );
    });
  };

  const startCooking = (orderId) => {
    if (!can.confirm) {
      showToast("Permission denied", "error");
      return;
    }
    setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, status: "cooking" }) : o));
    pushNotif("Order Confirmed", `Order ${orderId.slice(0, 8)} moved to cooking`, "info");
    showToast("Order confirmed and sent to kitchen", "success");
  };

  const markServed = (orderId) => {
    if (!can.serve) {
      showToast("Permission denied", "error");
      return;
    }
    
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const linked = linkMenuIds({ ...o, status: "served" });
      
      deductInventoryByOrder(linked);
      setConsumptionLog(prevLog => [...prevLog, {
        id: uid("cons"),
        date: new Date().toISOString().slice(0, 10),
        orderId: linked.id,
        plates: linked.items.reduce((s, i) => s + i.qty, 0),
        worth: calcOrderTotal(linked)
      }]);
      
      return linked;
    }));
    
    pushNotif("Meal Served", `Order ${orderId.slice(0, 8)} served`, "success");
    showToast("Order marked as served", "success");
  };

  const markCompleted = (orderId) => {
    if (!can.complete) {
      showToast("Permission denied", "error");
      return;
    }
    setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, status: "completed" }) : o));
    pushNotif("Order Completed", `Order ${orderId.slice(0, 8)} completed`, "success");
    showToast("Order completed successfully", "success");
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, status: "canceled" }) : o));
    pushNotif("Order Canceled", `Order ${orderId.slice(0, 8)} canceled`, "warn");
    showToast("Order canceled", "warning");
  };

  const receivePayment = (orderId, method = "cash") => {
    if (!can.receivePayment) {
      showToast("Permission denied", "error");
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      showToast("Order not found", "error");
      return;
    }
    
    const amt = calcOrderTotal(order);
    setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, paid: true }) : o));
    setTransactions(prev => [{ 
      id: uid("tx"), 
      type: "sale", 
      amount: amt, 
      orderId, 
      method, 
      createdAt: Date.now() 
    }, ...prev]);
    
    pushNotif("Payment Received", `Order ${orderId.slice(0, 8)} paid (RWF ${formatAmount(amt)})`, "success");
    showToast(`Payment of RWF ${formatAmount(amt)} received`, "success");
  };

  // Notifications
  const pushNotif = (title, message, tone = "info") => {
    setNotifications(prev => [{ 
      id: uid("notif"), 
      title, 
      message, 
      tone, 
      createdAt: Date.now(),
      read: false 
    }, ...prev].slice(0, 50)); // Keep only last 50 notifications
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("All notifications cleared", "info");
  };

  // Quick actions
  const quickNewOrder = () => {
    const availableMenu = menu.filter(x => x.available);
    if (availableMenu.length === 0) {
      showToast("No menu items available", "error");
      return;
    }
    
    const m = availableMenu[0];
    const o = {
      id: uid("ord"),
      customerName: "Walk-in Customer",
      tableNumber: Math.floor(Math.random() * 10) + 1,
      status: "pending",
      paid: false,
      createdAt: Date.now(),
      items: [{ name: m.name, menuItemId: m.id, qty: 1, unitPrice: m.price }]
    };
    
    setOrders(prev => [o, ...prev]);
    pushNotif("Order Created", `New order ${o.id.slice(0, 8)} created`, "info");
    showToast("New order created successfully", "success");
  };

  const recordSubPurchase = (amount = 35000, mealsPlan = 30) => {
    if (!can.manageSubscriptions) {
      showToast("Permission denied", "error");
      return;
    }
    
    setTransactions(prev => [{ 
      id: uid("tx"), 
      type: "subscription", 
      amount, 
      method: "momo", 
      createdAt: Date.now() 
    }, ...prev]);
    
    const cust = customers.find(c => c.active) || { id: uid("c"), name: "New Customer" };
    setSubscriptions(prev => [{ 
      id: uid("sub"), 
      customerId: cust.id, 
      customerName: cust.name, 
      startDate: Date.now(), 
      endDate: Date.now() + 30 * 86400000, 
      status: "active",
      amount,
      mealsPlan
    }, ...prev]);
    
    pushNotif("Subscription Purchase", `RWF ${formatAmount(amount)} subscription recorded`, "success");
    showToast("Subscription recorded successfully", "success");
  };

  const recordDelivery = (ingredient = "Rice", quantity = 5, unitCost = 1200) => {
    if (!can.stockIn) {
      showToast("Permission denied", "error");
      return;
    }
    
    setIngredients(prev => prev.map(i => 
      i.name === ingredient ? ({ ...i, qty: Number(i.qty) + quantity }) : i
    ));
    
    setStockLedger(prev => [{ 
      id: uid("stockin"), 
      ingredient, 
      type: "in", 
      quantity, 
      unitCost, 
      refType: "delivery", 
      refId: uid("del"), 
      createdAt: Date.now() 
    }, ...prev]);
    
    pushNotif("Stock In", `${ingredient} +${quantity}kg delivery recorded`, "info");
    showToast(`Stock updated: ${ingredient} +${quantity}kg`, "success");
  };

  const toggleMenuAvailability = (id) => {
    if (!can.editMenu) {
      showToast("Permission denied", "error");
      return;
    }
    setMenu(prev => prev.map(m => m.id === id ? ({ ...m, available: !m.available }) : m));
    showToast("Menu item updated", "success");
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
    
    setMenu(prev => prev.map(m => m.id === id ? ({ ...m, price: p }) : m));
    showToast("Price updated successfully", "success");
  };

  // Filters
  const visibleOrders = useMemo(() => 
    orders
      .filter(o => (statusFilter === "all" ? true : o.status === statusFilter))
      .filter(o => {
        if (!orderSearch.trim()) return true;
        const hay = `${o.id} ${o.customerName} ${o.items?.map(i => i.name).join(" ")}`.toLowerCase();
        return hay.includes(orderSearch.toLowerCase());
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  , [orders, statusFilter, orderSearch]);

  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  // Export functions
  const exportPerformanceReport = () => {
    const rows = [
      { metric: "Report Date", value: new Date().toISOString() },
      { metric: "Selected Date", value: selectedDate },
      { metric: "Plates Served (Day)", value: dailyPlatesServed },
      { metric: "Worth (Day)", value: `RWF ${formatAmount(dailyWorth)}` },
      { metric: "Month", value: monthNames[selectedMonth] },
      { metric: "Monthly Sales", value: `RWF ${formatAmount(monthlySales)}` },
      { metric: "Subscription Revenue", value: `RWF ${formatAmount(monthlySubRevenue)}` },
      { metric: "Total Revenue", value: `RWF ${formatAmount(monthlyTotalRevenue)}` },
      { metric: "Revenue Growth %", value: `${revenueGrowthPct}%` },
      { metric: "Active Subscribers", value: activeSubscribers },
      { metric: "New Subs (Month)", value: monthlyNewSubs },
      { metric: "Sub Growth %", value: `${subGrowthPct}%` },
      { metric: "Inventory Value", value: `RWF ${formatAmount(inventoryValue)}` },
      { metric: "Low Stock Items", value: lowStock.map(i => i.name).join("; ") || "None" },
      { metric: "Total Orders", value: orders.length },
      { metric: "Pending Orders", value: orders.filter(o => o.status === "pending").length },
    ];
    
    exportCSV(rows, `performance_${monthNames[selectedMonth]}_${selectedDate}.csv`);
    showToast("Report exported successfully", "success");
  };

  const exportInventoryReport = () => {
    const rows = ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.qty,
      unit: ing.unit,
      reorderLevel: ing.reorderLevel,
      unitCost: ing.unitCost,
      totalValue: Number(ing.qty) * Number(ing.unitCost || 0),
      status: Number(ing.qty) <= Number(ing.reorderLevel) ? "Low Stock" : "OK"
    }));
    
    exportCSV(rows, `inventory_${todayISO()}.csv`);
    showToast("Inventory report exported", "success");
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 lg:px-6 py-3 lg:py-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-xl p-2">
                <FaUtensils className="text-2xl" />
              </div>
              <div>
                <div className="text-xs opacity-90">Restaurant Management System</div>
                <div className="font-bold text-lg">Dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                <FaClock className="text-sm" />
                <span className="text-sm">{new Date().toLocaleTimeString()}</span>
              </div>
              
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="px-3 py-2 rounded-lg text-sm text-gray-900 bg-white/90 backdrop-blur"
              >
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
              </select>
              
              <button 
                onClick={() => setShowNotifs(v => !v)} 
                className="relative p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <FaBell className="text-xl" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[68px] z-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex gap-6 overflow-x-auto">
            {["dashboard", "orders", "inventory", "analytics", "customers"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 capitalize font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? "text-blue-600 border-blue-600" 
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div key="dashboard" {...pageMotion}>
            <DashboardView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              quickNewOrder={quickNewOrder}
              recordSubPurchase={recordSubPurchase}
              recordDelivery={recordDelivery}
              dailyPlatesServed={dailyPlatesServed}
              dailyWorth={dailyWorth}
              activeSubscribers={activeSubscribers}
              monthlyTotalRevenue={monthlyTotalRevenue}
              revenueGrowthPct={revenueGrowthPct}
              monthNames={monthNames}
              orders={orders}
              lowStock={lowStock}
              inventoryValue={inventoryValue}
              exportPerformanceReport={exportPerformanceReport}
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
              startCooking={startCooking}
              markServed={markServed}
              markCompleted={markCompleted}
              cancelOrder={cancelOrder}
              receivePayment={receivePayment}
              can={can}
              editingOrder={editingOrder}
              setEditingOrder={setEditingOrder}
              menu={menu}
              setOrders={setOrders}
              showToast={showToast}
            />
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div key="inventory" {...pageMotion}>
            <InventoryView
              ingredients={ingredients}
              setIngredients={setIngredients}
              menu={menu}
              setMenu={setMenu}
              recipes={recipes}
              toggleMenuAvailability={toggleMenuAvailability}
              updateMenuPrice={updateMenuPrice}
              recordDelivery={recordDelivery}
              exportInventoryReport={exportInventoryReport}
              can={can}
              showToast={showToast}
            />
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div key="analytics" {...pageMotion}>
            <AnalyticsView
              monthlyTotalRevenue={monthlyTotalRevenue}
              monthlySales={monthlySales}
              monthlySubRevenue={monthlySubRevenue}
              revenueGrowthPct={revenueGrowthPct}
              activeSubscribers={activeSubscribers}
              monthlyNewSubs={monthlyNewSubs}
              subGrowthPct={subGrowthPct}
              orders={orders}
              transactions={transactions}
              consumptionLog={consumptionLog}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              monthNames={monthNames}
              can={can}
            />
          </motion.div>
        )}

        {activeTab === "customers" && (
          <motion.div key="customers" {...pageMotion}>
            <CustomersView
              customers={customers}
              setCustomers={setCustomers}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              recordSubPurchase={recordSubPurchase}
              can={can}
              showToast={showToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="font-bold text-lg">Notifications</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
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
                  <div className="text-sm text-gray-500 p-3 text-center">
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      className={`border rounded-xl p-3 cursor-pointer transition-colors ${
                        n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold flex items-center gap-2">
                          {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                          {n.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaCog />
              <span>Role: <span className="font-bold text-gray-700">{role}</span></span>
            </div>
            <div>
              © 2024 Restaurant Management System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== VIEW COMPONENTS ====================

function DashboardView({ 
  selectedDate, setSelectedDate, selectedMonth, setSelectedMonth,
  quickNewOrder, recordSubPurchase, recordDelivery,
  dailyPlatesServed, dailyWorth, activeSubscribers, 
  monthlyTotalRevenue, revenueGrowthPct, monthNames,
  orders, lowStock, inventoryValue, exportPerformanceReport, can
}) {
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const cookingOrders = orders.filter(o => o.status === "cooking").length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Quick Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <label className="text-sm text-gray-500 block mb-2">Filter by Day</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)} 
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        
        <div className="bg-white rounded-xl border p-4">
          <label className="text-sm text-gray-500 block mb-2">Filter by Month</label>
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))} 
            className="w-full border rounded-lg px-3 py-2"
          >
            {monthNames.map((m, i) => (
              <option value={i} key={m}>{m}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-white rounded-xl border p-4">
          <label className="text-sm text-gray-500 block mb-2">Quick Actions</label>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={quickNewOrder} 
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="inline mr-1" /> Order
            </button>
            <button 
              onClick={() => recordSubPurchase(35000)} 
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              <FaUserFriends className="inline mr-1" /> Subscription
            </button>
            {can.stockIn && (
              <button 
                onClick={recordDelivery} 
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                <FaBoxOpen className="inline mr-1" /> Delivery
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard 
          icon={FaUtensils} 
          label="Plates Served (Today)" 
          value={dailyPlatesServed}
          color="blue"
        />
        <KPICard 
          icon={FaMoneyBill} 
          label="Daily Revenue" 
          value={`RWF ${formatAmount(dailyWorth)}`}
          color="green"
        />
        <KPICard 
          icon={FaUserFriends} 
          label="Active Subscribers" 
          value={activeSubscribers}
          color="purple"
        />
        <KPICard 
          icon={FaChartLine} 
          label={`${monthNames[selectedMonth]} Revenue`} 
          value={`RWF ${formatAmount(monthlyTotalRevenue)}`} 
          growth={revenueGrowthPct}
          color="indigo"
        />
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatusCard
          title="Orders Status"
          items={[
            { label: "Pending", value: pendingOrders, color: "yellow" },
            { label: "Cooking", value: cookingOrders, color: "blue" },
            { label: "Total Today", value: orders.filter(o => sameDay(new Date(o.createdAt), new Date())).length, color: "gray" }
          ]}
        />
        
        <StatusCard
          title="Inventory Status"
          items={[
            { label: "Low Stock Items", value: lowStock.length, color: lowStock.length > 0 ? "red" : "green" },
            { label: "Total Value", value: `RWF ${formatAmount(inventoryValue)}`, color: "blue" }
          ]}
        />
        
        <StatusCard
          title="Quick Stats"
          items={[
            { label: "Menu Items", value: orders.filter(o => o.status === "active").length, color: "green" },
            { label: "Customers Today", value: new Set(orders.filter(o => sameDay(new Date(o.createdAt), new Date())).map(o => o.customerName)).size, color: "blue" }
          ]}
        />
      </div>

      {/* Export Button */}
      {can.viewAnalytics && (
        <div className="flex justify-end">
          <button 
            onClick={exportPerformanceReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaFileCsv /> Export Performance Report
          </button>
        </div>
      )}
    </div>
  );
}

function OrdersView({ 
  orders, orderSearch, setOrderSearch, statusFilter, setStatusFilter,
  calcOrderTotal, startCooking, markServed, markCompleted, 
  cancelOrder, receivePayment, can, editingOrder, setEditingOrder,
  menu, setOrders, showToast
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleAddItem = (orderId) => {
    const availableMenu = menu.filter(m => m.available);
    if (availableMenu.length === 0) {
      showToast("No menu items available", "error");
      return;
    }
    
    const item = availableMenu[0];
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        items: [...o.items, {
          name: item.name,
          menuItemId: item.id,
          qty: 1,
          unitPrice: item.price
        }]
      };
    }));
    
    showToast("Item added to order", "success");
  };

  const handleRemoveItem = (orderId, itemIndex) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        items: o.items.filter((_, i) => i !== itemIndex)
      };
    }));
    
    showToast("Item removed from order", "success");
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    cooking: "bg-blue-100 text-blue-800",
    served: "bg-green-100 text-green-800",
    completed: "bg-indigo-100 text-indigo-800",
    canceled: "bg-red-100 text-red-800"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={orderSearch} 
                onChange={e => setOrderSearch(e.target.value)} 
                placeholder="Search orders by ID, customer, or items..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="cooking">Cooking</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>

          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="momo">Mobile Money</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <FaClipboardCheck className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500">
                      #{order.id.slice(0, 8)} • Table {order.tableNumber || "N/A"}
                    </div>
                    <div className="font-bold text-lg">{order.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-b py-3 my-3 max-h-32 overflow-auto">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm mb-1">
                      <span>{item.name} x{item.qty}</span>
                      <span className="font-semibold">
                        RWF {formatAmount(item.unitPrice * item.qty)}
                      </span>
                      {editingOrder === order.id && (
                        <button
                          onClick={() => handleRemoveItem(order.id, idx)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                  {editingOrder === order.id && (
                    <button
                      onClick={() => handleAddItem(order.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                    >
                      <FaPlus className="inline mr-1" /> Add Item
                    </button>
                  )}
                </div>

                {/* Total and Payment Status */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-lg">
                      RWF {formatAmount(calcOrderTotal(order))}
                    </div>
                  </div>
                  {order.paid ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <FaCheckCircle /> Paid
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Payment Required
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {order.status === "pending" && (
                    <>
                      <button 
                        disabled={!can.confirm} 
                        onClick={() => startCooking(order.id)} 
                        className={`py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${
                          can.confirm 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FaPlay className="inline mr-1" /> Confirm
                      </button>
                      
                      {!order.paid && (
                        <button 
                          disabled={!can.receivePayment} 
                          onClick={() => receivePayment(order.id, paymentMethod)} 
                          className={`py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${
                            can.receivePayment 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <FaCashRegister className="inline mr-1" /> Pay
                        </button>
                      )}
                      
                      <button 
                        onClick={() => cancelOrder(order.id)} 
                        className="col-span-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <FaBan className="inline mr-1" /> Cancel
                      </button>
                    </>
                  )}
                  
                  {order.status === "cooking" && (
                    <>
                      <button 
                        disabled={!can.serve} 
                        onClick={() => markServed(order.id)} 
                        className={`py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${
                          can.serve 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FaCheck className="inline mr-1" /> Serve
                      </button>
                      
                      <button 
                        onClick={() => cancelOrder(order.id)} 
                        className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <FaBan className="inline mr-1" /> Cancel
                      </button>
                    </>
                  )}
                  
                  {order.status === "served" && (
                    <>
                      {!order.paid && (
                        <button 
                          disabled={!can.receivePayment} 
                          onClick={() => receivePayment(order.id, paymentMethod)} 
                          className={`py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${
                            can.receivePayment 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <FaCashRegister className="inline mr-1" /> Pay
                        </button>
                      )}
                      
                      {order.paid && (
                        <button 
                          disabled={!can.complete} 
                          onClick={() => markCompleted(order.id)} 
                          className={`col-span-2 py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${
                            can.complete 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <FaCheckDouble className="inline mr-1" /> Complete
                        </button>
                      )}
                    </>
                  )}
                  
                  {(order.status === "pending" || order.status === "cooking") && (
                    <button
                      onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
                      className="col-span-2 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaEdit className="inline mr-1" /> 
                      {editingOrder === order.id ? "Done Editing" : "Edit Order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InventoryView({ 
  ingredients, setIngredients, menu, setMenu, recipes, 
  toggleMenuAvailability, updateMenuPrice, recordDelivery,
  exportInventoryReport, can, showToast
}) {
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "", unit: "kg", qty: 0, reorderLevel: 5, unitCost: 0
  });

  const handleAddIngredient = () => {
    if (!newIngredient.name) {
      showToast("Please enter ingredient name", "error");
      return;
    }
    
    setIngredients(prev => [...prev, {
      ...newIngredient,
      id: uid("ing"),
      qty: Number(newIngredient.qty),
      reorderLevel: Number(newIngredient.reorderLevel),
      unitCost: Number(newIngredient.unitCost)
    }]);
    
    setNewIngredient({ name: "", unit: "kg", qty: 0, reorderLevel: 5, unitCost: 0 });
    setShowAddIngredient(false);
    showToast("Ingredient added successfully", "success");
  };

  const updateIngredientStock = (id, qty) => {
    if (qty < 0) {
      showToast("Quantity cannot be negative", "error");
      return;
    }
    
    setIngredients(prev => prev.map(i => 
      i.id === id ? { ...i, qty: Number(qty) } : i
    ));
  };

  const lowStock = ingredients.filter(i => Number(i.qty) <= Number(i.reorderLevel));
  const inventoryValue = ingredients.reduce((sum, ing) => 
    sum + (Number(ing.qty) * Number(ing.unitCost || 0)), 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Items</div>
          <div className="text-2xl font-bold">{ingredients.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Low Stock Items</div>
          <div className="text-2xl font-bold text-red-600">{lowStock.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Inventory Value</div>
          <div className="text-2xl font-bold">RWF {formatAmount(inventoryValue)}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <button
            onClick={exportInventoryReport}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaFileCsv className="inline mr-2" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inventory Management */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg">Inventory Stock</h3>
            {can.stockIn && (
              <button
                onClick={() => setShowAddIngredient(true)}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <FaPlus className="inline mr-1" /> Add Ingredient
              </button>
            )}
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-auto">
            {ingredients.map(ing => (
              <div key={ing.id} className={`border rounded-lg p-3 ${
                Number(ing.qty) <= Number(ing.reorderLevel) ? 'bg-red-50 border-red-200' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {ing.name}
                      {Number(ing.qty) <= Number(ing.reorderLevel) && (
                        <FaExclamationTriangle className="text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Reorder at: {ing.reorderLevel} {ing.unit} • 
                      Unit cost: RWF {formatAmount(ing.unitCost || 0)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={ing.qty}
                      onChange={e => updateIngredientStock(ing.id, e.target.value)}
                      disabled={!can.stockIn}
                      className={`w-20 px-2 py-1 border rounded text-right ${
                        can.stockIn ? '' : 'bg-gray-100 cursor-not-allowed'
                      }`}
                    />
                    <span className="text-sm text-gray-500">{ing.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Management */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h3 className="font-bold text-lg">Menu Management</h3>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-auto">
            {menu.map(item => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Category: {item.category || "Main"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">Price:</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={e => updateMenuPrice(item.id, e.target.value)}
                        disabled={!can.editMenu}
                        className={`w-24 px-2 py-1 border rounded text-sm ${
                          can.editMenu ? '' : 'bg-gray-100 cursor-not-allowed'
                        }`}
                      />
                      <span className="text-sm text-gray-500">RWF</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold mb-2 ${
                      item.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </div>
                    <button
                      onClick={() => toggleMenuAvailability(item.id)}
                      disabled={!can.editMenu}
                      className={`px-3 py-1.5 rounded text-white text-xs transition-colors ${
                        can.editMenu 
                          ? (item.available 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700')
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      <AnimatePresence>
        {showAddIngredient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddIngredient(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-4">Add New Ingredient</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Name</label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={e => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Tomatoes"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newIngredient.qty}
                      onChange={e => setNewIngredient(prev => ({ ...prev, qty: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Unit</label>
                    <select
                      value={newIngredient.unit}
                      onChange={e => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Reorder Level</label>
                    <input
                      type="number"
                      value={newIngredient.reorderLevel}
                      onChange={e => setNewIngredient(prev => ({ ...prev, reorderLevel: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Unit Cost (RWF)</label>
                    <input
                      type="number"
                      value={newIngredient.unitCost}
                      onChange={e => setNewIngredient(prev => ({ ...prev, unitCost: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddIngredient}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Ingredient
                </button>
                <button
                  onClick={() => setShowAddIngredient(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsView({ 
  monthlyTotalRevenue, monthlySales, monthlySubRevenue, revenueGrowthPct,
  activeSubscribers, monthlyNewSubs, subGrowthPct,
  orders, transactions, consumptionLog,
  selectedMonth, setSelectedMonth, monthNames, can
}) {
  if (!can.viewAnalytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="bg-white rounded-xl border p-8 text-center">
          <FaBan className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">You don't have permission to view analytics</p>
        </div>
      </div>
    );
  }

  // Calculate additional analytics
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const topMenuItems = orders.reduce((acc, order) => {
    order.items?.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
    });
    return acc;
  }, {});

  const topItems = Object.entries(topMenuItems)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Month Selector */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <label className="text-sm text-gray-500 block mb-2">Select Month</label>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
          className="w-full md:w-auto px-4 py-2 border rounded-lg"
        >
          {monthNames.map((m, i) => (
            <option value={i} key={m}>{m} {new Date().getFullYear()}</option>
          ))}
        </select>
      </div>

      {/* Revenue Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <FaChartLine className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold">RWF {formatAmount(monthlyTotalRevenue)}</div>
          <div className={`text-sm font-semibold mt-2 ${
            revenueGrowthPct >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {revenueGrowthPct >= 0 ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
            {Math.abs(revenueGrowthPct)}% vs last month
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sales Revenue</span>
            <FaMoneyBill className="text-green-500" />
          </div>
          <div className="text-3xl font-bold">RWF {formatAmount(monthlySales)}</div>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round((monthlySales / (monthlyTotalRevenue || 1)) * 100)}% of total
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Subscription Revenue</span>
            <FaUserFriends className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold">RWF {formatAmount(monthlySubRevenue)}</div>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round((monthlySubRevenue / (monthlyTotalRevenue || 1)) * 100)}% of total
          </div>
        </div>
      </div>

      {/* Subscription Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500 mb-2">Active Subscribers</div>
          <div className="text-3xl font-bold">{activeSubscribers}</div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500 mb-2">New Subscriptions</div>
          <div className="text-3xl font-bold">{monthlyNewSubs}</div>
          <div className={`text-sm font-semibold mt-2 ${
            subGrowthPct >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {subGrowthPct >= 0 ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
            {Math.abs(subGrowthPct)}% growth
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500 mb-2">Avg. Subscription Value</div>
          <div className="text-3xl font-bold">
            RWF {formatAmount(monthlySubRevenue / (monthlyNewSubs || 1))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold text-lg mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / orders.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold text-lg mb-4">Top Menu Items</h3>
          <div className="space-y-3">
            {topItems.length === 0 ? (
              <p className="text-gray-500">No data available</p>
            ) : (
              topItems.map(([name, qty], idx) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                    <span>{name}</span>
                  </div>
                  <span className="font-semibold">{qty} orders</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border mt-6">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(tx => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="p-4 capitalize">{tx.type}</td>
                  <td className="p-4 font-semibold">RWF {formatAmount(tx.amount)}</td>
                  <td className="p-4 capitalize">{tx.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomersView({ 
  customers, setCustomers, subscriptions, setSubscriptions,
  recordSubPurchase, can, showToast
}) {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      showToast("Please enter customer name", "error");
      return;
    }
    
    setCustomers(prev => [...prev, {
      id: uid("c"),
      name: newCustomer.name,
      phone: newCustomer.phone,
      active: true
    }]);
    
    setNewCustomer({ name: "", phone: "" });
    setShowAddCustomer(false);
    showToast("Customer added successfully", "success");
  };

  const toggleCustomerStatus = (id) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  const activeCustomers = customers.filter(c => c.active).length;
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.status === "active").length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Customers</div>
          <div className="text-2xl font-bold">{customers.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Active Customers</div>
          <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Subscriptions</div>
          <div className="text-2xl font-bold">{totalSubscriptions}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Active Subscriptions</div>
          <div className="text-2xl font-bold text-purple-600">{activeSubscriptions}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customers List */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg">Customers</h3>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="inline mr-1" /> Add Customer
            </button>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-auto">
            {customers.map(customer => (
              <div key={customer.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.phone || "No phone"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      // ... continuing from CustomersView

                      customer.active ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {customer.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleCustomerStatus(customer.id)}
                      className={`px-3 py-1 rounded text-white text-xs transition-colors ${
                        customer.active 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {customer.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg">Subscriptions</h3>
            {can.manageSubscriptions && (
              <button
                onClick={() => recordSubPurchase(35000, 30)}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <FaPlus className="inline mr-1" /> New Subscription
              </button>
            )}
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-auto">
            {subscriptions.map(sub => (
              <div key={sub.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{sub.customerName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Plan: {sub.mealsPlan} meals • RWF {formatAmount(sub.amount)}
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sub.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.status}
                    </span>
                    {sub.status === 'expired' && can.manageSubscriptions && (
                      <button
                        onClick={() => {
                          setSubscriptions(prev => prev.map(s => 
                            s.id === sub.id 
                              ? { 
                                  ...s, 
                                  status: 'active', 
                                  startDate: Date.now(),
                                  endDate: Date.now() + 30 * 86400000
                                } 
                              : s
                          ));
                          showToast('Subscription renewed', 'success');
                        }}
                        className="mt-2 w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddCustomer(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Name</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Customer name"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0788123456"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================

function KPICard({ icon: Icon, label, value, growth, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">{label}</p>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
            <Icon className={`text-${color}-500`} />
          </div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {typeof growth === "number" && (
          <div className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
            {Math.abs(growth)}%
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, items }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className={`font-bold ${
              item.color === 'red' ? 'text-red-600' :
              item.color === 'green' ? 'text-green-600' :
              item.color === 'blue' ? 'text-blue-600' :
              item.color === 'yellow' ? 'text-yellow-600' :
              'text-gray-800'
            }`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerfTile({ label, value, helper, tone }) {
  const bgColor = tone === "up" ? "bg-green-50" : tone === "down" ? "bg-red-50" : "bg-gray-50";
  const textColor = tone === "up" ? "text-green-600" : tone === "down" ? "text-red-600" : "text-gray-800";
  
  return (
    <div className={`border rounded-xl p-4 ${bgColor}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${textColor}`}>{value}</div>
      {helper && (
        <div className="text-xs text-gray-500 mt-1">
          {helper}
        </div>
      )}
    </div>
  );
}

// ==================== CHART COMPONENTS (Optional) ====================

function MiniChart({ data, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((value, idx) => (
        <div
          key={idx}
          className="flex-1 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
          style={{
            height: `${((value - min) / range) * 100}%`,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
}

// ==================== UTILITY COMPONENTS ====================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}

function EmptyState({ icon: Icon = FaBoxOpen, title, message }) {
  return (
    <div className="text-center py-12">
      <Icon className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-xl p-6 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== ENHANCED FEATURES ====================

// Add batch operations for orders
function useBatchOperations(orders, setOrders, showToast) {
  const batchUpdateStatus = useCallback((orderIds, newStatus) => {
    setOrders(prev => prev.map(o => 
      orderIds.includes(o.id) ? { ...o, status: newStatus } : o
    ));
    showToast(`${orderIds.length} orders updated to ${newStatus}`, "success");
  }, [setOrders, showToast]);

  const batchDelete = useCallback((orderIds) => {
    setOrders(prev => prev.filter(o => !orderIds.includes(o.id)));
    showToast(`${orderIds.length} orders deleted`, "success");
  }, [setOrders, showToast]);

  return { batchUpdateStatus, batchDelete };
}

// Add search and filter hook
function useSearchFilter(items, searchFields, searchTerm) {
  return useMemo(() => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const searchText = searchFields
        .map(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value ? String(value).toLowerCase() : '';
        })
        .join(' ');
      
      return searchText.includes(term);
    });
  }, [items, searchFields, searchTerm]);
}

// ==================== EXPORT DEFAULT ====================
// The main export is already at the top of the file