import React from 'react';
import { AnimatePresence } from 'framer-motion';

import AndroidPromptModal from './modals/AndroidPromptModal';
import EnhancedPaymentModal from './modals/EnhancedPaymentModal';
import PaymentSuccessModal from './modals/PaymentSuccessModal';
import UnlockCardModal from './modals/UnlockCardModal';
import WalletExchangeModal from './modals/WalletExchangeModal';
import ShareMealModal from './modals/ShareMealModal';
import PlanDetailsModal from './modals/PlanDetailsModal';
import OrderModal from './modals/OrderModal';

const Modals = ({
  showAndroidPrompt, handleDownloadApp, handleContinueWeb,
  showEnhancedPayment, paymentDefaultAmount, handlePaymentComplete, setShowEnhancedPayment, paymentProcessing, setPaymentProcessing,
  showPaymentSuccess, lastPaymentAmount, handlePaymentSuccessClose,
  showUnlockModal, handleUnlockSuccess, handleUnlockCancel,
  showExchangeModal, wallets, handleWalletExchange, setShowExchangeModal,
  showShareModal, selectedSharePlan, handleShareMeal, setShowShareModal, setSelectedSharePlan,
  showPlanDetails, selectedPlanDetails, setShowPlanDetails, setSelectedPlanDetails, handleUseMeal,
  showOrderModal, selectedRestaurant, handleOrderSubmit, setShowOrderModal,
  selectedPlan, planQty, setPlanQty, orderProcessing
}) => {
  
  const orderTotalPrice = selectedRestaurant?.priceInfo[selectedPlan] * planQty;

  const handleOrderConfirmed = () => {
    handleOrderSubmit({
      restaurant: selectedRestaurant,
      plan: selectedPlan,
      quantity: planQty,
      totalPrice: orderTotalPrice,
    });
  };

  return (
    <AnimatePresence>
      {showAndroidPrompt && <AndroidPromptModal onDownload={handleDownloadApp} onContinue={handleContinueWeb} />}
      
      {showEnhancedPayment && <EnhancedPaymentModal defaultAmount={paymentDefaultAmount} onPay={handlePaymentComplete} onClose={() => setShowEnhancedPayment(false)} processing={paymentProcessing} setProcessing={setPaymentProcessing} />}
      
      {showPaymentSuccess && <PaymentSuccessModal amount={lastPaymentAmount} onClose={handlePaymentSuccessClose} />}
      
      {showUnlockModal && <UnlockCardModal onSuccess={handleUnlockSuccess} onCancel={handleUnlockCancel} />}
      
      {showExchangeModal && <WalletExchangeModal wallets={wallets} onExchange={handleWalletExchange} onClose={() => setShowExchangeModal(false)} onBuyIgifu={() => setShowEnhancedPayment(true)} />}
      
      {showShareModal && selectedSharePlan && <ShareMealModal plan={selectedSharePlan} onShare={handleShareMeal} onClose={() => { setShowShareModal(false); setSelectedSharePlan(null); }} />}
      
      {showPlanDetails && selectedPlanDetails && <PlanDetailsModal plan={selectedPlanDetails} onClose={() => { setShowPlanDetails(false); setSelectedPlanDetails(null); }} onUseMeal={handleUseMeal} />}

      {showOrderModal && selectedRestaurant && (
        <OrderModal
          isOpen={showOrderModal}
          onRequestClose={() => setShowOrderModal(false)}
          restaurant={selectedRestaurant}
          plan={selectedPlan}
          qty={planQty}
          setQty={setPlanQty}
          totalPrice={orderTotalPrice}
          onSubmit={handleOrderConfirmed}
          processing={orderProcessing}
        />
      )}
    </AnimatePresence>
  );
};

export default Modals;