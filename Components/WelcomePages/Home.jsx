import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

// ... (useCounter, TiltCard, LoadingScreen, and other utility components remain the same) ...
// ... I will skip pasting them here to save space, but they are still part of the file.

function useCounter(target = 0, duration = 1.2) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      setValue(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX / 4);
    y.set(relY / 4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

function LoadingScreen() {
  const shouldReduce = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <motion.div
        className="relative z-10 mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl"
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <span className="text-5xl">🍽️</span>
        </motion.div>
      </motion.div>
      <motion.h1
        className="text-4xl font-bold text-white mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Igifu
      </motion.h1>
      <motion.p
        className="text-white/80 text-sm mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Your Digital Meal Card
      </motion.p>
      <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-white via-slate-200 to-white"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.p
        className="mt-4 text-white/60 text-xs"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading your experience...
      </motion.p>
    </motion.div>
  );
}

function IgifuDigitalCard({ startBalance = 25000, name = "Student Name" }) {
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const balance = useCounter(startBalance, 1.5);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {!shouldReduce && (
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-slate-500/20 to-indigo-500/20 rounded-3xl blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      )}
      <motion.div
        className="relative cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative w-full aspect-[1.6/1] rounded-3xl"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              }}
              animate={shouldReduce ? {} : {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  <span className="text-lg font-bold tracking-wide">igifu</span>
                </div>
                <motion.div
                  className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold"
                  animate={shouldReduce ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Active
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-9 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)",
                  }}
                  animate={shouldReduce ? {} : { rotateY: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={shouldReduce ? {} : { opacity: [0.6, 1, 0.6] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-80 mb-1">Available Balance</div>
                <motion.div
                  className="text-3xl sm:text-4xl font-bold tracking-tight"
                  key={balance}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  RWF {balance.toLocaleString()}
                </motion.div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] opacity-70 mb-1">CARDHOLDER</div>
                  <div className="text-sm font-semibold">{name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-70 mb-1">VALID THRU</div>
                  <div className="text-sm font-semibold">12/26</div>
                </div>
              </div>
            </div>
            {!shouldReduce && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
            )}
          </div>
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
              <div className="w-40 h-40 bg-white rounded-2xl mb-4 flex items-center justify-center">
                <div className="w-36 h-36 bg-black rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          Math.random() > 0.5 ? "bg-white" : "bg-black"
                        } rounded-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Scan to Pay</h3>
              <p className="text-sm text-gray-400 text-center">
                Show this code at any campus restaurant
              </p>
              <div className="mt-6 text-xs text-gray-500">
                Card ID: IG-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/signup')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Get This Card Free
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          Already Have Card?
        </motion.button>
      </div>
      <motion.p
        className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click card to flip • Hover for effects
      </motion.p>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
    >
      <TiltCard>
        <div className="h-full bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, avatar, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{author}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCounter({ value, label, suffix = "", prefix = "" }) {
  const count = useCounter(value, 2);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-center"
    >
      <motion.div
        className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"
        whileHover={{ scale: 1.1 }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
        {label}
      </div>
    </motion.div>
  );
}

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const shouldReduce = useReducedMotion();
  // HINDURA: State yo gucunga ifungurwa n'ifungwa rya menu kuri mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  
  // HINDURA: Iyo menu ya mobile ifunguye, scroll ntiba igikunda
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-500">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-violet-500 origin-left z-50"
        style={{ scaleX }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={shouldReduce ? {} : { x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"
          animate={shouldReduce ? {} : { x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
          animate={shouldReduce ? {} : { scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 25 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }}>
                <span className="text-3xl">🍽️</span>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  igifu
                </span>
              </motion.div>
            </Link>

            {/* HINDURA: Links zigaragara kuri desktop gusa */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Reviews
              </a>
            </div>

            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle theme">
                {theme === "dark" ? "🌙" : "☀️"}
              </motion.button>
              
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')} className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                Log In
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signup')} className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-all">
                Get Started
              </motion.button>

              {/* HINDURA: Akabuto ka Hamburger menu kagaragara kuri mobile gusa */}
              <div className="md:hidden">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg"
                  aria-label="Open menu"
                >
                  <motion.div animate={isMenuOpen ? "open" : "closed"}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                      <motion.path
                        variants={{ closed: { d: "M 2 5 L 22 5" }, open: { d: "M 5 19 L 19 5" } }}
                        strokeWidth="2" strokeLinecap="round"
                      />
                      <motion.path
                        d="M 2 12 L 22 12"
                        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                        transition={{ duration: 0.1 }}
                        strokeWidth="2" strokeLinecap="round"
                      />
                      <motion.path
                        variants={{ closed: { d: "M 2 19 L 22 19" }, open: { d: "M 5 5 L 19 19" } }}
                        strokeWidth="2" strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* HINDURA: Mobile Menu yose */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg"
          >
            <div className="h-full flex flex-col items-center justify-center gap-8">
              {['Features', 'How It Works', 'Reviews'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-slate-800 dark:text-slate-200"
                >
                  {item}
                </a>
              ))}
              <div className="w-full px-8 mt-8 flex flex-col gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full text-lg font-medium px-4 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 transition-colors">
                  Log In
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} className="w-full text-lg font-medium px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HINDURA: `lg:grid-cols-2` bisobanura ko kuri telefone biba inkingi imwe, kuri desktop bikaba ebyiri */}
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                New: Instant Card Activation
              </motion.div>
              
              {/* HINDURA: Ubunini bw'inyandiko bugiye buhinduka (text-4xl kuri phone ntoya) */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Your Campus, One Card
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                The smartest way to pay for meals on campus. Load money instantly,
                tap to pay anywhere, and track every purchase.
              </p>

              {/* HINDURA: `flex-col sm:flex-row` bituma kuri phone amabuton ajya hejuru y'ayandi */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all text-lg">
                  Get Your Free Card →
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-slate-700 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition-all text-lg">
                  I Have a Card
                </motion.button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {["👨", "👩", "🧑", "👨‍🦱"].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">3,200+ students</div>
                  <div className="text-gray-600 dark:text-gray-400">already using Igifu</div>
                </div>
              </div>
            </motion.div>
            <motion.div id="demo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <IgifuDigitalCard startBalance={25000} name="Alex Student" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* HINDURA: `md:grid-cols-3` bituma kuri phone biba inkingi imwe, kuri tablet bikaba 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
            <StatCounter value={12400} label="Meals Served" suffix="+" />
            <StatCounter value={3200} label="Active Students" suffix="+" />
            <StatCounter value={28} label="Campus Partners" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Designed for students, by students. Simple, fast, and secure.
            </p>
          </motion.div>
          {/* HINDURA: Izi nkingi nazo zirahinduka hashingiwe na screen */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon="⚡" title="Instant Top-Up" description="Add money to your card in seconds via mobile money or bank transfer. No waiting, no hassle." color="from-amber-400 to-orange-500" delay={0} />
            <FeatureCard icon="💳" title="Tap & Pay" description="Just tap your card at any campus restaurant. Contactless, secure, and lightning-fast." color="from-sky-400 to-cyan-500" delay={0.1} />
            <FeatureCard icon="📊" title="Smart Insights" description="Track your spending with beautiful charts. Set budgets and get alerts." color="from-violet-500 to-fuchsia-500" delay={0.2} />
            <FeatureCard icon="🔒" title="Bank-Level Security" description="Your money is protected with military-grade encryption and fraud detection." color="from-emerald-400 to-teal-500" delay={0.3} />
            <FeatureCard icon="🎁" title="Rewards Program" description="Earn points with every purchase and redeem for free meals and discounts." color="from-rose-400 to-pink-500" delay={0.4} />
            <FeatureCard icon="💝" title="Share Meals" description="Gift meals to friends with one tap. Spread the love and help each other out." color="from-indigo-500 to-violet-600" delay={0.5} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              You'll be eating with your Igifu card in under 2 minutes
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[ { step: "01", title: "Sign Up Free", description: "Create your account with just your student email. No credit check, no fees.", icon: "✍️", }, { step: "02", title: "Get Your Card", description: "Receive your digital card instantly. Physical card arrives in 2-3 days.", icon: "📲", }, { step: "03", title: "Start Eating", description: "Load money and start using your card at any campus restaurant immediately.", icon: "🍽️", }, ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-transparent dark:border-slate-700">
                {/* HINDURA: `left-4 md:left-8` kugira ngo kuri phone ntikajye ku ruhande cyane */}
                <div className="absolute -top-6 left-6 md:left-8 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ... (Testimonials, CTA, and Footer sections also use responsive classes like md:grid-cols-3, sm:flex-row, etc. which are already well-implemented) ... */}
      <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Loved by Thousands of Students
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              See what your peers are saying about Igifu
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard quote="I used to carry cash everywhere. Now I just tap my phone and I'm done. Game changer!" author="Sarah K." role="Computer Science, Year 3" avatar="SK" delay={0} />
            <TestimonialCard quote="The budgeting feature saved me from overspending. I actually have money left at the end of the month now!" author="Michael O." role="Business, Year 2" avatar="MO" delay={0.1} />
            <TestimonialCard quote="Being able to share meals with my friends when they're low on cash is amazing. We look out for each other." author="Priya M." role="Engineering, Year 4" avatar="PM" delay={0.2} />
          </div>
        </div>
      </section>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Campus Dining?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already using Igifu. Get your free digital
              card today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signup')} className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold shadow-2xl hover:shadow-3xl transition-all text-lg">
                Get Started Free →
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-bold hover:bg-white/10 transition-all text-lg">
                Login to My Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          {/* HINDURA: `space-y-10 md:space-y-0` byongera umwanya kuri phone gusa */}
          <div className="grid md:grid-cols-4 gap-8 space-y-10 md:space-y-0">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <span className="text-xl font-bold">igifu</span>
              </div>
              <p className="text-slate-400 text-sm">
                The smart campus meal card for the modern student.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">Sign Up</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} Igifu. All rights reserved. Made with 💙 for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;