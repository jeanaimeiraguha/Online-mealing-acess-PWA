import React, { useEffect, useMemo, useState } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaStar, FaUserCircle, FaCog, FaPhoneAlt,
  FaSignOutAlt, FaLock, FaUnlockAlt, FaQuestionCircle,
  FaFilter, FaHeart, FaRegHeart, FaMapMarkerAlt, FaSlidersH
} from "react-icons/fa";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function IgifuDashboard() {
  const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "No Card");
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [greeting, setGreeting] = useState("Hello");
  const [showSearch, setShowSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [toast, setToast] = useState(null);
  const [balance, setBalance] = useState(() => parseInt(localStorage.getItem("balance")) || 12400);

  // Payment & Modal States
  const [showPayment, setShowPayment] = useState(false);
  const [subMonths, setSubMonths] = useState(0.5); 
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [paymentPhone, setPaymentPhone] = useState("+250");
  const [processing, setProcessing] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [unlockProcessing, setUnlockProcessing] = useState(false);
  
  // Order States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();
  const MAX_PIN_ATTEMPTS = 3;
  const PRICE_PER_MONTH = 32000; 
  const PLATES_PER_MONTH = 60;

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("selectedCard", selectedCard);
    localStorage.setItem("balance", balance.toString());
  }, [selectedCard, balance]);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning ☀️");
    else if (hours < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // --- ANIMATION VARIANTS ---
  const tap = { scale: 0.95 };
  const hoverLift = { y: -3, transition: { duration: 0.2 } };
  const pageMotion = {
    initial: { opacity: 0, y: 15, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
  };
  const modalMotion = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2200);
  };

  // === Pages ===
  const MyIgifuPage = () => (
    <motion.section {...pageMotion} className="px-4 py-5 pb-28">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">| My Igifu</h2>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Available cards:</label>
        <select className="border border-gray-300 dark:border-white/20 bg-white dark:bg-[#0e1015] text-sm px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600/60" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
          <option>No Card</option>
          <option>Meal Card</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-5 shadow-sm">
            <div className="absolute -top-16 -right-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="flex items-center justify-between relative">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Igifu <span className="font-extrabold">MealCard</span></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedCard === "No Card" ? "No active card. Buy one to unlock all features." : "Active card detected. Enjoy cashless campus dining!"}</p>
              </div>
              <div className="shrink-0">
                <div className="rounded-full border-2 border-dashed border-blue-500/70 p-4"><FaUtensils className="text-3xl text-blue-600 dark:text-blue-400" /></div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 relative z-10">
              {selectedCard === "No Card" ? (
                <>
                  <motion.button whileTap={tap} onClick={() => setShowPayment(true)} className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">Buy Meal Card</motion.button>
                  <motion.button whileTap={tap} onClick={() => showToast("Viewing plans…", "info")} className="px-4 py-2 rounded-full border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">See Plans</motion.button>
                </>
              ) : (
                <>
                  <motion.button whileTap={tap} onClick={() => showToast("Topping up wallet…")} className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">Top Up</motion.button>
                  <motion.button whileTap={tap} onClick={() => showToast("Card settings…", "info")} className="px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">Manage</motion.button>
                </>
              )}
            </div>
            {selectedCard === "Meal Card" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">Balance: RWF {balance.toLocaleString()}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {[{ k: "Balance", v: selectedCard === "Meal Card" ? `RWF ${balance.toLocaleString()}` : "RWF 0" }, { k: "Meals", v: selectedCard === "Meal Card" ? "30" : "0" }, { k: "Savings", v: "RWF 3,150" }].map((s, i) => (
            <motion.div key={s.k} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.k}</div>
              <div className="mt-1 text-lg font-extrabold tabular-nums text-gray-900 dark:text-white">{s.v}</div>
            </motion.div>
          ))}
        </div> */}
      </div>

      {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ l: "Scan to Pay", i: <FaWallet /> }, { l: "History", i: <FaEllipsisH /> }, { l: "Offers", i: <FaGift /> }, { l: "Support", i: <FaPhoneAlt /> }].map((a, i) => (
          <motion.button key={a.l} whileHover={hoverLift} whileTap={tap} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.05) }} onClick={() => showToast(`${a.l} coming soon`, "info")} className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-4 text-left shadow-sm hover:shadow-md transition-all">
            <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">{a.i}</div>
            <div className="font-semibold text-gray-900 dark:text-white">{a.l}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Tap to open</div>
          </motion.button>
        ))}
      </div> */}
    </motion.section>
  );

  // --- HIGHLY INTERACTIVE RESTOZ PAGE ---
  const RestozPage = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    // Mock data with more meta-info for icons
    const restaurants = [
      { id: 1, name: "UR - Nyarugenge Cafeteria", desc: "Daily local specials", rating: 4.5, dist: "0.2km", isFav: false, tags: ["Buffet", "Budget"], image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80" },
      { id: 2, name: "UR - Huye Campus Canteen", desc: "Student buffet & grill", rating: 4.2, dist: "1.5km", isFav: true, tags: ["Grill", "Fast"], image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80" },
      { id: 3, name: "RP - IPRC Kigali Mess", desc: "Fast meals & drinks", rating: 4.0, dist: "0.8km", isFav: false, tags: ["Drinks", "Snacks"], image: "https://images.unsplash.com/photo-1620899605011-1a6b20b0be63?w=400&q=80" },
      { id: 4, name: "RP - Tumba Bistro", desc: "Tasty lunch with Wi-Fi", rating: 4.8, dist: "0.1km", isFav: false, tags: ["Wi-Fi", "Coffee"], image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63?w=400&q=80" },
    ];
    
    const filters = ["All", "⭐ Top Rated", "📍 Near Me", "❤️ Saved", "🥗 Veg"];

    // Simple local state to toggle hearts for demo
    const [localRestos, setLocalRestos] = useState(restaurants);
    const toggleFav = (id) => {
      setLocalRestos(prev => prev.map(r => r.id === id ? {...r, isFav: !r.isFav} : r));
      showToast("Favorites updated", "info");
    };

    return (
      <motion.section {...pageMotion} className="px-4 py-4 pb-28">
        {/* Sticky Header with Search & Filters */}
        <div className="sticky top-[110px] z-20 bg-[#f5f8ff] dark:bg-[#0b0b12] pt-2 pb-4 -mx-4 px-4 transition-colors duration-300">
           <div className="flex items-center justify-between mb-3">
             <div>
               <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                 🍽️ Restaurants <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">{localRestos.length}</span>
               </h2>
               <p className="text-xs text-gray-500 dark:text-gray-400">Discover student favorites</p>
             </div>
             <motion.button whileTap={tap} className="p-2 bg-white dark:bg-[#1a1d25] rounded-full shadow-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
               <FaSlidersH />
             </motion.button>
           </div>

           {/* Search Input */}
           <div className="relative mb-3">
             <FaSearch className="absolute left-3 top-3.5 text-gray-400"/>
             <input type="text" placeholder="Search for meals or canteens..." className="w-full py-3 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#1a1d25] border border-gray-200 dark:border-white/10 focus:border-blue-500 outline-none transition-colors dark:text-white shadow-sm"/>
           </div>

           {/* Scrollable Filters */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
             {filters.map(f => (
               <motion.button key={f} whileTap={tap} onClick={()=>setActiveFilter(f)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilter === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-[#1a1d25] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}>
                 {f}
               </motion.button>
             ))}
           </div>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {localRestos.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-[#1a1d25] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex sm:flex-row flex-col relative">
              {/* Favorite Toggle (Absolute) */}
              <motion.button whileTap={{ scale: 0.8 }} onClick={()=>toggleFav(r.id)} className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 dark:bg-black/60 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                {r.isFav ? <FaHeart className="text-red-500"/> : <FaRegHeart className="text-gray-600 dark:text-gray-300"/>}
              </motion.button>

              <div className="sm:w-32 h-36 sm:h-auto relative">
                 <img src={r.image} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight pr-8">{r.name}</h3>
                  {/* Meta Icons Row */}
                  <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-1.5 py-0.5 rounded-md">
                      <FaStar className="text-[10px]"/> {r.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400"/> {r.dist}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-1">{r.desc}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Tags */}
                  <div className="flex gap-1">
                    {r.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-md">{tag}</span>
                    ))}
                  </div>
                  <motion.button whileTap={tap} onClick={() => handleOrder(r)} disabled={selectedCard !== "Meal Card"} className="bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 disabled:shadow-none">
                    Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  };

  // --- OTHER PAGES ---
  const EarnPage = () => <motion.section {...pageMotion} className="px-4 py-6"><h2 className="font-bold text-lg text-gray-900 dark:text-white">🎁 Earn Rewards (Coming Soon)</h2></motion.section>;
  const LoansPage = () => <motion.section {...pageMotion} className="px-4 py-6"><h2 className="font-bold text-lg text-gray-900 dark:text-white">💰 Student Loans (Coming Soon)</h2></motion.section>;
  const MorePage = () => (
    <motion.section {...pageMotion} className="px-4 py-6">
       <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">⚙️ Settings</h2>
       <div className="bg-white dark:bg-[#0e1015] rounded-2xl p-4 border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-sm">
        <span className="font-medium text-gray-800 dark:text-gray-100">Dark Mode</span>
        <motion.button whileTap={tap} onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
          <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm" />
        </motion.button>
      </div>
    </motion.section>
  );

  // --- HANDLERS ---
  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate network
    setProcessing(false);
    const amount = subMonths * PRICE_PER_MONTH;
    setBalance(p => p + amount);
    showToast("Payment successful!", "success");
    setShowPayment(false);
    setShowUnlockModal(true);
  };

  const handleUnlock = async () => {
    if (pin.length < 4) return showToast("Enter 4-digit PIN", "warn");
    setUnlockProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    setUnlockProcessing(false);
    if (pin === "1234") {
       setSelectedCard("Meal Card"); setShowUnlockModal(false); setPin("");
       setActivePage("Restoz"); showToast("Unlocked! 🎉", "success");
    } else {
       setPinAttempts(p => p + 1); setPin(""); showToast("Wrong PIN", "warn");
    }
  };

  const handleOrder = (r) => {
    if (selectedCard !== "Meal Card") return showToast("Unlock Meal Card first", "warn");
    setSelectedRestaurant(r); setShowOrderModal(true);
  };

  const handleOrderPlacement = async () => {
     setOrderProcessing(true);
     await new Promise(r => setTimeout(r, 1500));
     setBalance(b => b - (orderQty * 1500));
     setOrderProcessing(false);
     setShowOrderModal(false);
     showToast(`Ordered ${orderQty} meals!`, "success");
  }

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#f5f8ff] text-[#1a1a1a] dark:bg-[#0b0b12] dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <motion.div whileTap={tap} className="text-2xl bg-white/10 p-2 rounded-full">🍽️</motion.div>
          <div><div className="text-xs opacity-90">{greeting}</div><div className="text-sm font-bold">RichGuy</div></div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileTap={tap} onClick={() => setShowSearch(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><FaSearch /></motion.button>
          <motion.button whileTap={tap} onClick={() => setShowInbox(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
            <FaBell /><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-blue-600" />
          </motion.button>
        </div>
      </header>

      {/* Ticker */}
      <div className="bg-[#ffcd00] text-black px-4 py-2 text-sm font-bold shadow-sm flex items-center gap-2 sticky top-[72px] z-20">
        <span className="w-2 h-2 rounded-full bg-black/70 animate-pulse" />
        <span className="truncate">| What’s new? Weekly bonus & new partner restaurants</span>
      </div>

      {/* Main */}
      <main className="flex-1 z-10">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
          {activePage === "Restoz" && <RestozPage key="restoz" />}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0e1015]/90 backdrop-blur-md shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/5 py-2 z-40">
        <div className="flex justify-around">
          {[{n:"MyIgifu",i:<FaWallet/>},{n:"Restoz",i:<FaUtensils/>},{n:"Earn",i:<FaGift/>},{n:"Loans",i:<FaMoneyBill/>},{n:"More",i:<FaEllipsisH/>}].map(t => {
            const isActive = activePage === t.n;
            return (
              <motion.button key={t.n} onClick={() => setActivePage(t.n)} whileTap={tap} className={`flex flex-col items-center p-2 relative ${isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400"}`}>
                <span className="text-xl mb-0.5">{t.i}</span>
                <span className="text-[10px] font-bold">{t.n}</span>
                {isActive && <motion.div layoutId="nav_pill" className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full" />}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* === MODALS === */}
      <AnimatePresence>
        {/* PAYMENT MODAL */}
        {showPayment && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !processing && setShowPayment(false)}>
            <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-md bg-[#181a20] rounded-3xl p-6 text-white shadow-2xl border border-white/5">
              <h3 className="text-center text-xl font-extrabold mb-6 tracking-tight">Confirm your Igifu purchase</h3>
              <div className="flex items-center justify-center gap-3 mb-8">
                 <span className="font-bold mr-1 text-gray-300">Quantity:</span>
                 <motion.button whileTap={tap} onClick={()=>setSubMonths(m=>m+0.5)} className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-green-500/20">+</motion.button>
                 <div className="bg-[#262a34] px-4 h-12 flex items-center justify-center rounded-xl font-bold min-w-[110px] text-lg border border-white/5">{subMonths} Month</div>
                 <motion.button whileTap={tap} onClick={()=>setSubMonths(m=>Math.max(0.5, m-0.5))} className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-500/20">−</motion.button>
                 <FaQuestionCircle className="text-yellow-400 ml-1 opacity-80"/>
              </div>
              <div className="space-y-3 mb-6 px-2 bg-[#1c1f26] p-4 rounded-2xl border border-white/5">
                 <div className="flex justify-between text-sm font-medium"><span className="text-gray-400">Quantity (Plates):</span><span className="font-bold">{subMonths * PLATES_PER_MONTH}</span></div>
                 <div className="flex justify-between text-sm font-medium"><span className="text-gray-400">Price (frw):</span><span className="font-bold">{(subMonths * PRICE_PER_MONTH).toLocaleString()}</span></div>
                 <div className="flex justify-between text-sm font-medium"><span className="text-gray-400">% Fee (frw):</span><span className="font-bold text-green-400">0</span></div>
                 <div className="h-px bg-white/10 my-2"/>
                 <div className="flex justify-between text-lg font-extrabold"><span className="text-yellow-400">Total (frw) :</span><span className="text-yellow-400">{(subMonths * PRICE_PER_MONTH).toLocaleString()}</span></div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-3 mb-1.5 block uppercase tracking-wider">Pay with</label>
                  <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="w-full h-14 px-4 bg-[#262a34] rounded-2xl border-r-[16px] border-transparent outline-none font-bold text-gray-200 focus:ring-2 focus:ring-yellow-400/50 transition-all">
                    <option>MTN Mobile Money</option><option>Airtel Money</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-3 mb-1.5 block uppercase tracking-wider">Payment number</label>
                  <input type="tel" value={paymentPhone} onChange={e=>setPaymentPhone(e.target.value)} className="w-full h-14 px-4 bg-[#262a34] rounded-2xl outline-none font-bold placeholder-gray-500 text-gray-200 focus:ring-2 focus:ring-yellow-400/50 transition-all" placeholder="+250"/>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mb-6">By paying, I agree to <span className="text-yellow-400 underline">Terms</span> and <span className="text-yellow-400 underline">Privacy</span></p>
              <div className="flex gap-3">
                <motion.button whileTap={tap} onClick={()=>setShowPayment(false)} className="flex-1 h-14 bg-[#991b1b] hover:bg-[#7f1d1d] rounded-2xl font-bold text-lg transition-colors">Cancel</motion.button>
                <motion.button whileTap={tap} onClick={handlePay} disabled={processing} className="flex-[1.5] h-14 bg-[#65a30d] hover:bg-[#4d7c0f] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-green-500/20">
                  {processing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : `Pay ${(subMonths * PRICE_PER_MONTH).toLocaleString()}Rwf`}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Unlock Modal */}
        {showUnlockModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-sm bg-[#181a20] rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
               <FaLock className="text-5xl text-yellow-400 mx-auto mb-4"/>
               <h3 className="text-2xl font-black text-white mb-2">Unlock Card</h3>
               <input type="password" value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} maxLength={4} autoFocus className="w-full h-16 text-center text-4xl font-mono tracking-[1em] bg-black/40 rounded-2xl border-2 border-white/10 focus:border-yellow-400 text-white outline-none mb-6 transition-colors"/>
               <motion.button whileTap={tap} onClick={handleUnlock} disabled={unlockProcessing} className="w-full h-14 bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-2">{unlockProcessing ? "..." : "UNLOCK"}</motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Order Modal */}
        {showOrderModal && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setShowOrderModal(false)}>
             <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-[#181a20] rounded-3xl p-6 shadow-xl">
               <h3 className="text-xl font-bold dark:text-white mb-4">Order at {selectedRestaurant?.name}</h3>
               <div className="flex items-center justify-between bg-gray-100 dark:bg-[#262a34] p-4 rounded-2xl mb-4">
                 <span className="font-bold dark:text-white">Meals:</span>
                 <div className="flex items-center gap-3">
                   <motion.button whileTap={tap} onClick={()=>setOrderQty(q=>Math.max(1,q-1))} className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold dark:text-white">−</motion.button>
                   <span className="text-xl font-black dark:text-white w-8 text-center">{orderQty}</span>
                   <motion.button whileTap={tap} onClick={()=>setOrderQty(q=>q+1)} className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">+</motion.button>
                 </div>
               </div>
               <div className="mb-6 text-sm dark:text-gray-300 flex justify-between font-medium"><span>Total Cost:</span><span className="font-bold text-blue-600 dark:text-blue-400">{(orderQty*1500).toLocaleString()} Rwf</span></div>
               <motion.button whileTap={tap} onClick={handleOrderPlacement} disabled={orderProcessing} className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center">{orderProcessing ? "..." : "CONFIRM ORDER"}</motion.button>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{y:50,opacity:0,scale:0.9}} animate={{y:0,opacity:1,scale:1}} exit={{y:20,opacity:0,scale:0.9}} className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl font-bold text-white flex items-center gap-2 ${toast.tone==='warn'?'bg-red-500':'bg-green-600'}`}>
            {toast.tone==='warn'?'⚠️':'✅'} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// cool but add other features and allow user to seach restaurent also use google map to see reastaurent location and things in relate like that but i ask you to create it well and more profficient to which it will attract intentive of users and more freindly
























// import React, { useEffect, useMemo, useState } from "react";
// import {
//   FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
//   FaEllipsisH, FaStar, FaUserCircle, FaCog, FaPhoneAlt,
//   FaSignOutAlt, FaLock, FaUnlockAlt, FaQuestionCircle,
//   FaFilter, FaHeart, FaRegHeart, FaMapMarkerAlt, FaSlidersH,
//   FaListUl, FaMapMarkedAlt, FaTimes, FaInfoCircle, FaMotorcycle, FaClock, FaStarHalfAlt
// } from "react-icons/fa";
// import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// export default function IgifuDashboard() {
//   // --- GLOBAL STATE ---
//   const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "No Card");
//   const [activePage, setActivePage] = useState("MyIgifu");
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
//   const [greeting, setGreeting] = useState("Hello");
//   const [showInbox, setShowInbox] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [balance, setBalance] = useState(() => parseInt(localStorage.getItem("balance")) || 12400);

//   // --- PAYMENT & SECURITY STATE ---
//   const [showPayment, setShowPayment] = useState(false);
//   const [subMonths, setSubMonths] = useState(0.5); 
//   const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
//   const [paymentPhone, setPaymentPhone] = useState("+250");
//   const [processing, setProcessing] = useState(false);
//   const [showUnlockModal, setShowUnlockModal] = useState(false);
//   const [pin, setPin] = useState("");
//   const [unlockProcessing, setUnlockProcessing] = useState(false);
  
//   // --- RESTAURANT & ORDER STATE ---
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [detailRestaurant, setDetailRestaurant] = useState(null); // For the full detail view
//   const [orderQty, setOrderQty] = useState(1);
//   const [orderProcessing, setOrderProcessing] = useState(false);
  
//   const PRICE_PER_MONTH = 32000; 
//   const PLATES_PER_MONTH = 60;

//   // --- MOCK DATA ---
//   // Extended restaurant data for the new features
//   const RESTAURANTS_DATA = [
//     { 
//       id: 1, name: "UR - Nyarugenge Cafeteria", desc: "Daily local specials & buffet", rating: 4.5, reviews: 128, dist: "0.2km", time: "10-15 min", isFav: false, tags: ["Buffet", "Budget"], 
//       image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80",
//       coords: { top: '40%', left: '30%' }, // Simulated map coordinates
//       menu: [
//         { n: "Student Buffet", p: 1500, d: "Rice, beans, veg, 1 meat" },
//         { n: "Special Plate", p: 2500, d: "Chips, chicken, salad" }
//       ],
//       hours: "07:00 - 21:00", address: "KN 73 St, Near Main Hall"
//     },
//     { 
//       id: 2, name: "UR - Huye Campus Canteen", desc: "Student buffet & grill zone", rating: 4.2, reviews: 84, dist: "1.5km", time: "20-30 min", isFav: true, tags: ["Grill", "Fast"], 
//       image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80",
//       coords: { top: '60%', left: '70%' },
//       menu: [
//         { n: "Grilled Chicken", p: 3000, d: "Half chicken with spices" },
//         { n: "Beef Skewers (Brochette)", p: 1000, d: "Per stick" }
//       ],
//       hours: "08:00 - 22:00", address: "University Ave, Huye Complex"
//     },
//     { 
//       id: 3, name: "RP - IPRC Kigali Mess", desc: "Fast meals, cold drinks & snacks", rating: 4.0, reviews: 56, dist: "0.8km", time: "5-10 min", isFav: false, tags: ["Drinks", "Snacks"], 
//       image: "https://images.unsplash.com/photo-1620899605011-1a6b20b0be63?w=600&q=80",
//       coords: { top: '20%', left: '50%' },
//       menu: [
//         { n: "Chapati & Beans", p: 1200, d: "Quick energy meal" },
//         { n: "Fresh Juice", p: 800, d: "Passion, Mango, or Cocktail" }
//       ],
//       hours: "07:00 - 20:00", address: "KK 15 Rd, Kicukiro"
//     },
//     { 
//       id: 4, name: "RP - Tumba Bistro", desc: "Tasty lunch with free high-speed Wi-Fi", rating: 4.8, reviews: 210, dist: "0.1km", time: "5 min", isFav: false, tags: ["Wi-Fi", "Coffee"], 
//       image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63?w=600&q=80",
//       coords: { top: '75%', left: '25%' },
//       menu: [
//         { n: "Bistro Burger", p: 3500, d: "Beef patty, cheese, bistro sauce" },
//         { n: "Iced Latte", p: 1800, d: "Double shot espresso" }
//       ],
//       hours: "09:00 - 23:00", address: "Rulindo, Tumba Main Block"
//     },
//   ];

//   // --- EFFECTS ---
//   useEffect(() => {
//     localStorage.setItem("selectedCard", selectedCard);
//     localStorage.setItem("balance", balance.toString());
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [selectedCard, balance, darkMode]);

//   useEffect(() => {
//     const hours = new Date().getHours();
//     if (hours < 12) setGreeting("Good Morning ☀️");
//     else if (hours < 18) setGreeting("Good Afternoon 🌤️");
//     else setGreeting("Good Evening 🌙");
//   }, []);

//   // --- COMMON ANIMATIONS ---
//   const tap = { scale: 0.95 };
//   const pageMotion = {
//     initial: { opacity: 0, y: 15 },
//     animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
//     exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
//   };
//   const modalMotion = {
//     initial: { opacity: 0, scale: 0.95, y: 40 },
//     animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
//     exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } }
//   };

//   const showToast = (message, tone = "success") => {
//     setToast({ message, tone });
//     setTimeout(() => setToast(null), 2500);
//   };

//   // =========================================
//   // PAGE: MY IGIFU (Wallet)
//   // =========================================
//   const MyIgifuPage = () => (
//     <motion.section {...pageMotion} className="px-4 py-5 pb-28">
//        <div className="flex items-center justify-between mb-4">
//          <h2 className="text-lg font-bold text-gray-900 dark:text-white">| My Igifu</h2>
//          <select className="bg-gray-100 dark:bg-[#1a1d25] border-0 text-sm px-3 py-1.5 rounded-full font-medium text-gray-700 dark:text-gray-300 outline-none" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
//             <option>No Card</option><option>Meal Card</option>
//          </select>
//        </div>

//        {/* Glassmorphism Card */}
//        <div className="relative overflow-hidden rounded-[2rem] p-6 min-h-[200px] flex flex-col justify-between shadow-2xl shadow-blue-500/20 mb-6">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
//           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mt-10 -mr-10 blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -mb-10 -ml-10 blur-2xl"></div>
          
//           <div className="relative z-10 flex justify-between items-start text-white">
//              <div>
//                <p className="text-blue-100 font-medium mb-1 flex items-center gap-1"><FaWallet className="opacity-70"/> Balance</p>
//                <h3 className="text-4xl font-black tracking-tight">
//                  {selectedCard === "Meal Card" ? <>{balance.toLocaleString()}<span className="text-lg opacity-80 font-medium ml-1">RWF</span></> : "---"}
//                </h3>
//              </div>
//              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl border border-white/10"><FaUtensils /></div>
//           </div>

//           <div className="relative z-10 mt-6 flex items-end justify-between">
//             <div>
//                <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${selectedCard === "Meal Card" ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-red-500/20 text-red-100 border border-red-400/30'}`}>
//                  {selectedCard === "Meal Card" ? "● ACTIVE" : "● INACTIVE"}
//                </div>
//             </div>
//             {selectedCard === "No Card" ? (
//               <motion.button whileTap={tap} onClick={() => setShowPayment(true)} className="px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-lg flex items-center gap-2 text-sm">Buy Card</motion.button>
//             ) : (
//               <motion.button whileTap={tap} onClick={() => showToast("Top up coming soon", "info")} className="px-5 py-2.5 bg-blue-500/40 border border-white/20 backdrop-blur-md text-white font-bold rounded-xl flex items-center gap-2 text-sm">Top Up</motion.button>
//             )}
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {[{ l: "Meals Left", v: selectedCard === "Meal Card" ? "30" : "-" }, { l: "Spent", v: "16k" }, { l: "Saved", v: "3.2k" }].map((s, i) => (
//             <motion.div key={i} whileTap={tap} className="bg-white dark:bg-[#1a1d25] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center">
//               <span className="text-lg font-black text-gray-900 dark:text-white">{s.v}</span>
//               <span className="text-[10px] text-gray-500 font-bold uppercase">{s.l}</span>
//             </motion.div>
//           ))}
//         </div>

//         {/* Actions Grid */}
//         <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
//         <div className="grid grid-cols-4 gap-3">
//           {[{ n: "Scan", i: <FaQuestionCircle/>, c: "bg-blue-100 text-blue-600" }, { n: "Send", i: <FaMoneyBill/>, c: "bg-green-100 text-green-600" }, { n: "Vouchers", i: <FaGift/>, c: "bg-purple-100 text-purple-600" }, { n: "Support", i: <FaPhoneAlt/>, c: "bg-orange-100 text-orange-600" }].map((a, i) => (
//             <motion.button key={i} whileTap={tap} onClick={() => showToast(`${a.n} coming soon`, "info")} className="flex flex-col items-center gap-2">
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${a.c} dark:bg-opacity-20 shadow-sm`}>{a.i}</div>
//               <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{a.n}</span>
//             </motion.button>
//           ))}
//         </div>
//     </motion.section>
//   );

//   // =========================================
//   // PAGE: RESTOZ (Pro Version)
//   // =========================================
//   const RestozPage = () => {
//     const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
//     const [activeFilter, setActiveFilter] = useState("All");
//     const [localRestos, setLocalRestos] = useState(RESTAURANTS_DATA);

//     // Filter Logic
//     const filteredRestos = useMemo(() => {
//       return localRestos.filter(r => {
//         const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.desc.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchesFilter = activeFilter === "All" || (activeFilter === "❤️ Saved" && r.isFav) || (activeFilter === "⭐ Top Rated" && r.rating >= 4.5) || r.tags.includes(activeFilter);
//         return matchesSearch && matchesFilter;
//       });
//     }, [localRestos, searchQuery, activeFilter]);

//     const toggleFav = (id, e) => {
//       e.stopPropagation();
//       setLocalRestos(prev => prev.map(r => r.id === id ? {...r, isFav: !r.isFav} : r));
//       showToast("Favorites updated", "info");
//     };

//     // Simulated Map View Component
//     const MapView = () => (
//       <div className="relative w-full h-[65vh] bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-inner border border-gray-200 dark:border-white/5 mt-4">
//         {/* Fake Map Background - In a real app, this would be Google Maps */}
//         <div className="absolute inset-0 opacity-60 dark:opacity-40 bg-[url('https://i.pinimg.com/originals/57/60/33/57603362b1a91a5b80f9fe23a47ec683.png')] bg-cover bg-center grayscale-[30%]"></div>
        
//         {/* Interactive Pins */}
//         {filteredRestos.map(r => (
//           <motion.button
//             key={r.id}
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             whileHover={{ scale: 1.2 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setDetailRestaurant(r)}
//             style={{ top: r.coords.top, left: r.coords.left }}
//             className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center"
//           >
//             <div className="bg-white dark:bg-[#1a1d25] px-2 py-1 rounded-md text-[10px] font-bold shadow-md mb-1 whitespace-nowrap dark:text-white max-w-[80px] truncate">{r.name}</div>
//             <FaMapMarkerAlt className="text-3xl text-red-500 drop-shadow-lg" />
//           </motion.button>
//         ))}

//         {/* User Location Pin (Fake) */}
//         <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
//       </div>
//     );

//     return (
//       <motion.section {...pageMotion} className="px-4 py-2 pb-28 relative min-h-screen">
//         {/* Sticky Header: Search, View Toggle, Filters */}
//         <div className="sticky top-[76px] z-20 bg-[#f5f8ff] dark:bg-[#0b0b12] pt-3 pb-2 -mx-4 px-4">
//            {/* Search & View Toggle Row */}
//            <div className="flex gap-3 mb-3">
//              <div className="relative flex-1">
//                <FaSearch className="absolute left-4 top-4 text-gray-400"/>
//                <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-[#1a1d25] border border-gray-200 dark:border-white/10 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm font-medium"/>
//                {searchQuery && <button onClick={()=>setSearchQuery("")} className="absolute right-4 top-4 text-gray-400"><FaTimes/></button>}
//              </div>
//              {/* View Toggle Button */}
//              <motion.button whileTap={tap} onClick={() => setViewMode(m => m === 'list' ? 'map' : 'list')} className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-sm border transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-[#1a1d25] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10'}`}>
//                 {viewMode === 'list' ? <FaMapMarkedAlt/> : <FaListUl/>}
//              </motion.button>
//            </div>

//            {/* Scrollable Filters */}
//            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
//              {["All", "⭐ Top Rated", "📍 Near Me", "❤️ Saved", "Buffet", "Fast", "Wi-Fi"].map(f => (
//                <motion.button key={f} whileTap={tap} onClick={()=>setActiveFilter(f)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilter === f ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-[#1a1d25] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'}`}>
//                  {f}
//                </motion.button>
//              ))}
//            </div>
//         </div>

//         {/* Content Area */}
//         <AnimatePresence mode="wait">
//           {viewMode === 'map' ? (
//             <motion.div key="map" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><MapView/></motion.div>
//           ) : (
//             <motion.div key="list" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 gap-4 mt-2">
//               {filteredRestos.length === 0 ? (
//                  <div className="text-center py-10 text-gray-400 flex flex-col items-center">
//                    <FaSearch className="text-4xl mb-3 opacity-50"/>
//                    <p>No restaurants found for "{searchQuery}"</p>
//                  </div>
//               ) : (
//                 filteredRestos.map((r, i) => (
//                   <motion.div key={r.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setDetailRestaurant(r)} className="bg-white dark:bg-[#1a1d25] rounded-[20px] p-3 shadow-sm border border-gray-100 dark:border-white/5 flex gap-3 relative active:scale-[0.98] transition-transform cursor-pointer">
//                     {/* Image */}
//                     <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0">
//                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
//                        {r.isFav && <div className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"><FaHeart className="text-white text-[8px]"/></div>}
//                     </div>
//                     {/* Info */}
//                     <div className="flex-1 flex flex-col justify-center">
//                       <div className="flex justify-between items-start">
//                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{r.name}</h3>
//                          <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-md">
//                            <FaStar/> {r.rating}
//                          </div>
//                       </div>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{r.desc}</p>
//                       {/* Meta tags */}
//                       <div className="flex items-center gap-3 mt-3 text-xs font-medium text-gray-400">
//                          <span className="flex items-center gap-1"><FaMapMarkerAlt/> {r.dist}</span>
//                          <span className="flex items-center gap-1"><FaClock/> {r.time}</span>
//                       </div>
//                     </div>
//                     {/* Fav Button */}
//                     <motion.button whileTap={tap} onClick={(e)=>toggleFav(r.id, e)} className="absolute bottom-3 right-3 w-8 h-8 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
//                        {r.isFav ? <FaHeart className="text-red-500"/> : <FaRegHeart/>}
//                     </motion.button>
//                   </motion.div>
//                 ))
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.section>
//     );
//   };

//   // =========================================
//   // NEW: RESTAURANT DETAIL FULL MODAL
//   // =========================================
//   const RestaurantDetailModal = ({ r, onClose }) => {
//     const [activeTab, setActiveTab] = useState("Menu");
//     return (
//       <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-white dark:bg-[#0b0d13] overflow-y-auto">
//         {/* Header Image with Parallax-like feel */}
//         <div className="relative h-64">
//            <img src={r.image} className="w-full h-full object-cover" alt={r.name} />
//            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] to-transparent opacity-80"></div>
//            {/* Top Nav */}
//            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center">
//              <motion.button whileTap={tap} onClick={onClose} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white"><FaTimes/></motion.button>
//              <div className="flex gap-3">
//                <motion.button whileTap={tap} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white"><FaRegHeart/></motion.button>
//              </div>
//            </div>
//            {/* Title Block */}
//            <div className="absolute bottom-0 inset-x-0 p-5">
//              <h2 className="text-2xl font-extrabold text-white leading-tight">{r.name}</h2>
//              <div className="flex items-center gap-4 mt-2 text-white/80 text-sm font-medium">
//                 <span className="flex items-center gap-1"><FaStar className="text-yellow-400"/> {r.rating} ({r.reviews})</span>
//                 <span className="flex items-center gap-1"><FaMotorcycle/> {r.time}</span>
//                 <span className="flex items-center gap-1"><FaMapMarkerAlt/> {r.dist}</span>
//              </div>
//            </div>
//         </div>

//         {/* Content Container */}
//         <div className="bg-white dark:bg-[#0b0d13] rounded-t-3xl -mt-4 relative z-10 px-5 pt-6 min-h-screen">
//            {/* Tabs */}
//            <div className="flex border-b border-gray-100 dark:border-white/10 mb-6">
//              {["Menu", "Info & Map", "Reviews"].map(t => (
//                <button key={t} onClick={()=>setActiveTab(t)} className={`flex-1 pb-3 text-sm font-bold relative ${activeTab===t ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
//                  {t}
//                  {activeTab===t && <motion.div layoutId="detail_tab" className="absolute bottom-0 inset-x-4 h-[3px] bg-blue-600 dark:bg-blue-400 rounded-t-full"/>}
//                </button>
//              ))}
//            </div>

//            {/* Tab Content */}
//            <AnimatePresence mode="wait">
//              {activeTab === "Menu" && (
//                <motion.div key="menu" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4 pb-32">
//                  <h3 className="font-bold text-lg dark:text-white">Popular Items</h3>
//                  {r.menu.map((item, i) => (
//                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a1d25] rounded-2xl border border-gray-100 dark:border-white/5">
//                      <div>
//                        <h4 className="font-bold dark:text-white">{item.n}</h4>
//                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.d}</p>
//                        <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">{item.p.toLocaleString()} Rwf</p>
//                      </div>
//                      <motion.button whileTap={tap} onClick={()=>{setSelectedRestaurant(r); setShowOrderModal(true);}} className="px-4 py-2 bg-white dark:bg-black rounded-xl text-sm font-bold shadow-sm border dark:border-white/10 dark:text-white">
//                        Add +
//                      </motion.button>
//                    </div>
//                  ))}
//                </motion.div>
//              )}

//              {activeTab === "Info & Map" && (
//                <motion.div key="info" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-6 pb-32">
//                   {/* Simulated Static Map */}
//                   <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative border border-gray-200 dark:border-white/10">
//                      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/57/60/33/57603362b1a91a5b80f9fe23a47ec683.png')] bg-cover bg-center grayscale-[20%] opacity-70"></div>
//                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full flex flex-col items-center">
//                         <FaMapMarkerAlt className="text-4xl text-red-600 drop-shadow-md"/>
//                         <div className="bg-white dark:bg-black px-3 py-1 rounded-full text-xs font-bold shadow-md mt-1 dark:text-white">{r.name}</div>
//                      </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="flex gap-4 items-start">
//                       <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><FaMapMarkerAlt/></div>
//                       <div><h4 className="font-bold dark:text-white">Address</h4><p className="text-sm text-gray-500 dark:text-gray-400">{r.address}</p></div>
//                     </div>
//                     <div className="flex gap-4 items-start">
//                       <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><FaClock/></div>
//                       <div><h4 className="font-bold dark:text-white">Opening Hours</h4><p className="text-sm text-gray-500 dark:text-gray-400">{r.hours}</p><p className="text-xs text-green-500 font-bold mt-1">Open Now</p></div>
//                     </div>
//                   </div>
//                </motion.div>
//              )}

//              {activeTab === "Reviews" && (
//                <motion.div key="reviews" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4 pb-32 text-center text-gray-500 py-10">
//                  <FaStar className="text-5xl text-gray-200 dark:text-gray-800 mx-auto mb-4"/>
//                  <p>Reviews coming soon!</p>
//                </motion.div>
//              )}
//            </AnimatePresence>
//         </div>

//         {/* Floating Action Button for Quick Order */}
//         <div className="fixed bottom-6 inset-x-6 z-50">
//            <motion.button whileTap={tap} onClick={()=>{setSelectedRestaurant(r); setShowOrderModal(true);}} className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
//              <FaUtensils/> Quick Order Here
//            </motion.button>
//         </div>
//       </motion.div>
//     );
//   };

//   // --- HANDLERS ---
//   const handlePay = async () => {
//     setProcessing(true); await new Promise(r => setTimeout(r, 1500)); setProcessing(false);
//     setBalance(p => p + (subMonths * PRICE_PER_MONTH)); showToast("Payment successful!");
//     setShowPayment(false); setShowUnlockModal(true);
//   };
//   const handleUnlock = async () => {
//     if (pin.length < 4) return showToast("Enter 4-digit PIN", "warn");
//     setUnlockProcessing(true); await new Promise(r => setTimeout(r, 1000)); setUnlockProcessing(false);
//     if (pin === "1234") { setSelectedCard("Meal Card"); setShowUnlockModal(false); setPin(""); showToast("Unlocked! 🎉"); } 
//     else { setPinAttempts(p => p + 1); setPin(""); showToast("Wrong PIN", "warn"); }
//   };
//   const handleOrderPlacement = async () => {
//      setOrderProcessing(true); await new Promise(r => setTimeout(r, 1500)); setOrderProcessing(false);
//      setBalance(b => b - (orderQty * 1500)); setShowOrderModal(false); setDetailRestaurant(null); showToast(`Ordered ${orderQty} meals!`);
//   }

//   return (
//     <div className="min-h-screen font-sans flex flex-col bg-[#f5f8ff] text-[#1a1a1a] dark:bg-[#0b0b12] dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
//       {/* Main App Header */}
//       <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
//         <div className="flex items-center gap-3">
//           <motion.div whileTap={tap} className="text-2xl bg-white/10 p-2 rounded-full">🍽️</motion.div>
//           <div><div className="text-xs opacity-90">{greeting}</div><div className="text-sm font-bold">RichGuy</div></div>
//         </div>
//         <div className="flex items-center gap-3">
//           <motion.button whileTap={tap} className="p-2 rounded-full bg-white/10"><FaSearch/></motion.button>
//           <motion.button whileTap={tap} className="p-2 rounded-full bg-white/10 relative"><FaBell/><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-blue-600"/></motion.button>
//         </div>
//       </header>

//       {/* Ticker */}
//       <div className="bg-[#ffcd00] text-black px-4 py-2 text-sm font-bold shadow-sm flex items-center gap-2 sticky top-[72px] z-20">
//         <span className="w-2 h-2 rounded-full bg-black/70 animate-pulse"/> <span className="truncate">| What’s new? Weekly bonus & new partner restaurants</span>
//       </div>

//       <main className="flex-1 z-10">
//         <AnimatePresence mode="wait">
//           {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
//           {activePage === "Restoz" && <RestozPage key="restoz" />}
//           {/* Simple placeholders for others */}
//           {["Earn", "Loans", "More"].includes(activePage) && <motion.div key="ph" {...pageMotion} className="p-10 text-center text-gray-400 font-bold">{activePage} Coming Soon</motion.div>}
//         </AnimatePresence>
//       </main>

//       {/* Bottom Nav */}
//       <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0e1015]/90 backdrop-blur-md shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/5 py-2 z-40">
//         <div className="flex justify-around">
//           {[{n:"MyIgifu",i:<FaWallet/>},{n:"Restoz",i:<FaUtensils/>},{n:"Earn",i:<FaGift/>},{n:"Loans",i:<FaMoneyBill/>},{n:"More",i:<FaEllipsisH/>}].map(t => {
//             const isActive = activePage === t.n;
//             return <motion.button key={t.n} onClick={()=>setActivePage(t.n)} whileTap={tap} className={`flex flex-col items-center p-2 relative ${isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400"}`}><span className="text-xl mb-0.5">{t.i}</span><span className="text-[10px] font-bold">{t.n}</span>{isActive && <motion.div layoutId="nav_pill" className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full"/>}</motion.button>
//           })}
//         </div>
//       </nav>

//       {/* === MODALS & OVERLAYS === */}
//       <AnimatePresence>
//         {/* FULL SCREEN RESTAURANT DETAIL */}
//         {detailRestaurant && <RestaurantDetailModal r={detailRestaurant} onClose={()=>setDetailRestaurant(null)} />}

//         {/* PAYMENT MODAL (Existing perfect match) */}
//         {showPayment && (
//           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>!processing && setShowPayment(false)}>
//             <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-md bg-[#181a20] rounded-3xl p-6 text-white shadow-2xl border border-white/5">
//               <h3 className="text-center text-xl font-extrabold mb-6">Confirm Purchase</h3>
//               {/* [Keeping your exact payment modal structure here for brevity, it's the same as previous correct version] */}
//                <div className="flex items-center justify-center gap-3 mb-8">
//                  <span className="font-bold mr-1 text-gray-300">Quantity:</span>
//                  <motion.button whileTap={tap} onClick={()=>setSubMonths(m=>m+1)} className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">+</motion.button>
//                  <div className="bg-[#262a34] px-4 h-12 flex items-center justify-center rounded-xl font-bold min-w-[110px] text-lg border border-white/5">{subMonths} Month</div>
//                  <motion.button whileTap={tap} onClick={()=>setSubMonths(m=>Math.max(0.5, m-0.5))} className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">−</motion.button>
//               </div>
//               <div className="flex gap-3"><motion.button whileTap={tap} onClick={()=>setShowPayment(false)} className="flex-1 h-14 bg-[#991b1b] rounded-2xl font-bold">Cancel</motion.button><motion.button whileTap={tap} onClick={handlePay} disabled={processing} className="flex-[1.5] h-14 bg-[#65a30d] rounded-2xl font-bold flex items-center justify-center">{processing ? "..." : `Pay ${(subMonths*PRICE_PER_MONTH).toLocaleString()}`}</motion.button></div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* UNLOCK MODAL */}
//         {showUnlockModal && (
//            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
//              <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-sm bg-[#181a20] rounded-3xl p-8 text-center border border-white/10">
//                 <FaLock className="text-5xl text-yellow-400 mx-auto mb-4"/><h3 className="text-2xl font-black text-white mb-6">Unlock Card</h3>
//                 <input type="password" value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} maxLength={4} autoFocus className="w-full h-16 text-center text-4xl font-mono tracking-[1em] bg-black/40 rounded-2xl border-2 border-white/10 focus:border-yellow-400 text-white outline-none mb-6"/>
//                 <motion.button whileTap={tap} onClick={handleUnlock} className="w-full h-14 bg-yellow-400 text-black font-black rounded-xl">UNLOCK</motion.button>
//              </motion.div>
//            </motion.div>
//         )}

//         {/* QUICK ORDER MODAL */}
//         {showOrderModal && (
//            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setShowOrderModal(false)}>
//              <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-[#181a20] rounded-3xl p-6 shadow-xl">
//                <h3 className="text-xl font-bold dark:text-white mb-4">Order at {selectedRestaurant?.name}</h3>
//                <div className="flex items-center justify-between bg-gray-100 dark:bg-[#262a34] p-4 rounded-2xl mb-4">
//                  <span className="font-bold dark:text-white">Meals:</span>
//                  <div className="flex items-center gap-3">
//                    <motion.button whileTap={tap} onClick={()=>setOrderQty(q=>Math.max(1,q-1))} className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold dark:text-white">−</motion.button>
//                    <span className="text-xl font-black dark:text-white w-8 text-center">{orderQty}</span>
//                    <motion.button whileTap={tap} onClick={()=>setOrderQty(q=>q+1)} className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">+</motion.button>
//                  </div>
//                </div>
//                <motion.button whileTap={tap} onClick={handleOrderPlacement} disabled={orderProcessing} className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center">{orderProcessing ? "..." : `CONFIRM • ${(orderQty*1500).toLocaleString()} Rwf`}</motion.button>
//              </motion.div>
//            </motion.div>
//         )}

//         {/* TOAST */}
//         {toast && <motion.div initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-full shadow-2xl font-bold text-white flex items-center gap-2 ${toast.tone==='warn'?'bg-red-500':'bg-green-600'}`}>{toast.tone==='warn'?'⚠️':'✅'} {toast.message}</motion.div>}
//       </AnimatePresence>
//     </div>
//   );
// }