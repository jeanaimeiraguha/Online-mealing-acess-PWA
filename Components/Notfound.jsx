import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaHome, FaArrowLeft, FaSearch, FaBug } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const supportMailto = `mailto:support@igifu.app?subject=Broken%20link%20report&body=I%20ran%20into%20a%20404%20at%20${encodeURIComponent(
    currentUrl
  )}`;

  const handleBack = () => navigate(-1);
  const handleSearch = (e) => {
    e.preventDefault();
    // If you add a real search route later, navigate(`/search?q=${encodeURIComponent(query)}`)
    navigate("/");
  };

  // Keyboard shortcuts: H = Home, Esc/Backspace = Back
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "h") navigate("/");
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0b0b12] dark:to-[#0e1015] text-gray-900 dark:text-gray-100 overflow-hidden px-4">
      {/* Background orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.55), transparent)",
        }}
        animate={
          prefersReducedMotion ? {} : { x: [0, 8, 0], y: [0, 10, 0] }
        }
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, rgba(234,179,8,0.45), transparent)",
        }}
        animate={
          prefersReducedMotion ? {} : { x: [0, -8, 0], y: [0, -12, 0] }
        }
        transition={{ repeat: Infinity, duration: 12 }}
      />

      {/* Floating food emojis */}
      <motion.div
        aria-hidden
        className="absolute text-4xl bottom-10 left-8"
        animate={
          prefersReducedMotion ? {} : { y: [0, -8, 0], rotate: [0, 5, -5, 0] }
        }
        transition={{ repeat: Infinity, duration: 6 }}
      >
        🍔
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute text-4xl top-10 right-10"
        animate={
          prefersReducedMotion ? {} : { y: [0, 8, 0], rotate: [0, -5, 5, 0] }
        }
        transition={{ repeat: Infinity, duration: 7 }}
      >
        🍕
      </motion.div>

      {/* Main content */}
      <main className="relative z-10 w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.h1
            className="select-none text-[5.5rem] sm:text-[7rem] md:text-[9rem] font-extrabold leading-none tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg,#ef4444,#f59e0b,#3b82f6)",
              backgroundSize: "200% 100%",
            }}
            animate={
              prefersReducedMotion ? {} : { backgroundPositionX: ["0%", "100%"] }
            }
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            404
          </motion.h1>

          <motion.p
            className="mt-1 text-2xl sm:text-3xl font-semibold"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            Page Not Found
          </motion.p>

          <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
            Oops! The page you’re looking for doesn’t exist or has moved.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-6 w-full max-w-xl mx-auto"
            role="search"
            aria-label="Site search"
          >
            <div className="flex items-stretch rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0e1015] shadow-sm focus-within:ring-2 focus-within:ring-blue-600/60">
              <span className="pl-4 flex items-center justify-center">
                <FaSearch className="text-gray-400" aria-hidden />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “MealCard”, “UR - Huye Campus”, or “Sign up”…"
                className="flex-1 bg-transparent px-3 py-3 outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                aria-label="Search query"
              />
              <button
                type="submit"
                className="m-1 px-4 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition text-sm"
            >
              <FaArrowLeft aria-hidden /> Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition text-sm"
            >
              <FaHome aria-hidden /> Go Home
            </Link>
            <a
              href={supportMailto}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-red-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition text-sm"
            >
              <FaBug aria-hidden /> Report issue
            </a>
          </div>

          {/* Quick links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
            {[
              { to: "/signup", label: "Sign Up" },
              { to: "/login", label: "Log In" },
              { to: "/", label: "Home" },
              { to: "/", label: "Browse Restaurants" },
            ].map((x) => (
              <Link
                key={x.label}
                to={x.to}
                className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-3 text-sm text-center hover:-translate-y-0.5 hover:shadow transition"
              >
                {x.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Error code: 404 • {new Date().toLocaleString()}
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFoundPage;
