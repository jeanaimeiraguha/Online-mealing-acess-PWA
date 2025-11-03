// import React, { useState } from "react";

// const UnlockPage = () => {
//   const [pin, setPin] = useState(["", "", "", ""]);

//   const handleChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newPin = [...pin];
//       newPin[index] = value;
//       setPin(newPin);

//       // Kwimura cursor mu kazu gakurikira
//       if (value && index < 3) {
//         document.getElementById(`pin-${index + 1}`).focus();
//       }
//     }
//   };

//   const handleUnlock = () => {
//     const fullPin = pin.join("");
//     if (fullPin.length < 4) {
//       alert("Please enter all 4 digits of your PIN.");
//     } else {
//       alert(`Unlocking with PIN: ${fullPin}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
//       <div className="bg-gray-800 text-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
//         <h2 className="text-xl font-semibold mb-6">🔒 Unlocked Page</h2>

//         {/* PIN Label */}
//         <p className="text-gray-300 mb-2 font-medium text-sm">Enter PIN</p>

//         {/* PIN Input Boxes */}
//         <div className="flex justify-center space-x-3 mb-4">
//           {pin.map((digit, index) => (
//             <input
//               key={index}
//               id={`pin-${index}`}
//               type="password"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, index)}
//               className="w-12 h-12 text-center bg-gray-700 text-white text-xl rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           ))}
//         </div>

//         {/* Forgot PIN */}
//         <p className="text-blue-400 text-sm mb-6 cursor-pointer hover:underline">
//           Forgot PIN?
//         </p>

//         {/* Unlock Button */}
//         <button
//           onClick={handleUnlock}
//           className="w-full bg-blue-700 hover:bg-blue-800 py-2 rounded-lg font-semibold text-white transition duration-200"
//         >
//           Unlock
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UnlockPage;
