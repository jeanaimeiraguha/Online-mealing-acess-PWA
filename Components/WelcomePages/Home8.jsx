import React, { useState } from 'react';

const emojis = ['🍔', '🍕', '🥗', '🍱', '🍩', '🥪', '🍜', '🍗'];

const generateEmojiElements = () => {
  return Array.from({ length: 30 }).map((_, i) => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const left = Math.random() * 100; // horizontal position %
    const duration = 10 + Math.random() * 10; // animation duration seconds
    const delay = Math.random() * 10; // animation delay seconds
    const size = 20 + Math.random() * 40; // font size px
    return (
      <span
        key={i}
        className="absolute animate-float"
        style={{
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {emoji}
      </span>
    );
  });
};

const MealWalletApphome = () => {
  const [selectedCard, setSelectedCard] = useState('No Card');

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white overflow-hidden">

      {/* Emoji Background */}
      <div className="absolute inset-0 pointer-events-none">
        {generateEmojiElements()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl shadow-xl p-6 flex-1 flex flex-col">

        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6 mt-12">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-semibold text-blue-600">Hello ✨. RichGuy</div>
            <button className="bg-gray-300 p-3 rounded-full text-xl text-blue-500">🔔</button>
          </div>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg">Log out</button>
        </div>

        {/* What's New Section */}
        <div className="text-center text-lg text-gray-700 mb-6">
          <div>What's new?</div>
        </div>

        {/* Available Cards Dropdown */}
        <div className="flex justify-center items-center mb-6">
          <div className="text-xl text-gray-700 mr-4">Available cards:</div>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="px-6 py-4 border-2 border-gray-300 rounded-lg text-xl min-w-[300px]"
          >
            <option value="No Card">No Card</option>
            <option value="Campus Bites Card">Campus Bites Card</option>
            <option value="Inka Kitchen Card">Inka Kitchen Card</option>
          </select>
        </div>

        {/* Card Details Section */}
        <div className="bg-gradient-to-r from-purple-900 via-black to-gray-800 p-16 rounded-3xl mb-8 text-center shadow-2xl">
          <div className="text-5xl font-bold text-white mb-6">Igifu MealCard</div>
          <div className="text-xl text-gray-300 mb-8">ID: ----</div>
          <div className="text-3xl text-gray-200">
            This Card is expired. Open to buy another & access all the features.
          </div>
        </div>

      </div>

      {/* Footer Navigation Bar */}
      <div className="relative z-10 w-full bg-gray-100 p-3 flex justify-between items-center rounded-xl mt-auto">
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">🏠</span>
          <span>Restoz</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">💰</span>
          <span>Earn</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">🍽️</span>
          <span>My Igifu</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">🏦</span>
          <span>Loans</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">⋯</span>
          <span>More</span>
        </button>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-150%); opacity: 0; }
          }
          .animate-float {
            animation-name: float;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>

    </div>
  );
};

export default MealWalletApphome;
