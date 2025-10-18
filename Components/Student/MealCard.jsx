import React, { useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaSearch,
  FaUtensils,
  FaWallet,
  FaGift,
  FaMoneyBill,
  FaEllipsisH,
  FaStar,
  FaUserCircle,
  FaCog,
  FaPhoneAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * NOTE: Make sure Tailwind has dark mode enabled:
 * tailwind.config.js -> module.exports = { darkMode: "class", ... }
 */

export default function IgifuDashboard() {
  const [selectedCard, setSelectedCard] = useState("No Card");
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [greeting, setGreeting] = useState("Hello");
  const [showSearch, setShowSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [toast, setToast] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  // Greeting + default page
  useEffect(() => {
    setActivePage("MyIgifu");
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning ☀️");
    else if (hours < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  // Persist theme to <html> + localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Simple toast helper
  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2200);
  };

  // Shared page animation
  const pageMotion = {
    initial: { opacity: 0, y: 14, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  // === Pages ===
  const MyIgifuPage = () => (
    <motion.section {...pageMotion} className="px-4 py-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        | My Igifu
      </h2>

      {/* Card picker */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available cards:
        </label>
        <select
          className="border border-gray-300 dark:border-white/20 bg-white dark:bg-[#0e1015] text-sm px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
        >
          <option>No Card</option>
          <option>Meal Card</option>
        </select>
      </div>

      {/* Card / Empty state */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Primary card module */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-5">
            <div className="absolute -top-16 -right-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="flex items-center justify-between relative">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Igifu <span className="font-extrabold">MealCard</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedCard === "No Card"
                    ? "No active card. Buy one to unlock all features."
                    : "Active card detected. Enjoy cashless campus dining!"}
                </p>
              </div>
              <div className="shrink-0">
                <div className="rounded-full border-2 border-dashed border-blue-500/70 p-4">
                  <FaUtensils className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Card actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {selectedCard === "No Card" ? (
                <>
                  <button
                    onClick={() => showToast("Opening card purchase…")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition"
                  >
                    Buy Meal Card
                  </button>
                  <button
                    onClick={() => showToast("Viewing plans…", "info")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/5 active:scale-95 transition"
                  >
                    See Plans
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => showToast("Topping up wallet…")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition"
                  >
                    Top Up
                  </button>
                  <button
                    onClick={() => showToast("Card settings…", "info")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition"
                  >
                    Manage
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {[
            { k: "Balance", v: "RWF 12,400" },
            { k: "Meals", v: "32" },
            { k: "Savings", v: "RWF 3,150" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 text-center"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.k}
              </div>
              <div className="mt-1 text-lg font-extrabold tabular-nums">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Scan to Pay", icon: <FaWallet /> },
          { label: "History", icon: <FaEllipsisH /> },
          { label: "Offers", icon: <FaGift /> },
          { label: "Support", icon: <FaPhoneAlt /> },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => showToast(`${a.label} coming soon`, "info")}
            className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-4 text-left hover:-translate-y-0.5 hover:shadow transition"
          >
            <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">
              {a.icon}
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {a.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Tap to open
            </div>
          </button>
        ))}
      </div>
    </motion.section>
  );

  const handleOrder = (restaurantName) => {
    showToast(`Order placed at ${restaurantName} ✅`);
  };

  const RestozPage = () => {
    const restaurants = [
      {
        name: "UR - Nyarugenge Cafeteria",
        desc: "Delicious local meals every day.",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      {
        name: "UR - Huye Campus Canteen",
        desc: "Affordable student buffet options.",
        image:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      {
        name: "RP - IPRC Kigali Mess",
        desc: "Fast meals and cold drinks.",
        image:
          "https://images.unsplash.com/photo-1620899605011-1a6b20b0be63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      {
        name: "RP - Tumba Bistro",
        desc: "Tasty lunch and free Wi‑Fi corner.",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
    ];

    return (
      <motion.section {...pageMotion} className="px-4 py-6">
        <h2 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
          🍽️ Partner Restaurants
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
          Discover RP & UR student favorites accepting Igifu MealCards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurants.map((r, i) => (
            <motion.div
              key={i}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              className="bg-white dark:bg-[#0e1015] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              <img
                src={r.image}
                alt={r.name}
                className="w-full md:w-36 h-28 md:h-auto object-cover"
                loading="lazy"
              />
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {r.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {r.desc}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleOrder(r.name)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 active:scale-95 transition"
                  >
                    Order Now
                  </button>
                  <button
                    onClick={() => showToast("Added to favorites ❤️")}
                    className="border border-gray-300 dark:border-white/20 px-3 py-1.5 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  };

  const EarnPage = () => (
    <motion.section {...pageMotion} className="px-4 py-6">
      <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
        🎁 Earn Rewards
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Earn loyalty points every time you use your Igifu Card.
      </p>

      <div className="rounded-2xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-1">Weekly Bonus</h3>
        <p className="text-sm/relaxed opacity-95">
          Spend RWF 5,000+ this week and earn <b>5% cashback!</b>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { k: "Points", v: "1,280" },
          { k: "Level", v: "Gold" },
          { k: "Streak", v: "7 days" },
        ].map((x) => (
          <div
            key={x.k}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 text-center"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {x.k}
            </div>
            <div className="mt-1 text-lg font-extrabold tabular-nums">
              {x.v}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
    </motion.section>
  );

  const LoansPage = () => (
    <motion.section {...pageMotion} className="px-4 py-6">
      <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
        💰 Student Loans
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Need a meal? Get short‑term credit repayable after recharge.
      </p>

      <div className="rounded-2xl border border-green-200 dark:border-emerald-900/40 bg-green-50 dark:bg-emerald-950/20 p-5">
        <h3 className="text-green-700 dark:text-emerald-300 font-semibold">
          Instant Loan
        </h3>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
          Borrow up to RWF 10,000 for your next meal.
        </p>
        <button
          onClick={() => showToast("Loan request submitted ✅")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 active:scale-95 transition"
        >
          Apply Now
        </button>
      </div>
    </motion.section>
  );

  const MorePage = () => (
    <motion.section {...pageMotion} className="px-4 py-6">
      <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
        ⚙️ More Options
      </h2>

      {/* Profile card */}
      <div className="w-full max-w-sm mx-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-b from-gray-900 to-gray-800 text-white text-center p-6 shadow">
        <FaUserCircle className="text-5xl mx-auto mb-2 opacity-90" />
        <p className="font-semibold">RichGuy</p>
        <p className="text-sm opacity-80 mb-3">User ID: IGF-24589</p>
        <button
          onClick={() => showToast("Profile editor coming soon", "info")}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-300 active:scale-95 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Preferences */}
      <div className="w-full max-w-sm mx-auto mt-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-4 flex items-center justify-between">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          Dark Mode
        </span>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((d) => !d)}
            className="sr-only"
            aria-label="Toggle dark mode"
          />
          <span
            className={`w-10 h-6 rounded-full p-1 transition ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block h-4 w-4 bg-white rounded-full transition ${
                darkMode ? "translate-x-4" : ""
              }`}
            />
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {darkMode ? "On" : "Off"}
          </span>
        </label>
      </div>

      {/* Meta */}
      <div className="w-full max-w-sm mx-auto mt-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-4">
        <FaPhoneAlt className="inline text-blue-600 dark:text-blue-400 mr-2" />
        Contact Support: <span className="font-semibold">+250 788.....</span>
      </div>
      <div className="w-full max-w-sm mx-auto mt-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-4">
        <FaCog className="inline text-gray-500 dark:text-gray-300 mr-2" />
        App Version: <span className="font-semibold">v1.4.2</span>
      </div>

      <button
        onClick={() => showToast("Logged out 👋", "warn")}
        className="mt-4 w-full max-w-sm mx-auto bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 active:scale-95 transition flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </motion.section>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Restoz":
        return <RestozPage />;
      case "Earn":
        return <EarnPage />;
      case "MyIgifu":
        return <MyIgifuPage />;
      case "Loans":
        return <LoansPage />;
      case "More":
        return <MorePage />;
      default:
        return <MyIgifuPage />;
    }
  };

  // Fake notifications
  const notifications = useMemo(
    () => [
      { id: 1, text: "Weekly bonus unlocked — 5% cashback 🎉" },
      { id: 2, text: "New partner: RP - Tumba Bistro" },
      { id: 3, text: "Your MealCard is expiring soon" },
    ],
    []
  );

  const tabs = useMemo(
    () => [
      { name: "Restoz", icon: <FaUtensils /> },
      { name: "Earn", icon: <FaGift /> },
      { name: "MyIgifu", icon: <FaWallet /> },
      { name: "Loans", icon: <FaMoneyBill /> },
      { name: "More", icon: <FaEllipsisH /> },
    ],
    []
  );

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#f5f8ff] text-[#1a1a1a] dark:bg-[#0b0b12] dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow">
        <div className="flex items-center gap-3">
          <div className="text-2xl" aria-hidden>🍽️</div>
          <div className="leading-tight">
            <div className="text-xs opacity-90">{greeting}</div>
            <div className="text-sm font-semibold flex items-center">
              RichGuy
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            onClick={() => setShowSearch(true)}
            className="relative p-2 rounded-full hover:bg-white/10 active:scale-95"
          >
            <FaSearch className="text-lg" />
          </button>
          <button
            aria-label="Notifications"
            onClick={() => setShowInbox(true)}
            className="relative p-2 rounded-full hover:bg-white/10 active:scale-95"
          >
            <FaBell className="text-lg" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-300 rounded-full ring-2 ring-blue-600" />
          </button>
        </div>
      </header>

      {/* What's new ticker */}
      <div className="bg-[#ffcd00] text-black px-4 py-2 text-sm font-medium shadow flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-black/70 animate-pulse" />
        <span className="truncate">| What’s new? Weekly bonus & new partner restaurants</span>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="mt-auto bg-white dark:bg-[#0e1015] shadow-inner border-t border-gray-200 dark:border-white/10">
        <div className="relative flex justify-around py-2">
          {tabs.map((tab) => {
            const active = activePage === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActivePage(tab.name)}
                className={`relative flex flex-col items-center justify-center px-3 py-1 text-xs transition ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <div className="text-lg mb-1">{tab.icon}</div>
                <span>{tab.name}</span>

                {/* Animated underline / dot */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Search sheet */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="w-full sm:w-[34rem] bg-white dark:bg-[#0e1015] border border-gray-200 dark:border-white/10 rounded-t-2xl sm:rounded-2xl p-4"
            >
              <div className="flex items-center gap-2">
                <FaSearch className="text-gray-500 dark:text-gray-400" />
                <input
                  autoFocus
                  placeholder="Search restaurants, meals, offers…"
                  className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Buffet", "Vegetarian", "Budget", "Near me"].map((chip) => (
                  <button
                    key={chip}
                    className="px-3 py-1.5 rounded-full text-xs border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
                    onClick={() => showToast(`Searching "${chip}"`, "info")}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inbox panel */}
      <AnimatePresence>
        {showInbox && (
          <motion.aside
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInbox(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="ml-auto h-full w-[20rem] bg-white dark:bg-[#0e1015] border-l border-gray-200 dark:border-white/10 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <button
                  onClick={() => setShowInbox(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Close
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f1218] p-3 text-sm"
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm shadow-lg ${
              toast.tone === "success"
                ? "bg-emerald-600 text-white"
                : toast.tone === "warn"
                ? "bg-amber-500 text-black"
                : "bg-blue-600 text-white"
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            role="status"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
