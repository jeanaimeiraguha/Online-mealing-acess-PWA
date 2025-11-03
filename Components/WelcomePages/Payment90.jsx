// import React, { useState } from "react";

// const IgifuPurchase90 = () => {
//   const [quantity, setQuantity] = useState(30);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentStep, setPaymentStep] = useState("processing"); // "processing" or "success"

//   const mealPrice = 16000;

//   // Calculate fee based on quantity
//   const calculateFee = (qty) => {
//     if (qty <= 30) return 800;
//     if (qty <= 60) return 1600;
//     return 3200; // for qty > 60
//   };

//   const fee = calculateFee(quantity);
//   const total = quantity * mealPrice + fee;

//   const increase = () => setQuantity(quantity + 1);
//   const decrease = () => quantity > 1 && setQuantity(quantity - 1);

//   const handlePay = () => {
//     setShowModal(true);
//     setPaymentStep("processing");
//   };

//   const handleSend = () => {
//     setPaymentStep("success");
//   };

//   const closeModal = () => setShowModal(false);

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
//       <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 relative">
//         <h2 className="text-center text-lg font-semibold mb-4">
//           Confirm your Igifu purchase
//         </h2>

//         {/* Meal Quantity */}
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-gray-300 font-medium">Meal Quantity:</span>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={decrease}
//               className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 text-xl"
//             >
//               ➖
//             </button>
//             <span className="text-xl font-bold">{quantity}</span>
//             <button
//               onClick={increase}
//               className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 text-xl"
//             >
//               ➕
//             </button>
//           </div>
//         </div>

//         {/* Fields */}
//         <div className="grid grid-cols-3 gap-2 mb-4">
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-300 mb-1">You get</label>
//             <input
//               type="text"
//               value={`${quantity} meals`}
//               readOnly
//               className="bg-gray-700 text-green-400 font-medium text-center rounded-lg p-2 outline-none"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-300 mb-1">Price</label>
//             <input
//               type="text"
//               value={`${mealPrice.toLocaleString()} Rwf`}
//               readOnly
//               className="bg-gray-700 text-green-400 font-medium text-center rounded-lg p-2 outline-none"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-300 mb-1">% Fee</label>
//             <input
//               type="text"
//               value={`${fee.toLocaleString()} Rwf`}
//               readOnly
//               className="bg-gray-700 text-yellow-400 font-medium text-center rounded-lg p-2 outline-none"
//             />
//           </div>
//         </div>

//         {/* Total */}
//         <div className="flex justify-between font-semibold mb-4">
//           <span>Total to pay:</span>
//           <span className="text-green-500">{total.toLocaleString()} Rwf</span>
//         </div>

//         {/* Payment Method */}
//         <div className="mb-3">
//           <label className="block text-sm text-gray-300 mb-1">Pay with:</label>
//           <div className="relative">
//             <select className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-green-400">
//               <option>📱 MTN Mobile Money</option>
//               <option>💳 Bank Card</option>
//               <option>📞 Airtel Money</option>
//             </select>
//           </div>
//         </div>

//         {/* Phone Input */}
//         <div className="mb-4">
//           <label className="block text-sm text-gray-300 mb-1">
//             Payment number:
//           </label>
//           <input
//             type="tel"
//             placeholder="+250"
//             className="w-full bg-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-400 outline-none"
//           />
//         </div>

//         {/* Terms */}
//         <p className="text-xs text-gray-400 text-center mb-4">
//           By paying, I agree to Igifu{" "}
//           <span className="text-blue-400 underline cursor-pointer">Terms</span>{" "}
//           and{" "}
//           <span className="text-blue-400 underline cursor-pointer">Privacy</span>
//         </p>

//         {/* Buttons */}
//         <div className="flex space-x-2">
//           <button className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold">
//             Cancel
//           </button>
//           <button
//             onClick={handlePay}
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
//           >
//             Pay {total.toLocaleString()} Rwf
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-white rounded-2xl p-6 max-w-sm w-full text-center relative">
//             {paymentStep === "processing" ? (
//               <>
//                 <h3 className="text-lg font-semibold mb-4">Processing Payment</h3>
//                 <p className="mb-4">
//                   Waiting for approval. Complete the payment on your phone.
//                 </p>
//                 <p className="mb-2">
//                   MTN: DIAL <span className="font-bold">*182*7*1#</span>
//                 </p>
//                 <p>
//                   Airtel: DIAL <span className="font-bold">*182*5*6#</span>
//                 </p>
//                 <div className="flex justify-center mt-4 space-x-2">
//                   <button
//                     onClick={handleSend}
//                     className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
//                   >
//                     Send
//                   </button>
//                   <button
//                     onClick={closeModal}
//                     className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg font-semibold"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-lg font-semibold mb-4">🎉 Payment Successful!</h3>
//                 <p className="mb-4">
//                   The bought meals were successfully added to your Igifu Card (id:002A) and ready to be used. Bon Appétit!
//                 </p>
//                 <button
//                   onClick={closeModal}
//                   className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
//                 >
//                   Check My Card
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IgifuPurchase90;
