// import React, { useState } from 'react';

// const FloatingEmoji = ({ emoji, left, duration, delay, size }) => (
//   <span
//     className="absolute animate-float select-none opacity-70"
//     style={{
//       left: `${left}%`,
//       fontSize: `${size}px`,
//       animationDuration: `${duration}s`,
//       animationDelay: `${delay}s`,
//       top: '100%',
//     }}
//   >
//     {emoji}
//   </span>
// );

// const MealWallet = () => {
//   const [mealBalance] = useState(43000);
//   const [flexieBalance] = useState(0);
//   const [selectedCard, setSelectedCard] = useState('Campus Bites card');
//   const [tickedBoxes, setTickedBoxes] = useState(Array(16).fill(false));

//   const handleBoxClick = (index) => {
//     const newTicked = [...tickedBoxes];
//     newTicked[index] = !newTicked[index];
//     setTickedBoxes(newTicked);
//   };

//   const tickedCount = tickedBoxes.filter(Boolean).length;

//   const availableCards = [
//     { id: '021', name: 'Campus Bites Card' },
//     { id: '022', name: 'Library Card' },
//     { id: '023', name: 'Sports Card' },
//   ];

//   const emojis = ['🍔', '🍕', '🍱', '🎉', '🥗', '🍗', '🍩', '🍰'];

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
//       {/* Floating Emojis Background */}
//       <style>
//         {`
//           @keyframes float {
//             0% { transform: translateY(0) rotate(0deg); opacity: 1; }
//             50% { opacity: 0.8; }
//             100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
//           }
//           .animate-float {
//             animation-name: float;
//             position: absolute;
//           }
//         `}
//       </style>

//       {emojis.map((emoji, i) => (
//         <FloatingEmoji
//           key={i}
//           emoji={emoji}
//           left={Math.random() * 100}
//           duration={10 + Math.random() * 15}
//           delay={Math.random() * 10}
//           size={30 + Math.random() * 30}
//         />
//       ))}

//       {/* Main Card */}
//       <div className="relative z-10 bg-white rounded-2xl w-full max-w-6xl mx-auto shadow-2xl p-6 md:p-8 space-y-8 bg-opacity-95 backdrop-blur-md">

//         {/* Top Navigation */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-4">
//             <div className="text-3xl md:text-4xl font-semibold text-blue-600">Hello ✨. RichGuy</div>
//             <button className="bg-gray-300 p-3 md:p-4 rounded-full text-xl md:text-2xl text-blue-500">🔔</button>
//           </div>
//           <button className="bg-blue-500 text-white px-6 md:px-8 py-2 md:py-4 rounded-lg text-lg md:text-xl">
//             Log out
//           </button>
//         </div>

//         {/* Card Selection */}
//         <div className="w-full flex flex-col items-center mb-4 space-y-3">
//           <select
//             value={selectedCard}
//             onChange={(e) => setSelectedCard(e.target.value)}
//             className="w-full max-w-2xl p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//           >
//             <option value="Campus Bites card">Campus Bites card</option>
//             {availableCards.map((card) => (
//               <option key={card.id} value={card.name}>
//                 {card.name}
//               </option>
//             ))}
//           </select>

//           <div className="w-full max-w-2xl flex justify-center mt-2">
//             <button className="bg-gray-200 px-6 md:px-8 py-2 md:py-3 rounded-lg text-blue-600 text-lg md:text-xl">
//               Close
//             </button>
//           </div>

//           <div className="w-full max-w-2xl flex justify-between mt-3">
//             <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg md:text-xl">
//               Buy Meals
//             </button>
//             <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg md:text-xl">
//               Exchange
//             </button>
//           </div>

//           {/* Wallet Summary */}
//           <div className="w-full max-w-2xl flex justify-between mt-3">
//             <div className="flex flex-col w-1/2 mr-2">
//               <button className="bg-green-200 text-green-800 px-6 py-3 rounded-lg text-lg md:text-xl">
//                 Meal Wallet
//               </button>
//               <div className="mt-2 bg-green-50 text-green-900 p-3 rounded-lg text-center font-medium">
//                 Balance: {mealBalance}
//               </div>
//             </div>
//             <div className="flex flex-col w-1/2 ml-2">
//               <button className="bg-yellow-200 text-yellow-800 px-6 py-3 rounded-lg text-lg md:text-xl">
//                 Flexible Wallet
//               </button>
//               <div className="mt-2 bg-yellow-50 p-3 rounded-lg flex justify-center items-center space-x-4">
//                 <span className="text-xl md:text-2xl">{flexieBalance} Plates</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Meal Wallet Section */}
//         <div className="w-full bg-gray-100 p-6 md:p-8 rounded-xl space-y-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-0">Meal Wallet</div>
//             <div className="text-xl md:text-2xl font-medium">Balance: {mealBalance}</div>
//           </div>

//           <div className="text-xl md:text-2xl font-medium text-center mb-2">
//             Selected: {tickedCount} {tickedCount === 1 ? 'Plate' : 'Plates'}
//           </div>

//           <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
//             {tickedBoxes.map((ticked, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleBoxClick(index)}
//                 className={`w-16 md:w-20 h-16 md:h-20 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl md:text-3xl cursor-pointer ${
//                   ticked ? 'text-green-500' : 'text-gray-300'
//                 }`}
//               >
//                 {ticked ? '✔' : ''}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end">
//             <button className="bg-gray-200 px-6 md:px-8 py-2 md:py-3 rounded-lg text-blue-600 text-lg md:text-xl">
//               Close
//             </button>
//           </div>
//         </div>

//         {/* Bottom Nav */}
//         <div className="w-full bg-gray-100 p-3 md:p-4 flex justify-between items-center rounded-xl">
//           {[
//             { icon: '🏠', label: 'Restoz' },
//             { icon: '💰', label: 'Earn' },
//             { icon: '🍽️', label: 'My Igifu' },
//             { icon: '🏦', label: 'Loans' },
//             { icon: '⋯', label: 'More' },
//           ].map((item, i) => (
//             <button key={i} className="flex flex-col items-center text-blue-600 text-sm md:text-lg space-y-1">
//               <span className="text-xl md:text-2xl">{item.icon}</span>
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="w-full bg-gray-200 p-4 md:p-6 text-center text-lg md:text-2xl text-gray-600 rounded-xl space-y-2">
//           <div>Feedback</div>
//           <div>Report an issue with the card</div>
//           <div>FAQs - IGIFU meal card</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MealWallet;
