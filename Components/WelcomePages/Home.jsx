import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Helper: 3D tilt on hover using mouse position
 */
function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX / 3);
    y.set(relY / 3);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Loader with progress + reduced-motion friendly
 */
function LoadingScreen() {
  const shouldReduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const msgs = useMemo(
    () => [
      "Cooking up components…",
      "Sautéing state…",
      "Simmering springs…",
      "Plating pixels…",
    ],
    []
  );
  const msg = msgs[Math.min(Math.floor(progress / 25), msgs.length - 1)];

  useEffect(() => {
    const id = setInterval(
      () => setProgress((p) => Math.min(p + 2 + Math.random() * 6, 100)),
      80
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a23] text-yellow-400 relative overflow-hidden"
      style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
      aria-busy="true"
    >
      <motion.div
        className="w-40 h-40 border-4 border-yellow-400 rounded-full flex items-center justify-center relative"
        animate={shouldReduce ? {} : { rotate: 360 }}
        transition={shouldReduce ? {} : { repeat: Infinity, duration: 3, ease: "linear" }}
        style={{ boxShadow: "0 0 30px #facc15, inset 0 0 20px #facc15" }}
      >
        <div
          className="absolute w-36 h-36 border-t-4 border-yellow-400 rounded-full"
          style={{ transform: "rotate(45deg)" }}
        />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold">igifu</p>
          <div className="text-2xl" aria-hidden>🍽️</div>
        </div>
        <div className="absolute text-lg" style={{ top: "-10px", left: "45%" }} aria-hidden>
          🍴
        </div>
        <div className="absolute text-lg" style={{ bottom: "-10px", left: "45%" }} aria-hidden>
          🥄
        </div>
      </motion.div>

      <p className="mt-5 text-xs tracking-widest">{msg}</p>

      <div className="w-64 h-2 bg-yellow-900/40 rounded mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      <motion.div
        className="absolute w-60 h-60 bg-yellow-400 rounded-full opacity-20 blur-3xl"
        animate={shouldReduce ? {} : { scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        aria-hidden
      />
    </div>
  );
}

/**
 * Small testimonial slider
 */
function TestimonialSlider() {
  const items = [
    {
      quote:
        "I swapped unused meal swipes in seconds—Igifu saved my lunch budget.",
      who: "Maya • Freshman",
    },
    { quote: "Secure and easy. Dining lines feel shorter already.", who: "Owen • Senior" },
    { quote: "It’s the campus food wallet I actually use.", who: "Priya • Sophomore" },
  ];
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % items.length);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-500">What students say</h3>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            onClick={next}
            className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative h-24">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            className="absolute inset-0 bg-white/70 dark:bg-white/5 backdrop-blur rounded-xl p-4 border border-gray-200 dark:border-white/10"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              “{items[i].quote}”
            </p>
            <footer className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              — {items[i].who}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Animated stat counter
 */
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

const WelcomePage = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const shouldReduce = useReducedMotion();

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Theme persistence
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Scroll progress
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setScrollPct(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stats
  const meals = useCounter(12400, 1.6);
  const students = useCounter(3200, 1.6);
  const campuses = useCounter(28, 1.6);

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-white text-gray-800 dark:bg-[#0b0b12] dark:text-gray-100 font-sans overflow-hidden selection:bg-blue-600/20">
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"
          style={{ width: `${scrollPct}%` }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Background orbs / parallax */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.5), transparent)",
        }}
        animate={shouldReduce ? {} : { y: [0, 10, 0], x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, rgba(234,179,8,0.45), transparent)",
        }}
        animate={shouldReduce ? {} : { y: [0, -12, 0], x: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
        aria-hidden
      />

      {/* Top bar */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 pt-6">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl" aria-hidden>🍽️</span>
          <span className="font-semibold tracking-tight">Igifu</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-gray-600 dark:text-gray-300">
            Welcome 🙂
          </span>
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="rounded-full border border-gray-300 dark:border-white/20 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <Link
            to="/signup"
            className="bg-yellow-400 text-gray-900 font-semibold px-4 py-1 rounded-full shadow hover:bg-yellow-500 transition-transform active:scale-95"
            aria-label="Go to next section"
          >
            Next
          </Link>
        </div>
      </header>

      {/* Floating food emojis (micro-interactions) */}
      <div className="z-0">
        <motion.button
          className="fixed text-3xl top-16 left-6"
          onClick={() => alert("Yum! 🍔")}
          whileHover={{ scale: 1.2, rotate: 8 }}
          animate={shouldReduce ? {} : { y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          aria-label="Burger emoji"
        >
          🍔
        </motion.button>
        <motion.button
          className="fixed text-3xl bottom-28 right-6"
          onClick={() => alert("Pizza incoming! 🍕")}
          whileHover={{ scale: 1.15, rotate: -8 }}
          animate={shouldReduce ? {} : { y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          aria-label="Pizza emoji"
        >
          🍕
        </motion.button>
        <motion.button
          className="fixed text-2xl top-1/3 right-1/4"
          onClick={() => alert("Time to eat! 🍽️")}
          whileHover={{ scale: 1.15 }}
          animate={shouldReduce ? {} : { rotate: [0, 12, -12, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
          aria-label="Plate emoji"
        >
          🍽️
        </motion.button>
      </div>

      {/* Main */}
      <main id="main" className="relative z-10 flex flex-col items-center mt-10 px-6">
        {/* Hero card stack */}
        <motion.div
          className="relative mb-6 flex justify-center items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Black card (behind) */}
          <TiltCard className="absolute -rotate-6">
            <div className="w-48 h-28 bg-black rounded-2xl text-white flex flex-col justify-center items-center shadow-xl">
              <p className="text-xs opacity-70">Igifu Meal Card</p>
              <p className="text-[11px] mt-1 opacity-60">This card is expired.</p>
              <div className="mt-2 text-lg" aria-hidden>🍽️</div>
            </div>
          </TiltCard>

          {/* White main card */}
          <TiltCard className="relative rotate-6 z-10">
            <div className="w-56 h-32 bg-white dark:bg-[#0d0d18] border-2 border-gray-200 dark:border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-green-600">Buy Meals</span>
                <span className="text-red-500">Sell Meals</span>
              </div>
              <div className="grid grid-cols-7 gap-1 mt-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-white/10"
                    style={{ transform: "translateZ(24px)" }}
                  />
                ))}
              </div>
              <Link
                to="/signup"
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md py-1 text-center"
                style={{ transform: "translateZ(34px)" }}
              >
                Order
              </Link>
            </div>
          </TiltCard>
        </motion.div>

        {/* Hero heading + description */}
        <motion.h1
          className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="text-gray-800 dark:text-gray-100">
            Campus Dining Life Made{" "}
          </span>
          <motion.span
            className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#2563eb,45%,#7c3aed,65%,#10b981)]"
            animate={shouldReduce ? {} : { backgroundPositionX: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            style={{ backgroundSize: "200% 100%" }}
          >
            10× Easier
          </motion.span>
        </motion.h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-300 text-base max-w-xl">
          No more dining hassles — Igifu makes campus meals digital, fast,
          secure & stress-free. Enjoy a smarter student experience.
        </p>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-full font-semibold bg-blue-600 text-white shadow hover:shadow-lg hover:bg-blue-700 active:scale-95 transition"
          >
            Get started — it’s free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-full font-semibold border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/5 active:scale-95 transition"
          >
            Log In
          </Link>
        </div>

        {/* Feature cards row */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
          {[
            { title: "Trade instantly", body: "Post or accept offers in seconds.", emoji: "⚡️" },
            { title: "Campus-safe", body: "Verified students & secure wallet.", emoji: "🛡️" },
            { title: "Track usage", body: "See history, budgets & savings.", emoji: "📊" },
          ].map((f) => (
            <TiltCard key={f.title}>
              <motion.div
                className="h-full bg-white dark:bg-[#0d0d18] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-xl"
                whileHover={{ y: -4 }}
              >
                <div className="text-2xl mb-2" aria-hidden>{f.emoji}</div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {f.body}
                </p>
              </motion.div>
            </TiltCard>
          ))}
        </section>

        {/* Animated stats */}
        <section className="mt-10 w-full max-w-4xl grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{meals.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Meals traded</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{students.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{campuses}</div>
            <div className="text-xs text-gray-500">Campuses</div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialSlider />

        {/* Bottom spacer */}
        <div className="h-16" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center pb-6 text-gray-500 text-xs">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          © {new Date().getFullYear()} Igifu Digital Meals — All Rights Reserved 🍴
        </motion.p>
      </footer>
    </div>
  );
};

export default WelcomePage;
