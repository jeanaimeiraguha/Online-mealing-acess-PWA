// import React, { useState } from 'react';

// const emojis = ['🍔', '🍕', '🍣', '🥗', '🍜', '🍩', '🍦', '🥪'];

// const RestaurantBrowseApp = () => {
//   const [filter, setFilter] = useState({
//     name: '',
//     campus: '',
//     price: '',
//     selfService: '',
//     workTime: '',
//     inOutCampus: '',
//     flexiblePayment: ''
//   });

//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [searchText, setSearchText] = useState('');

//   const [restaurants] = useState([
//     {
//       name: 'Campus Bites',
//       location: 'Huye (South)',
//       price: '30k frw/60 meals',
//       mealPrice: '16k frw/30 meals',
//       service: 'Inside campus',
//       walkTime: '3 mins',
//       selfService: 'NO',
//       inOutCampus: 'Inside',
//       flexiblePayment: 'Half',
//       id: 1
//     },
//     {
//       name: 'Inka Kitchen',
//       location: 'Remera (Kigali)',
//       price: '40k frw/60 meals',
//       mealPrice: '20k frw/30 meals',
//       service: 'Inside campus',
//       walkTime: '5 mins',
//       selfService: 'YES',
//       inOutCampus: 'Outside',
//       flexiblePayment: 'Quarter',
//       id: 2
//     }
//   ]);

//   const priceRanges = [
//     { label: '20k-40k', min: 20000, max: 40000 },
//     { label: '41k-60k', min: 41000, max: 60000 },
//     { label: '61k-80k', min: 61000, max: 80000 },
//     { label: '81k-100k', min: 81000, max: 100000 },
//     { label: '100k and more', min: 100001, max: Infinity },
//   ];

//   const parsePrice = (priceStr) => {
//     const match = priceStr.match(/(\d+)k/);
//     return match ? parseInt(match[1]) * 1000 : 0;
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter(prev => ({ ...prev, [name]: value }));
//   };

//   const filteredRestaurants = restaurants.filter((r) => {
//     const priceNum = parsePrice(r.price);
//     const priceMatch = filter.price
//       ? (() => {
//           const range = priceRanges.find(pr => pr.label === filter.price);
//           return range ? priceNum >= range.min && priceNum <= range.max : true;
//         })()
//       : true;

//     return (
//       (filter.name ? r.name.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
//       (filter.campus ? r.location.includes(filter.campus) : true) &&
//       priceMatch &&
//       (filter.selfService ? r.selfService === filter.selfService : true) &&
//       (filter.workTime ? r.walkTime.includes(filter.workTime) : true) &&
//       (filter.inOutCampus ? r.inOutCampus === filter.inOutCampus : true) &&
//       (filter.flexiblePayment ? r.flexiblePayment === filter.flexiblePayment : true)
//     );
//   });

//   const searchResults = restaurants.filter(r =>
//     r.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <div className={`relative min-h-screen p-2 overflow-hidden ${showSearchModal ? 'bg-black text-white' : 'bg-yellow-50 text-black'}`}>
//       {/* Floating Emojis */}
//       {emojis.map((emoji, i) => (
//         <span
//           key={i}
//           className="absolute text-2xl animate-bounce"
//           style={{
//             top: `${Math.random() * 90}vh`,
//             left: `${Math.random() * 90}vw`,
//             animationDelay: `${Math.random() * 3}s`
//           }}
//         >
//           {emoji}
//         </span>
//       ))}

//       {/* Header */}
//       <div className={`flex justify-between items-center py-1 rounded-xl shadow-md relative z-10 text-[10px] ${showSearchModal ? 'bg-gray-800 text-white' : 'bg-blue-500 text-white'}`}>
//         <button className="px-1">← Back</button>
//         <div className="font-semibold text-[10px]">Choose your favorite Restaurant(s)</div>
//         <div className="flex items-center space-x-1">
//           <button className={`${showSearchModal ? 'bg-gray-600' : 'bg-yellow-400'} px-1 py-0.5 rounded text-[10px]`}>Browse all</button>
//           <button className={`${showSearchModal ? 'bg-gray-600' : 'bg-yellow-400'} px-1 py-0.5 rounded text-[10px]`}>Favourites</button>
//         </div>
//       </div>

//       {/* Filters */}
//       <fieldset className={`rounded-xl shadow-lg p-2 mt-2 relative z-10 text-[10px] ${showSearchModal ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
//         <legend className="font-medium text-[10px] px-1">Filters</legend>
//         <div className="mt-1 space-y-1">
//           {/* Name search */}
//           <div className="relative">
//             <label
//               htmlFor="name"
//               className="block flex items-center space-x-1 cursor-pointer text-[10px]"
//               onClick={() => setShowSearchModal(true)}
//             >
//               <span>🔍</span>
//               <span>Name</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               value={filter.name}
//               readOnly
//               placeholder="Search by name"
//               className={`w-full p-1 pl-2 rounded-md border mt-1 text-[10px] cursor-pointer ${showSearchModal ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
//               onClick={() => setShowSearchModal(true)}
//             />
//           </div>

//           {/* Campus filter */}
//           <div>
//             <label htmlFor="campus" className="block flex items-center space-x-1 text-[10px]">
//               <span>🏫</span>
//               <span>Campus</span>
//             </label>
//             <select
//               name="campus"
//               id="campus"
//               value={filter.campus}
//               onChange={handleFilterChange}
//               className={`w-full p-1 rounded-md border mt-1 text-[10px] ${showSearchModal ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
//             >
//               <option value="">Select Campus</option>
//               <option value="Huye">Huye (South)</option>
//               <option value="Remera">Remera (Kigali)</option>
//               <option value="Nyagatare">Nyagatare (East)</option>
//               <option value="Nyarugenge">Nyarugenge (Kigali)</option>
//             </select>
//           </div>

//           {/* Other filters including Price and Flexible Payment */}
//           {[
//             { label: 'Price', name: 'price', options: priceRanges.map(pr => pr.label), icon: '💰' },
//             { label: 'Self Service', name: 'selfService', options: ['YES', 'NO'], icon: '🛎️' },
//             { label: 'Work Time', name: 'workTime', options: ['3 mins', '5 mins'], icon: '⏱️' },
//             { label: 'In/Out Campus', name: 'inOutCampus', options: ['Inside', 'Outside'], icon: '🚪' },
//             { label: 'Flexible Payment', name: 'flexiblePayment', options: ['Half', 'Quarter'], icon: '💳' }
//           ].map(f => (
//             <div key={f.name}>
//               <label htmlFor={f.name} className="block flex items-center space-x-1 text-[10px]">
//                 <span>{f.icon}</span>
//                 <span>{f.label}</span>
//               </label>
//               <select
//                 name={f.name}
//                 id={f.name}
//                 value={filter[f.name]}
//                 onChange={handleFilterChange}
//                 className={`w-full p-1 rounded-md border mt-1 text-[10px] ${showSearchModal ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
//               >
//                 <option value="">Select {f.label}</option>
//                 {f.options.map(opt => (
//                   <option key={opt} value={opt}>{opt}</option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>
//       </fieldset>

//       {/* Search Modal */}
//       {showSearchModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-start pt-16 z-50 text-white">
//           <div className="bg-gray-900 rounded-xl p-3 w-72 shadow-lg text-[10px]">
//             <div className="flex justify-between items-center mb-1">
//               <h2 className="font-semibold text-[10px]">Search Restaurant by Name</h2>
//               <button className="text-red-500 text-lg" onClick={() => setShowSearchModal(false)}>×</button>
//             </div>
//             <input
//               type="text"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Type restaurant name..."
//               className="w-full p-1 rounded-md border border-gray-600 text-[10px] mb-1 bg-gray-800 text-white"
//             />
//             <div className="max-h-32 overflow-y-auto text-[10px]">
//               {searchResults.length > 0 ? (
//                 searchResults.map(r => (
//                   <div
//                     key={r.id}
//                     className="p-1 border-b last:border-b-0 cursor-pointer hover:bg-gray-700"
//                     onClick={() => {
//                       setFilter(prev => ({ ...prev, name: r.name }));
//                       setShowSearchModal(false);
//                     }}
//                   >
//                     {r.name}
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400 text-[10px]">No results found</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Restaurants list */}
//       <div className="mt-2 relative z-10 text-[10px]">
//         {filteredRestaurants.length > 0 ? (
//           filteredRestaurants.map(restaurant => (
//             <div
//               key={restaurant.id}
//               className={`rounded-xl shadow-md p-2 mb-1 flex flex-col text-[10px] ${showSearchModal ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
//             >
//               <span className="font-semibold">{restaurant.name}</span>
//               <p>{restaurant.location}</p>
//               <p>{restaurant.price}</p>
//               <p>{restaurant.mealPrice}</p>
//               <p>Service: {restaurant.service}</p>
//               <p>Walk Time: {restaurant.walkTime}</p>
//               <p>Self Service: {restaurant.selfService}</p>
//               <p>Flexible Payment: {restaurant.flexiblePayment}</p>
//               <button className={`mt-1 py-0.5 px-2 rounded text-[10px] ${showSearchModal ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>See more</button>
//             </div>
//           ))
//         ) : (
//           <p>No restaurants found with the selected filters.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantBrowseApp;
