import React, { useState } from 'react';

const MealWalletpage10 = () => {
  const [selectedCard, setSelectedCard] = useState('No Card');
  const [balance, setBalance] = useState(0);
  const [plates, setPlates] = useState(0);
  const [cardStatus, setCardStatus] = useState('expired');
  const [id, setId] = useState('');

  const handleBuyNow = () => {
    setBalance(100);
    setCardStatus('active');
  };

  const handleOrder = () => {
    if (balance > 0 && plates > 0) {
      alert(`Order placed for ${plates} plates!`);
      setBalance(balance - plates);
      setPlates(0);
    } else {
      alert('Please buy meals and select plates.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col p-4">

      {/* Header Section */}
      <div className="flex justify-between items-center py-3 bg-blue-500 text-white rounded-xl shadow-md">
        <div className="text-lg">Hello ✌️ RichGuy</div>
        <div className="flex items-center space-x-2">
          <button className="bg-yellow-400 p-2 rounded-md">Search</button>
          <button className="p-2 rounded-md">🔔</button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mt-5 bg-white rounded-xl shadow-lg p-6 space-y-5 flex-1">

        {/* Available Cards Dropdown */}
        <div>
          <label htmlFor="cards" className="block text-sm font-medium mb-1">Available cards:</label>
          <select
            id="cards"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option>No Card</option>
            <option>Meal Card</option>
            <option>Flexie Wallet</option>
          </select>
        </div>

        {/* ID and Buttons */}
        <div className="flex justify-between mb-5 items-center">
          <div className="flex items-center space-x-2">
            {/* Buy Meals button on the LEFT */}
            <button
              onClick={handleBuyNow}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Buy Meals
            </button>
          </div>
          <div>
            {/* Exchange button on the RIGHT */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Exchange
            </button>
          </div>
        </div>

        {/* Wallet Details */}
        <div className="flex justify-between text-sm mb-5">
          <div>
            <p className="font-medium">Meal Wallet</p>
            <p>Balance: {balance}</p>
            <p>Plates: {plates}</p>
          </div>
          <div>
            <p className="font-medium">Flexie Wallet</p>
            <p>Balance: 0</p>
            <p>Plates: 0</p>
          </div>
        </div>

        {/* Card Status and Plates Selection */}
        {cardStatus === 'expired' ? (
          <div className="text-center text-red-500">
            <p>Card expired. Buy to display remaining Meal Boxes.</p>
            <button
              onClick={handleBuyNow}
              className="mt-3 bg-green-500 text-white p-2 rounded-md"
            >
              Buy Now
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-2">
            <div>
              <label htmlFor="plates" className="block font-medium">No of plates:</label>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => setPlates(Math.max(0, plates - 1))}
                  className="px-2 py-1 bg-gray-300 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  id="plates"
                  value={plates}
                  onChange={(e) => setPlates(Number(e.target.value))}
                  className="w-12 text-center border-t border-b border-gray-300"
                />
                <button
                  onClick={() => setPlates(plates + 1)}
                  className="px-2 py-1 bg-gray-300 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="mt-2 bg-blue-500 text-white py-2 px-6 rounded-md"
            >
              Order
            </button>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="mt-5 bg-gray-100 rounded-xl p-3 flex justify-between items-center shadow-inner">
        <button className="flex flex-col items-center text-blue-600 text-sm space-y-1">
          <span className="text-xl">🏠</span>
          <span>Home</span>
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

    </div>
  );
};

export default MealWalletpage10;
