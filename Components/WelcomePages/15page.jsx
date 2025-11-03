// import React, { useState } from 'react';

// const MealWalletApp = () => {
//   const [activeTab, setActiveTab] = useState('meal');
//   const [friendCardID, setFriendCardID] = useState('');
//   const [numMeals, setNumMeals] = useState(1);

//   return (
//     // 🔹 Full Page Wrapper with Emoji Background
//     <div
//       className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden"
//       style={{
//         backgroundColor: '#f3f4f6',
//         backgroundImage: `
//           radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.3) 2%, transparent 20%),
//           radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3) 2%, transparent 20%)
//         `,
//       }}
//     >
//       {/* Floating Emoji Background Layer */}
//       <div className="absolute inset-0 text-6xl opacity-10 select-none pointer-events-none animate-pulse">
//         <div className="absolute top-10 left-10">🍽️</div>
//         <div className="absolute top-32 right-16">🥗</div>
//         <div className="absolute bottom-20 left-24">💳</div>
//         <div className="absolute bottom-32 right-10">💚</div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🍛</div>
//       </div>

//       {/* Page Title */}
//       <h1 className="relative text-3xl md:text-4xl font-bold text-blue-600 mb-8 text-center z-10">
//         IGIFU Meal Wallet System
//       </h1>

//       {/* Main Card */}
//       <div className="relative bg-white rounded-2xl w-full max-w-lg mx-auto shadow-xl p-6 space-y-6 z-10">
//         {/* Paper Card Section */}
//         <div className="flex justify-center items-center space-x-4 mb-4">
//           <div className="text-2xl text-blue-600">No more lost Igifu paper Cards</div>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-xl">
//             Paper Card
//           </button>
//         </div>

//         {/* Meal Wallet and Flexie Wallet Tabs */}
//         <div className="flex justify-center items-center space-x-4 mb-6">
//           <button
//             onClick={() => setActiveTab('meal')}
//             className={`px-6 py-3 rounded-lg text-xl ${
//               activeTab === 'meal' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//             }`}
//           >
//             Meal Wallet
//           </button>
//           <button
//             onClick={() => setActiveTab('flexie')}
//             className={`px-6 py-3 rounded-lg text-xl ${
//               activeTab === 'flexie' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//             }`}
//           >
//             Flexie Wallet
//           </button>
//         </div>

//         {/* Description */}
//         <div className="text-center text-lg text-gray-700 mb-6">
//           <div>
//             Choose between snacking (Flexie) and food (Meal). Pay what you consumed.
//           </div>
//         </div>

//         {/* 🔹 Share Meals with Friends (Black Background) */}
//         <div className="bg-black text-white p-5 rounded-xl mb-6 shadow-md">
//           <div className="text-center text-xl text-blue-400 mb-4 font-semibold">
//             Share meals with Friends
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-300">
//                 Friend's Igifu Card ID
//               </label>
//               <input
//                 type="text"
//                 className="w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400"
//                 placeholder="Enter friend's card ID"
//                 value={friendCardID}
//                 onChange={(e) => setFriendCardID(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-300">
//                 Number of meals to send
//               </label>
//               <input
//                 type="number"
//                 className="w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400"
//                 min="1"
//                 value={numMeals}
//                 onChange={(e) => setNumMeals(e.target.value)}
//               />
//             </div>

//             {/* 🟢 Green Share Meals Button */}
//             <button className="bg-green-500 text-white w-full py-3 rounded-lg text-lg mt-4 hover:bg-green-600 transition">
//               Share Meals
//             </button>
//           </div>
//         </div>

//         {/* Sign Up and Log In Buttons */}
//         <div className="flex justify-center space-x-4">
//           <button className="bg-blue-500 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-600">
//             Sign Up
//           </button>
//           <button className="bg-gray-200 text-blue-600 px-8 py-3 rounded-lg text-xl hover:bg-gray-300">
//             Log In
//           </button>
//         </div>

//         {/* Footer Navigation */}
//         <div className="w-full flex justify-center mt-6 space-x-6">
//           <button className="text-blue-600 text-lg">Next</button>
//           <button className="text-blue-600 text-lg">Back</button>
//         </div>
//       </div>

//       {/* Page Footer */}
//       <footer className="relative mt-10 text-gray-500 text-center text-sm z-10">
//         © {new Date().getFullYear()} IGIFU Meal Wallet — All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default MealWalletApp;
