import React, { useState } from 'react';
import RestozPage from './pages/RestozPage';
import DigitalMealCard from './components/DigitalMealCard';

const StudentDashboard = () => {
  // State for subscriptions, managed by the parent
  const [subscriptions, setSubscriptions] = useState({});

  // State to trigger an order from an external component
  const [orderRequest, setOrderRequest] = useState(null);

  // Callback for RestozPage to add a new subscription
  const handleNewSubscription = (newSubscription) => {
    setSubscriptions(prev => ({
      ...prev,
      [newSubscription.restaurantId]: newSubscription
    }));
  };

  // Callback for DigitalMealCard to request an order
  const handleRequestOrder = (restaurantId) => {
    // Set a unique request object to trigger the useEffect in RestozPage
    setOrderRequest({ restaurantId, timestamp: Date.now() });
  };

  // Callback for RestozPage to confirm it has handled the order request
  const handleOrderRequestProcessed = () => {
    setOrderRequest(null);
  };

  // A placeholder for your toast notification system
  const showToast = (message, type) => {
    console.log(`Toast: ${message} (${type})`);
  };

  return (
    <div>
      {/* The DigitalMealCard displays subscriptions and can request an order */}
      <DigitalMealCard subscriptions={Object.values(subscriptions)} onOrder={handleRequestOrder} />

      {/* RestozPage receives all the state and handlers it needs to function */}
      <RestozPage
        showToast={showToast}
        subscriptions={subscriptions}
        onNewSubscription={handleNewSubscription}
        orderRequest={orderRequest}
        onOrderRequestProcessed={handleOrderRequestProcessed}
      />
    </div>
  );
};

export default StudentDashboard;