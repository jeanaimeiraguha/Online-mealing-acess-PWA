import React, { useState } from 'react';

const MealWallet14d = () => {
  const [mealBalance] = useState(54000);
  const [flexieBalance] = useState(0);
  const [plateCount, setPlateCount] = useState(1);
  const [selectedCard, setSelectedCard] = useState('Inka kitchen card');

  // Track ticked boxes
  const [tickedBoxes, setTickedBoxes] = useState(Array(16).fill(false));

  const handlePlateChange = (action) => {
    if (action === 'increment') setPlateCount(plateCount + 1);
    else if (action === 'decrement' && plateCount > 1) setPlateCount(plateCount - 1);
  };

  const handleBoxClick = (index) => {
    const newTicked = [...tickedBoxes];
    newTicked[index] = !newTicked[index];
    setTickedBoxes(newTicked);
  };

  const availableCards = [
    { id: '012', name: 'Inka Kitchen Card' },
    { id: '021', name: 'Campus Bites Card' },
    { id: '022', name: 'Library Card' },
  ];

  // Emoji background
  const emojis = ['💰', '🥗', '🍔', '🍕', '🍟', '🎉', '🍩', '🍛'];

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] flex flex-col pb-24 font-sans overflow-hidden">
      
      {/* Animated Emoji Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {emojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float select-none opacity-30"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 5}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-6xl mx-auto shadow-xl p-6 md:p-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl md:text-4xl font-semibold text-blue-600">Hello ✨. RichGuy</div>
            <button className="bg-gray-300 p-3 md:p-4 rounded-full text-xl md:text-2xl text-blue-500">🔔</button>
          </div>
          <button className="bg-blue-500 text-white px-6 md:px-8 py-2 md:py-4 rounded-lg text-lg md:text-xl">Log out</button>
        </div>

        {/* Card Selection */}
        <div className="w-full flex flex-col items-center mb-4 space-y-3">
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="w-full max-w-xl p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="Inka kitchen card">Inka kitchen card</option>
            {availableCards.map((card) => (
              <option key={card.id} value={card.name}>{card.name}</option>
            ))}
          </select>

          <div className="w-full max-w-xl flex justify-center mt-2">
            <button className="bg-gray-200 px-6 md:px-8 py-2 md:py-3 rounded-lg text-blue-600 text-lg md:text-xl">Close</button>
          </div>

          <div className="w-full max-w-xl flex justify-between mt-3">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg md:text-xl" disabled={!selectedCard}>Buy Meals</button>
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg md:text-xl" disabled={!selectedCard}>Exchange</button>
          </div>

          <div className="w-full max-w-xl flex justify-between mt-3">
            <div className="flex flex-col w-1/2 mr-2">
              <button className="bg-green-200 text-green-800 px-6 py-3 rounded-lg text-lg md:text-xl">Meal Wallet</button>
              <div className="mt-2 bg-green-50 text-green-900 p-3 rounded-lg text-center font-medium">
                Balance: {mealBalance}
              </div>
            </div>
            <div className="flex flex-col w-1/2 ml-2">
              <button className="bg-yellow-200 text-yellow-800 px-6 py-3 rounded-lg text-lg md:text-xl">Flexible Wallet</button>
              <div className="mt-2 bg-yellow-50 p-3 rounded-lg flex justify-center items-center space-x-4">
                <button onClick={() => handlePlateChange('decrement')} className="bg-gray-300 px-4 py-2 rounded-lg text-2xl">-</button>
                <span className="text-xl md:text-2xl">{plateCount} Plates</span>
                <button onClick={() => handlePlateChange('increment')} className="bg-gray-300 px-4 py-2 rounded-lg text-2xl">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Wallet Section */}
        <div className="w-full bg-gray-100 p-6 md:p-8 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-0">Meal Wallet</div>
            <div className="text-xl md:text-2xl font-medium">Balance: {mealBalance}</div>
          </div>

          {/* Meal Slots Grid with Clickable Tick */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
            {tickedBoxes.map((ticked, index) => (
              <div
                key={index}
                onClick={() => handleBoxClick(index)}
                className={`w-16 md:w-20 h-16 md:h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer ${ticked ? 'bg-green-200 text-green-600' : 'bg-white text-gray-300'}`}
              >
                {ticked && '✔'}
              </div>
            ))}
          </div>

          {/* Plate Counter */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button onClick={() => handlePlateChange('decrement')} className="bg-gray-300 px-5 md:px-6 py-2 md:py-3 rounded-lg text-3xl md:text-4xl">-</button>
              <div className="text-2xl md:text-3xl">{plateCount} Plates</div>
              <button onClick={() => handlePlateChange('increment')} className="bg-gray-300 px-5 md:px-6 py-2 md:py-3 rounded-lg text-3xl md:text-4xl">+</button>
            </div>
            <button className="bg-blue-500 text-white px-8 md:px-12 py-3 md:py-4 rounded-lg text-2xl md:text-3xl">Order</button>
          </div>

          <div className="flex justify-end">
            <button className="bg-gray-200 px-6 md:px-8 py-2 md:py-3 rounded-lg text-blue-600 text-lg md:text-xl">Close</button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="w-full bg-gray-100 p-3 md:p-4 flex justify-between items-center rounded-xl">
          <button className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
            <span className="text-xl md:text-2xl">🏠</span> Restoz
          </button>
          <button className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
            <span className="text-xl md:text-2xl">💰</span> Earn
          </button>
          <button className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
            <span className="text-xl md:text-2xl">🍽️</span> My Igifu
          </button>
          <button className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
            <span className="text-xl md:text-2xl">🏦</span> Loans
          </button>
          <button className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
            <span className="text-xl md:text-2xl">⋯</span> More
          </button>
        </div>

        {/* Footer */}
        <div className="w-full bg-gray-200 p-4 md:p-6 text-center text-lg md:text-2xl text-gray-600 rounded-xl space-y-2">
          <div>Feedback</div>
          <div>Report an issue with the card</div>
          <div>FAQs - IGIFU meal card</div>
        </div>
      </div>

      {/* Emoji Animation Style */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) rotate(15deg); opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(-15deg); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MealWallet14d;
