import React, { useState } from 'react';

const emojis = ['🍔', '🍕', '🍣', '🥗', '🍜', '🍩', '🍦', '🥪'];

const RestaurantBrowseApp = () => {
  const [filter, setFilter] = useState({
    campus: '',
    price: '',
    selfService: ''
  });

  const [restaurants] = useState([
    {
      name: 'Campus Bites',
      location: 'Huye Campus',
      price: '30k frw/60 meals',
      mealPrice: '16k frw/30 meals',
      service: 'Inside campus',
      walkTime: '3 mins',
      selfService: 'NO',
      id: 1
    },
    {
      name: 'Inka Kitchen',
      location: 'Remera Campus',
      price: '40k frw/60 meals',
      mealPrice: '20k frw/30 meals',
      service: 'Inside campus',
      walkTime: '5 mins',
      selfService: 'YES',
      id: 2
    }
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRestaurants = restaurants.filter((r) => {
    return (
      (filter.campus ? r.location.includes(filter.campus) : true) &&
      (filter.price ? r.price.includes(filter.price) : true) &&
      (filter.selfService ? r.selfService === filter.selfService : true)
    );
  });

  return (
    <div className="relative min-h-screen p-4 bg-yellow-50 overflow-hidden">
      {/* Floating Emoji Background */}
      {emojis.map((emoji, i) => (
        <span
          key={i}
          className="absolute text-3xl animate-bounce"
          style={{
            top: `${Math.random() * 90}vh`,
            left: `${Math.random() * 90}vw`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          {emoji}
        </span>
      ))}

      {/* Header Section */}
      <div className="flex justify-between items-center py-3 bg-blue-500 text-white rounded-xl shadow-md relative z-10">
        <button className="text-lg">← Back</button>
        <div className="font-semibold">Choose your favorite Restaurant(s)</div>
        <div className="flex items-center space-x-2">
          <button className="bg-yellow-400 p-2 rounded-md">Browse all restoz</button>
          <button className="bg-yellow-400 p-2 rounded-md">Favourites</button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-5 mt-5 relative z-10">
        <div className="flex justify-between items-center">
          <span className="font-medium text-lg">Filters</span>
          <button className="text-blue-500">Clear All</button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="campus" className="block text-sm">Campus</label>
            <select
              name="campus"
              id="campus"
              value={filter.campus}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-md border border-gray-300 mt-1"
            >
              <option value="">Select Campus</option>
              <option value="Huye">Huye Campus</option>
              <option value="Remera">Remera Campus</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm">Price</label>
            <select
              name="price"
              id="price"
              value={filter.price}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-md border border-gray-300 mt-1"
            >
              <option value="">Select Price</option>
              <option value="30k">30k frw/60 meals</option>
              <option value="40k">40k frw/60 meals</option>
            </select>
          </div>

          <div>
            <label htmlFor="selfService" className="block text-sm">Self Service</label>
            <select
              name="selfService"
              id="selfService"
              value={filter.selfService}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-md border border-gray-300 mt-1"
            >
              <option value="">Select Self Service</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="mt-6 relative z-10">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-md p-5 mb-4 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{restaurant.name}</span>
                <p>{restaurant.location}</p>
                <p>{restaurant.price}</p>
                <p>{restaurant.mealPrice}</p>
                <p>Service: {restaurant.service}</p>
                <p>Walk Time: {restaurant.walkTime}</p>
                <p>Self Service: {restaurant.selfService}</p>
              </div>
              <button className="bg-blue-500 text-white py-2 px-6 rounded-md">See more</button>
            </div>
          ))
        ) : (
          <p>No restaurants found with the selected filters.</p>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 flex justify-between relative z-10">
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">Restoz</button>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">Earn</button>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">My Igifu</button>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">Loans</button>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">More</button>
      </div>
    </div>
  );
};

export default RestaurantBrowseApp;
