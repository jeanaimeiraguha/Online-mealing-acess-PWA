import React, { useState } from "react";
import {
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaHome,
  FaCashRegister,
  FaWallet,
  FaHandHoldingUsd,
  FaBars,
} from "react-icons/fa";

const IgifuMealCard = () => {
  const [selectedCard, setSelectedCard] = useState("No Card");

  const emojis = ["🍔", "🍕", "🍱", "🍗", "🥗", "🍩", "🎉", "🍛"];

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] flex flex-col pb-24 font-sans overflow-hidden">
      {/* Floating Emoji Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {emojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float opacity-30 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main Content (above background) */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-[#1E70F5] text-white rounded-b-3xl px-4 py-4 flex justify-between items-center shadow-md">
          <div>
            <h2 className="text-sm">
              Hello ✌️, <span className="font-bold text-lg">RichGuy</span>
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full flex items-center">
              <FaSearch className="mr-1" /> Search
            </button>
            <button className="bg-yellow-400 text-black p-2 rounded-full animate-bounce">
              <FaBell />
            </button>
            <button className="bg-white text-[#1E70F5] flex items-center px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100">
              <FaSignOutAlt className="mr-1" /> Log out
            </button>
          </div>
        </header>

        {/* What's new section */}
        <section className="px-4 mt-3">
          <h6 className="text-[#1E70F5] font-bold text-sm mb-1">What's new?</h6>
          <div className="bg-gray-400 h-28 rounded-lg"></div>
          <div className="flex justify-center mt-2 space-x-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === 1 ? "bg-yellow-400" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </section>

        {/* My Igifu Section */}
        <section className="px-4 mt-4">
          <h6 className="text-[#1E70F5] font-bold mb-1">My Igifu</h6>
          <div className="mb-1 text-gray-800 font-medium">Available cards:</div>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="border border-gray-400 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none"
          >
            <option>No Card</option>
            <option>Card 1</option>
            <option>Card 2</option>
          </select>
        </section>

        {/* Igifu Card */}
        <section className="px-4 mt-6 flex justify-center">
          <div className="bg-[#2f2f2f] text-white rounded-2xl w-full max-w-sm p-5 shadow-lg text-center relative overflow-hidden">
            <div className="flex justify-between mb-2 text-xs">
              <span className="invisible">.</span>
              <span>ID: ---h</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Igifu MealCard</h3>
            <p className="text-gray-300 text-sm mb-6">
              This Card is expired. Open to buy another & access all the
              features.
            </p>
            <div className="flex justify-center mb-6">
              <div className="border border-white rounded-full p-6 flex flex-col items-center bg-white/10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                  alt="Igifu Icon"
                  className="w-10 h-10 mb-2 animate-pulse"
                />
                <p className="font-semibold">Igifu</p>
              </div>
            </div>
            <button className="bg-yellow-400 text-black w-full py-2 rounded-md font-semibold hover:bg-yellow-500 transition-all">
              Buy Now
            </button>
          </div>
        </section>

        {/* Bottom Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#1E70F5] text-white py-2 shadow-inner flex justify-around items-center z-20">
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform">
            <FaHome className="text-lg mb-1" /> Restoz
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform">
            <FaCashRegister className="text-lg mb-1" /> Earn
          </button>
          <button className="flex flex-col items-center text-xs bg-yellow-400 text-black px-4 py-1 rounded-full -mt-5 shadow-md hover:scale-110 transition-transform">
            <FaWallet className="text-lg mb-1" /> My Igifu
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform">
            <FaHandHoldingUsd className="text-lg mb-1" /> Loans
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform">
            <FaBars className="text-lg mb-1" /> More
          </button>
        </footer>
      </div>

      {/* Custom Floating Emoji Animation CSS */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { opacity: 0.6; transform: translateY(-40px) rotate(15deg); }
          100% { transform: translateY(-100vh) rotate(-15deg); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default IgifuMealCard;
