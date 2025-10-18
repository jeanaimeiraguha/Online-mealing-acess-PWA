import React, { useState } from 'react';
import { FaSearch, FaBell, FaSignOutAlt, FaPlus, FaMinus, FaHome, FaQuestionCircle, FaCashRegister } from 'react-icons/fa';

const MealPage = () => {
  const [plateCount, setPlateCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePlateChange = (value) => {
    const newCount = plateCount + value;
    if (newCount >= 0) setPlateCount(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-28">

      {/* Header Section */}
      <div className="bg-blue-600 text-white px-4 py-4 flex flex-col md:flex-row items-center justify-between shadow-md">
        <h5 className="text-lg font-semibold animate-pulse">Hello✌️, RichGuy</h5>
        <div className="flex items-center mt-2 md:mt-0 space-x-2">
          {/* Search Input */}
          <div className="flex items-center bg-white rounded-md overflow-hidden text-gray-700 shadow-sm hover:shadow-md transition">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 w-44 outline-none text-sm focus:ring-2 focus:ring-blue-400 rounded-l-md"
            />
            <FaSearch className="px-2 text-gray-500" />
          </div>
          <button className="p-2 text-white hover:text-gray-200 transition duration-300"><FaBell /></button>
          <button className="flex items-center p-2 text-white hover:text-gray-200 transition duration-300">
            <FaSignOutAlt className="mr-1" /> Log out
          </button>
        </div>
      </div>

      {/* My Igifu Section */}
      <div className="flex justify-center py-6 px-4">
        <div className="w-full max-w-md">
          <h6 className="mb-2 font-medium text-gray-700">My Igifu</h6>
          <select className="w-full h-12 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow transition">
            <option>No Card</option>
          </select>
        </div>
      </div>

      {/* Meal Wallet Section */}
      <div className="flex justify-center py-4 px-4">
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
          <h6 className="mb-4 font-semibold text-gray-700">ID: ---</h6>

          <div className="flex gap-3 mb-4">
            <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition shadow">Buy Meals</button>
            <button className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition shadow">Exchange</button>
          </div>

          <div className="flex justify-around mb-4 text-center">
            <div className="hover:scale-105 transition">
              <h6 className="font-semibold">Meal Wallet</h6>
              <p className="mb-1 text-gray-500">Balance</p>
              <h4 className="text-lg font-bold">0</h4>
            </div>
            <div className="hover:scale-105 transition">
              <h6 className="font-semibold">Flexie Wallet</h6>
              <p className="mb-1 text-gray-500">Plates</p>
              <h4 className="text-lg font-bold">0</h4>
            </div>
          </div>

          <p className="text-center text-gray-500 mb-4 text-sm">Card expired. Buy to display remaining Meal Boxes</p>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition shadow">Buy Now</button>
        </div>
      </div>

      {/* Plate Counter Section */}
      <div className="flex justify-center py-6 px-4">
        <div className="w-full max-w-md bg-white p-5 rounded-xl text-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <h6 className="font-semibold text-gray-700 mb-3">No of plates:</h6>
          <div className="flex justify-center items-center my-3 space-x-3">
            <button 
              onClick={() => handlePlateChange(-1)} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition transform hover:scale-110"
            >
              <FaMinus />
            </button>
            <span className="text-xl font-bold">{plateCount}</span>
            <button 
              onClick={() => handlePlateChange(1)} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition transform hover:scale-110"
            >
              <FaPlus />
            </button>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow">Order</button>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="flex justify-center py-4 px-4">
        <div className="text-center space-x-6">
          <button className="text-gray-700 hover:text-blue-600 hover:underline transition">Feedback</button>
          <button className="text-gray-700 hover:text-blue-600 hover:underline transition">Report an issue with the card</button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 w-full bg-blue-600 text-white py-2 shadow-inner">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaHome /> Restoz</button>
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaQuestionCircle /> FAQs</button>
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaCashRegister /> Earn</button>
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaHome /> My Igifu</button>
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaHome /> Loans</button>
          <button className="flex flex-col items-center text-sm hover:text-gray-200 transition"><FaHome /> More</button>
        </div>
      </div>
    </div>
  );
};

export default MealPage;
